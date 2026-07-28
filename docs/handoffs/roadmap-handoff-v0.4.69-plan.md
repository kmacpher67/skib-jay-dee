# Roadmap Handoff Plan v0.4.69 — Chaser Beta: Runner AI Item Use (+ light dialog)

**Created by:** Claude Sonnet 5 — 2026-07-28
**Last updated by:** Codex (GPT-5) — 2026-07-28
**Session mode:** Mode A (Planning / refinement only — docs only, no code,
no build, `GAME_ITERATION` not bumped)
**Status:** READY FOR MODE B — Run the two small slices below in order. The
final re-audit confirms the `handleCaught` leak and broadens the bounded
profile fix to every shared profile-writing callback; the first AI item
behavior is intentionally **gun-first**, not a generic loadout system.
**Mode impact:** `Chaser Beta only` (see
[`role-reversal-design.md`](../role-reversal-design.md#12-documentation-contract-for-two-modes)).

## Trigger

Ken played `PLAY AS CHASER — BETA` in the browser (2026-07-28) after the
`v0.4.61` movement/steering recovery landed. Feedback:

- The mode is now actually playable — human chaser moves, AI runner flees
  instead of standing still. Confirms the `v0.4.61` fix held.
- **Still needs work.** Specifically: the AI-controlled runner picked up
  the Jayden Gun pickup during the round and never fired it at the human
  chaser. From the player's seat, being hunted by a gun-carrying opponent
  who never shoots reads as broken/inert, not as a fair fight.
- New requirement: the **runner should be able to use helpful items** (at
  minimum, fire the gun back at the pursuing human chaser) **and avoid
  harmful ones** (not blunder into pickups that would slow it down or
  otherwise hurt its own escape).

## What "read docs/" found

1. **`role-reversal-design.md` §11 (mode boundary matrix) currently says
   Pickups/quest rooms are "Off in recovery slice"** for Chaser Beta.
   That was the `v0.4.61-plan` scope call, written before this pickup
   ever spawned in front of Ken.
2. **The code never actually enforced that.** `GameEngine.js`
   `_syncLevelState()` calls `_maybeSpawnGunPickup()`,
   `_spawnQuestRoomBadge()`, `_spawnProgressionBadge()`,
   `_maybeSpawnHumorBadge()`, `_maybeSpawnGawdParticle()`,
   `_maybeSpawnRodOfPoopdom()`, `_maybeSpawnTurdstoneToken()`, and
   `_maybeSpawnTacoBell()` unconditionally — none of those spawn calls
   are gated on `this.isChaserMode`. So campaign pickups have been
   spawning into the Chaser Beta arena the whole time, contradicting the
   design doc. Ken's playtest is the first time anyone noticed, because
   it's the first time the mode was playable long enough for a gun to
   matter.
3. **The AI runner has zero pickup awareness.** `_getRunnerEvadeVector()`
   (`GameEngine.js:916`) only ever computes a flee/wander vector off the
   nearest chaser and wall probes — it has no knowledge of `this.pickups`
   or `this.rollingPickups` at all, so the runner can walk over a gun,
   auto-collect it (the collision/collect path is shared with the human
   runner), and then just... keep fleeing. It has no fire logic, no
   concept of "this item helps me," and no concept of "this item hurts
   me, route around it."
4. **The existing classifications are useful, but are not a safe generic
   AI loadout.** `POSITIVE_PICKUPS` is a campaign reward list, not an
   NPC-intent list: it includes `heavy-plunger` (which slows the runner and
   replaces the gun), omits the Rod, and rolling pickups use their own
   `isGood` flag. Badge-pickup telemetry also special-cases badge types as
   good. Therefore this slice must not make the runner automatically seek
   every `POSITIVE_PICKUPS` entry. It should seek the **gun** that prompted
   Ken's playtest finding, avoid rolling pickups explicitly marked
   `isGood: false`, and leave all other item priorities for a later,
   Ken-approved AI-loadout decision.
5. **(Refine 2026-07-28)** Dialog/theater is still runner-centric. Tag win
   uses hardcoded `'Gotcha! Round over.'`; `App.jsx` `handleCaught` (line 354) still
   plays the runner death sting (`playCaughtAudio()`) and can strip shop items even on a Chaser
   Beta tag when `highestLevel > 4`. Rematch/Menu already exist on `ProfileModal` for chaser mode
   — do not rebuild that card. Light dialog pools + gating the death path
   make the win feel like a hunt, not a runner death.

## Decision for this slice

Ken's playtest supersedes the earlier "pickups off in recovery slice"
call. Pickups **stay on** in Chaser Beta (removing them now would be a
regression from what Ken just played and liked enough to keep testing),
but the AI runner needs to actually *engage* with them instead of
ignoring them. Primary work, plus a light dialog add-on that fits the
same Mode B session without inventing the full arcade loop:

### A. Gun-first AI awareness + fire-back (primary)

1. **Give the AI runner one legible item goal — the gun.** Extend
   `_getRunnerEvadeVector()` (or a small sibling helper) so that, only in
   its existing low-pressure / far branch (`minDist > 250`), the runner
   may steer toward the nearest `gun` pickup instead of the center
   waypoint. Keep the existing wall-probe shape. Do not pursue every
   `POSITIVE_PICKUPS` entry and do not add a new item taxonomy. For harm
   avoidance, bias away from nearby rolling pickups whose existing
   `isGood` flag is `false`; static pickups do not currently carry a
   reliable harmful flag, so do not guess by treating every non-positive
   static item as poison.
2. **Give the AI runner offensive item use.** Once the runner is holding
   gun ammo, is in Chaser Beta, and the human chaser is in a modest firing
   range, make a brief, readable **turn-and-panic-shot**: aim the runner at
   `chasers[0]` for that shot, call the existing `_tryFire()` / bullet path,
   then let normal flee movement retake facing on the next update. Do not
   require the chaser to be ahead of the runner's movement-facing direction
   — a fleeing runner naturally faces away, which would make the proposed
   fire branch unreachable. `_tryFire()` currently returns no success value;
   show the taunt only if the bullet count increases after the call, rather
   than changing the shared human-input contract. Do not generalize this
   hook to Rod, Plunger, Shart, or a future item kit in this slice.

### B. Light dialog theater (add-on — keep small)

Fits because it is mostly new arrays in `dialog.js` plus three wire
points that sit next to work already in this slice. See
[`role-reversal-design.md` §15](../role-reversal-design.md) and
[`dialog_content_chasing.md`](../dialog_content_chasing.md).

1. Add pools to `frontend/src/dialog.js` (mirror in dialog doc):
   - `CHASER_BETA_OPENER_LINES` — set `bannerText` (or a short toast) when
     Chaser Beta chase starts:
     - `"YOU'RE THE TOILET. TAG JAYDEN ONCE!"`
     - `"HUNT MODE: ONE TAG. NO SHEEBS. ALL BOWL."`
     - `"SPRINT, CORNER, FLUSH THE RUNNER!"`
     - `"THE HUMAN HAS A GUN. GET THEM ANYWAY."`
   - `CHASER_BETA_RUNNER_GUN_TAUNTS` — speech bubble on the AI runner when
     AI `_tryFire()` succeeds:
     - `"BACK UP, BOWL BOY!"`
     - `"I FOUND A GUN! RUN!"`
     - `"FLUSH THIS, TOILET!"`
     - `"PEW! PERSONAL SPACE!"`
   - `CHASER_BETA_WIN_LINES` — replace hardcoded `'Gotcha! Round over.'`
     in the chaser-mode capture branch (`GameEngine.js:1530`):
     - `"TAGGED! THE BOWL TAKES IT!"`
     - `"FLUSHED! HUNT COMPLETE!"`
     - `"CAUGHT IN 4K: PORCELAIN VICTORY!"`
     - `"DOWN THE DRAIN! CHASER WINS!"`
2. Reuse `GUN_HIT_LINES` when the human chaser is stunned by the AI gun
   (already chaser-POV; no new pool).
3. Soften `ProfileModal` chaser-mode note from "Play as Chaser test
   complete." to hunt-flavored static copy (e.g. `"Chaser Beta round complete. Flush again?"`).

### C. Mode-boundary correctness (same slice, not creep)

`GameEngine` does not write cookie-backed profiles directly; its shared
callbacks do. Expand the planned badge/token audit into one small callback
boundary in `App.jsx`. When `isChaserMode` is true, do not persist from
`handleSheebsChange`, `handleBadgeEarned`, `handlePickupConsumed`,
`handleDeath`, `handleLevelChange` (highest level), or `handleLevelClear`
(best run). This covers the actual leaks: a positive pickup adds sheebs,
an AI gun hit currently awards sheebs, badge/token collection writes badge
and reward history, and campaign callbacks can write death/progression
state. Keep the transient in-round pickup/gun/stun behavior intact; only
the profile callbacks are muted.

The same audit found one direct **shop-loadout** leak: `GameCanvas` passes
the current profile's speed, stamina, reward, and luck bonuses into every
engine, and `GameEngine.setLoadout()` applies speed/stamina/luck to the
runner. In Chaser Beta that makes the AI runner faster/stronger because of
the human chaser's purchases. At the `GameEngine.setLoadout()` boundary,
use a zeroed loadout when `isChaserMode`; keep normal Runner-mode loadouts
unchanged. This is a fairness correction, not new itemization.

Also update `App.jsx` `handleCaught` (line 354): in Chaser Beta, still set
the result line/card but **do not** `playCaughtAudio()` and **do not** run
the shop-item-strip roll. A tag is a round win, not a runner death. This
also safely applies to the already-present timeout path without redesigning
its clock or loss presentation.

Keep this narrowly scoped to what Ken actually asked for (the gun) plus
helpful/harmful framing, plus the minimum dialog so fire-back and tag
reads as intentional. Do **not** use this slice for FLUSH CLOCK,
timeout-loss lines, full AI bark pools, near-capture flip, Bowl Rush, or
new pickup types.

## Ken decisions still needed (not blockers for this slice)

1. **Future AI item roster:** after gun playtesting, which other items, if
   any, should the runner deliberately seek and actively use? Heavy Plunger
   is a mixed blessing because it slows the fleeing runner and replaces its
   gun; Rod and other actives need their own player-readable counterplay.
   v0.4.69 deliberately makes no decision here.
2. **Existing FLUSH CLOCK:** the 60-second countdown and a timeout
   `onCaught()` path already exist in the code, despite earlier docs calling
   them a recommendation. This plan leaves them untouched. Ken must decide
   after a few rounds whether that pre-existing loss condition stays,
   changes, or is removed before it receives bespoke timeout theater.

## Mode boundary note (for `role-reversal-design.md` §11)

This plan also corrects the design doc's Pickups row, which said "Off in
recovery slice" while the shipped code never enforced that. The row is
being updated to reflect actual, Ken-approved behavior: pickups are **on**
in Chaser Beta, and the AI runner is expected to use the gun. Quest-room
badges, progression badges, and turdstone tokens may remain visually
present, but must have **no profile/economy effect** in Chaser Beta. The
Mode B audit is intentionally complete at the callback boundary: no
sheebs, badges, rewards history, death history, best-run, owned-item, or
highest-level writes; see section C. This is a bounded correctness fix,
not an invitation to hunt unrelated profile leaks. Same for
`handleCaught` audio/item-loss (section C above).

## Explicitly not done in this pass

- No code changes yet.
- No `GAME_ITERATION` bump.
- No deploy.
- No new pickup types, no general AI loadout, and no decision to seek/use
  any active item other than the gun; rolling pickups with `isGood: false`
  are the only currently proven harm-avoidance target.
- No changes to the human-runner (`PLAY AS RUNNER` / campaign) AI or
  pickup logic — this only touches `isChaserMode` behavior.
- No FLUSH CLOCK or timeout-loss redesign: its existing code remains
  untouched pending Ken's decision; no timeout dialog, full reverse bark
  pool, near-capture flip, Bowl Rush, or voice recording.

## Files likely touched (next Mode B session)

- `frontend/src/GameEngine.js` — `_getRunnerEvadeVector()` (gun-first
  seek + flagged rolling-hazard avoidance), a small turn-and-panic-shot
  hook near `_tryFire()`, the opener/win/AI-gun-taunt wire points, and the
  Chaser-Beta zero-loadout guard in `setLoadout()`.
- `frontend/src/App.jsx` — Chaser-Beta guards around the profile-writing
  callback boundary plus `handleCaught` death-sting/item-loss gate.
- `frontend/src/dialog.js` — three new Chaser Beta pools (above).
- `frontend/src/components/ProfileModal.jsx` — one-line note soften.
- `frontend/src/gameContent.js` — no change in this slice; do not repurpose
  `POSITIVE_PICKUPS` into a new AI-loadout taxonomy.
- `docs/role-reversal-design.md` / `docs/dialog_content_chasing.md` —
  already updated this Mode A refine; Mode B only notes what shipped.
- `frontend/e2e/` — one deterministic Chaser-Beta gun test (pickup →
  panic-shot → stunned human chaser, plus a non-`Gotcha` win line) and one
  profile-isolation test that compares the seeded cookie fields before/after
  a Chaser-Beta pickup/gun/tag sequence.

## Workload guardrails (do not overload)

| In | Out |
|---|---|
| Gun-first seek/flagged-hazard avoid + AI `_tryFire` | New pickup types / loadout AI |
| 3 small dialog pools + wire | FLUSH CLOCK / timeout / Rematch redesign |
| Full profile callback boundary + `handleCaught` gate | Full reverse `CHASER_LINES` bark system |
| Reuse `GUN_HIT_LINES` | Voice clips / Audio 2 |
| Two focused Playwright assertions | Bowl Rush / multi-toilet |

## Final Mode A review addendum (Codex / GPT-5, 2026-07-28)

- **Ready verdict:** yes — two sequential, bounded Mode B slices are safer
  than one broad code-monkey prompt.
- **Code correction:** the old "badge/token profile audit" wording missed
  `handleSheebsChange` (positive pickup and AI gun-hit rewards),
  `handlePickupConsumed` (rewards history), and campaign death/progression
  callbacks. Guarding the App callback boundary is smaller and more complete
  than trying to gate every pickup spawn in the engine.
- **Fairness correction:** the profile loadout currently reaches the AI
  runner. Zero it at `setLoadout()` in Chaser Beta so shop purchases never
  make the opponent faster, tougher, or luckier.
- **Fun correction:** a fleeing runner's movement-facing points away from
  the hunter, so an "only fire when the target is ahead" rule could never
  reliably trigger. The planned turn-and-panic-shot makes the counterplay
  visible and fair.
- **Scope correction:** `POSITIVE_PICKUPS` is not an NPC loadout. Gun-only
  seeking plus flagged rolling-hazard avoidance honors Ken's gun feedback
  without accidentally teaching the runner to take Heavy Plunger or an
  unapproved active item.

## Copy-paste: next coding session — Slice A (profile isolation, first)

```text
Mode B, Chaser Beta only. Read docs/skib-sdlc.md, then this handoff §C,
and inspect GameEngine.setLoadout() plus App.jsx's handleCaught,
handleSheebsChange, handleBadgeEarned, handlePickupConsumed, handleDeath,
handleLevelChange, and handleLevelClear.

Implement only this small slice:
1. When isChaserMode, let the round UI still update but prevent those six
   callbacks from persisting sheebs, badges, rewardsHistory, deathsHistory,
   highestLevel, or bestRun. Keep temporary engine pickup/gun/stun effects.
2. In GameEngine.setLoadout(), zero the Chaser-Beta loadout so the AI runner
   cannot inherit the human chaser's shop speed/stamina/reward/luck bonuses;
   do not change Runner-mode loadouts.
3. In handleCaught, do not play the runner capture sting or strip owned
   items in Chaser Beta; preserve the result line/card. Do not alter the
   already-existing FLUSH CLOCK or timeout behavior.
4. Change only the Chaser-Beta ProfileModal note to hunt-flavored copy.
5. Add one deterministic Playwright assertion for both: unchanged seeded
   cookie fields after a Chaser-Beta pickup/gun/tag sequence, and a loaded
   profile producing a zero engine loadout in Chaser Beta. Run
   `cd frontend && npm run build` and that test. Commit this slice, then stop.

Do not start AI steering, dialog pools, timeout work, bark pools, Bowl Rush,
audio recording, or any Runner-mode change in this slice.
```

## Copy-paste: next coding session — Slice B (gun interaction, after A)

```text
Mode B, Chaser Beta only. Read this handoff §§A-B and inspect
GameEngine.js _getRunnerEvadeVector(), _tryFire(), the bullet update, and
the chaser capture branch; inspect dialog.js and dialog_content_chasing.md.

Implement only this small slice:
1. In the far/low-pressure AI branch, seek a gun pickup using existing wall
   probes; bias away from rolling pickups with isGood === false. Do not seek
   every POSITIVE_PICKUPS entry and do not create an item taxonomy.
2. With gun ammo and the human chaser in range, turn the runner toward
   chasers[0], reuse _tryFire()/bullets for one panic-shot, then restore
   normal flee-facing next update. On an actual shot, use the new runner
   gun-taunt pool (detect success from a new bullet, not a changed _tryFire
   return contract). Do not add Rod/Plunger/Shart AI use.
3. Add the three documented 4-line Chaser-Beta pools, random opener and win
   line, and reuse GUN_HIT_LINES. Add one deterministic Playwright test for
   pickup → shot → human-chaser stun and a non-Gotcha win line.
4. Run `cd frontend && npm run build` and the focused tests. Complete the
   Mode B doc trail, version bump, and deploy only after both slices verify.

Do not alter FLUSH CLOCK/timeout, full bark pools, Bowl Rush, voice, or
Runner-mode behavior.
```

## Copy-paste: refine-before-code-monkey (Mode A review agent)

Use this block in a **new planning session** before dispatching
`./scripts/run_code_monkey.sh` or a full Mode B coding agent. Docs only —
do not write code.

```text
Mode A only — skib-sdlc. NO code, NO build, NO GAME_ITERATION bump.

You are reviewing and improving the Chaser Beta v0.4.69 plan before it
goes to a coding / code-monkey session.

Read first, in order:
1. docs/skib-sdlc.md (Mode A rules)
2. docs/role-reversal-design.md (esp. §11 matrix, §13 exit criteria, §15 dialog)
3. docs/handoffs/roadmap-handoff-v0.4.69-plan.md (this plan — extend, do not fork a new version)
4. docs/dialog_content_chasing.md (Chaser Beta section)
5. docs/roadmap.md LT Role Reversal item
6. Spot-check (read only) frontend/src/GameEngine.js isChaserMode capture
   branch + _getRunnerEvadeVector, and App.jsx handleCaught — confirm the
   plan's assumptions still match code.

Your job:
- Tighten dialog candidate lines for funnier, clearer Chaser Beta play
  (opener / AI gun taunt / win). Keep pools small (3–5 lines each).
- Check workload: anything that would overload Mode B (FLUSH CLOCK,
  timeout loss, full bark pool, Bowl Rush, audio recording) must stay
  parked — annotate why, do not pull it in.
- Verify mode-boundary leaks called out in the plan (handleCaught audio +
  item-loss; badge/token profile writes) are still accurate and complete
  enough for a bounded fix.
- Improve the Mode B copy-paste block if unclear; keep it short enough
  for code-monkey / Ollama (very small slices if you split).
- Update trail docs only if you change scope:
  docs/version-log.md, docs/handoffs/ledger.md, docs/update-directions.md,
  docs/roadmap.md as needed. Append, do not rewrite history.
- Flag anything that still needs Ken's explicit decision (do not invent
  answers as settled).

Deliverable: refined docs + a short "ready for Mode B / not ready"
verdict at the top of the handoff Status line. Commit docs when done.
```
