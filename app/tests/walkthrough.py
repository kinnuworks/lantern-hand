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

def fail(msg):
    print("WALKTHROUGH FAIL:", msg); sys.exit(1)

cli("browser", "reload"); time.sleep(4)

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
    print("GAZE PASS: every beat lit by looking at it, no hands"); sys.exit(0)

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
    if not logs("^KNOCK"): fail("two knocks on the table did not wake him")
    print("KNOCK PASS: two knuckle knocks on the real table woke him")
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
    if how != "by-light": fail(f"beat {s['beat']} advanced by timeout, not by the hand's light")

t = time.time()
while time.time() - t < 90 and not logs("^CHAPTER_END"): time.sleep(2)
if not logs("^CHAPTER_END"): fail("chapter did not end")
shot("04-end")

# Coming back: reload and he should be waiting where the chapter ended.
SINCE[0] = int(time.time() * 1000)
cli("browser", "reload"); time.sleep(4)
cli("browser", "interact", "--input-json", json.dumps({"steps": [{"action": "click", "locator": {"role": "button", "name": "Enter"}}]})); time.sleep(2)
call("set-input-mode", {"mode": "hand"})
t = time.time()
while time.time() - t < 30 and not logs("^RETURN_VISIT"): time.sleep(1.5)
if not logs("^RETURN_VISIT"): fail("a returning visit did not find Wick where the chapter ended")
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
print("WALKTHROUGH PASS: lantern lit by an open hand; every beat lit by the hand's light; chapter ended; return visit played chapter two to the end",
      f"({len(errs)} console lines matching 'error')")
