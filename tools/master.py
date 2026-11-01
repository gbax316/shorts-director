#!/usr/bin/env python3
"""
master.py — master a finished render to the loudness target in director.config.json, in two passes.

A single loudnorm pass lands near the target, not on it: the first two films measured -14.6 and
-14.9 LUFS with a -1.3 dB peak against a -14 LUFS, -1.5 dB true-peak target. This measures the
render first, then normalises with those measurements (linear when possible), copies the video
untouched, and prints the loudness and true peak of the result.

Usage (from the repo root):
  python tools/master.py ai-shorts/<short>/output/rough-1.mp4 --out ai-shorts/<short>/output/<name>-final.mp4
Needs ffmpeg on PATH.
"""
import argparse
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.stdout.reconfigure(encoding="utf-8")


def measure(path):
    """Integrated loudness and true peak of a file, from ebur128."""
    err = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    summary = err[err.rfind("Summary:"):]
    i = re.search(r"I:\s+(-?[\d.]+) LUFS", summary)
    p = re.search(r"Peak:\s+(-?[\d.]+) dBFS", summary)
    return float(i.group(1)) if i else None, float(p.group(1)) if p else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("render")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    cfg = json.load(open(os.path.join(ROOT, "director.config.json"), encoding="utf-8"))["audio"]
    I, TP, LRA = cfg["masterLufs"], cfg["truePeakDb"], cfg["lra"]
    first = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", a.render, "-af",
                            f"loudnorm=I={I}:TP={TP}:LRA={LRA}:print_format=json", "-f", "null", "-"],
                           capture_output=True, text=True).stderr
    m = json.loads(first[first.rfind("{"):first.rfind("}") + 1])
    af = (f"loudnorm=I={I}:TP={TP}:LRA={LRA}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
          f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,"
          f"alimiter=limit={10 ** ((TP - 0.2) / 20):.4f}:level=disabled")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", a.render, "-c:v", "copy", "-af", af, "-ar", "48000",
                    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", a.out], check=True)
    li, lp = measure(a.out)
    ok = li is not None and abs(li - I) <= 1.0 and lp is not None and lp <= TP
    print(f"{a.out}: {li} LUFS (target {I}), true peak {lp} dBFS (ceiling {TP}){'' if ok else '  OUTSIDE TARGET'}")


if __name__ == "__main__":
    main()
