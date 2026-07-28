# Roadmap Handoff Plan Hotfix — Raman Rows Stuck Issue

**Created by:** Antigravity — 2026-07-27
**Last updated by:** Claude Code — 2026-07-28 (v0.4.64.1 verified fixed, recurrence closed)
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
reverted. Ken's 2026-07-28 Chrome DevTools session surfaced
`.level-4-warning` in the DOM — **separate root cause found and fixed in
v0.4.64.1:** `GameEngine.stop()` (Level 4 warning pause) called
`_unbindInput()` but `start()` never re-bound listeners, so after
"I ACCEPT MY FATE" the canvas kept rendering but keyboard/joystick input
was dead. Matches "stuck on Ramen level" with no wall pinch. If issues
persist after deploy, collect a Triple-Q dump (`v0.4.64+`) or interim
console snippet from `roadmap-handoff-v0.4.64-plan.md`.

## Resolution, round 1 (2026-07-28, v0.4.64.1) — incomplete

Ken initially verified fixed on live prod: Playwright `e2e/level-4-warning.spec.js`
and a Q-triple-press check both passed, `inputBound: true` after accepting
the Level 4 warning, and manual movement worked when the engine was jumped
to Level 4 via console (`levelIndex = 3` + `_syncLevelState`).

**But this didn't reproduce the actual bug.** Ken then reported it still
happens "when you progress from previous into raman rows" — i.e. natural
level-up, not a console jump. That distinction was the key clue.

## Root cause, round 2 (2026-07-28, v0.4.64.2)

A natural level-up calls `_syncLevelState()` (default `notify: true`) from
*inside* `update()`, which itself runs inside the currently-executing
`requestAnimationFrame` callback (`GameEngine.js` `start()`'s `loop`).
`onLevelChange` → App's Level 4 handler → `engine.stop()` fires
**synchronously mid-frame**. `stop()` nulled `this._raf`, but the
still-executing `loop` closure reached its unconditional last line,
`this._raf = requestAnimationFrame(loop)`, and re-armed itself — silently
undoing the stop. `rafActive` then reads `true` (matching the field in
every dump Ken captured), and `start()`'s old guard (`if (this._raf) return`)
no-oped on "I ACCEPT MY FATE," so `_bindInput()` never ran. Console-driven
jumps never triggered this because they don't execute inside an in-flight
RAF frame — which is exactly why the v0.4.64.1 verification looked clean.

**Fix:** added a `_running` flag as the single source of truth for whether
the loop should keep scheduling itself. `stop()` sets it `false`
immediately; the `loop` closure checks it before `update()` and again
before rescheduling, so a mid-frame `stop()` sticks. `start()`'s re-entry
guard now checks `_running` instead of `_raf`.

**New regression test:** `e2e/level-4-warning.spec.js` — "natural mid-frame
level-up" case drives the transition by letting the live RAF loop carry
`phaseTimer` past 0 (not via console `onLevelChange()` call), which is what
makes the race reproducible. Verified this test fails on pre-v0.4.64.2 code
and passes after the fix.

## Root cause, round 3 (2026-07-28, v0.4.64.3) — the real one

v0.4.64.2 deployed and worked exactly as designed: Ken hit a natural
level-up into Ramen Aisle and got a real `buildDebugDump()` showing
`_raf: null`, `_running: false`, `_inputBound: false`, `phase: 'chase'`,
`levelIndex: 3` — a correctly-paused engine, not a race. But Ken's screen
showed no warning overlay at all, just a frozen game with dead input and
no way to proceed. That's a UI bug, not an engine bug.

**Root cause:** `Level4WarningOverlay` (`App.jsx`) renders a
`<div className="modal-overlay level-4-warning">` wrapping
`modal-content warning-content`. Neither `modal-overlay` nor
`modal-content` had **any CSS rule anywhere in the codebase** — every
other modal in the game (`.shop-modal`, `.profile-modal`, `.version-modal`,
etc.) gets `position: absolute; inset: 0; z-index: 30` from
`App.css:260-274`, but this one never did. Result: the overlay rendered in
the DOM (so `page.locator('.level-4-warning').click()` in Playwright
always "worked" — it doesn't check visual stacking), but with no
position/z-index it painted underneath the canvas, invisible and
unreachable to a real player. This explains every prior "verification":
the e2e suite and console-driven checks all interact with the DOM
directly, so they never caught that a human couldn't actually see or
click the accept button.

**Fix:** added proper CSS for `.modal-overlay` / `.modal-overlay
.modal-content` (full-screen, `z-index: 50`, above every other overlay).

**New regression test:** the overlay spec now asserts the bounding box
covers ~90%+ of the viewport and that `document.elementFromPoint()` at the
accept button's center actually lands on that button — not just DOM
presence. Verified it fails against the pre-fix CSS and passes after.

**Raman Rows recurrence is closed** pending Ken's live-prod confirmation of
v0.4.64.3. If a hang is reported again, check for a visible overlay first
— if `buildDebugDump()` shows `_running: false` but nothing is visibly
onscreen, suspect CSS/rendering before suspecting engine logic.

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
