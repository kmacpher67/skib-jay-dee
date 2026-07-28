# Roadmap Handoff: v0.4.58 (Desktop Screen Support)

## Provenance
**Created by:** Antigravity — 2026-07-28

## What Changed
Implemented Option A (Fog of War) desktop screen expansion, as requested.
- Removed the strict 9:16 CSS aspect-ratio constraint from `.portrait-frame`, allowing it to expand horizontally on wider viewports.
- Updated `GameEngine.js` to calculate `VIEW_W` dynamically based on the actual canvas aspect ratio (clamped to at least 9/16).
- Implemented a difficulty-based fog of war (radial gradient mask) that obscures the extended peripheral vision for 'normal' and 'hardcore' difficulties.
  - 'easy': No fog of war. Players get full, unrestricted widescreen vision.
  - 'normal': Fog of war with `innerRadius=350` and `outerRadius=600`.
  - 'hardcore': Fog of war with `innerRadius=160` and `outerRadius=320`.
- Ensured UI positioning adjusts dynamically with the new `VIEW_W`.
- Updated `cookies.js` and `App.jsx` to parse and pass down the `difficulty` state to the `GameEngine`.
- Modified `e2e/cosmetic-sink.spec.js` to run in a fixed `360x640` viewport to preserve the exact center-pixel color checks for the jump-scare filter.

## Verification
- Run `npm run build`.
- Run `npx playwright test`. All tests pass.
- `GAME_ITERATION` bumped to `v0.4.58`.
- Deployed via `./scripts/deploy-static.sh v0.4.58`.
