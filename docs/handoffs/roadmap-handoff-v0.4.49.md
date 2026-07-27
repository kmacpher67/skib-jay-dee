# Roadmap Handoff v0.4.49 — Broth Slip (Raman-Aunt-Toilet Lady)

**Created by:** Composer — 2026-07-27
**Last updated by:** Composer — 2026-07-27

## Goal

Add Raman-Aunt-Toilet Lady as a `raman-aunt` chaserType with **Broth Slip** —
hot-ramen trail area denial on Level 5+ extra-chaser rotation.

## Changes made

- `frontend/src/gameContent.js` — `CHASER_TYPES.raman-aunt` (stats, face ids).
- `frontend/src/dialog.js` — `BROTH_SPAWN_LINES`, `BROTH_HIT_LINES`,
  `BROTH_CAPTURE_LINES` from `dialog_content_chasing.md`.
- `frontend/src/GameEngine.js`:
  - Broth trail segments (0.35s spawn, 4s lifetime, 28px width) dropped by
    `raman-aunt` chasers while moving.
  - Runner broth collision: 0.05× steering for 2s with momentum drift.
  - Level 5+ (`levelIndex >= 4`) extra-chaser spawn: 12% roll for
    `raman-aunt` before generic face; 0.88× base speed.
  - Themed spawn bark, trail-hit taunt, and capture lines.
- `frontend/e2e/broth-slip.spec.js` — force trail overlap, assert steering mult.

## Verification

- `cd frontend && npm run build` — passed.
- `cd frontend && npx playwright test e2e/broth-slip.spec.js` — passed.
- Deployed via `./scripts/deploy-static.sh broth-slip`.

## What's explicitly not done

- Level 7 climax roster inclusion (deferred per plan).
- Broth Slip audio clips (text bubbles only).
- Cosmetic shop sink (`roadmap-handoff-v0.4.50-plan.md`) — next unblocked slice.

## Copy-paste: next natural steps

```text
Read docs/skib-sdlc.md, docs/update-directions.md, then
docs/handoffs/roadmap-handoff-v0.4.50-plan.md.

GAME_ITERATION is v0.4.49. Next unblocked code slice: cosmetic shop sink
(Neon Jump-Scare Filter) — see roadmap-handoff-v0.4.50-plan.md.

Verify: cd frontend && npm run build && npx playwright test --workers=1
```
