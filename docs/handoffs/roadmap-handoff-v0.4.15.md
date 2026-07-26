# Roadmap Handoff — v0.4.15

**Session date:** 2026-07-26
**Previous version:** v0.4.14 (see `docs/handoffs/roadmap-handoff-v0.4.14.md`).

This was a Mode B coding session. The oldest unfinished item in the
backlog was the lvl2 transition RCA from `docs/handoffs/roadmap-handoff-v0.4.13-plan.md`.
The session started with browser repro/probing, then tightened the video
gate so the lvl2 transition can only mount after Pipeworks has earned it.

## What this session did

1. **Moved the transition gate into game-state logic.**
   - `frontend/src/GameEngine.js` now tracks Pipeworks hall coverage on a
     coarse walkable grid and a survival timer that only advances while
     four or more skibs are active.
   - When Pipeworks clears, `onLevelClear()` now includes
     `showLvl2Transition` plus the gate stats in its payload.
2. **Kept React as the mount point, not the decision maker.**
   - `frontend/src/App.jsx` only mounts `<video className="lvl2-transition">`
     when the engine explicitly says the gate is ready.
   - The existing dismiss-on-capture behavior still works, and the safety
     timeout remains in place for autoplay / ended-event fallback.
3. **Expanded the browser coverage.**
   - `frontend/e2e/pipeworks-clear.spec.js` now covers both sides of the
     gate: hidden when under threshold, visible when ready.
   - `frontend/e2e/lvl2-transition-clears-on-caught.spec.js` still checks
     capture dismissal, and now also waits for a full playback cycle to
     finish without surfacing a page error.
4. **Bumped the visible iteration.**
   - `frontend/src/version.js` now reports `v0.4.15`.
5. **Updated the docs trail.**
   - Refreshed `docs/update-directions.md`, `docs/roadmap.md`,
     `docs/version-log.md`, and `docs/handoffs/ledger.md` to match the
     new state.
6. **Pushed the live site.**
   - Ran `./scripts/deploy-static.sh lvl2-gate`, which rebuilt the
     frontend, synced the website subtree, and pushed the production
     commit for `v0.4.15`.

## Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test`
- Manual browser probes in Chromium against the built preview, including
  a forced Pipeworks clear and a forced full playback path, with console
  and page-error listeners attached.

## What's explicitly not done

- No new lvl2 video asset.
- No skip button for the lvl2 transition.
- No `GAME_ITERATION` bump beyond the visible release tag in
  `frontend/src/version.js`.

## Copy-paste: next natural steps for the next agent

```
Read docs/skib-sdlc.md (Mode B), then docs/update-directions.md, then
docs/roadmap.md, then this file (docs/handoffs/roadmap-handoff-v0.4.15.md).

The lvl2 RCA is now closed. Next open roadmap items are the intro
cinematic and level-data extraction, plus the remaining small backlog
items parked in docs/roadmap.md.

Focus files for the next gameplay increment:
- frontend/src/GameEngine.js
- frontend/src/App.jsx
- frontend/src/components/GameCanvas.jsx
- frontend/e2e/<new or updated spec>

Do this in order:
1. Pick the oldest open non-RCA item from docs/roadmap.md and keep the
   increment single-session sized.
2. Implement the change in frontend/ only unless the user explicitly asks
   for backend work.
3. Add or adjust Playwright coverage for the specific behavior you changed.
4. Verify with `cd frontend && npm run build`, then `npx playwright test`.
5. Update docs/version-log.md, docs/update-directions.md, docs/roadmap.md,
   docs/handoffs/ledger.md, and commit. Bump `GAME_ITERATION` only when
   you are publishing a new build.
```
