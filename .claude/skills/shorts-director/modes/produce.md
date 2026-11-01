# Produce

Voice before pixels, animatic before clips, the cheapest decision first. Every stage hands the next one something real: the voice gives the timeline, the stills give the animatic, the animatic tells you exactly which clips are worth paying for.

## 1. Voice

Generate with `python tools/gen_voice.py --beats ai-shorts/<short>/beats.json --pack 0.3` for dialogue or narration laid end to end from real lengths (a line's `gap` holds a beat of silence where the picture needs one). Read the Whisper line check it prints: a name or pidgin word heard differently is usually fine, a dropped or added word usually is not. Everything about casting, auditions, pidgin respellings and seating a picked take is in `../references/voice.md`. Emit the timeline the composition imports (`vo.gen.ts`), and copy the voice track into `media/projects/<short>/audio/voice.mp3`.

## 2. Stills

One per scene, generated with the series references so characters and places hold (`../references/stills-and-clips.md`). Check every still yourself before anything is built on it: identity, hands, the income-level rule, the house look. A still is where drift is cheapest to fix. A still that will sit under a clip later should be the frame the clip will start from.

## 3. The animatic

A Remotion composition in `remotion/src/shots/<short>/`, registered in the shot registry, with the stills on the voice timeline under a slow push, every code-drawn gag and figure in place, captions, the corner mark and end card from `remotion/src/lib/skit/cards.tsx`, the bed and cues roughed in, and red tags marking where generated clips will go. Render it at half size, check frames across the whole timeline, and send it with a costed clip plan. Nothing is generated until the owner approves it. Most of a short's revisions should happen here, where they cost nothing.

Choosing how each beat is made is `../references/render-routing.md`. In short: anything the voice does not say (a gag, a figure, a sign, a phone screen) is drawn in code; a still pose that should feel alive is a cut-out; acting is a generated clip.

## 4. Clips

State the credits first, generate in parallel, then check every clip frame by frame before it goes near the edit: a strip across its length, a frame-jump scan, identity against the references, and a close look at hands. Re-roll what fails and say what the re-roll costs; the prompt rules that have fixed failures are in `../references/stills-and-clips.md`.

## 5. Mouths

Characters who speak in a generated clip get their mouths redrawn from the voice with `tools/mouth_sync.py`, following `../references/mouths.md`. A long line over a still is spoken on the previous clip's last frame held and run through mouth_sync, so the cut into it never jumps. A laugh or other acting mouth is left as generated.

## 6. Composition

Clips go inside their scene's plate, so they ride the same slow push as the stills and the overlays pinned to them. The plate under a clip is the clip's own first frame; where a clip ends before its scene does, the plate is its last frame. Hard cuts in a dialogue skit (the scene never changes, and a crossfade shows the join). Captions coloured by speaker in dialogue. Render the rough cut at full size, run the frame-jump scan over the whole film (only planned cuts and wipes should spike), check frames around every seam, and send it to the owner before sound is finished.

Commit as you go: scripts, beats, sidecars, stills, the media copies of clips (pixels are not reproducible), compositions. Commits stay local until the owner asks for a push.
