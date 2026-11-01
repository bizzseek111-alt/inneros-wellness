#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR/apps/api"

if [ -f ".venv/bin/pytest" ]; then
    .venv/bin/pytest "$@"
else
    pytest "$@"
fi
