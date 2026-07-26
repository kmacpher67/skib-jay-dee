# Roadmap Handoff — v0.4.26-plan

**Session mode:** Mode A (Planning only)

Scopes two new "stakes go up for experienced players" backlog items added
to `docs/roadmap.md` this session (Phase 7): a negative-sheebs debt economy
past level 3, and losable shop items/rewards past level 4. No code changed
this session; `GAME_ITERATION` stays unbumped.

This is queued *behind* [roadmap-handoff-v0.4.25-plan.md](roadmap-handoff-v0.4.25-plan.md)
(post-kill chaser profile + kill history + clickable Deaths log), which is
still the oldest unfinished handoff — pick that up first under Mode B's
oldest-first rule unless the user asks for this one specifically.

## Trigger for this pass

Ken shared a screenshot of the menu (240 sheebs, 2048 lifetime deaths) with
the reaction "how do i have 240 sheebs when i've been killed 2048 times, I
should have negative or zero sheebs." Current behavior is not actually a
bug: sheebs come from level-clear rewards as well as being spent/lost on
capture, and every capture only docks a flat 20 (floored at `0` via
`Math.max(0, ...)` in `GameEngine.js` — constructor, capture penalty, and
shop spend all clamp there). But the reaction is a fair design prompt: for
players who've proven themselves past the early levels, losing should have
teeth. That's the two items below.

## Design summary

### 1. Sheebs debt economy (negative balance above level 3)

- Keep the existing floor-at-`0` behavior for `profile.highestLevel <= 3` —
  new/casual players should never see a confusing negative number.
- Once `profile.highestLevel > 3`, drop the clamp specifically on the
  capture penalty path (`GameEngine.js` around the `sheebsLost` deduction,
  currently `this.sheebs = Math.max(0, this.sheebs - sheebsLost)`), so a
  capture can push `sheebs` below `0`.
- Do **not** drop the clamp on shop purchases — a player still can't spend
  sheebs they don't have; the debt only comes from capture penalties.
- **Needs a product decision before coding:** how should a negative balance
  render in the menu pill / HUD? Options: plain negative number (e.g.
  `-40`), a "debt" badge/red styling, or a distinct label ("owes 40
  sheebs"). Flag this for Ken explicitly — don't guess and ship a look he
  didn't ask for.

### 2. Losable shop items/rewards above level 4

- Once `profile.highestLevel > 4`, a capture should have a chance to strip
  a previously purchased item back out of the profile (`ownedItems` or
  equivalent in `frontend/src/lib/cookies.js`), not just dock
  sheebs/skreems.
- **Needs product decisions before coding** (do not start implementation
  until these are answered — flag for Ken):
  1. Which items are eligible to be lost — all stat upgrades, or only
     cosmetics once a cosmetic item exists (see the still-open "cosmetic
     sink" backlog item)?
  2. Deterministic (every capture past level 4 loses one item) or a rolled
     chance (e.g. 25%)?
  3. Any warning/telegraph before it happens (a HUD indicator that stakes
     are up past level 4), or is it a surprise the first time it happens?
  4. Can a player buy the same item back, or is it gone until the shop
     resets some other way?

## What's explicitly not done yet (Code Monkey target)

This slice is **blocked on the product decisions above** — do not dispatch
to Code Monkey until Ken answers the debt-display question (item 1) and the
four item-loss questions (item 2). Once answered, the coding brief is:

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md` and `frontend/src/GameEngine.js` before touching
anything. Do NOT start this until the product decisions in
`docs/handoffs/roadmap-handoff-v0.4.26-plan.md` have been answered by Ken
and pasted into this block by a planning session.

1. **Negative sheebs above level 3.** In `frontend/src/GameEngine.js`,
   find the capture-penalty deduction (`this.sheebs = Math.max(0,
   this.sheebs - sheebsLost)`, near the skreem-penalty block in
   `_triggerCaught`/`_updateCaught`). Branch on `this.highestLevel > 3`
   (or the equivalent profile field passed into the engine): if true,
   apply `this.sheebs = this.sheebs - sheebsLost` with no floor; if
   false, keep the existing `Math.max(0, ...)` floor. Leave the shop-spend
   clamp in `App.jsx` untouched (purchases always stay floored at 0).
2. **Negative balance display.** Update the sheebs pill/HUD per whatever
   styling decision Ken made (plain negative number vs. debt badge) —
   exact component TBD once the decision is pasted in here.
3. **Item loss above level 4.** Implement per whatever eligibility/chance/
   warning decisions Ken made — exact logic TBD once pasted in here.
4. **Test coverage.** Add/extend a Playwright spec that forces a capture
   at `highestLevel > 3` with `sheebs` near `0` and asserts the balance
   goes negative instead of floors, plus one for `highestLevel <= 3`
   confirming the floor still holds.

Verification:
- `cd frontend && npm run build` must succeed.
- Full Playwright suite passes, including the new spec(s).
- Manual browser pass: play to level 4+, get caught with low sheebs,
  confirm the balance goes negative and displays as decided; confirm a
  fresh/low-level profile still floors at 0.
- Once verified, bump `GAME_ITERATION` to `v0.4.26`, update
  `docs/version-log.md`, `docs/update-directions.md`, `docs/roadmap.md`
  (check off these items), `docs/handoffs/ledger.md`, and create
  `docs/handoffs/roadmap-handoff-v0.4.26.md` before committing, per
  `docs/skib-sdlc.md`.
```

## Flag for Ken

Both items in this plan are **blocked on product decisions**, not ready
for Mode B yet:

1. How should a negative sheebs balance look in the menu/HUD?
2. For item loss past level 4: which items are eligible, deterministic vs.
   chance-based, any warning beforehand, and can a lost item be re-bought?

Don't mark either item "unblocked" in a future copy-paste block until Ken
answers these.
