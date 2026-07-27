# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

**Created by:** Codex (GPT-5) — 2026-07-27
**Last updated by:** Cursor Grok 4.5 — 2026-07-27 (v0.4.57-plan Rod hotfix)

`frontend/src/version.js` confirms **v0.4.51** is current (Wall-Pinch
Collision Traps sealed and shipped).

## Session focus (HOTFIX — do this first)

**Rod of Poopdom second teleport** — read
`docs/handoffs/roadmap-handoff-v0.4.57-plan.md`.

`stinkyTimer` is set to 3 on warp but never decremented; second WARP is
dead forever. One-line tick + smoke age + e2e. Ship as **v0.4.57**.

## After that (all code-ready per Ken 2026-07-27)

| Handoff | Slice |
|---|---|
| `v0.4.41-plan.md` | Slice B shop labels |
| `v0.4.41-plan.md` addendum | Play Recap + pickup tracking |
| `v0.4.54-plan.md` | Near-miss burst |
| `v0.4.55-plan.md` | Micro-Skib |
| `v0.4.56-plan.md` | Runner pose collapse (3 unique) |

## Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test`
- Optional map regression: `python3 scripts/audit-map-widths.py`

## Read first

1. `docs/skib-sdlc.md`
2. `docs/update-directions.md`
3. `docs/handoffs/roadmap-handoff-v0.4.57-plan.md`
