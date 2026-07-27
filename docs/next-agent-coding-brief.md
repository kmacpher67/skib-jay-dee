# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

**Created by:** Codex (GPT-5) — 2026-07-27
**Last updated by:** Cursor Grok 4.5 — 2026-07-27 (v0.4.58-plan desktop FOV refine)

`frontend/src/version.js` confirms **v0.4.54** is current (near-miss burst
+ vignette shipped).

## Do not pick up yet

- **`roadmap-handoff-v0.4.58-plan.md` (Desktop Screen Support)** — blocked
  until Ken picks Option **A** or **C**. Option B is soft-parked. Copy-paste
  block in that handoff is intentionally a hard stop.

## Session focus (next unblocked slices)

Pick the oldest unfinished *unblocked* handoff. Candidates:

| Handoff | Slice | Notes |
|---|---|---|
| `v0.4.41-plan.md` | Slice B shop labels | Code-ready per Ken 2026-07-27 |
| `v0.4.41-plan.md` addendum | Play Recap + pickup tracking | Code-ready |
| `v0.4.55-plan.md` | Micro-Skib | Code-ready |
| `v0.4.56-plan.md` | Runner pose collapse (3 unique) | Code-ready |
| `v0.4.59-plan.md` | Neon Jump-Scare Upgrade (500ms headstart, 250/50) | Code-ready plan |

`v0.4.54` (near-miss burst) and Rod hotfix `v0.4.57` are already shipped —
do not re-implement.

## Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test`
- Optional map regression: `python3 scripts/audit-map-widths.py`

## Read first

1. `docs/skib-sdlc.md`
2. `docs/update-directions.md`
3. The specific handoff you are implementing
