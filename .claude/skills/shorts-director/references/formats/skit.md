# Format: character skit

A recurring cast in a short scene of dialogue that ends on a button. Proved by Akpos and Segs, episodes 1 ("Segs's kiosk") and 2 ("The customer who walked away"), both approved on 1 November 2026. The working files are `ai-shorts/akpos-segs-1-kiosk/`, `ai-shorts/akpos-segs-2/` and the bible at `ai-shorts/series/akpos-segs/BIBLE.md`.

## Grammar

Premise, escalation, button. One argument per episode, which the doubter loses happily. The first two seconds put a person and a problem on screen, not a title. Each line of dialogue has a visible gag the line does not say: an eyebrow, a counter ticking, a sign flipping, a calendar slamming down. The episode ends on its button (a laugh, a sign, a pointed finger at the link card) and then the end card; a skit does not loop back to frame 0 the way an explainer does.

## World and cast

Characters are locked in their `character.json` with reference images, voice and mouth settings, and every still is generated from those references. The world (a kiosk on a Lagos street, the kiosk next door) is fixed in the bible and reused across episodes. Extras walk through in the series style with two poses swapped every few frames. A one-off speaker (the customer) can be a voice and a drawn extra rather than a new locked character.

## Default render paths

Plates are generated stills; gags are drawn in code over them; a character who is present but not acting is a cut-out; acting beats (an eyebrow, a lean, a laugh) are generated clips with mouths redrawn. A long line after a clip plays on that clip's last frame, held and mouth-synced. Captions are coloured by speaker, with the customer in the brand accent.

## Voice

Each character has one voice, in their `character.json`. Pidgin lines and names get auditions the owner picks by ear (`../voice.md`), and the picked takes are seated exactly. Dialogue is laid end to end from real lengths with `--pack 0.3`, with a `gap` where the picture needs a silent beat (customers walking past, a counter ticking).

## What a skit costs

Episode 2: four stills and a cut-out pose, extras in two poses, three clips at 720p plus one re-roll (697 credits for clips), the voice on ElevenLabs. Most of its rounds were voice (pidgin) and one look (the extras), so audition pidgin early.
