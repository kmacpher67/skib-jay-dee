# Roadmap Handoff v0.4.52-plan — Turdstone Token (Resurrection Ward)

**Created by:** Claude Sonnet 5 — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-27 (sprite asset landed:
`frontend/src/assets/turdstone-toilet-token-perk.png`, crop/scale plan
added)
**Session mode:** Mode A (Planning — docs only, no code changes)
**Status:** SPECCED — naming and art resolved, remaining tuning
decisions for Ken, not code-ready yet

**Art note:** Ken dropped the sprite art at
`frontend/src/assets/turdstone-toilet-token-perk.png` (the "The Holy
Crap" concept from the naming notebook). This is the first pickup in
the engine to use a raster image instead of an emoji-in-box (see
`_pickupStyle`/`_drawPickups`, `GameEngine.js:2331-2353` — every other
pickup today draws a colored box + emoji glyph, nothing calls
`ctx.drawImage` for a pickup icon). The source PNG is a full-size
graphic, not pre-cropped to a small square icon, so it needs a
center-crop + downscale at render time to sit cleanly in the ~28-32px
pickup footprint on the map — see "Sprite rendering" below.

**Naming note:** originally drafted under the working title "Tombstone
Perk." Ken picked a name during a follow-up naming pass: **The Turdstone
Token** (in-chat shorthand: "TurdPOOP Perk") for the pickup, and **"The
Holy Crap"** for the pickup's sprite concept — a classic CoD-style gray
gravestone, redrawn as a toilet. This doc has been updated throughout to
use Turdstone Token as the primary name; question 6 in "Open questions
for Ken" below is now resolved. The creative brainstorm (name options
considered, sprite concept) is memorialized in
[docs/perk-naming-notebook.md](../perk-naming-notebook.md). As of this
naming pass, the coding queue is currently on `v0.4.49` (Broth Slip) —
this plan (`v0.4.52`) stays queued behind it, see
`docs/roadmap.md`'s coding queue order.

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
design, and Turdstone Token has to be specced against what's actually there,
not assumed CoD behavior:

1. **Death does not currently return to a game-over/hub screen.**
   `_triggerCaught()` (`GameEngine.js:1904`) runs a jump-scare
   ("caught") phase, then `_updateCaught()` (`GameEngine.js:1978`)
   auto-resumes the same session. There is no "hub return" state to
   bypass — Ken's spec item 2's "bypasses the game-over screen" is
   already true today for every death, Turdstone Token or not.
2. **Death already advances `levelIndex` by one** (`GameEngine.js:1948`,
   `this.levelIndex++`, inside `_triggerCaught`). Combined with
   `_updateCaught` respawning at `this.level.runnerSpawn` (which reads
   the *new*, incremented level), every death today silently pushes the
   player one level forward, not back to the level they died on. This
   is the one piece of Ken's spec that's actually a real behavior
   change to build — "Current Level Respawn" means Turdstone Token must
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
   `GameEngine.js:1306-1317`). Turdstone Token needs its own boolean flag
   (e.g. `runner.hasTurdstoneToken`) that is independent of the
   gun/plunger/rod slot so a player can carry a weapon *and* a
   Turdstone Token at the same time, and that must **survive**
   `_syncLevelState()`'s per-level reset (`GameEngine.js:815-878`) when
   advancing levels normally — it should only ever be cleared by (a)
   consumption on a saved death, or (b) an unsaved death, if Ken decides
   it shouldn't carry across a death that already killed the run.

## Proposed design (no code written this session)

- **New pickup type `'turdstone-token'`**, spawned via a `_maybeSpawnTurdstoneToken()`
  following the exact `_maybeSpawnRodOfPoopdom()` pattern
  (`GameEngine.js:1512-1524`), called from `_syncLevelState()` alongside
  the other `_maybeSpawn*` calls (`GameEngine.js:872`). Rarer than Rod
  of Poopdom's 5% (`ROD_OF_POOPDOM_SPAWN_CHANCE = 0.05`,
  `GameEngine.js:372`) — recommend **2%** to read as a genuine
  Rare/Epic lifeline per Ken's spec, but this is a tuning number for
  Ken to confirm, not a hard recommendation.
- **Pickup handling:** add a `pickup.type === 'turdstone-token'` branch next
  to the others in the collection switch (`GameEngine.js:1312-1318`)
  that sets `this.runner.hasTurdstoneToken = true` and shows a runner line
  ("Turdstone Token secured." or similar — final copy TBD).
- **Death-time branch in `_triggerCaught()`:** immediately after
  `this.deaths += 1` (`GameEngine.js:1917`), if
  `this.runner.hasTurdstoneToken` is true:
  - Skip the `skreemsLost`/`sheebsLost` block entirely
    (`GameEngine.js:1921-1936`) — no currency penalty this death.
  - Skip `this.levelIndex++` (`GameEngine.js:1948`) — stay on the level
    the player died on.
  - Set `this.runner.hasTurdstoneToken = false` (single-use consumption).
  - Still show the jump-scare/caught visual beat (per Ken's CoD
    reference — Turdstone Token in CoD still "downs" you visually before the
    save), but the `onCaught`/`onDeath` payloads should probably flag
    `turdstoneSaved: true` so `App.jsx` can show a distinct "Saved by
    Turdstone Token!" message instead of (or alongside) the normal capture
    line — exact UX is an open question below.
  - `_updateCaught()`'s respawn-position reset
    (`GameEngine.js:1993-1996`, `this.level.runnerSpawn`) needs no
    change — since `levelIndex` wasn't bumped, `this.level` is already
    the same level the player died on, so "current level respawn"
    falls out for free once the increment is skipped.

### Sprite rendering: `turdstone-toilet-token-perk.png`

- **Import + load, same pattern as chaser faces**, not a new dependency:
  `import turdstoneTokenSprite from './assets/turdstone-toilet-token-perk.png'`
  in `frontend/src/gameContent.js` (alongside the existing face imports,
  `gameContent.js:1-15`), then load it once into a module-level
  `Image()` the same way extra-chaser faces are loaded
  (`GameEngine.js:1319-1320`, `const img = new Image(); img.src = ...`)
  — load once at engine construction, not per-spawn, so it's already
  decoded by the time a Turdstone Token pickup spawns.
- **Crop + scale at draw time, not pre-processed.** The source PNG is a
  full graphic (not a pre-cropped square icon), so add a
  `pickup.type === 'turdstone-token'` branch in `_drawPickups()`
  (`GameEngine.js:2331-2353`, next to the existing `pickup.sprite` /
  `_pickupStyle` branches) that uses the 9-argument
  `ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)` form: compute a
  centered square source crop (`sw = sh = Math.min(img.width,
  img.height)`, `sx/sy` centering that square in the source image —
  same center-crop math as `FaceUpload.jsx`'s offscreen-canvas crop,
  just done live against the destination pickup box instead of
  pre-baked into a new file) and destination `dx, dy = pickup.x,
  pickup.y`, `dw, dh = pickup.w, pickup.h` (the pickup's existing
  `ROD_OF_POOPDOM_PICKUP_SIZE`-style constant, e.g. 28-32px). This
  avoids stretching/distorting a non-square source image and needs no
  new image-processing step — plain canvas API, matching how every
  other image in this engine (faces) is already handled.
- **Fallback:** if the image hasn't finished loading yet
  (`img.complete` false / `naturalWidth === 0`) when a pickup is first
  drawn, fall back to the existing emoji-in-box style for that frame
  rather than drawing a broken image — same defensive pattern already
  worth copying from how `entity.face` is drawn elsewhere
  (`GameEngine.js:2415`, `ctx.drawImage(entity.face, ...)` assumes the
  image is ready because faces are preloaded well before first draw;
  do the same here by loading the sprite at construction, not on first
  spawn).

## Open questions for Ken (blocking Mode B)

1. **Spawn rarity.** Is 2% a reasonable target, or does Ken want it
   tuned differently (e.g. tied to level index, or guaranteed at least
   once per N levels so it doesn't feel purely RNG-gated on hard
   levels)?
2. **Does the death counter (`this.deaths`) still increment on a
   Turdstone-saved death?** It currently drives the `deaths >= 50`
   "glutton-for-punishment" badge and lifetime death stats. Recommend
   yes (it still reads as a "death" for stats/flavor, just a survived
   one) but Ken should confirm since it affects badge pacing.
3. **Does `chaserSpeedMod` still ramp up** (`GameEngine.js:1949-1953`,
   `CHASER_SPEED_MOD_DEATH_STEP`) **on a Turdstone Token save?** If yes, a
   saved death still makes the game harder going forward, matching a
   normal death; if no, Turdstone Token is a "free do-over" with zero
   difficulty cost. No stated intent either way in Ken's spec —
   defaulting to "yes, still ramps" (smaller diff, avoids Turdstone Token
   becoming a difficulty-reset exploit) unless Ken says otherwise.
4. **UX for the save moment.** Distinct message/animation ("Saved by
   Turdstone Token!") vs. just letting the existing jump-scare play out
   silently with the level-not-advancing being the only tell? Ken's CoD
   comparison suggests players expect to *notice* the save.
5. **Does holding a Turdstone Token show anywhere in the HUD** (a small icon
   next to the gun/ammo readout at `GameEngine.js:2339-2347`,
   `GameEngine.js:2449`), or does it stay fully hidden until it saves
   you (truer to "held passively in the background" per Ken's spec, but
   less discoverable)?
6. ~~**Name.**~~ **RESOLVED 2026-07-27.** Ken confirmed **The Turdstone
   Token** as the pickup name (in-chat shorthand: "TurdPOOP Perk"),
   with **"The Holy Crap"** as the sprite concept — a classic CoD-style
   gray gravestone sprite, redrawn as a toilet. Fits the existing
   poop-pun naming convention (Rod of Poopdom, Schleimy Potion, Broth
   Slip). See [docs/perk-naming-notebook.md](../perk-naming-notebook.md)
   for the full naming brainstorm. Use "Turdstone Token" as the pickup
   label and `'turdstone-token'` as the internal pickup-type id.

Questions 1-5 are not guessable from the pasted spec or the existing
code, so per `docs/skib-sdlc.md` this stays design-only until Ken
answers those.

## What's explicitly not done

- No code changes — Mode A planning/spec pass only.
- No `_maybeSpawnTurdstoneToken()`, pickup-type branch, sprite
  crop/scale rendering, or death-flow special-casing written.
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
including Ken's answers to open questions 1-5 (question 6, naming, is
already resolved: "Turdstone Token" / `'turdstone-token'`).

The sprite asset is already in the repo:
frontend/src/assets/turdstone-toilet-token-perk.png. It's a full-size
graphic, not pre-cropped to a small icon — see "Sprite rendering" above
for the exact center-crop + `ctx.drawImage` 9-arg approach to use so it
scales cleanly onto the map at pickup size instead of stretching.

Your slice (frontend/src/GameEngine.js and frontend/src/gameContent.js
unless noted):
1. Add ROD_OF_POOPDOM-style constants for the new pickup: spawn chance
   (default 0.02 unless Ken tuned it), pickup size.
2. Import `turdstone-toilet-token-perk.png` in gameContent.js (next to
   the existing face imports) and load it into a module-level `Image()`
   at engine construction, same pattern as `GameEngine.js:1319-1320`.
3. Add `_maybeSpawnTurdstoneToken()` mirroring `_maybeSpawnRodOfPoopdom()`
   (~line 1512), pickup type `'turdstone-token'`, called from
   `_syncLevelState()` alongside the other `_maybeSpawn*` calls
   (~line 872).
4. Add a `pickup.type === 'turdstone-token'` branch in `_drawPickups()`
   (~line 2331) that center-crops and scales the loaded sprite into the
   pickup's box via the 9-arg `ctx.drawImage` form (see "Sprite
   rendering" above), with an emoji-in-box fallback if the image isn't
   loaded yet.
5. Add a `pickup.type === 'turdstone-token'` branch in the
   pickup-collection switch (~line 1312) that sets
   `this.runner.hasTurdstoneToken = true` plus a runner line.
6. In `_triggerCaught()` (~line 1904), right after `this.deaths += 1`,
   branch on `this.runner.hasTurdstoneToken`:
   - true: skip the sheebs/skreems loss block, skip `this.levelIndex++`,
     set `this.runner.hasTurdstoneToken = false`, and flag
     `turdstoneSaved: true` in the `onDeath`/`onCaught` payloads.
   - false: existing behavior, unchanged.
   Apply Ken's answers on whether `deaths`/`chaserSpeedMod` still
   advance on a save.
7. Wire whatever UX Ken specified for the save moment (App.jsx message,
   HUD icon, or neither) — check Ken's answers to questions 4-5 before
   guessing.
8. Confirm `this.runner.hasTurdstoneToken` survives `_syncLevelState()`'s
   per-level reset (it should — that function resets pickups/timers,
   not `runner.*` slot fields — but verify nothing in that block or in
   `_updateCaught()`'s reset zeroes it out unintentionally).

Verification:
- cd frontend && npm run build
- Manually (or via Playwright/CDP per docs/dev-notes.md) pick up a
  Turdstone Token, confirm the sprite renders cropped/scaled cleanly at
  pickup size on the map (not stretched or overflowing its box), then
  get caught and confirm: same level, loadout intact, currency per
  Ken's answer to Q1-3, single-use (dying again without a new Turdstone
  Token behaves normally).
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
