#!/usr/bin/env python3
"""
check_text.py — run everything a viewer will read or hear through the style-ban scanner.

Collects, for one short: the spoken lines (beats.json vo[].text, not the phonetic `tts`
variants) and the on-screen strings in the shot's TSX (text=, title=, subtitle=, label=,
value= props and `text: '...'` fields). script.md is a production plan, not read or heard, so
it is skipped; comments and code are not scanned either. The collected text goes to the scanner named by
STYLE_SCAN (path to style-scan.py, in .env); without one, this says so and exits 2.

Usage:
  python tools/check_text.py shorts/short-2-math --shot remotion/src/shots/short-2/Short2Math.tsx
  python tools/check_text.py ai-shorts/blue-man            # spoken lines only

Exit code: 0 clean, 1 hard-ban hits, 2 scanner not configured.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import tempfile

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROP = re.compile(r"""\b(?:text|title|subtitle|label|value|kicker|caption)\s*[=:]\s*\{?\s*(['"`])((?:(?!\1).){2,}?)\1""")


def load_env():
    env = {}
    p = os.path.join(ROOT, ".env")
    if os.path.exists(p):
        for line in open(p, encoding="utf-8"):
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    return {**env, **os.environ}


def collect(project, shot):
    out = []  # (source, text)
    beats = os.path.join(project, "beats.json")
    if os.path.exists(beats):
        b = json.load(open(beats, encoding="utf-8"))
        for i, line in enumerate(b.get("vo", [])):
            out.append((f"beats.json vo[{i}]", line.get("text", "")))
        if b.get("title"):
            out.append(("beats.json title", b["title"]))
    if shot:
        for n, line in enumerate(open(shot, encoding="utf-8"), 1):
            code = re.sub(r"//.*$", "", line)  # line comments are code notes, not screen text
            for m in PROP.finditer(code):
                out.append((f"{os.path.basename(shot)}:{n}", m.group(2)))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project", help="the short's folder (holds beats.json / script.md)")
    ap.add_argument("--shot", help="the shot's .tsx, for on-screen strings")
    args = ap.parse_args()

    scanner = load_env().get("STYLE_SCAN", "").strip()
    if not scanner or not os.path.exists(scanner):
        print("STYLE_SCAN is not set (path to style-scan.py in .env); nothing was checked.")
        sys.exit(2)

    items = collect(args.project, args.shot)
    if not items:
        sys.exit(f"no text found in {args.project}")
    with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as f:
        for src, text in items:
            f.write(f"{text}\n")
        tmp = f.name
    print(f"checking {len(items)} piece(s) of text from {args.project}" + (f" and {args.shot}" if args.shot else ""))
    r = subprocess.run([sys.executable, scanner, "--no-structure", tmp], capture_output=True, text=True, encoding="utf-8")
    # map the scanner's line numbers back to where each piece came from
    report = r.stdout.replace(tmp, "text")
    for n, (src, _) in enumerate(items, 1):
        report = re.sub(rf"\btext:{n}\b", f"{src}", report)
    print(report.strip())
    os.unlink(tmp)
    sys.exit(1 if r.returncode else 0)


if __name__ == "__main__":
    main()
