# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

**Created by:** Codex (GPT-5) — 2026-07-27
**Last updated by:** Codex (GPT-5) — 2026-07-27

This brief is the quick-start version of the current open handoff. It
previously pointed at the close-call freeze / reward slice
(`roadmap-handoff-v0.4.37-plan.md`) — that shipped as **v0.4.37** (see
`docs/handoffs/roadmap-handoff-v0.4.37.md`), so this brief is rewritten
to point at the next unclaimed, unblocked slice instead.

If you are about to code, start with
`docs/handoffs/roadmap-handoff-v0.4.39-plan.md` and use this as the
condensed checklist. After v0.4.39 ships, the queued follow-on is
`docs/handoffs/roadmap-handoff-v0.4.40-plan.md` (Shart Knocker).

The next best slice is front-end only: **Enhanced Death Logs** (record
time-played plus raw session deltas on each capture) plus the **Parody
Warning & Feedback Link** UI addition. Both are small, unblocked, and
independent of each other — do them as two short steps in one session,
not a single tangled change.

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

1. **Enhanced Death Logs:** add `timePlayed`, `sessionSheebDelta`, and
   `sessionSkreemDelta` fields to each `deathsHistory` entry in
   `frontend/src/lib/cookies.js`, populate them from `GameEngine.js` at
   the capture event, and render them in `DeathsModal.jsx` alongside the
   existing timestamp/level/killer-ID fields.
2. **Parody Warning & Feedback Link:** add a short parody/fair-use
   disclaimer plus a link to
   `https://github.com/kmacpher67/skib-jay-dee/issues`, in the main
   menu or a small settings modal in `App.jsx` — default: compact menu
   footer.

## Constraints

- Front-end only.
- Keep the 9:16 portrait layout.
- Do not break cookie-backed profile persistence — existing
  `deathsHistory` entries from before this change won't have the new
  fields; render them gracefully (e.g. blank/omit) rather than crashing.
- Do not fold difficulty math into this slice; that work is parked in
  `docs/difficulty-mechanics-plan.md`.
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
