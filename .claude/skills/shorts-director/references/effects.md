# Effects: choosing what each beat shows

An effect is chosen for the job a beat needs, never for itself. The owner should not have to name effects; the writers' room says what each beat has to do, and this file turns that into what appears on screen. `/effects <name>` exists for when they do want a specific one.

## What practice says, and how sure we are

From practitioners, with sources gathered on 1 November 2026: the picture should show the thing being said, and decoration does not count (Estelle Caswell on Vox's approach); emotion outranks everything else in a cut, and the edit guides where the eye goes next (Walter Murch's rule of six); clean a map of everything you do not need before you animate it (Johnny Harris); the Ken Burns pan is so common it reads as stock, while a still split into layers and moved in 2.5D reads as more alive; narration can lead or trail the picture across a cut (J and L cuts) to smooth it; when in doubt, animate less. Treated as folklore and not used: "a cut every three to five seconds", vendor retention percentages, secondhand rules from a leaked creator guide. No practitioner source was found for stat cards, counters, timelines or checklists, so those are this repo's own design, judged by how they land with the owner and the audience rather than by authority.

## Step 1: the writers' room tags each beat with its job

Every beat in the script's table gets one job, or none. A beat with no job gets no effect; it is carried by the picture and the voice. The jobs describe what the viewer needs, so they hold across formats and topics:

| Job | The viewer needs to | Signals in the line |
|---|---|---|
| number | feel the size of one or two figures | a figure, a price, a percentage, a count |
| list | count what they get or what is wrong | three to six parallel items, "you get", "you need" |
| sequence | follow an order in time | dates, days, steps that happen one after another |
| compare | see two things side by side | before and after, them and us, old way and new |
| focus | look at one place in the frame | "this", "here", a detail inside a picture |
| place | know where | a city, a route, "across Nigeria", a distance |
| hub | see one thing lead to many | "it opens up", "everything starts with" |
| archive | believe it happened, or feel a period | a past event, a real photo, a year |
| screen | read what is on a phone or computer | a search, a message, an app, a site |
| reveal | get a payoff they were waiting for | the answer, the result, the twist |
| tone | feel a mood shift | a turn in the story, a joke landing, a warning |

This list can grow. When a beat's job is none of these, say so in the premises file and name the new job; if it recurs, add it here.

## Step 2: produce picks an effect for each tagged beat

| Job | Built effects | When none fits |
|---|---|---|
| number | `GlassWidgets` (one to three figures with sources), the figure cards in documentary 1 | a single figure as large kinetic type |
| list | `Checklist` | numbered cards |
| sequence | `Timeline` | steps with arrows |
| compare | `SplitCompare` | a before and after wipe |
| focus | `Spotlight` | a push-in on the detail |
| place | the night map in documentary 1; the real-map engine in `remotion/src/lib/map.tsx` | a captioned still with a place tag |
| hub | `Orbit`, the doors in documentary 1 | the doors |
| archive | `Documentary` (pan, grain, date stamp, lower third) | a plain still with a date tag |
| screen | the pinned screens and the phone search in `remotion/src/shots/doc-1/screens.tsx` and episode 2 | a phone mock in code |
| reveal | timing, not an effect: a hard cut, a pause in the bed, a sound hit | |
| tone | sound and pacing, not an effect | |

Components live in `remotion/src/lib/effects/` (one file each, props for words and timing, brand colours and fonts from `brand.ts` and `fonts.ts`). Each component's own header comment says what it is for. `EffectsGallery` (in `remotion/src/shots/effects-gallery/`) shows every built effect for four seconds.

## Step 3: restraint and fit

These keep a short from turning into a demo reel:
- **One effect on screen at a time.** Two effects competing for the eye cancel each other out.
- **Few kinds per short.** A 40-second short rarely needs more than three or four different effects; repeating one effect for the same kind of beat is consistency, not laziness.
- **Not twice in a row**, unless the beats are deliberately parallel.
- **Format first.** A skit prefers effects that live inside its world (a calendar slamming down, a sign flipping, a counter on the wall) over interface overlays; a documentary can use overlays freely. Match the series bible's look.
- **The viewer can read it in the time it is up.** About a second per line of text at a phone's size, plus the time to arrive. If it does not fit, cut words, not time.
- **Sources stay attached.** Any figure an effect shows carries its source line.

## Step 4: show the picks

The animatic shows every effect in place, and the message that sends it lists each tagged beat with the effect chosen and why, in a line each, so the owner can swap one without reading code.

## Growing the library

When a beat's job has no built effect, or the owner asks for one by name, the effects mode builds it: a component in `remotion/src/lib/effects/`, an entry in the gallery, a row in the table above, a check by eye. Build an effect when a short needs it, not ahead of time; a library built ahead of need grows effects nobody's beats call for. An effect used in two shorts is proven; one never picked after several shorts is a candidate for removal.
