"""Record the running app: a screenshot from the managed emulator browser every ~0.7 s until stopped.
Usage: python3 tests/record.py <out-dir> [seconds]
"""
import pathlib, subprocess, sys, time
out = pathlib.Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
limit = float(sys.argv[2]) if len(sys.argv) > 2 else 900
t0 = time.time(); i = 0
while time.time() - t0 < limit:
    subprocess.run(["npx", "iwsdk", "browser", "screenshot", "--output-file", str(out / f"f{i:05d}.png")],
                   capture_output=True, text=True, timeout=60)
    (out / f"f{i:05d}.t").write_text(f"{time.time() - t0:.2f}")
    i += 1
