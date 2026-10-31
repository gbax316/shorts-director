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
