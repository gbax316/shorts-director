#!/usr/bin/env python3
"""
capture_passage.py — screenshot a web page around one passage and record where its lines sit.

Feeds the DocFocus effect (remotion/src/lib/effects/DocFocus.tsx): the camera pushes in on the
passage, the rest of the page blurs and dims, and a marker sweeps each line as it is read. Finds
the passage by its text, scrolls to it, takes a sharp phone-width screenshot of the area around it,
and writes a JSON sidecar with the image size and one rectangle per rendered line, in image pixels.

Usage (from the repo root):
  python tools/capture_passage.py --url https://qodeupafrica.com/build-with-ai/blueprint \
      --text "AI can build almost anything" --out media/projects/<short>/course-quote.png
  --width 430        CSS viewport width (430 is a large phone; 1280 for a desktop layout)
  --scale 2.5        device pixel ratio, for sharp text when the camera pushes in
  --context 700      CSS pixels of page kept above and below the passage
  --until "direct it."  optional: the passage ends at this text (default: the matched text only)
Writes <out>.png and <out>.json. Needs Playwright with Chromium (pip install playwright;
playwright install chromium). Only capture pages you may show: your own, or public pages quoted
with their source on screen.
"""
import argparse
import json
import os
import sys

sys.stdout.reconfigure(encoding="utf-8")

FIND = """
([needle, until]) => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let text = '';
  while (walker.nextNode()) { const n = walker.currentNode; nodes.push([n, text.length]); text += n.textContent; }
  const norm = (s) => s.replace(/\\s+/g, ' ');
  const flat = norm(text);
  // map positions in the collapsed text back to the raw text
  const map = []; let j = 0;
  for (let i = 0; i < text.length; i++) { if (/\\s/.test(text[i]) && i > 0 && /\\s/.test(text[i - 1])) continue; map[j++] = i; }
  const start = flat.indexOf(norm(needle));
  if (start < 0) return null;
  let end = start + norm(needle).length;
  if (until) { const u = flat.indexOf(norm(until), start); if (u >= 0) end = u + norm(until).length; }
  const at = (pos) => { const raw = map[pos]; let k = nodes.length - 1; while (k > 0 && nodes[k][1] > raw) k--; return [nodes[k][0], raw - nodes[k][1]]; };
  const r = document.createRange();
  const [sn, so] = at(start); const [en, eo] = at(end - 1);
  r.setStart(sn, so); r.setEnd(en, Math.min(eo + 1, en.textContent.length));
  const el = sn.parentElement; el.scrollIntoView({ block: 'center' });
  const rects = Array.from(r.getClientRects()).filter((q) => q.width > 2 && q.height > 2);
  // merge fragments on the same line
  const lines = [];
  for (const q of rects) {
    const l = lines.find((m) => Math.abs(m.y - q.y) < q.height * 0.5);
    if (l) { const x2 = Math.max(l.x + l.w, q.x + q.width); l.x = Math.min(l.x, q.x); l.w = x2 - l.x; l.h = Math.max(l.h, q.height); }
    else lines.push({ x: q.x, y: q.y, w: q.width, h: q.height });
  }
  return { lines: lines.map((l) => ({ ...l, y: l.y + window.scrollY })), scrollY: window.scrollY };
}
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", required=True)
    ap.add_argument("--text", required=True)
    ap.add_argument("--until")
    ap.add_argument("--out", required=True)
    ap.add_argument("--width", type=int, default=430)
    ap.add_argument("--scale", type=float, default=2.5)
    ap.add_argument("--context", type=int, default=700)
    a = ap.parse_args()
    from playwright.sync_api import sync_playwright
    out = os.path.splitext(a.out)[0]
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": a.width, "height": 932}, device_scale_factor=a.scale)
        page.goto(a.url, wait_until="networkidle", timeout=90000)
        page.wait_for_timeout(1500)
        found = page.evaluate(FIND, [a.text, a.until])
        if not found or not found["lines"]:
            sys.exit(f"could not find the text on the page: {a.text!r}")
        page.wait_for_timeout(800)
        top_line = min(l["y"] for l in found["lines"])
        bottom_line = max(l["y"] + l["h"] for l in found["lines"])
        full_h = page.evaluate("document.documentElement.scrollHeight")
        y0 = max(0, top_line - a.context)
        y1 = min(full_h, bottom_line + a.context)
        page.screenshot(path=out + ".png", full_page=True, clip={"x": 0, "y": y0, "width": a.width, "height": y1 - y0})
        browser.close()
    s = a.scale
    lines = [{"x": round(l["x"] * s), "y": round((l["y"] - y0) * s), "w": round(l["w"] * s), "h": round(l["h"] * s)} for l in found["lines"]]
    meta = {"url": a.url, "text": a.text, "until": a.until, "w": round(a.width * s), "h": round((y1 - y0) * s), "lines": lines}
    json.dump(meta, open(out + ".json", "w", encoding="utf-8"), indent=2)
    print(f"{out}.png ({meta['w']}x{meta['h']}) and {out}.json, {len(lines)} line(s)")


if __name__ == "__main__":
    main()
