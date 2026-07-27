# Roadmap Handoff — v0.4.31

**Session mode:** Mode B (Implementation)

Picked up the oldest unfinished handoff, `docs/handoffs/roadmap-handoff-v0.4.31-plan.md`
(already fully confirmed by Ken — fire input, hit effect, map-pickup
acquisition for the Gun, and the Lucky Charm/badge concept were not
re-litigated). Both scoped items fit in one session: the Jayden Gun and
the Lucky Charm shop item + Lucky badge.

Two of the plan's "still open" items required Ken's explicit
confirmation before coding, per the plan doc's own flag. Asked before
starting:

1. **Lucky Charm cost/odds** — Ken's answer was "both": two stacking
   tiers, `Lucky Charm` (150 sheebs, +15%) and `Golden Lucky Charm` (250
   sheebs, +25%), rather than a single item.
2. **Lucky badge trigger** — confirmed the plan's recommendation: fires
   on the luck bonus's first actual proc, not on purchase.

The remaining "small, non-blocking" open items (fire cooldown, comedic
flavor specifics) were left to be decided during coding per the plan
doc's own instruction, not re-asked.

## What we did

1. **The Jayden Gun** (`frontend/src/GameEngine.js`):
   - `_maybeSpawnGunPickup()` spawns one map pickup per level at a
     random walkable point (`GUN_BASE_SPAWN_CHANCE = 50%`, boosted by
     `loadout.luckBonus` via a two-stage roll — see below).
   - `_checkPickups()` grants 1 ammo 70% of the time, 2 otherwise
     (`GUN_AMMO_ONE_CHANCE`), on runner/pickup overlap.
   - `runner.facing` is now tracked continuously off the existing move
     vector, so a stationary runner still fires in its last-faced
     direction.
   - Firing is bound to a new dedicated `KeyF` (edge-triggered, not
     full-auto) and a new on-canvas FIRE touch button that only renders
     while a gun is held, positioned above the existing SPRINT button.
     `GUN_FIRE_COOLDOWN = 0.6s` between shots.
   - `_updateBullets()` moves bullets at `GUN_BULLET_SPEED = 480`px/s,
     removes them on wall hit or leaving world bounds, and on chaser
     hit sets `chaser.stunnedUntil` to a random 3-5s
     (`GUN_STUN_MIN`/`GUN_STUN_MAX`). Stunned chasers skip their normal
     chase-movement step in the main update loop but are still subject
     to capture/skreem checks (so standing on a frozen chaser still
     catches you).
   - The gun disappears (`runner.gun = null`) the instant its ammo hits
     zero. Firing empty-handed just shows a `GUN_CLICK_LINES` speech
     bubble — comedic, no gameplay effect.
   - Added a small dazed-sprite overlay + `GUN_HIT_LINES` speech bubble
     on the chaser when stunned, and an ammo counter in the HUD.

2. **Lucky Charm + Lucky badge** (`frontend/src/gameContent.js`,
   `frontend/src/GameEngine.js`):
   - Two new stacking `SHOP_ITEMS` entries: `lucky-charm` (150/+15%),
     `golden-lucky-charm` (250/+25%). `buildLoadout()` sums owned tiers
     into a new `luckBonus` field, following the exact pattern of the
     existing speed/stamina/reward bonuses.
   - `loadoutLuckBonus` threaded through `GameCanvas.jsx` →
     `GameEngine` constructor/`setLoadout()`, and shown on the menu's
     perk strip once non-zero.
   - The gun's spawn roll is two-stage: a base roll against 50%, and
     only if that fails, a second roll against `luckBonus` alone. This
     makes "the luck bonus actually caused this spawn" a direct,
     honest check rather than an approximation — a spawn from the base
     roll doesn't trigger the badge, only one that only happened
     because of the second roll does.
   - New `lucky` entry in `BADGES` (`gameContent.js`), fired (and
     deduped, same as every other badge) the first time that second
     roll succeeds. Updated the trigger note in
     `docs/profiles/awards-badges-descriptions.md` from "Ken to
     confirm" to "confirmed and implemented."

3. **Tests:** Added `frontend/e2e/jayden-gun.spec.js` (pickup → ammo →
   aimed shot → stun window/frozen-chaser check → gun-disappears-at-0 →
   empty-handed click) and `frontend/e2e/lucky-charm.spec.js` (forces
   the base roll to fail and the luck roll to succeed via a scoped
   `Math.random` override, asserts the bonus pickup spawns and the
   badge fires exactly once) — both manipulate engine state directly
   via `window.__skibEngine`, the same pattern as the existing specs.

4. **Docs:** Updated `docs/roadmap.md` (checked off both items),
   `docs/handoffs/ledger.md`, `docs/version-log.md`,
   `docs/update-directions.md`, `docs/gameplay-mechanics.md` (new "The
   Jayden Gun" section + luck row in the loadout table),
   `docs/profiles/awards-badges-descriptions.md`, and
   `frontend/src/components/VersionModal.jsx`.

## What's explicitly not done

- Rolling Pickups (Mario-style) — separate, still-undesigned backlog
  item, out of scope per the plan doc.
- Schleimy Potion — still its own blocked-on-tuning backlog item; the
  Lucky Charm's "future good items" framing is forward-looking only.
- Did not retroactively backfill the missing v0.4.30/v0.4.30.1 entries
  in `VersionModal.jsx`'s `PAST_VERSION_NOTES` — pre-existing gap, not
  touched by this session's scope.
- `GAME_ITERATION` was **not** bumped and nothing was deployed — the
  session instructions scoped that to "only if asked," and it wasn't.

## Verification

- `cd frontend && npm run build` — clean.
- `npx playwright test` — full suite passes: 20 active specs pass, 1
  pre-existing `test.skip` (`resume-countdown.spec.js`, unrelated to
  this session) still skipped, 0 failures.
- Manual verification in a headless preview beyond the automated specs:
  screenshotted the gun pickup sprite rendering on the map, the ammo
  HUD + FIRE button appearing once a gun is held, and both new shop
  cards rendering with correct name/cost/effect copy.

## Copy-paste: next natural steps

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md`, `docs/update-directions.md`, and
`docs/roadmap.md` before starting.

The Jayden Gun and Lucky Charm/Lucky badge shipped in v0.4.31 — don't
redo them. The oldest unfinished handoff is still
`docs/handoffs/roadmap-handoff-v0.4.26-plan.md` (sheebs debt above
level 3, losable shop items above level 4), but it stays explicitly
blocked on product decisions from Ken (see its "Flag for Ken" section)
— do not start coding it until those are answered in conversation.

If Ken hasn't answered that yet, the next unclaimed, unblocked items
from `docs/roadmap.md` are the cosmetic shop item (sink) and the menu
brag stat (best level + fewest deaths) — both small and open. Rolling
Pickups (Mario-style) is still undesigned and would need a Mode A plan
first.

Verify with `npm run build` and the full Playwright suite before
calling it done. Update `docs/roadmap.md`, `docs/handoffs/ledger.md`,
`docs/version-log.md`, `docs/update-directions.md`, and a new
`docs/handoffs/roadmap-handoff-vX.Y.Z.md` per the SDLC checklist, and
commit before ending the session.
```
