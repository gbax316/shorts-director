# Using the shorts director

This guide is for anyone running the director: the owner, or someone the repo has been shared with. It explains how to set it up, how a short is made from start to finish, what you are asked at each step and how to answer, and how the skill gets better as you use it.

You talk to a coding agent (Claude Code, Codex, Cursor or another) in plain words. The agent reads the skill and does the work: writing, voicing, generating, editing, checking. You make the decisions that need your taste, at five points along the way. Everything else it checks itself before it shows you.

## 1. Set up once

You need Node 18 or later, Python 3.10 or later, and `ffmpeg` on your PATH.

1. Get the repo and install the video engine:

   ```
   git clone https://github.com/gbax316/shorts-director
   cd shorts-director
   cp .env.example .env
   cd remotion
   npm install
   npm run gen
   cd ..
   ```

2. Add your keys to `.env`, or set them in your environment:
   - `ELEVENLABS_API_KEY` for voices, sound effects and music
   - `KIE_API_KEY` for stills and video clips on kie.ai
   - optionally `FAL_KEY` and `GEMINI_API_KEY`, the alternative providers
   - optionally `STYLE_SCAN`, the path to a style scanner that checks every word a viewer reads or hears

3. For cut-outs, parallax and page captures, install the Python extras: `pip install pillow rembg opencv-python numpy playwright`, then `playwright install chromium`.

4. Check it works: open the agent in the repo and ask it to "render the effects gallery". You should get a video showing every effect for four seconds.

5. Make it yours: open `director.config.json` and change the brand name, site, corner mark, the people a film may name, link tagging, house rules and voices. Change colours, fonts and logos in `remotion/src/brand.ts` and `remotion/src/fonts.ts`. Nothing else needs editing.

## 2. Make a short, step by step

### Ask for it

Say what you want in your own words. The more you say about the audience and the goal, the better the first premises. For example:
- "Make the next Akpos and Segs episode. Segs worries AI will take his job."
- "Make a mini documentary for people who want to earn building websites with AI. It sells the Build With AI class."
- "Make a short for my bakery's new delivery service."

If the short belongs to a series the repo already knows (a cast, a channel), the agent reads that series' bible first. If it is new, it writes a bible with you before anything else: who the characters are, the look, the sound, the rules.

### Gate 1: pick a premise

You get three premises that are different in kind, not just in wording. Each has a logline, a table of beats (what is said, what is seen, how each beat is made), how it lands with the person scrolling, its risk, and the agent's pick with a reason. Any figure a premise uses has been checked against its source.

Answer with a pick ("C"), a merge ("C, with B's doors"), or a new direction ("the audience is people who want to earn with AI, not business owners"). A new direction gets three new premises. This is the cheapest moment to change anything, so say what you really think here.

### The script

The agent writes the script from the premise you picked. You can dictate your own lines, edit theirs, or approve them as they are. Each beat is tagged with its job: what the viewer needs from it, if anything (a number to feel, a list to count, two things to compare). That tag is how the director picks effects later, so you never have to name them.

### Gate 2: the voice

The agent voices the script and checks every line with speech recognition. For anything in pidgin, a local name, or a new voice saying a name for the first time, you get several takes of the same line in one audio file: as written, respelled, and on a second model. Answer with the take for each line, for example "2A, 3A, 4D, 5A". If none works, say which part still sounds off ("the waka", "the name") and you get a new round aimed at it. The take you pick is used exactly; it is never generated again.

For a new narrator or character voice, you hear three candidates and choose.

### Gate 3: the animatic

Before anything is paid for, you see the whole short as an animatic: the stills on the real voice timeline, every code-drawn gag and effect in place, captions on, the end card, and red tags where generated clips will go. With it comes a short list of every effect the director chose, the beat it is on and why, and a costed plan for the clips.

Watch it as a viewer would. Change anything here, because here changes cost nothing:
- the order or length of beats
- an effect ("use a quiz on beat 4", "no effect on beat 2", "make the dates a timeline")
- the words on screen
- the stills ("she looks too formal", "make the shop brighter")

### Gate 4: the spend

Generated clips cost money, so the agent states the credits or dollars before generating and waits for your yes. It recommends a resolution and says what the alternative would cost and what you would lose. After generating, it checks every clip frame by frame (faces, hands, warping, extra people) and re-rolls failures, stating the re-roll cost first.

### The rough cut

Clips go into the edit, mouths are redrawn so they follow the voice, and a frame scan looks for jumps and morphs. You get a full-size rough cut. Judge it by feeling first: does it land? Tidiness comes second. Say what to change.

### Gate 5: the finished file

The agent masters the sound in two passes to the loudness in the config, makes a phone-sized copy, and checks every on-screen and spoken word against the style rules. You get the phone copy to watch. When you approve, it can write posting captions and hooks for Facebook and Instagram in your voice, with tagged links. Nothing is ever posted by the agent.

### After every short

The agent logs the run in `RUNS.md`: revision rounds and what caused each one, faults you spotted before the checks did, what was spent, and which effects were used. Lessons go into `LESSONS.md`. When you post the short, add the audience numbers to its entry a week later (still watching at three seconds, average view, completion, link clicks), or ask the agent to.

## 3. What to say: a quick reference

| You want to | Say something like |
|---|---|
| start a short | "make a short about X for Y" |
| continue a series | "make the next Akpos and Segs episode" |
| set up a new cast or channel | "start a new series: a channel of 40-second history shorts" |
| pick a premise | "C", or "C with B's ending" |
| redirect | "the audience is different: ..." |
| choose voice takes | "2A, 3B, 4D" |
| hear more takes | "line 6 doesn't cut it yet" |
| change an effect | "put a checklist on beat 3", "no effect on beat 5" |
| see an effect | "/effects quiz" in Claude Code, or "show me the quiz effect" elsewhere |
| build a new effect | "/effects a ticker tape for headlines", or "build a ticker tape effect" |
| approve spending | "yes, two clips" or "720p instead" |
| fix a fault | describe it: "his eyes flicker at 0:21", "the caption covers the price" |
| finish | "finish it" |
| get posting copy | "write hooks and captions for Reels" |
| teach the skill | "from now on, always ..." or "that was wrong because ..." |
| look back | "what keeps costing rounds?" |

## 4. Effects

You rarely need to name an effect. The writers' room tags each beat with what the viewer needs from it. Most beats need nothing beyond the picture and captions; no job is the default. The director then picks from the library for the beats that do, within a budget (about one beat in three, at most four different kinds per short). It prefers props inside a skit's own world over overlays.

There are 28 effects, grouped by the job they do:

| Job | Effects |
|---|---|
| hook | hook text |
| number | counter, glass stat cards, bars, receipt |
| list | checklist, rank reveal, orbit |
| sequence | timeline |
| compare | split comparison, before and after |
| focus | spotlight, annotate (hand-drawn circle), punch zoom |
| place | map zoom |
| archive | documentary still |
| screen | search bar, chat thread, notifications, Kallaway split screen |
| quote | document callout, highlighted quote |
| who | lower third |
| structure | step counter ("3 of 5") |
| engage | quiz, share or comment prompt |
| transition | flash or whip cut |

Documentary stills move with parallax (2.5D depth) by default rather than a slow pan.

To see one, ask for it by name. To see them all, ask for the effects gallery. The full rules (when each fits, when it doesn't, and what is left out on purpose, such as fake progress bars and unpaid-off hooks) are in `.claude/skills/shorts-director/references/effects.md`.

**The document callout** shows a real page and marks a passage as it is read. To use your own page: `python tools/capture_passage.py --url <page> --text "<first words>" --until "<last words>" --out media/projects/<short>/<name>.png`. Only capture pages you may show: your own, or public pages quoted with their source on screen.

**New effects** are built when a short needs one, or when you ask. Each one is added to the library, the gallery and the catalogue, and checked by eye before you see it.

## 5. Formats

Two formats are proven:
- **Character skit:** a recurring cast in dialogue, with mouths redrawn from the voice and gags drawn in code. Example: the Akpos and Segs episodes.
- **Mini documentary:** a narrator over photoreal scenes, with every figure sourced on screen. Example: Qodeup's "The new builders".

The repo's engine tracks also make code-drawn explainers and paper-collage shorts.

Ask for a format the director has not done (a listicle, a news recap, a talking object) and it will tell you so. It offers to make it once as a proving run, then write up its grammar so the next one starts from it.

## 6. What it costs

Every spend is stated before it runs. Current prices and the date each was checked are in `director.config.json` under `providers`. As a guide, from the first films (November 2026, on kie.ai):

| Item | Roughly |
|---|---|
| one still (2K) | 18 credits |
| one second of generated clip at 720p | 41 credits |
| one second at 1080p | 102 credits |
| a credit | about half a US cent |
| a skit episode's clips (three, plus one re-roll) | about 700 credits |
| a documentary (nine stills, two clips) | about 530 credits |

Voices, sound effects and music are billed by ElevenLabs on your own plan. Generating new music always asks first; the sound library is used before anything new is made.

## 7. How the skill improves

The skill learns from use in three ways:
1. **After every short,** the run is scored in `RUNS.md` and lessons go into `LESSONS.md`.
2. **When something repeats,** a fault that happens a second time, or a technique that proves itself, becomes a change to the skill in general terms. You see the change as a diff and approve it.
3. **When you correct it.** Saying how the skill works is wrong counts straight away. You don't need to repeat yourself.

Every few shorts, ask "what keeps costing rounds?" The agent reads the run log and proposes where the skill should change.

## 8. Versions and updates

The skill's version is in `.claude/skills/shorts-director/SKILL.md`, and `CHANGELOG.md` lists every release in plain words. A **patch** is a fix, a **minor** version adds a format, mode, check or tool, and a **major** version changes something existing shorts depend on. Each release is tagged in git (`v0.4.0` and so on).

- **To get the latest:** `git pull`.
- **To go back:** ask the agent to revert the commit that changed it. History is never rewritten.
- **Pushing your own changes to GitHub** is always your call. The agent asks first.

## 9. Other coding agents

The director is plain markdown plus ordinary Python and Node tools, so it is not tied to one agent. Claude Code loads it from `.claude/skills/`. Codex, Cursor, Copilot, Gemini CLI and most others read `AGENTS.md` at the repo root, which points them to the same skill and its rules. The only Claude-only piece is the `/effects` shortcut; elsewhere, ask for the effects mode in words.

## 10. Where things live

| Folder or file | What is in it |
|---|---|
| `.claude/skills/shorts-director/` | the director: `SKILL.md`, `modes/`, `references/` (effects, voice, clips, mouths, facts, checks, formats) |
| `director.config.json` | identity, house rules, voices, providers and prices |
| `ai-shorts/<short>/` | one short's premises, script, beats, stills, clip records, voice takes, outputs |
| `ai-shorts/series/<series>/BIBLE.md` | a series' bible |
| `remotion/src/shots/<short>/` | that short's composition (the edit, in code) |
| `remotion/src/lib/effects/` | the effects library |
| `media/projects/<short>/` | the media a short's composition uses, including finished clips |
| `tools/` | voice, stills, clips, mouths, cut-outs, parallax, page capture, sound, mastering, checks |
| `RUNS.md`, `LESSONS.md`, `CHANGELOG.md` | the learning loop's records |

## 11. When something goes wrong

| What you see | What to do |
|---|---|
| "API key not set" | add the key to `.env` or your environment (section 1) |
| a name or pidgin word sounds wrong | ask for takes of that line, or give a respelling ("say it Oh-reh-zee") |
| mouths move on the wrong character, or eyes flicker | tell the agent the time; mouth sync has per-shot settings for that |
| a clip warps a face or adds a person | ask for a re-roll; the agent names what must not change in the prompt |
| a caption or effect covers something | say what and when; effects stay out of the caption band, but tell it if one doesn't |
| the style check fails | the agent fixes the words and renders again; it never ships past a failed check |
| the file is too big to send from a phone | ask for the phone copy; it is made to fit under the limit |
| a render fails | ask the agent to run the typecheck and read the error; most are a missing media file |

If the skill keeps getting something wrong, say so as a correction about the skill, not just about the video, and it will change how it works.
