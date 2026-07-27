# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

**Created by:** Codex (GPT-5) — 2026-07-27
**Last updated by:** Composer — 2026-07-27

This brief is the quick-start for the current open handoff.
`frontend/src/version.js` confirms **v0.4.47** is current.

## Session focus

**Gameplay Rebalancing remainder** — front-end only, no new features.

Read first:

1. `docs/skib-sdlc.md`
2. `docs/update-directions.md`
3. `docs/handoffs/roadmap-handoff-v0.4.48-plan.md`

## Tasks

1. **Gun hit:** +25 sheebs when a gun shot stuns a chaser.
2. **Badge earn:** +50 sheebs when a new badge is earned.
3. **Scaled death penalty:** L1=0, L2=10, L3=20, L4+=30 sheebs (replace flat 20).
4. **Chaser speed:** start `chaserSpeedMod` at 0.8; per-level speed cap
   (`0.9 + levelIndex * 0.09`, clamped to existing min/max).
5. **Level rewards:** bump to 50/75/100/150/200/250 for six levels.

## Constraints

- Front-end only. Keep 9:16 portrait layout.
- Do not bump `GAME_ITERATION` or deploy unless Ken asks.

## Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test`

## After landing

- `docs/roadmap.md`, `docs/version-log.md`, `docs/handoffs/ledger.md`,
  `docs/update-directions.md`, `VersionModal.jsx` (if bumping).
- Create `docs/handoffs/roadmap-handoff-v0.4.48.md`.

## Next in queue

`docs/handoffs/roadmap-handoff-v0.4.50-plan.md` (cosmetic shop sink).
Broth Slip (`v0.4.49-plan`) waits on Ken.
