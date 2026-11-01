# Stills and clips

Generated pixels are the expensive, slow and unpredictable part of a short, so they come after the animatic and every one is checked before anything is built on it. Providers, models and prices are in `director.config.json`; read the provider's pricing page when a price might have moved, and state the cost before every spend.

## Stills

`python tools/kie_image.py --prompt-file <p.txt> --out ai-shorts/<short>/shots/NN-slug.png --ref <reference.png>` generates on kie.ai (nano-banana-pro, 9:16, 2K by default) and writes a sidecar with the prompt and credits. `tools/gen_image.py` is the Gemini alternative. A character is never generated from text twice: every still that shows a recurring character passes its locked reference (`ai-shorts/<char>/character.png` or an earlier approved still) as `--ref`. A second shot of the same person in a documentary uses the first still as its reference.

What a still prompt has to carry, learned from the runs:
- the series style in plain words (flat 2D cartoon with thick outlines for the skits; photoreal, warm light and bright sharp contrast for the documentaries)
- people and places across income levels, and nothing run down; image models drift toward a poverty undertone for Nigerian scenes unless told otherwise
- for a close-up or reframing, the approved wider still as a reference crop, and the expression in words ("puzzled, never annoyed" fixed a Segs who came out angry)
- a blank screen where a phone or laptop screen will be drawn in code, and no text in the image

Check every still yourself: identity against the reference, hands, the income-level rule, stray lines, text that crept in. Re-roll at most twice with the failure named in the prompt, then tell the owner what keeps failing.

## Clips

`python tools/gen_clip.py --provider kie --model bytedance/seedance-2 --prompt "<prompt>" --out ai-shorts/<short>/shots/clip-NN-slug.mp4 --set first_frame_url=@ai-shorts/<short>/shots/NN-slug.png --set resolution=720p --set duration=N --set generate_audio=false --set web_search=false` generates on kie; `@path` uploads a local file. Generate several clips in parallel. Durations are whole seconds; round up from the beat's window, since a clip about a second longer than its window gives the edit room.

Prompt rules that have fixed failures:
- **Name what must not change, not just what should move.** The first Seedance 2 roll of an eyebrow flying off Segs's head stretched his whole head into a pear. What held on the re-roll: the start still as both the first and the last frame (`last_frame_url`), and the prompt saying his head stays a circle of the same size in every frame.
- **Count the characters:** "EXACTLY ONE character" or "EXACTLY TWO characters... nobody else appears, no clones". Clones are the most common failure.
- **Lock the camera** unless a move is the point: "Static locked-off camera: no zoom, no pan, no cut".
- **Spell out each character's fixed features** (cap, eyes, shirt, braids, top) and the drawing or photo style.
- **Keep acting small and specific.** "Bursts out laughing for about one second only" beats "laughs".
- For photoreal people, name the face, hair and clothing that must hold, and keep motion natural and small. The documentary's two clips held identity and hands on the first roll this way.

Check every clip before it enters the edit: an eight-frame strip across its length, the frame-jump scan (`qa.md`), identity against the reference, and a close crop on hands. Re-roll a failure (say the cost first) rather than hiding it in the edit; a clip that warps a character is cheaper to replace than to explain.

## Prices seen so far

The current prices, the date each was checked and the dollar value of a kie credit are in `director.config.json` under `providers`; work out every quote from there, and update it with the date when a price changes. For scale: episode 2's three clips plus one re-roll cost 697 credits at 720p, and documentary 1's nine stills and two clips cost 531.
