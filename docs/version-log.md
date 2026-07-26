# Version Log — Skib-Jay-Dee-Toilet

This file memorializes the design and plan decisions made during the
front-end upgrade pass.

## v0.2.0

**Date:** July 26, 2026  
**Commit:** `c699164` (`Upgrade toilet game front end`)

### What changed

- Upgraded the game from a Phase 1 single-scene prototype into a fuller
  front-end-only playable build.
- Added three levels and progression.
- Fixed sprint so it behaves like a held input instead of getting stuck.
- Added desktop keyboard controls with Arrow keys / WASD movement and
  SPACE boost support.
- Added a working Shleeb shop that spends and persists sheebs.
- Added cookie-backed persistence for user id, balance, owned items, and
  highest cleared level.
- Randomized the default Runner and Chaser faces from local gallery assets
  every time the player presses play.
- Added a new handoff doc for the next agent.

### Design decisions

- Keep the experience front end only for now.
  - The backend scaffold stays untouched until the game loop actually needs
    network persistence or multiplayer.
- Keep the portrait 9:16 layout.
  - The game is still meant to feel like a vertical phone game even when
    played on desktop.
- Keep the local image gallery as the default face source.
  - Randomizing default faces each run gives the game a little variety
    without requiring backend state.
- Keep persistence in cookies for now.
  - This is enough for user id, sheeb balance, and purchase state until a
    real storage layer is justified.
- Keep the shop front-end only.
  - No backend purchase verification yet; the current goal is to prove the
    loop and upgrade economy feel playable.
- Keep level progression simple and readable.
  - Each level is a self-contained map with its own tuning rather than a
    more complex world streaming system.

### Plan decisions

- Priority order for the next coding pass:
  1. Script the World Star intro cinematic.
  2. Add sound effects and background audio.
  3. Improve uploaded face rendering with a crop or oval mask.
  4. Add or tune more levels.
  5. Add more roster content from the PDF if needed.
- Only move to backend persistence or multiplayer after the front-end loop
  feels solid.
- Keep future changes localized to the existing front-end modules unless a
  new architecture is truly required.

### Implementation decisions worth remembering

- `frontend/src/GameEngine.js` owns the canvas hot path.
- `frontend/src/App.jsx` owns menu state, shop state, and profile state.
- `frontend/src/gameContent.js` centralizes shop items and random gallery
  assets.
- `frontend/src/lib/cookies.js` centralizes cookie persistence.
- `frontend/vite.config.js` includes uppercase `.JPG` / `.PNG` assets so the
  local gallery builds correctly.

### Known non-goals for this version

- No backend code was required for the upgrade.
- No audio was added yet.
- No cinematic intro was added yet.
- No crop or oval face mask was added yet.
- No multiplayer or server authority changes were added yet.

