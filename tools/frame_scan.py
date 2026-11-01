#!/usr/bin/env python3
"""
frame_scan.py — list the sudden jumps in a clip or a finished cut.

Differences each frame from the one before (downscaled, greyscale) and prints every frame whose
change is over FACTOR times the median. On a single generated clip, any spike is a cut, a fast
gesture or a morph with ghost features, so look at each one. On a whole cut, only planned cuts,
wipes and the end card should spike; anything else is a fault to find before the owner does.

Usage (from the repo root):
  python tools/frame_scan.py ai-shorts/<short>/shots/clip-02.mp4
  python tools/frame_scan.py ai-shorts/<short>/output/rough-1.mp4 --factor 8 --floor 6
  --factor 4 (default)   --floor 1.0 (ignore spikes below this mean difference)
Needs numpy and ffmpeg on PATH.
"""
import argparse
import subprocess
import sys

import numpy as np

sys.stdout.reconfigure(encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--factor", type=float, default=4.0)
    ap.add_argument("--floor", type=float, default=1.0)
    a = ap.parse_args()
    fps_txt = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=r_frame_rate",
                              "-of", "csv=p=0", a.video], capture_output=True, text=True, check=True).stdout.strip()
    num, den = fps_txt.splitlines()[0].strip(",").split("/")  # ffprobe can add a trailing comma or a second line
    fps = float(num) / float(den)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", a.video, "-vf", "scale=108:192,format=gray", "-f", "rawvideo", "-"],
                         capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, 192, 108).astype(int)
    d = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))
    med = float(np.median(d))
    spikes = [(k + 1, (k + 1) / fps, float(v)) for k, v in enumerate(d) if v > a.factor * med and v > a.floor]
    print(f"{a.video}: {len(fr)} frames at {fps:g} fps, median change {med:.2f}, {len(spikes)} spike(s)")
    for frame, t, v in spikes:
        print(f"  frame {frame:5d}  {t:7.2f} s  change {v:.1f}")


if __name__ == "__main__":
    main()
