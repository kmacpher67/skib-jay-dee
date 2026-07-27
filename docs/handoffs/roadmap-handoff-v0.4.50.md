# Roadmap Handoff v0.4.50 — Cosmetic Shop Sink

**Created by:** Composer — 2026-07-27
**Last updated by:** Composer — 2026-07-27

## Goal

Give sheebs a cosmetic-only spend path once stat upgrades are purchased —
a small, self-contained shop item with no gameplay effect.

## Changes made

- `frontend/src/gameContent.js` — added `jump-scare-filter-neon` to
  `SHOP_ITEMS` (200 sheebs, `cosmetic: true`).
- `frontend/src/GameEngine.js` — `neonJumpscareFilter` option toggles
  magenta/cyan flash overlay in `_drawJumpscare()` instead of red.
- `frontend/src/components/GameCanvas.jsx` + `frontend/src/App.jsx` —
  pass owned-item flag into the engine on play.
- `frontend/src/index.css` — removed the wide-viewport `.portrait-frame`
  media query that clipped footer controls on desktop.
- `frontend/e2e/cosmetic-sink.spec.js` — purchase flow, overlay tint
  assertion, and 1280×720 mute-button visibility check.

## Verification

- `cd frontend && npm run build` — passed.
- `cd frontend && npx playwright test e2e/cosmetic-sink.spec.js` — passed.
- Deployed via `./scripts/deploy-static.sh cosmetic-sink`.

## What's explicitly not done

- Additional cosmetic tiers (one item proves the pattern).
- Broth Slip audio clips (still text-only).

## Copy-paste: next natural steps

```text
Read docs/skib-sdlc.md, docs/update-directions.md, then
docs/handoffs/roadmap-handoff-v0.4.41-plan.md (Slice B shop labels).

GAME_ITERATION is v0.4.50. Next unblocked code slice: Slice B shop labels
or Play Recap pickup tracking — see roadmap-handoff-v0.4.41-plan.md.

Verify: cd frontend && npm run build && npx playwright test --workers=1
```
