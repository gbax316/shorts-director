# Brand: Qodeup

> Style contract for every short this repo produces. The skills (make-short, make-ai-short,
> make-vox, vidtsx-2d-generator, suggest-sfx) read this file so all videos feel like one channel.
> The channel is **Qodeup** (banner `qodeup`, own work). Source of truth for colour and type is the
> live site (`dev/qodeup/qodeupafrica/qodeup-web`, `src/app/(site)/site.css`) and the logo files.
> `remotion/src/brand.ts` and `remotion/src/fonts.ts` hold the same values as code: change one,
> change the other. To judge a change, render `BrandSampleNight` and `BrandSampleDay` at frame 78.
> The 12 example shorts keep the original author's look where they set colours inline.

## 1. Identity & voice

- **Who it speaks to first:** the Nigerian business owner running the business through WhatsApp,
  spreadsheets and bank alerts. Name their problem the way they would say it, then name the fix.
- **What Qodeup is, in one line:** Qodeup builds the software and AI that take manual work off a
  business, teaches teams to use AI, and runs its own products on the same tools.
- **Value first.** Show the cost of the problem before any price. No price in a hook.
- **Hooks:** a stinging question to the viewer with a visual payoff beats a clever written line.
  Offer several hook shapes, judged as the buyer, before voicing any.
- **Words:** plain, British English, confident, no hype. Everything on screen and in the voice passes
  `BaxAIOS/personal-os/os-inputs/_os-style-bans.md`: no em-dashes, no exclamation marks, none of the
  banned words. Check the shipped captions, not the draft.
- **Feel:** a high-end product launch, not a template. Bright, solid colour used as a signal, sharp
  contrast, motion that is present and eased. No confetti, no glow-everything, no sticker look.

## 2. Color palette (exact hex)

| Role | Token (`COLORS.`) | Hex | Use in video |
|---|---|---|---|
| **Signature** | `warn` (gold) | `#F2B21B` | the active caption word, kickers, key words on night; gold on navy is the brand's contrast |
| **Primary accent** | `accent` (orange) | `#E8792A` | highlights, progress, active state, buttons |
| Orange for text on day | `accentOnDay` | `#B4501A` | orange words on the light ground (plain orange is too light to read there) |
| Secondary | `accent2` (deep blue) | `#175674` | secondary emphasis, pairs with orange |
| Success | `signal` (teal) | `#218D87` | "done", "free", confirms (`signalAlt` `#2BB3AB` on night) |
| Danger | `danger` (red) | `#BC382A` | errors, "the expensive way" |
| Night ground | `night` / `navy` | `#0B0D10` / `#0C1622` | the default background, navy glow over near-black |
| Night surface | `surface` | `#14181D` | cards and panels on night |
| Text on night | `onNight` / `onNightSoft` | `#F3EFE8` / `#B9B2A6` | primary and secondary text |
| Day ground | `paper` / `cream` | `#FAFAF7` / `#F3EFE8` | the light edition |
| Text on day | `ink` / `muted` | `#0B0D10` / `#55534E` | primary and secondary text |

Teal, blue and red were sampled from the Q mark itself. **Never recolour the logo**: it is
multicolour (teal, blue, gold, orange, red). Use `qodeup-logo-light.png` on night and
`qodeup-logo-dark.png` on day (`media/library/logos/`).

**Ground:** night by default (`BRAND_GROUND` in brand.ts). Day is the site's light edition and is
available per shot; on day, kickers take a white fill and captions sit on their dark plate.

**Signature gradient:** gold to orange (`GRADIENT`), the run of colour through the Q mark.

Things that mean different things get colours that read as different at a glance. Check text on a
bright fill by looking at a rendered frame, never from the hex alone.

## 3. Typography

| Role | Font | Token | Use |
|---|---|---|---|
| **Statement headlines** | **Instrument Serif** (400 and italic only) | `FONT_HEADLINE` | the big hook line, chapter statements; italic plus gold or orange for the one key word |
| Headings, labels, captions | **Geist** (all weights) | `FONT_DISPLAY`, `FONT_BODY` | anything that needs weight: captions, card titles, chips |
| Code, numbers, tags | **Geist Mono** | `FONT_MONO` | terminal mockups, stats, small uppercase tags |

Never set `fontWeight` on Instrument Serif: it has one weight and the browser fakes bold. All three
load from `@remotion/google-fonts`, nothing to install.

## 4. Shape & depth

- **Radius:** 16px cards, 14px panels, pills fully rounded. Terminal windows 10px with a title bar.
- **Borders carry colour.** A 2px coloured border is how a card says what it is (the three steps in
  the sample: teal, gold, orange).
- **Depth on night:** deep soft shadows (`SHADOW.night`) and a navy glow, not outlines alone.
  **On day:** soft shadows (`SHADOW.card`) and 1px warm borders.
- **Never:** hard offset shadows, thick black borders, sticker or Memphis looks.

## 5. Motion language: confident, eased

- **Entrances:** fade and rise. `opacity 0 to 1`, `translateY 24px to 0` over about 7 frames at
  30fps, ease-out (`EASINGS.easeOut`). A gentle overshoot is allowed on a reveal, never a bounce.
- **Exits:** fade and fall, a little faster than entrances.
- **Emphasis:** the key word changes colour (gold on night, orange on day) or gets an underline wipe;
  scale pop up to 1.06.
- **Stagger:** 3 to 4 frames between list items or lines.
- **Presence over subtlety:** motion should be noticed. Purposeful camera moves on any site or
  screen footage; no spins, no elastic, no confetti.

## 6. Delivery specs (shorts)

- **Canvas:** 1080×1920 (vertical), **30 fps**, about 38 to 42s.
- **Safe areas:** captions block centred near y1450; nothing critical in the bottom 340px
  (platform UI) or the right 160px (like and share rail). Keep text at least 5% from edges.
- **Frame 0 is the thumbnail:** fully composed, logo and hook visible, no fade from black.
- **Phone delivery:** raw renders run past 30 MB, the limit for sending to a phone. Re-encode at
  CRF 23 (`ffmpeg -i in.mp4 -c:v libx264 -crf 23 -preset slow -c:a copy out.mp4`); same picture.
- **Endings:** no like-and-subscribe outro. The loop is the ending. A business action, when the
  short has one, is one plain line ("Book the diagnostic. Link below.") and the date or offer
  lives on the page it links to.
- **People in images:** Nigerian settings shown as they are for Qodeup's buyers: working,
  middle-class to affluent businesses and homes. No poverty undertone in any generated image.

## 7. Sound design: SFX

Same energy as the motion: **calm/premium, felt-not-heard.** SFX are seasoning on the edit, never
the show. Choose every cue by its FUNCTION (3+1 foundational sounds do the heavy lifting):

| Function | Sound | Its job | Calm sub-types |
|---|---|---|---|
| **Motion** | whoosh | direction/speed; carry one beat into the next | `whoosh-soft`, `whoosh-wind` |
| **Tension** | riser | "something is coming"; hold before a reveal | `riser-soft` (NO cymbal-urgency) |
| **Emphasis** | impact / pop | "this moment matters"; lands on the reveal | `impact-soft`, `impact-deep-soft`, `pop-reveal` |
| **Snap** | click | small, satisfying, alive | `ui-click-soft`, `ui-toggle-on`, `ui-send` |

Plus extras like `page-flip` (storybook) and `chime-reward` (the gift moment).

- **Under the voice, always.** Quiet, tasteful, never louder than the narration. Silence is part of
  the mix; never wall-to-wall.
- **Layer the big moments (build-and-drop):** riser → impact on a scripted reveal, whoosh → pop on a
  cut. A layer is two events at the same/adjacent `at_s`. Reserve for the 2–3 hero beats.
- **Density:** score key transitions, reveals, and one-gesture click-sequences, not every sub-frame.
  Everything genuinely deniable is `"optional": true`.
- **Sync to the VISUAL beat and often the exact word.** Off-by-100ms reads as sloppy. Use real frame
  and word times, never guesses.
- **Levels.** Library clips are normalized to ~−20 LUFS with a −1.5 dBFS peak ceiling, so per-cue
  `gain_db` is perceptually meaningful. **Shorts calibration:** under a short's near-continuous
  narration a conservative gain table runs 4–8 dB too quiet. Start at transitions/whooshes **−3**,
  story pops/impacts **0..+3**, stamps/snaps **0..+7**, layered-hero risers **0..+2**.
- **No static/glitch textures under narration** They read as NOISE over the voice at any gain.
  Error/delete moments during speech get silence or one clean mechanical snap; save glitch textures
  for gaps where the voice is silent.
- **Diegetic action sounds are the content** in a fully-synthetic short (piece thocks, digit pops) and
  may exceed long-form density.
- **Source.** ElevenLabs Sound Effects API is primary (owned, consistent, reusable); curated
  royalty-free is the fallback. Every clip's `source` + `license` is recorded in the catalog.
- **Library is the durable asset**: shared, cross-project at `media/library/sfx/` (`catalog.json` +
  `clips/`), seeded from `palette.json`. It grows with every video; reuse before generating.
