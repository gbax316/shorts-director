# Changelog

Versions of the shorts-director skill (`.claude/skills/shorts-director/`, `version` in its `SKILL.md`). Each release is tagged in git as `vX.Y.Z`. The improve mode adds the entries; the owner approves them.

How the number moves:
- **Patch (0.1.1):** a fix or a clearer rule that does not change what a run produces or what files it expects.
- **Minor (0.2.0):** a new format, mode, check or tool, or a change in how a run behaves (a new gate, a new default model).
- **Major (1.0.0):** a change that breaks existing shorts or series (a new `beats.json` or `character.json` shape, a renamed config field). 1.0.0 is also the release where the first posted shorts' audience numbers have set real baselines.

## 0.2.0 (1 November 2026)

- An effects library in `remotion/src/lib/effects/`: Checklist, Timeline, GlassWidgets, Spotlight, Orbit, SplitCompare, Documentary, Parallax, MapZoom. Each follows the shot's day or night ground, stays clear of the platform buttons and the caption band, and carries the source of any fact it shows. `EffectsGallery` shows them all.
- Automatic choice: the writers' room tags beats with the job the viewer needs, only when the picture and captions cannot carry it; produce picks from `references/effects.md` within a budget (about one beat in three, at most four kinds, both first guesses) and lists the picks with the animatic.
- An effects mode and a `/effects` command to preview, place or build an effect.
- Documentary stills move with 2.5D parallax by default (`tools/parallax_layers.py`), because a slow pan reads as stock.
- Editing rules from a sourced research pass: emotion first, J and L cuts, guide the eye, animate less.
- The run log records the effects each short used, so the library learns what earns its place.
- A fresh-eyes review shaped the selection rules (no job is the default; skits look inside their world first; "hub" folded into "list").

## 0.1.0 (1 November 2026)

First version, written from two proving runs (Akpos and Segs episode 2, Qodeup mini documentary 1) on top of Hasan Aboul Hasan's claude-faceless-shorts-creator engines.

- Seven modes: series, writers-room, produce, sound, finish, bakeoff, improve.
- Two proven formats: character skit, mini documentary.
- References for render routing, voice and pidgin auditions, stills and clips, mouths, the fact gate, the checks, and outcomes with their loops.
- Identity in `director.config.json`; the shared cards read the corner mark from it.
- New tools: `kie_image.py`, `seat_take.py`, `frame_scan.py`, `master.py` (two-pass mastering to the config's target).
- `RUNS.md` seeded with the three films made so far.
- A Hazmat pass applied (13 fixes).
