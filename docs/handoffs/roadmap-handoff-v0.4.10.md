# Roadmap Handoff: v0.4.10

**Session date:** 2026-07-26  
**Previous version:** v0.4.9 (see `docs/handoffs/roadmap-handoff-v0.4.9.md`).

This was a Mode B (code and delivery) session. It landed the requested
5-skib Pipeworks tuning, fixed the lvl2 transition timing bug, and
delayed the chase ambience so it layers in later instead of starting the
moment gameplay begins.

`GAME_ITERATION` stays `v0.4.6`; nothing was deployed.

## What this session did

1. **Bumped Pipeworks to 5 simultaneous chasers.**
   - `frontend/src/GameEngine.js`: changed `MAX_CHASERS` from `4` to `5`.
   - Kept `PIPEWORKS_MAX_PRESSURE_SKREEM_GOAL = 68`.
   - Verified in-browser that a five-chaser Pipeworks setup still clears
     cleanly when all chasers are fully ramped.
2. **Fixed lvl2 transition timing.**
   - `GameEngine.js`: `onLevelClear` now receives `{ index: this.levelIndex + 1, name: this.level.name }`.
   - `frontend/src/App.jsx`: moved the lvl2 video trigger out of
     `handleLevelChange` and into `handleLevelClear`, so
     `lvl2-transition.mp4` only appears after Pipeworks is actually
     cleared.
3. **Delayed/layered the chase ambience.**
   - `App.jsx`: removed the immediate `playAudio(getAmbientAudio(), false)`
     on `screen === 'playing'`.
   - Added a 15-second chase timer plus a new `onExtraChaserSpawn`
     callback from `GameEngine` so the ambient can start when tension has
     built or the first extra chaser arrives, whichever happens first.
4. **Updated docs.**
   - Refreshed `docs/roadmap.md`, `docs/version-log.md`,
     `docs/update-directions.md`, and `docs/handoffs/ledger.md`.

## Verification performed

- `cd frontend && npm run build`
- Browser check against `vite preview`:
  - ambient audio did not start on chase entry
  - ambient audio logged once the first extra chaser spawned
  - five chasers were present
  - the lvl2 overlay stayed hidden on Pipeworks arrival and only appeared
    after clear

## What was explicitly not done

- No `GAME_ITERATION` bump.
- No deploy.
- No audio ducking work.
- No 1:1 capture/bark clip work.
- No new death asset or death-video feature.

## Copy-paste: next natural steps for the next agent

```
Read docs/skib-sdlc.md (Mode B), then docs/update-directions.md, then
docs/roadmap.md, then this file. The session that fixed Pipeworks timing
and delayed ambient audio is complete.

Next small backlog item to pick up:
- `Audio 2: capture-line and chaser-bark voice clips, 1:1 with text.`
  Record one clip per `CAPTURE_LINES` and `CHASER_LINES` entry and wire
  them as a matched pair instead of the current themed pool.

Stay front-end only, keep the portrait layout, do not bump
`GAME_ITERATION`, and keep the cookie/profile flow untouched. Verify
with `cd frontend && npm run build` plus a browser run before stopping.
Update `docs/version-log.md`, `docs/update-directions.md`,
`docs/roadmap.md`, `docs/handoffs/ledger.md`, and create the next
`docs/handoffs/roadmap-handoff-vX.Y.Z.md` before committing.
```
