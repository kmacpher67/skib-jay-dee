#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"
WEBSITE_ROOT="${HOME}/personal/website/kenmacpherson.com"
DEPLOY_RELATIVE="skib-jay-dee-toilet-game"
DEPLOY_DIR="${WEBSITE_ROOT}/${DEPLOY_RELATIVE}"

VERSION_FILE="$FRONTEND_DIR/src/version.js"
SHORT_NAME="${1:-}"

if [[ -z "$SHORT_NAME" ]]; then
  echo "Usage: $0 <short-name>" >&2
  echo "Example: $0 intro-badge" >&2
  exit 1
fi

if [[ ! -f "$VERSION_FILE" ]]; then
  echo "version file not found: $VERSION_FILE" >&2
  exit 1
fi

ITERATION="$(sed -nE "s/.*GAME_ITERATION[[:space:]]*=[[:space:]]*['\"]([^'\"]+)['\"].*/\1/p" "$VERSION_FILE")"

if [[ -z "$ITERATION" ]]; then
  echo "Could not read GAME_ITERATION from: $VERSION_FILE" >&2
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

git -C "$WEBSITE_ROOT" push

echo "Deployed, committed, and pushed changes from: $DEPLOY_DIR"
echo "Commit message: $COMMIT_MESSAGE"

MARKER_FILE="$ROOT_DIR/.skib-deploy-marker"
echo "ITERATION=$ITERATION" > "$MARKER_FILE"
echo "TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> "$MARKER_FILE"
echo "Deploy marker written to: $MARKER_FILE"
