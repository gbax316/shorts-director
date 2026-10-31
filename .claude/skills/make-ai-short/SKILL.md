---
name: make-ai-short
description: Build a GENERATIVE-pixels vertical short (1080×1920, ~35-40s) end-to-end — a recurring locked character animated by a fal video model (Seedance 1.5 Pro default) under a philosophical/story VO, composited in Remotion with word-synced captions, SFX audition, seamless frame-0==last-frame loop. Use when the user wants to "make an AI video short", "make an ai short", "make a blue-man video", or any short where the pixels come from a VIDEO MODEL — not TSX animation (that is make-short) and not layered collage (that is make-vox). Defers model choice re-litigating to ai-shorts/IDEAS.md, TSX crash rules to vidtsx-2d-generator, SFX taste to suggest-sfx + brand §7.
---

# make-ai-short — generative shorts, end to end

The pixels come from a video model; Remotion only composites clips + captions. Proven on
blue-man #1 "The Door". Sibling of `/make-short` (100% TSX) — same discipline, plus three
gates TSX never needed: **cost stated before generating**, **character locked from
character.json**, **loop pinned via end-frame conditioning**.

Run everything from the repo root. Needs `FAL_KEY` (clips + images) and `ELEVENLABS_API_KEY`
(voice) in `.env`.

## The three iron rules

1. **NEVER generate a character from text twice.** `ai-shorts/<char>/character.json` +
   `character.png` is the locked reference. Every still that needs the character is
   `gen_image.py --ref character.png`; every clip is image-to-video from a frame that already
   contains him. If a character sheet doesn't exist yet, making ONE (and getting the user's
   eye on it) is its own step before anything else.
2. **STATE THE COST BEFORE SPENDING IT.** Derived, not quoted: Seedance 1080p audio-off =
   `h×w×24×dur/1024` tokens × $1.2/1M ≈ **$0.0583/s** (fal pricing API validated 2026-07-14 —
   see ai-shorts/IDEAS.md for the full table + the Wan/Veo-Lite traps). Always
   `generate_audio:false` — voice is ElevenLabs, sound is our SFX pipeline.
3. **Loop by CONSTRAINT, not luck.** Shot 1's true frame 0 (extracted from the clip, not the
   prompt image) is the loop target. The final shot passes it as `end_image_url`
   (Seedance/Kling), and the composition settles onto that exact still over the last ~10
   frames (`LoopSettle` pattern in `remotion/src/shots/ai-1/Ai1Door.tsx`).

## Artifact contract

```
ai-shorts/<name>/
  script.md · beats.json      — same contract as /make-short (vo[] with real word times)
  character.json              — THE LOCKED REFERENCE (+ video_model block = the picked model)
  shots/NN-slug.png           — per-shot START frame (gen_image.py --ref character.png [--ref scene])
  shots/NN-slug.json          — gen_clip sidecar (model, payload, request id)
  shots/upload-urls.json      — fal storage urls (uploads are reusable across re-rolls)
  voice/ · sfx-plan.json · output/                                          [voice/output gitignored]
remotion/src/shots/ai-N/      — composition + vo.gen.ts
media/projects/<name>/        — THE clip copies for staticFile() (committed — pixels are
                                not reproducible; shots/*.mp4 working copies are gitignored)
```

## Order of operations (voice before pixels)

1. **Script** — script.md + beats.json. Hook composed at frame 0; thesis should WANT the loop
   (blue-man #1: "arrival is a myth" → ending = walking toward the same door). ~80-100 words,
   2.5-2.7 wps windows. **No engagement-CTA outro, ever** — end on the payoff, loop is the ending.
2. **Voice FIRST** — `python tools/gen_voice.py --beats ... --emit-ts remotion/src/shots/ai-N/vo.gen.ts`
   (voice and model from `.env`, or a beats.json `"voice"` block when a series wants a narrator
   such as George `JBFqnCBsd6RMkjVDRZzb` with eleven_v3 tags; act on the LINE CHECK flags as in
   make-short Stage 4 before any clip is generated). Real word times decide the
   shot windows; Seedance takes integer 4-12s durations, so round shot lengths UP from windows.
   **Dialogue (two or more characters):** beats.json `"cast"` maps each speaker to its
   `character.json` (whose `"voice"` block is used), each vo line names its speaker in `"who"`,
   and `--pack 0.3` lays the lines end to end from their real lengths instead of squeezing them
   into estimated windows. One voice per character lives in its character.json, nowhere else.
   **Mouths in dialogue:** the video model does not know who is speaking; it makes listeners
   talk, freezes speakers and stretches a laugh across the next sentence. After the clips, run
   `python tools/mouth_sync.py ai-shorts/<name>` (beats.json `"shots"` gives each clip its
   global start and length; each character.json `"mouth"` block gives side, radius, zone,
   style and `keep_above`). It erases the model's mouths and draws each character's own from
   the voice track's loudness. QA it the same way: both faces every half second against who is
   speaking. A change of action inside one line (laugh, then talk) is two clips, the second
   started from the first's frame at the cut.
3. **Start frames** — one per shot, `python tools/gen_image.py --model pro --aspect 9:16 --ref character.png`
   (+ the shot-1 scene still as a 2nd ref when a location/prop must match across shots).
   **QA every PNG before any video call** — this is where drift is cheap to fix.
   - Watch hands, clothing details, proportions — name them explicitly in the prompt on re-rolls.
   - **Geometry must be walkable** (the shot-6 lesson, cost 2 re-rolls): with an end-frame pin,
     the start frame must let the motion REACH the end state by walking forward — if the end
     frame's character is CLOSER to camera than the start's, the model spawns a clone instead.
     Start him larger/nearer than the end state so forward motion shrinks him into it.
4. **Clips** — state the total derived cost, then `python tools/gen_clip.py` per shot in parallel
   (`--set image_url=<fal storage url> --set 'duration="N"' --set resolution=1080p
   --set generate_audio=false`, final shot `--set end_image_url=<frame0 url>`). Upload refs
   once via `bakeoff_clip.upload_ref`; keep urls in shots/upload-urls.json.
   The fal form above is this checkout's default (`CLIP_PROVIDER=fal`, `FAL_VIDEO_MODEL` in .env).
   **On kie.ai instead (`--provider kie`):** field names follow the kie model,
   not fal. For `bytedance/seedance-2`: `--aspect none --set first_frame_url=@ai-shorts/<name>/shots/NN-slug.png
   --set duration=N --set resolution=1080p --set generate_audio=false`, final shot
   `--set last_frame_url=@<frame0.png>`. `@path` uploads the local file (kie keeps it 24h, so
   upload-urls.json reuse only holds within a day). Cost: kie.ai/pricing, not the fal table;
   the run prints credits used. `bakeoff_clip.py` is still fal-only.
   Prompt every clip with: exact character phrase + "EXACTLY ONE character in the scene for
   the entire shot" (clones are the #1 failure) + camera move + "no morphing" + style line.
5. **Clip QA, frame by frame** — start/mid/end strip per clip + a side-by-side of the final
   clip's last frame vs the loop target. Re-roll failures (state the re-roll cost); a 5s
   1080p re-roll is ~$0.29 — cheap next to shipping a clone.
6. **Composition** — Sequences of `OffthreadVideo` over ONE timeline, ~8-frame crossfade
   underlaps (clips are ~1s longer than their windows — that's the slack), `Captions` +
   `ProgressBar` at root, `LoopSettle` dissolve at the tail. Copy final clips to
   `media/projects/<name>/`. `npm run gen`, frames.mjs at boundaries + heroes, READ every PNG,
   then render-all --scale=1 and mux voice.wav.
7. **SFX** — /suggest-sfx flow. **Gappy-VO calibration (blue-man #1):** cues in VO gaps get no
   masking and no duck — they need **~7-8 dB LESS** than the dense-narration table (gap
   whooshes -9..-13, not -3..-5). Verify with volumedetect RMS against a speech-mean
   reference; hero layer may kiss voice level once. Audition mix awaits **the user's ear**
   (hard gate).
8. **Save back** — catalog used_in, beats.json real timings (gen_voice writes them), sidecars
   committed, cost ledger in the final report.

## Done =

character consistent in every frame of every clip (frame-by-frame QA'd) · loop verified
(last frame vs frame 0 side-by-side) · captions on real word times · costs stated before each
spend and totalled after · SFX audition rendered, awaiting the user's ear · no CTA outro.
· `tools/check_text.py` clean on the spoken and on-screen text · phone copy made with
`tools/export_phone.py` · a dated entry in `LESSONS.md` (and the skill updated, in general terms,
if the lesson changes how it works).
