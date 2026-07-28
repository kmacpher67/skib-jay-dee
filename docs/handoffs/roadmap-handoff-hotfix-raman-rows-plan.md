# Roadmap Handoff Plan Hotfix — Raman Rows Stuck Issue

**Created by:** Antigravity — 2026-07-27
**Last updated by:** Cursor Composer — 2026-07-28 (recurrence verification pass)
**Session mode:** Mode B (Hotfix implemented directly)

## Trigger

User reported:
> "crashed again on raman rows. what happened i thought we fixed this? is it scheduled yet?"

## Investigation

The previous wall-pinch fix in `v0.4.51` addressed 1-tile gaps across several maps, but a 1-tile seam on the outer wall of `RAMEN_AISLE_GRID` (rows 20-39, column 73) was explicitly whitelisted in `audit-map-widths.py` as a "benign seam". It turns out players could still clip into it (either by getting pushed by Chasers or perfectly aligning their bounding box during a sprint), leading to a soft-lock ("stuck in wall" state).

## Fix details

- Edited `frontend/src/mapGrids.js` to replace the `.` gap with `#` along `RAMEN_AISLE_GRID` rows 20-39 (lines 491-510).
- Bumped `GAME_ITERATION` to `v0.4.52.1`.

## Recurrence check (2026-07-28)

Ken reported the Ramen Aisle still hanging on **v0.4.60** prod. Code
review confirms the v0.4.52.1 map edit is **still present** — no later
commit touched `frontend/src/mapGrids.js` after `2d61ed0` (v0.4.52.1).

| Check | Result |
|---|---|
| Quest-room seam sealed (rows 491–510, cols 73+) | Still `#`, not `.` |
| Shelf pinch sealed (v0.4.51, rows 601–606) | Still `#########################` |
| `python3 scripts/audit-map-widths.py` | OK — no unexpected pinches |
| E2E `wall-pinch-seals.spec.js` | Covers shelf pinch only; **does not** regression-test the v0.4.52.1 quest-room seam |

**Verdict:** the documented wall-pinch fix was implemented and not
reverted. If Ken still soft-locks, treat it as either (a) a **different**
pinch the audit script misses, (b) a **non-map** hang (phase freeze,
broth-slip steering, chaser push into a corner), or (c) prod/cache lag
(unlikely at v0.4.60, which post-dates v0.4.52.1). Needs a fresh RCA with
a position dump — see interim browser instructions in
`roadmap-handoff-v0.4.64-plan.md` § "Interim browser dump (today)".

## Copy-paste: next natural steps

```text
The v0.4.52.1 wall-pinch fix is still in the tree — do not re-apply it.
If Ken reports another Ramen Aisle hang:
1. Have Ken paste the interim browser dump from roadmap-handoff-v0.4.64-plan.md.
2. Ship Debug State Dump (unblocked slice in that same handoff) so future
   reports are one keypress instead of DevTools console paste.
3. If dump shows runner.x/y near quest-room seam (~730px) or shelf band
   (~1300px), re-audit mapGrids.js; otherwise investigate phase/broth-slip.
Pick the next unblocked Mode B slice from docs/next-agent-coding-brief.md
unless Ken prioritizes the Debug State Dump or a Raman recurrence RCA.
```
