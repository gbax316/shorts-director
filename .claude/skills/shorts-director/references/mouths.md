# Mouths

A video model does not know who is speaking. It makes the listener talk, freezes the speaker, and stretches a one-second laugh over the next sentence. Re-rolling does not fix that. `tools/mouth_sync.py` does: it tracks each character's round head in every frame, paints out whatever mouth the model drew, and draws the character's own mouth, open with the loudness of the voice for whoever is speaking and shut for everyone else. It beat five commercial lip-sync models in the 1 November bakeoff.

## Setting it up

Each character's `character.json` has a `mouth` block: which side of a two-shot they stand on, their head radius at 720 pixels wide, the zone where the mouth sits, the mouth style, and `keep_above` (shapes centred higher than this are protected, so eyes and noses survive). The short's `beats.json` has a `shots` list: each clip with its global start, the seconds used, and optionally where in the clip to start. Run `python tools/mouth_sync.py ai-shorts/<short>` (or `--only <clip-name-prefix>` for one shot, `--debug` to draw the tracking circles). It writes `<clip>-mouth.mp4` beside each clip.

The full field list lives in mouth_sync's own docstring; read it there, since it grows. The per-shot settings that episode 2 added, and why each exists:
- `cast`: the characters in this shot with their own side, radius or mood. Episode 2 put Segs on the left and Akpos on the right, the reverse of episode 1, and its close-up doubled Segs's head size.
- `heads`: the head position pinned for a held still. On a still frame the detector flickered between Akpos's head and a bigger circle round his cap, and wiped his eyes.
- `skin_frac`: how much of a face must be skin for it to count as a head. Akpos's widest grin covered too much of his face for the default.
- `erase_black`: let a solid black mouth be erased where no hand crosses the face. By default solid black is protected because it is usually a hand.
- `hold`: frames where the model morphs between two poses; each repeats the last good frame, so the jump plays as a cut.
- `keep_above`: per shot, for a face turned up or down.

## Checking it

Look at both faces every half second against who is speaking, and crop close on any frame where the model drew something unusual (a grimace, a scream, a hand near the face). Then run the frame-jump scan on each mouthed clip. A laugh, a scream or other acting mouth is usually better left as the model drew it; leave that clip out of the `shots` list.
