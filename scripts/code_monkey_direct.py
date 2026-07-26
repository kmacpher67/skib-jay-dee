#!/usr/bin/env python3
"""Dispatch bounded code-monkey work to an OpenAI-compatible chat endpoint."""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from code_monkey_extract_prompt import extract_prompt  # noqa: E402
from code_monkey_resolve_backend import resolve_backend_model  # noqa: E402

MAX_TOKENS = 8192


def dry_run(handoff_path: Path, backend: str, model: str, base_url: str, repo_root: Path) -> int:
    prompt = extract_prompt(handoff_path, repo_root)
    print(f"[code-monkey] dry-run backend={backend} model={model}")
    print("──────────────────────────────────────────────────────────────────────────")
    print(prompt)
    print("──────────────────────────────────────────────────────────────────────────")
    print(f"[code-monkey] Would POST to {base_url.rstrip('/')}/chat/completions")
    return 0


def call_chat_completions(base_url: str, api_key: str | None, model: str, prompt: str) -> str:
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": MAX_TOKENS,
    }
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    req = urllib.request.Request(
        base_url.rstrip("/") + "/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=300) as resp:
        body = json.loads(resp.read())
    return body["choices"][0]["message"]["content"]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Dispatch a bounded skib code-monkey handoff.")
    parser.add_argument("handoff", help="Path to the handoff markdown file.")
    parser.add_argument("--dry-run", action="store_true", help="Print the prompt instead of calling the model.")
    parser.add_argument("--backend", default=None, choices=["ollama", "openrouter"], help="Override backend.")
    parser.add_argument("--model", default=None, help="Override model slug.")
    parser.add_argument("--base-url", default=None, help="Override chat-completions base URL.")
    args = parser.parse_args(argv)

    handoff_path = Path(args.handoff)
    if not handoff_path.is_file():
        print(f"[code-monkey] handoff not found: {handoff_path}", file=sys.stderr)
        return 1

    repo_root = Path(__file__).resolve().parent.parent
    backend, model, base_url = resolve_backend_model(
        handoff_path,
        env_backend=args.backend,
        env_model=args.model,
        env_base_url=args.base_url,
    )

    if args.dry_run:
        return dry_run(handoff_path, backend, model, base_url, repo_root)

    prompt = extract_prompt(handoff_path, repo_root)
    api_key = os.environ.get("SKIB_CODE_MONKEY_OPENROUTER_KEY") or os.environ.get("OPENROUTER_API_KEY")
    if backend == "openrouter" and not api_key:
        print(
            "[code-monkey] no OpenRouter key found. Set SKIB_CODE_MONKEY_OPENROUTER_KEY "
            "or OPENROUTER_API_KEY.",
            file=sys.stderr,
        )
        return 1

    try:
        print(call_chat_completions(base_url, api_key if backend == "openrouter" else None, model, prompt))
    except urllib.error.HTTPError as exc:
        print(f"[code-monkey] HTTP error from {base_url}: {exc}", file=sys.stderr)
        return 1
    except urllib.error.URLError as exc:
        print(f"[code-monkey] network error calling {base_url}: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
