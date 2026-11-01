#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "===================================================="
echo " Starting InnerOS Sanctuary Development Environment"
echo "===================================================="
echo " - Backend API: http://localhost:8000 (Docs: /docs)"
echo " - Web Frontend: http://localhost:3000"
echo " - Mode: Non-Clinical Sanctuary (Synthetic Fixtures)"
echo "===================================================="

# Trap SIGINT to kill background processes cleanly
cleanup() {
    echo ""
    echo "Shutting down InnerOS development servers..."
    kill $(jobs -p) 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Start API in background
bash "$DIR/scripts/dev_api.sh" &
API_PID=$!

# Wait 2 seconds for API to initialize
sleep 2

# Start Web Frontend
cd "$DIR/apps/web"
pnpm dev

wait
