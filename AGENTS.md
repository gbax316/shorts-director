# AGENTS.md: shorts director

For any coding agent working in this repo (Codex, Cursor, Copilot, Gemini CLI, Windsurf, Claude Code and others that read this file).

This repo directs faceless vertical shorts from idea to a finished, mastered file. The director is written as a skill: plain markdown instructions plus ordinary Python and Node tools, so any agent can run it.

## Start here

To make a short, or to do any part of one, read `.claude/skills/shorts-director/SKILL.md` first and follow it. It routes to a mode in `.claude/skills/shorts-director/modes/` (series, writers-room, produce, sound, finish, bakeoff, effects, improve), and each mode names the references it needs in `.claude/skills/shorts-director/references/`. The folder is called `.claude` because Claude Code loads skills from there automatically; for every other agent it is just the place the instructions live.

`/effects <name>` is a Claude Code command. In any other agent, ask for the same thing in words ("run the effects mode: build a quiz effect for the class dates") and follow `modes/effects.md`.

The owner-facing guide to running it is `docs/USING.md`; read it when you need to explain a step or answer a question about how the director works.

## What must hold

- Identity (brand, people, links, house rules, voices, provider prices) comes from `director.config.json`; visual identity from `remotion/src/brand.ts` and `remotion/src/fonts.ts`. Never hard-code a name, brand or link anywhere else.
- State the cost of every generation step (stills, clips, voice, music) before running it.
- Everything a viewer reads or hears passes the style rules in the config's `houseRules`, checked with `tools/check_text.py`.
- Every finished short is logged in `RUNS.md`, its lessons in `LESSONS.md`, and skill releases in `CHANGELOG.md`, as the improve mode describes.
- Commit locally as work completes. Push only when the owner asks.

## Setup

Keys in `.env` (copy `.env.example`) or the environment: `ELEVENLABS_API_KEY`, `KIE_API_KEY`, optionally `FAL_KEY` and `GEMINI_API_KEY`; `STYLE_SCAN` for the style scanner. Then `cd remotion && npm install && npm run gen`. Python tools run from the repo root (`python tools/<tool>.py --help`). Remotion compositions live in `remotion/src/shots/`; the effects library in `remotion/src/lib/effects/`, previewed in the `EffectsGallery` composition.

The engine skills in `.claude/skills/` (make-short, make-ai-short, make-vox, vidtsx-2d-generator, suggest-sfx) are render paths the director calls; read them when a mode points you there.
