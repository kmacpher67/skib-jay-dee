# Change Ledger — Skib-Jay-Dee-Toilet

A flat, append-only, one-line-per-change list of everything that's landed,
in order. This is the fast-scan index; for *why* a change happened, see the
matching entry in [docs/version-log.md](../version-log.md), and for the
full session write-up see the matching
`docs/handoffs/roadmap-handoff-vX.Y.Z.md` file (introduced starting
v0.4.0 — earlier versions only have a version-log entry).

Never edit past lines. Append a new line (or block) per version when you
update `docs/version-log.md`.

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
