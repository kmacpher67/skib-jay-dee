# Roadmap Handoff — v0.4.32-plan

**Session mode:** Mode A (Planning — docs only, no code changes in this doc's scope)

This handoff covers the first slice of the new roadmap additions requested by Ken: retrofitting the early levels with collectible badges to encourage exploration, rather than just surviving the timer.

## Feature 1: Retrofit Early Level Badges (Level Progression Blockers)

Currently, players advance through levels purely by surviving and accumulating skreems (and for Level 2/4, satisfying time/chaser thresholds). 

**New Mechanic:** Finding cool stuff in a level or room is now a prerequisite to moving beyond the level.
- Add simple badge items (pickups) scattered in the map for Levels 1, 2, and 3.
- The `advanceAt` check for these levels must now ensure the player has picked up the mandatory badge(s) for that level before they can transition to the next level.
- When collected, the badge should be added to the profile's `earnedBadges` array.

## Feature 2: Humor & Intrigue Random Badges

Scattered throughout the initial levels, add optional, randomly spawning badge items that have humor and intrigue.
- These do not block progression (unlike Feature 1), but they reward exploration.
- They have a low spawn rate (some may not always show up) to encourage replayability.
- If missed in early levels, they can potentially spawn in later levels.
- Example flavor: "Mysterious Plunger," "Golden TP," etc.

## Execution order

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md` and `docs/roadmap.md` before starting. This is
a Mode B (code) session picking up an already-finalized Mode A plan.

Scope for this pass:
1. **Progression Badges:** Add mandatory map pickups to Levels 1-3. Update `GameEngine.js` progression logic to require these pickups before transitioning to the next level.
2. **Humor Random Badges:** Add a system for random, rare badge spawns in the maps. Add 2-3 humorous badge types to the game content.

Verify with `npm run build` and the full Playwright suite before
calling it done. Update `docs/roadmap.md`, `docs/handoffs/ledger.md`,
`docs/version-log.md`, `docs/update-directions.md`, and a new
`docs/handoffs/roadmap-handoff-vX.Y.Z.md` per the SDLC checklist, and
commit before ending the session.
```
