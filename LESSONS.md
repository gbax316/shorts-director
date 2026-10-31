# Lessons log

What a video taught, written so the next one avoids the cost. Numbered, dated, newest at the
bottom. A lesson that changes how a skill works also goes into that skill, in general terms.
Lessons from the earlier campaign videos live in `dev/qodeup/build-with-ai-videos/shared/LESSONS.md`;
read both before a new series.

## 2026-10-31, setting the repo up for Qodeup

1. Seedance 1.5 Pro, the model this repo was tuned on, is on fal.ai and not on kie.ai. On kie.ai
   each model names its inputs differently (Seedance 2.0 takes `first_frame_url` and
   `last_frame_url`, the V1 models take `image_url`), so read the model's page before a clip.
   kie.ai deletes uploaded frames after 24 hours.
2. A key saved as a Windows user variable never reaches an app opened before it was saved. The
   tools now read the registry directly (`tools/userenv.py`), so no restart is needed.
3. `eleven_v4` takes the voice settings and the neighbouring lines as context, and returns word
   timings, so captions stay word-exact on it.
4. Whisper hears "Qodeup" as "code up". A flag on a brand name alone is usually Whisper; a
   dropped, added or swapped word is usually the voice. The ear decides.
5. Instrument Serif has one weight. Asking it for bold makes the browser fake it, so weighted
   headings use Geist and the serif carries only the big statement lines.
6. The shorts kit was built for a dark stage: white text, dark pills, a white progress track.
   Moving to the day ground meant every component had to follow the ground, not only the
   background. `BrandKitDay` shows the defaults on one frame; render it after any kit change.
7. Brand orange is too light for words on the day ground. Words use `#B4501A`; the bright orange
   stays for fills and for the active caption word on its dark plate.
8. Windows draws its own outlined pawn for the black pawn character, whatever fill it is given.
   Pieces drawn as shapes do not depend on the font.
9. A search for `ground:` also matched every `background:`. Anchor a search for a config key to
   the start of the line.

## 2026-10-31, locking Akpos and Segs (2D stick-figure duo; Segs was first named Aboki)

1. The direct Gemini key can run dry (402, prepaid credits depleted). The same model is on kie.ai
   as `nano-banana-pro` (`image_input` takes a list of urls, `resolution` 2K, 18 credits a
   still), paid from the kie balance. `gen_image.py` has no kie route yet; this run used a
   one-off script on `gen_clip.py`'s `kie_upload` and `kie_req`.
2. A model sheet redraws a character many times at small size, and the model drops the traits
   that make him who he is first: Akpos lost his big lidded eyes and the cap turned bright orange
   and forwards. Passing the original style picture as a second reference and naming the
   identity markers "in every single drawing" fixed it in one re-roll. Name them on every start
   frame too.
3. A generated character can come out mirrored. When nothing on him is one-sided, flip the PNG
   instead of paying for a re-roll.
4. `gen_voice.py` voices a short with one voice. A two-person skit needs a voice per line before
   it can use the cast's `voice` blocks in each character.json.
5. A colour change on a flat-fill character is a pixel job, not a re-generation: mask the shirt by
   hue, scale the new colour by each pixel's brightness, and every outline and shade survives with
   no drift and no cost. Keep the old reference picture for style only and name the new colours
   in every prompt, or the model pulls the old ones back.
6. `gen_voice.py` now voices dialogue: beats.json `"cast"` points each speaker at its
   character.json, each line names its speaker in `"who"`, and `--pack GAP` lays lines end to end
   from their real lengths. English Whisper flags pidgin ("na", "dey") and Nigerian names
   ("Orezi" heard as "Orazzi") on almost every line; those are for the ear, a dropped word is not.
7. Pidgin is settled by ear, not by spelling theory: three takes per pidgin line (as written,
   spelled as said, spelled as said on the older model) and Orezi picked "spelled as said" on
   eleven_v4 for all three. Seat a picked audition clip under the cache name gen_voice expects,
   or the next run rolls a fresh take that nobody heard.
8. Seedance 1.5 Pro at 720p ($0.026 a second, against $0.058 at 1080p) holds a flat 2D cartoon
   well: eight clips kept the kiosk, both faces and both shirt colours. The one failure was a walk:
   "two steps toward the kiosk" walked Akpos behind it and out of shot. Ask for one small step and
   "stays fully in view, never walks behind or past" whenever a character moves near scenery.
9. The start frames needed two fixes the character sheets did not: real brand logos on shelf stock
   (say "unbranded, solid single-colour labels") and Segs borrowing Akpos's big eyes in a two-shot
   (spell out "small dot eyes, never like Akpos's").
