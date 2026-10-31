#!/usr/bin/env python3
"""
gen_voice.py — ElevenLabs TTS voice track for a TSX short, driven by its beats.json.

Shorts-track voice step. Reads a short's beats.json (vo[] lines with estimated
start/end seconds), generates each line with ElevenLabs text-to-speech (per line, so a
single line can be re-rolled without re-billing the rest), time-fits any clip that
overflows its window (gentle atempo, capped), assembles one timed voice track, and
writes the ACTUAL line timings back into beats.json — the TSX captions retime from it.

LIBRARY-FIRST: generated lines are cached by (index, text-hash); unchanged lines are
never re-billed. --force regenerates everything.

Usage:
  python tools/gen_voice.py --beats shorts/short-1-chess/beats.json
  python tools/gen_voice.py --beats ... --mux remotion/out/Short1Chess.mp4   # + voiced preview
  python tools/gen_voice.py --beats ... --dry-run                            # plan only

Needs ELEVENLABS_API_KEY (environment or .env). ffmpeg/ffprobe on PATH.

Voice, model and settings resolve in this order, last wins:
  built-in defaults (premade "Liam", eleven_multilingual_v2)
  .env: ELEVENLABS_VOICE_ID, ELEVENLABS_MODEL, ELEVENLABS_VOICE_SETTINGS (JSON object),
        ELEVENLABS_TTS_FORMAT
  beats.json: "voice": {"id": ..., "model": ..., "settings": {...}}   (one short)
  --voice / --model
Changing any of them re-bills only the lines they change (they are part of the cache key).

DIALOGUE: a beats.json "cast" maps a speaker to a character.json path (its "voice" block is
used) or to an inline {"id", "model", "settings"} block; a vo line with "who": "<speaker>" is
voiced by that cast member, over the resolution above; a line's own "voice" block (model or
settings) goes over that. --voice / --model still win.
--pack GAP lays the lines end to end from their real lengths (GAP seconds between, a line's
own "gap" overrides) instead of fitting them into estimated windows; no line is sped up, and
format.durationSec grows if the voice runs past it.

LINE CHECK: after generating, every line is transcribed with Whisper and compared word for
word with what was sent. A DIFF is a flag for the ear, not a failure: Whisper mishears names
too. Transcripts are cached beside each clip. --no-check skips it; WHISPER_MODEL picks the
model (default small).
"""
import argparse
import difflib
import hashlib
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_VOICE = "TX3LPaxmHKxFdv7VOQHJ"  # ElevenLabs premade "Liam"
DEFAULT_MODEL = "eleven_multilingual_v2"
DEFAULT_SETTINGS = {"stability": 0.5, "similarity_boost": 0.75, "style": 0.3, "use_speaker_boost": True}
MAX_ATEMPO = 1.3  # never speed a line up more than 30%


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
    from userenv import windows_user_env  # keys set after this app started
    return {**env, **windows_user_env(), **os.environ}


def run(cmd):
    r = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    if r.returncode != 0:
        sys.exit(f"command failed: {' '.join(cmd)}\n{r.stdout}")
    return r.stdout


def probe_duration(path):
    out = run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
               "-of", "default=noprint_wrappers=1:nokey=1", path])
    return float(out.strip())


def resolve_voice(env, beats, args):
    """-> (voice_id, model, settings, output_format) per the order in the file header."""
    cfg = beats.get("voice") or {}
    settings = dict(DEFAULT_SETTINGS)
    if env.get("ELEVENLABS_VOICE_SETTINGS", "").strip():
        try:
            settings.update(json.loads(env["ELEVENLABS_VOICE_SETTINGS"]))
        except json.JSONDecodeError as e:
            sys.exit(f"ELEVENLABS_VOICE_SETTINGS is not valid JSON: {e}")
    settings.update(cfg.get("settings") or {})
    voice = args.voice or cfg.get("id") or env.get("ELEVENLABS_VOICE_ID", "").strip() or DEFAULT_VOICE
    model = args.model or cfg.get("model") or env.get("ELEVENLABS_MODEL", "").strip() or DEFAULT_MODEL
    fmt = env.get("ELEVENLABS_TTS_FORMAT", "").strip() or "mp3_44100_128"
    return voice, model, settings, fmt


def line_voice(base, beats, line, args):
    """The resolved voice for one vo line: the short's voice, then its speaker's cast entry."""
    voice, model, settings, fmt = base
    who = line.get("who")
    if who:
        entry = (beats.get("cast") or {}).get(who)
        if entry is None:
            sys.exit(f"vo line speaker {who!r} is not in beats.json \"cast\"")
        if isinstance(entry, str):
            entry = json.load(open(os.path.join(ROOT, entry), encoding="utf-8")).get("voice") or {}
        settings = {**settings, **(entry.get("settings") or {})}
        voice, model = entry.get("id") or voice, entry.get("model") or model
    own = line.get("voice") or {}  # one line's own model or settings, e.g. a picked audition take
    settings = {**settings, **(own.get("settings") or {})}
    return (args.voice or own.get("id") or voice, args.model or own.get("model") or model, settings, fmt)


def words_of(text):
    """Spoken words only: drop [audio tags], punctuation and case, so 'Hello, world!' == 'hello world'."""
    text = re.sub(r"\[[^\]]*\]", " ", text.lower().replace("’", "'"))
    return re.findall(r"[a-z0-9']+", text)


def check_lines(lines, model_name):
    """Transcribe each (index, sent_text, mp3) with Whisper; cache to <mp3>.heard.json.
    Returns [(index, sent_words, heard_words)] for lines that differ."""
    diffs, todo = [], []
    for i, sent, mp3 in lines:
        cache = mp3 + ".heard.json"
        if os.path.exists(cache):
            heard = json.load(open(cache, encoding="utf-8"))["text"]
            if words_of(heard) != words_of(sent):
                diffs.append((i, words_of(sent), words_of(heard)))
        else:
            todo.append((i, sent, mp3))
    if todo:
        try:
            import whisper
        except ImportError:
            print("  (line check skipped: openai-whisper is not installed; pip install openai-whisper)")
            return diffs
        print(f"checking {len(todo)} line(s) with Whisper {model_name}...")
        model = whisper.load_model(model_name)
        for i, sent, mp3 in todo:
            heard = model.transcribe(mp3, language="en", fp16=False)["text"].strip()
            with open(mp3 + ".heard.json", "w", encoding="utf-8") as f:
                json.dump({"model": model_name, "text": heard}, f, ensure_ascii=False)
            if words_of(heard) != words_of(sent):
                diffs.append((i, words_of(sent), words_of(heard)))
    return sorted(diffs)


def show_diff(sent, heard):
    out = []
    for op, a1, a2, b1, b2 in difflib.SequenceMatcher(a=sent, b=heard).get_opcodes():
        if op == "equal":
            out.append(" ".join(sent[a1:a2]))
        else:
            out.append(f"[{' '.join(sent[a1:a2]) or '+'} -> {' '.join(heard[b1:b2]) or '-'}]")
    return " ".join(out)


def tts_line(key, voice, model, settings, fmt, text, prev_text, next_text, out_path):
    """TTS with character-level timestamps -> writes the mp3 AND <out_path>.words.json
    (per-word start/end seconds in the RAW clip) so captions can sync exactly.

    `text` may contain eleven_v3 audio tags like [excited] — they steer delivery and are
    FILTERED out of the word map (never captioned). If the model rejects /with-timestamps,
    falls back to plain TTS with an empty word map (captions then use estimated timing)."""
    body = {"text": text, "model_id": model}
    if not model.startswith("eleven_v3"):
        # v3 rejects the classic settings block AND previous/next context stitching;
        # server defaults are right for it
        body["voice_settings"] = settings
        if prev_text:
            body["previous_text"] = prev_text
        if next_text:
            body["next_text"] = next_text

    import base64

    def call(url):
        req = urllib.request.Request(url, data=json.dumps(body).encode(),
                                     headers={"xi-api-key": key, "Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=180) as r:
            ctype = r.headers.get("Content-Type", "")
            raw = r.read()
        return json.loads(raw) if "json" in ctype else raw

    base = f"https://api.elevenlabs.io/v1/text-to-speech/{voice}"
    try:
        resp = call(f"{base}/with-timestamps?output_format={fmt}")
        audio = base64.b64decode(resp["audio_base64"])
        align = resp.get("alignment") or {}
        words = chars_to_words(align.get("characters", []),
                               align.get("character_start_times_seconds", []),
                               align.get("character_end_times_seconds", []))
    except urllib.error.HTTPError as e:
        detail = e.read().decode()[:500]
        if e.code in (400, 404, 422):  # model may not support timestamps — plain fallback
            print(f"    (with-timestamps not available: {e.code}; falling back to plain TTS)")
            try:
                audio = call(f"{base}?output_format={fmt}")
                words = []
            except urllib.error.HTTPError as e2:
                sys.exit(f"ElevenLabs TTS failed ({e2.code}) for: {text!r}\n{e2.read().decode()[:500]}")
        else:
            sys.exit(f"ElevenLabs TTS failed ({e.code}) for: {text!r}\n{detail}")

    # audio tags ([excited], [pause]…) are delivery directions, not spoken words
    words = [w for w in words if not (w["w"].startswith("[") or w["w"].endswith("]"))]
    with open(out_path, "wb") as f:
        f.write(audio)
    with open(out_path + ".words.json", "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False)


def chars_to_words(chars, starts, ends):
    """Collapse character alignment into [{w, start, end}] (whitespace-delimited)."""
    words, cur, w_start, w_end = [], "", None, None
    for ch, s, e in zip(chars, starts, ends):
        if ch.isspace():
            if cur:
                words.append({"w": cur, "start": round(w_start, 3), "end": round(w_end, 3)})
                cur, w_start = "", None
            continue
        if not cur:
            w_start = s
        cur += ch
        w_end = e
    if cur:
        words.append({"w": cur, "start": round(w_start, 3), "end": round(w_end, 3)})
    return words


def emit_ts(vo, path):
    """Write the generated VO (with exact word times) as a TS module the shot imports."""
    lines = ["// AUTO-GENERATED by tools/gen_voice.py — do not edit.",
             "// Word times are the REAL ElevenLabs alignment; captions sync exactly.",
             "import type { VoLine } from '../../lib/shorts';", "",
             "export const VO: VoLine[] = ["]
    for line in vo:
        esc = line["text"].replace("\\", "\\\\").replace("'", "\\'")
        ws = ", ".join(
            "{ w: '%s', start: %s, end: %s }" % (w["w"].replace("\\", "\\\\").replace("'", "\\'"), w["start"], w["end"])
            for w in line.get("words", []))
        lines.append(f"  {{ text: '{esc}', start: {line['start']}, end: {line['end']}, words: [{ws}] }},")
    lines += ["];", ""]
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--beats", required=True, help="path to the short's beats.json")
    ap.add_argument("--voice", help="voice id (overrides beats.json and .env)")
    ap.add_argument("--model", help="TTS model id (overrides beats.json and .env)")
    ap.add_argument("--mux", help="optional rendered mp4 to mux the voice onto (-voiced.mp4)")
    ap.add_argument("--emit-ts", help="write the VO (with exact word times) as a TS module, e.g. remotion/src/shots/short-2/vo.gen.ts")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--no-check", action="store_true", help="skip the Whisper line check")
    ap.add_argument("--force-line", type=int, action="append",
                    help="regenerate just this line index (repeatable), e.g. after a LINE CHECK flag")
    ap.add_argument("--pack", type=float, metavar="GAP",
                    help="lay lines end to end from their real lengths, GAP seconds apart (dialogue)")
    args = ap.parse_args()

    beats_path = os.path.abspath(args.beats)
    beats = json.load(open(beats_path, encoding="utf-8"))
    vo = beats["vo"]
    total = float(beats["format"]["durationSec"])
    vdir = os.path.join(os.path.dirname(beats_path), "voice")
    os.makedirs(vdir, exist_ok=True)

    env = load_env()
    key = env.get("ELEVENLABS_API_KEY")
    if not key and not args.dry_run:
        sys.exit("ELEVENLABS_API_KEY not found (environment or .env)")
    base = resolve_voice(env, beats, args)
    voices = list({json.dumps(v, sort_keys=True): v for v in (line_voice(base, beats, line, args) for line in vo)}.values())
    for v in voices:
        print(f"voice {v[0]} · model {v[1]} · {v[3]} · settings {json.dumps(v[2])}")

    fitted = []  # (path, start_sec, fitted_dur)
    sent = []    # (index, tts_text, raw mp3) for the line check
    cursor = float(vo[0]["start"]) if vo else 0.0  # --pack: where the next line begins
    print(f"{'line':4s} {'start':>6s} {'window':>6s} {'clip':>6s} {'tempo':>5s}  text")
    for i, line in enumerate(vo):
        voice, model, settings, fmt = line_voice(base, beats, line, args)
        if args.pack is not None:
            if i > 0:
                cursor += float(line.get("gap", args.pack))
            line["start"] = round(cursor, 2)
        start = float(line["start"])
        next_start = float(vo[i + 1]["start"]) if i + 1 < len(vo) else total - 0.3
        window = 999.0 if args.pack is not None else next_start - start - 0.05
        tts_text = line.get("tts", line["text"])  # optional tagged/phonetic variant for TTS
        sig = f"{voice}|{model}|{tts_text}"
        if (voice, model, settings, fmt) != (DEFAULT_VOICE, DEFAULT_MODEL, DEFAULT_SETTINGS, "mp3_44100_128"):
            sig += "|" + json.dumps(settings, sort_keys=True) + "|" + fmt  # defaults keep the old cache names
        h = hashlib.sha1(sig.encode()).hexdigest()[:8]
        raw = os.path.join(vdir, f"line-{i:02d}-{h}.mp3")
        fit = os.path.join(vdir, f"line-{i:02d}-{h}-fit.wav")

        if args.dry_run:
            print(f"{i:4d} {start:6.2f} {window:6.2f}      ?     ?  {tts_text}")
            continue

        redo = args.force or i in (args.force_line or [])
        if redo or not os.path.exists(raw) or not os.path.exists(raw + ".words.json"):
            prev_text = vo[i - 1].get("tts", vo[i - 1]["text"]) if i > 0 else None
            next_text = vo[i + 1].get("tts", vo[i + 1]["text"]) if i + 1 < len(vo) else None
            tts_line(key, voice, model, settings, fmt, tts_text, prev_text, next_text, raw)
            if os.path.exists(raw + ".heard.json"):
                os.remove(raw + ".heard.json")  # new take, new transcript
        sent.append((i, tts_text, raw))

        dur = probe_duration(raw)
        tempo = 1.0
        if dur > window:
            tempo = min(MAX_ATEMPO, dur / window)
        if redo or not os.path.exists(fit):
            run(["ffmpeg", "-y", "-v", "error", "-i", raw,
                 "-filter:a", f"atempo={tempo:.4f}", "-ar", "44100", "-ac", "2", fit])
        fdur = probe_duration(fit)
        overflow = " OVERFLOW" if fdur > window + 0.05 else ""
        print(f"{i:4d} {start:6.2f} {window:6.2f} {fdur:6.2f} {tempo:5.2f}  {line['text']}{overflow}")
        line["end"] = round(start + fdur, 2)
        # exact word times: raw alignment, scaled by the tempo fit, offset to global
        raw_words = json.load(open(raw + ".words.json", encoding="utf-8"))
        shown = line["text"].split()
        if line.get("tts") and len(shown) == len(raw_words):
            # a voice-only spelling ("Shegs", "thirteenth") still captions as written
            raw_words = [{**w, "w": s} for w, s in zip(raw_words, shown)]
        line["words"] = [{"w": w["w"],
                          "start": round(start + w["start"] / tempo, 3),
                          "end": round(start + w["end"] / tempo, 3)} for w in raw_words]
        fitted.append((fit, start, fdur))
        cursor = start + fdur

    if args.dry_run:
        return
    if args.pack is not None and cursor + 0.3 > total:
        total = round(cursor + 0.3, 2)
        beats["format"]["durationSec"] = total
        print(f"voice runs to {cursor:.2f}s; durationSec raised to {total}")

    if not args.no_check:
        diffs = check_lines(sent, env.get("WHISPER_MODEL", "").strip() or "small")
        if diffs:
            print(f"\nLINE CHECK: {len(diffs)} line(s) heard differently. Listen to these before anyone else does;")
            print("a name can be a mishearing, a dropped or added word usually is not. Re-roll one with --force-line N.")
            for i, s, hd in diffs:
                print(f"  line {i:2d}: {show_diff(s, hd)}")
        else:
            print(f"\nLINE CHECK: all {len(sent)} lines heard as written.")

    # assemble: delay each line to its start, sum (lines never overlap), pad to length
    voice_wav = os.path.join(vdir, "voice.wav")
    inputs, parts = [], []
    for j, (path, start, _d) in enumerate(fitted):
        inputs += ["-i", path]
        ms = int(round(start * 1000))
        parts.append(f"[{j}:a]adelay={ms}|{ms}[a{j}]")
    chain = "".join(f"[a{j}]" for j in range(len(fitted)))
    fc = ";".join(parts) + f";{chain}amix=inputs={len(fitted)}:normalize=0,apad,atrim=0:{total}," \
         f"loudnorm=I=-16:TP=-1.5:LRA=11[out]"
    run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", fc,
         "-map", "[out]", "-ar", "44100", "-ac", "2", voice_wav])
    print(f"voice track -> {os.path.relpath(voice_wav, ROOT)}")

    beats["voiceStatus"] = " ".join(sorted({f"elevenlabs:{v[0]}:{v[1]}" for v in voices}))
    json.dump(beats, open(beats_path, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print(f"actual line timings + word maps written back -> {os.path.relpath(beats_path, ROOT)}")

    if args.emit_ts:
        emit_ts(vo, rp := os.path.abspath(args.emit_ts))
        print(f"VO TS module -> {os.path.relpath(rp, ROOT)}")

    if args.mux:
        out = os.path.splitext(args.mux)[0] + "-voiced.mp4"
        run(["ffmpeg", "-y", "-v", "error", "-i", args.mux, "-i", voice_wav,
             "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
             "-t", str(total), out])
        print(f"voiced preview -> {os.path.relpath(out, ROOT)}")


if __name__ == "__main__":
    main()
