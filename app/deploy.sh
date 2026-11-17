#!/usr/bin/env bash
# Build and publish the app to the lantern-hand Vercel project (production).
set -euo pipefail
cd "$(dirname "$0")"
npm run build >/dev/null 2>&1
npx -y vercel@latest link --yes --project lantern-hand --cwd dist >/dev/null
npx -y vercel@latest deploy dist --prod --yes 2>&1 | grep -E "Aliased|rror"
rm -f dist/.env.local
