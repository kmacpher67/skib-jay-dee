# Roadmap Handoff v0.4.41

**Created by:** Claude Sonnet 5 — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-27
**Session mode:** Mode B (Coding — real code changes)

This session implemented **Slice A (Rewards & History panel)** from `roadmap-handoff-v0.4.41-plan.md`.

## What changed

- **Profile Schema:** Added a capped `rewardsHistory` array (last 50 entries) to `normalizeProfile()` in `frontend/src/lib/cookies.js`.
- **Event Logging:** `App.jsx` now pushes a timestamped entry to `rewardsHistory` in `handleBadgeEarned()` and `handlePurchase()`.
- **HUD Update:** Made the `Rewards` pill in the HUD's perk strip (`App.jsx`) a clickable `<button>`.
- **New UI:** Created `frontend/src/components/RewardsHistoryModal.jsx` to render the history log, mirroring the design of `DeathsModal.jsx`.
- **Verification:** Added `frontend/e2e/rewards-history.spec.js` which verifies that purchases and badge earns correctly populate the modal.
- **Version:** Bumped `GAME_ITERATION` to `v0.4.41` in `frontend/src/version.js` and updated the `VersionModal.jsx` changelog. Deployed.

## Parked / Next steps

- **Slice B (HUD Pills):** Still parked pending Ken's decision on whether the values should reflect difficulty mechanics or just shop purchases.
- **Play Recap (Addendum):** Still parked pending Ken's decision on where the recap should live and how it should handle negative events.
- See `docs/roadmap.md` and `docs/handoffs/roadmap-handoff-v0.4.41-plan.md` for details.
