# Sound

Half of a short is heard, often on a phone speaker with the street outside. The voice has to sit clearly on top, the bed has to carry the mood without fighting it, and every gag should have a sound the eye can attach to.

Reuse before generating. The repo's sound library (`media/library/`) and earlier episodes' beds and cues are the first place to look; Akpos and Segs reuse the v6 highlife bed and the Lagos street, the documentaries use a library tech pulse and the same street. Generating new music (`tools/gen_music.py`) or effects (`tools/gen_sfx.py`) bills an account, so state the cost and get the owner's go first. `suggest-sfx` runs the cue audition when a short needs new cues.

Beds duck under speech with the eased bed level in `remotion/src/lib/skit/cards.tsx` (`makeBed`), which moves over about 13 frames; a hard switch at every line boundary pumps audibly. Cues land on the frame of the thing they belong to (a slam on the calendar, a tap on each lost sale, a click on the publish key), and get re-timed whenever the voice is re-timed. Cues that fall in a gap in the voice get no masking, so they need several decibels less than cues under narration.

Master the finished render to the config's loudness target (`director.config.json`, `audio`), the way episode 1 and every film since were finished:

```
ffmpeg -i <render>.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k -movflags +faststart <final>.mp4
```

Then measure it (`-af ebur128=peak=true`) and report the integrated loudness and peak. The owner's ear is the final check on the mix; say what you changed and what you could not judge.
