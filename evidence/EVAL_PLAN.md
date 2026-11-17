# Evaluation plan

This plan is written and committed before any evaluation run. The commit hash and time of this file show that the question, the data, the baseline and the success rule were fixed before any result existed. If something has to change after a run, the change goes under "Changes after the first run" with its reason, and the original lines stay as they were.

There are no real users in this evaluation. Nobody was recruited, messaged or contacted for it, and our own traffic counts as testing, never as usage.

## Question
Does Lantern Hand stage a complete, playable chapter in rooms it was never tuned for, with every story beat placed on a real surface the headset reports and nothing floating in mid-air or buried inside furniture?

## Metric and threshold
- Metric: for each room scan, run the chapter's staging headless and count it a pass when all of these hold: every beat gets a placement; every placement lies within 3 cm of a reported plane of the label it asked for, or of its declared fallback surface; no placement lies inside another plane's bounding box; and the scripted hands-only walkthrough reaches the chapter's end screen. Report k of n rooms passing.
- Threshold: every room passes (k = n), and the low end of the 95% interval is reported next to it.
- Interval: 95%, from `python3 evidence/interval.py` (Wilson for k of n)

## Data
- Dataset: the room scans built into Meta's Immersive Web Emulator Runtime (IWER, npm `iwer`, MIT licence, https://github.com/meta-quest/immersive-web-emulator): `sunlit_living_room`, `home_office`, `conference_room`, `open_office`, `kitchen`, `bedroom`, `music_studio`, `open_studio`. Each reports planes and meshes like a Quest room scan.
- Plus degraded copies we generate from each scan with a fixed seed: one with every couch plane removed, one with every window and door plane removed, one with only floor and walls left. These stand in for sparse or badly set-up rooms.
- Version or hash: iwer 2.8.0 as pinned in app/package-lock.json; the degraded copies are written by the eval script and their seed is below.
- Split: staging rules are tuned only on `sunlit_living_room` and `home_office`. The other six scans and every degraded copy are the test slice and are not opened while building the staging rules.

## Baseline
- Whose: none published for this task. We report our own naive baseline next to it, clearly labelled as ours: the same beats placed at fixed offsets from the viewer with no scene data. Meta's own guidance ("Design for a minimally viable environment", developers.meta.com/horizon/design/mr-design-guideline/) is the standard we test against, not a score.

## Success rule
All test-slice rooms pass (k = n). Any failure is listed by room and beat, fixed, and the full run is repeated once; both runs are reported.

## Models and seeds
- Models: none in the evaluation. Narration and art are made with AI tools before the run; the evaluation does not call a model.
- Seeds: degraded-room generator seed 20261118.

## How results are reported
Every result names its kind at first mention, gives n, the source, the period and a 95% interval, and links its rerun command and commit. Measured numbers and estimates are kept apart, and failures are shown next to successes.

| Kind | Label at first mention | Travels with the number | Never used for this kind |
|---|---|---|---|
| Break test | Our own break test (we tried to make it fail) | what we tried, how many attempts, what broke and what we fixed | `users`, `testers`, `validated` |

The README and the submission text open their evidence section with one line before any number:

> Evidence, stated plainly: no real users yet; it was built for this hackathon. Instead: our own break test of the staging across room scans it was never tuned on. It reruns from the repo with one command.

Then one card per claim:

> Claim: Lantern Hand stages a full chapter in k of n room scans it was never tuned on.
> Evidence type: Our own break test (we tried to make it fail), not real users.
> Data: the eight room scans in Meta's Immersive Web Emulator plus degraded copies, n rooms. Baseline: our own naive fixed-offset staging.
> Result: k of n (95% interval a to b).
> Rerun: `<command>` at commit <hash>. Limits: emulated scans, not real headsets; no measurement of comfort or frame rate on a device.

Then a short limits paragraph, in numbers: zero real users, the interval, the emulated rooms, and the next real test (the same staging on real Quest 3 room scans), with the metric and threshold that would change the conclusion.

## Changes after the first run
- 2026-11-17, run 1: 18 of 30 test rooms passed (95% interval 42.3% to 75.4%); results kept in evidence/staging-results-run1.md. Failures: 11 rooms with no raised surface (open_studio and every floor-walls-only copy) got no "ridge" spot; kitchen/no-window-door put the fallback window spot under a table. Fixes in app/src/room/stage.ts: an open-floor ridge walk when no raised surface exists; the window spot now searches along the wall for a point not under furniture. Run 2 (the one allowed repeat): 30 of 30 (88.6% to 100%), evidence/staging-results.md. The plan's metric, threshold and data did not change.
- Note on the data: the 8 room scans are captured from the emulator by evidence/capture_rooms.py into evidence/rooms/*.json (not by the eval script itself, as the plan first said), so the rerun is offline and exact. The degraded copies are derived from the same rooms, so the 30 cases are not independent rooms; the honest independent count is the 6 untuned scans.
- 2026-11-17, run 3 (a stricter check added after run 2, so this is reported, not hidden): playing it in the emulator showed the table spot could land behind a seated viewer. A new failure rule was added to the check, every beat within 75 degrees of the viewer's forward view, and it failed 18 of 30 test rooms (12 of 30 passed) on the run-2 stager. Fix: the stager now only uses surfaces in front of the viewer and walks along walls for a clear point. Result with the stricter rule: 30 of 30 (88.6% to 100%). Doors behind the viewer now fall back to a wall in view, with generic narration.

- 2026-11-17, run 4 (another stricter check, reported): emulator screenshots showed a gate hidden behind a couch. A line-of-sight rule was added (the figure's middle must be visible from the seated viewer's eyes, with couches and beds treated as solid up to 45 cm above the seat) and a 5 m reach rule was already there. On the run-3 stager this failed 7 of 30 (23 of 30 passed). Fixes: table, ridge and gate now pick a visible point; when no wall in view is clear, the paper gate stands on open floor. Result: 30 of 30 (88.6% to 100%).
