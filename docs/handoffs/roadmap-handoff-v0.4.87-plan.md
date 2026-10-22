# Roadmap Handoff Plan v0.4.87 — Issue #10 Weapon Carry and Ammo Fun

**Created by:** Codex (GPT-5)  
**Created on:** 2026-10-22  
**Last updated by:** Codex (GPT-5)  
**Session mode:** Mode A (planning / refinement only — docs only; no code, build, version bump, or deploy)  
**Mode impact:** Runner campaign first; Chaser Beta must keep its existing AI-runner handgun path and must not write campaign profile stats.

GitHub issue: [#10](https://github.com/kmacpher67/skib-jay-dee/issues/10).
This handoff is intentionally queued after the Pac-Man issue #8 final asset
slice. It does not claim that Pac-Man is closed yet.

## Settled direction from Ken

The next weapon pass should make firefights more available and more fun:

- Handgun pickups and handgun-ammo pickups add usable shots instead of
  replacing the existing handgun.
- Handgun ammo caps at **6 shots**.
- The runner can carry a handgun and the Boom Stick shotgun at the same time.
- The selected weapon is used until its usable ammo is exhausted; then the
  engine automatically selects the other weapon if it still has ammo.
- Picking up a weapon or ammo should not silently delete the other weapon.
- Level 4–6 should expose more opportunities to find guns, shotgun shells,
  and helpful pickups, while retaining the existing wall-safe placement rules.

Recommended selection rule for the coding slice: a newly collected weapon
becomes selected, and an ammo pickup for an unselected weapon does not change
selection. When the selected weapon empties, switch to the other weapon. This
keeps the player's most recent pickup useful without adding a weapon-switch
button to the portrait UI. If Ken wants a fixed handgun-first order instead,
change only the selection policy; the inventory and ammo contract remains the
same.

## Existing behavior to preserve

- `frontend/src/GameEngine.js` currently stores one active weapon in
  `runner.gun`; handgun pickups grant 1–2 rounds and replace that state.
- Boom Stick already has a loaded shell plus up to five reserve shells,
  reload timing, cone blast, explosion/shatter theater, SFX, and captions.
- Plunger, Rod of Poopdom, and Shart Knocker currently share the FIRE input and
  may replace the active weapon. Do not redesign those active-item rules in
  this slice.
- Chaser Beta's AI runner uses the handgun path. Keep its gun pickup/fire
  behavior compatible, but do not add shared profile rewards or campaign
  persistence from Beta rounds.
- Cookie-backed profile state, random Quick Play faces, and the portrait 9:16
  layout must remain unchanged.

## Proposed weapon contract

Use a small normalized inventory rather than two unrelated booleans:

```text
runner.weapons = {
  handgun: { ammo: 0 },
  boom_stick: { ammo: 0, reserve: 0, reloadTimer: 0 }
}
runner.selectedWeapon = 'handgun' | 'boom_stick' | null
```

The implementation may retain a temporary `runner.gun` compatibility alias
while migrating the engine, but all new pickup/fire/HUD logic should read the
normalized inventory. Do not let a zero-ammo handgun or an empty Boom Stick
reserve count as usable inventory.

### Handgun ammo

- `HANDGUN_MAX_AMMO = 6` is the hard cap for loaded handgun shots in this
  slice.
- A handgun pickup creates the handgun if absent and adds the planned pickup
  amount, clamped to 6. It selects the handgun because it is a weapon pickup.
- A future/rolling handgun-ammo pickup adds to the handgun, clamped to 6,
  without deleting or selecting away from the Boom Stick.
- If the player already has six handgun shots, show a short `HANDGUN AMMO
  FULL` line and do not create shots beyond the cap, following the existing
  full-ammo Boom Stick behavior.
- Keep the existing bullet speed, cooldown, and handgun stun values in this
  first pass. The broader handgun stun/knockback and chaser HP table remain
  separate work under issue #3.

### Boom Stick coexistence

- A Boom Stick pickup creates or refills the Boom Stick state and selects it,
  but never clears the handgun inventory.
- A loose shell adds to the Boom Stick chamber/reserve using the existing
  one-loaded + five-reserve contract and never clears the handgun.
- When the Boom Stick is empty and has no reserve, it must not block fallback
  to a loaded handgun.
- Existing blast, reload, body-count, respawn, splat, and cutaway mechanics are
  out of scope except for changing their state lookup from a single active gun
  to the selected Boom Stick record.

### Firing and fallback

1. FIRE uses `selectedWeapon` if that weapon has usable ammo and is not
   reloading.
2. When a shot consumes the last usable round, select the other weapon if it
   has usable ammo; otherwise leave selection empty.
3. A selected empty weapon must not prevent firing the other loaded weapon.
4. Keep the current Rod, Plunger, and Shart Knocker priority behavior unless a
   weapon-state migration requires a narrow guard around it.
5. Chaser Beta's AI should select/fire its handgun as before; it does not need
   shotgun AI in this slice.

## Spawn and level-pressure tuning

Issue #10 asks for more helpful items in Levels 4–6. In this weapon slice:

- Increase the existing handgun pickup/event opportunity for Level 4–6 using
  explicit level-indexed constants, not an unconditional global multiplier.
- Add or increase loose Boom Stick shell opportunities when the runner already
  owns the Boom Stick, while preserving the existing duplicate-pickup refresh
  and reserve cap.
- Keep every pickup wall-safe through `_findRandomWalkableSpawn()` or the
  existing entity-sized resolver.
- Do not introduce a second overlapping random-roll system if the existing
  `_maybeSpawnGunPickup()` / `_tryBoomStickEvent()` hooks can be extended.

The exact Level 4–6 percentages are implementation parameters for the coding
slice: start from the shipped Level 4 handgun chance and Boom Stick table,
raise only the later-level opportunities enough to make the request
observable, and document the chosen constants after playtesting.

## Explicitly separate from this weapon slice

Issue #10 also asks for the following, but they need their own bounded slices:

- A visible time-left countdown for each level, tied to the actual level
  advance threshold including Pac-Man's tunnel extension.
- More chaser respawns after a cooldown. Boom Stick currently has its own
  respawn queue; generalizing all removal/respawn paths needs a separate
  balance and test pass.
- The Fart Blocker ammo/easter egg, which makes a hit chaser obey walls again.
  Its award name, duration, target scope, and persistence are not settled.
  Keep it parked; do not infer those values from the issue body.

## Files and tests

- `frontend/src/GameEngine.js` — normalized runner inventory, pickup merge,
  weapon selection/fallback, HUD, firing, and Level 4–6 spawn tuning.
- `frontend/e2e/jayden-gun.spec.js` — extend handgun pickup/ammo tests.
- `frontend/e2e/boom-stick-c1.spec.js` and Boom Stick tests — add coexistence
  and fallback coverage while preserving shell/reload assertions.
- `docs/players-guide.md` — update the weapon glossary after behavior ships.

## Verification contract for Mode B

Run from `frontend/`:

```text
npm run build
npx playwright test frontend/e2e/jayden-gun.spec.js frontend/e2e/boom-stick-c1.spec.js
npx playwright test
```

The focused tests must prove: handgun ammo stacks and clamps at 6; handgun
and Boom Stick survive each other's pickups; the selected weapon fires until
empty; fallback selects the other loaded weapon; empty weapons do not block a
loaded one; Level 4–6 spawn tuning is deterministic and wall-safe; and Chaser
Beta still fires the handgun without campaign profile writes.

## Ken-side decisions still needed later

- Choose final Level 4–6 pickup percentages after a live playtest if the
  initial tuning is too generous or too sparse.
- Define the Fart Blocker award/effect before that separate slice is marked
  code-ready.
- Confirm the desired countdown presentation before the timer slice.

## Copy-paste: next coding session (after Pac-Man #8 is complete)

```text
Work in Mode B only after Pac-Man issue #8 final assets/captions are complete.
Read docs/skib-sdlc.md, docs/update-directions.md, docs/roadmap.md, and
docs/handoffs/roadmap-handoff-v0.4.87-plan.md.

Implement only the weapon/ammo slice of GitHub issue #10 in
frontend/src/GameEngine.js and the focused e2e tests: replace the single-slot
handgun/Boom Stick assumption with a normalized two-weapon inventory; handgun
pickups/ammo add shots up to HANDGUN_MAX_AMMO=6; Boom Stick and handgun coexist;
newly collected weapons become selected; FIRE uses the selected weapon until
empty, then falls back to the other loaded weapon. Preserve Boom Stick's
one-shell/five-reserve reload/blast behavior, existing active-item priority,
Chaser Beta handgun behavior, wall-safe pickups, and portrait UI.

Tune only the existing handgun/Boom Stick helpful-pickup opportunities for
Levels 4–6 with explicit constants. Do not implement the countdown, generalized
respawn system, or Fart Blocker award. Run npm run build plus the focused and
full Playwright suites. If green, update the SDLC docs, bump GAME_ITERATION,
commit, and deploy with ./scripts/deploy-static.sh issue-10-weapons.
```

Dispatch hints: `code_monkey_backend=ollama`,
`code_monkey_model=thinkpad-local`. Keep the coding slice small if the local
model times out; do not fold the timer or Fart Blocker into it.
