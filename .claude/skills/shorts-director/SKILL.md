---
name: shorts-director
description: >-
  Directs a faceless vertical short from idea to finished, mastered file, and gets better with every run. Picks a format, writes the episode in a writers' room (three premises judged as the buyer), voices it, gates on an animatic, then decides beat by beat how each moment is made: drawn in code in Remotion, a cut-out from a generated still, a generated clip, or one of Hasan's engines. Modes: series, writers-room, produce, sound, finish, bakeoff, improve (the learning loop after every short). Formats so far: character skit with dialogue and synced mouths, photoreal mini documentary with sourced figures. Triggers on "make a short", "next episode", "make a video about X", "faceless video", "reel for this offer". Do NOT trigger for editing an existing video file, for a pure code-drawn explainer with no writers' room (make-short), or for collage (make-vox).
---

# Shorts director

A short is judged in two seconds by someone who owes it nothing. Everything in this skill exists so that the first cut you hand over is one the owner would post: the idea chosen from three, the words visible on screen as well as heard, no fault in the frame that they spot before you do, and a sound mix they can play on a phone in a danfo. Quality comes first. Cost is shown before every spend, never used as a ceiling.

The skill directs; the repo's engines do the work. Hasan Aboul Hasan's MIT engines (the Remotion kit, the clip and image tools, the niche libraries, the collage camera) and the tools added since (mouth_sync, the shared cards, the caption chunker, the checks) are render paths this skill picks between, beat by beat, rather than one track per video.

## Before anything: read the config and the bible

Identity lives in config, never in the skill. Read `director.config.json` at the repo root for the brand, the corner mark, the people a film may name, link tagging, house rules, the providers and their prices, and the mastering target. Visual identity (colours, fonts, logo) is `remotion/src/brand.ts` and `remotion/src/fonts.ts`. If the short belongs to a series, read its bible in `ai-shorts/series/<series>/BIBLE.md` before writing a line; if it is a new channel or cast, the series mode writes one first. Then read the last few entries of `RUNS.md` and `LESSONS.md`, because the faults of the last run are the cheapest ones to avoid in this one.

## The modes

| Mode | Its job | Read |
|---|---|---|
| series | the bible for a recurring cast or a channel style | `modes/series.md` |
| writers-room | three divergent premises judged as the buyer, then the script | `modes/writers-room.md` |
| produce | voice, animatic, stills, clips, mouths, composition | `modes/produce.md` |
| sound | beds, cues, the mix and mastering | `modes/sound.md` |
| finish | the master, the phone copy, the text check, the posting pack | `modes/finish.md` |
| bakeoff | trying models against each other before one becomes the default | `modes/bakeoff.md` |
| improve | after every short: score the run, land the lessons, propose skill changes | `modes/improve.md` |

A new short runs them in order: series (only if the bible is missing), writers-room, produce, sound, finish, improve. The owner can enter at any mode by name, and a request that clearly sits in one mode (a voice re-take, a caption fix, a new hook) goes straight there.

**The fast lane.** When the series bible exists, the format is proven and the engines are known, skip nothing but shorten everything: one premise pass instead of a long one, stills reused from the series where they fit, and the animatic shown at half size. The checks never shorten. The fast lane is about fewer rounds, not fewer gates.

## The gates that hold in every run

These are where the owner's eye goes, in order, and where the work stops until they answer. Each one is cheap to change at and expensive to change after.

1. **The premise.** Three, written and judged as the buyer, with a pick and the reason. Nothing is voiced before one is chosen.
2. **The voice.** Lines in the owner's words where they gave them. For anything in pidgin or a local name, auditions they choose by ear (`references/voice.md`). A picked take is seated exactly, never re-generated.
3. **The animatic.** Stills on the real voice timeline with the code-drawn gags, captions and red tags where clips will go. No clip is generated before the animatic is approved.
4. **The spend.** Every generation step states its credits or dollars first (`references/stills-and-clips.md`), and the total is reported after.
5. **The cut.** The owner watches the rough cut before mastering, and the finished file before anything is posted.

Between the gates, check your own work the way `references/qa.md` describes, so the owner's eye is spent on taste and never on a fault a scan could have caught.

## Formats

A format brings its own grammar (how the beats run), its own visual world and its own default render paths. The ones proven so far each have a reference:

- `references/formats/skit.md`: a recurring cast in dialogue (proved by Akpos and Segs, episodes 1 and 2)
- `references/formats/documentary.md`: a narrator over photoreal scenes with sourced figures (proved by Qodeup mini documentary 1)

Hasan's formats stay available as engines: code-drawn explainers through `make-short` and `vidtsx-2d-generator`, collage through `make-vox`. The director can route a whole short to one of them, or borrow a beat from one.

## When the requested format isn't proven yet

If the owner asks for a kind of short none of the formats covers (a listicle, a before-and-after, a talking-object, a news recap), say so plainly rather than forcing it into the nearest format; a skit grammar on a news recap produces something that feels off in a way they will notice. Offer two paths. The first is to set it up properly: run it as a proving run, and once it ships, write `references/formats/<name>.md` from what the run proved, through `os-skillify`, so the next one starts from a grammar instead of a guess. The second is to make it once with the closest format as scaffolding, with the gaps named, and save nothing. If the same new format comes up a second time, take the first path; a format that keeps being improvised never gets a grammar, and the skill quietly narrows what the owner asks it for.

## How it gets better

Every short ends in the improve mode. It scores the run against the outcomes in `references/outcomes.md`, logs it in `RUNS.md`, writes what was learned to `LESSONS.md`, and when a fault has now happened twice or a technique has proved itself, proposes the change to this skill in general terms, as a diff the owner approves. Git is the way back. That loop is the difference between a tool that was good on the day it was written and one that is better after every film.

## References

- `references/outcomes.md`: what the skill must produce, with numbers, how each is checked, and the loops that improve it
- `references/render-routing.md`: choosing, per beat, between code, a cut-out, a generated clip and Hasan's engines
- `references/voice.md`: voices, casting, auditions, pidgin and names, seating a picked take
- `references/stills-and-clips.md`: generating stills and clips, prompts that hold identity, re-rolls, prices
- `references/mouths.md`: redrawing mouths on generated clips with mouth_sync, including per-shot settings
- `references/facts.md`: the fact gate for anything stated as true on screen
- `references/qa.md`: the checks between gates, and what each one has caught before
- `references/formats/`: one file per proven format

## Related skills

- `make-short`, `vidtsx-2d-generator`: Hasan's code-drawn explainer track and its crash rules, used as a render path
- `make-vox`: Hasan's collage track
- `make-ai-short`: Hasan's generative track, whose clip discipline this skill carries forward
- `suggest-sfx`: sound cue auditions, called from the sound mode
- `os-writing` (Personal OS): hooks and captions for posting, called from the finish mode
- `os-skillify` (Personal OS): writing a new format reference after its proving run
