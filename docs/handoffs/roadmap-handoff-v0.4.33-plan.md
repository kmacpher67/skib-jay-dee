# Roadmap Handoff — v0.4.33-plan

**Session mode:** Mode A (Planning — docs only, no code changes in this doc's scope)

This handoff covers the addition of Quest Rooms for Level 4+ and the new time constraint difficulty mechanics for higher levels.

## Feature 1: Quest Rooms & Landmark Badges (Level 4+)

Map generation for later levels needs specific, dedicated landmark rooms that house quest items (badges).
- **Room Specs:** These rooms must have at least 2 closed walls with small openings. 
- **Progression of Difficulty:** In Level 4, initial quest rooms might have openings on each side for easier escape. In higher levels (Level 5+), these rooms should have only one door, turning them into risky chokepoints.
- Entering these rooms and collecting the quest item grants a specific badge.

## Feature 2: Level 4+ Difficulty Constraints (90+ Seconds Survival)

To increase the challenge, advancing past Level 4 should no longer be just about Skreems or the 5 chasers.
- Level 4 and higher now requires the player to survive for at least **90 seconds** while evading 5 chasers.
- This timer should scale up for levels beyond 4 (e.g., Level 5 might require 120 seconds).
- Update the `advanceAt` logic in `GameEngine.js` for these higher levels to include this strict time floor constraint.

## Execution order

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md` and `docs/roadmap.md` before starting. This is
a Mode B (code) session picking up an already-finalized Mode A plan.

Scope for this pass:
1. **Quest Rooms:** Update the level building logic for Level 4 (and beyond) to generate specific "landmark" rooms with restricted entry points that house quest badges.
2. **Level 4+ Timer Constraint:** Implement a strict 90-second minimum survival time for Level 4 (and scaling upwards for higher levels) before progression is allowed, assuming 5 chasers are active.

Verify with `npm run build` and the full Playwright suite before
calling it done. Update `docs/roadmap.md`, `docs/handoffs/ledger.md`,
`docs/version-log.md`, `docs/update-directions.md`, and a new
`docs/handoffs/roadmap-handoff-vX.Y.Z.md` per the SDLC checklist, and
commit before ending the session.
```
