#!/usr/bin/env bash
# The checks that prove this project works: tests, typecheck, and the end-to-end script
# that walks the demo path in a real browser against the real API, recording a screen
# video of it. Exits non-zero when anything fails.
#
# Keep it fast enough to run often (a few minutes at most), stop any server it starts
# before it exits, and never make a check pass by skipping, weakening or special-casing it.
set -euo pipefail
cd "$(dirname "$0")"

# Typecheck and production build of the WebXR app.
( cd app && npm run typecheck && npm run build >/dev/null )

# Core loop 1 (read the room): the break test over every captured emulator room and degraded copy.
npx -y tsx evidence/eval_staging.ts

# Core loops 2-5 (lantern, light, traveller, chapter): hands-only walkthrough in the emulator.
# Needs the managed dev session (npx iwsdk dev up --ai-mode agent, IWSDK_DEV_RENDER_MODE=continuous).
if ( cd app && npx iwsdk dev status 2>/dev/null | grep -q '"browserCommandReady": true' ); then
  ( cd app && python3 tests/walkthrough.py --knock && python3 tests/walkthrough.py --gaze )
else
  echo "check.sh: FAIL: the emulator dev session is not running, so the hands-only walkthrough could not run"
  echo "  start it with: (cd app && IWSDK_DEV_RENDER_MODE=continuous npx iwsdk dev up --ai-mode agent)"
  exit 1
fi

# The live link judges open must serve the app (pushes to GitHub must never replace it).
live=$(curl -s https://lantern-hand.vercel.app/ | grep -o "<title>Lantern Hand" || true)
[ -n "$live" ] || { echo "check.sh: FAIL: https://lantern-hand.vercel.app does not serve the app"; exit 1; }

# Evidence labels: once evidence/EVAL_PLAN.md exists, the public text (README, submission text,
# video script) must label every evidence claim for its kind.
if [ -f evidence/EVAL_PLAN.md ] && [ -f evidence_lint.py ]; then
  python3 -I evidence_lint.py
fi

echo "check.sh: all checks pass"
