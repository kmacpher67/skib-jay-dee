# Roadmap Handoff v0.4.51-plan — Wall-Pinch Collision Traps (Level 4 & Level 6)

**Created by:** Claude Sonnet 5 — 2026-07-27
**Session mode:** Mode A (Planning — docs only, no code changes)
**Status:** PROPOSED — one open decision for Ken, otherwise unblocked

## Note on concurrent work

`docs/handoffs/roadmap-handoff-v0.4.48-plan.md` (Composer, "Backlog
Triage & Gameplay Rebalancing"), `v0.4.49-plan.md` (Broth Slip), and
`v0.4.50-plan.md` (cosmetic shop sink) are uncommitted, in-flight
planning work from a different concurrent session as of this writing.
None of them cover the bug below, so this is a new, independent plan
rather than an edit to any of those files — picked the next free
version slot (`v0.4.51-plan.md`) to avoid clobbering that in-progress
work. A future planning pass should fold this into the queue ordering
once the v0.4.48 triage doc is committed.

## Trigger

Ken reported getting "stuck in a wall" mid-run (screenshot: runner
boxed in by two close orange wall faces, `DEATHS: 2488`) and asked
whether the parked Level 7+ "Mosaic Map of Madness" concept had shipped
early.

## What this planning pass ruled out

**Not related to Level 7+ content.** Confirmed by reading the `LEVELS`
array in `frontend/src/GameEngine.js`: only 6 levels exist today
(Porcelain Palace → Jayden's Nightmare House). The "Mosaic Map of
Madness" is still just a parked concept in
`docs/level-progression-and-endgame-plan.md` (reviewed, not built —
see `docs/handoffs/roadmap-handoff-v0.4.39-plan.md`, and confirmed
still "design track / unbuilt" in the concurrent v0.4.48 triage doc).

**Not the previously-fixed spawn bug.** Commit `9d11cd0` (v0.4.39.1)
re-centered `runnerSpawn.x` for Levels 2-5 so the runner no longer
spawns overlapping a wall on level entry/respawn
(`GameEngine.js:242,253,264,275`). Still correct, still in place. The
screenshot showed the runner mid-map (walls above and below), not at
the bottom spawn boundary, so this wasn't it.

## Root cause found: corridor pinches narrower than the runner's hitbox

The runner's hitbox is 40px (`this.runner.w = 40`, `GameEngine.js:429`)
and collision is plain AABB with no sweep/tunneling issues
(`_moveWithCollision`, `GameEngine.js:1775`) — the collision *code* is
fine. The defect is in the **map grid data**
(`frontend/src/mapGrids.js`). A scripted audit of all six level grids
(flagging any interior floor run flanked by `#` on both sides that's
narrower than 4 tiles / 40px) found two real, reachable spots where the
grid renders what looks like an open lane but is physically too narrow
for the runner to ever pass:

1. **`RAMEN_AISLE_GRID`, rows 130-135, columns 35-38** (Level 4 — the
   level in Ken's screenshot, confirmed by matching
   `buildRamenAisle()`'s `theme.background`/`wallFill` colors to the
   screenshot). A decorative shelf (`################`, cols 38-54)
   juts out from an aisle pillar's right edge, leaving only a **30px**
   sliver of floor between the pillar and the shelf — in the middle of
   what's a 140px-wide open lane one row-band above/below it. A runner
   tracking near the pillar's edge through that lane hits a wall it
   can't fit past and bounces off it, which reads exactly like a
   collision bug even though the walls are placed correctly.
2. **`JAYDENS_NIGHTMARE_HOUSE_GRID`, rows 5-28, columns 85-88** (Level
   6). A **30px-wide vertical channel** runs the full height of that
   band between an inner wall and the level boundary wall. It looks
   like a real hallway — open floor, walls on both sides, same visual
   treatment as every passable corridor elsewhere — but it's
   impassable for the runner's entire hitbox, for its whole length.

A third, lower-confidence flag — `RAMEN_AISLE_GRID` rows 20-39, columns
73-74 (10px) — is very likely a false positive: it's the seam between
the aisle pillar and the Level 4 quest room's outer wall (the
`questRoom` rect in `buildRamenAisle()`), not on the path to the quest
room's actual doors (rows 20-21 / 38-39, ~50px wide, which are fine).
Worth a quick visual sanity check, but not expected to be a real bug.

The other four grids (Porcelain Palace, Pipeworks, Flooded Annex, World
Star Parking Lot) came back clean from the same audit.

### Why it reads as "stuck in a wall" rather than "dead end"

Nothing about these pinches is visually distinct from a normal passable
gap — same `wallFill`/`wallStroke`, same floor color in between, no
telegraphing that the lane narrows past the runner's own width. It
plays exactly like a collision bug even though the walls themselves are
sized and placed exactly as the grid data says.

## Proposed fix direction (no code written this session)

1. **Fix the two confirmed spots.** Either widen each pinch to >= 4
   tiles (40px) so it's a real passable shortcut, or seal it off
   entirely (turn the `.` run into `#`) if it was only ever meant as
   set dressing. See open question below — no documented design intent
   exists for either spot, so a coding agent should not guess.
2. **Re-run the same width audit against all six grids after the fix**
   as a regression check (script below), not just the two known spots —
   hand-authored ASCII grids are easy to typo a pinch into without
   noticing.
3. **Optional guardrail:** a small dev-only script under `scripts/`
   (not shipped in the game bundle) that runs the same "narrowest
   reachable gap >= runner width" check against every `*_GRID` export
   in `mapGrids.js`, so a future hand-authored level can't silently ship
   a sub-40px trap again. Nice-to-have, not required to close this out.

### Audit method (for the coding agent to reproduce/extend)

```python
import re
data = open('frontend/src/mapGrids.js').read()
grids = re.findall(r'export const (\w+_GRID) = \[(.*?)\n\];', data, re.S)
for name, body in grids:
    rows = re.findall(r'"([.#]+)"', body)
    for r, row in enumerate(rows):
        for m in re.finditer(r'\.+', row):
            start, end = m.start(), m.end()
            if start > 0 and end < len(row) and row[start-1] == '#' and row[end] == '#':
                if (end - start) < 4:  # < 40px, narrower than the runner
                    print(name, 'row', r, 'cols', start, '-', end, 'width_px', (end - start) * 10)
```

## Open question for Ken

Widen or seal the two confirmed pinches (Ramen Aisle shelf, Nightmare
House channel)? Neither was ever wide enough to be a usable path, and
no prior doc records intent either way. **Default recommendation:
seal off** (turn the `.` run into `#`) — smaller, lower-risk diff, and
matches "these were never meant to be walked through." If Ken doesn't
answer before a coding session picks this up, the coding agent should
apply the seal-off default rather than guess at widening (per
`docs/skib-sdlc.md`: a recommendation is not a decision Ken made).

## What's explicitly not done

- No code changes — this is a Mode A planning/investigation pass only.
- No fix applied to `mapGrids.js` or `GameEngine.js`.
- No decision made on widen-vs-seal; that's Ken's call above.
- Did not hand-walk every level for general feel/balance issues beyond
  the automated width audit plus manual confirmation of the two
  flagged spots.
- No `GAME_ITERATION` bump, build, or deploy in this planning pass.
- Did not touch `docs/roadmap.md` or the other files currently modified
  by the concurrent v0.4.48/49/50 planning session, to avoid clobbering
  in-progress uncommitted work — a future pass should merge this item
  into that queue once it lands.

## Copy-paste: next coding agent (Mode B)

```text
Read docs/skib-sdlc.md, then docs/update-directions.md, then
docs/handoffs/roadmap-handoff-v0.4.51-plan.md (this file).

If Ken has answered the widen-vs-seal question above, follow his
answer. If not, default to sealing both pinches off (turn the narrow
`.` run into `#`) rather than widening — smaller, lower-risk diff.

Your slice:
1. In frontend/src/mapGrids.js, fix RAMEN_AISLE_GRID rows 130-135
   (cols 35-38, the 30px sliver next to the shelf at cols 38-54).
2. In the same file, fix JAYDENS_NIGHTMARE_HOUSE_GRID rows 5-28
   (cols 85-88, the 30px vertical channel).
3. Spot-check RAMEN_AISLE_GRID rows 20-39 cols 73-74 (likely a benign
   quest-room wall seam, not a real path) — leave it alone unless you
   confirm it's actually reachable and wrong.
4. Re-run the width-audit script in this handoff's "Audit method"
   section against all six *_GRID exports to confirm no other pinches
   exist after your edit (should print nothing, or only the col 73-74
   spot if you decided to leave it).
5. Do NOT touch _moveWithCollision, _hitsWall, or runnerSpawn in
   GameEngine.js — those are correct and already fixed (v0.4.39.1).
   This is a map-data-only fix.

Verification:
- cd frontend && npm run build
- Manually drive the runner through both fixed spots (or the
  Playwright/CDP approach in docs/dev-notes.md) to confirm each is
  either cleanly passable or cleanly walled off — not a half-width
  trap.

After the code lands, update docs/version-log.md, docs/roadmap.md,
docs/handoffs/ledger.md, docs/update-directions.md, and create
roadmap-handoff-v0.4.51.md (drop the -plan suffix, matching the
shipped GAME_ITERATION at that point — check frontend/src/version.js
first since other slices may ship before this one). Do not bump
GAME_ITERATION or deploy unless the user explicitly asks.
```
