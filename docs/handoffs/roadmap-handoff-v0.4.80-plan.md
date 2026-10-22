# Roadmap Handoff Plan v0.4.80 — Chaser Wall-Spawn Bug Fix

**Created by:** Codex GPT-5  
**Created on:** 2026-10-22  
**Last updated by:** Codex GPT-5  
**Session mode:** Mode A (planning / refinement only — docs only; no code,
no build, no version bump, no deploy)  
**Mode impact:** Runner campaign; chaser collision/spawn safety is shared by
normal campaign play and future chaser-mode paths.

## Issue and RCA

GitHub issue [#9](https://github.com/kmacpher67/skib-jay-dee/issues/9)
reports a chaser spawning inside a wall and becoming unable to chase. The
issue capture matches the Level 4 Ramen Aisle: the configured lead spawn
`{x: 80, y: 190}` overlaps the first shelf wall at `x=100..160`,
`y=160..320` when the default `44×44` chaser rectangle is placed there.

The direct assignment happens in `_syncLevelState()` after the map is built.
Collision-aware movement only rejects future positions; it does not repair
an already intersecting rectangle. `_maybeSpawnExtraChaser()` also inserts
hard-coded corner coordinates without checking the current map, and
`_updateChaserRespawns()` restores the original stored coordinate without a
validation pass. Full details are in
[`docs/rca-issue-9-chaser-spawns-in-wall.md`](../rca-issue-9-chaser-spawns-in-wall.md).

## Bounded implementation slice

Implement one small spawn-safety helper in
`frontend/src/GameEngine.js` that accepts a preferred point and an entity
size, checks the full body rectangle against `this.map.walls`, and returns a
nearby walkable point within the playable bounds. Prefer the supplied point
when valid; use a stable widening-ring search or equivalent deterministic
fallback when invalid. Keep the existing pickup helper separate unless a
small internal primitive cleanly avoids duplicated rectangle checks.

Route all three chaser spawn paths through it:

- lead chaser placement during `_syncLevelState()` / level reset;
- extra chaser placement in `_maybeSpawnExtraChaser()` after the final
  chaser size (`44×44` or Micro-Skib `28×28`) is known; and
- delayed placement in `_updateChaserRespawns()`.

Store the resolved point in `chaser.spawn` so respawn uses the safe point.
Preserve valid configured/corner positions and do not introduce pathfinding,
change map walls, alter runner placement, or change Level 5+ wall-phasing.

## Verification contract

Add a focused Playwright regression test, preferably using the existing
`window.__skibEngine` seam, that:

- visits or resets all six levels and asserts every active lead chaser
  rectangle is clear of `engine.map.walls`;
- forces the extra-chaser timer and checks the new chaser rectangle; and
- exercises a respawn or directly validates the stored respawn point before
  it is reinserted.

Run:

```text
cd frontend && npm run build && npx playwright test
```

The Mode B session must update the normal SDLC ship docs, bump
`GAME_ITERATION` to the next patch version, commit, deploy with
`./scripts/deploy-static.sh <short-name>`, and close issue #9 with the
shipped version and handoff link after production verification.

## Explicitly not done in this handoff

- Boom Stick Slice E (subtitles, browser-safe SFX wiring, and mute) remains
  the next feature slice after this bug fix.
- No change to the Ramen Aisle map geometry or runner spawn.
- No general chaser pathfinding or collision-system rewrite.
- No code, build, version bump, deploy, or issue closure in this planning
  session.

## Copy-paste: next coding session

```text
Work in Mode B. Read docs/skib-sdlc.md, docs/update-directions.md,
docs/roadmap.md, docs/rca-issue-9-chaser-spawns-in-wall.md, and
docs/handoffs/roadmap-handoff-v0.4.80-plan.md.

Implement only GitHub issue #9: add an entity-sized walkable spawn resolver
in frontend/src/GameEngine.js and route lead, extra, and delayed-respawn
chasers through it. Preserve valid spawn coordinates; repair invalid ones
with a nearby bounded fallback and store the resolved point for respawns.
Do not change runner spawns, map geometry, pathfinding, or Level 5+ wall
phasing. Add a focused Playwright regression covering all six lead spawns
plus an extra/respawn path.

Run `cd frontend && npm run build && npx playwright test`. If green, update
the SDLC docs, bump GAME_ITERATION, commit, deploy with
`./scripts/deploy-static.sh issue-9-chaser-spawn`, verify production, and
close GitHub issue #9 with the shipped version and handoff link. Stop after
this bug slice; Boom Stick Slice E is separate.
```

Dispatch hints: `code_monkey_backend=ollama`,
`code_monkey_model=thinkpad-local`.

