#!/usr/bin/env python3
"""Resolve code-monkey backend/model with handoff > env > defaults precedence."""

from __future__ import annotations

import os
import sys
from pathlib import Path

DEFAULT_BACKEND = "ollama"
DEFAULT_OLLAMA_PROFILE = "thinkpad-local"
DEFAULT_OLLAMA_MODEL = "qwen3:4b"
DEFAULT_OLLAMA_BASE_URL = "http://localhost:11434/v1"
DESKTOP_GAMING_DEFAULT_BASE_URL = "http://192.168.1.236:11434/v1"
DESKTOP_GAMING_DEFAULT_MODEL = "qwen3:8b"
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


def read_frontmatter_profile(text: str) -> str:
    profile = ""
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return profile

    for line in lines[1:]:
        if line.strip() == "---":
            break
        if line.startswith("code_monkey_ollama_profile:") or line.startswith("code_monkey_host_profile:"):
            profile = strip_scalar(line.split(":", 1)[1])
    return profile


def _resolve_ollama_base_url(base_url: str) -> str:
    candidate = base_url.strip()
    if not candidate:
        candidate = os.environ.get("OLLAMA_HOST", "").strip()
    if not candidate:
        candidate = os.environ.get("SKIB_CODE_MONKEY_BASE_URL", "").strip()
    if not candidate:
        candidate = DEFAULT_OLLAMA_BASE_URL
    if candidate.endswith("/v1"):
        return candidate
    return candidate.rstrip("/") + "/v1"


def _normalize_profile(profile: str) -> str:
    value = profile.strip().lower().replace("_", "-")
    if value in {"local", "thinkpad", "thinkpad-local", "thinkpad-p53"}:
        return "thinkpad-local"
    if value in {"desktop", "desktop-gaming", "desktop-gaming-remote"}:
        return "desktop-gaming"
    return value


def _profile_var(profile: str) -> str:
    return _normalize_profile(profile).upper().replace("-", "_")


def _resolve_profile_default(profile: str) -> tuple[str, str]:
    normalized = _normalize_profile(profile)
    if normalized == "desktop-gaming":
        return DESKTOP_GAMING_DEFAULT_BASE_URL, DESKTOP_GAMING_DEFAULT_MODEL
    return DEFAULT_OLLAMA_BASE_URL, DEFAULT_OLLAMA_MODEL


def _resolve_profile_env(profile: str, suffix: str) -> str:
    env_key = _profile_var(profile)
    for candidate in (f"SKIB_LLM_{env_key}_{suffix}", f"JUICY_LLM_{env_key}_{suffix}"):
        value = os.environ.get(candidate, "").strip()
        if value:
            return value
    return ""


def resolve_backend_model(
    handoff_path: Path | None,
    *,
    env_backend: str | None = None,
    env_model: str | None = None,
    env_base_url: str | None = None,
    env_profile: str | None = None,
) -> tuple[str, str, str, str]:
    fm_backend = ""
    fm_model = ""
    fm_base_url = ""
    fm_profile = ""
    if handoff_path is not None and handoff_path.is_file():
        text = handoff_path.read_text(encoding="utf-8")
        fm_backend, fm_model, fm_base_url = read_frontmatter_fields(text)
        fm_profile = read_frontmatter_profile(text)

    backend = (
        fm_backend
        or (env_backend if env_backend is not None else os.environ.get("SKIB_CODE_MONKEY_BACKEND", ""))
        or DEFAULT_BACKEND
    ).strip().lower()
    profile = (
        (env_profile if env_profile is not None else os.environ.get("SKIB_CODE_MONKEY_OLLAMA_PROFILE", ""))
        or fm_profile
        or DEFAULT_OLLAMA_PROFILE
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
        profile_base_url, profile_model = _resolve_profile_default(profile)
        if _normalize_profile(profile) == "desktop-gaming":
            model = (
                _resolve_profile_env(profile, suffix="OLLAMA_MODEL")
                or profile_model
                or fm_model
                or (env_model if env_model is not None else os.environ.get("SKIB_CODE_MONKEY_MODEL", ""))
            ).strip()
        else:
            model = (
                fm_model
                or _resolve_profile_env(profile, suffix="OLLAMA_MODEL")
                or profile_model
                or (env_model if env_model is not None else os.environ.get("SKIB_CODE_MONKEY_MODEL", ""))
            ).strip()
        base_url = _resolve_ollama_base_url(
            fm_base_url
            or _resolve_profile_env(profile, suffix="OLLAMA_BASE_URL")
            or profile_base_url
            or (env_base_url if env_base_url is not None else os.environ.get("SKIB_CODE_MONKEY_BASE_URL", ""))
        )

    return backend, profile, model, base_url


def main(argv: list[str] | None = None) -> int:
    args = argv if argv is not None else sys.argv[1:]
    handoff_path = Path(args[0]) if args else None
    backend, profile, model, base_url = resolve_backend_model(handoff_path)
    print(f"BACKEND={backend}")
    print(f"RESOLVED_PROFILE={profile}")
    print(f"RESOLVED_MODEL={model}")
    print(f"RESOLVED_BASE_URL={base_url}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
