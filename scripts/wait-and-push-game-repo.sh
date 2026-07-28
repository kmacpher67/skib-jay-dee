#!/bin/bash
# scripts/wait-and-push-game-repo.sh
# Waits for a deploy marker and then pushes the game repo.

ITERATION="$1"
if [ -z "$ITERATION" ]; then
  echo "Usage: $0 <ITERATION>" >&2
  exit 1
fi

MARKER_FILE="$(git rev-parse --show-toplevel)/.skib-deploy-marker"
POLL_INTERVAL=5
TIMEOUT_MINUTES=5
MAX_ATTEMPTS=$((TIMEOUT_MINUTES * 60 / POLL_INTERVAL))

for ((i=1; i<=MAX_ATTEMPTS; i++)); do
  if [ -f "$MARKER_FILE" ]; then
    if grep -q "ITERATION=$ITERATION" "$MARKER_FILE"; then
      echo "Deploy marker found for iteration $ITERATION. Pushing game repo..."
      git push origin HEAD
      exit 0
    fi
  fi
  sleep "$POLL_INTERVAL"
done

echo "WARNING: Timeout waiting for deploy marker for iteration $ITERATION. Game repo not pushed." >&2
exit 1
