# Roadmap Handoff — v0.4.28-plan

**Session mode:** Mode A (Planning only)

Scopes two new Phase 7 backlog items in `docs/roadmap.md`: a Level 4
"Stakes Are Real" difficulty transition screen, and a new persistent
rewards/badges system. No code changed this session; `GAME_ITERATION`
stays unbumped.

This is queued *behind* whatever is currently in flight for v0.4.26 (the
sheebs-debt and item-loss economy — see
[roadmap-handoff-v0.4.26.md](roadmap-handoff-v0.4.26.md), which landed
Mode B changes to `GameEngine.js`, `App.jsx`, and `cookies.js` in this
same working tree) and behind
[roadmap-handoff-v0.4.25-plan.md](roadmap-handoff-v0.4.25-plan.md) if that
line item is still open. Confirm both are actually committed before
starting Mode B on this plan — check `git log` / `git status`, don't
assume from this file alone.

## Trigger for this pass

Ken reviewed the blocked product decisions from
[roadmap-handoff-v0.4.26-plan.md](roadmap-handoff-v0.4.26-plan.md) and
answered them directly, plus asked for two new things: a level-transition
screen so the difficulty spike isn't a silent surprise, and a
rewards/badges system. Paraphrased from Ken:

> GOAL: make the game more challenging as the player progresses. New
> roadmap items for rewards/awards like badges — yes. When the level
> changes, we need a gameplay screen that updates the user with the
> transition of difficulty: losing sheebs and Shop Slop items from the
> shop.

Answers to the v0.4.26-plan product questions (now moot for coding since
v0.4.26 already shipped matching this, but recorded here for the paper
trail):

1. Debt badge is the desired display (funny, keep it) — matches what
   v0.4.26 shipped (`DEBT: <negative>` red badge in the HUD/menu).
2. Item loss: past level 4 is the right threshold, all items are
   eligible, rolled chance (not deterministic) — matches what v0.4.26
   shipped (25% roll, any owned item). Buy-back: yes, a lost item should
   return to the shop for repurchase — **flag for verification**, see
   below.
3. Warning: "big red warning after dying past level 4" — this is the new
   ask below; **not yet implemented** anywhere in the codebase as of this
   plan.

## Open verification item (not this session's scope, but flag it)

`docs/handoffs/roadmap-handoff-v0.4.26.md` describes item loss as "can be
repurchased in the shop later," but does not confirm the lost item is
pushed back into shop inventory state (as opposed to just removed from
`ownedItems` and implicitly re-buyable because the shop always lists all
items regardless of ownership). Whoever picks up Mode B on this plan
should spot-check that behavior against Ken's buy-back answer above before
assuming it's correct — if the shop already lists unowned items for
purchase regardless of history, this is a non-issue; if not, it needs a
small fix bundled in.

## Design summary

### 1. Level 4 "Stakes Are Real" transition screen

Full spec below is close to verbatim from Ken/the copy-paste brief he
forwarded — treat the copy as final unless he says otherwise, this is
flavor text not mechanics.

- **When it fires:** the moment a player clears Level 3 and arrives at
  Level 4, pause the game and show a full-screen overlay *before* Level 4
  starts (i.e. before the chase loop resumes). Fire once per run — track
  a flag (e.g. `hasSeenLevel4Warning` on the in-memory game/profile state,
  reset each new run) so replaying level 4 later in the same session
  doesn't re-show it. Open design question for whoever picks this up:
  should it also reset per calendar day / never show again once seen even
  across runs? Default to "once per run" unless told otherwise — cheapest
  to implement and matches how the level-clear/level-up beat already
  resets per run.
- **Header text:** "WARNING: WELCOME TO LEVEL 4. THE STAKES ARE REAL." —
  bold/flashing red retro font, reusing whatever font/styling the
  jump-scare or caught-screen text already uses for the retro feel.
- **Body text (three rule lines):**
  - "DEBT IS REAL: Your Sheebs no longer stop at zero. Get caught, and
    you go into the red. You owe the Toilet."
  - "SHOP SLOP AT RISK: Every time you are captured, there is a 25%
    chance the Skibs will steal one of your hard-earned stat upgrades."
  - "BUY IT BACK: Stolen items are returned to the Shleeb Shop. Pay off
    your debt and buy them back... if you survive."
  - (Emoji in Ken's original draft — 💸🪠🛒 — are optional flourish, keep
    if they render cleanly in the existing UI font, drop if not; not
    worth blocking on.)
- **Action:** single button, "I ACCEPT MY FATE," dismisses the overlay
  and starts/resumes Level 4.
- **Text location:** add copy to `frontend/src/dialog.js` as a new
  `LEVEL_4_RULES` constant, consistent with how `CAPTURE_LINES` /
  `CHASER_LINES` / `TIRED_LINES` are already organized there.
- **Overlay component:** implement in `frontend/src/App.jsx`, following
  the existing pattern for other full-screen modals/overlays in that file
  (e.g. how `ProfileModal` or the version panel are mounted/dismissed).
- **Image asset:** overlay should reference
  `frontend/src/assets/level-4-warning-transition-screen.jpeg`. Ken has
  dropped this in already (JPEG, 572x1024, portrait) — no placeholder
  needed. Still worth a guarded import so a future path change doesn't
  hard-crash the build, but it's not blocking.

### 2. Rewards/badges system

This is a new roadmap thread, not a continuation of the debt/item-loss
economy — scope it as its own backlog item. Ken confirmed he wants it
("yes lol, debt badge is funny too") but no trigger list or persistence
design has been picked yet. **Needs a product decision before Mode B
coding** — do not start implementation until answered:

1. Which achievements earn a badge? Candidates to propose to Ken:
   survive a capture past level 4, pay off debt (go from negative back to
   0+ sheebs), clear all five levels in one run without dying, reach a
   lifetime-deaths milestone. Pick an initial small set (3-5), not
   everything at once.
2. Where do badges persist? Natural fit is a new array on the cookie
   profile (`frontend/src/lib/cookies.js`), parallel to how `ownedItems`
   and `deathsHistory` already work — e.g. `earnedBadges: string[]`.
3. Where do badges render? Options: a new section in the existing profile
   modal, a strip on the main menu, or both. Needs a call before coding
   layout.
4. Any in-game moment when a badge is earned (a toast/banner), or do they
   only show up later when the player checks their profile?

## What's explicitly not done yet (Code Monkey target)

The transition screen (item 1) has everything it needs to build now —
copy, trigger point, file locations, and the real image asset are all in
place. The badges system (item 2) is **blocked** on the four product
questions above.

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md` and `frontend/src/App.jsx` /
`frontend/src/GameEngine.js` before touching anything. Confirm v0.4.26
(sheebs debt + item loss) is already committed on this branch first —
if not, stop and flag it, don't stack on top of uncommitted work.

Scope for this pass: ONLY the Level 4 transition screen (item 1 in
`docs/handoffs/roadmap-handoff-v0.4.28-plan.md`). Do not start the
badges/rewards system (item 2) — it's blocked on product decisions Ken
hasn't answered yet.

1. **Copy.** Add a `LEVEL_4_RULES` constant to `frontend/src/dialog.js`
   with the header, three body lines, and button text from the plan doc
   above, verbatim.
2. **Overlay component.** In `frontend/src/App.jsx`, add a full-screen
   overlay that renders `LEVEL_4_RULES` plus
   `frontend/src/assets/level-4-warning-transition-screen.jpeg`,
   following the existing modal/overlay pattern already used for
   `ProfileModal`/version panel. Wire it to pause the game loop the same
   way other overlays do.
3. **Trigger.** Fire the overlay once per run, the first time the player
   transitions from level 3 to level 4 (check wherever `GameEngine.js`
   currently fires the level-up/level-clear transition). Gate on a
   per-run flag so it doesn't re-show on later level-4 visits in the same
   session. Dismiss via the "I ACCEPT MY FATE" button, which resumes play
   into level 4.
4. **Test coverage.** Add a Playwright spec that plays to the level 3→4
   transition and asserts the overlay appears with the expected text,
   image, and dismiss button, and that dismissing it starts level 4
   normally. Assert it does NOT reappear on a second level-4 visit in the
   same run (e.g. after a capture and respawn still inside level 4).

Verification:
- `cd frontend && npm run build` must succeed.
- Full Playwright suite passes, including the new spec.
- Manual browser pass: play to level 4, confirm the overlay shows the
  right copy and image, and "I ACCEPT MY FATE" resumes gameplay
  correctly.
- Once verified, bump `GAME_ITERATION` to `v0.4.28`, update
  `docs/version-log.md`, `docs/update-directions.md`, `docs/roadmap.md`
  (check off the transition-screen item only — leave badges unchecked),
  `docs/handoffs/ledger.md`, and create
  `docs/handoffs/roadmap-handoff-v0.4.28.md` before committing, per
  `docs/skib-sdlc.md`.
```

## Flag for Ken

1. Level 4 transition screen has everything it needs to build — no
   blockers, image asset included.
2. Badges/rewards system is scoped but **blocked**: need the initial
   badge list, where they persist (proposed: new `earnedBadges` array in
   the cookie profile), where they render, and whether earning one gets
   an in-game callout.
3. Worth a quick sanity check once v0.4.26 is live: does a lost shop item
   actually come back as purchasable, or was it just removed from
   `ownedItems` (which may already be equivalent, depending on how the
   shop lists items)? Not blocking, just flagged for verification.
