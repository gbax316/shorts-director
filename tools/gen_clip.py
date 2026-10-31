#!/usr/bin/env python3
"""
gen_clip.py — AI video clips via kie.ai (default) or the DIRECT fal.ai queue API (channel shorts).

Model-agnostic BY DESIGN: the model id is just a string, so
swapping models is a --model flag, never a code change. Extra model-specific inputs pass
through with --set key=value. Saves the mp4 + a sidecar .json (model, payload, request id)
for reproducibility.

Provider: --provider kie|fal, else CLIP_PROVIDER in .env, else kie.
  kie  model id from https://kie.ai/market (e.g. bytedance/seedance-2); default KIE_VIDEO_MODEL
       in .env, deliberately no code default because kie.ai renames and retires models.
       Input field names differ per model (seedance-2: first_frame_url / last_frame_url,
       v1-pro: image_url), so read the model's docs page. A --set value of @path/to/file
       uploads that local file to kie.ai and sends its url (kie deletes uploads after 24h).
       Needs KIE_API_KEY. Prices: https://kie.ai/pricing (not the fal tables in IDEAS.md).
  fal  the original path below, unchanged.
  --aspect none   omit aspect_ratio (some image-to-video models reject it)

Usage:
  python tools/gen_clip.py --prompt "..." --out shorts/ch-1-rate-limiting/assets/hook.mp4
  python tools/gen_clip.py --model fal-ai/kling-video/v2.5-turbo/pro/text-to-video \\
      --prompt "..." --set duration=5 --out clip.mp4
  python tools/gen_clip.py --model <image-to-video-model> --prompt "..." \\
      --set image_url=https://... --out clip.mp4          # reference/first-frame models

  --model     fal model id (default: fal-ai/veo3.1/fast — change freely; browse fal.ai/models)
  --prompt    text prompt (sent as "prompt")
  --aspect    aspect_ratio (default 9:16)
  --set k=v   any extra payload field, repeatable (numbers/bools auto-parsed; JSON accepted)
  --timeout   seconds to wait (default 900)
  --dry-run   print the payload, no API call

Needs FAL_KEY in .env (https://fal.ai/dashboard/keys). Costs are per-model on fal's pricing
page — check before generating; state the cost when proposing a clip in a video plan.
"""
import json
import os
import sys
import time
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_MODEL = "fal-ai/veo3.1/fast"
QUEUE = "https://queue.fal.run"
KIE_BASE = "https://api.kie.ai"
KIE_UPLOAD = "https://kieai.redpandaai.co/api/file-stream-upload"


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


def get_arg(args, name, default=None):
    return args[args.index(name) + 1] if name in args else default


def parse_val(v):
    try:
        return json.loads(v)
    except (ValueError, json.JSONDecodeError):
        return v


def req_json(url, key, body=None, method=None):
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(url, data=data, method=method,
                               headers={"Authorization": f"Key {key}",
                                        "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(r, timeout=120) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        sys.exit(f"fal API error {e.code} at {url}:\n{e.read().decode()[:800]}")


def find_video_url(obj):
    """Walk any response schema for the first video-looking url."""
    if isinstance(obj, dict):
        u = obj.get("url")
        if isinstance(u, str) and (".mp4" in u or "video" in obj.get("content_type", "")):
            return u
        for v in obj.values():
            found = find_video_url(v)
            if found:
                return found
    elif isinstance(obj, list):
        for v in obj:
            found = find_video_url(v)
            if found:
                return found
    return None


def kie_req(path, key, body=None):
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(f"{KIE_BASE}{path}", data=data,
                               headers={"Authorization": f"Bearer {key}",
                                        "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(r, timeout=120) as resp:
            res = json.load(resp)
    except urllib.error.HTTPError as e:
        sys.exit(f"kie API error {e.code} at {path}:\n{e.read().decode()[:800]}")
    if res.get("code") != 200:
        sys.exit(f"kie API error {res.get('code')} at {path}: {res.get('msg')}")
    return res.get("data") or {}


def kie_upload(path, key):
    """Multipart upload of one local file; returns its public url (lives 24h)."""
    boundary = f"----genclip{int(time.time() * 1000)}"
    name = os.path.basename(path)
    with open(path, "rb") as f:
        blob = f.read()
    parts = []
    for field, val in (("uploadPath", "faceless-shorts"), ("fileName", name)):
        parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{field}"\r\n\r\n{val}\r\n'.encode())
    parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="{name}"\r\n'
                 f"Content-Type: application/octet-stream\r\n\r\n".encode() + blob + b"\r\n")
    parts.append(f"--{boundary}--\r\n".encode())
    r = urllib.request.Request(KIE_UPLOAD, data=b"".join(parts),
                               headers={"Authorization": f"Bearer {key}",
                                        "Content-Type": f"multipart/form-data; boundary={boundary}"})
    try:
        with urllib.request.urlopen(r, timeout=300) as resp:
            res = json.load(resp)
    except urllib.error.HTTPError as e:
        sys.exit(f"kie upload error {e.code} for {path}:\n{e.read().decode()[:800]}")
    url = (res.get("data") or {}).get("downloadUrl")
    if not url:
        sys.exit(f"kie upload returned no url for {path}: {json.dumps(res)[:400]}")
    return url


def local_ref(v):
    """'@path' -> absolute path of an existing local file, else None."""
    if not (isinstance(v, str) and v.startswith("@")):
        return None
    p = v[1:] if os.path.isabs(v[1:]) else os.path.join(ROOT, v[1:])
    if not os.path.exists(p):
        sys.exit(f"local file not found: {v[1:]}")
    return p


def gen_kie(model, payload, out, timeout, key):
    for k, v in payload.items():
        p = local_ref(v)
        if p:
            payload[k] = kie_upload(p, key)
            print(f"uploaded {v[1:]} -> {k}")

    task_id = kie_req("/api/v1/jobs/createTask", key, {"model": model, "input": payload}).get("taskId")
    if not task_id:
        sys.exit("kie returned no taskId")
    print(f"queued: {task_id}")

    t0 = time.time()
    last = ""
    while True:
        d = kie_req(f"/api/v1/jobs/recordInfo?taskId={task_id}", key)
        s = d.get("state", "?")
        if s != last:
            print(f"  {s}  (+{int(time.time()-t0)}s)")
            last = s
        if s == "success":
            break
        if s == "fail":
            sys.exit(f"generation failed: {d.get('failMsg') or d.get('failCode')}")
        if time.time() - t0 > timeout:
            sys.exit(f"timeout after {int(timeout)}s (task {task_id} may still finish on kie.ai)")
        time.sleep(5)

    urls = json.loads(d.get("resultJson") or "{}").get("resultUrls") or []
    if not urls:
        sys.exit("no video url in response:\n" + json.dumps(d)[:800])
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    urllib.request.urlretrieve(urls[0], out)
    print(f"video -> {os.path.relpath(out, ROOT)}  ({os.path.getsize(out)//1024}KB)"
          + (f"  {d['creditsConsumed']} credits" if d.get("creditsConsumed") else ""))
    return {"provider": "kie", "task_id": task_id, "source_url": urls[0],
            "credits": d.get("creditsConsumed")}


def main():
    args = sys.argv[1:]
    env = load_env()
    provider = get_arg(args, "--provider", env.get("CLIP_PROVIDER", "kie")).strip()
    default_model = env.get("KIE_VIDEO_MODEL", "").strip() if provider == "kie" else DEFAULT_MODEL
    model = get_arg(args, "--model", default_model)
    prompt = get_arg(args, "--prompt")
    out = get_arg(args, "--out")
    aspect = get_arg(args, "--aspect", "9:16")
    timeout = float(get_arg(args, "--timeout", "900"))
    dry = "--dry-run" in args

    if provider not in ("kie", "fal"):
        sys.exit(f"unknown --provider {provider} (kie or fal)")
    if not prompt or not out:
        sys.exit("need --prompt and --out (see file header)")
    if not model:
        sys.exit("no model: pass --model or set KIE_VIDEO_MODEL in .env, spelled as on https://kie.ai/market")

    payload = {"prompt": prompt}
    if aspect != "none":
        payload["aspect_ratio"] = aspect
    for i, a in enumerate(args):
        if a == "--set":
            k, _, v = args[i + 1].partition("=")
            payload[k] = parse_val(v)

    print(f"provider = {provider}")
    print(f"model = {model}")
    print("payload =", json.dumps(payload, indent=2)[:600])
    if dry:
        for v in payload.values():
            if local_ref(v):
                print(f"  would upload {v[1:]}")
        print("[dry-run] no API call.")
        return

    if provider == "kie":
        key = env.get("KIE_API_KEY", "").strip()
        if not key:
            sys.exit("KIE_API_KEY not set (environment or .env; key at https://kie.ai/api-key)")
        meta = gen_kie(model, payload, out, timeout, key)
        sidecar = os.path.splitext(out)[0] + ".json"
        with open(sidecar, "w", encoding="utf-8") as f:
            json.dump({"model": model, "payload": payload, **meta,
                       "created": time.strftime("%Y-%m-%dT%H:%M:%S")},
                      f, indent=2, ensure_ascii=False)
            f.write("\n")
        print(f"meta  -> {os.path.relpath(sidecar, ROOT)}")
        return

    key = env.get("FAL_KEY", "").strip()
    if not key:
        sys.exit("FAL_KEY not set in .env (get one at https://fal.ai/dashboard/keys)")

    sub = req_json(f"{QUEUE}/{model}", key, body=payload)
    status_url = sub.get("status_url") or f"{QUEUE}/{model}/requests/{sub['request_id']}/status"
    response_url = sub.get("response_url") or f"{QUEUE}/{model}/requests/{sub['request_id']}"
    print(f"queued: {sub.get('request_id')}")

    t0 = time.time()
    last = ""
    while True:
        st = req_json(f"{status_url}?logs=1", key)
        s = st.get("status", "?")
        if s != last:
            print(f"  {s}  (+{int(time.time()-t0)}s)")
            last = s
        if s == "COMPLETED":
            break
        if s in ("FAILED", "ERROR", "CANCELLED"):
            sys.exit(f"generation {s}: {json.dumps(st)[:800]}")
        if time.time() - t0 > timeout:
            sys.exit(f"timeout after {int(timeout)}s (request {sub.get('request_id')} may still finish; "
                     f"re-poll {response_url})")
        time.sleep(5)

    result = req_json(response_url, key)
    url = find_video_url(result)
    if not url:
        sys.exit("no video url in response:\n" + json.dumps(result)[:800])

    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    urllib.request.urlretrieve(url, out)
    print(f"video -> {os.path.relpath(out, ROOT)}  ({os.path.getsize(out)//1024}KB)")

    sidecar = os.path.splitext(out)[0] + ".json"
    with open(sidecar, "w", encoding="utf-8") as f:
        json.dump({"model": model, "payload": payload, "request_id": sub.get("request_id"),
                   "source_url": url, "created": time.strftime("%Y-%m-%dT%H:%M:%S")},
                  f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"meta  -> {os.path.relpath(sidecar, ROOT)}")


if __name__ == "__main__":
    main()
