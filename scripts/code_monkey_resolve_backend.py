#!/usr/bin/env python3
"""Resolve code-monkey backend/model with handoff > env > defaults precedence."""

from __future__ import annotations

import os
import sys
from pathlib import Path

DEFAULT_BACKEND = "ollama"
DEFAULT_OLLAMA_MODEL = "qwen3:8b"
DEFAULT_OLLAMA_BASE_URL = "http://DESKTOP_GAMING:11434/v1"
DEFAULT_OPENROUTER_MODEL = "openrouter/free"
DEFAULT_OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"


def strip_scalar(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ("'", '"', "`"):
        return value[1:-1].strip()
    return value


def read_frontmatter_fields(text: str) -> tuple[str, str, str]:
    backend = ""
    model = ""
    base_url = ""
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return backend, model, base_url

    for line in lines[1:]:
        if line.strip() == "---":
            break
        if line.startswith("code_monkey_backend:"):
            backend = strip_scalar(line.split(":", 1)[1])
        elif line.startswith("code_monkey_model:"):
            model = strip_scalar(line.split(":", 1)[1])
        elif line.startswith("code_monkey_base_url:"):
            base_url = strip_scalar(line.split(":", 1)[1])
    return backend, model, base_url


def resolve_backend_model(
    handoff_path: Path | None,
    *,
    env_backend: str | None = None,
    env_model: str | None = None,
    env_base_url: str | None = None,
) -> tuple[str, str, str]:
    fm_backend = ""
    fm_model = ""
    fm_base_url = ""
    if handoff_path is not None and handoff_path.is_file():
        fm_backend, fm_model, fm_base_url = read_frontmatter_fields(
            handoff_path.read_text(encoding="utf-8")
        )

    backend = (
        fm_backend
        or (env_backend if env_backend is not None else os.environ.get("SKIB_CODE_MONKEY_BACKEND", ""))
        or DEFAULT_BACKEND
    ).strip().lower()

    if backend == "openrouter":
        model = (
            fm_model
            or (env_model if env_model is not None else os.environ.get("SKIB_CODE_MONKEY_MODEL", ""))
            or DEFAULT_OPENROUTER_MODEL
        ).strip()
        base_url = (
            fm_base_url
            or (env_base_url if env_base_url is not None else os.environ.get("SKIB_CODE_MONKEY_BASE_URL", ""))
            or DEFAULT_OPENROUTER_BASE_URL
        ).strip()
    else:
        model = (
            fm_model
            or (env_model if env_model is not None else os.environ.get("SKIB_CODE_MONKEY_MODEL", ""))
            or DEFAULT_OLLAMA_MODEL
        ).strip()
        base_url = (
            fm_base_url
            or (env_base_url if env_base_url is not None else os.environ.get("SKIB_CODE_MONKEY_BASE_URL", ""))
            or DEFAULT_OLLAMA_BASE_URL
        ).strip()

    return backend, model, base_url


def main(argv: list[str] | None = None) -> int:
    args = argv if argv is not None else sys.argv[1:]
    handoff_path = Path(args[0]) if args else None
    backend, model, base_url = resolve_backend_model(handoff_path)
    print(f"BACKEND={backend}")
    print(f"RESOLVED_MODEL={model}")
    print(f"RESOLVED_BASE_URL={base_url}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
