# Update Directions — Skib-Jay-Dee-Toilet

Use this as the handoff doc for the next agent working in the repo.

## Current state

- Front end only. The backend scaffold exists, but the current gameplay and menu do not call it.
- `frontend/src/GameEngine.js` now handles the chase loop, jump-scare, five levels, desktop keyboard controls, sprint fixes, a death/skreem-penalty economy, a multi-chaser mechanic (extra toilets join in if a level runs long, with Pipeworks tuned for five simultaneous chasers), and the discreet iteration badge in the HUD.
- `frontend/src/App.jsx` owns the menu, face upload, Shleeb shop, cookie-backed profile state, the play/session handoff, the delayed chase-ambient start, the lvl2 transition timing/overlay-dismiss behavior, and the matching menu build tag. The lvl2 transition still needs an RCA pass because playtesting says it fires too early and can crash shortly after the video starts.
- `frontend/src/version.js` is the single place to bump the visible iteration number.
- The repo now also has a code-monkey lane: `./scripts/run_code_monkey.sh`
  can dispatch a bounded handoff to local Ollama using the shell's
  `OLLAMA_HOST` or to OpenRouter. A handoff can advertise its target
  backend/model with `code_monkey_backend` and `code_monkey_model`, and
  the lane now understands named Ollama host profiles
  (`thinkpad-local`, `desktop-gaming`) so the cheap local box can stay
  the default.
- Default faces are randomly shuffled from the local gallery each time the user presses play, unless they upload custom faces.
- User id, sheeb balance, purchased items, death count, and highest cleared level persist in cookies.
- The deployment helper now takes an iteration label and short slug, then commits only the `skib-jay-dee-toilet-game/` subtree in the website repo.
- The audio how-to now spells out local recording guidance: capture however is convenient, keep raw edits lossless if possible, and export game-ready clips as mono `.ogg` or `.mp3` at 44.1kHz.
- The frontend now has a starter audio loop in `frontend/src/assets/audio/jayden-skreem-loop.m4a`; the menu primes it on first interaction and the caught transition reuses the same clip as a quick sting.
- All in-game text lives in `frontend/src/dialog.js` (`CAPTURE_LINES`, `CHASER_LINES`, `TIRED_LINES`) — edit lines there, not in `GameEngine.js`.
- Chaser speed is now rubber-banded across a run (mellows out on capture, ramps up on level-up) instead of fixed per level; see `CHASER_SPEED_MOD_*` constants in `GameEngine.js`. Levels also last longer (raised `advanceAt`) and proximity skreem gain/chaser barks are more frequent.
- `GameEngine` now exposes `onBoostStart`, `onTired`, `onChaserBark`, `onLevelClear`, and `onExtraChaserSpawn` constructor-option hooks, all wired to real audio or timing hooks as of v0.4.10 — no more no-ops.
- **v0.4.0 audio pass:** the 11 recorded voice clips from `/audio/` (scratch, now removed) were transcoded to mono 44.1kHz mp3 and moved into `frontend/src/assets/audio/` with names describing their in-game role. They're wired into `App.jsx`: chase ambience loop, capture sting, chaser bark/scream/taunt pool, boost stinger, tired groan, level-start/level-clear stings. A cookie-persisted mute toggle (`profile.muted`) has a button on the menu and in-game HUD.
- **Lvl2 video transition:** `frontend/src/assets/video/lvl2-transition.mp4` (moved from repo-root `/video/`) plays once as a full-screen overlay the first time a run clears Pipeworks and reaches level 2. User-flagged as a rough clip — treat as a proof of concept, see `docs/future-versions.md`.
- A new docs-only plan now queues a funny near-capture interlude that uses `frontend/src/assets/jayden-getting-captured.jpg` as a pause card with parody captions. It is intentionally separate from the real caught/jump-scare state.
- Full session detail: `docs/handoffs/roadmap-handoff-v0.4.0.md`. Flat change history: `docs/handoffs/ledger.md`. Scoped-out work: `docs/future-versions.md`.
- **v0.4.1-plan (docs-only):** no code changed, `GAME_ITERATION` is still `v0.4.0`. `docs/characters.md` was rewritten with real content (runner pose table, chaser roster table, planned-new-chasers section). Two new chasers are queued as plan-only roadmap items — Sky-Diver (Motor Killer), source photo already at `images/sky-diver-motor-killer.png`; and a second Yoodeling Unc pose, photo not yet saved to the repo. Also reviewed (not fixed) two randomization gaps: all simultaneous chasers share one face (`frontend/src/GameEngine.js:419-421`), and the five `RUNNER_FACE_POOL` poses are never mapped to game state. See `docs/handoffs/roadmap-handoff-v0.4.1-plan.md` for the copy-paste next-steps block.
- **v0.4.2-plan (docs-only, real code):** no new code changed as this session's own work, but it also landed a complete, already-written **chaser face randomization fix** found uncommitted in the working tree — `_maybeSpawnExtraChaser()` in `frontend/src/GameEngine.js` now gives each newly-spawned extra chaser its own independent `randomFrom(CHASER_FACE_POOL)` pick instead of copying `this.chaser.face`, so simultaneous toilets no longer all wear one identical face. Lead-chaser face behavior (`setFaces()`) is unchanged. Verified with `npm run build` and the existing Playwright smoke suite (both pass); no new automated test covers the multi-chaser-spawn path itself (it only fires after 14s of uninterrupted chase — too slow for the current smoke suite), logged as a test-coverage gap in `docs/future-versions.md`. `GAME_ITERATION` is still `v0.4.0` (no deploy requested). This session also queued four more items in `docs/roadmap.md` from user playtesting feedback: (1) the lvl2 transition video fires on *arriving* at Pipeworks instead of on *clearing* it (`App.jsx:156-166`) — ready to fix; (2) Pipeworks's clear condition should require surviving 4 simultaneous chasers instead of the current skreem-timer-only `advanceAt`, but needs a product decision (`MAX_CHASERS` is `3`, not 4) — ask the user before coding; (3) extra chasers spawned by `_maybeSpawnExtraChaser()` join at a flat `0.92x` speed forever instead of ramping up after joining — ready to fix; (4) confirmed via full `git log` that no "player ded" death video has ever existed in this repo (the only death feedback is the canvas jump-scare `_drawJumpscare()`). **Both open questions (items 2 and 4) were resolved by the user in a same-day follow-up:** Pipeworks's clear condition is now MAX_CHASERS 3→4 plus a skreem threshold gated on all 4 chasers reaching max speed (exact threshold left tunable); the death video stays as-is, no new clip. All four items in `docs/roadmap.md` are now fully unblocked, recommended order: speed-ramp → clear-condition → video-timing → death-visual verification. Also noted eight more unprocessed raw photos in `images/` in `docs/characters.md`, and rewrote `docs/next-agent-coding-brief.md` twice (once stale-cleanup, once to reflect the resolved decisions). See `docs/handoffs/roadmap-handoff-v0.4.2-plan.md` for the copy-paste next-steps block.
- **v0.4.3-plan (docs-only):** started from a request to work the "chaser face randomization fix," but re-verified that item already shipped in v0.4.2-plan (`frontend/src/GameEngine.js:801`, confirmed still correct) — nothing left to do there; redirected (per the user) to documenting a tighter three-session order in `docs/handoffs/roadmap-handoff-v0.4.3-plan.md`: session 1 extra-chaser speed ramp, session 2 Pipeworks's 4-chaser/max-speed clear condition, session 3 lvl2-video timing fix plus death-visual verification. No code changed, no build run, `GAME_ITERATION` still `v0.4.0`. Also found and cleaned up a stray orphaned text fragment left in `docs/roadmap.md` by the concurrent v0.4.2-plan follow-up edit. `docs/next-agent-coding-brief.md` and the v0.4.3 handoff now mirror that same three-session order.
- **v0.4.4 (real code):** picked up the oldest open handoff (`docs/handoffs/roadmap-handoff-v0.4.1-plan.md`) per Mode B ordering, and shipped one of its two remaining unblocked items — the new **Sky-Diver (Motor Killer)** chaser. `images/sky-diver-motor-killer.png` copied into `frontend/src/assets/`, imported in `frontend/src/gameContent.js`, added to `CHASER_FACE_POOL` (tenth entry, id `sky-diver-motor-killer`). No engine changes needed. Verified with `npm run build`, the Playwright smoke suite, and a headless-Chromium run forcing `Math.random` so `randomFrom(CHASER_FACE_POOL)` resolved to the new entry — confirmed the browser actually requests and loads the asset with no console errors, not just that it's present in the bundle. `GAME_ITERATION` stays `v0.4.0`, no deploy. The other remaining v0.4.1-plan item — runner pose-to-state mapping — was deliberately left for a separate session (single-increment sizing rule); the second Yoodeling Unc pose is still blocked on the user. See `docs/handoffs/roadmap-handoff-v0.4.4.md` for the copy-paste next-steps block.
- **v0.4.5-plan (docs-only):** scoped a new "funny near-capture interlude" backlog item (pause-card + parody captions using `jayden-getting-captured.jpg`, deliberately kept separate from the real caught/jump-scare state). No code changed. See `docs/handoffs/roadmap-handoff-v0.4.5-plan.md`.
- **v0.4.8 (real code, most recent session):** picked up Session 1 of the v0.4.3-plan three-session backlog (the oldest unfinished handoff, older than v0.4.5-plan's near-capture interlude) — **extra-chaser speed ramp**. `frontend/src/GameEngine.js`'s `_maybeSpawnExtraChaser()` no longer gives new chasers a flat `* 0.92` speed discount forever; each now gets a `joinRamp: 0` field that climbs to `1` over `CHASER_JOIN_RAMP_SECONDS` (5s), multiplied into the existing `chaser.baseSpeed * this.chaserSpeedMod` calc via a new `lerp()` helper — layered on top of the run-level rubber-band, not replacing it. Tried the code-monkey lane first per the user's ask: confirmed operational (Ollama reachable on `thinkpad-local`/`desktop-gaming`), but a real dispatch on a session-1-scoped prompt returned a diff with wrong line numbers, an invented `MAX_CHASERS = 5`, and a duplicate declaration — not usable, so implemented directly instead. Added `frontend/e2e/chaser-join-ramp.spec.js` (forces an immediate extra-chaser spawn and asserts the ramp behavior); full 5-test Playwright suite passes. `GAME_ITERATION` stays `v0.4.0`, no deploy requested. See `docs/handoffs/roadmap-handoff-v0.4.8.md`.
- **v0.4.6 (real code):** finished clearing the v0.4.1-plan backlog by implementing **runner pose-to-state mapping**, the item flagged as the next natural step in v0.4.4. `frontend/src/GameEngine.js` now swaps Jayden's face to `jayden-getting-captured` the instant a capture happens, holds `jayden-captured` once the jump-scare zoom finishes (`zoom >= 3`), and restores the run's original face once the chase resumes — skipped entirely if the player uploaded a custom face (new `runnerIsCustom` flag threaded `App.jsx` → `GameCanvas.jsx` → `GameEngine.setFaces()`). Added `RUNNER_STATE_FACES` to `frontend/src/gameContent.js` and a new Playwright test, `frontend/e2e/caught-face.spec.js`, that forces an immediate capture (teleporting the chaser onto the runner via a new debug hook, `window.__skibEngine`, exposed from `GameCanvas.jsx`) and asserts the face swaps by object identity through both states, then restores; full 4-test suite passes. **Found and flagged, did not fix:** `md5sum` confirms `jayden-getting-captured.jpg` == `jayden-captured.jpg` and `jayden-uncaring-4029.jpg` == `jayden-default.jpg`, byte-for-byte — only 3 of the 5 documented runner poses are actually distinct photos. The swap logic is correct and ready, but the capture beat will visibly show the same photo twice until Ken supplies real distinct shots (or confirms the pool should collapse to 3 poses) — flagged in `docs/roadmap.md` and `docs/characters.md`, not guessed at, per the "real family photos" constraint in `docs/skib-sdlc.md`. `GAME_ITERATION` stays `v0.4.0`, no deploy requested. See `docs/handoffs/roadmap-handoff-v0.4.6.md` for the copy-paste next-steps block.

## Files to check first

- `README.md`
- `AGENTS.md`
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
- `docs/handoffs/roadmap-handoff-v0.4.13-plan.md`
- `scripts/run_code_monkey.sh`
- `scripts/code_monkey_direct.py`

## Code Monkey Start

If you want to launch the bounded automation lane instead of working
manually:

1. Open `docs/handoffs/` and pick the handoff you want the worker to
   execute.
2. Check whether that handoff has `code_monkey_backend` and
   `code_monkey_model` hints. If not, the local default is Ollama using
   the `thinkpad-local` profile from your shell environment, with
   `OLLAMA_HOST` as the fallback.
3. Run `./scripts/run_code_monkey.sh --dry-run <handoff.md>` once to see
   the exact prompt the worker will get.
4. Run `./scripts/run_code_monkey.sh <handoff.md>` to actually dispatch
   it.
5. Use the handoff's own verification command plus `git diff` to check
   whether the slice worked.
6. To force a profile on the wrapper, add `--profile thinkpad-local` or
   `--profile desktop-gaming`.

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

- RCA the lvl2 transition bug first: reproduce the crash after the video starts, instrument the phase/overlay/chaser-state path, then tighten the gate so the video only appears after 80% map-hall coverage and 15 seconds with 4 simultaneous skibs.
- Do **not** start "Audio 2: 1:1 capture/bark voice clips" next — it
  needs Ken to record real voice clips first, it's not a pure coding
  task. Ask him before treating it as unblocked.
- The v0.4.5-plan near-capture interlude landed in v0.4.12 — no longer on this list.
- Runner pose-to-state mapping landed in v0.4.6 — no longer on this list.
  Its one loose end is a Ken-only ask, not a coding task: supply real
  distinct photos for `jayden-getting-captured`/`jayden-uncaring-4029`
  (currently byte-identical duplicates of `jayden-captured`/
  `jayden-default`), or confirm the pool should collapse to 3 unique
  poses. See `docs/roadmap.md` and `docs/characters.md`.
- Also still open: the 1:1 audio clip work, the World Star intro
  cinematic, the face-crop upload pass, and the other smaller future
  items parked in `docs/roadmap.md`.
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
