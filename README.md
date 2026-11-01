# Shorts director

**A faceless-shorts director you run with [Claude Code](https://claude.com/claude-code). It picks a format, writes the episode in a writers' room, and decides beat by beat how each moment is made: drawn in code, cut out from a generated still, or generated as a clip. It gets better with every short it makes.**

Ask Claude for a short ("make the next Akpos and Segs episode", "make a mini documentary about X") and the `shorts-director` skill in `.claude/skills/shorts-director/` runs it:

1. **Writers' room:** three divergent premises, each judged as the buyer, and a pick with its reason. You choose.
2. **Voice:** ElevenLabs, with auditions you pick by ear for pidgin and names, seated exactly.
3. **Animatic:** stills on the real voice timeline with every gag drawn in code. Nothing is generated until you approve it.
4. **Clips and mouths:** generated only where acting carries the beat, checked frame by frame, with mouths redrawn from the voice.
5. **Sound and finish:** library beds and cues, mastered in two passes to -14 LUFS, a phone copy, every word checked against the style rules.
6. **Effects, chosen by the beat:** the writers' room tags what each beat needs the viewer to get (a number, a list, a sequence, a comparison, a place); the director picks from an effects library within a budget, or `/effects <name>` builds and previews one. There are 28 so far, from checklists and rank reveals to quizzes, chat threads, document callouts, map zooms and parallax.
7. **Improve:** each run is scored in `RUNS.md`, its lessons land in `LESSONS.md`, and repeated faults become skill changes you approve. Releases are tagged and listed in `CHANGELOG.md`.

The cost of every generation step is stated before it runs.

**New here? Read [docs/USING.md](docs/USING.md):** setup, a short from start to finish with what you are asked at each step, what to say, the effects, costs, versions, other agents and troubleshooting.

## Formats

| Format | What it is | Proved by |
|---|---|---|
| Character skit | a recurring cast in dialogue, with synced mouths and code-drawn gags | Akpos and Segs, episodes 1 and 2 (`ai-shorts/akpos-segs-*`) |
| Mini documentary | a narrator over photoreal scenes, every figure sourced on screen | Qodeup mini documentary 1 (`ai-shorts/doc-1`) |
| Code-drawn explainer | 100% Remotion animation, no footage | the `make-short` engine and its examples in `shorts/` |
| Collage | paper-collage layers with a travelling camera | the `make-vox` engine and its example in `vox-shorts/` |

A new format is made once as a proving run, then written up as a format reference so the next one starts from a grammar.

## Works with other coding agents

The director is plain markdown plus ordinary Python and Node tools. Claude Code loads it from `.claude/skills/`; Codex, Cursor, Copilot and other agents read `AGENTS.md`, which points them to the same skill. Only the `/effects` shortcut is Claude-specific; elsewhere, ask for the effects mode in words.

## Make it yours

Brand, people, links, house rules, voices and provider prices live in `director.config.json`. Colours, fonts and logos live in `remotion/src/brand.ts` and `remotion/src/fonts.ts`. Change those, not the skill.

## Quickstart

Requirements: Claude Code, Node 18+, Python 3.10+, `ffmpeg` on PATH, and keys for the services you use: `ELEVENLABS_API_KEY` (voice, effects, music), `KIE_API_KEY` (stills and clips on kie.ai), optionally `FAL_KEY` and `GEMINI_API_KEY`. Put them in `.env` (copy `.env.example`) or your environment. `STYLE_SCAN` points `tools/check_text.py` at your style scanner. Cut-outs need `pip install pillow rembg`.

```bash
git clone https://github.com/gbax316/shorts-director
cd shorts-director
cp .env.example .env
cd remotion && npm install && npm run gen && cd ..
claude
```

Then ask for a short. To look at the compositions: `cd remotion && npm run studio`.

## Layout

```
.claude/skills/shorts-director/   the director: modes, references, formats
.claude/skills/                   the engine skills: make-short, make-ai-short, make-vox, vidtsx-2d-generator, suggest-sfx
director.config.json              identity, house rules, voices, providers and prices
tools/                            voice, stills, clips, mouths, cut-outs, sound, mastering, checks
remotion/                         the Remotion project: shared kits in src/lib/, one folder per video in src/shots/
media/library/                    reusable sound effects and music beds
media/projects/                   media for one video, including committed clips
ai-shorts/                        generated-pixel shorts and the series bibles (ai-shorts/series/)
shorts/, vox-shorts/              engine examples: code-drawn explainers and collage
RUNS.md, LESSONS.md, CHANGELOG.md the learning loop's records
```

## Credits and licence

MIT, see [LICENSE](LICENSE). The engine tracks (the Remotion kit, the voice, image, clip and sound tools, and the explainer, generative and collage skills with their examples) began as Hasan Aboul Hasan's [claude-faceless-shorts-creator](https://github.com/hassancs91/claude-faceless-shorts-creator), also MIT. Bundled sound and example media were generated with ElevenLabs, fal, Gemini and kie.ai; provenance is in `media/library/*/catalog.json` and the per-shot `.json` sidecars.
