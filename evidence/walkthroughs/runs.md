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
| 2026-11-18T03:56:58 | 0887645 (uncommitted changes) | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; return visit played chapter two to the end |
| 2026-11-18T03:58:01 | 0887645 (uncommitted changes) | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T04:00:54 | 480339b | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; return visit played chapter two to the end |
| 2026-11-18T04:02:11 | 480339b | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T04:04:34 | 480339b | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; return visit played chapter two to the end |
| 2026-11-18T04:05:39 | 480339b | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T14:19:07 | c6d7441 (uncommitted changes) | metaQuest3 | sunlit_living_room | hands | PASS: lantern lit by an open hand; every beat lit by the hand's light; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T14:22:42 | 0272ca7 (uncommitted changes) | metaQuest3 | sunlit_living_room | hands | PASS: lantern lit by an open hand; every beat lit by the hand's light; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T14:26:33 | 0242ea3 | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T14:27:39 | 0242ea3 | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T14:29:39 | 0242ea3 | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T14:30:42 | 0242ea3 | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T14:36:13 | 0242ea3 | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T14:37:19 | 0242ea3 | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T14:41:54 | 0242ea3 | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T14:43:04 | 0242ea3 | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T15:01:33 | 0242ea3 | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T15:02:46 | 0242ea3 | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T16:17:08 | 0242ea3 | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T16:18:11 | 0242ea3 | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T16:42:15 | 0242ea3 | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T16:43:16 | 0242ea3 | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T16:45:30 | deb286d | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T16:46:31 | deb286d | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T16:48:23 | deb286d | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T16:49:24 | deb286d | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T19:30:05 | deb286d | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T19:31:07 | deb286d | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T19:33:06 | deb286d | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T19:34:07 | deb286d | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T19:40:10 | deb286d | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T19:41:12 | deb286d | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T19:43:01 | deb286d | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T19:44:02 | deb286d | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T19:46:03 | deb286d | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T19:47:06 | deb286d | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T19:48:57 | deb286d | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T19:49:58 | deb286d | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T19:53:23 | d3e7ad5 | metaQuest3 | sunlit_living_room | knock | FAIL: two knocks did not wake him by themselves: no BEAT_LIT table within 3 s |
| 2026-11-18T19:54:18 | d3e7ad5 (uncommitted changes) | metaQuest3 | sunlit_living_room | knock | FAIL: two knocks did not wake him by themselves: no BEAT_LIT table within 3 s |
| 2026-11-18T19:56:25 | 53efdff (uncommitted changes) | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T19:58:24 | f7fc67c | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T19:59:26 | f7fc67c | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T20:02:14 | abf95d3 | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T20:03:19 | abf95d3 | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T20:05:42 | abf95d3 | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T20:06:48 | abf95d3 | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
| 2026-11-18T20:08:58 | abf95d3 | metaQuest3 | sunlit_living_room | knock | PASS: lantern lit by an open hand; every beat lit by the hand's light; two knocks woke him; chapter one ended; persistent anchor restored; return visit played chapter two to the end |
| 2026-11-18T20:09:58 | abf95d3 | metaQuest3 | sunlit_living_room | gaze | PASS: every beat lit by looking, no hands |
