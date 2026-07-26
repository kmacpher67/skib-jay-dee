---
code_monkey_backend: ollama
code_monkey_ollama_profile: thinkpad-local
code_monkey_model: qwen3:4b
done_condition_cmd: ./scripts/run_code_monkey.sh --dry-run docs/handoffs/roadmap-handoff-v0.4.7-plan.md
---

# Roadmap Handoff — v0.4.7-plan (docs-only)

**Session date:** 2026-07-26
**Previous version:** v0.4.5-plan and the code-monkey lane follow-up
commits already on `master`.

This session is docs/tooling only. The goal is to make the code-monkey
lane cheaper to run day-to-day by letting it switch between named Ollama
host profiles instead of hard-editing host URLs.

## What this session did

1. **Scoped host-profile routing for the code-monkey lane.**
   - The cheap profile is `thinkpad-local`, intended for the local
     T2000-backed Ollama path.
   - The remote profile is `desktop-gaming`, intended for the faster
     `DESKTOP-GAMING` box over the warp p2p link.
   - The shell `OLLAMA_HOST` export stays the generic fallback, but the
     profile-specific env vars should win when they are set.
2. **Added the backlog item to `docs/roadmap.md`.**
   - This keeps the tool-routing work visible so future sessions do not
     burn expensive remote tokens by accident.
3. **Defined the script contract for the next pass.**
   - The resolver should understand `code_monkey_ollama_profile` in
     handoff frontmatter and `SKIB_CODE_MONKEY_OLLAMA_PROFILE` in the
     shell.
   - The CLI should accept `--profile thinkpad-local|desktop-gaming`.

## Verification performed

- `./scripts/run_code_monkey.sh --dry-run docs/handoffs/roadmap-handoff-v0.4.5-plan.md`
  already proved the lane works end-to-end with the shell's `OLLAMA_HOST`
  fallback.
- This session additionally used the existing resolver seam to confirm a
  `thinkpad-local` default can be resolved without touching the backend.

## What's explicitly not done

- No gameplay code changed.
- No `GAME_ITERATION` bump, no build, no deploy.
- No live remote model call was made from this writeup.

## Copy-paste: next natural steps for the next agent

```
Read docs/skib-sdlc.md, then docs/update-directions.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.7-plan.md).

Implement host-profile routing for the code-monkey lane:

1. Make scripts/code_monkey_resolve_backend.py accept a named Ollama
   profile. Support profile hints from handoff frontmatter
   (code_monkey_ollama_profile / code_monkey_host_profile) and from the
   shell (SKIB_CODE_MONKEY_OLLAMA_PROFILE).
2. Support at least two profiles: thinkpad-local and desktop-gaming.
   The cheap local ThinkPad profile should use the local Ollama model
   defaults; the desktop-gaming profile should use the remote
   DESKTOP-GAMING settings from the shell env or profile-specific
   JUICY_LLM_*_OLLAMA_* vars.
3. Make the CLI accept `--profile thinkpad-local|desktop-gaming` so the
   operator can switch profiles without editing host URLs.
4. Keep `OLLAMA_HOST` as the generic fallback, not the primary source of
   truth for the profile selector.
5. Update docs/update-directions.md, docs/roadmap.md, docs/version-log.md,
   and docs/handoffs/ledger.md so the next agent can see the selector
   and the cost-saving default.
6. Verify with two dry runs:
   - `SKIB_CODE_MONKEY_OLLAMA_PROFILE=thinkpad-local ./scripts/run_code_monkey.sh --dry-run docs/handoffs/roadmap-handoff-v0.4.7-plan.md`
   - `SKIB_CODE_MONKEY_OLLAMA_PROFILE=desktop-gaming ./scripts/run_code_monkey.sh --dry-run docs/handoffs/roadmap-handoff-v0.4.7-plan.md`

After that, commit the work. Do not bump GAME_ITERATION or deploy.
```
