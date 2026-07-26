# Roadmap Handoff — v0.4.20

**Session date:** 2026-07-26
**Previous version:** v0.4.19

## What this session did

1. **Removed the stale `initialSheebs = 200` fallback** from
   `frontend/src/GameEngine.js` so the engine now relies on the value
   passed in from the caller.
2. **Added a flat capture penalty on persistent currency** by defining
   `DEATH_SHEEBS_PENALTY = 20` next to the existing skreem-loss
   constant and subtracting up to 20 sheebs on capture, floored at zero.
3. **Bumped the visible iteration tag** to `v0.4.20` in
   `frontend/src/version.js`.
4. **Refreshed the shipped version log** so the menu's WHAT'S NEW panel
   includes the new v0.4.20 note.

## Verification performed

- `cd frontend && npm run build` — succeeded.

## What's explicitly not done

- The deaths history log UI is still the next backlog item and now has
  its own plan in `docs/handoffs/roadmap-handoff-v0.4.21-plan.md`.
- No deploy was requested for this increment.

## Copy-paste: next natural steps for the next agent

```text
Read docs/skib-sdlc.md, then docs/update-directions.md, then
docs/handoffs/roadmap-handoff-v0.4.21-plan.md. Implement the deaths
history log UI in the front end: add deathsHistory to the cookie
profile, make the menu's Deaths pill clickable, show the saved entries
in a small modal, and keep only the most recent 10 visible. Verify with
cd frontend && npm run build && npm run test:e2e, then update
docs/version-log.md, docs/update-directions.md, docs/roadmap.md, and
docs/handoffs/ledger.md. Bump GAME_ITERATION to v0.4.21 in
frontend/src/version.js and commit the changes.
```
