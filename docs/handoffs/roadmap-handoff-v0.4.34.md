# Roadmap Handoff — v0.4.34

**Session mode:** Mode B (Implementation)

Picked up the oldest unfinished handoff,
`docs/handoffs/roadmap-handoff-v0.4.34-plan.md` — the Level 5+ end-game
escalation: Skib-Chaser Evolution (wall hacks) and the "Gawd Particle."

## What we did

1. **Read the code before trusting the plan's spec.** The plan's Spec 1
   said to "disable wall collision detection/resolution for chaser
   entities" at Level 5. Reading `frontend/src/GameEngine.js`'s `update()`
   loop first showed chasers never had wall collision at all — only the
   runner called `_moveWithCollision`/`_hitsWall`; chasers always moved in
   a straight vector toward the runner, clamped only to world bounds.
   Implementing the plan literally would have been a no-op. Instead:
   - Below Level 5 (`levelIndex < 4`, `LEVEL5_PLUS_START_INDEX`), chasers
     now use the runner's existing `_moveWithCollision`, so walls actually
     function as hiding spots/chokepoints on Levels 1-4 for the first
     time.
   - At Level 5+ (`levelIndex >= 4`), chasers keep the original
     always-pass-through movement via a new `_moveIgnoringWalls()` helper
     (factored out of the duplicate clamp-only logic that used to be
     inline), plus a flat `1.15x` speed multiplier
     (`LEVEL5_PLUS_CHASER_SPEED_MULT`).
   - This reads as the intended "rules break down at Level 5" shift
     instead of literally nothing changing.

2. **The Gawd Particle** (`frontend/src/GameEngine.js`):
   - New `gawd-particle` pickup type, spawned by `_maybeSpawnGawdParticle()`
     (called from `_syncLevelState()`, gated to `levelIndex >= 4`, 8% roll
     per level via `GAWD_PARTICLE_SPAWN_CHANCE`), reusing the same
     `_findRandomWalkableSpawn()` pattern as the Jayden Gun/badges.
   - Pickup sets `gawdParticleActive = true` and a 10s
     `gawdParticleTimer` (`GAWD_PARTICLE_BUFF_SECONDS`), ticked down each
     frame in `update()`. While active, the runner also uses
     `_moveIgnoringWalls()`.
   - Runner/chaser collision while the buff is active no longer triggers
     `_triggerCaught()` — instead the chaser is removed from
     `this.chasers` and queued in a new `chaserRespawnQueue` with a 15s
     timer (`CHASER_RESPAWN_SECONDS`). A new `_updateChaserRespawns()`,
     called each frame, ticks the queue and re-adds a chaser at its
     stored `spawn` point once its timer elapses.
   - Added a `spawn` field to both the main chaser (set in
     `_syncLevelState()` from `level.chaserSpawn`) and to extras created
     by `_maybeSpawnExtraChaser()` (their corner spawn point), so the
     generic respawn logic works for either.
   - Both the buff (`gawdParticleActive`/`gawdParticleTimer`) and the
     respawn queue are reset on level change and on death, matching how
     the rest of per-run chase state (`chasers`, `extraChaserTimer`, etc.)
     is already reset in those two places.

3. **Visual/HUD feedback:**
   - `_drawGawdParticleGlow()` — a gold glow/outline around the runner
     while the buff is active, drawn just before the runner sprite.
   - A "✨ WALLHACK: Xs" countdown in the HUD, positioned to the right of
     the existing ammo readout.
   - A `gawd-particle` case in `_pickupStyle()` (gold border, `✨` emoji).

4. **Tests:** new
   `frontend/e2e/level5-wallhacks-gawd-particle.spec.js`:
   - Chasers are blocked by a synthetic wall at Level 1 (index 0) but
     pass clean through the same wall at Level 5 (index 4). Stepped in
     real per-frame `dt` (`1/60` × 60) rather than one large `update(1)`
     call — an earlier draft used a single 1-second tick and both
     "proved" the wrong thing: the runner/chaser's per-frame displacement
     at `dt=1` exceeded the wall's width, so even the *pre-v0.4.34*
     collision-checked path tunneled clean through it. That's a
     pre-existing tunneling limitation of the engine's simple AABB
     collision at large `dt`, not the wall-hack feature — flagged below,
     not silently worked around.
   - The particle never spawns before Level 5 (200 rolls, zero spawns)
     and does spawn at Level 5+ (400 rolls, at least one spawn).
   - Picking it up sets the buff flag/timer, lets the runner cross a wall
     it couldn't otherwise cross, and collision blocks again once the
     buff expires.
   - Touching a chaser while the buff is active despawns it immediately
     (removed from `chasers`, added to the respawn queue) and it
     reappears at its stored spawn point once the respawn timer elapses,
     without changing `phase` away from `'chase'`.

## What's explicitly not done

- No audio cue for picking up the Gawd Particle or for a chaser despawn
  — parked in `docs/future-versions.md` as a follow-up, not guessed at
  (there's no existing SFX asset for either beat).
- No new badge tied to the Gawd Particle (e.g., for despawning N
  chasers) — the plan didn't ask for one.
- `LEVEL5_PLUS_CHASER_SPEED_MULT` (1.15x), `GAWD_PARTICLE_SPAWN_CHANCE`
  (8%), the 10s buff, and the 15s respawn all use the plan's own
  suggested values/ranges as-is — no independent tuning pass. Real
  playtesting should drive any adjustment.
- Backfilled a missing `VersionModal.jsx` entry for v0.4.33 (it shipped
  without one) alongside the new v0.4.34 entry — noted here since it
  wasn't part of this session's original scope, just a docs gap fixed in
  passing.

## Verification

- `cd frontend && npm run build` — clean.
- `npx playwright test` — full suite passes: 27 total specs, 26 active,
  1 pre-existing skip (`resume-countdown`'s WebKit-only case, unrelated
  to this change), 0 failures.
- No interactive/manual browser pass beyond the Playwright suite this
  session — the new mechanics are exercised end-to-end (engine-level)
  by the new spec file; a human playtest of the actual Level 5 feel
  (particularly the 1.15x speed bump and 8% spawn rate) is recommended
  before further tuning.

## Copy-paste: next natural steps

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md`, `docs/update-directions.md`, and
`docs/roadmap.md` before starting.

Level 5+ chaser wall-hacks and the Gawd Particle shipped in v0.4.34 —
don't redo them. The oldest unfinished handoff is now
`docs/handoffs/roadmap-handoff-v0.4.35-plan.md` (Rolling Pickups,
Schleimy Potion, Coolness Dialog).

Verify with `npm run build` and the full Playwright suite before
calling it done. Update `docs/roadmap.md`, `docs/handoffs/ledger.md`,
`docs/version-log.md`, `docs/update-directions.md`, and a new
`docs/handoffs/roadmap-handoff-vX.Y.Z.md` per the SDLC checklist, and
commit before ending the session.
```
