#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"
WEBSITE_ROOT="${HOME}/personal/website/kenmacpherson.com"
DEPLOY_RELATIVE="skib-jay-dee-toilet-game"
DEPLOY_DIR="${WEBSITE_ROOT}/${DEPLOY_RELATIVE}"

ITERATION="${1:-}"
SHORT_NAME="${2:-}"

if [[ -z "$ITERATION" || -z "$SHORT_NAME" ]]; then
  echo "Usage: $0 <iteration> <short-name>" >&2
  echo "Example: $0 v0.3.1 intro-badge" >&2
  exit 1
fi

COMMIT_MESSAGE="kenmacpherson.com - skib-jay-dee toilet game: ${ITERATION} ${SHORT_NAME}"

if [[ ! -d "$FRONTEND_DIR" ]]; then
  echo "frontend directory not found: $FRONTEND_DIR" >&2
  exit 1
fi

if ! git -C "$WEBSITE_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "website git repo not found: $WEBSITE_ROOT" >&2
  exit 1
fi

mkdir -p "$DEPLOY_DIR"

(
  cd "$FRONTEND_DIR"
  npm run build
)

rsync -a --delete "$FRONTEND_DIR/dist/" "$DEPLOY_DIR/"

git -C "$WEBSITE_ROOT" add -A -- "$DEPLOY_RELATIVE"

if git -C "$WEBSITE_ROOT" diff --cached --quiet -- "$DEPLOY_RELATIVE"; then
  echo "No deploy changes to commit in: $DEPLOY_DIR"
  exit 0
fi

git -C "$WEBSITE_ROOT" commit -m "$COMMIT_MESSAGE" -- "$DEPLOY_RELATIVE"

echo "Deployed build output and committed changes from: $DEPLOY_DIR"
echo "Commit message: $COMMIT_MESSAGE"
