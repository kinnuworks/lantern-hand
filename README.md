# Lantern Hand

Hold out your open hand and it becomes a paper lantern. A small paper traveller called Wick wakes on your real table and crosses your room toward your window, walking only where you shine the light.

It needs a Meta Quest because the whole story is staged on your own furniture: the headset's scene understanding tells it where your table, couch, floor, door and window are, and hand tracking turns your palm into the light he follows. Every room gives a different journey, because the route is built from your room's own surfaces. Headsets with no room scan get a small paper stand-in room instead.

**Live:** https://lantern-hand.vercel.app (open it in the Meta Quest Browser on Quest 3 or 3S)

## Try it in 30 seconds

1. Sit down somewhere you can see your table or couch. Make sure your room is set up in the headset's Space Setup.
2. Open the link in the Quest Browser and press Enter. Put your controllers down.
3. Hold one hand out, palm open. When it lights up, point it at the small glow on your table.

A chapter takes about six minutes. Wick stays where you left him, so the next visit picks up from there.

## How it uses the Meta platform

- **Scene understanding (WebXR plane detection):** every story beat is placed on a labelled surface from your room scan, with a fallback for each missing label. [`app/src/room/stage.ts`](app/src/room/stage.ts)
- **Hand tracking (WebXR Hand Input):** an open palm lights the lantern and the direction your hand points casts the light. No pinch is used, so the system menu gesture never fires by accident. [`app/src/story/hands.ts`](app/src/story/hands.ts)
- **Passthrough (immersive-ar):** the night falls over your real room and lifts at dawn. [`app/src/story/story-system.ts`](app/src/story/story-system.ts)
- **Spatial audio:** footsteps, wind, water and the gate come from where they happen. [`app/src/story/sound.ts`](app/src/story/sound.ts)
- **Built with Meta's Immersive Web SDK 1.1** and tested in its emulator (IWER) with emulated hands.

## Check it yourself

- Break test of the room staging, rerun with one command: `npx -y tsx evidence/eval_staging.ts` (results in [`evidence/staging-results.md`](evidence/staging-results.md))
- Hands-only walkthrough of the whole chapter in the emulator: `cd app && python3 tests/walkthrough.py`

## What doesn't work yet

- Tested only in Meta's emulator, not yet on a physical headset.
- One chapter. When you come back, Wick is waiting where you left him, but chapter two isn't written yet.
- The emulator rooms report labelled flat surfaces but no labelled furniture meshes, so staging uses flat surfaces only.

Art: paper cut-outs made with an AI image model. Narration, sound effects and music made with an AI voice and sound model.
