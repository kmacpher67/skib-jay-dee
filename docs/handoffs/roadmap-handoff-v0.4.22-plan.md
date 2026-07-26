# Roadmap Handoff — v0.4.22-plan

**Session mode:** Mode A (Planning only)

This plan captures a direct pacing note from Ken: **level upgrades are
still too fast.** He wants two things, together: (1) more elapsed
playtime required before a level can advance, and (2) a level can't
advance until at least two skibs (chasers) are simultaneously chasing —
not just proximity-based skreem accumulation from a single chaser.

This resolves the previously-open backlog item "Tune the level-1 →
Pipeworks advance threshold" (`docs/roadmap.md`) with a concrete design,
expanded from just level 1 to every non-Pipeworks level's `advanceAt`
gate, and folds in the "two simultaneous chasers" condition Ken added
this session. See
[gameplay-mechanics.md#round--level-advancement-why-does-the-round](../gameplay-mechanics.md#round--level-advancement-why-does-the-round)
for the existing mechanism this changes.

## Design

Today (`frontend/src/GameEngine.js:834`), every level except Pipeworks
advances purely on `this.levelSkreems >= this.level.advanceAt` —
`levelSkreems` is proximity-based (`dt * (300 - dist) * 0.06` per
chaser within 300px, line ~808), so a single chaser closing in fast can
trip level 1's `advanceAt: 26` in a couple of seconds. There is no
elapsed-time floor and no chaser-count requirement.

Pipeworks already has a much stricter gate (`MAX_CHASERS = 5` active and
fully joinRamp'd before `pipeworksSkreems` even accumulates,
`GameEngine.js:811-817`) — it already exceeds "two simultaneous
chasers," so **no change needed there.** The final level
(`advanceAt: null`) never advances further, so it's also unaffected.

New gate for levels 1, 3, and 4 (Porcelain Palace, Flooded Annex, The
Ramen Aisle):

1. **Elapsed-time floor.** Add a `this.levelElapsed` counter,
   incremented by `dt` each `update()` tick, reset to `0` in
   `_syncLevelState()` (`GameEngine.js:664-702`) alongside the existing
   `this.levelSkreems = 0` reset. Add a new constant near
   `EXTRA_CHASER_INTERVAL` (`GameEngine.js:306-313`), e.g.
   `const MIN_LEVEL_SECONDS_BEFORE_ADVANCE = 30`. Also update `EXTRA_CHASER_INTERVAL = 20` (from 14).
2. **Two-simultaneous-chasers floor.** Require
   `this.chasers.length >= 2` at the moment of the check — i.e. the
   extra-chaser mechanic (`_maybeSpawnExtraChaser()`,
   `EXTRA_CHASER_INTERVAL = 20`s) must have already spawned at least one
   extra toilet before the level can clear. This is a natural pairing
   with the time floor since 20s of uninterrupted chase is roughly when
   the second chaser shows up anyway, but make it an explicit condition,
   not an implicit side effect of the timer, so it holds even if a
   capture/respawn resets the extra-chaser timer mid-level.
3. **Combine with the existing skreem check.** Change the `else if`
   branch at `GameEngine.js:834` from:
   ```js
   } else if (this.level.advanceAt && this.levelSkreems >= this.level.advanceAt) {
   ```
   to require all three conditions together (skreem threshold AND
   elapsed-time floor AND chaser-count floor):
   ```js
   } else if (
     this.level.advanceAt &&
     this.levelSkreems >= this.level.advanceAt &&
     this.levelElapsed >= MIN_LEVEL_SECONDS_BEFORE_ADVANCE &&
     this.chasers.length >= 2
   ) {
   ```
4. **Tunable, not fixed.** `MIN_LEVEL_SECONDS_BEFORE_ADVANCE = 30` is a
   starting guess (roughly 1.5x `EXTRA_CHASER_INTERVAL`) — playtest and
   adjust; name it clearly so a future session can retune without
   re-deriving the mechanism. Do **not** touch Pipeworks's separate gate
   constants (`PIPEWORKS_*`) — those are already tuned and solve a
   different problem (the lvl2 cinematic gate, not level-1-exit pacing).

## What's explicitly not done yet (Code Monkey target)

The following block is ready for
`./scripts/run_code_monkey.sh docs/handoffs/roadmap-handoff-v0.4.22-plan.md`.
Recommend running this *after* v0.4.20 lands (same file,
`GameEngine.js`, avoids a merge conflict) — not a hard dependency, just
sequencing hygiene.

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent. Your task is to slow down level-advance
pacing in `frontend/src/GameEngine.js`, per Ken's direct feedback that
level upgrades are still too fast.

1. **Add a new constant** near `EXTRA_CHASER_INTERVAL` (around line 307):
   `const MIN_LEVEL_SECONDS_BEFORE_ADVANCE = 30`, and change `const EXTRA_CHASER_INTERVAL = 20`.

2. **Track elapsed time per level.** In `_syncLevelState()` (around line
   664-702), add `this.levelElapsed = 0` alongside the existing
   `this.levelSkreems = 0` reset. In `update()`, increment
   `this.levelElapsed += dt` once per tick during the normal chase branch
   (same place `this.nearCaptureCooldown` etc. get updated, around line
   782) — not during `intro`/`level-up`/`caught`/`near-capture` phases,
   since those already return early.

3. **Gate the non-Pipeworks advance check** (around line 834). Change:
   ```js
   } else if (this.level.advanceAt && this.levelSkreems >= this.level.advanceAt) {
   ```
   to:
   ```js
   } else if (
     this.level.advanceAt &&
     this.levelSkreems >= this.level.advanceAt &&
     this.levelElapsed >= MIN_LEVEL_SECONDS_BEFORE_ADVANCE &&
     this.chasers.length >= 2
   ) {
   ```
   Do not change the Pipeworks branch (`this.pipeworksSkreems >=
   PIPEWORKS_MAX_PRESSURE_SKREEM_GOAL`) — it already requires 5
   simultaneous chasers, which is stricter than this new "at least 2"
   floor.

Verification:
- Run `cd frontend && npm run build` to ensure the syntax is correct.
- Run `npm run test:e2e` — if any existing Playwright spec assumes level
  1 clears near-instantly (e.g. a smoke test that rushes past level 1),
  it may need its wait/timeout bumped to account for the new
  `MIN_LEVEL_SECONDS_BEFORE_ADVANCE` floor. Check
  `frontend/e2e/*.spec.js` for any level-1-advance assumptions before
  assuming a failure is a real regression.
- Manually sanity-check (or note in the handoff if not browser-tested)
  that level 1 no longer clears in a couple seconds of close pursuit,
  and that it doesn't clear before a second chaser has joined.

Once done:
- Update `docs/handoffs/roadmap-handoff-v0.4.22.md` with your results
  (using roadmap-handoff-v0.4.0.md as a template).
- Update `docs/roadmap.md` (mark the level-advance-pacing item done,
  describing the final tuned values), `docs/update-directions.md`, and
  `docs/handoffs/ledger.md`.
- Bump `GAME_ITERATION` to `v0.4.22` in `frontend/src/version.js`.
- Commit your changes.
```
