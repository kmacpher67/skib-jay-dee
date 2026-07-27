# Roadmap Handoff - v0.4.37-plan

**Session mode:** Mode A (Planning - docs only, no code changes)

This handoff was refined after reviewing the current backlog and the
recent content docs. The game is already mechanically solid; the next
front-end pass should make it feel funnier, more readable, and more
story-rich before any further balance tuning.

The earlier balancing draft still matters, but it is no longer the
first thing the next coding agent should pick up. The next slice should
lean into dialog, badge flavor, and map identity so the existing chase
loop has more personality.

## Feature 1: Content-first dialog and badge pass

Expand the content layer that already exists in
`frontend/src/dialog.js`, `frontend/src/gameContent.js`, and the badge
docs.

- Add more `COOLNESS_LINES` and `HARD_CHASER_LINES` style moments for
  slick escapes, level pressure, and item use.
- Add a small set of new content-first lines for level intros, map
  callouts, badge moments, and funny pickup reactions.
- Pull the text from `docs/dialog_content_chasing.md`,
  `docs/interactive-content-pack.md`, and `docs/badges.md` so the new
  lines stay documented and readable when the game is muted.
- Give new badge toasts more personality than raw status text. Badge
  earned, badge celebrated.

Suggested first badge seeds for this pass:

- Bathroom Tourist
- Dead-End Daredevil
- Gremlin in the Pipes
- Chaser Tax Audit

## Feature 2: Map personality and landmark detail pass

Make the existing levels easier to describe at a glance.

- Add level-specific flavor callouts, room labels, or short HUD banners
  so each map has one anchor room, one risky shortcut, one gag room, and
  one reward room.
- Keep the implementation data-driven instead of hardcoding new one-off
  branches for each map.
- Favor small environmental details and readability over new mechanics.
  The goal is to make the maps memorable, not just harder.

## Feature 3: Small menu brag surface

Add a compact front-end-only brag surface so the menu celebrates
progress outside the run loop.

- Show a concise best-level / fewest-deaths summary, and optionally the
  most recent badge earned.
- Reuse the existing cookie-backed profile data. No backend work.
- Keep it portrait-friendly and low-clutter so it does not fight the
  main menu.

## Explicitly not this pass

- Do not bundle the pure balance-number pass into this slice. The
  numbers-only tuning work stays on the roadmap as a later follow-up.
- Do not add backend systems, multiplayer, or any feature that depends
  on new recorded audio first.
- Do not bump `GAME_ITERATION`.

## Copy & Paste Snippet for Code Monkey

When you are ready to hand this to a coding agent, feed it this prompt:

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md`, `docs/update-directions.md`,
`docs/roadmap.md`, `docs/interactive-content-pack.md`,
`docs/dialog_content_chasing.md`, and `docs/badges.md` before starting.

Your objective is to implement the content-first front-end polish pass
from v0.4.37-plan:

1. **Dialog and badge flavor**
   - Expand the existing dialog pools in `frontend/src/dialog.js` with a
     few more funny lines for level pressure, near-misses, item use, and
     badge moments.
   - Add or refresh the badge-story copy so new badge toasts feel like
     earned moments instead of plain status text.
   - Keep the lines readable when the game is muted.

2. **Map personality / landmark detail**
   - Add small level-callout data to the front-end so each map can show
     one anchor room, one risky shortcut, one gag room, and one reward
     room without hardcoding a bunch of new engine branches.
   - Keep it data-driven and portrait-friendly.

3. **Menu brag surface**
   - Add a compact menu card or pill that highlights the active profile's
     best level, fewest deaths, and most recent badge.
   - Reuse the existing cookie-backed profile state only.

Verify with `npm run build` and the full Playwright suite. Add or update
any focused Playwright coverage needed for the new dialog, badge, or menu
surfaces. Update `docs/roadmap.md`, `docs/handoffs/ledger.md`,
`docs/version-log.md`, `docs/update-directions.md`, and this handoff if
the implementation details change. Commit your work before ending the
session.
```
