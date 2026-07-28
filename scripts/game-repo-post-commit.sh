#!/bin/bash
# scripts/game-repo-post-commit.sh
# Spawns a background process to push the game repo if GAME_ITERATION changed.

# Get the repo root to find version.js reliably
REPO_ROOT="$(git rev-parse --show-toplevel)"
VERSION_FILE="frontend/src/version.js"

# If HEAD^ doesn't exist (first commit) or file doesn't exist, skip
if ! git rev-parse --verify HEAD^ >/dev/null 2>&1; then
  exit 0
fi
if [ ! -f "$REPO_ROOT/$VERSION_FILE" ]; then
  exit 0
fi

# Compare GAME_ITERATION at HEAD vs HEAD^
CURRENT_ITERATION=$(git show HEAD:"$VERSION_FILE" 2>/dev/null | grep -oP "const GAME_ITERATION = ['\"]\K[^'\"]+")
PREVIOUS_ITERATION=$(git show HEAD^:"$VERSION_FILE" 2>/dev/null | grep -oP "const GAME_ITERATION = ['\"]\K[^'\"]+")

# If GAME_ITERATION hasn't changed or we couldn't parse it, exit
if [ -z "$CURRENT_ITERATION" ] || [ "$CURRENT_ITERATION" = "$PREVIOUS_ITERATION" ]; then
  exit 0
fi

# Iteration changed! Spawn the watcher in the background.
nohup bash "$REPO_ROOT/scripts/wait-and-push-game-repo.sh" "$CURRENT_ITERATION" >>/tmp/skib-game-push.log 2>&1 & disown
exit 0
