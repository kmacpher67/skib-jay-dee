# Handoff: v0.4.38 (Shipped)

**Created by:** Codex (GPT-5) — 2026-07-27 (backfilled retroactively)
**Last updated by:** Codex (GPT-5) — 2026-07-27

> **Provenance note:** this write-up reconstructs shipped commit `72f3539`
> (`feat: Add Level 6 Nightmare House and Skib-Daddy chaser (v0.4.38)`).
> The code was already landed when this file was added, so treat this as
> the post-ship record required by `docs/skib-sdlc.md`, not the original
> live worklog for that session.

## What was done

Implemented the **Level 6: Jayden's Nightmare House** slice from the
`docs/handoffs/roadmap-handoff-v0.4.38-plan.md` planning doc.

1. **Level 6 map.** Added `JAYDENS_NIGHTMARE_HOUSE_GRID` support in
   `frontend/src/GameEngine.js` and wired the new level into the live
   `LEVELS` array.
2. **Level data extraction.** Finished migrating `buildFloodedAnnex`, `buildRamenAisle`, and `buildWorldStarParkingLot` to the grid parser.
3. **New chaser.** Introduced **Skib-Daddy-Toilet Guy** with the
   placeholder `dad-case` face and a `skib-daddy` chaser type.
4. **Plunger Launch.** Gave Skib-Daddy a pull-style attack that matches
   the intended heavy-chaser pressure for this level.
5. **Quest badge.** Added the **Garage Survivor** badge hook for the new
   garage quest room.
6. **Version modal.** Refreshed `frontend/src/components/VersionModal.jsx`
   so the v0.4.38 note actually renders meaningful title/description text.

## Verification

- `cd frontend && npm run build` — passed.
- `cd frontend && npx playwright test` — passed after fixing the
  close-call test seam in `frontend/e2e/close-call-rewards.spec.js`
  (initialized `engine.newBadges` before calling the freeze helper).
- `GAME_ITERATION` remains `v0.4.38` (`frontend/src/version.js`).

## Design decisions

- Kept Skib-Daddy tied to `levelIndex === 5` so the placeholder face can
  stay independent of the menu's chaser-face selection.
- Left Level 7 parked; this shipped slice is the Level 6 content pass,
  not the endgame climax.

## What is explicitly not done

- Level 7 / CEO of Drains.
- The later death-log telemetry and parody-warning UI slice now tracked
  in `docs/handoffs/roadmap-handoff-v0.4.39-plan.md`.

## Next up

`docs/handoffs/roadmap-handoff-v0.4.39-plan.md` is the current open
planning pass. Its next slice is the Enhanced Death Logs plus the Parody
Warning & Feedback Link UI update.
