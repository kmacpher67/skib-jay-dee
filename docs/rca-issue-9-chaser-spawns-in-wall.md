# RCA — GitHub Issue #9: Chaser Spawns in Wall

**Created by:** Codex GPT-5  
**Created on:** 2026-10-22  
**Last updated by:** Codex GPT-5  
**Last updated on:** 2026-10-22

## Symptom

On the Ramen Aisle, the lead chaser can appear embedded in the left shelf
and cannot make meaningful progress toward the runner. The supplied issue
capture shows the chaser face sitting on the shelf edge.

## Root cause

The Level 4 data declares the lead chaser spawn as `{ x: 80, y: 190 }`.
The default chaser body is `44 × 44`, so its rectangle spans `x=80..124`
and `y=190..234`. The Ramen Aisle grid contains a wall beginning at
`x=100..160`, `y=160..320` (10px tiles), so the spawn rectangle overlaps
that wall immediately.

`_syncLevelState()` assigns `this.chaser.x/y` directly from
`this.level.chaserSpawn` after building the map. `_moveWithCollision()` can
prevent later movement into a wall, but it cannot recover an entity whose
initial rectangle is already intersecting one. The same missing validation
exists for the four hard-coded extra-chaser corners and for delayed
respawns, so fixing only the Level 4 coordinate would leave duplicate
failure paths.

## Fix contract for Mode B

Add one entity-aware walkable-spawn resolver and use it for:

1. the lead chaser after each level map is built;
2. extra-chaser corner spawns; and
3. chaser respawns.

The resolver must validate the complete chaser rectangle (using the
chaser's actual width and height), preserve a configured spawn when it is
already clear, and otherwise choose the nearest deterministic clear point
within the playable bounds. It must update the chaser's stored `spawn`
point so a later respawn does not return to the bad coordinate.

Do not change runner spawn behavior, Level 5+ wall-phasing rules, the map
geometry, or the 9:16 presentation. The fallback is a spawn-safety fix,
not a new pathfinding system.

## Acceptance checks

- No level starts with the lead chaser rectangle intersecting a map wall.
- The Ramen Aisle lead chaser is visibly outside the left shelf and can
  move toward the runner.
- No extra chaser or Boom Stick respawn re-enters a wall.
- Valid existing spawn points remain unchanged.
- A regression test covers all six levels and the extra/respawn resolver.
- `cd frontend && npm run build && npx playwright test` passes.

