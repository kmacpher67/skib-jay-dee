#!/usr/bin/env bash
# Dispatch a bounded code-monkey handoff to Ollama or OpenRouter.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

if [[ $# -lt 1 ]]; then
  echo "usage: $0 [--dry-run] <handoff.md> [--backend ollama|openrouter] [--profile NAME] [--model MODEL] [--base-url URL]" >&2
  exit 2
fi

exec python3 "$REPO_ROOT/scripts/code_monkey_direct.py" "$@"
