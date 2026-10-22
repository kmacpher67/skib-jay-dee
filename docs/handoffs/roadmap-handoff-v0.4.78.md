# Roadmap Handoff v0.4.78 — Boom Stick C2 Blast

**Created by:** Claude Sonnet 5.5 — 2026-10-22
**Created on:** 2026-10-22
**Last updated by:** Claude Sonnet 5.5 — 2026-10-22
**Session mode:** Mode B (code and delivery)

## What Landed

- Boom Stick Slice C2: `_fireBoomStick()` / `_getBoomStickTargets()` in `GameEngine.js`, constants `BOOM_STICK_RANGE` (230), cone half-angle 35 degrees, explode chance 1/3, stun 7s, knockback 90px, respawn 12s, fire cooldown 0.9s.
- Walls block the blast (line-of-sight sampling). Survivors are knocked back through `_moveWithCollision`.
- Exploded chasers leave the roster, increment `engine.bodyCount` (session only), and re-enter via `chaserRespawnQueue` at 12s.
- One 25-sheeb reward per blast. Temporary `SPLAT!` text (`splatEffects`) and smoke only.
- Issue #5 pickup wall-spawn fix shipped in this version.
- Tests: `frontend/e2e/boom-stick-c2.spec.js`; full Playwright suite passed (68 passed, 1 skipped).

## Not Done

- Slice D: splotch decal + portrait-shatter cutaway.
- Slice E: subtitles and browser-safe SFX.
- Slice F: final voice assets (blocked on Ken's recordings / approval).
- Handgun ammo table, chaser HP tiers, persistent body count, `Splat` death gag.
- Empty-shell fire currently does nothing silently (no click line) — minor polish.

## Copy-Paste: Next Natural Steps

```text
Work in Mode B. Read docs/skib-sdlc.md, docs/update-directions.md,
docs/roadmap.md, docs/handoffs/roadmap-handoff-v0.4.77-plan.md, and
docs/handoffs/roadmap-handoff-v0.4.78.md.

Implement only Boom Stick Slice D: blood-splotch decal plus one combined
portrait glass-shatter cutaway per blast (reduced-motion variant included),
replacing the temporary SPLAT! text. Hook into `_fireBoomStick()` in
frontend/src/GameEngine.js (`splatEffects` already exists).

Run `cd frontend && npm run build && npx playwright test`.
Update the SDLC docs and commit. Deploy via ./scripts/deploy-static.sh.
```
