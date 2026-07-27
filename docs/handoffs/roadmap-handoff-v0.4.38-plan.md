# Roadmap Handoff - v0.4.38-plan

> **SHIPPED as v0.4.38 (2026-07-27).** See
> `docs/handoffs/roadmap-handoff-v0.4.38.md`. Do not code from this file —
> use `roadmap-handoff-v0.4.39-plan.md` for the next slice.

**Session mode:** Mode A (Planning - docs only, no code changes)

This handoff scopes **Level 6: "Jayden's Nightmare House"** and its new
chaser, **Skib-Daddy-Toilet Guy**, from a plan-only idea in
`docs/level-progression-and-endgame-plan.md` into a ready-to-code slice.
It was blocked on a single creative decision (Skib-Daddy's face asset);
Ken resolved that in this session's planning pass (2026-07-27) — see
below. Level 7 ("CEO of Drains") stays parked and is explicitly **not**
part of this handoff.

## ⚠️ Read this first: check the working tree before you start

As of this planning pass, `frontend/src/GameEngine.js`,
`frontend/src/gameContent.js`, and `frontend/src/mapGrids.js` all have
**uncommitted, unverified local modifications** (plus stray
`scratch_apply_all*.js` files at the repo root) — an apparent interrupted
attempt at `v0.4.36`'s own named follow-ups (Soggy Toilet Paper, Heavy
Plunger, a `Friendly Fire` badge stub, and placeholder grid exports for
Flooded Annex/Ramen Aisle/World Star). Run `git status` and `git diff`
before touching any of these files. Resolve that dirty state (finish it
for real and verify, or revert it) as its own step — don't build Level 6
on top of an unknown, unverified diff. See the callout at the top of
`docs/roadmap.md` for full detail.

## Prerequisite: finish level-data extraction first

Level 6's pitch (looping hallways, a kitchen/living-room/garage layout)
is much easier to hand-author as a `mapGrids.js` grid than as raw pixel
rects. `buildPorcelainPalace`/`buildPipeworks` already use the grid
parser (`parseMapGrid`, shipped v0.4.36) — `buildFloodedAnnex`,
`buildRamenAisle`, and `buildWorldStarParkingLot` still don't. Migrate
those three (or at minimum confirm the grid parser handles a
multi-"wing" layout with repeated wallpaper/flooring theming) before
authoring Level 6's grid, so Level 6 doesn't get built in the old
hardcoded style and need a second migration later.

## Feature 1: Level 6 map — "Jayden's Nightmare House"

Straight from the PDF's unused fourth map idea. Add a new entry to
`LEVELS` in `frontend/src/GameEngine.js` plus a `buildJaydensNightmareHouse()`
map function (grid-authored, per the prerequisite above).

- **Theme:** a distorted suburban house interior — hallways that loop
  back on themselves (visually distinct wallpaper/flooring tint per
  "wing" so the loop reads as intentional), a kitchen with a toilet where
  the fridge should be, a living room, a garage.
- **Landmark quest room:** the garage, single door (matches the v0.4.33
  "single chokepoint" spec used for Level 5's World Star booth). Badge:
  `garage-survivor` (see Feature 3).
- **Advance condition:** follow the v0.4.33 pattern —
  `levelSkreems >= advanceAt` AND a scaled survival floor
  (`90 + (levelIndex - 3) * 30` = 150s at `levelIndex === 5`) AND
  `chasers.length >= 5`, same shape as Level 5's gate in `GameEngine.js`.

## Feature 2: New chaser — Skib-Daddy-Toilet Guy

- **Face asset — RESOLVED:** reuse the existing `dad-case`
  `CHASER_FACE_POOL` entry (`frontend/src/gameContent.js`) as a
  placeholder face for Skib-Daddy-Toilet Guy — Ken confirmed this
  thematic reuse (2026-07-27) rather than waiting on a new photo. Swap in
  a dedicated photo later by changing the face id on this chaser's
  `chaserType` entry; no re-plan needed.
- **Ability — Plunger Launch:** fires a projectile that, on hit, *pulls*
  the runner backward toward Skib-Daddy a short distance — the inverse of
  the Jayden Gun's stun (a pull, not a freeze), so it stays mechanically
  distinct. Slower base speed than a regular chaser; higher pressure when
  it connects.
- **`chaserType` field:** this is the first chaser that needs the
  "per-level chaser roster" item from `docs/roadmap.md`'s map-system plan
  (item 3) — add a minimal `chaserType` concept (a data object carrying
  ability hooks + a base-speed multiplier) rather than hardcoding
  Skib-Daddy as a one-off special case in the chase-update loop, so a
  future chaser type doesn't repeat the same special-casing.
- **Level 5+ rules still apply:** wall-hacks and the speed multiplier
  (`_moveIgnoringWalls`, v0.4.34) apply to Skib-Daddy too at
  `levelIndex >= 4`, layered on top of his own `chaserType`, not
  replacing it.

## Feature 3: Landmark badge

Add `garage-survivor` to `BADGES` in `frontend/src/gameContent.js`,
spawned via the existing `_spawnQuestRoomBadge()` pattern (already used
for Levels 4-5) in the garage room. Follow the exact wiring pattern
already used for `ramen-vault-keeper`/`world-star-witness`.

## Explicitly out of scope

- Level 7 / "CEO of Drains" — stays parked, not part of this handoff.
- Raman-Aunt-Toilet Lady's ability — still unclaimed, not part of this
  handoff.
- Finishing the uncommitted Soggy Toilet Paper/Heavy Plunger/Friendly
  Fire work sitting in the working tree — that's a separate cleanup step
  (see the callout above), not this feature.

---

## 🚀 Copy & Paste Snippet for Code Monkey

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md`, `docs/roadmap.md`, and
`docs/level-progression-and-endgame-plan.md` before starting.

STOP FIRST: run `git status` and `git diff`. The working tree may already
have uncommitted, unverified changes to `frontend/src/GameEngine.js`,
`frontend/src/gameContent.js`, and `frontend/src/mapGrids.js` (an
interrupted earlier attempt at unrelated v0.4.36 follow-ups). Do not layer
new work on top of unknown, unbuilt changes — resolve that first (finish
and verify it as its own commit, or revert it) before starting Level 6.

Your objective, once the tree is clean:

1. Confirm (or finish) migrating `buildFloodedAnnex`, `buildRamenAisle`,
   and `buildWorldStarParkingLot` in `frontend/src/GameEngine.js` to the
   `parseMapGrid`/`mapGrids.js` grid format already used by
   `buildPorcelainPalace`/`buildPipeworks`.
2. Add `buildJaydensNightmareHouse()` (grid-authored) and a new `LEVELS`
   entry (Level 6) in `frontend/src/GameEngine.js`, per Feature 1 above:
   looping-hallway theme, a single-door garage quest room, and the
   `advanceAt` + `90 + (levelIndex-3)*30`s survival floor + 5-chaser gate.
3. Add a `chaserType` concept and wire Skib-Daddy-Toilet Guy as the first
   user of it: `dad-case` placeholder face, slower base speed, and a
   Plunger Launch ability (projectile that pulls the runner toward him on
   hit — distinct from the Jayden Gun's stun).
4. Add the `garage-survivor` badge to `BADGES`
   (`frontend/src/gameContent.js`) and spawn it via the existing
   `_spawnQuestRoomBadge()` pattern in the garage room.

Verify with `npm run build` and the full Playwright suite; add a focused
spec for the Level 6 advance gate and Plunger Launch pull, following the
pattern of `frontend/e2e/level5-wallhacks-gawd-particle.spec.js`. Update
`docs/roadmap.md`, `docs/handoffs/ledger.md`, `docs/version-log.md`,
`docs/update-directions.md`, `docs/characters.md`, `docs/badges.md`, and
generate `docs/handoffs/roadmap-handoff-vX.Y.Z.md` per the SDLC checklist.
Commit your work before ending the session.
```
