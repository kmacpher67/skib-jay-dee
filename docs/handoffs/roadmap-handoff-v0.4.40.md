# Shart Knocker - v0.4.40

**Created by:** Google Antigravity — 2026-07-27
**Session mode:** Mode B (Execution)

This handoff documents the implementation of the **Shart Knocker** active ability (Taco Bell Grande follow-up), shipped in `v0.4.40`.

## What changed

- Implemented **Shart Knocker** active ability in `GameEngine.js`: 
  - Picking up a Taco Bell Grande on Level 4+ now grants one `shartCharge`. 
  - The runner can trigger it via the F key or the on-canvas FIRE button.
  - The FIRE button turns orange and reads "FART" while a charge is held.
- Triggers a fart that stuns the nearest chaser for 3-12 seconds (randomized).
- A successful hit pays +50 sheebs; a miss pays +5 sheebs. 
- Added the `Flaming Ass` badge, awarded on the first successful hit.
- Added `shart-knocker-stub.mp3` as a placeholder sound effect in `frontend/src/assets/audio/`.
- Added `frontend/e2e/shart-knocker.spec.js` for end-to-end verification.
- Updated `VersionModal.jsx` and `version.js` to `v0.4.40`.
- Added `onShart` callback wiring through `GameCanvas.jsx` to `App.jsx` to play the stub audio.
- Fixed a test regression during verification.

## Verification

- `cd frontend && npm run build` (Passed)
- `cd frontend && npx playwright test` (All 34 tests passed)

## Next Steps

See `docs/roadmap.md` for remaining backlog items, and `docs/handoffs/ledger.md` for the change history.
