# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

**Created by:** Codex (GPT-5) — 2026-07-27
**Last updated by:** Claude (Sonnet 5) — 2026-07-27

This brief is the quick-start version of the current open handoff. It
previously pointed at the close-call freeze / reward slice
(`roadmap-handoff-v0.4.37-plan.md`) — that shipped as **v0.4.37** (see
`docs/handoffs/roadmap-handoff-v0.4.37.md`), so this brief is rewritten
to point at the next unclaimed, unblocked slice instead.

If you are about to code, start with
`docs/handoffs/roadmap-handoff-v0.4.39-plan.md` (read its correction
block first — it was itself written slightly stale and has since been
fixed) and use this as the condensed checklist.

The next best slice is front-end only: **Enhanced Death Logs** (record
time-played and a session sheeb/skreem delta on each capture) plus the
**Parody Warning & Feedback Link** UI addition. Both are small,
unblocked, and independent of each other — do them as two short steps
in one session, not a single tangled change.

Read first:

1. `docs/skib-sdlc.md`
2. `docs/update-directions.md`
3. `docs/roadmap.md`
4. `docs/handoffs/roadmap-handoff-v0.4.39-plan.md`
5. `docs/handoffs/roadmap-handoff-v0.4.37.md` (what v0.4.37 already
   added — the close-call freeze phase and the `POSITIVE_PICKUPS` reward
   hook in `gameContent.js` — so you don't duplicate it)
6. `frontend/src/lib/cookies.js` (`deathsHistory` shape)
7. `frontend/src/components/DeathsModal.jsx`

## Session focus

1. **Enhanced Death Logs:** add `timePlayed` (seconds survived that run)
   and `sessionScore` (net sheebs earned/lost that run) fields to each
   `deathsHistory` entry in `frontend/src/lib/cookies.js`, populate them
   from `GameEngine.js` at the capture event, and render both in
   `DeathsModal.jsx` alongside the existing timestamp/level/killer-ID
   fields.
2. **Parody Warning & Feedback Link:** add a short parody/fair-use
   disclaimer plus a link to the repo's GitHub issues page, in the main
   menu or a small settings modal in `App.jsx` — whichever fits the
   existing menu layout with the least new UI.

## Constraints

- Front-end only.
- Keep the 9:16 portrait layout.
- Do not break cookie-backed profile persistence — existing
  `deathsHistory` entries from before this change won't have the new
  fields; render them gracefully (e.g. blank/omit) rather than crashing.
- Do not bump `GAME_ITERATION` or deploy unless the user explicitly asks.

## Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test`

If the implementation needs new test coverage, add the smallest focused
Playwright check that proves the new death-log fields render and the
parody/feedback link is present.

## Deliverables

- Update `docs/roadmap.md` with any scoped gameplay items or parked
  follow-ups.
- Update `docs/version-log.md`, `docs/handoffs/ledger.md`, and
  `docs/update-directions.md` to match the actual implementation.
- Generate `docs/handoffs/roadmap-handoff-vX.Y.Z.md` for whatever
  version this lands as, per `docs/skib-sdlc.md` — don't skip it the way
  the v0.4.37 session did.
