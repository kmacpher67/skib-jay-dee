# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

**Created by:** Codex (GPT-5) — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-27

This brief is the quick-start version of the current open handoff. It
previously pointed at Slice A — Rewards & History panel
(`roadmap-handoff-v0.4.41-plan.md`) — that shipped as **v0.4.41**.
`frontend/src/version.js` confirms `v0.4.41` is current. This
brief is rewritten to point at the next unclaimed, unblocked slice instead.

If you are about to code, start with
`docs/handoffs/roadmap-handoff-v0.4.44-plan.md` and use this as the
condensed checklist.

The next best slice is front-end only: **Player's Guide Modal**. Create a
markdown guide (`docs/players-guide.md`) detailing weapons, transitions,
wall-hacks, and the Shart Knocker. Render this guide in the app using a new
React modal (`PlayersGuideModal.jsx`) triggered by a "Player's Guide" link in
the footer.

Read first:

1. `docs/skib-sdlc.md`
2. `docs/update-directions.md`
3. `docs/roadmap.md`
4. `docs/handoffs/roadmap-handoff-v0.4.44-plan.md`

## Session focus

1. **`docs/players-guide.md`**: Create the markdown file containing the rules
   for Weapons, Level Transitions, Wall-Hacking, and Attacks (specifically the Shart Knocker).
2. **`PlayersGuideModal.jsx`**: Create a new modal component that renders this
   information in a styled React modal.
3. **`App.jsx`**: Update to include a "Player's Guide" link in the footer
   above the issues link, which opens the modal.

## Constraints

- Front-end only.
- Keep the 9:16 portrait layout.
- Strictly documentation and UI: no gameplay mechanics are being changed.
- Do not bump `GAME_ITERATION` or deploy unless the user explicitly asks.

## Verification

- `cd frontend && npm run build`
- Verify the modal in the browser.

## Deliverables

- Update `docs/roadmap.md` (check off "Player's Guide Modal" once
  Slice A lands).
- Update `docs/version-log.md`, `docs/handoffs/ledger.md`, and
  `docs/update-directions.md` to match the actual implementation.
- Generate `docs/handoffs/roadmap-handoff-vX.Y.Z.md` for whatever version
  this lands as, per `docs/skib-sdlc.md`.
