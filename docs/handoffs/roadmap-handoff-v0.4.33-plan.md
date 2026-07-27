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

### Clarifications from Ken (2026-07-26, resolved during refinement)

Two questions came up refining this plan; both were answered directly,
not guessed:

1. **Skreems + new gate, or new gate replaces skreems?** Confirmed:
   **keep both** — the existing `level.advanceAt` skreems threshold stays
   required *alongside* the new time floor and chaser-count conditions,
   consistent with how Pipeworks already layers multiple conditions
   (hall coverage + 4-skib survival + skreem pressure). Don't drop the
   skreems check for Level 4+.
2. **Does "scales up for levels beyond 4" have anywhere to apply, given
   World Star Parking Lot (Level 5, index 4) currently has
   `advanceAt: null` (intentionally endless — no Level 6 exists yet)?**
   Confirmed: **yes, a Level 6 is being added**, and beyond — see the new
   `docs/level-progression-and-endgame-plan.md` for the full design
   (Level 6 "Jayden's Nightmare House" introducing the Skib-Daddy-Toilet
   Guy chaser, and a proposed Level 7 climax). Building Level 6 itself is
   **out of scope for this handoff** (kept separate so this slice stays
   single-session-sized) — this plan's Feature 2 only needs to make the
   time-floor formula (`90 + (levelIndex - 3) * 30`) generic enough that
   it's already correct once Level 6 exists, not hardcode a Level-4-only
   special case. World Star's `advanceAt: null` should stay `null` for
   now — flipping it to a real threshold is part of the future Level 6
   handoff, not this one, since that's the point where a "next level"
   actually exists to advance into.

## Detailed Specifications & Parallelization

**Parallelization Note:** This slice primarily modifies `GameEngine.js` (specifically the `buildXxx` map generation functions and `_updateChase`'s level advance logic). The next slice (v0.4.34) modifies collision detection and item pickups. Because both touch `GameEngine.js` heavily, running them in exact parallel across two automated agents may cause Git merge conflicts in that file. It is recommended to run them sequentially, or explicitly handle merges if running simultaneously.

### Spec 1: Quest Rooms & Landmark Badges (Level 4+)

1.  **Map Updates:** In `frontend/src/GameEngine.js`, update the level builder for Level 4 (`buildRamenAisle`) and Level 5 (`buildWorldStarParkingLot`) to include dedicated "quest rooms".
2.  **Room Geometry:** Define wall rects that form an enclosed square/rectangle.
    *   For Level 4, leave two narrow gaps (e.g., 40-60 pixels wide) on opposite sides.
    *   For Level 5+, leave only **one** narrow gap, creating a severe chokepoint.
3.  **Badge Item:** Introduce a new item type/pickup in these rooms. When the runner's bounding box intersects the badge's coordinates, add the badge to `profile.earnedBadges` and despawn the item. Add UI Toast for badge collection.

### Spec 2: Level 4+ Difficulty Constraints (90+ Seconds Survival)

1.  **Advance Logic:** In `GameEngine.js`, locate the `_updateChase` block handling `advanceAt` (around line 950).
2.  **Time Constraint:** Add a new condition for levels with index `>= 3` (Level 4 is index 3). The player must survive for `90 + ((this.levelIndex - 3) * 30)` seconds.
3.  **Chaser Constraint:** Ensure `this.chasers.length >= 5` is required to advance in these higher levels.

## Execution order

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md` and `docs/roadmap.md` before starting. This is
a Mode B (code) session picking up an already-finalized Mode A plan.

Scope for this pass:
1. **Quest Rooms:** Update `buildRamenAisle` and `buildWorldStarParkingLot` in `GameEngine.js` to feature "landmark" rooms with restricted entry points (2 openings for Lvl 4, 1 for Lvl 5+). Add a collectible badge item inside.
2. **Level 4+ Timer Constraint:** Implement a strict 90-second minimum survival time (scaling +30s per level) and a 5-chaser requirement for Level 4+ in `GameEngine.js` advance logic.

Verify with `npm run build` and the full Playwright suite before
calling it done. Update `docs/roadmap.md`, `docs/handoffs/ledger.md`,
`docs/version-log.md`, `docs/update-directions.md`, and a new
`docs/handoffs/roadmap-handoff-vX.Y.Z.md` per the SDLC checklist, and
commit before ending the session.
```
