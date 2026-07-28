# Handoff: v0.4.60 — Difficulty Selector (Noob-Noob / Casual / 4chan-st)

## Status
**SHIPPED:** 2026-07-28
**Game Iteration:** v0.4.60

## What Shipped
This session implemented the minimal Difficulty Selector slice (as scoped in the `v0.4.60-plan` handoff) to answer the prerequisite for the FOV/desktop-scaling feature and pave the way for Method C (Debt Lock) math.

### 1. Cookie-Backed State (`frontend/src/lib/cookies.js`)
- Added `difficulty` to the persistent profile schema.
- Defaults to `casual` for all new and existing profiles.
- Validation added to `normalizeProfile` to ensure values are restricted to `'noob' | 'casual' | '4chan-st'`.

### 2. Main Menu UI (`frontend/src/App.jsx`)
- Added a `Difficulty Selector` button/pill in the top stat bar of the main menu.
- Values cycle through: `Noob-Noob` ➔ `Casual` ➔ `4chan-st`.
- Implemented `toggleDifficulty` logic to instantly save the updated profile via `syncProfile`.
- Colored the pill dynamically based on difficulty:
  - Noob-Noob: green (`#4ade80`)
  - Casual: standard white
  - 4chan-st: red (`#f87171`)

### 3. Engine Wiring (`frontend/src/components/GameCanvas.jsx` & `frontend/src/GameEngine.js`)
- Exposed `difficulty={profile.difficulty}` prop in `<GameCanvas>`.
- Added `difficulty` to the `GameEngine` constructor parameter destructuring.
- Initialized `this.difficulty = difficulty || 'casual';` in the engine.
- *Note:* The setting is currently read-only in the engine. Modifying chaser speed, debt calculations, or economy logic based on the difficulty is reserved for the upcoming Method C / Debt Lock scope.

### 4. Build & Delivery
- Updated `VersionModal.jsx` and bumped `version.js` to `v0.4.60`.
- Verified the build via `npm run build` and tested successfully in the browser.
- Deployed to production (`kenmacpherson.com`).

## Related Documentation Updates
- Updated `docs/update-directions.md`, `docs/version-log.md`, `docs/handoffs/ledger.md`, and `docs/roadmap.md` to reflect `v0.4.60` as delivered.

## Why this file wasn't created initially
During the Mode B coding session for v0.4.60, the agent correctly updated the ledger, version-log, roadmap, and update-directions, but erroneously missed the step to save a copy of the *completed* handoff (the non-plan version) into the `docs/handoffs/` directory. This has been corrected.
