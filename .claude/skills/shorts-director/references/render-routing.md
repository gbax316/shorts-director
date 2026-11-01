# Render routing: how each beat is made

The choice is made per beat, not per video. A single skit can use all of them, and should when each one is the right tool for its moment.

**Drawn in code (Remotion).** Anything the voice does not say and the eye should read: a phone screen with a search that finds nothing, a counter, a calendar slamming down, a sign that flips, a figure counting up with its source underneath, doors opening, a map lighting up, a laptop screen going from plan to finished site. Code is exact, free to change, never drifts, and can be re-timed in seconds when the voice changes. Screens that sit inside a photo are pinned to the blank screen in the still with a perspective transform (`Pinned` in `remotion/src/shots/doc-1/screens.tsx`). Shared pieces live in `remotion/src/lib/skit/` (props, rig, cards) and `remotion/src/lib/shorts.tsx` (captions, progress bar, easing).

**A cut-out from a generated still.** A character pose cut from its background (`tools/cutout.py`) and moved in code: sliding in, breathing, chewing. Right for a beat where a character is present but not acting, at a fraction of a clip's cost, and it never morphs. Erase stray lines left by the cut before using it.

**Extras.** Background people who walk through a scene are generated in the series style in two poses (stride and passing) and swapped every few frames so they step instead of sliding. Flat coloured silhouettes look wrong next to drawn characters; the owner said so in episode 2.

**A generated clip.** Acting: an eyebrow, a lean, a laugh, a person typing and pressing publish. Only where movement of a character carries the beat. Every clip starts from a still the owner has seen, is checked frame by frame, and gets mouths redrawn if anyone speaks in it (`mouths.md`).

**A held frame.** A long line over a scene that has just had a clip: hold the clip's last frame, run it through mouth_sync, and let the code-drawn gags carry the movement. Bodies still for ten seconds or more can feel stiff; a slow breath on the held frame is the cheap fix if the owner asks.

**The engine tracks.** A whole beat or short in code-drawn explainer style (`make-short`, with `vidtsx-2d-generator`'s niche libraries for chess, maths, maps, orbits, terminals and browsers) or collage (`make-vox`). Borrow them when a beat is an explanation rather than a moment.

When in doubt, ask what the viewer's eye is supposed to land on. If it is a piece of information, draw it in code. If it is a feeling on a face, generate it. If it is presence, cut it out.
