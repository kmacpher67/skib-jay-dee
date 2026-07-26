# Update Directions — Skib-Jay-Dee-Toilet

Use this as the handoff doc for the next agent working in the repo.

## Current state

- Front end only. The backend scaffold exists, but the current gameplay and menu do not call it.
- `frontend/src/GameEngine.js` now handles the chase loop, jump-scare, five levels, desktop keyboard controls, sprint fixes, a death/skreem-penalty economy, a multi-chaser mechanic (extra toilets join in if a level runs long), and the discreet iteration badge in the HUD.
- `frontend/src/App.jsx` owns the menu, face upload, Shleeb shop, cookie-backed profile state, the play/session handoff, and the matching menu build tag.
- `frontend/src/version.js` is the single place to bump the visible iteration number.
- Default faces are randomly shuffled from the local gallery each time the user presses play, unless they upload custom faces.
- User id, sheeb balance, purchased items, death count, and highest cleared level persist in cookies.
- The deployment helper now takes an iteration label and short slug, then commits only the `skib-jay-dee-toilet-game/` subtree in the website repo.
- The audio how-to now spells out local recording guidance: capture however is convenient, keep raw edits lossless if possible, and export game-ready clips as mono `.ogg` or `.mp3` at 44.1kHz.
- The frontend now has a starter audio loop in `frontend/src/assets/audio/jayden-skreem-loop.m4a`; the menu primes it on first interaction and the caught transition reuses the same clip as a quick sting.
- All in-game text lives in `frontend/src/dialog.js` (`CAPTURE_LINES`, `CHASER_LINES`, `TIRED_LINES`) — edit lines there, not in `GameEngine.js`.
- Chaser speed is now rubber-banded across a run (mellows out on capture, ramps up on level-up) instead of fixed per level; see `CHASER_SPEED_MOD_*` constants in `GameEngine.js`. Levels also last longer (raised `advanceAt`) and proximity skreem gain/chaser barks are more frequent.
- `GameEngine` now exposes `onBoostStart`, `onTired`, `onChaserBark`, and `onLevelClear` constructor-option hooks, all wired to real audio as of v0.4.0 (see below) — no more no-ops.
- **v0.4.0 audio pass:** the 11 recorded voice clips from `/audio/` (scratch, now removed) were transcoded to mono 44.1kHz mp3 and moved into `frontend/src/assets/audio/` with names describing their in-game role. They're wired into `App.jsx`: chase ambience loop, capture sting, chaser bark/scream/taunt pool, boost stinger, tired groan, level-start/level-clear stings. A cookie-persisted mute toggle (`profile.muted`) has a button on the menu and in-game HUD.
- **Lvl2 video transition:** `frontend/src/assets/video/lvl2-transition.mp4` (moved from repo-root `/video/`) plays once as a full-screen overlay the first time a run reaches level 2. User-flagged as a rough clip — treat as a proof of concept, see `docs/future-versions.md`.
- Full session detail: `docs/handoffs/roadmap-handoff-v0.4.0.md`. Flat change history: `docs/handoffs/ledger.md`. Scoped-out work: `docs/future-versions.md`.

## Files to check first

- `README.md`
- `docs/skib-sdlc.md`
- `docs/version-log.md`
- `docs/roadmap.md`
- `docs/sound-effects-howto.md`
- `docs/dev-notes.md`
- `frontend/src/GameEngine.js`
- `frontend/src/dialog.js`
- `frontend/src/App.jsx`
- `frontend/src/gameContent.js`
- `frontend/src/version.js`
- `frontend/src/lib/cookies.js`
- `frontend/src/components/GameCanvas.jsx`
- `frontend/src/components/ShopModal.jsx`

## Current gameplay features

- Mobile joystick still works bottom-left.
- Sprint button is now a hold-to-run state instead of getting stuck.
- Desktop players can use Arrow keys or WASD to move and SPACE to boost.
- The canvas currently has five levels:
  - Porcelain Palace
  - Pipeworks
  - Flooded Annex
  - The Ramen Aisle
  - World Star Parking Lot
- The Shleeb shop is front-end only and sells stat upgrades that persist in cookies.
- The profile tracks lifetime deaths (shown in the menu and the in-game HUD); getting caught also deducts a chunk of the current skreem total.
- If the runner survives a level too long without getting caught, extra toilets join the chase (capped, resets on capture or level change) — the HUD shows "TOILETS ON YOU" once more than one is active.
- A discreet version/iteration label now appears in the menu and the in-game HUD so deploys can be matched to a visible build tag.
- New chaser/runner faces are added by dropping an image in `frontend/src/assets/` and adding one entry to `RUNNER_FACE_POOL` / `CHASER_FACE_POOL` in `frontend/src/gameContent.js` — see `crazy-jack-chaser` for the pattern.

## Where to edit things

- Add or rebalance levels in `frontend/src/GameEngine.js`.
- Add or change shop items in `frontend/src/gameContent.js`, then keep the purchase logic aligned in `frontend/src/App.jsx`.
- Change persistence fields in `frontend/src/lib/cookies.js`.
- Bump the visible iteration in `frontend/src/version.js` when you want a new build tag.
- Change menu/shop presentation in `frontend/src/App.jsx` and `frontend/src/App.css`.
- Change game HUD, controls, or level rendering in `frontend/src/GameEngine.js`.

## Natural follow-up work

- Do a real sound-on playthrough of the v0.4.0 audio pass — it was wired and tested (build + Playwright) but never actually listened to in this sandbox (no speakers). Check volume balance before building more on top of it.
- Audio polish: volume ducking, a real composed menu theme, 1:1 capture-line/chaser-bark clips instead of a themed pool. See [docs/future-versions.md](docs/future-versions.md).
- Add a skip button to the lvl2 video transition, and/or replace the clip (user-flagged as rough).
- Fix the `.portrait-frame` wide-viewport CSS bug found during v0.4.0 testing (see [docs/future-versions.md](docs/future-versions.md)) — worked around in the test, not fixed in the app.
- Add the scripted World Star intro cinematic (full script from the PDF, not the standalone lvl2 video clip).
- Crop or mask uploaded faces instead of stretching the raw image.
- Add more character roles or abilities from the PDF roster.
- Extract level data out of hardcoded map-builder functions before hand-authoring more levels — see the level/map plan in [docs/roadmap.md](docs/roadmap.md).
- Wire up backend persistence or multiplayer only after the front-end loop feels solid.

## Version record

- The current upgrade checkpoint is documented in [docs/version-log.md](docs/version-log.md).
- When future agents make a meaningful change, append a new version section there so the design and plan trail stays durable.
- Follow the session process in [docs/skib-sdlc.md](docs/skib-sdlc.md) and pull the next increment from [docs/roadmap.md](docs/roadmap.md).

## Constraints to keep respecting

- Keep the app front-end only unless the user explicitly asks for backend work.
- Keep the portrait 9:16 layout.
- Do not break the cookie profile flow when touching the shop or the level rewards.
- Preserve the local image gallery behavior so random defaults still change between plays.
