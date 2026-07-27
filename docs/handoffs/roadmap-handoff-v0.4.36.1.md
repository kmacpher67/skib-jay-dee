# Handoff: v0.4.36.1 (Shipped)

**Created by:** unknown — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-27 (metadata backfill only)

## What was done

A Mode A planning pass earlier the same day found the working tree
already dirty with uncommitted, unverified code — an interrupted attempt
at exactly the follow-ups `v0.4.36`'s own handoff named next (Soggy
Toilet Paper, Heavy Plunger, a `Friendly Fire` badge stub, plus empty
grid-migration placeholders for the remaining 3 levels). When asked to
commit/version/deploy, that diff was reviewed first rather than shipped
blind, and turned out to be genuinely broken:

- `soggy-tp` and `heavy-plunger` pickups were spawned onto the map but
  had **no collection branch** in `_checkPickups()` — permanent,
  uncollectible clutter.
- `_swingPlunger()` was fully written but **never called** from any
  input path.
- The `friendlyFireBadgeEarned` flag was set but **never read**.
- `_spawnQuestRoomBadge()` and `_maybeSpawnGunPickup()` were each called
  **twice** at level start.

Asked the user how to proceed (revert vs. finish); they chose to finish
it. This version is that completion:

1. **Fixed the duplicate level-start calls.** `_spawnQuestRoomBadge()`
   and `_maybeSpawnGunPickup()` now each run once per level start.
2. **Wired real pickup collection** for `soggy-tp` and `heavy-plunger` in
   `_checkPickups()`.
3. **Soggy Toilet Paper:** on pickup, the runner drops a trail behind
   itself for 6s (one segment every 0.4s, each living 5s). Any chaser
   whose hitbox overlaps a trail segment is slowed to 60% speed for 5s.
   HUD shows a `🧻 SOGGY: Xs` countdown alongside the other buff timers.
4. **Heavy Plunger:** on pickup, the runner gets 3 swings and a -30%
   speed penalty while held. The existing F-key/touch-FIRE input now
   routes to `_swingPlunger()` instead of the gun when a plunger is held
   (`_tryFire()` checks `this.runner.plunger` first) — the swing knocks
   back any chaser within 120px by 80px, on a 0.5s cooldown, and the
   plunger is consumed after 3 swings. The FIRE button turns purple and
   reads "SWING" instead of "FIRE" while a plunger is held; HUD shows a
   `🪠 SWINGS: N` readout in the same slot the gun's ammo readout uses.
5. **Friendly Fire badge:** a chaser hit by the Jayden Gun is now marked
   `gunStunned`. When its `stunnedUntil` timer expires, if it was
   gun-stunned, it gets a 2s `stunGracePeriod`. If the runner is caught by
   that exact chaser while the grace period is still active, the
   `friendly-fire` badge fires via the existing `onBadgeEarned()` hook.
6. **Verified the `phase === 'playing'` → `'chase' || 'near-capture'`
   change already in the diff was a real, separate bug fix** — `'playing'`
   was never a valid `this.phase` value anywhere else in the file, so the
   Gawd Particle/Schleimy Potion/Taco Bell/Decoy timers silently never
   decremented before this change (they only started working correctly
   once the phase check matched a real phase). Left as-is.
7. **Cleanup:** deleted the leftover `scratch_apply_all*.js`,
   `scratch_clean.js`, `scratch_final*.js`, and
   `scratch_fix_parseMapGrid.js` files from the repo root.

## Verification

- `npm run build` — clean.
- Full Playwright suite — 29 active tests pass, 1 pre-existing skip
  (`resume-countdown.spec.js`, unrelated).
- New `frontend/e2e/soggy-tp-plunger-friendly-fire.spec.js` covers all
  three fixes directly against the engine (`window.__skibEngine`), same
  pattern as `jayden-gun.spec.js`/`lucky-charm.spec.js` — confirmed each
  test actually exercises the fix (trail slows a chaser, swing moves a
  chaser and decrements swings, badge fires on the grace-window capture).
- `GAME_ITERATION` bumped to `v0.4.36.1` (a patch on `v0.4.36`, not
  `v0.4.37` — see the version-log design-decisions note for why) and
  deployed via `./scripts/deploy-static.sh`.

## What's explicitly not done

- `FLOODED_ANNEX_GRID`/`RAMEN_AISLE_GRID`/`WORLD_STAR_GRID` in
  `frontend/src/mapGrids.js` are still unused empty placeholders —
  `buildFloodedAnnex`/`buildRamenAisle`/`buildWorldStarParkingLot` in
  `GameEngine.js` are still hardcoded pixel-rect functions. This is the
  existing "Level data extraction" backlog item in `docs/roadmap.md`,
  still open, and is a prerequisite for Level 6 per
  `docs/handoffs/roadmap-handoff-v0.4.38-plan.md`.
- Level 6 ("Jayden's Nightmare House") itself — separate scope, see
  `roadmap-handoff-v0.4.38-plan.md`.
- The close-call freeze / reward pass in
  `roadmap-handoff-v0.4.37-plan.md` — unrelated feature, still open.

## Next up

Two independent ready handoffs are open:

1. `docs/handoffs/roadmap-handoff-v0.4.37-plan.md` — close-call freeze +
   reward payout pass.
2. `docs/handoffs/roadmap-handoff-v0.4.38-plan.md` — Level 6 ("Jayden's
   Nightmare House" + Skib-Daddy-Toilet Guy), recommended to pull *after*
   finishing the level-data-extraction migration for the 3 remaining
   levels so Level 6 can be grid-authored from day one.
