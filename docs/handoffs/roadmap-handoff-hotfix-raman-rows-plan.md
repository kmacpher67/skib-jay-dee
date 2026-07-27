# Roadmap Handoff Plan Hotfix — Raman Rows Stuck Issue

**Created by:** Antigravity — 2026-07-27
**Session mode:** Mode B (Hotfix implemented directly)

## Trigger

User reported:
> "crashed again on raman rows. what happened i thought we fixed this? is it scheduled yet?"

## Investigation

The previous wall-pinch fix in `v0.4.51` addressed 1-tile gaps across several maps, but a 1-tile seam on the outer wall of `RAMEN_AISLE_GRID` (rows 20-39, column 73) was explicitly whitelisted in `audit-map-widths.py` as a "benign seam". It turns out players could still clip into it (either by getting pushed by Chasers or perfectly aligning their bounding box during a sprint), leading to a soft-lock ("stuck in wall" state).

## Fix details

- Edited `frontend/src/mapGrids.js` to replace the `.` gap with `#` along `RAMEN_AISLE_GRID` rows 20-39 (lines 491-510).
- Bumped `GAME_ITERATION` to `v0.4.52.1`.

## Copy-paste: next natural steps

```text
The Raman Rows bug is patched via hotfix (v0.4.52.1). 
Pick up the next open plan in `docs/handoffs/` for the next coding session (Mode B), such as `roadmap-handoff-v0.4.58-plan.md` if Ken makes a decision, or `roadmap-handoff-v0.4.53-plan.md`.
```
