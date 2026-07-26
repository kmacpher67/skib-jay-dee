# Roadmap Handoff — v0.4.21

**Session date:** 2026-07-26
**Previous version:** v0.4.20

## What this session did

1. **Added the deaths history log UI.** The menu's `Deaths` pill now
   opens a `DeathsModal` panel that shows the latest capture records
   with timestamps and level names.
2. **Persisted death history in the cookie profile.** `normalizeProfile()`
   now carries a sanitized `deathsHistory` array, and capture events
   append `{ timestamp, levelName }` entries when the player gets caught.
3. **Updated the version changelog and smoke coverage.** The version
   modal now includes a v0.4.21 note, and the Playwright smoke suite now
   seeds a profile with death history and checks the panel renders the
   saved entries.
4. **Bumped the visible iteration tag** to `v0.4.21` in
   `frontend/src/version.js`.

## Verification performed

- `cd frontend && npm run build` — succeeded.
- `cd frontend && npx playwright test` — 12/12 pass.

## What's explicitly not done

- The next backlog item is now the game identity / multiple save slots
  work. It is still open and should be scoped separately.
- No deploy was requested for this increment.

## Copy-paste: next natural steps for the next agent

```text
Read docs/skib-sdlc.md, then docs/update-directions.md, then
docs/roadmap.md. Pull the next backlog item: game identity / multiple
cookie-backed save slots. Keep it cookie-only and front-end only. Before
editing, check whether the slot-switching flow needs a small design pass
for how it should interact with frontend/src/lib/cookies.js's single
profile shape. Verify with cd frontend && npm run build, then update
docs/version-log.md, docs/update-directions.md, docs/roadmap.md, and
docs/handoffs/ledger.md, bump GAME_ITERATION if a release tag changes,
and commit the work.
```
