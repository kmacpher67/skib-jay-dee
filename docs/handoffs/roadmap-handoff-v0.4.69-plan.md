# Roadmap Handoff Plan v0.4.69 — Chaser Beta: Runner AI Item Use (+ light dialog)

**Created by:** Claude Sonnet 5 — 2026-07-28
**Last updated by:** Cursor Grok 4.5 — 2026-07-28
**Session mode:** Mode A (Planning / refinement only — docs only, no code,
no build, `GAME_ITERATION` not bumped)
**Status:** Design decision recorded, scope bounded. Code-ready for the
next Mode B session once a refine-pass agent (or Ken) signs off the
dialog candidate lines below. Heavy-plunger default still proposed, not
blocking.
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
4. **A helpful/harmful classification already exists and is reusable.**
   `gameContent.js` exports `POSITIVE_PICKUPS` (`gun`, `schleimy-potion`,
   `taco-bell`, `gawd-particle`, `decoy`, `heavy-plunger`, …) and
   `GameEngine.js`'s `onPickupConsumed()` call already buckets every
   pickup into `'good'` vs `'bad'` for telemetry using that same list.
   This is the natural source of truth for "helpful vs. harmful" from the
   runner's point of view — no new taxonomy needed, just a decision on
   whether it needs runner-specific tweaks (see open question below).
5. **(Refine 2026-07-28)** Dialog/theater is still runner-centric. Tag win
   uses hardcoded `'Gotcha! Round over.'`; `App.jsx` `handleCaught` still
   plays the runner death sting and can strip shop items even on a Chaser
   Beta tag. Rematch/Menu already exist on `ProfileModal` for chaser mode
   — do not rebuild that card. Light dialog pools + gating the death path
   make the win feel like a hunt, not a runner death.

## Decision for this slice

Ken's playtest supersedes the earlier "pickups off in recovery slice"
call. Pickups **stay on** in Chaser Beta (removing them now would be a
regression from what Ken just played and liked enough to keep testing),
but the AI runner needs to actually *engage* with them instead of
ignoring them. Primary work, plus a light dialog add-on that fits the
same Mode B session without inventing the full arcade loop:

### A. AI pickup awareness + fire-back (primary)

1. **Give the AI runner pickup awareness — seek helpful, avoid harmful.**
   Extend `_getRunnerEvadeVector()` (or a small sibling helper it calls)
   so that, when not under immediate flee pressure (i.e. the existing
   "far" branch, `minDist > 250`), the runner steers toward the nearest
   pickup in `POSITIVE_PICKUPS` instead of only the map-center waypoint.
   When a pickup is *not* in `POSITIVE_PICKUPS` (i.e. would land in the
   `'bad'` bucket `onPickupConsumed()` already computes), the same
   steering should bias away from it the way it already biases away from
   walls, using the existing wall-probe steering shape rather than a new
   system.
2. **Give the AI runner offensive item use.** Once the runner is holding
   a usable item that has an active/fire action (gun ammo > 0 today; keep
   the hook generic enough that a future item — e.g. a Kill Fart charge —
   can plug into the same decision point later), fire it at the pursuing
   human chaser under the same conditions a human player would use the
   fire button: chaser within a reasonable range and roughly in front of
   the runner's facing direction. Reuse the existing `_tryFire()` /
   bullet path — do not invent a second projectile system for AI use.

### B. Light dialog theater (add-on — keep small)

Fits because it is mostly new arrays in `dialog.js` plus three wire
points that sit next to work already in this slice. See
[`role-reversal-design.md` §15](../role-reversal-design.md) and
[`dialog_content_chasing.md`](../dialog_content_chasing.md).

1. Add pools to `frontend/src/dialog.js` (mirror in dialog doc):
   - `CHASER_BETA_OPENER_LINES` — set `bannerText` (or a short toast) when
     Chaser Beta chase starts.
   - `CHASER_BETA_RUNNER_GUN_TAUNTS` — speech bubble on the AI runner when
     AI `_tryFire()` succeeds.
   - `CHASER_BETA_WIN_LINES` — replace hardcoded `'Gotcha! Round over.'`
     in the chaser-mode capture branch.
2. Reuse `GUN_HIT_LINES` when the human chaser is stunned by the AI gun
   (already chaser-POV; no new pool).
3. Soften `ProfileModal` chaser-mode note from "Play as Chaser test
   complete." to hunt-flavored static copy (one string is enough).

### C. Mode-boundary correctness (same slice, not creep)

Expand the planned badge/token profile audit to also cover
`App.jsx` `handleCaught`: when `isChaserMode`, **do not**
`playCaughtAudio()` and **do not** run the shop-item-strip roll. A Chaser
Beta tag is a round win, not a runner death.

Keep this narrowly scoped to what Ken actually asked for (the gun) plus
helpful/harmful framing, plus the minimum dialog so fire-back and tag
reads as intentional. Do **not** use this slice for FLUSH CLOCK,
timeout-loss lines, full AI bark pools, near-capture flip, Bowl Rush, or
new pickup types.

## Open question for Ken (has a proposed default — not blocking)

`heavy-plunger` is listed in `POSITIVE_PICKUPS` (offensive knockback
tool) even though picking it up also imposes a `-30%` movement-speed
penalty while held — a mixed blessing for a fleeing runner in a way it
isn't for the human runner in campaign mode (who can also choose not to
pick it up). **Proposed default:** treat `POSITIVE_PICKUPS` as-is for the
"seek" bias (reuse the existing list verbatim, no runner-specific carve
-out) for this first slice, and revisit only if playtesting shows the AI
runner grabbing the plunger and then dying because it's slowed. Flag this
explicitly in the shipped handoff either way so it's not silently
decided.

## Mode boundary note (for `role-reversal-design.md` §11)

This plan also corrects the design doc's Pickups row, which said "Off in
recovery slice" while the shipped code never enforced that. The row is
being updated to reflect actual, Ken-approved behavior: pickups are **on**
in Chaser Beta, and the AI runner is expected to use them. Quest-room
badges, progression badges, and turdstone tokens are cosmetically present
but should have **no profile/economy effect** in Chaser Beta (the
mode-boundary rule that *does* still hold — no sheebs, no badges granted,
no `deathsHistory`/`highestLevel` writes). If any of those spawn calls
are found to be writing profile state in Chaser Beta during the Mode B
session, that's an in-scope bug fix for this same slice (it would be a
correctness gap, not new scope) — but do not go looking for unrelated
profile leaks beyond what's needed to confirm this. Same for
`handleCaught` audio/item-loss (section C above).

## Explicitly not done in this pass

- No code changes yet.
- No `GAME_ITERATION` bump.
- No deploy.
- No new pickup types, no AI itemization strategy beyond "use the gun,
  route around obviously bad pickups."
- No changes to the human-runner (`PLAY AS RUNNER` / campaign) AI or
  pickup logic — this only touches `isChaserMode` behavior.
- No resolution of the `heavy-plunger` mixed-blessing question beyond the
  proposed default above.
- No FLUSH CLOCK, timeout-loss dialog, full reverse bark pool, near-
  capture flip, Bowl Rush, or voice recording.

## Files likely touched (next Mode B session)

- `frontend/src/GameEngine.js` — `_getRunnerEvadeVector()` (pickup
  seek/avoid steering), a new small AI-fire decision hook near the
  existing `_tryFire()` call site, chaser-win line pool, opener banner,
  AI gun-taunt bubble, and a `isChaserMode` guard audit on
  any badge/token spawn or collection path found to be writing profile
  state.
- `frontend/src/App.jsx` — gate `handleCaught` death-sting + item-loss
  when `isChaserMode`.
- `frontend/src/dialog.js` — three new Chaser Beta pools (above).
- `frontend/src/components/ProfileModal.jsx` — one-line note soften.
- `frontend/src/gameContent.js` — only if the open question above comes
  back with a runner-specific carve-out; otherwise no change needed here.
- `docs/role-reversal-design.md` / `docs/dialog_content_chasing.md` —
  already updated this Mode A refine; Mode B only notes what shipped.
- `frontend/e2e/` — a focused Chaser Beta test that seeds a gun pickup
  near the AI runner and asserts it fires at least once at the human
  chaser within a bounded time window, plus a harmful-pickup-avoidance
  check if that's feasible to assert deterministically. Optional soft
  assert: chaser-win captureLine is not the old hardcoded Gotcha string.

## Workload guardrails (do not overload)

| In | Out |
|---|---|
| Seek/avoid + AI `_tryFire` | New pickup types / loadout AI |
| 3 small dialog pools + wire | FLUSH CLOCK / timeout / Rematch redesign |
| `handleCaught` gate + badge audit | Full reverse `CHASER_LINES` bark system |
| Reuse `GUN_HIT_LINES` | Voice clips / Audio 2 |
| Playwright gun-fire assert | Bowl Rush / multi-toilet |

## Copy-paste: next coding session

```text
Read docs/skib-sdlc.md, then docs/role-reversal-design.md (§11, §13, §15),
then this file (docs/handoffs/roadmap-handoff-v0.4.69-plan.md), then
docs/dialog_content_chasing.md (Chaser Beta section), then inspect
_getRunnerEvadeVector(), _maybeSpawnGunPickup(), the pickup-collision/
onPickupConsumed() path, the isChaserMode capture branch, and App.jsx
handleCaught in frontend/src/.

Implement Chaser Beta runner item use + light dialog (Chaser Beta only):

1. Extend _getRunnerEvadeVector() so that when the runner is not under
   immediate flee pressure (the existing minDist > 250 branch), it steers
   toward the nearest pickup whose type is in POSITIVE_PICKUPS
   (gameContent.js), reusing the existing wall-probe steering shape
   rather than a new system. Bias away from non-POSITIVE_PICKUPS pickups
   the same way.
2. Add an AI-fire decision: when isChaserMode is true, the runner is
   holding gun ammo, and the human chaser (chasers[0]) is within firing
   range and roughly ahead of the runner's facing direction, trigger the
   same fire path a human player's fire button uses (reuse _tryFire() /
   the bullet system — do not build a second projectile path). On a
   successful AI fire, show a speech bubble from
   CHASER_BETA_RUNNER_GUN_TAUNTS (new pool in dialog.js).
3. Add CHASER_BETA_OPENER_LINES and set banner/toast at Chaser Beta chase
   start. Replace hardcoded 'Gotcha! Round over.' with a random
   CHASER_BETA_WIN_LINES entry. Soften ProfileModal chaser-mode note.
   Reuse GUN_HIT_LINES when the human chaser is gun-stunned.
4. Audit _syncLevelState()'s badge/token spawn/collection paths AND
   App.jsx handleCaught: when isChaserMode, gate profile/economy writes,
   do not playCaughtAudio(), and do not strip shop items. In-scope bug
   fix per this handoff, not new scope creep.
5. Leave the heavy-plunger POSITIVE_PICKUPS classification as-is (Ken's
   proposed default in this handoff) unless Ken has since said otherwise.
6. Add a focused Playwright test: seed a gun pickup near the AI runner in
   Chaser Beta, run the loop forward, assert the runner fires it at the
   human chaser within a bounded time window.
7. Verify with cd frontend && npm run build and npx playwright test.
8. Update docs/version-log.md, docs/handoffs/ledger.md,
   docs/update-directions.md, docs/roadmap.md, and this handoff's shipped
   twin (roadmap-handoff-v0.4.69.md) per docs/skib-sdlc.md step 4. Bump
   GAME_ITERATION and deploy only once verified.

Do not expand into new pickup types, AI itemization strategy,
FLUSH CLOCK / timeout dialog, full reverse bark pools, Bowl Rush, voice
clips, or human-runner (campaign) AI changes. Chaser Beta only.
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
