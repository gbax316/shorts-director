# The checks between gates

The owner's eye should be spent on taste. Faults a scan can catch are yours to catch first. Every check below comes from the runs so far.

**Read the frames.** After any render, pull frames across the whole timeline and around every seam, tile them into a sheet, and look. Sampling every half second misses two-frame faults, so it is not enough on its own.

**The frame-jump scan.** `python tools/frame_scan.py <video>` differences consecutive frames and lists every spike over four times the median (`--factor 8 --floor 6` suits a whole cut, where gags move a lot). On a single clip, any spike is a cut, a fast gesture or a morph; look at each one. On the whole cut, only planned cuts, wipes and the end card should spike. It caught: episode 1's two-frame morphs with ghost eyes; episode 2's eyebrow clip snapping a stretched head back in one frame; the pop where a close-up plate was a different version of the still its clip was made from.

**Seams.** The plate under a clip must be the clip's own first frame, and where a clip ends before its scene, its last frame. Check the frame either side of every clip boundary side by side.

**Identity and hands.** Compare characters against their references at the start, middle and end of each clip, and crop close on hands.

**Mouths.** Both faces every half second against who is speaking (`mouths.md`).

**Captions.** Chunks break at sentence ends first, so a pidgin pair like "Okay o." or "now now." never lands on two cards, and no word is left alone on a card. Check the active word is coloured by speaker in dialogue.

**Text.** `tools/check_text.py` on the short and each composition, plus a read of strings written as JSX children, which its pattern skips. No em dashes, no exclamation marks, nothing on the ban list.

**Loudness.** The master's integrated loudness and peak against the config's target.

**The house rules.** Images across income levels with nothing run down; bright, sharp contrast; urgency only from what really counts down; offer lines that sound like the teacher, not an advert; no invented real person or business; no claim the offer itself refuses to make.
