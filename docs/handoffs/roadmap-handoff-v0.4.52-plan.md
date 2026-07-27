# Roadmap Handoff v0.4.52-plan — Tombstone Perk (Resurrection Ward)

**Created by:** Claude Sonnet 5 — 2026-07-27
**Session mode:** Mode A (Planning — docs only, no code changes)
**Status:** SPECCED — several open decisions for Ken, not code-ready yet

## Note on concurrent work

`docs/handoffs/roadmap-handoff-v0.4.48-plan.md` (Composer, Gameplay
Rebalancing), `v0.4.49-plan.md` (Broth Slip), `v0.4.50-plan.md`
(cosmetic shop sink), and `v0.4.51-plan.md` (wall-pinch collision
traps) are uncommitted, in-flight or unshipped planning docs from other
sessions as of this writing. None of them touch pickups or the death
flow, so this is a new, independent plan in the next free version slot
(`v0.4.52-plan.md`) rather than an edit to any of them.

## Ask

Ken asked for a new perk/pickup, working name **"Tombstone Perk"**
(Ken's own shorthand: "Tombstone Poop perk," comparing it to Call of
Duty's Tombstone perk). Pasted spec, reproduced in full:

> **Feature: Tombstone Perk (Resurrection Ward)** — Category: Map
> Collectible / Passive Power-Up.
>
> 1. **Spawn & Rarity Mechanics.** Dynamic spawning at eligible spawn
>    nodes/loot pools as the player explores. Dedicated rarity tier
>    (Rare/Epic) — low probability so it feels like a high-value
>    lifeline, not a guarantee every run. Held passively in the
>    background once picked up, until the trigger condition (player
>    death) is met.
> 2. **Trigger Effects (On-Death).** Inventory Retention ("Stuff
>    Saver") — intercepts the death penalty sequence, player keeps
>    100% of current loadout/items/currency that would normally be
>    wiped or dropped. Current Level Respawn — bypasses game-over/hub
>    return, resurrects the player at the exact starting
>    coordinates/entry point of the *current* level. Consumption —
>    single-use, permanently consumed the moment resurrection
>    triggers.

## What this planning pass found in the engine

Read `frontend/src/GameEngine.js` end to end for the death/pickup flow
before scoping anything, because this game's death mechanic is not a
plain "respawn in place" — it's already a forgiving, roguelite-ish
design, and Tombstone has to be specced against what's actually there,
not assumed CoD behavior:

1. **Death does not currently return to a game-over/hub screen.**
   `_triggerCaught()` (`GameEngine.js:1904`) runs a jump-scare
   ("caught") phase, then `_updateCaught()` (`GameEngine.js:1978`)
   auto-resumes the same session. There is no "hub return" state to
   bypass — Ken's spec item 2's "bypasses the game-over screen" is
   already true today for every death, Tombstone or not.
2. **Death already advances `levelIndex` by one** (`GameEngine.js:1948`,
   `this.levelIndex++`, inside `_triggerCaught`). Combined with
   `_updateCaught` respawning at `this.level.runnerSpawn` (which reads
   the *new*, incremented level), every death today silently pushes the
   player one level forward, not back to the level they died on. This
   is the one piece of Ken's spec that's actually a real behavior
   change to build — "Current Level Respawn" means Tombstone must
   *skip* this increment for that one death, which is new special-case
   logic, not a no-op.
3. **Inventory retention is mostly already true.** Gun/plunger/Rod of
   Poopdom state (`this.runner.gun` / `.plunger` / `.rod`) is never
   cleared on death anywhere in `_triggerCaught`/`_updateCaught` — only
   swapped when picking up a different item (`GameEngine.js:1306-1317`)
   or when gun ammo hits 0 (`GameEngine.js:1757`). So "Stuff Saver" is
   effectively already the default. The actual things death *does* take
   today are:
   - `skreemsLost` / `sheebsLost` currency penalty
     (`GameEngine.js:1921-1936`, `DEATH_SKREEM_PENALTY` /
     `DEATH_SHEEBS_PENALTY`, worse above `highestLevel > 3`).
   - The rest of the level you were on (since you're bumped to the next
     level's fresh `_syncLevelState()`, including that level's own
     pickups/badges you hadn't collected yet).
4. **No existing "held background item" pattern to copy exactly.**
   Rod of Poopdom (`runner.rod`) and Heavy Plunger (`runner.plunger`)
   are held-until-swapped weapon slots, not held-until-triggered wards,
   and they clear each other on pickup (can't hold two at once — see
   `GameEngine.js:1306-1317`). Tombstone needs its own boolean flag
   (e.g. `runner.hasTombstone`) that is independent of the
   gun/plunger/rod slot so a player can carry a weapon *and* a
   Tombstone at the same time, and that must **survive**
   `_syncLevelState()`'s per-level reset (`GameEngine.js:815-878`) when
   advancing levels normally — it should only ever be cleared by (a)
   consumption on a saved death, or (b) an unsaved death, if Ken decides
   it shouldn't carry across a death that already killed the run.

## Proposed design (no code written this session)

- **New pickup type `'tombstone'`**, spawned via a `_maybeSpawnTombstone()`
  following the exact `_maybeSpawnRodOfPoopdom()` pattern
  (`GameEngine.js:1512-1524`), called from `_syncLevelState()` alongside
  the other `_maybeSpawn*` calls (`GameEngine.js:872`). Rarer than Rod
  of Poopdom's 5% (`ROD_OF_POOPDOM_SPAWN_CHANCE = 0.05`,
  `GameEngine.js:372`) — recommend **2%** to read as a genuine
  Rare/Epic lifeline per Ken's spec, but this is a tuning number for
  Ken to confirm, not a hard recommendation.
- **Pickup handling:** add a `pickup.type === 'tombstone'` branch next
  to the others in the collection switch (`GameEngine.js:1312-1318`)
  that sets `this.runner.hasTombstone = true` and shows a runner line
  ("Tombstone secured." or similar — final copy TBD).
- **Death-time branch in `_triggerCaught()`:** immediately after
  `this.deaths += 1` (`GameEngine.js:1917`), if
  `this.runner.hasTombstone` is true:
  - Skip the `skreemsLost`/`sheebsLost` block entirely
    (`GameEngine.js:1921-1936`) — no currency penalty this death.
  - Skip `this.levelIndex++` (`GameEngine.js:1948`) — stay on the level
    the player died on.
  - Set `this.runner.hasTombstone = false` (single-use consumption).
  - Still show the jump-scare/caught visual beat (per Ken's CoD
    reference — Tombstone in CoD still "downs" you visually before the
    save), but the `onCaught`/`onDeath` payloads should probably flag
    `tombstoneSaved: true` so `App.jsx` can show a distinct "Saved by
    Tombstone!" message instead of (or alongside) the normal capture
    line — exact UX is an open question below.
  - `_updateCaught()`'s respawn-position reset
    (`GameEngine.js:1993-1996`, `this.level.runnerSpawn`) needs no
    change — since `levelIndex` wasn't bumped, `this.level` is already
    the same level the player died on, so "current level respawn"
    falls out for free once the increment is skipped.

## Open questions for Ken (blocking Mode B)

1. **Spawn rarity.** Is 2% a reasonable target, or does Ken want it
   tuned differently (e.g. tied to level index, or guaranteed at least
   once per N levels so it doesn't feel purely RNG-gated on hard
   levels)?
2. **Does the death counter (`this.deaths`) still increment on a
   Tombstone-saved death?** It currently drives the `deaths >= 50`
   "glutton-for-punishment" badge and lifetime death stats. Recommend
   yes (it still reads as a "death" for stats/flavor, just a survived
   one) but Ken should confirm since it affects badge pacing.
3. **Does `chaserSpeedMod` still ramp up** (`GameEngine.js:1949-1953`,
   `CHASER_SPEED_MOD_DEATH_STEP`) **on a Tombstone save?** If yes, a
   saved death still makes the game harder going forward, matching a
   normal death; if no, Tombstone is a "free do-over" with zero
   difficulty cost. No stated intent either way in Ken's spec —
   defaulting to "yes, still ramps" (smaller diff, avoids Tombstone
   becoming a difficulty-reset exploit) unless Ken says otherwise.
4. **UX for the save moment.** Distinct message/animation ("Saved by
   Tombstone!") vs. just letting the existing jump-scare play out
   silently with the level-not-advancing being the only tell? Ken's CoD
   comparison suggests players expect to *notice* the save.
5. **Does holding a Tombstone show anywhere in the HUD** (a small icon
   next to the gun/ammo readout at `GameEngine.js:2339-2347`,
   `GameEngine.js:2449`), or does it stay fully hidden until it saves
   you (truer to "held passively in the background" per Ken's spec, but
   less discoverable)?
6. **Name.** "Tombstone Perk" (Ken's pasted spec title) vs. "Tombstone
   Poop" (Ken's own shorthand, in the game's established poop-pun
   naming convention alongside Rod of Poopdom / Schleimy Potion) vs.
   something else for the in-game pickup label and Player's Guide entry
   once shipped.

None of these are guessable from the pasted spec or the existing code,
so per `docs/skib-sdlc.md` this stays design-only until Ken answers.

## What's explicitly not done

- No code changes — Mode A planning/spec pass only.
- No `_maybeSpawnTombstone()`, pickup-type branch, or death-flow
  special-casing written.
- No tuning numbers finalized (spawn rate, whether deaths/chaserSpeedMod
  still advance on a save).
- No Player's Guide or `interactive-content-pack.md` entry yet — per
  this repo's convention (see Rod of Poopdom, Broth Slip), those get
  written at ship time, not during design-only specs.
- No `GAME_ITERATION` bump, build, or deploy.

## Copy-paste: next coding agent (Mode B) — do not start until Ken answers the open questions above

```text
Read docs/skib-sdlc.md, then docs/update-directions.md, then
docs/handoffs/roadmap-handoff-v0.4.52-plan.md (this file) in full,
including Ken's answers to the six open questions.

Your slice (frontend/src/GameEngine.js unless noted):
1. Add ROD_OF_POOPDOM-style constants for the new pickup: spawn chance
   (default 0.02 unless Ken tuned it), pickup size.
2. Add `_maybeSpawnTombstone()` mirroring `_maybeSpawnRodOfPoopdom()`
   (~line 1512), pickup type `'tombstone'`, called from
   `_syncLevelState()` alongside the other `_maybeSpawn*` calls
   (~line 872).
3. Add a `pickup.type === 'tombstone'` branch in the pickup-collection
   switch (~line 1312) that sets `this.runner.hasTombstone = true` plus
   a runner line.
4. In `_triggerCaught()` (~line 1904), right after `this.deaths += 1`,
   branch on `this.runner.hasTombstone`:
   - true: skip the sheebs/skreems loss block, skip `this.levelIndex++`,
     set `this.runner.hasTombstone = false`, and flag
     `tombstoneSaved: true` in the `onDeath`/`onCaught` payloads.
   - false: existing behavior, unchanged.
   Apply Ken's answers on whether `deaths`/`chaserSpeedMod` still
   advance on a save.
5. Wire whatever UX Ken specified for the save moment (App.jsx message,
   HUD icon, or neither) — check Ken's answers to questions 4-5 before
   guessing.
6. Confirm `this.runner.hasTombstone` survives `_syncLevelState()`'s
   per-level reset (it should — that function resets pickups/timers,
   not `runner.*` slot fields — but verify nothing in that block or in
   `_updateCaught()`'s reset zeroes it out unintentionally).

Verification:
- cd frontend && npm run build
- Manually (or via Playwright/CDP per docs/dev-notes.md) pick up a
  Tombstone, get caught, and confirm: same level, loadout intact,
  currency per Ken's answer to Q1-3, single-use (dying again without a
  new Tombstone behaves normally).
- Add an e2e spec analogous to existing pickup specs (see
  frontend/e2e/soggy-tp-plunger-friendly-fire.spec.js for the pattern).

After the code lands: update docs/version-log.md, docs/roadmap.md,
docs/handoffs/ledger.md, docs/update-directions.md,
frontend/src/components/VersionModal.jsx, docs/players-guide.md, and
create roadmap-handoff-vX.Y.Z.md (drop the -plan suffix, matching
whatever GAME_ITERATION is live at that point — check
frontend/src/version.js first, other slices may ship before this one).
Do not bump GAME_ITERATION or deploy unless the user explicitly asks.
```
