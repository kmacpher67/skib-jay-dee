# Roadmap Handoff: v0.4.9-plan (Docs Only)

## Mode A: Planning Session

**Goal:** Answer user questions about difficulty progression, map feasibility, and audio timing, while planning the next coding steps. Addressed the user's requirement to increase the Pipeworks clear condition to surviving 5 skibs and layer the "skibby bob bob" audio later in the run.

## What was decided and updated

1. **Pipeworks Clear Condition & Video Trigger:** 
   - The Lvl2 transition video currently triggers too early (on arrival at Pipeworks instead of upon clearing it).
   - The user requested that the video not play until the player gets past 5 skibs chasing.
   - **Plan:** Increase `MAX_CHASERS` from `3` to `5` in `GameEngine.js`. Tie the `advanceAt` logic for Pipeworks to only count once all 5 chasers are on screen and at max speed. The transition video trigger will be moved from `App.jsx` `handleLevelChange` to `handleLevelClear`.

2. **Audio Layering (skibby bob bob):**
   - The ambient chase audio (`chase-ambient-bopbop.mp3`) starts immediately and is a bit overwhelming.
   - **Plan:** Delay the start of this audio clip in `App.jsx` until the player reaches a certain skreem threshold or after the first extra chaser spawns, layering it in as tension builds rather than blasting it at the start.

3. **Difficulty rubber-banding:**
   - Confirmed the system *does* slow down the skibs on player death (`CHASER_SPEED_MOD_DEATH_STEP` = -10%).
   - Confirmed difficulty increases via level-clear speed bumps (+6%), per-level base speed increases, and extra chasers joining every 14s.

4. **Map Layout Feasibility:**
   - Mixing up maps is highly feasible. Phase 2 of the roadmap's level plan ("Tile-based authoring") will allow for dynamic corners and traps.

## What's explicitly not done

- No code changes were made (this is a Mode A planning session only).
- `GAME_ITERATION` remains unchanged.
- Backend multiplayer remains untouched.

## Copy-paste: next natural steps

```markdown
You are a coding agent picking up from `roadmap-handoff-v0.4.9-plan.md`. This is a Mode B session.

Your tasks in order:
1. **Audio Layering:** In `frontend/src/App.jsx`, delay playing `chase-ambient-bopbop.mp3` until the player has survived for at least 15 seconds or an extra chaser has joined. Currently it plays immediately in `useEffect` when `screen === 'playing'`.
2. **5 Skibs & Video Trigger:** 
   - In `frontend/src/GameEngine.js`, change `MAX_CHASERS` from 3 to 5.
   - Update Pipeworks' clear condition to require 5 active chasers fully ramped to max speed.
   - In `frontend/src/App.jsx`, move the `setShowLvl2Transition(true)` logic from `handleLevelChange` to `handleLevelClear` (or fire a specific event) so it only plays after Pipeworks is cleared, not when it starts.
3. Verify changes locally with `cd frontend && npm run build` and checking the browser.
4. Update `docs/roadmap.md`, `docs/update-directions.md`, `docs/version-log.md`, and create a new `docs/handoffs/roadmap-handoff-vX.Y.Z.md` following `docs/skib-sdlc.md`.
```
