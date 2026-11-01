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
10. Video models do not lip-sync dialogue: in an eight-clip, two-character skit the listener
    talked, the speaker froze and a one-second "Hahaha" became five seconds of laughing over the
    next sentence. Re-rolling does not fix it. `tools/mouth_sync.py` does: it erases the model's
    mouths and draws each character's own from the voice loudness. What it took to make it
    hold: break thin face lines before splitting shapes (an eye joined to the mouth reads as
    one shape), protect whatever is centred in the upper face, treat big solid-black shapes as
    hands, take skin from the head's most common colour, and accept a circle as a head only
    if dark outline rings at least 58% of it (measured: real heads 67% and up, false circles
    42% at most). A head that tilts down drops its eyes; a face turned to camera lifts its
    mouth; one shot may need its own "keep_above".
11. A Seedance clip can open on two frames of the start picture and then jump. Trim with a
    shot "in" point instead of letting that flash play.
12. Finishing a dialogue skit: hard cuts, not crossfades (the scene never changes, and a split
    line joins on one frame), and colour each caption's active word by speaker (a line's
    `accent` in the VO map), so a viewer with the sound off can follow who is talking. Caption
    chunks are now split evenly, because "Akpos, Akpooos, na correct guy you be." at four words a
    chunk left "be." alone on screen.
13. Reuse the set's approved sound rather than generating new: the v6 highlife bed and the Lagos
    street fit this kiosk. That bed holds level to 69 s and then rings out, so starting it 8.5 s
    in lands the ring-out on the end card. Ease the duck over about 13 frames; a hard switch at
    every line boundary pumps.
14. Sampling every half second misses two-frame faults. In shot 8 the model twice morphed
    between two framings, and for a twelfth of a second Akpos showed ghost eyes and his old open
    mouth. A frame-to-frame difference scan finds these (spikes over four times the clip's
    median); a shot's "hold" list in beats.json makes mouth_sync repeat the last good frame,
    so the jump plays as a cut.
15. Caption chunks break at sentence ends before they split for length, so a pidgin pair like
    "Okay o." or "now now." never lands on two cards. Short sentences share a card while they
    fit, and a long one splits evenly (13 words at four a card is 4, 3, 3, 3).
16. When a pidgin take is picked by ear from auditions, seat that exact take under gen_voice's
    cache name and take its word map from ElevenLabs forced alignment. Re-generating "the same
    text" gives a different read than the one that was approved.
17. A video model reads "an eyebrow flies off his head" as a change of head shape: the first
    Seedance 2 roll stretched Segs's whole head into a pear. What held on the re-roll: the
    start still as both first and last frame, and the prompt naming the head as a circle of
    the same size in every frame. Name what must not change, not just what should move.
18. The plate under a clip must be the clip's own first frame. Episode 2's close-up plate was a
    different version of the still from the one the clip was made from, and the cut popped.
19. mouth_sync per shot, for a set that is not episode 1's: "cast" overrides side, radius and
    mood when the characters swap sides or a close-up doubles a head; "heads" pins the head on
    a held still, where the detector otherwise flickers to a bigger circle round the cap and
    wipes the eyes; "skin_frac" lets a very wide grin still count as a face; "erase_black"
    erases a solid black mouth where no hand crosses the face.
20. A long line on a held frame keeps its drawn mouths if the held frame is the previous clip's
    last frame run through mouth_sync, and the cut from clip to hold never jumps.
