# RCA — Issue #5: pickups spawn in walls, direction input latches

**Created by:** Claude Sonnet 5.5 — 2026-10-22
**Created on:** 2026-10-22
**Last updated by:** Claude Sonnet 5.5 — 2026-10-22
**Last updated on:** 2026-10-22
**Issue:** [#5](https://github.com/kmacpher67/skib-jay-dee/issues/5)
**Status:** Fix implemented and verified by e2e; **not shipped** (no `GAME_ITERATION` bump, no deploy — awaiting Ken's go-ahead). Bug 2 (input latch) is a defensive fix for an unreproduced symptom; needs a playtest to confirm.

## Reported symptoms

1. At the start of some levels, directional controls sometimes stop responding. Pressing the opposite direction key usually clears it.
2. A pickup (the test-tube / Schleimy Potion, which shrinks the runner) appeared inside a wall. The runner got stuck in the wall retrieving it.

## Bug 2 (wall spawns) — root cause: CONFIRMED

Several pickups were spawned at hard-coded coordinates that were never checked against the level's wall layout. Only pickups going through `_findRandomWalkableSpawn()` were wall-checked.

Measured against each level's built map (28px pickup rect), before the fix:

| Pickup | Fixed spawn point | In a wall on |
|---|---|---|
| Schleimy Potion (`_maybeSpawnSchleimyPotion`) | world center (450, 750) | L2 Pipeworks, L5 World Star, L6 Jayden's House |
| Decoy (`_maybeSpawnDecoy`) | world center | same as potion |
| Taco Bell (`_maybeSpawnTacoBell`) | center of `map.walls[0]` (the boundary wall strip) | **every level** (guaranteed) |
| Turdstone Token (`_maybeSpawnTurdstoneToken`, L4 only) | (820, 220) | L4 Ramen Aisle |

Why it hurt: the potion also shrinks the runner to 14x14 on pickup, so the runner is picked up from inside solid geometry and `_moveWithCollision` rejects every move out of it, so they are stuck. (`_moveWithCollision` only allows moves that end outside walls.)

Contributing factor: `_findRandomWalkableSpawn` only required the 28px pickup rect itself to be wall-free, so pickups could sit flush against a wall edge where the 40px runner cannot overlap them without clipping the wall.

### Fix

- New `_isClearSpawnRect()` requires `PICKUP_WALL_MARGIN` (8px) of open space around the pickup.
- New `_findClearSpawnNear(px, py, size)`: use the preferred point if clear, else ring-search outward (20px steps to 400px), else fall back to a random walkable spawn.
- Potion, Decoy, Taco Bell, Turdstone now use it. Taco Bell and Decoy/Potion prefer world center (taco previously targeted wall[0] by accident — intent was never documented, center is the closest sane equivalent).
- `_findRandomWalkableSpawn` uses the margin check and 60 attempts (was 30).

## Bug 1 (input latch) — root cause: HYPOTHESIS

Not reproduced. Code review findings:

- Keyboard state is a set of booleans (`keys.up/down/left/right`) set on `keydown` and cleared on `keyup`. If a `keyup` is lost (focus moved to an overlay/button during the level-transition screens, or the key was released while the engine was in a non-chase phase), the boolean stays `true` and the runner keeps drifting that way or two opposing latched keys cancel to 0 ("controls dead"). A fresh press+release of that same key clears it, which matches "toggling the keys fixes it".
- `_syncLevelState` (called on every level change) never cleared held input, so latched state carried straight into the new level's start.
- Existing guards (`blur`, `visibilitychange`, `beginResumeCountdown`) cover tab-away and respawn but not the level-up path.

### Fix (defensive)

`_syncLevelState({ resetPositions: true })` now calls `_clearHeldInput()`. Browser key auto-repeat re-asserts a genuinely held key within about 0.5 seconds, so a real held key is not lost for long.

## Related finding, NOT fixed here

`runner.w/h` is set to 14 on potion pickup and **never restored** when `schleimyPotionActive` expires (`GameEngine.js`, `schleimy-potion` pickup branch vs. the timer expiry). Intended behavior per the version note is an 8s shrink. A correct restore must grow the runner back only when the larger rect is wall-free (otherwise it re-creates this stuck-in-wall bug). Parked in `docs/future-versions.md`; needs its own slice and a design call from Ken (grow-back policy when the larger hitbox would overlap a wall).

## Verification

- `frontend/e2e/issue-5-pickup-wall-spawn.spec.js`: forces every chance-gated pickup to spawn on all 6 levels x 25 syncs and asserts none intersect a wall; asserts a level sync clears latched keys. Both tests fail without the fix and pass with it.
- `npm run build` passes; `boom-stick-c1.spec.js` still passes.

## What still needs to happen

1. **Ken:** playtest the level-start control latch (Bug 1) on a build with this change; if it recurs, capture the debug dump (press Q three times) right when it happens and attach it to issue #5.
2. **Ken:** decide when to ship (bump `GAME_ITERATION`, add VersionModal entry, close #5 per SDLC step 5a).
3. Separate slice: Schleimy Potion shrink restore (see above).
