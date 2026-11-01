# Effects: choosing what each beat shows

An effect is chosen for the job a beat needs, never for itself. The owner should not have to name effects; the writers' room says what each beat has to do, and this file turns that into what appears on screen. `/effects <name>` exists for when they do want a specific one.

## What practice says, and how sure we are

From practitioners, with sources gathered on 1 November 2026: the picture should show the thing being said, and decoration does not count (Estelle Caswell on Vox's approach); emotion outranks everything else in a cut, and the edit guides where the eye goes next (Walter Murch's rule of six); clean a map of everything you do not need before you animate it (Johnny Harris); the Ken Burns pan is so common it reads as stock, while a still split into layers and moved in 2.5D reads as more alive; narration can lead or trail the picture across a cut (J and L cuts) to smooth it; when in doubt, animate less. Treated as folklore and not used: "a cut every three to five seconds", vendor retention percentages, secondhand rules from a leaked creator guide. No practitioner source was found for stat cards, counters, timelines or checklists, so those are this repo's own design, judged by how they land with the owner and the audience rather than by authority.

## Step 1: the writers' room decides which beats need a job

No job is the default. A beat gets one only when its information cannot be carried by the picture and the captions on their own: a figure the viewer has to feel the size of, an order they have to follow, two things they have to hold side by side. A line the narrator reads out in full is already on screen in the captions; putting the same words in a panel is decoration by Caswell's test, so tag it only when the effect adds what the words cannot (the ticks, the order, the scale).

The jobs describe what the viewer needs, so they hold across formats and topics. The middle column is the evidence to look for, not a trigger: a line that mentions a city does not need a map unless where it is matters to the story.

| Job | The viewer needs to | Evidence in the beat |
|---|---|---|
| number | feel the size of one or two figures | the figure is the point of the line, not a passing detail |
| list | count what they get, need or lose | several parallel items, and the count or the completeness matters; a list with a centre (one idea leading to many) is still a list |
| sequence | follow an order in time | the order changes the meaning: dates, steps that depend on each other |
| compare | hold two things side by side | the line turns on a difference: before and after, them and us |
| focus | look at one place in the frame | the picture is busy and the line is about one detail in it |
| place | know where | where it happens matters to the story, not just to the setting |
| archive | believe it happened, or feel a period | a real past event or a year the viewer should feel |
| screen | read what is on a phone or computer | the action is on the screen: a search, a message, an app |
| quote | read a real line from a source, and see which part counts | the words are a quotation or the owner's own page |
| who | know who is speaking or who a person on screen is | a real named person appears (with their permission) |
| hook | stop scrolling in the first second or two | the opening beat; the claim or question the film will pay off |
| structure | know how far through a short built from parts they are | the short is a set of facts, steps or reasons, announced as such |
| engage | commit to a guess, answer a question, or send the film to someone | a real question with an answer the film gives, or a specific person it fits |
| reveal | get the payoff they were waiting for | the answer, the result, the twist |
| tone | feel a mood shift | a turn, a joke landing, a warning |
| transition | feel a change of time, place or energy | the cut jumps somewhere new, not just to the next angle |

This list can grow. When a beat's job is none of these, name the new job in the premises file; if it comes up again in a later short, add it here.

**A budget, as a first guess.** In a 40 to 60 second short, about one beat in three carries an effect, and at most four different effects appear. These numbers are guesses from two films; the run log's "effects used" line will move them.

## Step 2: produce picks the effect

| Job | In the library (`remotion/src/lib/effects/`) | Seen in a film, not yet in the library | When none fits |
|---|---|---|---|
| number | `Counter` (one figure that should land), `GlassWidgets` (two or three with sources), `Bars` (quantities to rank), `Receipt` (an offer's real value, line by line) | doc-1's figure cards (`Doc1Builders.tsx`) | the figure as large kinetic type |
| list | `Checklist`; `RankReveal` (a ranking, revealed from the bottom up); `Orbit` for a list with a centre | doc-1's doors | numbered cards |
| sequence | `Timeline` | | steps with arrows |
| compare | `SplitCompare` (two sides with points), `BeforeAfter` (one frame, two states, a slider) | | `Bars` |
| focus | `Spotlight` (dims the rest), `Annotate` (a hand-drawn circle and note, lighter), `PunchZoom` (a camera punch on the hit word) | | a push-in on the detail |
| place | `MapZoom` (real projection, cleaned map, pin) | doc-1's night map | a captioned still with a place tag |
| archive | `Documentary` (grain, date stamp, title; holds still) | | a plain still with a date tag |
| screen | `SearchBar`, `ChatThread`, `Notifications`, `SplitScreen` (the Kallaway split: who is talking in one half, what they mean in the other, the caption on the seam) | the pinned screens (`doc-1/screens.tsx`), episode 2's phone search | a phone mock in code |
| quote | `DocFocus` (the real page: the camera pushes in, the rest blurs and dims, the passage lifts and is marked line by line as it is read; capture with `tools/capture_passage.py`), `HighlightQuote` (the line set in type when the page itself is not worth showing) | | the line as kinetic type with its source |
| who | `LowerThird` | | a name tag in the corner |
| hook | `HookText` (the opening words slam in with the voice) | | the hook line as large type over the frame-0 picture |
| structure | `StepCounter` ("3 of 5", honest progress) | | |
| engage | `Quiz` (pause and guess, then the answer), `SharePrompt` (send it to a named kind of person, or answer a real question) | | |
| reveal | timing, not an effect: a hard cut, a pause in the bed, a sound hit; `PunchZoom` on the answer | | |
| tone | sound and pacing, not an effect | | |
| transition | `FlashCut` (a flash or a whip over a cut); a hard cut is still the default | | |

**Skits look inside their world first.** A skit's beats are better served by a prop in the scene than by an overlay: episode 2's calendar slamming down (a sequence), the LOST SALES counter on the wall (a number), the sign that flips (a reveal), all in `remotion/src/shots/ai-3/Ai3Customer.tsx`. Reach for a library overlay in a skit only when no prop in the world can carry the job.

**Stills move with depth, not a pan.** In a documentary, a still that holds the screen for more than a couple of seconds moves with `Parallax` (layers from `tools/parallax_layers.py`) rather than a slow push; the push stays for stills where the cut-out fails (a crowd, a skyline, a subject smaller than about a twentieth of the frame).

Every library effect follows the shot's day or night ground, stays inside the safe box (`FX_BOX` in `util.ts`: clear of the platform's buttons on the right and above the caption band) and carries the source of any fact it shows. Each component's header comment says what it is for. `EffectsGallery` (in `remotion/src/shots/effects-gallery/`) shows every library effect for four seconds.

## What viral faceless channels do, and what we leave out

From a research pass on 1 November 2026 (official evidence is thin; most of this is practitioner practice): the best-supported devices are an early value hook (TikTok's Creative Codes, citing Kantar's analysis of 3,500 ads: value in the first seconds), captions (TikTok says text overlays raise view time), a send or share prompt (Instagram's head named sends among the ranking signals in January 2025), loops that replay cleanly (YouTube has counted Shorts replays as views since March 2025) and countdown and payoff structure (curiosity-gap theory). Common but anecdotal: pattern interrupts every few seconds, chat-story and ranking formats, mid-video open loops ("but that is not the strange part"), which are fine only when the film pays them off.

Left out on purpose, because they cost trust a brand that sells a course cannot spare: fake progress bars (`StepCounter` is the honest version), hooks the film does not pay off, chats, posts or notifications presented as real when they are not (label them as illustrative, or use real ones with permission), unrelated gameplay filler in a split screen, invented urgency, and "comment YES" bait. Also left out: sameness. YouTube's July 2025 monetisation update targets mass-produced, repetitive content, so a channel's shorts must differ in substance, not just in words over the same template; the writers' room's three premises are the guard.

**Loops are an editing rule, not an effect.** Where a format allows it, the last line can lead back into the first so a replay runs on without a visible join; a skit ends on its button instead.

## Step 3: restraint

- **One effect on screen at a time.** Two effects competing for the eye cancel each other out.
- **Within the budget,** and repeating one effect for the same kind of beat is consistency, not laziness.
- **Not twice in a row,** unless the beats are deliberately parallel.
- **Readable in the time it is up:** about a second per line of text at a phone's size, plus the time to arrive. If it does not fit, cut words, not time.
- **Animate less when unsure.** A static figure with a clean entrance beats a busy one.

## Editing rules that are not effects

- **Emotion first.** When a cut is technically clean but kills the feeling, the feeling wins; this is the first thing to ask at the owner's cut.
- **J and L cuts.** Let narration start a beat before the picture changes, or carry over the cut, so scene changes feel joined rather than chopped.
- **Guide the eye.** Keep the thing the viewer should look at near where their eye already is across a cut, unless the jump is the point.

## Step 4: show the picks

The message that sends the animatic lists each beat that carries an effect, which effect, and why, in a line each, plus the beats deliberately left without one. The owner swaps by saying so; nobody has to read code.

## Growing and pruning the library

Build an effect when a short needs it, not ahead of time; a library built ahead of need grows effects nobody's beats call for. The 28 in the library on 1 November were built ahead of need at the owner's request (he asked for at least 24) and are **unproven** until a short uses them. A film-local effect (the right-hand column) moves into the library the second time a short needs it. Every run's log entry lists the effects used; an effect used in two shorts is proven, and one not picked in five shorts is a candidate to remove. The effects mode builds new ones.
