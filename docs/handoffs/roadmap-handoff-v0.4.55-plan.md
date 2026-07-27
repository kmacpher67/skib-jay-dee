# Roadmap Handoff Plan v0.4.55 — Micro-Skib Chaser

**Created by:** Composer — 2026-07-27
**Last updated by:** Composer — 2026-07-27
**Session mode:** Mode A — **code-ready** (Ken confirmed 2026-07-27)

## Source

Ken confirmed from `roadmap-handoff-v0.4.48-plan.md`:

- **Replace** an extra-chaser spawn (not additive 6th chaser).
- **Level 3+** gate (`levelIndex >= 2`, Flooded Annex onward).
- Approve MVP stats below.

## Confirmed stats

| Parameter | Value |
|---|---|
| Hitbox | ~65% of normal chaser (mirror Schleimy Potion shrink) |
| Spawn | 15% chance to replace one `_maybeSpawnExtraChaser()` roll |
| Level gate | `levelIndex >= 2` |
| Speed | `0.85×` normal chaser base speed |
| Lead chaser | Never Micro-Skib |
| Face | Placeholder circle sprite until Ken supplies art — **do not** add a family photo |

## Files likely touched

- `frontend/src/GameEngine.js` — `chaserType` or `isMicroSkib` flag; smaller
  hitbox in collision; spawn roll in `_maybeSpawnExtraChaser()`.
- `frontend/e2e/micro-skib.spec.js` — force spawn on L3+, assert smaller hitbox
  or distinct type id.

## Copy-paste: Mode B

```text
Read docs/handoffs/roadmap-handoff-v0.4.55-plan.md.

Implement Micro-Skib: 15% replace extra spawn, L3+, 65% hitbox, 0.85x speed,
placeholder sprite.

Verify: cd frontend && npm run build && npx playwright test
```
