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

- No `GameEngine.js` or `App.jsx` changes — all four items are
  plan-only, per explicit user instruction this session.
- No `MAX_CHASERS` change, no per-chaser speed-ramp logic, no
  video-trigger fix, no new video asset added.
- No decision was made on the `MAX_CHASERS`/clear-condition ambiguity
  (item 2) or the jump-scare-vs-new-clip question (item 4) — both need a
  one-line answer from the user before a coding session should start on
  them.
- No prod deploy — none was requested, and none should happen until the
  user asks.

## Copy-paste: next natural steps for the next agent

```
Read docs/skib-sdlc.md, then docs/update-directions.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.2-plan.md) — the previous session
was docs/plan-only, so there's no new code to catch up on beyond v0.4.0.
Four items are queued in docs/roadmap.md's "Incremental backlog," all
added this session:

1. Lvl2 transition video timing fix — App.jsx:156-166
   (handleLevelChange) currently shows the video on *arriving* at
   Pipeworks (index === 2) instead of on *clearing* it. Move the trigger
   to fire once Pipeworks is actually cleared instead. No new assets
   needed, no blockers — start here first.

2. Pipeworks clear condition tied to 4 simultaneous chasers — BLOCKED
   on a one-line product decision from the user first. Today level
   advancement is purely `levelSkreems >= advanceAt`
   (GameEngine.js:762), unrelated to chaser count, and MAX_CHASERS is 3
   (GameEngine.js:301). Ask the user: should MAX_CHASERS become 4
   globally, or should Pipeworks specifically require surviving 4
   chasers as its clear condition (separate from the skreem timer)? Do
   not guess — this changes core level pacing.

3. Extra-chaser speed ramp — _maybeSpawnExtraChaser()
   (GameEngine.js:779-802) spawns each new chaser at a flat
   baseSpeed * 0.92 forever. Add a per-chaser ramp (e.g. climbs from
   ~0.75 to 1.0 over a few seconds after spawn) layered on top of the
   existing chaserSpeedMod rubber-band (GameEngine.js:310-313), not
   replacing it. Self-contained, no blockers.

4. Death-video confirmation — BLOCKED on a one-line answer from the
   user first. No "player ded" video has ever existed in this repo
   (verified via git log --all) — the only death feedback is the
   canvas jump-scare (_drawJumpscare(), fires on phase === 'caught').
   Ask the user: do they mean (a) just make sure the existing
   jump-scare still fires and isn't visually blocked by the lvl2 video
   overlay (App.jsx:281-291 stacks a <video> on top of GameCanvas), or
   (b) add a genuinely new, separate death-video clip the same way
   lvl2-transition.mp4 was wired? Don't build new video plumbing
   without that answer.

Item 1 and 3 can start immediately. Items 2 and 4 need a quick answer
from the user first — ask before writing code for those two. Follow
docs/skib-sdlc.md: build (npm run build), test, update
docs/version-log.md + docs/update-directions.md + docs/roadmap.md + a
new docs/handoffs/roadmap-handoff-vX.Y.Z.md + ledger entry, then commit.
Only bump GAME_ITERATION and run ./scripts/deploy-static.sh <short-name>
if the user asks to publish — no prod deploy without that ask.
```
