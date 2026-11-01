# Bakeoff

A default model earns its place by beating the others on the same job, judged by eye, not by its reputation. Run a bakeoff when a job is new, when a new model claims to do it better, or when the current default keeps failing in the same way.

Give every candidate the same input (the same start frame, the same audio, the same prompt intent), measure what can be measured (mouth movement against who is speaking, identity drift, frame jumps, cost per second), then put the results side by side for the owner. Keep everything in `ai-shorts/<short>/bakeoff/` with a short report: what was tried, the numbers, the pick, and why the others lost.

The winner goes into `director.config.json` as the default for that job, with the date; the losers stay listed with the reason, so the question is not re-opened by habit. The 1 November lip-sync bakeoff is the model for this: five lip-sync models against mouth_sync on the same episode 1 shots, and mouth_sync stayed the default because the video-to-video models changed nothing and the image-plus-audio models lost the character's grin or let the listener talk. Its one open lead (InfiniTalk, retested from a frame where the listener's mouth starts closed) is recorded in the Akpos and Segs bible.

State the bakeoff's total cost before running it.
