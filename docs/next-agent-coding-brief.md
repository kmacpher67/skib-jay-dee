# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

This brief is the quick-start version of the close-call freeze / reward
handoff. If you are about to code, start with
`docs/handoffs/roadmap-handoff-v0.4.37-plan.md` and use this as the
condensed checklist.

The next best slice is front-end only: add the near-capture 1-second
freeze, pay out +50 sheebs for a clean escape, and pay +5 sheebs for
positive pickup rewards. Keep the broader content-first polish pass
separate.

Read first:

1. `docs/skib-sdlc.md`
2. `docs/update-directions.md`
3. `docs/roadmap.md`
4. `docs/close-call-freeze.md`
5. `docs/interactive-content-pack.md`
6. `docs/badges.md`
7. `docs/handoffs/roadmap-handoff-v0.4.37-plan.md`

## Session focus

1. Add the near-capture freeze so the chase stays paused for 1 second
   after the close-call beat.
2. Add the sheeb payouts for close-call escapes and positive pickup
   rewards.
3. Keep the reward triggers aligned with the existing close-call badge
   and positive pickup definitions.

## Constraints

- Front-end only.
- Keep the 9:16 portrait layout.
- Do not break cookie-backed profile persistence.
- Do not bump `GAME_ITERATION` or deploy unless the user explicitly asks.
- Keep the reward and freeze behavior readable even when muted.

## Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test`

If the implementation needs new test coverage, add the smallest focused
Playwright check that proves the freeze and reward payout are visible
and stable.

## Deliverables

- Update `docs/roadmap.md` with any scoped gameplay items or parked
  follow-ups.
- Update `docs/version-log.md`, `docs/handoffs/ledger.md`, and
  `docs/update-directions.md` to match the actual implementation.
- Keep the handoff copy-paste block in sync if the plan shifts.
