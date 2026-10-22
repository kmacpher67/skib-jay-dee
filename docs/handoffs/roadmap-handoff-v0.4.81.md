# Roadmap Handoff v0.4.81 — Chaser Wall-Spawn Fix (Issue #9)

**Created by:** Claude Sonnet 5.5 — 2026-10-22
**Created on:** 2026-10-22
**Last updated by:** Claude Sonnet 5.5 — 2026-10-22
**Session mode:** Mode B (code and delivery)

Executes `roadmap-handoff-v0.4.80-plan.md` as written; version number shifted to v0.4.81 (see `roadmap-handoff-v0.4.80.md`).

## What Landed

- `_findClearBodySpawn` resolver; four spawn paths use it (lead sync, post-capture reset, extra, respawn).
- Level 4 lead chaser now starts clear of the Ramen Aisle shelf; valid spawns on other levels are unchanged.
- Tests: `frontend/e2e/issue-9-chaser-spawn.spec.js` (all six lead spawns, Level 4 repair vs preserved, extra and respawn on all levels). Full suite 80 passed, 1 skipped.

## Not Done

- No chaser stuck-recovery for chasers wedged mid-chase (not part of this issue).
- Splat clip wiring: `roadmap-handoff-v0.4.81-plan.md`, ships next as v0.4.82.
