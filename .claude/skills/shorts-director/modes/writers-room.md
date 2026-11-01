# Writers' room

The premise decides more about a short than any pixel does, and it is the cheapest thing to change. So the room never writes one idea and polishes it. It writes three that disagree with each other, judges each one as the person scrolling, and only then writes a script.

## Who you are writing for

Before a premise, name the buyer in one or two sentences: who they are, what they already believe about the thing being sold, what they have been burned by, and that they give a short about two seconds. Take this from the series bible or the offer's own pages, not from a generic persona. In the runs so far the buyer changed the film completely: the same documentary format sold to business owners was about lost customers at night, and sold to people who want to earn with AI it became a film about who builds the internet now. If the owner's direction names the audience, quote it at the top of the premises file and write to it.

## Three premises, divergent on purpose

Each premise gets a logline, a beat table (what is said, what is seen, how each beat is made) and three judgments: its retention device, how it lands as the buyer, and its risk. Make them differ in kind, not in wording: an investigation, a contrast, a clock; a customer walking away, a pile of tutorials, a cold open on the future. If two premises would produce the same film with different lines, one of them is not a premise yet.

Retention devices come from a short menu, used where they fit the story rather than bolted on: a counter that ticks (a real one, or plainly a gag), a clock, a search bar filling in, doors opening onto something bigger, a map lighting up, a rewind, a payoff shown at frame 0 and earned after. The device should be the thing the eye follows while the voice argues.

End with a pick and its reason in two or three sentences, and say which premise is the runner-up and why. The owner picks. Their direction can arrive as a pick, a merge, or a new brief; when it is a new brief, write three new premises rather than bending the old ones.

## Rules the room keeps

Every line of narration or dialogue has something on screen that the voice does not say: a gag, a figure, a tag, a reaction. A line with nothing to see is a line the viewer can scroll past.

Facts stated as true pass the fact gate (`../references/facts.md`) before they enter a premise, not after the script is voiced. A premise that leans on a figure nobody can source is rewritten, not rescued with softer wording.

Offer lines read like the teacher talking, not an advert. Urgency comes only from things that really count down (dates, a real seat limit), never from an invented number. The film promises only what the offer's own page promises; if the page refuses to promise income, so does the film.

A real person or business is never invented and presented as real. People in a documentary are shown as "a builder like you", and an illustrative business is plainly illustrative.

## The script

Once a premise is picked, write `ai-shorts/<short>/script.md` (the beat table with the lines, what we see, the words on screen, each beat's job, how each beat is made) and `beats.json` (the `vo` array with `who` for each line, the cast, and the end card with its tagged link from the config's link rules). Keep narration to what fits: documentary 1's narrator ran about two words a second (92 words in 46 seconds, where the 104-word draft ran 49.6), so plan about 80 words for 40 seconds and time it on the real voice; dialogue is timed by its real voice lengths later. Run `python tools/check_text.py ai-shorts/<short>` before the voice is generated; it scans the spoken lines in `beats.json` and skips `script.md` as a plan. The owner's own words replace yours wherever they give them; skits have been dictated line by line and documentaries rewritten around a new focus, and both are normal.

Each beat's job is what the viewer needs from it (a number, a list, a sequence, a comparison, one place to look, and the rest of the list in `../references/effects.md`), or none. Tag it in the script; the produce mode turns jobs into effects, so the owner never has to name one.

Save premises and scripts into the short's folder and commit them; when the owner is reviewing a markdown file, open it in the side pane of the app rather than sending it as an attachment.
