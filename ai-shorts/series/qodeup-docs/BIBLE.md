---
series: Qodeup mini documentaries
created: 2026-11-01
status: draft, written for the first film (doc-1, "The new builders"); each film writes back what it settles
read: before writing any film in this format
---

# Qodeup mini documentaries

Short films about how building with AI is changing who gets to make the internet, and what that opens up. There is no recurring cast. The narrator is the constant, and the city is the set.

## Grammar

- **Question, evidence, turn.**
  - Frame 0 asks a question the viewer can see.
  - The evidence is people and figures.
  - The turn is what this means for the viewer, then the offer.
- **About 40 seconds of narration, then the end card.** The closing line belongs to the series: "It starts with creating with AI."
- **The words are visible.** Every beat puts something on screen that the voice does not say: a place and time tag, a figure, a source, a label.

## Facts

- **Every figure on screen is checked against its source before it is voiced.** The source sits in small type under the figure, with the publisher and the year.
- **A figure we could only read secondhand stays off screen.** So does a single narrow study shown as a general rule.
- **No income promises.** The course itself makes none.

## People

- **Generated, never a named real person.** Each is "a builder like you", introduced by role and neighbourhood: a banker in Lekki, a corps member in Ikeja, a designer in Surulere.
- **Businesses on screen are illustrative,** like the course's own demo, Mama Tee's Bakery in Yaba.
- **Across income levels,** from a high-rise flat to a shared desk. Nothing run down, no poverty undertone (the 2026-08-22 rule).

## Look

- **Photoreal Lagos.**
  - modern, warm practical light, bright sharp contrast, never muted or grey
  - night scenes are warm lamps and screens, not gloom
- **Stills carry most beats,** each on a slow push of about 3%. Hard cuts land on the narrator's beats.
- **Generated clips are for moments of action:** hands typing, a site building, a publish button.
- **Palette** (from `remotion/src/brand.ts`):
  - navy `#0C1622` and night `#0B0D10` grounds
  - gold `#F2B21B` for figures
  - Qodeup orange `#E8792A` for the active word
  - teal `#2BB3AB` for confirmations
  - cream `#F3EFE8` for text on night

## Kinetic type

- **Figures:** FONT_EDITORIAL, heavy, gold, counting up into place.
- **Source lines:** FONT_BODY at 22 to 24 px, onNightSoft, under every figure.
- **Place and time tags:** FONT_MONO, cream on a translucent navy chip, top left.
- **Captions:** the shared `Captions` component, one speaker colour (orange), above the lower third.
- **The closing line:** FONT_HEADLINE (Instrument Serif), cream on navy, alone on screen.
- **Style bans apply on screen:** no em dashes, no exclamation marks.

## Sound

- **Narrator:** Ifeoma Odumodu (ElevenLabs shared voice `reGkImJki7uJOve2F4A0`), eleven_v4, picked for doc-1 from three auditions. Orezi confirms.
- **Beds:**
  - the library's beds first, ducked under the voice with `makeBed`
  - the Lagos street at a low level for city beats
  - a soft tap or pop on each figure landing
- **Mastering:** -14 LUFS, true peak under -1.5 dB, as the skits.

## Films

| # | Title | Premise | Status |
|---|---|---|---|
| 1 | The new builders | Lagos after work: people who never studied code build websites and apps by directing AI | animatic |
