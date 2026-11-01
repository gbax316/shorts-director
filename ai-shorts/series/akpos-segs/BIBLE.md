---
series: Akpos and Segs
created: 2026-11-01
status: draft for Orezi; built from v6 (the prototype, 31 Oct) and episode 1 (Segs's kiosk, approved 1 Nov)
read: before writing any episode line; write back anything an episode settles
---

# Akpos and Segs: series bible

Two close friends on a busy Lagos street. Akpos finds the thing that works and will not stop talking about it. Segs has been burned before and makes him earn every yes. Each episode is one argument between them that Segs loses, happily.

## The two of them

**Akpos, the hype man.**
- **Wants:** his friends to win, and to be the one who told them first.
- **Plays it:** cheeky and certain. Laughs before he answers. Talks with his hands. Points.
- **Sounds like:** quick, warm, a little loud. Pidgin rises in him when he gets excited ("Na soap I dey cut for you so").
- **Never:** unsure, mean, or preachy. He sells by grinning, not by explaining.
- **Locked look:** `../../akpos/character.json`:
  - big round eyes bulging past the head, heavy half-closed lids
  - a wide toothy grin
  - a brick-red cap worn backwards
  - a teal shirt

**Segs, the doubter.**
- **Wants:** to keep his kiosk running, and not to be fooled again by a YouTube course.
- **Plays it:** quietly sceptical, with one eyebrow up. Folds his arms. Asks the question the viewer is thinking. Turns warm in the last line.
- **Sounds like:** slower, older, dry. "At this my old age." "They go just hang you."
- **Never:** angry or stupid. He is curious and careful, and the joke is never on his intelligence.
- **Locked look:** `../../segs/character.json`:
  - bald
  - small dot eyes
  - thin brows, one higher
  - a gold shirt
- **Name:** spoken "Shegs", always captioned "Segs".

## The friendship rules

- Segs always loses the argument and is glad he did. The last line is his.
- Akpos teases, Segs needles, and neither insults the other.
- The viewer is Segs. Every objection Segs raises is a real one a small business owner would raise, and every answer shows rather than lectures.

## Catchphrases and running gags (grow this list)

| Line or gag | First used | Who |
|---|---|---|
| "How far now?" / "I'm fine." | episode 1 | Segs opens, Akpos answers |
| "Na correct guy you be." and "Akpos, Akpooos" stretched | episode 1 | Segs's closing warmth |
| "Yes o." | v6 | Akpos doubling down |
| "They go just hang you." | episode 1 | Segs on courses |
| Akpos laughs before he answers | episode 1 | Akpos |
| A pile of YouTube thumbnails buries Segs | v6 | the doubt made visible |
| "You see am?" | episode 2 | Akpos, deadpan, when the point has just proved itself |
| "Abeg register me now now. Before another customer waka pass." | episode 2 | Segs, the turn to yes |
| A LOST SALES counter ticks in the corner, then freezes when he signs up | episode 2 | the cost made visible |
| One eyebrow floats off Segs's head and back | episode 2 | Segs baffled, never annoyed |
| Things come out of Akpos's cap like rabbits from a hat | v6 | Akpos's reveals |
| The date calendar slams down | v6 | urgency |

## The world

- **The kiosk, Segs's going business:** freshly painted, a red and white awning, neat shelves of unbranded drinks, snacks and recharge cards. Never shabby.
- **The street:** a lively downtown Lagos road, yellow danfos passing in the far lane, buildings in warm paper tones.
- **The style:**
  - flat 2D cartoon, thick even black outlines, flat fills
  - a warm paper backdrop (#E5DDD2)
  - bright, sharp contrast in props and captions

## Sound palette

- **Bed:** the v6 highlife take (`media/projects/akpos-segs-1-kiosk/audio/music-highlife.mp3`), 0.16 under speech, 0.28 in gaps.
- **Street:** the Lagos ambience, horns and danfo passes, 0.10 under speech, 0.22 in gaps.
- **Foley:** one sound per gag or action (the slam, the whip, the step, the pop).
- **Mix:** speech 7 to 10 dB above the gaps; master near -14 LUFS.

## Production locks

| Lock | Where it lives |
|---|---|
| Characters | `../../akpos/` and `../../segs/` (character.png, sheet.png, character.json); the pair in `../../skit-duo/duo.png` |
| Voices | the `voice` block in each character.json (eleven_v4; stability 0.4, similarity 0.8, style 0.35, speed 1.05) |
| Mouths | the `mouth` block in each character.json and `tools/mouth_sync.py`. The 1 Nov lip-sync bakeoff (Sync 2.0 Pro, VEED Lipsync, VEED Fabric, Kling Avatar v2 Pro, InfiniTalk) found none better: video-to-video models changed nothing, and image-plus-audio models lost Akpos's grin or let the listener talk. InfiniTalk shaped Akpos's sounds best; retest it on a shot whose listener starts with a closed mouth |
| Captions | the speaker's colour on the active word: Akpos teal #2BB3AB, Segs gold #F2B21B |
| End card | navy, light logo, gold rule and link; brand, lines and link from config |
| Corner mark | "Powered by Qodeup", top left |

## Episodes

| # | Title | Premise in one line | Status |
|---|---|---|---|
| 0 | v6, the class pitched as a trick | the prototype, before the names | approved 31 Oct (different character designs) |
| 1 | Segs's kiosk | Akpos tells Segs his kiosk needs a website; Segs says he is too old to code | approved 1 Nov |
| 2 | The customer who walked away | a customer wants Segs's page, he has none, she buys next door; now Segs asks about the class | finished 1 Nov, waiting on Orezi's watch |

Episodes that name the course dates stop being usable after 14 November 2026.
