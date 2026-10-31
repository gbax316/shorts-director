#!/usr/bin/env python3
"""
export_phone.py — re-encode a finished short so it can be sent to a phone (and uploaded fast).

Raw Remotion renders run past 30 MB, the size most phone sharing refuses. This re-encodes at
CRF 23 (same picture to the eye), moves the index to the front for streaming, and if the result
is still over the limit steps the CRF up by 2 until it fits or reaches 31.

Usage:
  python tools/export_phone.py remotion/out/Short2Math-voiced.mp4            # -> ...-phone.mp4
  python tools/export_phone.py in.mp4 --out shorts/short-2-math/output/final.mp4 --max-mb 16

PHONE_MAX_MB in .env changes the default limit (30). ffmpeg on PATH.
"""
import argparse
import os
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def env_max_mb():
    p = os.path.join(ROOT, ".env")
    if os.path.exists(p):
        for line in open(p, encoding="utf-8"):
            if line.strip().startswith("PHONE_MAX_MB="):
                return float(line.split("=", 1)[1].strip())
    return float(os.environ.get("PHONE_MAX_MB", 30))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--out")
    ap.add_argument("--max-mb", type=float, default=None)
    args = ap.parse_args()
    max_mb = args.max_mb or env_max_mb()
    out = args.out or os.path.splitext(args.src)[0] + "-phone.mp4"
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)

    src_mb = os.path.getsize(args.src) / 1e6
    for crf in range(23, 32, 2):
        r = subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", args.src,
                            "-c:v", "libx264", "-crf", str(crf), "-preset", "slow", "-pix_fmt", "yuv420p",
                            "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out],
                           capture_output=True, text=True)
        if r.returncode != 0:
            sys.exit(f"ffmpeg failed:\n{r.stderr[-800:]}")
        mb = os.path.getsize(out) / 1e6
        print(f"CRF {crf}: {mb:.1f} MB (from {src_mb:.1f} MB)")
        if mb <= max_mb:
            print(f"phone copy -> {os.path.relpath(out, os.getcwd())}")
            return
    sys.exit(f"still over {max_mb} MB at CRF 31; shorten the video or lower the resolution")


if __name__ == "__main__":
    main()
