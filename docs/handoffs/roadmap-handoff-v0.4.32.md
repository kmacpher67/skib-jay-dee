# Roadmap Handoff — v0.4.32

**Session mode:** Mode B (Implementation)

Picked up the oldest unfinished handoff, `docs/handoffs/roadmap-handoff-v0.4.32-plan.md`
(no open decisions flagged — fully unblocked). Both scoped items fit in
one session: retrofitting Levels 1-3 with mandatory progression badges,
and a separate optional humor-badge spawn system.

## What we did

1. **Progression badges (Levels 1-3)** (`frontend/src/GameEngine.js`,
   `frontend/src/gameContent.js`):
   - Added a `progressionBadgeId` field to the `LEVELS` entries for
     Porcelain Palace (`porcelain-prowler`), Pipeworks (`pipe-dreamer`),
     and Flooded Annex (`annex-relic-hunter`). Levels 4-5 have no field,
     so they're unaffected by the new gate.
   - `_spawnProgressionBadge()` runs from `_syncLevelState()` (level
     start/level-up), spawning one `type: 'badge'` pickup at a random
     walkable point via the existing `_findRandomWalkableSpawn()`
     helper (same pattern the Jayden Gun already used). If the badge was
     already earned in a past run, it's not re-spawned or re-required —
     `levelBadgeCollected` is set `true` immediately instead, so
     completionist replays aren't forced to backtrack for something
     already on the profile. If no walkable spawn point is found (map
     bug), it fails open the same way rather than hard-locking
     progression.
   - `_checkPickups()` now handles `pickup.type === 'badge'`: sets
     `this.levelBadgeCollected = true` and fires `onBadgeEarned()`.
   - Both level-advance branches — the Pipeworks pressure-goal check and
     the generic `advanceAt` check — now additionally require a new
     `_hasRequiredLevelBadge()` guard (`!progressionBadgeId ||
     levelBadgeCollected`), so a level with a mandatory badge can't
     clear until it's found, on top of every existing skreem/time/chaser
     condition.
   - `_drawPickups()` was generalized into a `_pickupStyle()` lookup by
     `pickup.type` so gun/badge/humor-badge pickups render with distinct
     colors (gray/purple/green) instead of all sharing the gun's
     styling.

2. **Humor & Intrigue random badges** (same files):
   - New `HUMOR_BADGE_IDS` pool in `gameContent.js`: `mysterious-plunger`,
     `golden-tp`, `haunted-rubber-ducky` — three new `BADGES` entries
     with their own lore/emoji, same shape as every existing badge.
   - `_maybeSpawnHumorBadge()`, also called from `_syncLevelState()`,
     rolls `HUMOR_BADGE_SPAWN_CHANCE = 18%` per level start (any level,
     not just 1-3) and, on success, spawns one `type: 'humor-badge'`
     pickup for a randomly chosen badge the player hasn't earned yet. If
     every humor badge is already earned, nothing spawns. A missed roll
     at one level just means another shot at the next level start — the
     pool isn't locked to early levels, matching the plan's "if missed
     in early levels, they can potentially spawn in later levels."
   - Collecting one calls `onBadgeEarned()` only — it never touches
     `levelBadgeCollected` or any advance check.

3. **Badge banner cleanup**: `_drawBanner()`'s level-clear badge-emoji
   row was a hardcoded if-chain keyed by badge id, which would have
   needed a new line for every badge added here (and already had a
   leftover duplicate `'lucky'` line from a merge with the concurrent
   v0.4.31 session). Replaced it with a dynamic
   `earnedBadges.map(id => BADGES[id]?.emoji)` lookup — new badges no
   longer need an engine-side rendering change.

4. **Tests:** Added `frontend/e2e/progression-badges.spec.js` — one spec
   forces every other Level 1 advance condition (skreems, elapsed time,
   chaser count) and confirms the phase stays `'chase'` until the
   progression badge pickup is collected, then confirms it immediately
   unlocks `'level-up'`; a second spec forces the humor-badge spawn roll,
   confirms the pickup type, collects it, and confirms
   `levelBadgeCollected` was never touched. Also fixed a pre-existing
   flaky assertion in `frontend/e2e/jayden-gun.spec.js` (stun value
   naturally decays a few hundredths between being set and read; the
   `>= 3` bound occasionally failed by float dust — loosened to `>=
   2.9` with a comment explaining why).

## What's explicitly not done

- Quest Rooms & Landmark Badges (Level 4+) — separate, still-unbuilt
  backlog item, `docs/handoffs/roadmap-handoff-v0.4.33-plan.md`.
- Level 4+ 90-second survival floor — same v0.4.33-plan doc, unrelated
  mechanic, not touched here.
- No new badge asset icons were requested from Ken — the five new
  badges (three progression, three humor) render with existing emoji
  only, consistent with how the four v0.4.30 badges and the v0.4.31
  `lucky` badge already ship (no custom art yet). Flagged in
  `docs/profiles/awards-badges-descriptions.md` if custom art is wanted
  later.
- `GAME_ITERATION` was bumped and the build was deployed to production
  as part of this session (see Deploy section below) — noting it here
  since v0.4.31's handoff explicitly left that step undone; this
  session's user asked for it explicitly.

## Verification

- `cd frontend && npm run build` — clean.
- `npx playwright test` — full suite passes: 22 active specs pass, 1
  pre-existing `test.skip` (`resume-countdown.spec.js`, unrelated to
  this session) still skipped, 0 failures.
- Manual verification against a local `vite preview` build with a
  throwaway Playwright script (not committed): screenshotted the
  progression badge pickup (purple, distinct from the gun's gray), the
  humor badge pickup (green), and the level-clear banner rendering a
  badge emoji pulled dynamically from `BADGES`. Confirmed
  `levelBadgeCollected` flips to `true` on pickup and the level
  immediately advances once every other condition is already met.

## Deploy

- `GAME_ITERATION` bumped to `v0.4.32`.
- Deployed via `./scripts/deploy-static.sh badge-retrofit`.

## Copy-paste: next natural steps

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md`, `docs/update-directions.md`, and
`docs/roadmap.md` before starting.

The early-level progression badges and humor/random badges shipped in
v0.4.32 — don't redo them. The oldest unfinished handoff is now
`docs/handoffs/roadmap-handoff-v0.4.33-plan.md` (Quest Rooms with
chokepoint entrances + the Level 4+ 90-second survival floor), followed
by `v0.4.34-plan` (chaser wall-hacks, "Gawd Particle"). Both are
fully-specified Mode A plans.

Verify with `npm run build` and the full Playwright suite before
calling it done. Update `docs/roadmap.md`, `docs/handoffs/ledger.md`,
`docs/version-log.md`, `docs/update-directions.md`, and a new
`docs/handoffs/roadmap-handoff-vX.Y.Z.md` per the SDLC checklist, and
commit before ending the session.
```
