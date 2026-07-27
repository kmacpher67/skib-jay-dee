# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

This brief is the quick-start version of the refined content-first
handoff. If you are about to code, start with
`docs/handoffs/roadmap-handoff-v0.4.37-plan.md` and use this as the
condensed checklist.

The next best slice is front-end only: make the game feel funnier, more
readable, and more story-rich through dialog, badges, map callouts, and
a small menu brag surface. Keep the balance-number pass separate.

Read first:

1. `docs/skib-sdlc.md`
2. `docs/update-directions.md`
3. `docs/roadmap.md`
4. `docs/interactive-content-pack.md`
5. `docs/dialog_content_chasing.md`
6. `docs/badges.md`
7. `docs/handoffs/roadmap-handoff-v0.4.37-plan.md`

## Session focus

1. Add more dialog / badge personality to the existing front-end content
   layer.
2. Add level or room callouts so the maps feel more distinct.
3. Add a compact menu brag surface for best level, fewest deaths, and
   recent badge progress.

## Constraints

- Front-end only.
- Keep the 9:16 portrait layout.
- Do not break cookie-backed profile persistence.
- Do not bump `GAME_ITERATION` or deploy unless the user explicitly asks.
- Keep new content readable when the game is muted.

## Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test`

If the implementation needs new test coverage, add the smallest focused
Playwright check that proves the new dialog, badge, or menu surface is
visible and stable.

## Deliverables

- Update `docs/roadmap.md` with any scoped content items or parked
  follow-ups.
- Update `docs/version-log.md`, `docs/handoffs/ledger.md`, and
  `docs/update-directions.md` to match the actual implementation.
- Keep the handoff copy-paste block in sync if the plan shifts.
