# Roadmap Handoff — v0.4.34-plan

**Session mode:** Mode A (Planning — docs only, no code changes in this doc's scope)

This handoff details the end-game progression features for Level 5 and beyond, focusing on a massive shift in difficulty and a powerful new player tool.

## Feature 1: Skib-Chaser Evolution (Wall Hacks)

At Level 5, the standard rules of engagement break down. 
- **Wall Hacks:** Skib-chasers gain the terrifying ability to move through walls, completely nullifying standard hiding spots or chokepoints.
- **Speed & Attacks:** They gain significantly increased movement speed and more aggressive tracking/attack patterns.
- This creates an overwhelming pressure that forces the player to keep moving constantly.

## Feature 2: The "Gawd Particle"

To counter the evolved Skib-chasers, a new ultra-rare pickup is introduced: the Gawd Particle.
- **Spawn Conditions:** Only appears after Level 5. Very low spawn rate.
- **Player Effect:** When collected, the runner gains the ability to run through walls for a limited time.
- **Chaser Effect:** Contacting a Skib-chaser while under the effects of the Gawd Particle essentially "kills" them—despawning them entirely and forcing them onto a respawn timer before they can reappear in the level.
- This flips the dynamic temporarily, turning the runner into the hunter.

## Detailed Specifications & Parallelization

**Parallelization Note:** Like v0.4.33, this slice heavily modifies `GameEngine.js` (specifically collision logic and the update loops). Running this in parallel with v0.4.33 via multiple Code Monkey agents may cause Git merge conflicts in `GameEngine.js`. It is advised to run these sequentially.

### Spec 1: Skib-Chaser Evolution (Wall Hacks)

1.  **Wall Collision Bypass:** In `frontend/src/GameEngine.js`, locate the collision resolution logic for chasers (usually within `_updateChase` or a dedicated movement function).
2.  **Level 5 Trigger:** If `this.levelIndex >= 4` (Level 5 is index 4), disable wall collision detection/resolution for all chaser entities. They should move in a direct vector towards the runner, passing seamlessly through walls.
3.  **Speed & Aggression:** For levels 5+, apply an additional multiplier (e.g., `1.15x`) to their base speed to increase pressure.

### Spec 2: The "Gawd Particle"

1.  **Item Spawn:** In `GameEngine.js`, logic for map pickups (like the Gawd Particle) should only trigger if `this.levelIndex >= 4`. Give it a very low spawn chance (e.g., 5-10% per run).
2.  **Player Buff:** When the runner collides with the Gawd Particle, set a flag `this.gawdParticleActive = true` and a timer (e.g., `this.gawdParticleTimer = 10` for 10 seconds). Decrement this timer in `_updateChase`.
3.  **Player Wall Hacks:** While `gawdParticleActive` is true, disable the runner's wall collision resolution.
4.  **Chaser Despawn Mechanics:** Modify the `_checkCaught` (or equivalent runner-chaser collision block). If `gawdParticleActive` is true, **do not** trigger a capture. Instead, remove the colliding chaser from `this.chasers` array, and add them to a respawn queue (`this.chaserRespawnQueue.push({ id, timer: 15 })`).
5.  **Respawn Logic:** In `_updateChase`, decrement timers in `this.chaserRespawnQueue` and respawn the chaser at their spawn point when the timer hits zero.

## Execution order

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md` and `docs/roadmap.md` before starting. This is
a Mode B (code) session picking up an already-finalized Mode A plan.

Scope for this pass:
1. **Chaser Evolution:** In `GameEngine.js`, update chaser movement logic so they ignore wall collisions when `this.levelIndex >= 4`. Apply a small speed boost.
2. **Gawd Particle:** Add the Gawd Particle item logic in `GameEngine.js` (spawn only in Level 5+). When collected, disable runner wall collision for 10 seconds.
3. **Hunter Reversal:** In the runner/chaser collision check, if the Gawd Particle is active on the runner, despawn the chaser instead of dying. Add a 15-second respawn timer for that chaser to re-enter the level.

Verify with `npm run build` and the full Playwright suite before
calling it done. Update `docs/roadmap.md`, `docs/handoffs/ledger.md`,
`docs/version-log.md`, `docs/update-directions.md`, and a new
`docs/handoffs/roadmap-handoff-vX.Y.Z.md` per the SDLC checklist, and
commit before ending the session.
```
