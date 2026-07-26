# Version Log — Skib-Jay-Dee-Toilet

This file memorializes the design and plan decisions made during the
front-end upgrade pass.

## v0.3.1

**Date:** July 26, 2026

### What changed

- Added a shared build-iteration constant in `frontend/src/version.js`
  and surfaced it discreetly in both the main menu and the in-game HUD.
- Updated `scripts/deploy-static.sh` so it builds the frontend, rsyncs the
  output into the website repo, stages only the
  `skib-jay-dee-toilet-game/` subtree, and commits with the message format
  `kenmacpherson.com - skib-jay-dee toilet game: <iteration> <short-name>`.
- Updated the deployment and handoff docs so the next session uses the
  same short iteration slug when publishing.

### Design / plan note

- The iteration label is intentionally small and non-intrusive so it can
  help match a running build to the deploy commit without adding more UI
  noise.
- Keeping the version string in one frontend module makes future bumps a
  single-file change for both the menu badge and the HUD marker.
- The deploy helper now treats the website folder as the source of truth
  for the published static site and only commits the skib subtree, which
  keeps unrelated website files out of this game's deploy history.

### Known non-goals for this version

- No gameplay or content changes were made in this pass.
- No audio, intro cinematic, or face-crop work was added yet.

### Addendum: deploy script had two sources of truth

- The first pass at `scripts/deploy-static.sh` took the iteration label as
  a manual `<iteration>` CLI arg, separate from `GAME_ITERATION` in
  `frontend/src/version.js`. Nothing enforced that the two matched, so a
  deploy commit message could silently disagree with the iteration tag
  actually baked into that build.
- Fixed by having the script read `GAME_ITERATION` straight out of
  `frontend/src/version.js` instead of accepting it as an argument.
  `version.js` is now the only place the iteration is set; the script
  only takes `<short-name>`: `./scripts/deploy-static.sh intro-badge`.
- Verified with a real deploy run (`version-single-source-fix`): build
  succeeded, rsync populated the website subtree, and the website repo
  committed as `kenmacpherson.com - skib-jay-dee toilet game: v0.3.1
  version-single-source-fix` (commit `ad48764`, not pushed).

## v0.3.0

**Date:** July 26, 2026

### What changed

This entry reconciles v0.2.1–v0.2.4 (which landed piecemeal) into one
accurate summary of where the code actually ended up this session:

- Added two more levels — The Ramen Aisle and World Star Parking Lot —
  bringing the total to five (Porcelain Palace → Pipeworks → Flooded
  Annex → Ramen Aisle → Parking Lot), each with its own theme/wall
  layout per the PDF's map ideas.
- Added a lifetime death counter, persisted via cookies, shown on the
  main menu and in the in-game HUD.
- Getting caught now deducts 30% of the current skreem total (skreems
  were previously never lost).
- Added a multi-chaser mechanic: if the runner survives ~14s of
  uninterrupted chase, another toilet joins from a random corner (capped
  at 3 total). All extra chasers reset back to one on capture or level
  change. HUD shows "TOILETS ON YOU" once more than one is active.
- Added `crazy-jack-chaser.jpeg` to the chaser face pool.
- Added `docs/skib-sdlc.md` (session process for every agent),
  `docs/roadmap.md` (phased backlog + a levels/maps scaling plan, plan
  only), and `docs/sound-effects-howto.md` (audio how-to, nothing
  implemented yet).

### Design / plan note

- Death and skreem-loss are treated as part of the core economy now, not
  just a display counter — this is what makes surviving vs. getting
  caught actually matter for the sheeb payout loop.
- Multi-chaser pressure is deliberately time-based (not skill-based) so
  a level can't be trivially "camped" once the runner learns the map —
  it forces the level-advance skreem threshold to be cleared before the
  chase gets harder than intended.
- Level data is still hardcoded per-level `buildXxx()` functions. That's
  fine at 5 levels; the roadmap's levels/maps plan says to extract it to
  data *before* hand-authoring a 6th/7th.

### Known non-goals for this version

- No audio, no intro cinematic, no face-crop, no backend/multiplayer —
  all still open, tracked in `docs/roadmap.md`.

## v0.2.4

**Date:** July 26, 2026

### What changed

- Added `docs/skib-sdlc.md` to codify the session workflow for future
  agents.
- Added `docs/roadmap.md` as the session-sized backlog to pull from.
- Added `docs/sound-effects-howto.md` as a starter guide for the upcoming
  audio pass.

### Design / plan note

- The repo now has a clearer docs stack for iterative development:
  - `README.md` for project overview
  - `docs/version-log.md` for durable version history
  - `docs/update-directions.md` for the next handoff
  - `docs/skib-sdlc.md` for process rules
  - `docs/roadmap.md` for the next increment queue
  - `docs/sound-effects-howto.md` for the audio subtask kickoff
- This pass intentionally did not change gameplay code; it only tightened
  the documentation trail so the next coding session starts with less
  guessing.

## v0.2.3

**Date:** July 26, 2026

### What changed

- Added the repo-wide session process doc in `docs/skib-sdlc.md`.
- Added a working backlog file in `docs/roadmap.md` so the new session
  process has a concrete increment list to pull from.
- Reinforced the docs-first workflow for iterative development and review.

### Design / plan note

- Documentation now has three layers:
  - `docs/version-log.md` for durable versioned decisions.
  - `docs/update-directions.md` for the immediate handoff to the next agent.
  - `docs/roadmap.md` for the next single-session increments.
- The new `docs/skib-sdlc.md` process doc is intentionally explicit about
  reading order, build verification, and committing every meaningful
  increment.

## v0.2.2

**Date:** July 26, 2026

### What changed

- Added persistent "times killed" tracking to the profile and menu/HUD.
- Kept the existing kill counter in the canvas engine and saved it to
  cookies through the front-end profile flow.

### Design / plan note

- Death count is treated as part of the player profile, alongside user id,
  sheebs, owned items, and best level.
- The counter is intentionally front-end only for now because the current
  game loop still does not depend on backend state.

## v0.2.1

**Date:** July 26, 2026

### What changed

- Added `crazy-jack-chaser.jpeg` to the randomized chaser face pool so it
  can appear during play.
- Kept the rest of the front-end gameplay loop unchanged.

### Design / plan note

- New gallery assets should be folded into `frontend/src/gameContent.js`
  and recorded here so the random-face pool stays auditable over time.

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
