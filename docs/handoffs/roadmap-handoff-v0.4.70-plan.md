# Roadmap Handoff Plan v0.4.70 — Level 5 Attack Slowdown + Level 4 Reward Pass

**Created by:** Claude Sonnet 5 — 2026-07-28
**Last updated by:** Claude Sonnet 5 — 2026-07-28 (Ken's answers recorded)
**Session mode:** Mode A (Planning / refinement only — docs only, no code,
no build, `GAME_ITERATION` not bumped)
**Status:** Ken answered all open questions live this session (recorded
below, decisions section updated to match) — **fully code-ready**. Ken
confirmed the Level 4 squeeze item is the **Schleimy Potion**, not the
Gawd Particle (matches this handoff's recommendation).
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
4. **Level 5+ chasers don't just move faster — they ignore walls
   entirely, with no downside for phasing through one.** `wallHackLevel =
   this.levelIndex >= LEVEL5_PLUS_START_INDEX` (`GameEngine.js:1358`)
   gates `_moveIgnoringWalls(chaser, ...)` instead of
   `_moveWithCollision(chaser, ...)` (`GameEngine.js:1427-1431`) for every
   non-human chaser from Level 5 onward, and the same `wallHackLevel`
   flag also gates the `LEVEL5_PLUS_CHASER_SPEED_MULT` bonus
   (`GameEngine.js:1383`) — so the exact same flag both lets chasers cut
   through walls *and* makes them faster, stacked together, with zero
   speed cost for actually being inside/crossing a wall. This is a
   distinct lever from the flat speed-mult finding above and is very
   likely the single biggest contributor to Level 5 "feeling like an
   attack" — the runner must respect every wall, chasers from Level 5 on
   do not, at a speed bonus on top. Ken confirmed this needs a real
   downside: chasers phasing through a wall should be slowed to roughly
   **70% of their normal speed** while doing so (see Decision B.5 below).
5. **The runner's actual wall-hack item (Gawd Particle) has no speed
   penalty in the code — the item with a speed penalty for squeezing
   through tight spots is the separate Schleimy Potion.** Per code:
   `gawdParticleActive` only gates `_moveIgnoringWalls(this.runner, ...)`
   (`GameEngine.js:1339-1343`) and a chaser-despawn-on-touch effect — no
   multiplier is applied to runner speed while it's active. The item that
   *does* cost speed to squeeze through gaps is `schleimyPotionActive`
   (`speed *= 0.8`, `GameEngine.js:1298`, matches the original design:
   "shrinks the runner's hitbox... movement speed drops ~20%").
   Additionally, Gawd Particle only spawns `levelIndex >= 4` (Level 5+,
   `GameEngine.js:1836-1838`) — it cannot appear on Level 4 (The Ramen
   Aisle) at all today. Ken's Level 4 relic note described a tight-squeeze
   spot needing "the gawd particle" that's a disadvantage rather than a
   boost "particularly at lvl5" — that description (speed penalty, tight
   squeeze, usable pre-Level-5) matches the Schleimy Potion, not the Gawd
   Particle as currently coded. Flagged as a clarification needed before
   Mode B, not assumed either way — see below.
6. **`docs/difficulty-mechanics-plan.md`'s "Auto-tuning refinement"
   section already proposed the right shape of fix for both asks** —
   "bump positive-pickup odds" as the preferred lever over touching
   chaser speed/AI, keyed off a rolling deaths/sheebs ratio. That section
   is still fully TBD (no rolling-window size, no per-level caps chosen).
   This plan doesn't replace that longer-term auto-tuner; it proposes a
   smaller, immediately actionable slice: fix the selector wiring so
   *manual* difficulty choice does something today, and hand-tune Level
   4/5's static numbers directly, without waiting on the rolling-ratio
   design to land.

## Decision for this slice (Ken's answers recorded 2026-07-28)

Three separable problems, one slice, because they're causally linked (a
harder-than-intended Level 5 is exactly where a broken "make it easier"
switch hurts most):

### A. Fix the difficulty selector wiring (ships in this slice)

Replace the dead `'easy'`/`'hardcore'` string checks in `GameEngine.js`
with real handling of the actual profile values (`'noob'`, `'casual'`,
`'4chan-st'`). **Ken confirmed:** the Level 5 changes in Part B are a new
**baseline for everyone**, not something gated behind the selector — so
`'casual'`/`'4chan-st'` get the same slowed-down Level 5 as `'noob'`.
Once the wiring is fixed, `'noob'` additionally applies a further
discount on top of that new baseline (exact extra discount still TBD —
reuse the existing `chaserSpeedMod`/`LEVEL5_PLUS_CHASER_SPEED_MULT`
levers rather than a new mechanic). The existing fog-of-war mask
(`GameEngine.js:2607-2608`) should also get remapped onto the real
values instead of quietly always taking the same branch.

### B. Slow Level 5's (World Star Parking Lot) attack specifically

1. **Confirmed:** lower `LEVEL5_PLUS_CHASER_SPEED_MULT` from `1.15` to
   **`1.05`**, as the new baseline for all players.
2. **Confirmed:** push Raman-Aunt-Toilet Lady's extra-chaser eligibility
   from `levelIndex >= 4` to `levelIndex >= 5` (`GameEngine.js:1559`) so
   she debuts on Level 6 (Jayden's Nightmare House) instead of stacking
   onto Level 5's first appearance of the speed mult and the 5-chaser
   ceiling in the same level.
3. **Confirmed: leave `MAX_CHASERS` at 5 for Level 5** — only the
   Raman-Aunt delay above changes chaser *composition/count* pressure;
   no separate Level-5-specific cap.
4. Not directly asked this round, keeping the prior proposed default:
   `world-star-witness`'s one-door chokepoint stays a level-clear
   requirement, but widen the door / soften the chokepoint geometry
   rather than making the badge optional (flag again for Ken's final
   sign-off in the shipped handoff, since it wasn't part of this round's
   direct answers).
5. **New item from Ken's answer, not in the original draft:** Level 5+
   chasers using `_moveIgnoringWalls` (see finding 4 above) should be
   slowed to **~70% of their normal effective speed** for as long as they
   are actually overlapping/crossing a wall rect, so wall-phasing stops
   being a free advantage stacked on top of the speed bonus. This applies
   generally to any wall-hacking chaser movement, not just Level 5 — but
   Level 5 is the level where it first turns on (`wallHackLevel`), so
   this is scoped here rather than as a separate backlog item.

### C. Add relics/rewards to Level 4 (The Ramen Aisle)

**Confirmed:** bump general positive-pickup spawn odds specifically when
`levelIndex === 3` (Ramen Aisle) — no new named badge this round. In
addition, Ken wants the existing **Turdstone Token** (resurrection ward,
`v0.4.52`) **hidden or relocated to a difficult spot** on the Ramen Aisle
map — specifically, behind (or requiring passage through) a tight-squeeze
gap that needs a hitbox-shrink item to reach. **Needs one clarification
before Mode B can pick the exact item** (see below) — likely the
Schleimy Potion, not the Gawd Particle, based on the code (finding 5
above). No map redesign beyond this one relocated pickup + whatever gap
geometry the tight squeeze needs; no second full reward room this round.

## Clarification resolved: Level 4 squeeze item is the Schleimy Potion

Ken's Level 4 answer said the tight-squeeze spot "will need the gawd
particle, which apparently slows down the player also instead of being
great it's a disadvantage particularly at lvl5." Per the code (finding 5
above), the Gawd Particle has no speed penalty and can't spawn on Level 4
at all (Level 5+ only) — the item with the hitbox-shrink + speed-cost
tradeoff is the **Schleimy Potion**, already level-agnostic. **Ken
confirmed option (a): Schleimy Potion.** No spawn-gating change needed —
just make sure it can appear before the relocated Turdstone Token's
squeeze point on Ramen Aisle.

## Remaining open item (flag in shipped handoff, not blocking)

1. World-star-witness quest room: widen the chokepoint door (proposed
   default, Decision B.4), or is Ken open to making the badge
   optional/non-gating instead?
2. Exact size of the additional `'noob'`-tier discount on top of the new
   Level 5 baseline (Decision A) — a further `chaserSpeedMod` shave, a
   `LEVEL5_PLUS_CHASER_SPEED_MULT` override, or something else?
3. Should the difficulty-selector wiring fix (Part A) ship in the *same*
   Mode B session as the Level 5/Level 4 changes, or land first as its
   own smaller slice? Recommend same session (same root cause), flagging
   in case Ken wants it isolated for its own verification pass.

## Explicitly not done in this pass

- No code changes yet.
- No `GAME_ITERATION` bump.
- No deploy.
- No rolling deaths/sheebs auto-tuner (`difficulty-mechanics-plan.md`'s
  "Auto-tuning refinement" section) — that stays its own future slice;
  this plan only hand-tunes Level 4/5's static numbers and fixes the
  selector wiring.
- No Level 4 map redesign beyond relocating the Turdstone Token behind
  one tight-squeeze gap — no new anchor room, no new risky-shortcut room,
  no second full reward room this round.
- No new named badge for Level 4 this round (Ken chose the pickup-odds +
  relocated-Turdstone route instead).
- No changes to Levels 1-3, Level 6, or any level-agnostic pickup system
  beyond the Level-4-scoped spawn-odds bump.
- No Level-5-specific `MAX_CHASERS` cap (Ken confirmed leave at 5).
- No resolution of the "still-open questions" list above, and no coding
  of Part C's squeeze-item until the Gawd Particle vs. Schleimy Potion
  clarification above is answered.

## Files likely touched (next Mode B session)

- `frontend/src/GameEngine.js`:
  - `LEVEL5_PLUS_CHASER_SPEED_MULT` `1.15 → 1.05`.
  - `RAMAN_AUNT` spawn-eligibility gate `levelIndex >= 4` → `>= 5`
    (`GameEngine.js:1559`).
  - A ~0.7x speed multiplier applied to any chaser while
    `wallHackLevel` is true and it is actually overlapping a wall rect
    (new logic near `_moveIgnoringWalls`/the chaser speed calc at
    `GameEngine.js:1358-1431`) — needs a wall-overlap check at the
    chaser's *current* rect before/after the ignoring-walls move, not
    just a flag.
  - The `this.difficulty` branch at `GameEngine.js:2607-2608` (remap to
    `'noob'`/`'casual'`/`'4chan-st'`, add the extra `'noob'` discount on
    top of the new Level 5 baseline).
  - Ramen Aisle's positive-pickup-odds bump (`levelIndex === 3`).
  - Relocate/hide the Turdstone Token spawn specifically for Ramen Aisle
    behind a tight-squeeze gap (needs the map-grid squeeze point defined
    in `buildRamenAisle()`/`mapGrids.js`, and the resolved squeeze-item
    from the clarification above).
- `docs/difficulty-mechanics-plan.md` — mark the selector-wiring fix as
  landing here (currently says Debt Lock math is TBD; note that the
  *wiring bug* specifically is being fixed by this slice even though the
  full Debt Lock/auto-tuner design stays TBD).
- `docs/roadmap.md` — already updated this Mode A pass (see below);
  Mode B only notes what shipped.
- `frontend/e2e/` — focused tests asserting: (a) a `'noob'` profile
  produces measurably lower Level 5 chaser speed than `'casual'`/
  `'4chan-st'` (catches any future regression of the wiring fix), (b) a
  Level 5+ chaser overlapping a wall moves measurably slower than one in
  open space, and (c) the relocated Turdstone Token actually spawns at
  its new Ramen Aisle location.

## Copy-paste: next coding session

```text
Read docs/skib-sdlc.md, then docs/difficulty-mechanics-plan.md, then this
file (docs/handoffs/roadmap-handoff-v0.4.70-plan.md — Ken's answers are
recorded in "Decision for this slice"), then inspect
LEVEL5_PLUS_CHASER_SPEED_MULT, chaserSpeedModMaxForLevel(), wallHackLevel/
_moveIgnoringWalls (~GameEngine.js:1358-1431), RAMAN_AUNT spawn gating,
gawdParticleActive vs schleimyPotionActive (~GameEngine.js:1298,
1339-1343, 1836-1838), the this.difficulty checks (~GameEngine.js:2607),
and the Ramen Aisle / World Star Parking Lot level defs + quest rooms in
frontend/src/GameEngine.js.

All open questions are resolved (see "Decision for this slice" and
"Clarification resolved" in this file) — this handoff is fully
code-ready. Implement (Runner only, no Chaser Beta changes):

1. Fix the difficulty selector wiring: replace the dead 'easy'/'hardcore'
   checks (GameEngine.js:2607-2608) with real 'noob'/'casual'/'4chan-st'
   handling. The Level 5 changes below (steps 2-4) are the new baseline
   for ALL tiers, not gated behind the selector. 'noob' additionally
   applies a further discount on top of that new baseline (pick a small,
   reversible value — e.g. another -0.05 off LEVEL5_PLUS_CHASER_SPEED_MULT
   or a chaserSpeedMod shave — and flag the exact number chosen in the
   shipped handoff since it wasn't pinned to a specific value this round).
2. Lower LEVEL5_PLUS_CHASER_SPEED_MULT from 1.15 to 1.05 (confirmed).
3. Move Raman-Aunt's extra-chaser spawn eligibility from levelIndex >= 4
   to >= 5 (confirmed, GameEngine.js:1559) so she debuts on Level 6
   instead of Level 5. Leave MAX_CHASERS at 5 (confirmed, no Level-5-
   specific cap).
4. Add a ~0.7x speed multiplier for any chaser while wallHackLevel is
   true (Level 5+) AND it is currently overlapping/crossing a wall rect
   during its _moveIgnoringWalls step (confirmed) — this is on top of,
   not instead of, the LEVEL5_PLUS_CHASER_SPEED_MULT change in step 2.
5. Bump positive-pickup spawn odds specifically for levelIndex === 3
   (Ramen Aisle) (confirmed). Relocate/hide the Turdstone Token spawn on
   Ramen Aisle behind a tight-squeeze gap that needs the Schleimy Potion
   (confirmed) to reach — make sure the potion can spawn/be findable
   before that squeeze point on the same level.
6. Verify with cd frontend && npm run build and npx playwright test,
   including new e2e tests: 'noob' vs 'casual'/'4chan-st' Level 5 speed
   difference is real, a wall-overlapping Level 5+ chaser is measurably
   slower than one in open space, and the relocated Turdstone Token
   spawns at its new location.
7. Update docs/version-log.md, docs/handoffs/ledger.md,
   docs/update-directions.md, docs/roadmap.md,
   docs/difficulty-mechanics-plan.md, and this handoff's shipped twin
   (roadmap-handoff-v0.4.70.md) per docs/skib-sdlc.md step 4. Bump
   GAME_ITERATION and deploy only once verified.

Do not touch Levels 1-3, Level 6, Chaser Beta, or build the rolling
deaths/sheebs auto-tuner from difficulty-mechanics-plan.md — that stays
its own future slice.
```
