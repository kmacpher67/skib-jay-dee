# Roadmap Handoff v0.4.51 — Wall-Pinch Collision Traps

**Created by:** Cursor Grok 4.5 — 2026-07-27
**Last updated by:** Cursor Grok 4.5 — 2026-07-27
**Session mode:** Mode B (Code and delivery)
**Shipped:** `GAME_ITERATION` = `v0.4.51`

## Goal

Fix the mid-map "stuck in a wall" feel Ken hit on Level 4 by sealing
two confirmed sub-40px corridor pinches in map grid data (not collision
code). Default seal-off applied — Ken had not answered widen-vs-seal
before coding (per plan + `docs/skib-sdlc.md`).

## Changes made

- `frontend/src/mapGrids.js` — sealed `RAMEN_AISLE_GRID` rows 130-135
  cols 35-38 (Level 4 shelf sliver) and `JAYDENS_NIGHTMARE_HOUSE_GRID`
  rows 5-29 cols 85-88 (Level 6 vertical channel; audit also flagged
  row 29 beyond the plan's 5-28 band).
- Left the Ramen quest-room wall seam at cols 73-74 alone (benign).
- `scripts/audit-map-widths.py` — optional regression guardrail with
  allowlist for that seam.
- `frontend/e2e/wall-pinch-seals.spec.js` — asserts both sealed bands
  block `_moveWithCollision`.
- `frontend/src/version.js` → `v0.4.51`; `VersionModal.jsx` note added.

Did **not** touch `_moveWithCollision`, `_hitsWall`, or `runnerSpawn`.

## Verification

- `python3 scripts/audit-map-widths.py` — OK (only allowlisted seam).
- `cd frontend && npm run build` — passed.
- `npx playwright test e2e/wall-pinch-seals.spec.js` — 2/2 passed.
- Deployed via `./scripts/deploy-static.sh wall-pinch-seals`.

## What's explicitly not done

- Widening either pinch into a shortcut (seal-off default only).
- Broader map feel/balance walk of all six levels.
- Optional CI wiring for `audit-map-widths.py`.

## Copy-paste: next natural steps

```text
Read docs/skib-sdlc.md, docs/update-directions.md, then
docs/handoffs/roadmap-handoff-v0.4.41-plan.md (Slice B shop labels).

GAME_ITERATION is v0.4.51. Next unblocked code slice: Slice B shop
labels or Play Recap pickup tracking — see v0.4.41-plan.md.
Also queued: v0.4.54 near-miss, v0.4.55 Micro-Skib, v0.4.56 pose collapse.

Verify: cd frontend && npm run build && npx playwright test --workers=1
```
