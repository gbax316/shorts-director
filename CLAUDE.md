# CLAUDE.md: shorts director

**Start every new short with the `shorts-director` skill** (`.claude/skills/shorts-director/SKILL.md`). It runs the writers' room, voice, animatic, clips, mouths, sound, finish and the improve loop, and routes beats to the three engine tracks below. Identity and defaults are in `director.config.json`; every finished short is logged in `RUNS.md` and its lessons in `LESSONS.md`. Commit locally as work completes; push only when the owner asks.

The engine tracks it routes between:


A **faceless-shorts factory** driven by Claude Code. Three production tracks, one repo. The
right skill is picked automatically from the request:

| The user asks for | Skill | Pixels come from | Projects live in |
|---|---|---|---|
| "make a short about X" (default) | `/make-short` | 100% TSX (Remotion animation) | `shorts/short-N-<niche>/` |
| "make an AI video short", "blue-man video" | `/make-ai-short` | a fal video model (locked recurring character) | `ai-shorts/<series>/` |
| "vox style / documentary / explainer short" | `/make-vox` | layered paper-collage (AI images + cutouts) | `vox-shorts/vox-N-<topic>/` |

All three share the same backbone: a `beats.json` contract, ElevenLabs voice with word-exact
captions (`gen_voice.py`), frame-by-frame QA at phone scale, library-first SFX (`/suggest-sfx`),
optional music bed, loops where frame 0 == the last frame, no CTA outros. TSX crash rules live in
`/vidtsx-2d-generator`.

## Layout

```
tools/            Python tools: gen_voice, gen_sfx, gen_music, mix_sfx, mix_music, gen_chords,
                  gen_image, gen_clip, bakeoff_clip, cutout, capture_web
remotion/         the Remotion project: src/lib/ (shared + niche kits incl. collage.tsx),
                  src/shots/{short-N, ai-N, vox-N}/
media/            Remotion's public root: library/ (reusable: sfx, music, logos)
                  + projects/<proj>/ (media for ONE video, incl. committed AI clips & layers)
shorts/           TSX shorts: script.md, beats.json, sfx-plan.json each
ai-shorts/        generative shorts: + character.json (LOCKED reference), shot sidecars, IDEAS.md
vox-shorts/       collage shorts: + DESIGN.md (the visual language; read before any vox work)
brand.md          the style contract every skill reads (palette, motion, safe areas, SFX taste)
IDEAS.md          the TSX-shorts idea bank + niche ranking
.claude/skills/   make-short, make-ai-short, make-vox, vidtsx-2d-generator, suggest-sfx
```

## Conventions (hard rules)

- **Run everything from the repo root.** Tools resolve engine paths (media/library, catalogs)
  against their own location, but project paths (`shorts/...`) against the CWD.
- **Python:** any Python 3.10+; the core pipeline is stdlib-only. Only vox layer production
  needs extras: `pip install pillow rembg` (cutout.py) and `pip install playwright &&
  playwright install chromium` (capture_web.py). `ffmpeg`/`ffprobe` and `node`/`npx` on PATH.
- **API keys** live in `.env` at the repo root (copy `.env.example`). Never commit `.env`.
  ELEVENLABS_API_KEY = voice/SFX/music · FAL_KEY = AI clips + images · GEMINI_API_KEY = images
  · KIE_API_KEY = AI clips on kie.ai. Keys set as Windows user environment variables are read
  even by apps started before they were set (tools/userenv.py). Voice, model and clip provider
  defaults are settings in .env too, never code.
- **Registry is generated:** after adding/renaming a shot, `cd remotion && npm run gen`
  (frames.mjs/render-all.mjs do NOT run it themselves).
- **Media rules:** `media/library/` is for CROSS-VIDEO reusable assets only (each with a
  catalog). Anything generated FOR ONE video (story frames, AI clips, collage layers) goes in
  `media/projects/<proj>/`, referenced as `staticFile('projects/<proj>/x')`. Reuse before you
  generate: check the catalogs first.
- **Committed vs gitignored media:** AI-generated clips and collage layers in
  `media/projects/` ARE committed (paid, non-reproducible pixels). `*/voice/` and `*/output/`
  are gitignored everywhere (regenerable); `ai-shorts/*/shots/*.mp4` working copies too; the
  canonical clip lives in `media/projects/<name>/`.
- **Costs (ai-shorts only):** state the derived generation cost BEFORE spending it, and never
  regenerate a locked character from text (see /make-ai-short's iron rules).
- **QA is not optional:** render frames at phone scale and READ them before any full render.
- **Text check before the voice and before the render:** `python tools/check_text.py <project>
  --shot <the .tsx>` runs the spoken lines and on-screen strings through the style-ban scanner
  (`STYLE_SCAN` in .env). Fix every hard ban; it exits 1 while any remain.
- **Phone copy is the deliverable:** `python tools/export_phone.py <final.mp4>` re-encodes under
  `PHONE_MAX_MB` (30) so it can be sent to a phone.
- **Lessons land in `LESSONS.md`** at the end of every video: what went wrong or right, written so
  the next video avoids it, numbered and dated. Anything that changes how a skill works goes into
  the skill too, in general terms, never one video's details.

## One brand per checkout

This checkout is **Qodeup's** channel (own work). Everything brand-specific lives in a few files,
and nothing else names the brand:

| What | Where |
|---|---|
| Style contract (voice, palette, type, motion, delivery, SFX) | `brand.md` |
| The same values as code, plus the default ground and logo paths | `remotion/src/brand.ts` |
| Fonts | `remotion/src/fonts.ts` |
| Logo files | `media/library/logos/` |
| Voice, model, settings, keys | `.env` |
| Reference frames and their hook copy | `remotion/src/lib/brandSample.tsx` |

**Shorts for another company go in their own copy, never this one.** Their scripts, media and
voice stay out of Qodeup's repo, and Qodeup's stay out of theirs. To start one:

1. Clone this repo to `~/dev/clients/<client>/<client>-shorts` (or `~/dev/<project>` for another
   own brand). Keep push disabled on the upstream remote; give it the client's own remote if any.
2. Delete Qodeup's shorts and media from the copy (`shorts/`, `ai-shorts/`, `vox-shorts/` work,
   `media/projects/`), keeping the shared library (`media/library/sfx`, `music`).
3. Replace the six brand files above from the client's own site, logo and guidelines. Take hex
   values and fonts from their live site, not from memory.
4. Voice: a stock voice, or the client's own clone recorded with their written consent. Check the
   ElevenLabs plan carries commercial rights.
5. Rewrite the hook copy in `brandSample.tsx`, render `BrandSampleDay`, `BrandSampleNight` and
   `BrandKitDay` at frame 78, and get the client's eye on them before the first short.
6. Client rules apply: their material only with their agreement, no use in Qodeup marketing
   without their OK, and deliverables that do not show the tooling.
