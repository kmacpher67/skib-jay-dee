# Handoff v0.4.43 — Player's Guide

**Created by:** Composer — 2026-07-27

## What this session did

- **Closed the v0.4.43-plan LT roadmap docs session** (already landed in commit
  `4fc4cfd`): Long-Term roadmap entries for Level 10 arc, Role Reversal, and
  MOBA/PvP remain parked with open Ken questions — no code from that plan.
- **Implemented the next unblocked backlog item** per the v0.4.43-plan
  copy-paste block (`roadmap-handoff-v0.4.44-plan.md` spec): in-game
  **Player's Guide**.
- Created `docs/players-guide.md` as the mechanics source of truth (controls,
  Jayden Gun ammo rules, level transitions, Level 5+ wall-hacks, Shart
  Knocker clarification, plus quick-reference sections for other pickups and
  Level 4+ economy risk).
- Added `frontend/src/components/PlayersGuideModal.jsx` (styled like existing
  modals) and a **Player's Guide** footer link on the main menu, directly above
  the GitHub issues link.
- Verified with `npm run build`.
- Bumped `GAME_ITERATION` to `v0.4.43` and deployed via
  `./scripts/deploy-static.sh players-guide`.
- Updated SDLC tracking docs.

## Verification

- `cd frontend && npm run build` passes with no errors.
- Player's Guide link opens the modal from the menu footer; close button dismisses it.

## Explicit non-goals this round

- No gameplay mechanic changes (gun ammo still replaces, Shart still instant
  AoE — documented only).
- LT roadmap items (Role Reversal, MOBA, Level 7–10 content) remain design-only
  pending Ken's answers in `roadmap-handoff-v0.4.43-plan.md`.

## Copy-paste: next natural steps

```markdown
**Next coding agent:**

1. Read `docs/update-directions.md` and `docs/roadmap.md` for the current open backlog.
2. Next unblocked items include pickup-consumption tracking + Play Recap (blocked on Ken design answers in v0.4.41-plan addendum) or other unchecked incremental backlog lines.
3. LT roadmap (Level 10 arc, Role Reversal, MOBA) stays parked until Ken answers the "Flag for Ken" questions in `docs/handoffs/roadmap-handoff-v0.4.43-plan.md`.
4. Follow `docs/skib-sdlc.md` Mode B process for the next slice.
```
