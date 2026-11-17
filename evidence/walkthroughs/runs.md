# Emulator walkthrough runs

Every run of app/tests/walkthrough.py, appended automatically: emulated hands (or no hands for gaze) in Meta's Immersive Web Emulator. Emulator, not a headset. Failed runs stay in the log. The two FAIL rows on 2026-11-18 (03:42 gaze, 03:48 knock) were runs that overlapped another run on the same emulator, or started while its dev server restarted after a device switch; the same modes passed when run alone, before and after.

| Time | Commit | Device | Room | Mode | Result |
|---|---|---|---|---|---|
| 2026-11-18T03:40:10 | 79f38f3 | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; return visit played chapter two to the end |
| 2026-11-18T03:40:10 | 79f38f3 | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; return visit played chapter two to the end |
| 2026-11-18T03:41:31 | 79f38f3 | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T03:42:24 | 79f38f3 | metaVRGlasses | sunlit_living_room | gaze | FAIL: gaze: beat window never lit |
| 2026-11-18T03:44:12 | 79f38f3 | metaVRGlasses | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; return visit played chapter two to the end |
| 2026-11-18T03:45:36 | 79f38f3 | metaVRGlasses | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T03:48:59 | 79f38f3 | metaQuest3 | sunlit_living_room | knock | FAIL: a returning visit did not find Wick where the chapter ended |
| 2026-11-18T03:51:19 | 79f38f3 | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; return visit played chapter two to the end |
| 2026-11-18T03:52:20 | 79f38f3 | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
