# Roadmap Handoff — v0.4.2-plan (docs-only)

**Session date:** 2026-07-26
**Previous version:** v0.4.1-plan (see
`docs/handoffs/roadmap-handoff-v0.4.1-plan.md`); no code has shipped
since v0.4.0.

This session was explicitly docs/plan-only, per the user's direct
instruction ("no code yet") — no code changed, no build was run,
`GAME_ITERATION` stays `v0.4.0`. It exists so a future coding session can
pick up four scoped items — three gameplay-feel bugs the user hit while
playing, plus a docs cleanup — without re-deriving the investigation.

## What this session did

1. **Investigated the lvl2 transition video timing bug.** User report:
   "the video shouldn't play until after lvl2 is won." Confirmed the
   cause: `App.jsx:156-166` (`handleLevelChange`) fires
   `setShowLvl2Transition(true)` when `index === 2`, which is the
   *arrival* index `GameEngine.onLevelChange` reports the moment the
   runner reaches Pipeworks — i.e. right after Level 1 is cleared, not
   after Pipeworks itself is cleared. Wrote this up as a roadmap item
   with the fix direction (move the trigger onto a level-*clear* signal
   for Pipeworks specifically, not the arrival index).
2. **Investigated the "outrun 4 skibs" gating request.** User report:
   "lvl2 only happens when player is able to outrun 4 skibs." Today,
   every level (Pipeworks included) advances purely on
   `levelSkreems >= level.advanceAt` (`GameEngine.js:762`) — chaser count
   is unrelated to level clearing, and `MAX_CHASERS` is currently `3`
   (`GameEngine.js:301`), not 4. This is a real design ambiguity, not
   just a missing constant bump: written up as a roadmap item flagging
   two possible directions (bump `MAX_CHASERS` globally to 4, vs. add a
   per-level chaser-count clear condition specific to Pipeworks) and
   noting it should be confirmed with the user before coding, since it
   changes core level-pacing.
3. **Investigated the multi-chaser speed-ramp request.** User report:
   "multiple skibs run a bit slower as they are added but speed up as
   game play progresses." Confirmed `_maybeSpawnExtraChaser()`
   (`GameEngine.js:779-802`) spawns each new chaser at a flat
   `baseSpeed * 0.92` that never changes for that chaser afterward — the
   existing `chaserSpeedMod` rubber-band (`GameEngine.js:310-313`) ramps
   all chasers together across the whole *run* (level-clears/deaths),
   but doesn't give a newly-spawned extra its own within-level ramp.
   Wrote this up with a suggested approach: a small per-chaser
   spawn-relative multiplier climbing from ~0.7-0.8 toward 1.0 over a
   few seconds, layered on top of (not replacing) `chaserSpeedMod`.
4. **Investigated the "player ded" video request.** User report: "the
   old player ded should be played [on death] ... can we get this back
   into the play," implying restored functionality. Ran `git log --all`
   across the full history (including diffs for any `*.mp4`/`*ded*`
   paths) and found no such video ever existed in this repo — the only
   death feedback is the canvas-drawn jump-scare zoom
   (`_drawJumpscare()`, fires whenever `phase === 'caught'`). Wrote this
   up as needing user confirmation on intent: (a) keep the existing
   jump-scare firing unobstructed on every capture (already does, but
   flagged a real risk — the lvl2 `<video>` overlay in `App.jsx:281-291`
   is absolutely positioned on top of `GameCanvas` and could visually
   block the jump-scare if a capture and the lvl2 transition ever
   overlapped), or (b) add a genuinely new, separate death-specific
   video clip using the same asset-drop pattern as `lvl2-transition.mp4`.
   Did not build either without that confirmation.
5. **Character/image asset check.** Diffed every file in `images/`
   against what's referenced from `frontend/src/gameContent.js` or
   `docs/`. Found eight more raw phone photos
   (`images/PXL_20250824_213716870.jpg` through
   `images/PXL_20250824_213836255.NIGHT.jpg`) sitting in the scratch
   folder, same 554×984 crop as other chaser/runner sources, not
   referenced or named for any role. Documented them in
   `docs/characters.md` with the same "ask the user which role before
   wiring" note already used for Sky-Diver and the second Yoodeling Unc
   pose — did not guess roles or rename files.
6. **Rewrote `docs/next-agent-coding-brief.md`.** It was stale (referred
   to "three levels are already wired up," a v0.2-era fact — the game
   has had five levels since v0.3.0) and generic. Replaced it with a
   brief scoped concretely to the four items above, each with exact
   files/lines and the open questions a coding agent needs answered
   before starting item 2 and (possibly) item 4.

## Follow-up (same session, continued): both open decisions resolved

After the writeup above, the user answered both blocking questions
directly:

- **Pipeworks clear condition (item 2):** "YES. for XX amount of SKREEM
  points and max speed of the chasers." Confirmed design: bump
  `MAX_CHASERS` from 3 to 4, and change Pipeworks's clear condition so it
  only counts toward advancing once all 4 chasers are active *and* each
  is at its own max speed (lead chaser's `chaserSpeedMod` at
  `CHASER_SPEED_MOD_MAX`, extras' per-spawn ramp — see item 3 below —
  finished climbing to 1.0), gated by a skreem threshold earned during
  that "4-up, all maxed" state specifically (not just reusing
  `levelSkreems` as-is). The exact threshold number is left as a tunable
  constant, not fixed by this plan. Written up in full in
  `docs/roadmap.md` (now marked `RESOLVED`).
- **Death video (item 4):** "my bad the ded is still the original." No
  new video is wanted — the existing canvas jump-scare
  (`_drawJumpscare()`) stays as the only death feedback. The only
  remaining task is verifying it isn't visually blocked by the lvl2
  overlay once item 1's timing fix lands; no new asset or plumbing.
  Written up in full in `docs/roadmap.md` (now marked `RESOLVED`).

Both items in `docs/roadmap.md` are now unblocked for a coding session.
Item 2 (the 4-chaser/max-speed clear condition) now explicitly depends
on item 3 (the per-chaser speed ramp) landing first, since "max speed"
needs to be a checkable state on each chaser.

## Verification performed

- No code changed, so no build was run.
- Verified every file/line reference above by reading the current
  `frontend/src/App.jsx` and `frontend/src/GameEngine.js` directly (not
  from memory of older sessions).
- Ran `git log --all --oneline` and `git log --all -p` filtered on
  `*.mp4`/`*ded*` paths to confirm no death-video asset or wiring has
  ever existed in this repo, rather than assuming from the user's
  phrasing.
- Diffed `images/` contents against `grep` hits in `frontend/src/` and
  `docs/` to find the eight unreferenced raw photos.

## What's explicitly not done

- No `GameEngine.js` or `App.jsx` changes — all items stay plan-only,
  per explicit user instruction this session ("no code yet" / "wrap up
  this plan"). The one exception is the pre-existing chaser-face fix
  found already-written and committed (see the version-log entry above),
  which was not new work from this session.
- No `MAX_CHASERS` change, no per-chaser speed-ramp logic, no
  video-trigger fix, no new video asset added.
- No prod deploy — none was requested, and none should happen until the
  user asks.
- All four backlog items are now fully unblocked for the next coding
  session — both decisions the user needed to make (items 2 and 4) were
  resolved in this same session (see "Follow-up" above).

## Copy-paste: next natural steps for the next agent

```
Read docs/skib-sdlc.md, then docs/update-directions.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.2-plan.md) — the previous session
was docs/plan-only, so there's no new code to catch up on beyond v0.4.0
plus the one already-committed chaser-face fix. Four items are queued
in docs/roadmap.md's "Incremental backlog," all fully unblocked — the
user has answered every open design question, so a coding session can
start on any of them without asking anything further. Recommended order:

1. Extra-chaser speed ramp — _maybeSpawnExtraChaser()
   (GameEngine.js:779-802) spawns each new chaser at a flat
   baseSpeed * 0.92 forever. Add a per-chaser ramp (e.g. climbs from
   ~0.75 to 1.0 over a few seconds after spawn) layered on top of the
   existing chaserSpeedMod rubber-band (GameEngine.js:310-313), not
   replacing it, and expose a way to check "has this chaser finished
   ramping to max speed" (item 2 depends on this state). Do this first
   since item 2 needs it.

2. Pipeworks clear condition tied to 4 simultaneous chasers at max
   speed, gated by a skreem threshold — RESOLVED design, ready to code.
   User confirmed: bump MAX_CHASERS from 3 to 4 (GameEngine.js:301), and
   change Pipeworks's clear condition (advanceAt: 68, GameEngine.js:762)
   so it only counts once all 4 chasers are active and each has reached
   its own max speed (lead chaser's chaserSpeedMod at
   CHASER_SPEED_MOD_MAX, every extra chaser's spawn-ramp from item 1
   finished). Only skreems earned during that "4-up, all maxed" state
   should count toward the threshold — track it as a separate
   counter/gate rather than reusing levelSkreems outright. The exact
   skreem-goal number is a tunable constant, not fixed by this plan —
   pick something near the existing advanceAt: 68 and playtest/adjust;
   name it clearly (e.g. a new per-level field or
   PIPEWORKS_MAX_PRESSURE_SKREEM_GOAL) so it's easy to retune later.
   Depends on item 1 landing first.

3. Lvl2 transition video timing fix — App.jsx:156-166
   (handleLevelChange) currently shows the video on *arriving* at
   Pipeworks (index === 2) instead of on *clearing* it. Once item 2
   redefines what "cleared Pipeworks" means, move the video trigger onto
   that new clear event instead of the arrival index. No new assets
   needed.

4. Death-visual verification — RESOLVED, no new asset wanted. User
   confirmed the original canvas jump-scare (_drawJumpscare(), fires on
   phase === 'caught') is correct and should stay as the only death
   feedback — don't add a new video. Once item 3 lands, just verify the
   jump-scare can't be visually blocked by the lvl2 <video> overlay
   (App.jsx:281-291, absolutely positioned on top of GameCanvas) — if
   the two states genuinely can't overlap, there's likely nothing left
   to change here beyond confirming it.

Do these as one session if they fit together cleanly (1→2→3 are a single
connected mechanic), or split across sessions per docs/skib-sdlc.md's
single-session sizing guidance — just don't land 2 or 3 without 1's
ramp-state already in place. Follow docs/skib-sdlc.md: build
(npm run build), test, update docs/version-log.md +
docs/update-directions.md + docs/roadmap.md + a new
docs/handoffs/roadmap-handoff-vX.Y.Z.md + ledger entry, then commit.
Only bump GAME_ITERATION and run ./scripts/deploy-static.sh <short-name>
if the user asks to publish — no prod deploy without that ask.
```
