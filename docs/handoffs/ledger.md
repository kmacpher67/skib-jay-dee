# Change Ledger — Skib-Jay-Dee-Toilet

A flat, append-only, one-line-per-change list of everything that's landed,
in order. This is the fast-scan index; for *why* a change happened, see the
matching entry in [docs/version-log.md](../version-log.md), and for the
full session write-up see the matching
`docs/handoffs/roadmap-handoff-vX.Y.Z.md` file (introduced starting
v0.4.0 — earlier versions only have a version-log entry).

Never edit past lines. Append a new line (or block) per version when you
update `docs/version-log.md`.

## Code Monkey orchestration pass — 2026-07-26

- Added `AGENTS.md` plus the `scripts/run_code_monkey.sh` /
  `scripts/code_monkey_*.py` lane for bounded handoff dispatch.
- Updated `docs/skib-sdlc.md`, `docs/update-directions.md`,
  `docs/next-agent-coding-brief.md`, `docs/roadmap.md`, and the current
  open handoff to advertise the new lane and its Ollama/OpenRouter
  routing hints.

## v0.4.6 — 2026-07-26

- Implemented runner pose-to-state mapping (oldest open handoff item,
  queued since v0.4.1-plan): `frontend/src/GameEngine.js` swaps Jayden's
  face to `jayden-getting-captured` on capture, holds
  `jayden-captured` through the zoomed-in beat, restores the original
  face on chase resume; skipped entirely if the player uploaded a
  custom face.
- Added `RUNNER_STATE_FACES` (`frontend/src/gameContent.js`), a
  `runnerIsCustom` prop threaded through `App.jsx` -> `GameCanvas.jsx` ->
  `GameEngine.setFaces()`, and `window.__skibEngine` debug exposure in
  `GameCanvas.jsx` for e2e verification.
- Added `frontend/e2e/caught-face.spec.js`; full 4-test Playwright suite
  passes.
- Discovered `jayden-getting-captured.jpg`/`jayden-uncaring-4029.jpg` are
  byte-identical duplicates of `jayden-captured.jpg`/`jayden-default.jpg`
  (`md5sum`-confirmed) — flagged as a Ken-only asset follow-up in
  `docs/roadmap.md` and `docs/characters.md`, not fixed/guessed at.
- Added `docs/handoffs/roadmap-handoff-v0.4.6.md`.

## v0.4.5-plan — 2026-07-26

- Scoped a new funny near-capture interlude: pause the chase when a
  skib gets too close, show `jayden-getting-captured.jpg`, and overlay a
  randomized parody caption pool.
- Added the new backlog item to `docs/roadmap.md`.
- Added `docs/handoffs/roadmap-handoff-v0.4.5-plan.md`.

## v0.4.4 — 2026-07-26

- Added new chaser Sky-Diver (Motor Killer): copied
  `images/sky-diver-motor-killer.png` into `frontend/src/assets/`,
  imported it in `frontend/src/gameContent.js`, added a `CHASER_FACE_POOL`
  entry (`sky-diver-motor-killer`).
- Picked up the oldest open handoff (v0.4.1-plan) per Mode B ordering;
  the other unblocked item from that handoff (runner pose-to-state
  mapping) is left for the next session.
- Verified with `npm run build`, the Playwright smoke suite, and a
  headless Chromium run forcing `randomFrom` to select the new pool
  entry to confirm the asset actually loads with no console errors.
- Added `docs/handoffs/roadmap-handoff-v0.4.4.md`.

## v0.4.3-plan — 2026-07-26 (docs-only planning)

- Re-verified the chaser-face-randomization fix (v0.4.2-plan) is live and
  correct in `frontend/src/GameEngine.js:801` — nothing further needed.
- Turned two of v0.4.2-plan's four queued items into fully-specced
  implementation plans (exact lines, exact constants, exact edits): the
  lvl2-video arrival-vs-clear timing fix (move the trigger from
  `onLevelChange` to a data-carrying `onLevelClear`), and the extra-chaser
  join-speed ramp (new `CHASER_JOIN_RAMP_START`/`CHASER_JOIN_RAMP_SECONDS`
  constants, per-chaser `joinRamp` field, layered on top of the existing
  `chaserSpeedMod`).
- Tightened the backlog into a three-session order and mirrored it in the
  handoff copy-paste block so the next agent can keep each session small:
  extra-chaser speed ramp, Pipeworks's 4-chaser/max-speed clear
  condition, then lvl2-video timing fix plus death-visual verification.
- Added `docs/handoffs/roadmap-handoff-v0.4.3-plan.md`.

## v0.4.2-plan — 2026-07-26 (docs-only planning + one pre-existing code fix)

- Committed a chaser-face-randomization fix
  (`frontend/src/GameEngine.js`, `_maybeSpawnExtraChaser()`) found
  already written but uncommitted in the working tree — each extra
  chaser now rolls its own `CHASER_FACE_POOL` entry instead of copying
  the first chaser's face. Builds clean; not this session's own work,
  just landed alongside it.
- Added four bug/feature backlog items to `docs/roadmap.md`: lvl2 video
  fires on arrival instead of on clear, Pipeworks's clear condition
  should require 4 simultaneous chasers (flagged as needing a product
  decision), extra chasers should ramp speed up after joining instead of
  a flat discount, and a "player ded" video item (confirmed via
  `git log --all` that no such clip ever existed in this repo).
- Noted eight unprocessed raw photos in `images/` in `docs/characters.md`.
- Rewrote the stale `docs/next-agent-coding-brief.md` into a concrete
  brief scoped to these four items.
- Added `docs/handoffs/roadmap-handoff-v0.4.2-plan.md`.
- **Follow-up:** user resolved both open design questions in the same
  session. Pipeworks's clear condition confirmed as MAX_CHASERS 3→4 plus
  a skreem threshold gated on all 4 chasers being at max speed; death
  video confirmed as "no new clip, keep the original jump-scare."
  Updated both `docs/roadmap.md` items to `RESOLVED`, extended the
  handoff's copy-paste block with the new dependency order, and updated
  `docs/next-agent-coding-brief.md` so all four items are fully
  unblocked for the next coding session.

## v0.4.1-plan — 2026-07-26 (docs-only, no code shipped)

- Rewrote `docs/characters.md` with real content (runner pose table,
  chaser roster table, planned-new-chasers section).
- Added two new-chaser plan items to `docs/roadmap.md`: Sky-Diver (Motor
  Killer) and a second Yoodeling Unc pose (photo not yet saved to repo).
- Reviewed and documented two face-randomization gaps as roadmap items:
  simultaneous chasers sharing one face, and runner poses never mapped
  to game state.
- Added `docs/handoffs/roadmap-handoff-v0.4.1-plan.md`.

## v0.4.0 — 2026-07-26

- Moved the 11 raw voice clips out of `/audio/` (scratch) into
  `frontend/src/assets/audio/`, transcoded to mono 44.1kHz mp3 per
  `docs/sound-effects-howto.md`, renamed to describe their in-game role
  (e.g. `chaser-bark-close-toiletking.mp3`, `capture-sting-final.mp3`).
- Wired real audio into the previously no-op `GameEngine` hooks:
  `onBoostStart`, `onTired`, plus two new hooks `onChaserBark` and
  `onLevelClear`.
- Added a cookie-persisted mute toggle (`profile.muted`) with a button on
  both the main menu and the in-game HUD.
- Added a low-volume looping chase-ambience track, started on entering
  `playing` and stopped on exit/mute.
- Moved `video/lvl2_thats_total_wipe_out_video_transition.mp4` into
  `frontend/src/assets/video/lvl2-transition.mp4` and wired it as an
  experimental full-screen overlay the first time a run reaches level 2
  (Pipeworks).
- Added a Playwright test for the new mute toggle; discovered and worked
  around a pre-existing CSS bug (`.portrait-frame`'s wide-viewport media
  query) rather than fixing it in-place — logged in
  `docs/future-versions.md`.
- Started this handoff/ledger/future-versions doc trio and linked it from
  `docs/skib-sdlc.md` and `README.md`.

## v0.3.4 — 2026-07-26

- Extracted all in-game text into `frontend/src/dialog.js`.
- Rubber-banded chaser speed across a run (mellow on death, ramp on
  level-up).
- Raised `advanceAt` thresholds; bumped proximity-skreem and chaser-bark
  frequency.
- Added a runner "tired" speech-bubble beat and `onBoostStart`/`onTired`
  no-op hooks (later wired for real in v0.4.0).

## v0.3.3 — 2026-07-26

- Added the first playable audio: a starter loop
  (`jayden-skreem-loop.m4a`), primed on menu interaction, reused as the
  caught-transition sting.

## v0.3.2 — 2026-07-26

- Clarified local-recording vs. shipping-format guidance in
  `docs/sound-effects-howto.md`.

## v0.3.1 — 2026-07-26

- Added `frontend/src/version.js` (`GAME_ITERATION`) and a discreet
  build-iteration badge in the menu/HUD.
- Fixed `scripts/deploy-static.sh` to read the iteration from
  `version.js` instead of taking it as a separate CLI arg (single source
  of truth).

## v0.3.0 — 2026-07-26

- Added The Ramen Aisle and World Star Parking Lot (5 levels total).
- Added a lifetime death counter and a skreem penalty on capture.
- Added the multi-chaser mechanic (extra toilets on a long level).
- Added `docs/skib-sdlc.md`, `docs/roadmap.md`, `docs/sound-effects-howto.md`.

## v0.2.0–v0.2.4 — 2026-07-25/26

- Upgraded from a Phase 1 single-scene prototype to a 3-level playable
  build: fixed sprint, desktop keyboard controls, Shleeb shop, cookie
  persistence, randomized default faces, death counter, process docs.
