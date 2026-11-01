# Finish

The finished film leaves the machine, so the last checks are the ones a viewer would notice.

1. **Master** as the sound mode describes, and report the loudness and peak.
2. **Phone copy** with `python tools/export_phone.py <final>.mp4`. It re-encodes until the file fits under the phone sharing limit.
3. **Text check** with `python tools/check_text.py ai-shorts/<short> --shot <composition>.tsx` for each composition file that holds on-screen words. Its pattern skips words written as JSX children, so read those strings yourself too (a sign, a card, a phone screen). Any hard-ban hit is fixed and re-rendered, not explained away.
4. **Update the bible and the script status**, so they point at the final file and record what the episode settled.
5. **The posting pack.** When the owner is ready to post, hooks and captions come from `os-writing` (hooks mode) in the owner's voice, built from the offer's own page rather than the episode's plot alone, with a tagged link per platform from the config's link rules. Instagram captions do not make links clickable, so those versions point to the link in the bio. Nothing is posted by this skill.
6. **Send** the phone copy for the owner's watch, with a short report: what changed since the last cut, what was checked, what was spent, what was not verified.

Then run the improve mode. A short is not finished until its run is logged.
