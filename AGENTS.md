# AGENTS.md - Skib-Jay-Dee-Toilet

This repo is front-end first and agent-driven. Read this before writing code
or launching an automated coding run.

## What to read first

1. `README.md`
2. `docs/skib-sdlc.md`
3. `docs/update-directions.md`
4. The active handoff in `docs/handoffs/`

## Working rules

- Keep gameplay work in `frontend/` unless the user explicitly asks for
  backend changes.
- Preserve the portrait 9:16 layout, cookie-backed profile state, and the
  random default face rotation on Quick Play.
- Use the handoff docs as the execution contract. If a task is meant for the
  code-monkey lane, the handoff should include the bounded copy-paste block
  and a `code_monkey_backend` / `code_monkey_model` hint.
- Do not bump `GAME_ITERATION` or deploy unless the user explicitly asks to
  publish.

## Code Monkey lane

Use `./scripts/run_code_monkey.sh <handoff>` to dispatch a bounded coding
slice to either local Ollama or OpenRouter.

- Default local backend: `ollama`
- Default local Ollama profile: `thinkpad-local`
- Profile-specific host/model env vars are preferred; `OLLAMA_HOST` is
  the fallback
- Alternate backend: `openrouter` (requires exporting `OPENROUTER_API_KEY` or `SKIB_CODE_MONKEY_OPENROUTER_KEY`)

The wrapper reads the handoff copy-paste block, so keep that block short,
explicit, and safe to run unattended. If using Ollama, ensure your bounded
copy-paste slices are **very small** to avoid long model timeouts.
