"""Hands-only walkthrough of chapter one in the emulator (Meta Quest 3 profile, emulated room).

Seats the viewer, switches to hand tracking, opens the right hand (the lantern) and aims it
at each glowing spot in turn, exactly as a person would. Passes only when every beat is lit
by the hand's light (not by the 45 s auto-advance) and the chapter reaches its end.
Usage (from app/): python3 tests/walkthrough.py [--room <emulator room>] [--shots <dir>]
"""
import argparse, json, math, pathlib, subprocess, sys, time

ap = argparse.ArgumentParser()
ap.add_argument("--shots", default="")
ap.add_argument("--timeout", type=float, default=420)
ap.add_argument("--knock", action="store_true", help="wake him by knocking twice on the table instead of lighting him")
ap.add_argument("--gaze", action="store_true", help="no hands at all: light every beat by looking at it (accessibility path)")
args = ap.parse_args()
APP = pathlib.Path(__file__).resolve().parent.parent

def cli(*a, timeout=90):
    r = subprocess.run(["npx", "iwsdk", *a], cwd=APP, capture_output=True, text=True, timeout=timeout)
    return r.stdout

def call(action, payload):
    return cli("xr", action, "--input-json", json.dumps(payload))

SINCE = [int(time.time() * 1000)]

def logs(pattern):
    raw = cli("browser", "logs", "--input-json", json.dumps({"pattern": pattern, "count": 200, "since": SINCE[0]}), "--raw")
    try:
        return [l["message"] for l in json.loads(raw)]
    except Exception:
        return []

def shot(name):
    if args.shots:
        pathlib.Path(args.shots).mkdir(parents=True, exist_ok=True)
        cli("browser", "screenshot", "--output-file", str(pathlib.Path(args.shots) / f"{name}.png"))

def record(result):
    import datetime
    root = APP.parent
    commit = subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=root, capture_output=True, text=True).stdout.strip()
    dirty = subprocess.run(["git", "status", "--porcelain", "app/src"], cwd=root, capture_output=True, text=True).stdout.strip()
    cfg = json.loads((APP / "iwsdk.config.json").read_text())
    dev = cfg.get("dev", {}).get("emulator", {})
    mode = "gaze" if args.gaze else ("knock" if args.knock else "hands")
    line = f"| {datetime.datetime.now().isoformat(timespec='seconds')} | {commit}{' (uncommitted changes)' if dirty else ''} | {dev.get('device')} | {dev.get('environment')} | {mode} | {result} |\n"
    out = root / "evidence" / "walkthroughs" / "runs.md"
    if not out.exists():
        out.write_text("# Emulator walkthrough runs\n\nEvery run of app/tests/walkthrough.py, appended automatically: emulated hands (or no hands for gaze) in Meta's Immersive Web Emulator. Emulator, not a headset.\n\n| Time | Commit | Device | Room | Mode | Result |\n|---|---|---|---|---|---|\n")
    with out.open("a") as fh: fh.write(line)

def fail(msg):
    print("WALKTHROUGH FAIL:", msg); record("FAIL: " + msg); sys.exit(1)

cli("browser", "reload"); time.sleep(4)
# Start from chapter one: use the landing page's own "Start again" link when progress is saved.
cleared = False
snap = ""
for _ in range(25):
    snap = cli("browser", "snapshot")
    if '"Enter' not in snap: time.sleep(1); continue
    if "Start again from chapter one" not in snap: cleared = True; break
    cli("browser", "interact", "--input-json", json.dumps({"steps": [{"action": "click", "locator": {"role": "button", "name": "Start again from chapter one"}}]}))
    time.sleep(1)
    if logs("^PROGRESS_CLEARED"): cleared = True; break
if not cleared: fail("could not start from chapter one (landing page never ready, or saved progress not cleared)")

call("set-transform", {"device": "headset", "position": {"x": 0, "y": 1.2, "z": 0}})
cli("browser", "interact", "--input-json", json.dumps({"steps": [{"action": "click", "locator": {"role": "button", "name": "Enter"}}]})); time.sleep(2)
call("set-input-mode", {"mode": "hand"})
call("set-transform", {"device": "headset", "position": {"x": 0, "y": 1.2, "z": 0}})

spots = None
t0 = time.time()
while time.time() - t0 < 30:
    m = logs("^STAGED ")
    if m:
        spots = json.loads(m[-1][len("STAGED "):]); break
    time.sleep(1)
if not spots: fail("room never staged")
print("staged:", [(s["beat"], s["label"]) for s in spots])

WRIST = [0.12, 0.92, -0.32]  # seated, hand low and forward (below the heart)
def aim(pos):
    d = [pos[i] - WRIST[i] for i in range(3)]
    n = math.sqrt(sum(x * x for x in d)) or 1
    call("set-transform", {"device": "hand-right", "position": dict(zip("xyz", WRIST)), "anchor": "wrist",
                           "orientation": {"fingers": [x / n for x in d], "palm": "down"}})

if args.gaze:
    call("set-connected", {"device": "hand-right", "connected": False})
    call("set-connected", {"device": "hand-left", "connected": False})
    for s in spots:
        t = time.time()
        while time.time() - t < 60:
            done = [m for m in logs("^BEAT_LIT ") if m.split()[1] == s["beat"]]
            if done: break
            call("look-at", {"device": "headset", "target": dict(zip("xyz", s["pos"]))}); time.sleep(1.5)
        if not done: fail(f"gaze: beat {s['beat']} never lit")
        if done[-1].split()[2] != "by-light": fail(f"gaze: beat {s['beat']} advanced by timeout")
        shot(f"gaze-{s['beat']}")
    print("GAZE PASS: every beat lit by looking at it, no hands"); record("PASS: every beat lit by looking, no hands"); sys.exit(0)

# Relaxed hand first (no lantern), then open it.
t_enter = time.time()
call("set-hand-pose", {"device": "hand-right", "poseId": "default"})
aim([1.5, 1.6, -1.2] if args.knock else [0, 0.5, -1.0])  # knock mode: keep the light off the table
time.sleep(6)
shot("01-before-lantern")
call("set-hand-pose", {"device": "hand-right", "poseId": "open", "duration": 0.4})
t = time.time()
while time.time() - t < 25 and not logs("^LANTERN_LIT"): time.sleep(1)
if not logs("^LANTERN_LIT"): fail("open hand did not light the lantern")
print(f"lantern lit {time.time() - t_enter:.0f} s after the room was staged (hand opened at 6 s)")
shot("02-lantern")

lit = []
if args.knock:
    tb = spots[0]["pos"]
    call("set-hand-pose", {"device": "hand-right", "poseId": "fist"})  # a knock is a closed hand: no lantern light
    t = time.time()
    while time.time() - t < 40 and not logs("^TARGET table"): time.sleep(1)
    while time.time() - t < 40 and not logs("^KNOCK"):
        for _ in range(2):
            call("set-transform", {"device": "hand-right", "anchor": "index-tip", "position": {"x": tb[0] + 0.1, "y": tb[1] + 0.08, "z": tb[2] + 0.05}, "orientation": {"fingers": [0, -0.3, -0.95], "palm": "down"}})
            time.sleep(0.25)
            call("set-transform", {"device": "hand-right", "anchor": "index-tip", "position": {"x": tb[0] + 0.1, "y": tb[1] + 0.005, "z": tb[2] + 0.05}, "orientation": {"fingers": [0, -0.3, -0.95], "palm": "down"}})
            time.sleep(0.25)
    if not logs("^KNOCK"): fail("two knocks on the table were not detected")
    # The knock alone must wake him: the hand is still a fist (no lantern light) here.
    t = time.time()
    while time.time() - t < 3 and not [m for m in logs("^BEAT_LIT ") if m.split()[1] == "table"]: time.sleep(0.25)
    woke = [m for m in logs("^BEAT_LIT ") if m.split()[1] == "table"]
    if not woke or woke[-1].split()[2] != "by-knock": fail(f"two knocks did not wake him by themselves: {woke[-1] if woke else 'no BEAT_LIT table within 3 s'}")
    print("KNOCK PASS: two knuckle knocks on the real table woke him, with no lantern light")
    call("set-hand-pose", {"device": "hand-right", "poseId": "open"})
for s in spots:
    t = time.time()
    while time.time() - t < 60:
        done = [m for m in logs("^BEAT_LIT ") if m.split()[1] == s["beat"]]
        if done: break
        aim(s["pos"]); time.sleep(1.5)
    if not done: fail(f"beat {s['beat']} never lit")
    how = done[-1].split()[2]
    lit.append((s["beat"], how))
    time.sleep(2.5); shot(f"03-{s['beat']}")
    if how != "by-light" and not (args.knock and s["beat"] == "table" and how == "by-knock"): fail(f"beat {s['beat']} advanced by timeout, not by the hand's light")

t = time.time()
while time.time() - t < 90 and not logs("^CHAPTER_END"): time.sleep(2)
if not logs("^CHAPTER_END"): fail("chapter did not end")
shot("04-end")
t = time.time()
while time.time() - t < 15 and not logs("^ANCHOR_SAVED"): time.sleep(1)
if not logs("^ANCHOR_SAVED"): fail("his resting place was not pinned with a persistent anchor")

# Coming back: reload and he should be waiting where the chapter ended.
SINCE[0] = int(time.time() * 1000)
cli("browser", "reload"); time.sleep(4)
cli("browser", "interact", "--input-json", json.dumps({"steps": [{"action": "click", "locator": {"role": "button", "name": "Enter"}}]})); time.sleep(2)
call("set-input-mode", {"mode": "hand"})
t = time.time()
while time.time() - t < 30 and not logs("^RETURN_VISIT"): time.sleep(1.5)
if not logs("^RETURN_VISIT"): fail("a returning visit did not find Wick where the chapter ended")
t = time.time()
while time.time() - t < 15 and not logs("^ANCHOR_RESTORED|^ANCHOR_NONE"): time.sleep(1)
if not logs("^ANCHOR_RESTORED"): fail("the persistent anchor from last visit was not restored: " + " ".join(logs("^ANCHOR_NONE")))
shot("05-return")

# Chapter two: three stars on the wall above the sill, then the climb to the moon.
call("set-hand-pose", {"device": "hand-right", "poseId": "open"})
for star in ["star1", "star2", "star3"]:
    t = time.time(); done = []
    while time.time() - t < 60:
        done = [m for m in logs("^BEAT_LIT ") if m.split()[1] == star]
        if done: break
        tg = [m for m in logs("^TARGET ") if m.split()[1] == star]
        if tg: aim(json.loads(tg[-1].split(" ", 2)[2]))
        time.sleep(1.5)
    if not done: fail(f"chapter two: {star} never lit")
    if done[-1].split()[2] != "by-light": fail(f"chapter two: {star} advanced by timeout")
t = time.time()
while time.time() - t < 60 and not logs("^CHAPTER_END 2"): time.sleep(2)
if not logs("^CHAPTER_END 2"): fail("chapter two did not end")
shot("06-chapter-two")
errs = [m for m in logs("error|Error") if "favicon" not in m]
print("lit:", lit)
record("PASS: lantern lit by an open hand; every beat lit by the hand's light" + ("; two knocks woke him" if args.knock else "") + "; chapter one ended; persistent anchor restored; return visit played chapter two to the end")
print("WALKTHROUGH PASS: lantern lit by an open hand; every beat lit by the hand's light; chapter ended; return visit played chapter two to the end",
      f"({len(errs)} console lines matching 'error')")
