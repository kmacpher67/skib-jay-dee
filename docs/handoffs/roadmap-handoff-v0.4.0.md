# Roadmap Handoff — v0.4.0

**Session date:** 2026-07-26
**Previous version:** v0.3.4 (see `docs/handoffs/ledger.md` for what came before this file existed)

## What this session did

1. **Audio pass (Phase 2 of `docs/roadmap.md`), first real implementation.**
   Moved the 11 raw voice clips the user recorded/collected out of the
   repo-root `/audio/` scratchpad, transcoded each to mono 44.1kHz mp3
   (per `docs/sound-effects-howto.md`'s shipping-format guidance), and
   renamed them to describe their in-game role instead of their original
   ad-hoc filenames. See `frontend/src/assets/audio/` for the result.
2. **Wired those clips into gameplay**, closing out Audio 2, 3, 4, and 5
   from the old `docs/roadmap.md` backlog:
   - `onBoostStart` → `boost-start-igottago-x2.mp3`
   - `onTired` → `runner-tired-run.mp3`
   - New `onChaserBark` hook (fires whenever the on-screen `CHASER_LINES`
     bubble refreshes) → random pick from a 5-clip bark/scream/taunt pool
   - New `onLevelClear` hook (fires on level-up) →
     `level-win-cant-catch-me.mp3`
   - `onLevelChange` (existing hook, previously menu/UI only) →
     `level-start-igottago.mp3`
   - A new low-volume looping ambient track
     (`chase-ambient-bopbop.mp3`) while `screen === 'playing'`
   - The catch/jump-scare sting now uses a dedicated clip
     (`capture-sting-final.mp3`) instead of reusing the menu loop
3. **Added a mute toggle**, cookie-persisted (`profile.muted` in
   `frontend/src/lib/cookies.js`), with a button on the menu
   (`.mute-btn-menu`) and in-game HUD (`.mute-btn`).
4. **Wired the "lvl2 video transition" video** (Gemini-generated, flagged
   by the user as rough) as an experimental full-screen overlay the first
   time a run reaches level 2. See `docs/future-versions.md` for the
   known rough edges (no skip button, hardcoded to level index 2, etc.) —
   this is a proof of concept, not a finished feature.
5. **Added a Playwright test for the mute toggle** and, in the process,
   found (but did not fix) a pre-existing CSS bug in `.portrait-frame`'s
   wide-viewport media query — see `docs/future-versions.md`.
6. **Started this handoff/ledger/future-versions doc trio** (this file,
   `docs/handoffs/ledger.md`, `docs/future-versions.md`) and linked them
   from `docs/skib-sdlc.md` and `README.md`.
7. Bumped `GAME_ITERATION` to `v0.4.0` in `frontend/src/version.js` and
   ran the deploy script.

## Verification performed

- `cd frontend && npm run build` — succeeded.
- `cd frontend && npm run test:e2e` — all 3 Playwright specs pass
  (menu/quick-play, shop modal, new mute toggle test).
- Did not manually listen to the audio in a real browser (sandboxed,
  no speakers) — playback logic was verified by code path (hooks fire,
  `Audio` objects preload/play/pause correctly per existing
  `playCaughtAudio`/`startMenuAudio` pattern) and by the automated tests
  confirming the mute state and canvas/game still function. **A human
  should do a real playthrough with sound on before trusting the mix.**

## What's explicitly not done (see docs/future-versions.md for detail)

- Volume ducking / a separate music-vs-SFX volume slider.
- Per-line capture/chaser-bark audio clips (currently a themed pool, not
  a 1:1 match to each text line).
- A real composed menu theme (still a repurposed voice clip).
- A skip button for the lvl2 transition video.
- The `.portrait-frame` wide-viewport CSS bug found during testing.

## Copy-paste: next natural steps for the next agent

```
Read docs/skib-sdlc.md, then docs/update-directions.md, then
docs/handoffs/roadmap-handoff-v0.4.0.md (this session's handoff) and
docs/future-versions.md (parking lot for what's next). Audio Phase 2
landed this session (see the ledger at docs/handoffs/ledger.md) — pull
the next single-session increment from docs/roadmap.md's "Incremental
backlog" or docs/future-versions.md, whichever fits. Do a real
sound-on playthrough of the audio pass before building on top of it,
since the agent that wired it couldn't hear it. Follow the skib-sdlc
process: build, test, update docs (append a new
docs/handoffs/roadmap-handoff-vX.Y.Z.md + docs/handoffs/ledger.md entry
+ docs/version-log.md entry), commit, then bump GAME_ITERATION and run
./scripts/deploy-static.sh <short-name> if the user wants it live.
```
