# Roadmap Handoff — v0.4.11

**Session date:** 2026-07-26
**Previous version:** v0.4.10 (see `docs/handoffs/roadmap-handoff-v0.4.10.md`).

This was a Mode B (code and delivery) session. It picked up the follow-up
verification from the v0.4.10 review and closed the remaining lvl2
overlay/jump-scare overlap bug, while also cleaning up the stale Pipeworks
test description so the 5-chaser gate reads accurately.

`GAME_ITERATION` stays `v0.4.0`; nothing was deployed.

## What this session did

1. **Made the lvl2 transition overlay dismiss on capture.**
   - `frontend/src/App.jsx`: `handleCaught()` now clears
     `showLvl2Transition` before it sets the capture line and plays the
     catch sting, so the transition video cannot keep covering the
     canvas-drawn jump-scare.
   - `handlePlay()` now resets `showLvl2Transition` too, so a quick exit
     and replay cannot resurrect a stale overlay from the previous run.
2. **Updated the Pipeworks e2e coverage.**
   - `frontend/e2e/pipeworks-clear.spec.js`: changed the test title to
     match the real 5-chaser requirement and updated the setup to spawn
     4 extra chasers instead of 3.
   - Added `frontend/e2e/lvl2-transition-clears-on-caught.spec.js`,
     which forces Pipeworks clear, confirms the transition video appears
     on the clear, then forces a capture and asserts the overlay
     unmounts.
3. **Updated docs.**
   - `docs/roadmap.md` (closed the overlap item), `docs/version-log.md`,
     `docs/update-directions.md`, `docs/future-versions.md`,
     `docs/handoffs/ledger.md`, and this handoff.

## Verification performed

- `cd frontend && npm run build` succeeds.
- `npx playwright test` — all 7 tests pass.
- Built preview browser probe:
  - the lvl2 overlay was present during Pipeworks clear
  - the lvl2 overlay count dropped to `0` after forcing `caught`
  - the jump-scare was therefore unobstructed by the transition video

## What's explicitly not done

- No `GAME_ITERATION` bump or deploy.
- No new death clip.
- No near-capture interlude yet.

## Copy-paste: next natural steps for the next agent

```
Read docs/skib-sdlc.md (Mode B), then docs/update-directions.md, then
docs/roadmap.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.11.md).

The lvl2 overlay/jump-scare overlap fix is complete. Pick up the next
small open increment:

- Near-capture interlude from docs/handoffs/roadmap-handoff-v0.4.5-plan.md
  — pause the chase, show jayden-getting-captured.jpg full-screen, and
  overlay a short parody caption pool as a separate comedic beat from the
  real caught/jump-scare path.

Keep it front-end only. After coding: cd frontend && npm run build must
succeed; run npx playwright test; update docs/version-log.md,
docs/update-directions.md, docs/roadmap.md, docs/handoffs/ledger.md, and
create docs/handoffs/roadmap-handoff-vX.Y.Z.md; then commit. Do not bump
GAME_ITERATION or deploy unless the user explicitly asks to publish.
```
