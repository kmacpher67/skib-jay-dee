# Roadmap Handoff v0.4.57 — Rod of Poopdom: second teleport dead

**Created by:** Cursor Grok 4.5 — 2026-07-27
**Last updated by:** Cursor Grok 4.5 — 2026-07-27
**Session mode:** Mode A (Planning / investigate — docs only, no code)
**Status:** READY FOR MODE B (hotfix — jump the feature queue)

## Trigger

Ken playtest report:

> Teleporting works the first time I got it, but not the second time I got it

"It" = the Rod of Poopdom (v0.4.47). Same held rod, second warp attempt after
the designed 3s Stinky cooldown — not a second pickup across levels.

## Investigation (read-only)

Reviewed `frontend/src/GameEngine.js` against the shipped v0.4.47 handoff
and `docs/players-guide.md` Rod section.

### Primary root cause — `stinkyTimer` never ticks down

| Step | Code | Behavior |
|---|---|---|
| Collect rod | `_updatePickups` → `runner.rod = true` (~1428) | OK |
| First WARP/`T` | `_tryFire` → `_tryTeleport` (~1835) | OK — moves runner, sets `stinkyTimer = ROD_OF_POOPDOM_COOLDOWN` (3) |
| Cooldown gate | `_tryTeleport` line ~1754: `if (this.stinkyTimer > 0) return` | Blocks every later attempt |
| Tick | Chase update (~1019–1083) decrements `gawdParticleTimer`, `schleimyPotionTimer`, `tacoBellTimer`, `decoyTimer`, `soggyTpTimer`, `brothFrictionTimer`, `fireCooldown`… | **`stinkyTimer` is missing** |

`stinkyTimer` is only ever:

- set to `0` on construct / `_syncLevelState`
- set to `3` on a successful warp
- read for the WARP button label (`Math.ceil(this.stinkyTimer) + 's'`)

So after the first successful teleport, the button stays on **`3s` forever**
and every subsequent `_tryTeleport` returns immediately. That matches the
report exactly.

Level sync resets `stinkyTimer = 0` (~867), so a *new* level's first warp
can work again — the bug is within a single rod hold / level, not "rod never
works twice in a lifetime."

### Secondary findings (do not block the hotfix; note for Mode B)

1. **Silent cooldown deny.** When `stinkyTimer > 0`, `_tryTeleport` returns
   with no `runnerLine`. Wall-block paths do show `Cannot teleport there!`.
   Optional polish: `Still stinky!` (or similar) so stuck cooldown is
   distinguishable from wall deny — not required if the tick fix lands.
2. **Smoke VFX never ages.** `smokeEffects` particles are pushed with
   `age: 0` / `life: …` (~1787) and drawn (~2228) using `s.age / s.life`,
   but nothing increments `age` or filters expired entries. Smoke can
   linger opaque. Fix alongside the timer tick (same chase-update block).
3. **Pointer vs world coords (parked).** `pointerPos` comes from
   `_toViewCoords` (view 360×640), while runner position is world-space.
   `_tryTeleport` subtracts them directly (~1756–1759). Facing fallback
   (`pointerPos === {0,0}`) is what mobile/keyboard often hits, which is
   why the *first* warp still feels usable. Do **not** expand this hotfix
   into a targeting redesign unless Ken asks — separate follow-up if needed.
4. **No Playwright coverage.** v0.4.47 handoff already flagged this gap.
   Mode B should add a small e2e that forces a rod, warps twice with a
   simulated dt past cooldown, and asserts the second warp moves the runner.
5. **Odd plunger coupling (out of scope).** `_swingPlunger` clears
   `runner.rod = false` when swings hit 0 (~1747–1750). Plunger pickup
   already clears the rod; this line is dead/wrong for normal rod play.
   Leave alone unless Mode B is already in that function.

## Fix plan (Mode B — single session)

**Files:** `frontend/src/GameEngine.js` only (plus new e2e + docs/ledger).

1. In the chase-phase timer block (same place as `tacoBellTimer` /
   `fireCooldown`), add:
   - `this.stinkyTimer = Math.max(0, this.stinkyTimer - dt)`
   - age/filter `smokeEffects` (`age += dt`, drop when `age >= life`)
2. Verify WARP button returns from `3s` → `WARP` after ~3s and a second
   warp succeeds into open floor.
3. Add `frontend/e2e/rod-of-poopdom.spec.js` (force `runner.rod = true` via
   `window.__skibEngine`, call `_tryTeleport` / fire path twice with
   cooldown elapsed).
4. Bump `GAME_ITERATION` → **v0.4.57**, append VersionModal /
   version-log / ledger / shipped handoff, deploy only if Ken asks.

**Acceptance:**

- First warp still works.
- After ≥3s of chase time, second warp works (open destination).
- During cooldown, button shows countdown that actually decreases.
- Wall-blocked destination still denies without consuming cooldown
  (current behavior — keep it).
- `npm run build` + Playwright suite green.

## Queue priority

**Jump ahead of Slice B / Play Recap / v0.4.54–56.** This is a shipped
feature regression with a one-line root cause. Feature work waits until
the rod is reusable.

## Explicitly not in this pass

- No code in this Mode A session.
- No retune of spawn chance, range, or wall-deny policy.
- No Player's Guide rewrite beyond a one-line "fixed in v0.4.57" note when
  Mode B ships.
- No pointer→world targeting rewrite.

## Flag for Ken

None — root cause is clear; no product decision needed. Optional: after
ship, confirm second warp feels right on mobile (facing-only targeting).

---

