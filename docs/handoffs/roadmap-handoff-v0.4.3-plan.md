# Roadmap Handoff — v0.4.3-plan (docs-only)

**Session date:** 2026-07-26
**Previous version:** v0.4.2-plan (see
`docs/handoffs/roadmap-handoff-v0.4.2-plan.md`); no code has shipped since
v0.4.0. The chaser-face-randomization fix that v0.4.2-plan found and
committed is confirmed still landed and correct — re-verified in this
session (see below).

This session was explicitly docs/plan-only per the user's instruction —
no code changed, no build was run, `GAME_ITERATION` stays `v0.4.0`. It
firms up two of the four items v0.4.2-plan queued (the two that were
already unblocked) into concrete, ready-to-type implementation plans, so
the next coding session doesn't have to re-derive the design.

## Tight three-session order

The backlog is now documented as a three-session sequence so the next
agent can keep each pass small and land one increment at a time:

1. Extra-chaser speed ramp.
2. Pipeworks's 4-chaser/max-speed clear condition.
3. Lvl2 video timing fix, then a quick death-visual verification that
   the jump-scare still shows unobstructed.

## What this session did

1. **Re-verified the chaser-face-randomization fix is live.** The user's
   original ask this session was framed as "make the chaser face
   randomization fix," but that item already shipped in commit `6c388a6`
   ("Land found chaser-face fix") and is checked off in
   `docs/roadmap.md`. Confirmed directly in the current source:
   `frontend/src/GameEngine.js:801` —
   `face: randomFrom(CHASER_FACE_POOL)?.src ?? this.chaser.face` inside
   `_maybeSpawnExtraChaser()`. The lead chaser's face (`setFaces()`,
   menu-selected/uploaded/default) is untouched. Nothing further to do
   here — flagged to the user, who redirected this session to plan the
   next two items instead.

2. **Planned the lvl2-video timing fix in full.** Root cause (confirmed
   by v0.4.2-plan, re-read this session): `App.jsx:156-166`
   (`handleLevelChange`) fires `setShowLvl2Transition(true)` when
   `index === 2`, but `index` is the *arrival* index —
   `GameEngine.onLevelChange` reports it via `{ index: this.levelIndex + 1,
   ... }` at `GameEngine.js:657-662`, called the moment a new level's
   state resets. So `index === 2` means "just arrived at Pipeworks,"
   i.e. right after *Level 1* was cleared — one level too early.

   The engine already has a separate, better-timed hook for this:
   `onLevelClear()` (`GameEngine.js:685`), called from
   `_startLevelAdvance()` at the moment a level is confirmed cleared,
   *before* `this.levelIndex` advances — so `this.level` inside that call
   still refers to the level just cleared. Today it's called with no
   arguments and only wired to a one-shot audio sting
   (`handleLevelClear` in `App.jsx:112`, wired at `App.jsx:279`).

   **Concrete plan:**
   - In `GameEngine.js:685`, change `this.onLevelClear()` to
     `this.onLevelClear({ index: this.levelIndex + 1, name: this.level.name })`
     — this identifies *which* level was just cleared (1-based, matching
     the existing `onLevelChange` index convention).
   - In `App.jsx:112`, change `handleLevelClear` from
     `() => playOneShot(levelClearUrl, 0.4)` to accept that payload,
     keep the existing audio call, and add
     `if (index === 2) setShowLvl2Transition(true)` (index 2 = Pipeworks,
     the level being cleared — this now fires on *clearing* Pipeworks,
     triggering the transition into Level 3/Flooded Annex, matching the
     user's original report).
   - In `App.jsx:165`, delete the old
     `if (index === 2) setShowLvl2Transition(true)` line from
     `handleLevelChange` — that's the arrival-based trigger being
     replaced.
   - No new assets, no `GameEngine` constructor/option signature change
     (the `onLevelClear` hook already exists, just needs to carry data).
   - Verify by playing to the end of Pipeworks and confirming the video
     now overlays the Pipeworks→Flooded Annex transition, not the
     Palace→Pipeworks one.

3. **Planned the extra-chaser speed-ramp fix in full.** Root cause
   (confirmed by v0.4.2-plan, re-read this session):
   `_maybeSpawnExtraChaser()` (`GameEngine.js:780-803`) sets each newly
   pushed chaser's `baseSpeed` to a flat `this.chaser.baseSpeed * 0.92`
   at spawn time — no field tracks time-since-spawn, so that 0.92
   discount never changes for that chaser's remaining lifetime. The
   existing `chaserSpeedMod` rubber-band (`GameEngine.js:311-314`,
   applied at `GameEngine.js:746`:
   `chaser.baseSpeed * this.chaserSpeedMod`) ramps *all* chasers together
   across level-clears/deaths — it's a run-level knob, not a per-chaser
   join-time one, so it doesn't give a fresh extra chaser its own
   within-level ramp-up.

   **Concrete plan (design decisions made this session so the next
   session doesn't have to re-litigate them):**
   - Add two tuning constants near `CHASER_SPEED_MOD_*`
     (`GameEngine.js:311-314`):
     `CHASER_JOIN_RAMP_START = 0.7` (extra chaser's speed fraction the
     instant it joins, relative to its own `baseSpeed`) and
     `CHASER_JOIN_RAMP_SECONDS = 5` (how long it takes to reach 1.0×
     after joining). These are separate from the existing flat `0.92`
     spawn discount, which this plan replaces — the new chaser starts
     *slower* than today's 0.92 (giving the player a real adjustment
     window right after a new toilet appears) and then climbs to full
     `baseSpeed` instead of staying discounted forever.
   - In `_maybeSpawnExtraChaser()` (`GameEngine.js:794-802`), drop the
     `baseSpeed: this.chaser.baseSpeed * 0.92` line's `* 0.92` (use the
     lead chaser's full `baseSpeed`) and add a new field on the pushed
     chaser object: `joinRamp: 0` (0 = just joined, 1 = fully ramped).
     The lead chaser (`this.chaser`, pushed into `this.chasers` at
     construction/reset, e.g. `GameEngine.js:645`) never gets a
     `joinRamp` field, so reads of it must default to `1` (fully ramped,
     unaffected) via `chaser.joinRamp ?? 1`.
   - In the chase-update loop (`GameEngine.js:742-750`, the
     `for (const chaser of this.chasers)` block), before computing
     `chaserSpeed`:
     - If `chaser.joinRamp !== undefined && chaser.joinRamp < 1`, advance
       it: `chaser.joinRamp = Math.min(1, chaser.joinRamp + dt / CHASER_JOIN_RAMP_SECONDS)`.
     - Compute the per-chaser join multiplier:
       `const joinMod = chaser.joinRamp === undefined ? 1 : lerp(CHASER_JOIN_RAMP_START, 1, chaser.joinRamp)`
       (add a tiny `lerp(a, b, t) => a + (b - a) * t` helper near the
       existing `clamp()` utility if one doesn't already exist — check
       first).
     - Change `const chaserSpeed = chaser.baseSpeed * this.chaserSpeedMod`
       to `const chaserSpeed = chaser.baseSpeed * this.chaserSpeedMod * joinMod`.
   - This layers the join-ramp *on top of* the existing `chaserSpeedMod`
     rubber-band (multiplicative), not replacing it, per the original
     ask.
   - Verify by surviving long enough for a second/third chaser to spawn
     and confirming (by eye, or a temporary console.log of `joinMod`)
     that a freshly joined chaser visibly lags for ~5s before matching
     the pack's speed.

## Verification performed

- No code changed, so no build was run.
- Re-read `frontend/src/GameEngine.js` and `frontend/src/App.jsx` at
  their current line numbers directly (not from v0.4.2-plan's memory) to
  confirm every file/line reference above is still accurate as of this
  session — none had drifted since v0.4.2-plan.
- Confirmed via `git log --oneline` that `6c388a6` (the chaser-face fix
  commit) is the tip's parent-of-parent and nothing has reverted it.

## What's explicitly not done

- No `GameEngine.js` or `App.jsx` changes — both plans above are
  plan-only, per explicit user instruction this session.
- No `GAME_ITERATION` bump, no build, no deploy.

## Addendum — the other two v0.4.2-plan items got resolved concurrently

While this session was in progress, the two items this write-up
originally treated as "still blocked" (Pipeworks's 4-simultaneous-chaser
clear condition, and the death-video confirmation) were resolved
directly in `docs/roadmap.md` and `docs/next-agent-coding-brief.md` —
found already updated on disk, not this session's own work. For the
record, since it changes the dependency order of everything queued:

- **Pipeworks clear condition — RESOLVED.** User confirmed: "YES. for XX
  amount of SKREEM points and max speed of the chasers." `MAX_CHASERS`
  goes `3` → `4`; Pipeworks's clear condition becomes "all 4 chasers
  active and each at its own max speed" gating a separate skreem
  counter, not the plain `advanceAt` timer. This **depends on** the
  speed-ramp item in this doc (needs a per-chaser "finished ramping"
  signal), and it **redefines** what "Pipeworks cleared" means for the
  lvl2-video item in this doc.
- **Death-video — RESOLVED.** User confirmed: "my bad the ded is still
  the original" — no new death clip, the existing `_drawJumpscare()` is
  and stays the only death feedback. Only a verification step remains
  (confirm it can't be visually blocked by the lvl2 `<video>` overlay).

`docs/next-agent-coding-brief.md` now has the concise three-session
sequence (speed-ramp → clear-condition → video-timing / death-visual
verification) reflecting all of this — treat it, not any older copy, as
the canonical next-steps brief. The copy-paste block below mirrors that
same order for a new agent starting cold.

## Copy-paste: next natural steps for the next agent

```
Read docs/skib-sdlc.md, then docs/update-directions.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.3-plan.md). The backlog is now
documented as a three-session sequence — keep each session to one
increment, and commit before stopping:

1. Session 1: extra-chaser speed ramp.
   - GameEngine.js:780-803 — replace the flat `baseSpeed * 0.92`
     discount with a per-chaser `joinRamp` that starts near 0.7 and
     rises to 1.0 over a few seconds, layered on top of the existing
     `chaserSpeedMod` rubber-band.
   - Verify: survive long enough for a second/third chaser to spawn and
     confirm the fresh one visibly lags before matching the pack.

2. Session 2: Pipeworks clear condition.
   - GameEngine.js:301 and 762 — bump `MAX_CHASERS` to 4, then make
     Pipeworks only advance once all four chasers are active and fully
     ramped, with a separate skreem gate/goal for the "4-up, all maxed"
     state.
   - Verify: clear Pipeworks only after the 4-chaser/max-speed gate is
     satisfied; other levels should keep their current behavior.

3. Session 3: lvl2 timing fix + death-visual verification.
   - App.jsx:156-166 and GameEngine.js:685 — move the lvl2 transition
     trigger off arrival and onto the Pipeworks clear event.
   - Verify: the clip now plays on the Pipeworks -> Flooded Annex
     transition, then confirm the original jump-scare still shows
     unobstructed and no new death clip was introduced.

Each session stays front-end only and keeps the existing cookie
persistence, face randomization, and deployment rules intact. Follow
docs/skib-sdlc.md: build (`cd frontend && npm run build`), drive the
canvas per docs/dev-notes.md if you need to verify interaction, update
docs/version-log.md + docs/update-directions.md + docs/roadmap.md + a
new docs/handoffs/roadmap-handoff-vX.Y.Z.md + ledger entry, then commit.
Only bump `GAME_ITERATION` and run `./scripts/deploy-static.sh <short-name>`
if the user explicitly asks to publish.
```
