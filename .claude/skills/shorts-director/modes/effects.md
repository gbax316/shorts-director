# Effects

Most of the time the director picks effects on its own, from each beat's job (`../references/effects.md`). This mode is for when the owner names one: `/effects checklist`, `/effects timeline for the class dates`, `/effects` on its own to see what exists.

**An effect that exists.** Show it: render its stretch of the gallery (`npx remotion render EffectsGallery <out>.mp4 --frames=<from>-<to>` in `remotion/`; each effect has four seconds, in the order of `EFFECTS_ORDER` in the gallery file) and send it. If the owner gave content or a short, place the effect on that beat in the short's composition with their words, re-render that stretch, and check it reads in the time it is up.

**An effect that does not exist yet.** Say so, describe in two lines what you would build and which beat job it serves, then build it the way the library is built: one file in `remotion/src/lib/effects/` exporting a component and its props type, placed inside a `Sequence`, timings in frames from its own start, colours and fonts from `brand.ts` and `fonts.ts`, any figure with its source line, a header comment saying what it is for. Export it from the library's `index.ts`, add a four-second stretch with real content to `EffectsGallery` (and its name to `EFFECTS_ORDER`, raising the gallery's duration), add its row to the table in `../references/effects.md`, typecheck, render its stretch, and look at frames from start, middle and end before showing it. A name the owner saw elsewhere may mean something specific; if the name alone does not say what it looks like, ask for a description or a reference before building.

**Borrowing designs.** The HyperFrames registry (installed as the `hyperframes-registry` skill, about 450 blocks) is a good place to look at how an effect could look. Rebuild what you borrow in Remotion with the repo's brand rather than mixing a second video engine into a film, so every effect shares one look and one timeline.

Commit each new effect with its gallery stretch and catalogue row together.
