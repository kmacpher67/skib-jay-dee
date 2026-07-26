# Roadmap Handoff — v0.4.18

**Session date:** 2026-07-26
**Previous version:** v0.4.17 (see `docs/handoffs/roadmap-handoff-v0.4.17.md`).

This was a Mode B implementation session that picked up the oldest
unclaimed backlog item from `docs/roadmap.md`: the menu Version page.

## What this session did

1. **Added a new version log panel to the menu:** `frontend/src/App.jsx`
   now imports `VersionModal`, tracks `versionOpen` state, and adds a
   `WHAT'S NEW` button to the main menu.
2. **Built the version/changelog UI:** `frontend/src/components/VersionModal.jsx`
   renders a small menu overlay showing the current `GAME_ITERATION`
   plus a short recent-changes list.
3. **Styled the new panel:** `frontend/src/App.css` now has version modal
   styles that intentionally mirror the existing shop panel treatment.
4. **Verified the menu path in-browser:** `frontend/e2e/smoke.spec.js`
   now opens the version panel and checks that the live iteration string
   is visible.
5. **Shipped it:** rebuilt the frontend, bumped `GAME_ITERATION` to
   `v0.4.18` in `frontend/src/version.js`, updated the docs/ledger, and
   deployed.

## What was explicitly skipped

- Did not add any new persistence or runtime docs parsing for the
  changelog. The list is intentionally small and static for now.
- Did not tackle **Game identity & new profiles** yet; that remains the
  next backlog item.
- Did not touch the other roadmap items added in `docs/roadmap.md`
  earlier this session.

## Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test`

## Copy-paste: next natural steps for the next agent

```text
Read docs/skib-sdlc.md (Mode B), then docs/update-directions.md, then docs/roadmap.md, then this file (docs/handoffs/roadmap-handoff-v0.4.18.md).

The next unclaimed item in the backlog is:
1. **Game identity & new profiles (multiple save slots):** let a player keep their existing cookie-backed profile and also start a new one, still cookie-only (no backend). The current version page is already shipped, so pick this next.

Verify with `cd frontend && npm run build && npx playwright test`.
Update docs/version-log.md, docs/update-directions.md, docs/roadmap.md, docs/handoffs/ledger.md, and commit. Bump GAME_ITERATION and deploy only once verified working locally.
```

