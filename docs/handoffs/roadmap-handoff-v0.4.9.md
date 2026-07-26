# Roadmap Handoff — v0.4.9

**Session date:** 2026-07-26
**Previous version:** v0.4.8 (see `docs/handoffs/roadmap-handoff-v0.4.8.md`).

This was a Mode B (code and delivery) session. Per `docs/skib-sdlc.md`'s ordering rule ("do the oldest open/unfinished handoff, not the newest"), this picked up **Session 2** of the three-session backlog documented in `docs/handoffs/roadmap-handoff-v0.4.3-plan.md` — Pipeworks's 4-chaser/max-speed clear condition.

`GAME_ITERATION` stays `v0.4.0`; nothing was deployed.

## What this session did

1. **Implemented Pipeworks's 4-chaser/max-speed clear condition.**
   - `frontend/src/GameEngine.js`: bumped `MAX_CHASERS` from `3` to `4`.
   - Added `PIPEWORKS_MAX_PRESSURE_SKREEM_GOAL = 68` near the top.
   - Added a `pipeworksSkreems` counter in `_syncLevelState` and `_triggerCaught` (which takes the same death penalty as `levelSkreems`).
   - In `update(dt)`, within the Pipeworks level specifically, `pipeworksSkreems` accumulates only if `this.chasers.length >= MAX_CHASERS` and all chasers have `joinRamp >= 1`.
   - Pipeworks now advances only when `pipeworksSkreems >= PIPEWORKS_MAX_PRESSURE_SKREEM_GOAL`, bypassing its regular `advanceAt` check.
2. **Fixed a pre-existing crash in `_maybeSpawnExtraChaser`.**
   - The chaser face randomization fix from a prior session stored a string URL into `chaser.face` when spawning extra chasers (`randomFrom(CHASER_FACE_POOL)?.src`). This caused `ctx.drawImage` to crash in the game loop.
   - Fixed by instantiating an `HTMLImageElement` (`new Image()`) when assigning the randomized face for extra chasers.
3. **Added e2e coverage.** `frontend/e2e/pipeworks-clear.spec.js` forces an immediate spawn of 3 extra chasers, sets their `joinRamp` to 1, and verifies that `pipeworksSkreems` reaching the threshold triggers the level-up phase.
4. **Updated docs.** `docs/roadmap.md` (checked off the item), `docs/update-directions.md`, `docs/version-log.md`, `docs/handoffs/ledger.md`, and this handoff.

## Verification performed

- `cd frontend && npm run build` succeeds.
- `npx playwright test` — all 6 tests pass (5 pre-existing + `pipeworks-clear.spec.js`).

## What's explicitly not done

- **Session 3 — lvl2 timing fix + death-visual verification.** Move the lvl2 transition trigger off `handleLevelChange`'s arrival index onto the Pipeworks-clear event, then confirm the jump-scare still shows unobstructed. Fully spec'd in `docs/handoffs/roadmap-handoff-v0.4.3-plan.md`.
- **The separate v0.4.5-plan near-capture interlude** — still open, its own increment, not touched this session.
- No `GAME_ITERATION` bump, no deploy — not requested this session.

## Copy-paste: next natural steps for the next agent

```
Read docs/skib-sdlc.md (Mode B: oldest open/unfinished handoff first),
then docs/update-directions.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.9.md), then
docs/handoffs/roadmap-handoff-v0.4.3-plan.md for the full three-session
spec.

Session 1 and 2 are done. Pick up Session 3 next:

Session 3 — lvl2 timing fix + death-visual verification:
- Move the lvl2 transition trigger off `handleLevelChange`'s arrival index
  onto the Pipeworks-clear event.
- App.jsx:156-166 and GameEngine.js:685 — change the `onLevelClear` hook
  to carry data and move the transition flag trigger there.
- Verify: the clip now plays on the Pipeworks -> Flooded Annex transition,
  then confirm the original jump-scare still shows unobstructed and no new
  death clip was introduced.

Each session stays front-end only. Follow docs/skib-sdlc.md: build
(`cd frontend && npm run build`), run `npx playwright test`, update
docs/version-log.md + docs/update-directions.md + docs/roadmap.md + a new
docs/handoffs/roadmap-handoff-vX.Y.Z.md + ledger entry, then commit.
Only bump `GAME_ITERATION` and run `./scripts/deploy-static.sh <short-name>`
if the user explicitly asks to publish.
```
