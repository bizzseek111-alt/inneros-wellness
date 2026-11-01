#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR/apps/api"

if [ ! -d ".venv" ]; then
    echo "Creating Python virtualenv with uv..."
    /Users/macbookpro/.local/bin/uv venv .venv
    source .venv/bin/activate
    /Users/macbookpro/.local/bin/uv pip install -e ".[dev]"
else
    source .venv/bin/activate
fi

echo "Starting InnerOS FastAPI Backend on http://localhost:8000..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
