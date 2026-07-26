# Roadmap Handoff — v0.4.17

**Session date:** 2026-07-26
**Previous version:** v0.4.16 (see `docs/handoffs/roadmap-handoff-v0.4.16.md`).

This was a Mode B implementation session picking up the Dad Case Environmental Traps item defined in the `v0.4.17-plan` handoff.

## What this session did

1. **Passed faceId from GameEngine:** Modified `_maybeSpawnExtraChaser()` in `frontend/src/GameEngine.js` to look up the chaser's `faceId` from `CHASER_FACE_POOL` and include it in the `onExtraChaserSpawn` payload.
2. **Added overlay state and UI:** Updated `App.jsx` and `index.css` to listen for the `dad-case` faceId. When the event triggers, it sets `dadCaseSpawned` to true, rendering a full-screen `.dad-case-darkness` CSS overlay.
3. **Used a text placeholder for the sound:** As explicitly requested by the user, we bypassed checking for a sound file and directly used a text overlay ("*DOOR SLAM SOUND*") as a placeholder for the sound effect.
4. **Resets:** Wired the `dadCaseSpawned` state to reset cleanly on `handlePlay`, `handleLevelChange`, and `handleCaught`.
5. **Verified and Shipped:** Built the project, successfully passed the 10-test Playwright suite, updated the docs, bumped `GAME_ITERATION` to `v0.4.17`, committed, and deployed.

## What was explicitly skipped (non-goals)

- Did not add the actual sound file, as the user requested stubbing it out with text for now.
- Did not tackle the "Version page" or "Game Identity & New Profiles" backlog items (left for the next step).

## Copy-paste: next natural steps for the next agent

```text
Read docs/skib-sdlc.md (Mode B), then docs/update-directions.md, then docs/roadmap.md, then this file (docs/handoffs/roadmap-handoff-v0.4.17.md).

The next unclaimed items in the backlog include:
1. **Version page:** Add a simple page/panel to the menu showing the current `GAME_ITERATION` plus a short changelog.
2. **Game identity & new profiles:** Let a player keep their existing profile and start a new one (multiple save slots).
3. **Parody Attribute System (Panic, Grip, Scream, Sus):** Plan the sub-increments for this new stat block feature.

Unless the user explicitly asks for something else, pick the "Version page" task first as it's the oldest unclaimed feature in the queue.

Verify with `cd frontend && npm run build && npx playwright test`.
Update docs/version-log.md, docs/update-directions.md, docs/roadmap.md, docs/handoffs/ledger.md, and commit. Bump GAME_ITERATION and deploy only once verified working locally.
```
