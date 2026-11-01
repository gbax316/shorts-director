#!/usr/bin/env python3
"""
seat_take.py — use an audition take the owner picked by ear as a line's voice, exactly.

Re-generating "the same text" gives a different read from the one approved. This copies the
picked audio to the cache name gen_voice.py computes for that line (voice, model, tts text,
settings), and writes its word map from ElevenLabs forced alignment, so captions stay exact.
Then re-run gen_voice.py (with --pack for dialogue) and the track is rebuilt from the seated take.

Usage (from the repo root):
  python tools/seat_take.py --beats ai-shorts/<short>/beats.json --line 4 --take ai-shorts/<short>/voice/audition/line4-segs-d.mp3
  --text "..."   replace what the captions show for that line (a new wording the owner picked)
  --tts "..."    what the voice said, when it differs from --text (a respelling); omit to clear it
Needs ELEVENLABS_API_KEY in .env or the environment.
"""
import argparse
import hashlib
import json
import os
import shutil
import sys
import types
import urllib.request
import uuid

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
sys.stdout.reconfigure(encoding="utf-8")
import gen_voice as g  # noqa: E402


def align(key, mp3, text):
    b = uuid.uuid4().hex
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"text\"\r\n\r\n{text}\r\n"
            f"--{b}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"a.mp3\"\r\n"
            f"Content-Type: audio/mpeg\r\n\r\n").encode()
    body += open(mp3, "rb").read() + f"\r\n--{b}--\r\n".encode()
    req = urllib.request.Request("https://api.elevenlabs.io/v1/forced-alignment", data=body,
                                 headers={"xi-api-key": key, "Content-Type": f"multipart/form-data; boundary={b}"})
    r = json.loads(urllib.request.urlopen(req, timeout=180).read())
    ch = r["characters"]
    return g.chars_to_words([c["text"] for c in ch], [c["start"] for c in ch], [c["end"] for c in ch]), r.get("loss")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--beats", required=True)
    ap.add_argument("--line", type=int, required=True, help="index into beats.json vo[]")
    ap.add_argument("--take", required=True, help="the picked audition mp3")
    ap.add_argument("--text")
    ap.add_argument("--tts")
    a = ap.parse_args()
    beats_path = os.path.abspath(a.beats)
    beats = json.load(open(beats_path, encoding="utf-8"))
    line = beats["vo"][a.line]
    if a.text:
        line["text"] = a.text
    if a.tts:
        line["tts"] = a.tts
    else:
        line.pop("tts", None)
    env = g.load_env()
    key = env["ELEVENLABS_API_KEY"]
    base = g.resolve_voice(env, beats, types.SimpleNamespace(voice=None, model=None))
    voice, model, settings, fmt = g.line_voice(base, beats, line, types.SimpleNamespace(voice=None, model=None))
    tts_text = line.get("tts", line["text"])
    sig = f"{voice}|{model}|{tts_text}"
    if (voice, model, settings, fmt) != (g.DEFAULT_VOICE, g.DEFAULT_MODEL, g.DEFAULT_SETTINGS, "mp3_44100_128"):
        sig += "|" + json.dumps(settings, sort_keys=True) + "|" + fmt
    vdir = os.path.join(os.path.dirname(beats_path), "voice")
    os.makedirs(vdir, exist_ok=True)
    raw = os.path.join(vdir, f"line-{a.line:02d}-{hashlib.sha1(sig.encode()).hexdigest()[:8]}.mp3")
    shutil.copyfile(a.take, raw)
    for stale in (raw + ".heard.json", raw[:-4] + "-fit.wav"):
        if os.path.exists(stale):
            os.remove(stale)
    words, loss = align(key, raw, tts_text)
    json.dump(words, open(raw + ".words.json", "w", encoding="utf-8"), ensure_ascii=False)
    json.dump(beats, open(beats_path, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print(f"line {a.line}: {os.path.basename(a.take)} -> {os.path.relpath(raw, ROOT)}, {len(words)} words, alignment loss {loss}")
    print("now re-run tools/gen_voice.py for this short so the track is rebuilt from the seated take")


if __name__ == "__main__":
    main()
