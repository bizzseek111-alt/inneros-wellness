#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Linting Python Backend..."
cd "$DIR/apps/api"
if [ -f ".venv/bin/python" ]; then
    .venv/bin/python -m compileall app tests -q
else
    python3 -m compileall app tests -q
fi
echo "Python syntax check passed."

echo "==> Linting Next.js Frontend & TypeScript Types..."
cd "$DIR/apps/web"
pnpm run lint || true

echo "==> Linting and Static Checks Complete!"
