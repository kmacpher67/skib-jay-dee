# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

**Created by:** Codex (GPT-5) — 2026-07-27
**Last updated by:** Cursor Composer — 2026-07-28 (v0.4.62 iteration bundle)

Check `frontend/src/version.js` for live `GAME_ITERATION` (**v0.4.60**).

## Primary queue — `roadmap-handoff-v0.4.62-plan.md`

Pick the **oldest unfinished slice** in this order (one slice per session):

| Order | Slice | Handoff detail |
|---|---|---|
| 1 | Rewards HUD shop labels | `v0.4.41-plan.md` Slice B |
| 2 | Pickup tracking + Play Recap | `v0.4.41-plan.md` addendum |
| 3 | Runner pose collapse (3 unique) | `v0.4.56-plan.md` |
| 4 | Micro-Skib chaser | `v0.4.55-plan.md` |

## Do not pick up yet

- **Full Difficulty Function / Debt Lock** — selector shipped v0.4.60; math
  still design-only in `difficulty-mechanics-plan.md`.
- **Audio 2 phase 1** — blocked on Ken recording `CAPTURE_LINES` clips.
- **Yoodeling Unc-2** — blocked on asset drop.
- **Role Reversal full v1.5 recovery** — menu Beta treatment is decided, but
  outcome UX (60s timer, Rematch/Menu) needs Ken's answer. See
  `v0.4.61-plan.md`. Do not ship a movement-only debug toggle as "recovered."
- **Neon Jump-Scare Upgrade, near-miss burst, Rod hotfix, Desktop FOW,
  Difficulty selector** — already shipped (v0.4.54–v0.4.60). Do not
  re-implement.

## Parallel track (Ken priority override)

If Ken says "fix Play as Chaser first," use `v0.4.61-plan.md` instead of
the v0.4.62 bundle — but still wait for timer/rematch confirmation before
outcome UX.

## Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test`
- Optional map regression: `python3 scripts/audit-map-widths.py`

## Read first

1. `docs/skib-sdlc.md`
2. `docs/update-directions.md`
3. `docs/handoffs/roadmap-handoff-v0.4.62-plan.md`
4. The specific slice handoff you are implementing
