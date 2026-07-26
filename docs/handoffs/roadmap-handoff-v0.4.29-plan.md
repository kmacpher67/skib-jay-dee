# Roadmap Handoff — v0.4.29-plan

**Session mode:** Mode A (Planning only)

Scopes one new Phase 7 backlog item in `docs/roadmap.md`: a "Schleimy
Potion" collectible that lets a player squeeze through the map's tight
wall gaps, paired with a challenge-escalation counterweight so the item
is a risk/reward tool rather than a free pass. The broader goal is to
make later levels feel more interactive, not just numerically harsher:
every new survival tool should create a new decision point, and every
new decision point should keep the chases tense. Also closes out a stray
audit question from Ken's message (stamina/hit-and-keep-running already
shipped). No code changed this session; `GAME_ITERATION` stays unbumped.

This is queued *behind* [roadmap-handoff-v0.4.28-plan.md](roadmap-handoff-v0.4.28-plan.md)
(Level 4 transition screen + badges), which is still open per its own
flag-for-Ken section — confirm that's committed (or intentionally
deprioritized) before starting Mode B on this plan.

## Trigger for this pass

Ken sent two mobile screenshots of map corners/chokepoints with "these
corner traps are very cool, players enjoy these," then forwarded a
paraphrased request for two features:

1. A "Call of Duty style" stamina feature that lets you take a hit and
   keep running — Ken guessed this might already exist.
2. A "schleimy potion" that lets the player slip through tight map
   cracks that normally block/kill them, calling the tight-crack
   trapping locations "cool map design" worth keeping as-is.

He also pasted a long AI-brainstormed list of ways to make the potion
(and the map) more challenging once the potion exists, and asked: "now
that we give them something to help with the trapped skinny potion what
can we do to make it more challenging?" — with the instruction to refine
and enhance the brainstorm rather than dump the whole list into the
backlog.

## Audit result: stamina/hit-and-keep-running

**Already shipped — no work needed.** `frontend/src/GameEngine.js` has a
full stamina system: `this.maxStamina = 100` / `this.stamina`
(`GameEngine.js:407-408`), drained by sprinting
(`GameEngine.js:788-793`) and regenerated when not sprinting
(`GameEngine.js:799-800`), with a HUD bar that renders it
(`GameEngine.js:1280-1281`, green above 25%, red below). Sprint lets the
player outrun a chaser without dying to the first touch — that's the
"take a hit and keep running" feel Ken described. Nothing to build here;
flagging as closed in the roadmap so it stops recurring as a request.

## Design summary

### Schleimy Potion — collectible mobility item with a real cost

Refined from Ken's brainstorm down to one concrete, buildable shape
(picking specific answers instead of listing every option — flagged
below wherever a call is still Ken's to make):

- This is a progressive-difficulty item, not a skip button. The potion
  should preserve the map's tight-gap skill checks while adding a
  visible tradeoff the player can feel immediately in the chase.

- **What it does:** for a short duration, shrinks the runner's collision
  box so it fits through wall gaps that are normally solid blockers.
  Mechanically clean to build: `_hitsWall`/`_moveWithCollision`
  (`GameEngine.js:986-996`) already do plain AABB checks against
  `entity.w`/`entity.h` against `this.map.walls` — an active-effect flag
  that temporarily scales `this.runner.w`/`h` down (e.g. to 65%) before
  the wall check, restoring it on expiry, is a small, contained change.
- **The cost (this is the "make it more challenging" ask):** rather than
  a pure escape button, schleiming is a *worse* state to be caught in,
  not a better one:
  - Movement speed drops by ~20% while active (you're literally
    slipping around, not sprinting) — reusing the existing speed-bonus/
    modifier plumbing already in `this.loadout.speedBonus`.
  - The chaser speed modifier gets a temporary bump for the duration
    (reuse `CHASER_SPEED_MOD_*` from the existing rubber-band system) —
    using the potion mid-chase means the toilet closes distance faster
    for those few seconds. This directly answers Ken's "make it more
    challenging" ask: the tool that saves you from one trap makes you
    more vulnerable everywhere else while it's running.
  - This replaces the brainstormed "combat lockout" idea (the game has
    no combat to lock out) with an equivalent: mobility trade-off instead
    of offense trade-off.
- **Duration & indicator:** proposed 4 seconds, with a HUD timer bar next
  to the stamina bar (same visual language, different color) so the
  player always knows how much "schleim" time is left — this was one of
  Ken's brainstormed asks (visual indicator/timer) and is worth keeping.
- **Acquisition — needs a call from Ken:** map pickup (like puddles/
  skreems, single-use, respawns per level) vs. Shleeb Shop purchase
  (persistent `ownedItems` entry, usable every run). Recommend **map
  pickup** — it fits "new stuff to collect" from Ken's framing better
  than a shop upgrade, and keeps it consumable/tactical rather than a
  permanent stat like the existing shop items.
- **Not carried over from the brainstorm (deliberately cut, flag if Ken
  disagrees):** moving/pulsing wall geometry and a new micro-enemy that
  also fits through cracks. Both are real map/AI work (new wall
  animation system, new enemy type with its own pathing) — bigger scope
  than a single item pickup. Proposing to hold these as a *separate*
  future backlog line (see below) rather than bundle into this slice.

### Challenge-escalation follow-up (separate backlog line, not this slice)

Kept distinct from the potion item above because it's map/enemy design
work, not a single mechanic:

- This is the matching counterpressure for the potion item. The point
  is to keep the new mobility option honest once players learn to lean
  on it.

- **Micro-Skib chaser variant:** a new, smaller chaser type sized to fit
  through the same tight cracks the potion opens up, so a "safe" crack
  isn't unconditionally safe once one of these is active. This is the
  brainstormed idea that most directly symmetrizes the potion (player
  gets crack access → a chaser type gets it too) without needing new
  wall/geometry systems.
- Needs its own product/design pass (when it spawns, which levels, does
  it replace or add to existing chaser count) — not scoped further here,
  just flagged so it doesn't get lost.

## What's explicitly not done yet (Code Monkey target)

Both the potion's acquisition method and the exact percentages (hitbox
shrink %, speed penalty %, chaser speed-mod bump amount, duration) are
still **Ken's call** — proposed defaults are above, but do not start Mode
B until Ken confirms or adjusts them. Once confirmed, the coding brief
is:

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md` and `frontend/src/GameEngine.js` before touching
anything. Do NOT start this until Ken has confirmed the acquisition
method (map pickup vs. shop item) and the numeric defaults in
`docs/handoffs/roadmap-handoff-v0.4.29-plan.md` (hitbox shrink %, speed
penalty %, chaser speed-mod bump, duration) — if this block hasn't been
updated with Ken's confirmed numbers, stop and flag it.

1. **Schleim state.** Add a `schleimTimer`/`schleiming` flag to the
   runner state in `GameEngine.js`. While active: scale the AABB used in
   `_hitsWall`/`_moveWithCollision` (`GameEngine.js:986-996`) down to the
   confirmed shrink %, apply the confirmed speed penalty to the
   sprint/move speed calc, and apply the confirmed temporary bump to the
   chaser speed modifier (reuse `CHASER_SPEED_MOD_*` plumbing). Restore
   all three to normal when the timer expires.
2. **Acquisition.** Implement per Ken's confirmed method — either a new
   pickup type on the map (parallel to how puddles/skreems are placed
   per level) or a new `SHOP_ITEMS` entry (parallel to existing shop
   items in `App.jsx`/wherever `SHOP_ITEMS` is defined).
3. **HUD indicator.** Add a timer bar next to the existing stamina bar
   (`GameEngine.js:1280-1281` is the pattern to match) showing remaining
   schleim duration while active.
4. **Test coverage.** Add a Playwright spec that triggers the schleim
   state and asserts: the runner can pass through a wall gap that would
   normally block it, the speed/chaser-mod penalties are active during
   the window, and everything reverts after the timer expires.

Verification:
- `cd frontend && npm run build` must succeed.
- Full Playwright suite passes, including the new spec.
- Manual browser pass: trigger the potion near one of the tight corner
  chokepoints Ken screenshotted, confirm the runner can slip through,
  confirm the speed/chaser penalties are felt, confirm it wears off.
- Once verified, bump `GAME_ITERATION` to `v0.4.29`, update
  `docs/version-log.md`, `docs/update-directions.md`, `docs/roadmap.md`
  (check off this item), `docs/handoffs/ledger.md`, and create
  `docs/handoffs/roadmap-handoff-v0.4.29.md` before committing, per
  `docs/skib-sdlc.md`.
```

## Flag for Ken

1. Stamina/hit-and-keep-running: **already shipped**, nothing to do —
   confirm this matches what you expected before we close the loop on
   it.
2. Schleimy Potion: needs your call on **acquisition** (map pickup vs.
   shop item — recommending map pickup) and the **numeric defaults**
   (65% hitbox shrink, 20% speed penalty, 4s duration, chaser speed-mod
   bump amount — recommending reusing the existing
   `CHASER_SPEED_MOD_DEATH_STEP`-sized bump). Proposed defaults are
   above; say the word to confirm or adjust before this goes to Mode B.
3. Micro-Skib chaser (the counterweight to the potion) is intentionally
   scoped as a *separate*, not-yet-designed backlog line — didn't want to
   bundle new enemy-AI work into the same slice as a single item pickup.
   Let me know if you want that prioritized next or held further out.
