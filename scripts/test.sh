#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Running InnerOS Backend Safety & Unit Tests..."
bash "$DIR/scripts/test_api.sh"

echo "==> Running InnerOS Frontend Unit Tests..."
cd "$DIR/apps/web"
pnpm test

echo "==> All Tests Passed Successfully!"
