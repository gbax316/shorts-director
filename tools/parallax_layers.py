#!/usr/bin/env python3
"""
parallax_layers.py — split a still into a foreground subject and a background for 2.5D parallax.

A slow pan across a flat still is so common it reads as stock. Moving the subject a little faster
than what is behind it gives the still depth instead. This cuts the subject out with rembg (the
same matting tools/cutout.py uses), keeps it full-frame so it lines up with the original, and
paints the subject out of a copy of the still so the background has something behind the subject
when the layers drift apart. The painted area is rough by design: the Parallax effect keeps the
drift small, so the foreground always covers most of it.

Usage (from the repo root):
  python tools/parallax_layers.py media/projects/<short>/<still>.jpg
  -> media/projects/<short>/<still>-fg.png (subject on transparency) and <still>-bg.jpg
  --grow 28   how far past the subject's edge the background is painted out, in pixels
Needs rembg, opencv-python, numpy, Pillow.
"""
import argparse
import os
import sys

import cv2
import numpy as np
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("still")
    ap.add_argument("--grow", type=int, default=28)
    a = ap.parse_args()
    from rembg import remove
    src = Image.open(a.still).convert("RGB")
    cut = remove(src)  # RGBA, same size as the still
    alpha = np.array(cut)[:, :, 3]
    stem = os.path.splitext(a.still)[0]
    cut.save(stem + "-fg.png")
    mask = (alpha > 24).astype(np.uint8) * 255
    mask = cv2.dilate(mask, np.ones((a.grow, a.grow), np.uint8))
    bgr = cv2.cvtColor(np.array(src), cv2.COLOR_RGB2BGR)
    filled = cv2.inpaint(bgr, mask, 9, cv2.INPAINT_TELEA)
    cv2.imwrite(stem + "-bg.jpg", filled, [cv2.IMWRITE_JPEG_QUALITY, 92])
    share = (alpha > 24).mean()
    print(f"{stem}-fg.png and {stem}-bg.jpg  (subject covers {share:.0%} of the frame)")
    if share < 0.03 or share > 0.7:
        print("  the subject is very small or very large; parallax may read weakly, check it by eye")


if __name__ == "__main__":
    main()
