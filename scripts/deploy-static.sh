#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"
DEPLOY_DIR="${HOME}/personal/website/kenmacpherson.com/skib-jay-dee-toilet-game"

if [[ ! -d "$FRONTEND_DIR" ]]; then
  echo "frontend directory not found: $FRONTEND_DIR" >&2
  exit 1
fi

mkdir -p "$DEPLOY_DIR"

(
  cd "$FRONTEND_DIR"
  npm run build
)

rsync -a --delete "$FRONTEND_DIR/dist/" "$DEPLOY_DIR/"

echo "Deployed build output to: $DEPLOY_DIR"
