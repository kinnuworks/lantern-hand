"""Capture the labelled planes of every built-in emulator room, exactly as the app sees them.

For each room: point the dev emulator at it, reload, enter XR, wait for the app's
"ROOMDUMP" log line, and save the planes to evidence/rooms/<room>.json.
Run from the repo root: python3 evidence/capture_rooms.py
"""
import json, pathlib, subprocess, sys, time

ROOMS = ["sunlit_living_room", "home_office", "conference_room", "open_office",
         "kitchen", "bedroom", "music_studio", "open_studio"]
root = pathlib.Path(__file__).resolve().parent.parent
app = root / "app"
cfg_path = app / "iwsdk.config.json"
out = root / "evidence" / "rooms"

def cli(*args, timeout=120):
    r = subprocess.run(["npx", "iwsdk", *args], cwd=app, capture_output=True, text=True, timeout=timeout)
    return r.stdout

def ready():
    for _ in range(60):
        try:
            if '"browserCommandReady": true' in cli("dev", "status", timeout=30):
                return True
        except subprocess.TimeoutExpired:
            pass
        time.sleep(2)
    return False

original = cfg_path.read_text()
try:
    for room in (sys.argv[1:] or ROOMS):
        cfg = json.loads(original)
        cfg.setdefault("dev", {}).setdefault("emulator", {})["environment"] = room
        cfg_path.write_text(json.dumps(cfg, indent=2) + "\n")
        time.sleep(4)
        if not ready():
            print(room, "dev server not ready"); continue
        cli("browser", "reload")
        time.sleep(4)
        cli("xr", "enter")
        dump = None
        for _ in range(20):
            time.sleep(1.5)
            raw = cli("browser", "logs", "--input-json", json.dumps({"pattern": "^ROOMDUMP", "count": 5}), "--raw")
            i = raw.rfind("ROOMDUMP ")
            if i >= 0:
                # The log text is JSON-escaped inside the CLI's own JSON envelope.
                env = json.loads(raw)
                logs = env if isinstance(env, list) else env.get("logs") or env.get("data", {}).get("logs") or env.get("result", {}).get("logs") or []
                msgs = [l.get("message") or l.get("text") or "" for l in logs]
                msgs = [m for m in msgs if m.startswith("ROOMDUMP ")]
                if msgs:
                    dump = json.loads(msgs[-1][len("ROOMDUMP "):])
                    break
        if dump is None:
            print(room, "no ROOMDUMP"); continue
        (out / f"{room}.json").write_text(json.dumps({"room": room, "source": "IWER built-in room via @iwsdk/vite-plugin-dev", "planes": dump}, indent=1) + "\n")
        print(room, len(dump), "planes", sorted({p["label"] for p in dump}))
finally:
    cfg_path.write_text(original)
