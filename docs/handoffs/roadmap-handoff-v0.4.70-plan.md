# Roadmap Handoff Plan v0.4.70 — Level 5 Attack Slowdown + Level 4 Reward Pass

**Created by:** Claude Sonnet 5 — 2026-07-28
**Session mode:** Mode A (Planning / refinement only — docs only, no code,
no build, `GAME_ITERATION` not bumped)
**Status:** Design decision recorded, root cause found, scope bounded.
Needs Ken's call on the open questions below before a Mode B session
picks exact numbers — see "Open questions for Ken."
**Mode impact:** `Runner only` (see
[`role-reversal-design.md`](../role-reversal-design.md#12-documentation-contract-for-two-modes)
for the two-mode convention this repeats for). Chaser Beta has no
economy/pickup/difficulty-selector surface today, so nothing here
touches it.

## Trigger

Ken played a normal run (2026-07-28) on the **Noob-Noob** difficulty
setting and was captured on **World Star Parking Lot** (Level 5) — see
his screenshot: `crazy-jack-chaser` capture, 142s run time, +300 Sheebs.
Feedback, verbatim intent:

- Level 5 (World Star Parking Lot, as pictured) is **way too difficult**.
  The chaser pressure needs to slow down at that level.
- The **previous level** (Level 4, The Ramen Aisle) needs **more relics
  and rewards** — implying Ken wants Level 4 to feel like a build-up/
  gearing-up level before Level 5's gauntlet, not just a corridor to
  survive.
- Overall gameplay reads as **too aggressive** even though Ken had
  selected **Noob-Noob** difficulty — the easy setting isn't making the
  game feel easier.
- Ask: "reset the game attack at that level" — i.e., walk back Level 5's
  current tuning rather than just adding a band-aid on top of it.

## What "read docs/" and the code found

1. **The Noob-Noob difficulty selector does nothing to chase difficulty.
   This is the real root cause of "I was on easy mode and it still felt
   brutal."** `docs/difficulty-mechanics-plan.md` shipped the UI + cookie
   persistence in v0.4.60 (`profile.difficulty` stores `'noob'` /
   `'casual'` / `'4chan-st'`, see `frontend/src/lib/cookies.js:116` and
   the toggle in `App.jsx`), but the "Debt Lock" math that was supposed
   to actually change chaser speed/spawn odds per tier was explicitly
   left **TBD/design-only** and never wired. Worse, the one place
   `GameEngine.js` *does* read `this.difficulty`
   (`GameEngine.js:2607-2608`, the desktop fog-of-war radial mask from
   v0.4.58) checks for the string values `'easy'` and `'hardcore'` —
   values that were never the actual profile values even before v0.4.60
   renamed them to `'noob'`/`'casual'`/`'4chan-st'`. So today, **no
   matter which difficulty a player picks, the chase itself — chaser
   speed, spawn timing, pickup odds, everything in this plan below — is
   byte-for-byte identical.** Ken's Noob-Noob run got exactly the same
   Level 5 he'd get on 4chan-st.
2. **Level 5 (World Star Parking Lot, `levelIndex === 4`) stacks several
   independent difficulty levers that all land at once:**
   - `LEVEL5_PLUS_CHASER_SPEED_MULT = 1.15` (`GameEngine.js:338`) — a flat
     15% chaser speed bonus that only turns on at `levelIndex >= 4`,
     on top of:
   - the run-level `chaserSpeedMod` rubber-band, which by Level 5 has
     already climbed via `CHASER_SPEED_MOD_LEVEL_STEP` (+0.06) per level
     cleared, capped at `CHASER_SPEED_MOD_MAX = 1.35`
     (`chaserSpeedModMaxForLevel()`, `GameEngine.js:328`) — so the ceiling
     itself is highest exactly at the level that also gets the flat 1.15x.
   - `MAX_CHASERS = 5` (`GameEngine.js:299`) is fully available by Level
     5, and the Raman-Aunt-Toilet Lady extra-chaser type (hot ramen trail
     debuff, her own `speedMult`) becomes eligible to spawn starting
     `levelIndex >= 4` (`GameEngine.js:1559`) — i.e. exactly Level 5, not
     Level 6+.
   - Level 5's quest room (`questBadgeId: 'world-star-witness'`) is
     documented in the roadmap as intentionally "tightening into a
     one-door chokepoint" (vs. Level 4's two exits) — a mandatory
     single-entrance risk room while up to 5 sped-up chasers are already
     active, and clearing the level requires this badge
     (`_hasRequiredLevelBadge()`).
   - `advanceAt: 196` plus `MIN_LEVEL_SECONDS_BEFORE_ADVANCE = 30` plus
     `this.chasers.length >= 2` (`GameEngine.js:1499-1504`) together mean
     a long forced survival window at this stacked speed, not a quick
     clear.
   None of these levers is new or a bug by itself — each landed
   deliberately in its own past session (`v0.4.33`, `v0.4.34`, `v0.4.10`,
   `v0.4.49`) — but nobody has looked at them **together, at the one
   level where all of them are simultaneously active for the first time**
   since they shipped independently.
3. **Level 4 (The Ramen Aisle, `levelIndex === 3`) has exactly one
   dedicated reward: its quest badge (`questBadgeId: 'ramen-vault-keeper'`).**
   Unlike Levels 1-3, it has no `progressionBadgeId` — the "Retrofit
   Early Level Badges" pass (`v0.4.32`) explicitly stopped at Level 3.
   Every other pickup a player might find here (Jayden Gun, Schleimy
   Potion, Taco Bell Grande, Heavy Plunger, Decoy, Rod of Poopdom,
   Turdstone Token, the three Humor Badges) is a level-agnostic random
   roll, not something Level 4 specifically hands the player before
   Level 5's gauntlet. There's no mechanism today that gears a player up
   right before the hardest level yet built.
4. **`docs/difficulty-mechanics-plan.md`'s "Auto-tuning refinement"
   section already proposed the right shape of fix for both asks** —
   "bump positive-pickup odds" as the preferred lever over touching
   chaser speed/AI, keyed off a rolling deaths/sheebs ratio. That section
   is still fully TBD (no rolling-window size, no per-level caps chosen).
   This plan doesn't replace that longer-term auto-tuner; it proposes a
   smaller, immediately actionable slice: fix the selector wiring so
   *manual* difficulty choice does something today, and hand-tune Level
   4/5's static numbers directly, without waiting on the rolling-ratio
   design to land.

## Decision for this slice

Two separable problems, one slice, because they're causally linked (a
harder-than-intended Level 5 is exactly where a broken "make it easier"
switch hurts most):

### A. Fix the difficulty selector wiring (should ship first/together)

Replace the dead `'easy'`/`'hardcore'` string checks in `GameEngine.js`
with real handling of the actual profile values (`'noob'`, `'casual'`,
`'4chan-st'`), and give **Noob-Noob** an actual effect on chase pressure
— proposed default (not blocking, flag in shipped handoff either way):
a flat discount applied to `chaserSpeedMod`/`LEVEL5_PLUS_CHASER_SPEED_MULT`
and/or a lower effective `MAX_CHASERS` for `'noob'`, unchanged behavior
for `'casual'` (today's numbers, so nothing regresses for players who
never touched the selector), and `'4chan-st'` keeps or slightly exceeds
today's intensity. The existing fog-of-war mask
(`GameEngine.js:2607-2608`) should also get remapped onto the real
values instead of quietly always taking the same branch.

### B. Slow Level 5's (World Star Parking Lot) attack specifically

Proposed levers, smallest-diff-first, exact numbers TBD/Ken:

1. Lower `LEVEL5_PLUS_CHASER_SPEED_MULT` from `1.15` — proposed default
   `1.05`, i.e. shrink the flat Level-5-only bonus by two-thirds rather
   than removing it outright (Level 5 should still feel like a step up
   from Level 4, just not a wall).
2. Push Raman-Aunt-Toilet Lady's extra-chaser eligibility from
   `levelIndex >= 4` to `levelIndex >= 5` (`GameEngine.js:1559`) so she
   debuts on Level 6 (Jayden's Nightmare House) instead of stacking onto
   Level 5's first appearance of the 1.15x mult and the 5-chaser ceiling
   in the same level.
3. Consider a Level-5-specific `MAX_CHASERS` cap below `5` (e.g. `4`),
   since Pipeworks (Level 2) already owns "survive 5 simultaneous
   chasers" as its own signature clear-condition spectacle
   (`docs/version-log.md` v0.4.10) — Level 5 re-hitting that same peak
   isn't adding new difficulty texture, just repeating Pipeworks' peak
   at a higher chaser speed.
4. Reconsider whether `world-star-witness` should keep gating level
   clear at all, given the one-door chokepoint room is inherently riskier
   than Level 4's two-exit version — proposed default: keep the badge as
   a **level-clear requirement still**, but widen the door / soften the
   chokepoint geometry rather than turning it into an optional badge
   (preserves the existing "quest rooms gate the level" pattern
   uniformly; a whole-room redesign is bigger than this slice should be).

### C. Add relics/rewards to Level 4 (The Ramen Aisle)

Give Level 4 a genuine gearing-up moment before Level 5, reusing
existing systems rather than inventing new ones:

1. Bump positive-pickup spawn odds specifically when `levelIndex === 3`
   (Ramen Aisle) — same lever `difficulty-mechanics-plan.md`'s
   auto-tuning section already recommends, just level-scoped instead of
   debt-ratio-scoped, and immediately codeable without the rolling-ratio
   design.
2. Add one additional guaranteed pickup/relic to Ramen Aisle specifically
   — proposed default: reuse the `progressionBadgeId` pattern from
   Levels 1-3 (auto-spawned map pickup at level start, one-time per
   profile) rather than a new mechanic; needs a name/flavor pick (open
   question below).
3. Optional, smaller: a second small reward nook in the Ramen Aisle map
   itself (per the roadmap's parked "landmark pass" idea — one reward
   room per level), only if it fits the same session without redesigning
   the map wholesale.

## Open questions for Ken (has proposed defaults — not blocking Mode A, blocks exact Mode B numbers)

1. Confirm (or override) the proposed `1.15 → 1.05` chaser-speed-mult
   number for Level 5 — is that too small a change, about right, or
   should it go lower?
2. Should the Level-5-specific `MAX_CHASERS` cap (proposed `4`) apply
   regardless of difficulty tier, or should it be another dial the fixed
   difficulty selector controls (e.g. Noob-Noob caps at 4, 4chan-st keeps
   5)?
3. Confirm Raman-Aunt's move from Level 5 to Level 6 eligibility is
   acceptable, or if she should stay on Level 5 but with a toned-down
   `speedMult`/`spawnChance` instead of being delayed a full level.
4. World-star-witness quest room: widen the chokepoint door (proposed
   default), or is Ken open to making the badge optional/non-gating
   instead?
5. What should Level 4's new guaranteed relic actually be — a new named
   badge (needs a name + `BADGES` entry + toast/flavor line), or an
   existing pickup type guaranteed instead of rolled (e.g. always spawn a
   Jayden Gun on Ramen Aisle)? Recommend a new named badge to match the
   Levels 1-3 pattern, but the actual name/flavor is Ken's call.
6. Should the difficulty-selector fix (Part A) ship in the *same* Mode B
   session as the Level 5/Level 4 number changes, or should Part A land
   first as its own smaller slice so the Level 5 numbers can be tuned
   against a difficulty tier that actually does something? Recommend
   same session, since they're the same root cause, but flagging in case
   Ken wants Part A isolated for its own verification pass.

## Explicitly not done in this pass

- No code changes yet.
- No `GAME_ITERATION` bump.
- No deploy.
- No rolling deaths/sheebs auto-tuner (`difficulty-mechanics-plan.md`'s
  "Auto-tuning refinement" section) — that stays its own future slice;
  this plan only hand-tunes Level 4/5's static numbers and fixes the
  selector wiring.
- No Level 4 map redesign beyond (optionally) one small reward nook —
  no new anchor room, no new risky-shortcut room.
- No changes to Levels 1-3, Level 6, or any level-agnostic pickup system
  beyond the Level-4-scoped spawn-odds bump.
- No resolution of the six open questions above — those are Ken's calls,
  proposed defaults only.

## Files likely touched (next Mode B session)

- `frontend/src/GameEngine.js` — `LEVEL5_PLUS_CHASER_SPEED_MULT`,
  `RAMAN_AUNT` spawn-eligibility gate (`levelIndex >= 4` →
  `>= 5`), a Level-5-specific `MAX_CHASERS` cap (or reuse the existing
  constant with a per-level override), the `this.difficulty` branch at
  `GameEngine.js:2607-2608` (remap to `'noob'`/`'casual'`/`'4chan-st'`),
  a new difficulty-aware discount applied to `chaserSpeedMod`/the Level 5
  mult, Ramen Aisle's positive-pickup-odds bump, and (if Ken picks a new
  badge) a `progressionBadgeId`-style spawn for Ramen Aisle.
- `frontend/src/gameContent.js` — a new `BADGES` entry if Ken picks a
  named relic for Level 4 (open question 5).
- `frontend/src/dialog.js` — toast/flavor line for the new Level 4 badge,
  if applicable.
- `docs/difficulty-mechanics-plan.md` — mark the selector-wiring fix as
  landing here (currently says Debt Lock math is TBD; note that the
  *wiring bug* specifically is being fixed by this slice even though the
  full Debt Lock/auto-tuner design stays TBD).
- `docs/roadmap.md` — already updated this Mode A pass (see below);
  Mode B only notes what shipped.
- `frontend/e2e/` — a focused test asserting: (a) a `'noob'` profile
  produces measurably lower chaser speed than `'casual'`/`'4chan-st'` in
  the same level (catches any future regression of the wiring fix), and
  (b) Ramen Aisle's guaranteed relic actually spawns once per profile.

## Copy-paste: next coding session

```text
Read docs/skib-sdlc.md, then docs/difficulty-mechanics-plan.md, then this
file (docs/handoffs/roadmap-handoff-v0.4.70-plan.md), then inspect
LEVEL5_PLUS_CHASER_SPEED_MULT, chaserSpeedModMaxForLevel(), MAX_CHASERS,
RAMAN_AUNT spawn gating, the this.difficulty checks (~GameEngine.js:2607),
and the Ramen Aisle / World Star Parking Lot level defs + quest rooms in
frontend/src/GameEngine.js.

IMPORTANT: this handoff has six open questions for Ken (numbers, badge
name/flavor, whether the difficulty fix ships standalone). Confirm Ken's
answers are recorded (in this file or a newer -plan revision) before
treating any of them as settled — do not invent answers yourself even if
the proposed defaults look reasonable.

Once Ken's answers are in hand, implement (Runner only, no Chaser Beta
changes):

1. Fix the difficulty selector wiring: replace the dead 'easy'/'hardcore'
   checks (GameEngine.js:2607-2608) with real 'noob'/'casual'/'4chan-st'
   handling, and apply Ken's chosen discount/cap for 'noob' to
   chaserSpeedMod and/or MAX_CHASERS. 'casual' should reproduce today's
   existing numbers exactly (no regression for players who never touched
   the selector).
2. Lower LEVEL5_PLUS_CHASER_SPEED_MULT per Ken's confirmed number
   (proposed default 1.05, was 1.15).
3. Move Raman-Aunt's extra-chaser spawn eligibility per Ken's answer
   (proposed default: levelIndex >= 4 -> >= 5, GameEngine.js:1559) or
   tone down her speedMult/spawnChance if Ken chose that instead.
4. Apply Ken's chosen Level-5 MAX_CHASERS cap (proposed default 4) if
   confirmed, and/or widen the world-star-witness chokepoint room per
   Ken's answer to open question 4.
5. Bump positive-pickup spawn odds specifically for levelIndex === 3
   (Ramen Aisle), and add the guaranteed Level 4 relic/badge Ken picked
   (open question 5) using the existing progressionBadgeId pattern.
6. Verify with cd frontend && npm run build and npx playwright test,
   including a new e2e test asserting the 'noob' vs 'casual'/'4chan-st'
   speed difference is real, and that the new Ramen Aisle relic spawns.
7. Update docs/version-log.md, docs/handoffs/ledger.md,
   docs/update-directions.md, docs/roadmap.md,
   docs/difficulty-mechanics-plan.md, and this handoff's shipped twin
   (roadmap-handoff-v0.4.70.md) per docs/skib-sdlc.md step 4. Bump
   GAME_ITERATION and deploy only once verified.

Do not touch Levels 1-3, Level 6, Chaser Beta, or build the rolling
deaths/sheebs auto-tuner from difficulty-mechanics-plan.md — that stays
its own future slice.
```
