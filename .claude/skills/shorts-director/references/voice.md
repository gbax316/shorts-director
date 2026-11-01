# Voice

The voice sets the timeline, so it comes first and it has to be right before anything is drawn to it.

## Casting

Voices are ElevenLabs voices, used by id. A recurring character's voice lives in its `character.json` (`voice` block with id, model and settings) and nowhere else. A one-off voice (a customer, a narrator) sits inline in the short's `beats.json` cast. The voices proven so far and their settings are in `director.config.json` and in each series bible.

To cast a new voice, search the ElevenLabs shared library (accent and use case narrow it fast; for Nigerian voices, `accent=nigerian` with the narrative or conversational use cases), pick three that differ, and audition each on the short's opening lines with the episode settings. Join the takes into one file with a short gap between them and let the owner choose by ear. Say what you hear in each (a rising end on every line, a place name said wrong) and which you would pick, but the choice is theirs.

Do not use a cloned voice of a real person unless the owner asks for it.

## Settings that have worked

eleven_v4 with stability 0.4, similarity 0.8, style 0.35, speaker boost, speed 1.05 for the skit cast; the documentary narrator at speed 1.12. eleven_multilingual_v2 (stability 0.5, style 0.3) is the alternative take for pidgin lines.

## Pidgin, names and respellings

A line can carry a `tts` field: what the voice says, while `text` stays what the captions show. Use it for respellings ("Oh-reh-zee" for Orezi when a new voice says the name for the first time, "eh still deh" for "e still dey") and to steer delivery. When a line is in pidgin or contains a local name, give the owner variants to choose from rather than one guess: the line as written on the main model, a respelled version, the same line on the alternative model, and for a name, two or three respellings. Episode 2 needed this for five lines and a second round for one of them; the owner's ear decided every one.

A narrator who pauses at every comma turns a short line long. Take out the commas the ear does not need in the `tts`, and move anything already on screen out of the narration.

## Seating a picked take

When the owner picks a take from auditions, use that exact audio. Re-generating "the same text" produces a different read than the one approved. `python tools/seat_take.py --beats ai-shorts/<short>/beats.json --line N --take <picked.mp3>` (with `--text` for a new wording and `--tts` for a respelling) copies the picked file to the cache name `gen_voice.py` computes for that line and makes its word map with ElevenLabs forced alignment, so captions stay exact. Then re-run `gen_voice.py --pack` so the track is rebuilt from the seated takes.

## Checks

Read the Whisper line check after every voice run. Mishearings of names and pidgin are expected; a dropped or added word is not. Listen yourself to anything flagged before the owner hears it.
