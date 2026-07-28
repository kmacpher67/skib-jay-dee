# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

**Created by:** Codex (GPT-5) — 2026-07-27
**Last updated by:** Cursor Grok 4.5 — 2026-07-28 (v0.4.61-plan Role Reversal)

Check `frontend/src/version.js` for live `GAME_ITERATION`.

## Do not pick up yet

- **Full Difficulty Function / Debt Lock** — still design-heavy; only the
  minimal selector slice in `v0.4.60-plan.md` is code-ready.
- **Audio 2 phase 1** — blocked on Ken recording `CAPTURE_LINES` clips.
- **Yoodeling Unc-2** — blocked on asset drop.
- **Role Reversal deep kit / 2v2 / multiplayer** — design only; see
  `docs/role-reversal-design.md`. Do not expand past the v1.5 hotfix
  scope without Ken.

## Session focus (next unblocked slices)

Pick the oldest unfinished *unblocked* handoff. Candidates:

| Handoff | Slice | Notes |
|---|---|---|
| `v0.4.61-plan.md` | Role Reversal v1.5 hotfix | **Broken live menu mode** — prioritize when Ken wants Play as Chaser fixed; see `docs/role-reversal-design.md` |
| `v0.4.41-plan.md` | Slice B shop labels | Code-ready per Ken 2026-07-27 |
| `v0.4.41-plan.md` addendum | Play Recap + pickup tracking | Code-ready |
| `v0.4.55-plan.md` | Micro-Skib | Code-ready |
| `v0.4.56-plan.md` | Runner pose collapse (3 unique) | Code-ready |
| `v0.4.59-plan.md` | Neon Jump-Scare Upgrade | Code-ready — **PX refine 2026-07-28**; stun-chasers headstart + neon theater |
| `v0.4.60-plan.md` | Difficulty selector (minimal) | Cookie + menu only; no Debt Lock math |

`v0.4.53` Role Reversal **shipped broken** — do not "add features" on it;
use `v0.4.61-plan` hotfix only. `v0.4.54` / `v0.4.57` / `v0.4.58` are
already shipped — do not re-implement.

## Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test`
- Optional map regression: `python3 scripts/audit-map-widths.py`

## Read first

1. `docs/skib-sdlc.md`
2. `docs/update-directions.md`
3. The specific handoff you are implementing
