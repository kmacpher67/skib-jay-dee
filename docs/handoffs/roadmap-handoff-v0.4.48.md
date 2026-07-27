# Roadmap Handoff v0.4.48 — Gameplay Rebalancing Remainder

**Created by:** Composer — 2026-07-27
**Last updated by:** Composer — 2026-07-27

## Goal

Complete the gameplay economy rebalancing slice specced in
`roadmap-handoff-v0.4.48-plan.md` (partial close-call + positive-pickup
payouts shipped in v0.4.37).

## Changes made

- `frontend/src/GameEngine.js`:
  - Gun hits award **+25 sheebs** on bullet stun (mirrors close-call pattern).
  - Scaled death sheeb penalty by level: L1=0, L2=10, L3=20, L4+=30.
  - `chaserSpeedMod` starts at **0.8** on fresh runs.
  - Per-level chaser speed cap: `0.9 + levelIndex * 0.09`, clamped to
    existing min/max.
  - Level-clear rewards bumped to **50/75/100/150/200/250** (six levels).
- `frontend/src/App.jsx`:
  - New badges award **+50 sheebs** via `handleBadgeEarned` (engine + profile
    sync); rewards history logs `amount: 50`.
- `frontend/e2e/gameplay-rebalancing.spec.js` — gun hit, scaled death penalty,
  chaser speed start.
- Updated `negative-sheebs.spec.js`, `close-call-rewards.spec.js`, and
  `shart-knocker.spec.js` for badge +50 side effects.

## Verification

- `cd frontend && npm run build` — passed.
- `cd frontend && npx playwright test --workers=1` — 38 passed, 1 skipped.
- Deployed via `./scripts/deploy-static.sh gameplay-rebalancing`.

## What's explicitly not done

- Difficulty Function / Method C selector (separate design track).
- Broth Slip, cosmetic shop sink, Rewards HUD Slice B — still queued/blocked.

## Copy-paste: next natural steps

```text
Read docs/skib-sdlc.md, docs/update-directions.md, then
docs/handoffs/roadmap-handoff-v0.4.50-plan.md.

GAME_ITERATION is v0.4.48. Next unblocked code slice: cosmetic shop sink
(Neon Jump-Scare Filter) + optional `.portrait-frame` CSS fix — see
roadmap-handoff-v0.4.50-plan.md.

Broth Slip (v0.4.49-plan) waits on Ken sign-off. Rewards Slice B and Play
Recap addendum remain blocked on Ken in v0.4.41-plan.

Verify: cd frontend && npm run build && npx playwright test --workers=1
```
