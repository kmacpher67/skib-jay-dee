# Roadmap Handoff: v0.4.36

## What was requested
- **Level Data Extraction**: Convert Porcelain Palace and Pipeworks to 2D grid arrays, using `parseMapGrid` to dynamically generate wall rectangles, cleaning up hardcoded pixel spaghetti.
- **Cursed & Blessed Map Pickups**: Implement Taco Bell Grande (+50% Speed, disables steering) and Fake Jayden Decoy (Drops cardboard cutout, Skibs in radius aggro decoy for 4s).
- **Secret Interaction Badges**: Add `pacifist-warzone` (Survive Level 4 with Jayden Gun without firing) and `premature-evacuation` (Get caught in the first 5 seconds of Level 1).

## What was implemented
1. **Map Refactor**: `frontend/src/mapGrids.js` was created to hold the 2D grid arrays. `parseMapGrid` was added to `GameEngine.js` to dynamically build `walls` arrays for `buildPorcelainPalace` and `buildPipeworks`. A greedy bounding-box merging logic was used to minimize the number of rectangles for performance.
2. **Cursed & Blessed Pickups**: Added `Taco Bell` (spawns rarely in the map, increases speed by 1.5x but disables steering vector updates) and `Decoy` (spawns rarely, drops a stationary decoy position that chasers target instead of the runner). Updated rendering and state tracking in `GameEngine.js`.
3. **Secret Badges**: Added `pacifist-warzone` (checked in `onLevelClear`) and `premature-evacuation` (checked in `_triggerCaught`) to the badge earning logic.

## Follow-up / Next Steps
- Implement the remaining Mario-style pickups: Soggy Toilet Paper (trap/slow) and Heavy Plunger (weapon).
- Implement the remaining secret badge: Friendly Fire.
- Continue migrating Levels 3, 4, and 5 to the new 2D grid layout.
- Check `docs/update-directions.md` and `docs/handoffs/roadmap-handoff-v0.4.37-plan.md` for the next priorities.
