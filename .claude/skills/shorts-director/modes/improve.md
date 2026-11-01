# Improve

This mode is why the skill gets better instead of staying as good as the day it was written. It runs at the end of every short, and any time the owner says the skill got something wrong.

## Score the run

Add an entry to `RUNS.md` at the repo root, newest first, using the shape the earlier entries use. The numbers that matter are the ones in `../references/outcomes.md`: revision rounds to the owner's approval (and what each round was about: direction, taste or a fault), faults the owner found before you did, beats where the words were not visible, credits and dollars spent per step, and the formats shipped. Be honest about rounds. A round caused by a new direction from the owner is still a round, but say that it was direction, because the fix for direction rounds (a better premise gate) is different from the fix for fault rounds (a better check).

When audience numbers arrive after posting (still watching at three seconds, average view, completion, link clicks), add them to the same entry. They are read by hand for now.

## Land the lessons

Anything learned goes to `LESSONS.md` as a numbered entry: what happened, what fixed it, and the general rule, in plain words. A fix that only applies to one video stays in that video's notes and beats.

## Change the skill when the evidence says so

Two signals justify changing the skill itself: the same fault or correction has now happened twice (across any shorts), or a technique has proved itself on a real run and future runs should start from it. When either holds, write the change into the relevant mode or reference in general terms (not "in episode 2 the eyebrow..." but the rule the eyebrow taught), show it to the owner as a diff, and commit it with a message that names the run and the lesson. One lesson per commit, so any of them can be reverted on its own.

An owner's correction about how the skill works (not about one video) is the strongest signal there is. Treat it as the second occurrence even when it is the first, because the owner has already seen it happen.

New tools and fixes to tools (a mouth_sync setting, a caption rule) are documented in the tool's own docstring and in the reference that uses it, in the same commit as the code.

## Look across runs now and then

Every few shorts, read `RUNS.md` top to bottom and ask what keeps costing rounds. If it is premises, the writers' room needs a better buyer or better divergence. If it is faults, a check is missing. If it is voice, the audition step needs to move earlier. Write what you find into the run log, and propose the change.

When the skill has changed in a way worth sharing, run `os-hazmat` over the changed files before committing, so the instructions stay plain and true.
