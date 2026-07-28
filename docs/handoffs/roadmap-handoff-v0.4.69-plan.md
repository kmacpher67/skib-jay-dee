# Roadmap Handoff Plan v0.4.69 — Chaser Beta: Runner AI Item Use

**Created by:** Claude Sonnet 5 — 2026-07-28
**Session mode:** Mode A (Planning / refinement only — docs only, no code,
no build, `GAME_ITERATION` not bumped)
**Status:** Design decision recorded, scope bounded. Code-ready for the
next Mode B session once Ken confirms the "helpful vs. harmful" pickup
list in the open question below (a reasonable default is proposed so this
doesn't block).
**Mode impact:** `Chaser Beta only` (see
[`role-reversal-design.md`](../role-reversal-design.md#12-documentation-contract-for-two-modes)).

## Trigger

Ken played `PLAY AS CHASER — BETA` in the browser (2026-07-28) after the
`v0.4.61` movement/steering recovery landed. Feedback:

- The mode is now actually playable — human chaser moves, AI runner flees
  instead of standing still. Confirms the `v0.4.61` fix held.
- **Still needs work.** Specifically: the AI-controlled runner picked up
  the Jayden Gun pickup during the round and never fired it at the human
  chaser. From the player's seat, being hunted by a gun-carrying opponent
  who never shoots reads as broken/inert, not as a fair fight.
- New requirement: the **runner should be able to use helpful items** (at
  minimum, fire the gun back at the pursuing human chaser) **and avoid
  harmful ones** (not blunder into pickups that would slow it down or
  otherwise hurt its own escape).

## What "read docs/" found

1. **`role-reversal-design.md` §11 (mode boundary matrix) currently says
   Pickups/quest rooms are "Off in recovery slice"** for Chaser Beta.
   That was the `v0.4.61-plan` scope call, written before this pickup
   ever spawned in front of Ken.
2. **The code never actually enforced that.** `GameEngine.js`
   `_syncLevelState()` calls `_maybeSpawnGunPickup()`,
   `_spawnQuestRoomBadge()`, `_spawnProgressionBadge()`,
   `_maybeSpawnHumorBadge()`, `_maybeSpawnGawdParticle()`,
   `_maybeSpawnRodOfPoopdom()`, `_maybeSpawnTurdstoneToken()`, and
   `_maybeSpawnTacoBell()` unconditionally — none of those spawn calls
   are gated on `this.isChaserMode`. So campaign pickups have been
   spawning into the Chaser Beta arena the whole time, contradicting the
   design doc. Ken's playtest is the first time anyone noticed, because
   it's the first time the mode was playable long enough for a gun to
   matter.
3. **The AI runner has zero pickup awareness.** `_getRunnerEvadeVector()`
   (`GameEngine.js:916`) only ever computes a flee/wander vector off the
   nearest chaser and wall probes — it has no knowledge of `this.pickups`
   or `this.rollingPickups` at all, so the runner can walk over a gun,
   auto-collect it (the collision/collect path is shared with the human
   runner), and then just... keep fleeing. It has no fire logic, no
   concept of "this item helps me," and no concept of "this item hurts
   me, route around it."
4. **A helpful/harmful classification already exists and is reusable.**
   `gameContent.js` exports `POSITIVE_PICKUPS` (`gun`, `schleimy-potion`,
   `taco-bell`, `gawd-particle`, `decoy`, `heavy-plunger`, …) and
   `GameEngine.js`'s `onPickupConsumed()` call already buckets every
   pickup into `'good'` vs `'bad'` for telemetry using that same list.
   This is the natural source of truth for "helpful vs. harmful" from the
   runner's point of view — no new taxonomy needed, just a decision on
   whether it needs runner-specific tweaks (see open question below).

## Decision for this slice

Ken's playtest supersedes the earlier "pickups off in recovery slice"
call. Pickups **stay on** in Chaser Beta (removing them now would be a
regression from what Ken just played and liked enough to keep testing),
but the AI runner needs to actually *engage* with them instead of
ignoring them. Two things, scoped as one bounded Mode B slice:

1. **Give the AI runner pickup awareness — seek helpful, avoid harmful.**
   Extend `_getRunnerEvadeVector()` (or a small sibling helper it calls)
   so that, when not under immediate flee pressure (i.e. the existing
   "far" branch, `minDist > 250`), the runner steers toward the nearest
   pickup in `POSITIVE_PICKUPS` instead of only the map-center waypoint.
   When a pickup is *not* in `POSITIVE_PICKUPS` (i.e. would land in the
   `'bad'` bucket `onPickupConsumed()` already computes), the same
   steering should bias away from it the way it already biases away from
   walls, using the existing wall-probe steering shape rather than a new
   system.
2. **Give the AI runner offensive item use.** Once the runner is holding
   a usable item that has an active/fire action (gun ammo > 0 today; keep
   the hook generic enough that a future item — e.g. a Kill Fart charge —
   can plug into the same decision point later), fire it at the pursuing
   human chaser under the same conditions a human player would use the
   fire button: chaser within a reasonable range and roughly in front of
   the runner's facing direction. Reuse the existing `_tryFire()` /
   bullet path — do not invent a second projectile system for AI use.

Keep this narrowly scoped to what Ken actually asked for (the gun) plus
the general "helpful vs. harmful" framing he asked for — do not use this
slice to also design a full AI itemization/loadout strategy or new
pickups.

## Open question for Ken (has a proposed default — not blocking)

`heavy-plunger` is listed in `POSITIVE_PICKUPS` (offensive knockback
tool) even though picking it up also imposes a `-30%` movement-speed
penalty while held — a mixed blessing for a fleeing runner in a way it
isn't for the human runner in campaign mode (who can also choose not to
pick it up). **Proposed default:** treat `POSITIVE_PICKUPS` as-is for the
"seek" bias (reuse the existing list verbatim, no runner-specific carve
-out) for this first slice, and revisit only if playtesting shows the AI
runner grabbing the plunger and then dying because it's slowed. Flag this
explicitly in the shipped handoff either way so it's not silently
decided.

## Mode boundary note (for `role-reversal-design.md` §11)

This plan also corrects the design doc's Pickups row, which said "Off in
recovery slice" while the shipped code never enforced that. The row is
being updated to reflect actual, Ken-approved behavior: pickups are **on**
in Chaser Beta, and the AI runner is expected to use them. Quest-room
badges, progression badges, and turdstone tokens are cosmetically present
but should have **no profile/economy effect** in Chaser Beta (the
mode-boundary rule that *does* still hold — no sheebs, no badges granted,
no `deathsHistory`/`highestLevel` writes). If any of those spawn calls
are found to be writing profile state in Chaser Beta during the Mode B
session, that's an in-scope bug fix for this same slice (it would be a
correctness gap, not new scope) — but do not go looking for unrelated
profile leaks beyond what's needed to confirm this.

## Explicitly not done in this pass

- No code changes yet.
- No `GAME_ITERATION` bump.
- No deploy.
- No new pickup types, no AI itemization strategy beyond "use the gun,
  route around obviously bad pickups."
- No changes to the human-runner (`PLAY AS RUNNER` / campaign) AI or
  pickup logic — this only touches `isChaserMode` behavior.
- No resolution of the `heavy-plunger` mixed-blessing question beyond the
  proposed default above.

## Files likely touched (next Mode B session)

- `frontend/src/GameEngine.js` — `_getRunnerEvadeVector()` (pickup
  seek/avoid steering), a new small AI-fire decision hook near the
  existing `_tryFire()` call site, and a `isChaserMode` guard audit on
  any badge/token spawn or collection path found to be writing profile
  state.
- `frontend/src/gameContent.js` — only if the open question above comes
  back with a runner-specific carve-out; otherwise no change needed here.
- `docs/role-reversal-design.md` — mode-matrix Pickups row (already
  updated this session, see below) plus a short note once the AI
  behavior actually ships.
- `frontend/e2e/` — a focused Chaser Beta test that seeds a gun pickup
  near the AI runner and asserts it fires at least once at the human
  chaser within a bounded time window, plus a harmful-pickup-avoidance
  check if that's feasible to assert deterministically.

## Copy-paste: next coding session

```text
Read docs/skib-sdlc.md, then docs/role-reversal-design.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.69-plan.md), then inspect
_getRunnerEvadeVector(), _maybeSpawnGunPickup(), and the pickup-collision/
onPickupConsumed() path in frontend/src/GameEngine.js.

Implement Chaser Beta runner item use:

1. Extend _getRunnerEvadeVector() so that when the runner is not under
   immediate flee pressure (the existing minDist > 250 branch), it steers
   toward the nearest pickup whose type is in POSITIVE_PICKUPS
   (gameContent.js), reusing the existing wall-probe steering shape
   rather than a new system. Bias away from non-POSITIVE_PICKUPS pickups
   the same way.
2. Add an AI-fire decision: when isChaserMode is true, the runner is
   holding gun ammo, and the human chaser (chasers[0]) is within firing
   range and roughly ahead of the runner's facing direction, trigger the
   same fire path a human player's fire button uses (reuse _tryFire() /
   the bullet system — do not build a second projectile path).
3. Audit _syncLevelState()'s badge/token spawn calls
   (_spawnQuestRoomBadge, _spawnProgressionBadge, _maybeSpawnHumorBadge,
   _maybeSpawnTurdstoneToken) and their collection handlers for any
   profile/economy writes that fire even when isChaserMode is true. Gate
   any found writes behind !this.isChaserMode — this is an in-scope bug
   fix per this handoff, not new scope creep.
4. Leave the heavy-plunger POSITIVE_PICKUPS classification as-is (Ken's
   proposed default in this handoff) unless Ken has since said otherwise.
5. Add a focused Playwright test: seed a gun pickup near the AI runner in
   Chaser Beta, run the loop forward, assert the runner fires it at the
   human chaser within a bounded time window.
6. Verify with cd frontend && npm run build and npx playwright test.
7. Update docs/version-log.md, docs/handoffs/ledger.md,
   docs/update-directions.md, docs/roadmap.md, and this handoff's shipped
   twin (roadmap-handoff-v0.4.69.md) per docs/skib-sdlc.md step 4. Bump
   GAME_ITERATION and deploy only once verified.

Do not expand into new pickup types, AI itemization strategy, or
human-runner (campaign) AI changes. Chaser Beta only.
```
