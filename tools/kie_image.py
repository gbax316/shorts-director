#!/usr/bin/env python3
"""
kie_image.py — stills on kie.ai (nano-banana-pro by default), with optional reference images.

The still generator behind the Akpos and Segs episodes and the Qodeup documentaries. Reuses
gen_clip.py's kie upload and polling helpers. Saves the PNG plus a sidecar .json (model, prompt,
refs, task id, credits) beside it, so any still can be reproduced or re-rolled.

Usage (from the repo root):
  python tools/kie_image.py --prompt-file p.txt --out ai-shorts/<short>/shots/01-scene.png
  python tools/kie_image.py --prompt "..." --out x.png --aspect 9:16 --ref ai-shorts/<char>/character.png
  --aspect 9:16 (default) | 16:9 | 1:1 ...   --resolution 2K (default) | 1K | 4K
  --model nano-banana-pro (default; any kie image model id that takes image_input)
  --ref may repeat; each local file is uploaded to kie (kie keeps uploads for 24 hours)

Cost: shown on kie.ai/pricing; nano-banana-pro at 2K was 18 credits a still on 1 Nov 2026.
Needs KIE_API_KEY in .env or the environment.
"""
import argparse
import json
import os
import sys
import time
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
sys.stdout.reconfigure(encoding="utf-8")
import gen_clip as g  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prompt")
    ap.add_argument("--prompt-file")
    ap.add_argument("--out", required=True)
    ap.add_argument("--aspect", default="9:16")
    ap.add_argument("--resolution", default="2K")
    ap.add_argument("--model", default="nano-banana-pro")
    ap.add_argument("--ref", action="append", default=[])
    a = ap.parse_args()
    prompt = a.prompt or (open(a.prompt_file, encoding="utf-8").read().strip() if a.prompt_file else None)
    if not prompt:
        sys.exit("need --prompt or --prompt-file")
    key = g.load_env().get("KIE_API_KEY", "").strip()
    if not key:
        sys.exit("KIE_API_KEY not set (environment or .env)")
    urls = [g.kie_upload(os.path.join(ROOT, r), key) for r in a.ref]
    payload = {"prompt": prompt, "image_input": urls, "aspect_ratio": a.aspect,
               "resolution": a.resolution, "output_format": "png"}
    task = g.kie_req("/api/v1/jobs/createTask", key, {"model": a.model, "input": payload}).get("taskId")
    print("queued", task)
    t0 = time.time()
    while True:
        d = g.kie_req(f"/api/v1/jobs/recordInfo?taskId={task}", key)
        if d.get("state") == "success":
            break
        if d.get("state") == "fail":
            sys.exit(f"failed: {d.get('failMsg') or d.get('failCode')}")
        if time.time() - t0 > 600:
            sys.exit(f"timeout (task {task} may still finish on kie.ai)")
        time.sleep(5)
    src = json.loads(d.get("resultJson") or "{}").get("resultUrls")[0]
    out_abs = os.path.join(ROOT, a.out)
    os.makedirs(os.path.dirname(out_abs), exist_ok=True)
    urllib.request.urlretrieve(src, out_abs)
    meta = {"model": f"{a.model} (kie.ai)", "prompt": prompt, "aspect_ratio": a.aspect,
            "resolution": a.resolution, "refs": a.ref, "task_id": task,
            "credits": d.get("creditsConsumed"), "created": time.strftime("%Y-%m-%dT%H:%M:%S")}
    json.dump(meta, open(os.path.splitext(out_abs)[0] + ".json", "w", encoding="utf-8"), indent=2)
    print(f"-> {a.out}  {int(time.time() - t0)}s  credits={d.get('creditsConsumed')}")


if __name__ == "__main__":
    main()
