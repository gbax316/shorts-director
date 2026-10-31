#!/usr/bin/env python3
"""
mouth_sync.py — redraw cartoon mouths on generated clips so they follow the voice.

Video models move mouths at random: the listener talks, the speaker freezes. This pass
tracks each character's round head in every frame, erases whatever mouth the model drew
(inpainted from the face around it, so shading survives) and draws the character's own
mouth: the speaker's opens and closes with the loudness of the voice track, everyone else's
stays shut.

Reads, for one short:
  beats.json        vo[] with "who", real start/end (gen_voice.py --pack), "cast" -> character.json
                    "shots": [{"clip": "shots/NN.mp4", "start": <global s>, "dur": <s used>,
                    "in": <s into the clip to start from> (optional),
                    "keep_above": {"<who>": <radii>} (optional, this shot only)}]
  voice/voice.wav   the assembled voice track
  character.json    "mouth": {"side": "left"|"right" (where the head sits in a two-shot),
                    "radius": px at 720 wide, "zone": [cx, cy, w, h] in head radii,
                    "keep_above": head radii below centre; shapes centred above it are never erased,
                    "style": "grin"|"small", "mood": {"<line index>": "flat"|"smile"}}

Writes shots/NN-mouth.mp4 beside each clip (same fps and size, no audio).

Usage:
  python tools/mouth_sync.py ai-shorts/akpos-segs-1-kiosk                # every shot
  python tools/mouth_sync.py ai-shorts/akpos-segs-1-kiosk --only 08      # one shot
  python tools/mouth_sync.py ... --debug                                 # draw the tracking
Needs opencv-python, numpy, ffmpeg on PATH.
"""
import argparse
import json
import os
import subprocess
import sys
import wave

import cv2
import numpy as np

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INK = (17, 17, 17)            # BGR outline, matches the flat black of the characters
TEETH = (250, 250, 250)
INSIDE = (40, 30, 95)         # dark red mouth interior (BGR)
TONGUE = (140, 120, 235)


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries",
                          "stream=width,height,r_frame_rate", "-of", "csv=p=0", path],
                         capture_output=True, text=True, check=True).stdout.strip().split(",")
    num, den = out[2].split("/")
    return int(out[0]), int(out[1]), float(num) / float(den)


def envelope(wav_path, fps):
    """RMS loudness per video frame of the whole voice track."""
    with wave.open(wav_path) as w:
        sr, ch, n = w.getframerate(), w.getnchannels(), w.getnframes()
        a = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32)
    if ch > 1:
        a = a.reshape(-1, ch).mean(1)
    hop = int(sr / fps)
    frames = len(a) // hop
    return np.sqrt(np.mean(a[: frames * hop].reshape(frames, hop) ** 2, axis=1)), fps


def speaking(vo, t):
    for i, line in enumerate(vo):
        if line["start"] - 0.02 <= t <= line["end"] + 0.05:
            return i, line.get("who")
    return None, None


def levels(vo, env, fps):
    """Mouth level per envelope frame (0 shut, 1 half, 2 open), normalised per line."""
    lv = np.zeros(len(env), dtype=int)
    for line in vo:
        a, b = int(line["start"] * fps), min(len(env), int(line["end"] * fps) + 1)
        seg = env[a:b]
        if not len(seg):
            continue
        ref = np.percentile(seg, 90) or 1.0
        x = seg / ref
        lv[a:b] = np.where(x > 0.55, 2, np.where(x > 0.2, 1, 0))
    for k in range(1, len(lv) - 1):  # no single-frame flicker
        if lv[k - 1] == lv[k + 1] != lv[k]:
            lv[k] = lv[k - 1]
    return lv


def find_heads(frame, cast):
    g = cv2.medianBlur(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY), 5)
    rmin = int(min(c["radius"] for c in cast.values()) * 0.7)
    rmax = int(max(c["radius"] for c in cast.values()) * 1.25)
    c = cv2.HoughCircles(g, cv2.HOUGH_GRADIENT, dp=1.2, minDist=120, param1=100, param2=35,
                         minRadius=rmin, maxRadius=rmax)
    return [] if c is None else [tuple(float(v) for v in x) for x in c[0]]


def is_head(frame, c):
    """A real head is mostly one pale colour inside and ringed by dark ink; a false circle in the
    street or the shelves is not."""
    x, y, r = c
    h, w = frame.shape[:2]
    disk = np.zeros((h, w), np.uint8)
    cv2.circle(disk, (int(x), int(y)), int(r * 0.8), 255, -1)
    if not disk.any():
        return False
    skin = skin_colour(frame, disk)
    px = frame[disk > 0].reshape(-1, 3).astype(int)
    if skin.min() < 150 or (np.abs(px - skin).sum(1) < 40).mean() < 0.45:
        return False
    a = np.linspace(0, 2 * np.pi, 72, endpoint=False)
    hits = 0
    for ang in a:  # dark ink on, or just inside, the circle
        for f in (0.97, 1.0, 1.03):
            px_, py_ = int(x + f * r * np.cos(ang)), int(y + f * r * np.sin(ang))
            if 0 <= px_ < w and 0 <= py_ < h and frame[py_, px_].max() < 90:
                hits += 1
                break
    return hits / len(a) > 0.58  # measured: real heads 0.67 and up (a cap hides some), false circles 0.42 at most


def track(frames, cast, w):
    """Per character, a smoothed (x, y, r) per frame, or None while the character is not in
    shot; carries the last good fix through short misses."""
    paths = {k: [] for k in cast}
    last, missed = {}, {k: 0 for k in cast}
    for f in frames:
        cands = find_heads(f, cast)
        for who, m in cast.items():
            want_left = m["side"] == "left"
            pool = [c for c in cands if (c[0] < w * 0.5) == want_left and 0.75 < c[2] / m["radius"] < 1.3
                    and is_head(f, c)]
            if who in last and pool:
                lx, ly, _ = last[who]
                pool = [min(pool, key=lambda c: (c[0] - lx) ** 2 + (c[1] - ly) ** 2)]
                if (pool[0][0] - lx) ** 2 + (pool[0][1] - ly) ** 2 > (m["radius"] * 0.8) ** 2:
                    pool = []  # a jump that far is a false circle, not the head
            if pool:
                last[who], missed[who] = pool[0], 0
            else:
                missed[who] += 1
                if missed[who] > 3:  # a held fix outlives the head when he leaves the shot
                    last.pop(who, None)
            paths[who].append(last.get(who))
    for who, p in paths.items():  # smooth the runs where he is in shot
        out = list(p)
        for i, v in enumerate(p):
            if v is None:
                continue
            win = [q for q in p[max(0, i - 2):i + 3] if q is not None]
            out[i] = tuple(np.median(np.array(win), axis=0))
        paths[who] = out
    return paths


def erase_mouth(frame, head, m):
    """Find the model's mouth and paint it out; returns where it was (or None).

    The mouth moves with the head turn, so it is not assumed. Thin face lines are broken first
    (an opening), so an eye and the mouth they join come apart. Shapes centred in the upper face
    (eyes, brows, a nose; "keep_above" in head radii) are protected whole. Below that, every
    shape is painted out except a big solid-black one, which is a hand or arm in front of the
    face, or the head outline when the tracking is a little off. The mouth's position is the
    centre of the largest shape painted out. A flat skin fill, not inpainting: inpainting drags
    nearby ink across the cheek."""
    x, y, r = head
    h, w = frame.shape[:2]
    disk = np.zeros((h, w), np.uint8)
    cv2.circle(disk, (int(x), int(y)), int(r * 0.9), 255, -1)
    skin = skin_colour(frame, disk)
    diff = np.abs(frame.astype(int) - skin).sum(2)
    ink = ((diff > 45) & (disk > 0)).astype(np.uint8)
    k = max(3, int(r * 0.05)) | 1
    parts = cv2.morphologyEx(ink, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    n, lab, stats, cent = cv2.connectedComponentsWithStats(parts, 8)
    black = frame.max(2) < 70
    keep_y = y + m["keep_above"] * r
    keep = np.zeros((h, w), bool)
    erase = np.zeros((h, w), bool)
    best, best_area = None, 0
    for i in range(1, n):
        area = stats[i, cv2.CC_STAT_AREA]
        comp = lab == i
        if cent[i][1] < keep_y:
            keep |= comp
            continue
        if area > 0.05 * r * r and black[comp].mean() > 0.85:
            continue  # a hand, an arm or the outline
        erase |= comp
        if area > best_area:
            best, best_area = i, area
    if best is None:
        return None
    near = cv2.dilate(erase.astype(np.uint8), np.ones((k + 4, k + 4), np.uint8)) > 0
    guard = cv2.dilate(keep.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    mask = (ink > 0) & near & ~guard
    mask = cv2.dilate(mask.astype(np.uint8) * 255, np.ones((3, 3), np.uint8), iterations=2) & disk
    mask &= ~(guard.astype(np.uint8) * 255)
    alpha = cv2.GaussianBlur(mask.astype(np.float32) / 255, (5, 5), 0)[..., None]
    frame[:] = (frame * (1 - alpha) + skin[None, None, :] * alpha).astype(np.uint8)
    return cent[best][0], cent[best][1]


def skin_colour(frame, disk):
    """The most common colour on the head: skin covers more of it than eyes, mouth or shading."""
    px = frame[disk > 0].reshape(-1, 3).astype(int)
    q = px // 12
    keys, inv, counts = np.unique(q, axis=0, return_inverse=True, return_counts=True)
    return px[inv.ravel() == counts.argmax()].mean(axis=0)


def bez(p0, c, p1, n=20):
    u = np.linspace(0, 1, n)[:, None]
    return (1 - u) ** 2 * np.array(p0) + 2 * (1 - u) * u * np.array(c) + u ** 2 * np.array(p1)


def draw_mouth(frame, cx, cy, r, m, level, mood):
    t = max(2, int(round(r * 0.045)))
    face_right = m["side"] == "left"   # the left character faces right
    s = 1 if face_right else -1
    if m["style"] == "grin":
        # corners rise toward the side he faces; the lower lip hangs lower the wider he opens
        L = (cx - s * r * 0.42, cy - r * 0.04)
        R = (cx + s * r * 0.44, cy - r * 0.14)
        upper = bez(L, (cx, cy - r * 0.02), R)
        drop = (0.52, 0.80, 1.05)[level]
        lower = bez(R, (cx + s * r * 0.04, cy + r * drop), L)
        outline = np.vstack([upper, lower]).astype(np.int32)
        thin = max(1, t // 2)
        if level == 0:   # his closed toothy grin: two rows of teeth
            cv2.fillPoly(frame, [outline], TEETH, cv2.LINE_AA)
            mid = bez(L, (cx, cy + r * 0.26), R)
            cv2.polylines(frame, [mid.astype(np.int32)], False, INK, thin, cv2.LINE_AA)
            for u in (0.22, 0.38, 0.54, 0.7):
                a = upper[int(u * (len(upper) - 1))]
                b = lower[int((1 - u) * (len(lower) - 1))]
                cv2.line(frame, tuple(a.astype(int)), tuple(b.astype(int)), INK, thin, cv2.LINE_AA)
        else:            # talking: dark mouth, a row of top teeth, tongue when wide
            cv2.fillPoly(frame, [outline], INSIDE, cv2.LINE_AA)
            if level == 2:
                tip = lower[len(lower) // 2]
                cv2.ellipse(frame, (int(tip[0]), int(tip[1] - r * 0.09)), (int(r * 0.2), int(r * 0.09)),
                            0, 180, 360, TONGUE, -1, cv2.LINE_AA)
            teeth_low = bez(L, (cx, cy + r * 0.2), R)
            band = np.vstack([upper, teeth_low[::-1]]).astype(np.int32)
            cv2.fillPoly(frame, [band], TEETH, cv2.LINE_AA)
            cv2.polylines(frame, [teeth_low.astype(np.int32)], False, INK, thin, cv2.LINE_AA)
            for u in (0.25, 0.42, 0.58, 0.75):
                a, b = upper[int(u * (len(upper) - 1))], teeth_low[int(u * (len(teeth_low) - 1))]
                cv2.line(frame, tuple(a.astype(int)), tuple(b.astype(int)), INK, thin, cv2.LINE_AA)
        cv2.polylines(frame, [outline], True, INK, t, cv2.LINE_AA)
    else:  # small mouth
        wd = r * 0.30
        if level == 0:
            bend = {"smile": 0.07, "flat": 0.0, "frown": -0.05}.get(mood, 0.07) * r
            pts = np.array([(cx - wd / 2 + wd * u, cy + bend * np.sin(np.pi * u)) for u in np.linspace(0, 1, 12)], np.int32)
            cv2.polylines(frame, [pts], False, INK, t, cv2.LINE_AA)
        else:
            ax, ay = int(wd * (0.42 if level == 1 else 0.5)), int(r * (0.08 if level == 1 else 0.15))
            cv2.ellipse(frame, (int(cx), int(cy + ay * 0.4)), (ax, ay), 0, 0, 360, INSIDE, -1, cv2.LINE_AA)
            if level == 2:
                cv2.ellipse(frame, (int(cx), int(cy + ay * 0.9)), (int(ax * 0.6), int(ay * 0.45)), 0, 180, 360, TONGUE, -1, cv2.LINE_AA)
            cv2.ellipse(frame, (int(cx), int(cy + ay * 0.4)), (ax, ay), 0, 0, 360, INK, t, cv2.LINE_AA)


def process(short, shot, vo, cast, lv, env_fps, debug):
    clip = os.path.join(short, shot["clip"])
    w, h, fps = probe(clip)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(shot.get("in", 0)), "-i", clip, "-t", str(shot["dur"]), "-f", "rawvideo",
                          "-pix_fmt", "bgr24", "-"], capture_output=True, check=True).stdout
    frames = [f.copy() for f in np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3)]
    paths = track(frames, cast, w)
    out = os.path.splitext(clip)[0] + "-mouth.mp4"
    enc = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{w}x{h}",
                            "-r", str(fps), "-i", "-", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", out],
                           stdin=subprocess.PIPE)
    talk = 0
    offset = {name: tuple(m["zone"][:2]) for name, m in cast.items()}  # mouth from head, in radii
    for k, f in enumerate(frames):
        t = shot["start"] + k / fps
        li, who = speaking(vo, t)
        e = min(len(lv) - 1, int(t * env_fps))
        for name, m in cast.items():
            if paths[name][k] is None:
                continue  # not in shot
            x, y, r = paths[name][k]
            if x - r < 0 or x + r > w or y - r < 0 or y + r > h:
                continue  # a head half out of frame: leave the model's mouth alone
            m = {**m, **({"keep_above": shot["keep_above"][name]} if name in shot.get("keep_above", {}) else {})}
            found = erase_mouth(f, (x, y, r), m)
            if found:
                ox, oy = (found[0] - x) / r, (found[1] - y) / r
                px, py = offset[name]
                if (ox - px) ** 2 + (oy - py) ** 2 < 0.35 ** 2:  # a jump that far is not the mouth
                    offset[name] = (px + 0.35 * (ox - px), py + 0.35 * (oy - py))
            cx, cy = x + offset[name][0] * r, y + offset[name][1] * r
            level = lv[e] if name == who else 0
            talk += level > 0
            mood = (m.get("mood") or {}).get(str(li), m.get("rest", "smile"))
            draw_mouth(f, cx, cy, r, m, level, mood)
            if debug:
                cv2.circle(f, (int(x), int(y)), int(r), (0, 0, 255), 1)
        enc.stdin.write(f.tobytes())
    enc.stdin.close()
    enc.wait()
    print(f"{shot['clip']}: {len(frames)} frames, mouth open on {talk} -> {os.path.relpath(out, ROOT)}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("short")
    ap.add_argument("--only", help="process the shot whose clip name starts with this")
    ap.add_argument("--debug", action="store_true")
    args = ap.parse_args()
    short = os.path.abspath(args.short)
    beats = json.load(open(os.path.join(short, "beats.json"), encoding="utf-8"))
    cast = {who: json.load(open(os.path.join(ROOT, p), encoding="utf-8"))["mouth"] for who, p in beats["cast"].items()}
    env, env_fps = envelope(os.path.join(short, "voice", "voice.wav"), 100)
    lv = levels(beats["vo"], env, env_fps)
    for shot in beats["shots"]:
        if args.only and not os.path.basename(shot["clip"]).startswith(args.only):
            continue
        process(short, shot, beats["vo"], cast, lv, env_fps, args.debug)


if __name__ == "__main__":
    main()
