# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

Copy and paste the block below into the next coding agent session. This
brief is scoped to the four items queued in the v0.4.2-plan session
(docs-only, 2026-07-26) — see
`docs/handoffs/roadmap-handoff-v0.4.2-plan.md` for the full
investigation behind each one.

---

You're continuing work on **Skib-Jay-Dee-Toilet** in
`/mnt/data/projects/skib-jay-dee`. The last session was docs/plan-only —
no code has changed since v0.4.0. Follow `docs/skib-sdlc.md`'s process
(read the docs it lists, work in single-session increments, build +
verify, update the docs, commit before stopping).

Read first:

1. `docs/skib-sdlc.md`
2. `docs/update-directions.md`
3. `docs/handoffs/roadmap-handoff-v0.4.2-plan.md` (the investigation
   behind every item below)
4. `frontend/src/App.jsx`
5. `frontend/src/GameEngine.js`

Four items, in priority order (1 and 3 are unblocked; 2 and 4 need a
quick answer from the user first — ask before writing code for those
two):

## 1. Fix lvl2 transition video timing (unblocked, do this first)

`App.jsx:156-166` (`handleLevelChange`) fires
`setShowLvl2Transition(true)` when `index === 2` — that's the *arrival*
index reported the moment the runner reaches Pipeworks (Level 2), i.e.
right after Level 1 is cleared. The user wants the clip to play after
Pipeworks itself is cleared (the transition into Level 3, Flooded
Annex), not on arrival. Move the trigger onto a level-clear signal for
Pipeworks specifically — check whether `onLevelClear` already gives
enough info, or adjust the index check in `handleLevelChange` to mean
"just advanced past Pipeworks" instead of "just arrived at Pipeworks."
Same asset, no new files.

## 2. Pipeworks clear condition — ASK THE USER FIRST

User: "lvl2 only happens when player is able to outrun 4 skibs." Today
every level advances purely on `levelSkreems >= level.advanceAt`
(`GameEngine.js:762`; `advanceAt: 68` for Pipeworks) — chaser count is
unrelated. `MAX_CHASERS` is currently `3` (`GameEngine.js:301`), not 4.
Ask the user to confirm one of:

- Bump `MAX_CHASERS` to `4` globally (affects the multi-chaser mechanic
  on every level, not just Pipeworks), keeping the skreem-timer clear
  condition as-is, or
- Add a genuinely separate clear condition just for Pipeworks: it only
  advances once the runner has survived some duration with 4 chasers
  active, independent of (or in addition to) `advanceAt`.

Don't guess — this changes core level pacing for the whole game, not
just one constant.

## 3. Extra-chaser speed ramp (unblocked)

`_maybeSpawnExtraChaser()` (`GameEngine.js:779-802`) spawns each new
chaser at a flat `this.chaser.baseSpeed * 0.92` forever. User wants
newly-joined chasers to start slower and ramp up over the level instead
of staying at a fixed discount. Add a per-chaser ramp — e.g. store a
spawn timestamp (or elapsed-since-spawn counter) per chaser object, and
apply a multiplier that climbs from ~0.7-0.8 toward 1.0 over a few
seconds, layered on top of (not replacing) the existing
`chaserSpeedMod` rubber-band (`CHASER_SPEED_MOD_*`,
`GameEngine.js:310-313`). The per-chaser speed read lives where
`chaser.baseSpeed * this.chaserSpeedMod` is calculated
(`GameEngine.js:745`, inside the main chase-update loop).

## 4. Death-video confirmation — ASK THE USER FIRST

User: "the old player ded should be played [on death] ... can we get
this back into the play." Checked `git log --all` (including diffs on
any `*.mp4`/`*ded*` path) — **no death video has ever existed in this
repo.** The only existing death feedback is the canvas-drawn jump-scare
zoom (`_drawJumpscare()`, fires whenever `phase === 'caught'`). Ask the
user which they mean:

- (a) Just make sure the existing jump-scare still fires cleanly on
  every capture and isn't visually blocked by the lvl2 transition
  overlay. Worth auditing regardless: the lvl2 `<video>`
  (`App.jsx:281-291`) is an absolutely-positioned overlay stacked on top
  of `GameCanvas`, and could obscure the jump-scare if a capture and the
  lvl2 transition ever became simultaneous (verify they can't be, given
  item 1's fix). If they can't overlap, there may be nothing to fix
  here beyond confirming that with the user.
- (b) They want a genuinely new, separate death-specific video clip
  (distinct from `lvl2-transition.mp4`). If so, this needs a source
  clip from the user first (same "drop it in a scratch folder, then
  wire it" pattern as `lvl2-transition.mp4` and the chaser/runner
  photos) before any plumbing gets built.

Don't build new video plumbing without an answer — you may end up doing
nothing but confirming (a) is already true.

## Constraints (see also `docs/skib-sdlc.md`)

- Front-end only. Don't touch the `backend/` scaffold.
- Keep the 9:16 portrait layout.
- Don't break cookie persistence or the random default face rotation.
- No prod deploy — don't bump `GAME_ITERATION` or run
  `./scripts/deploy-static.sh` unless the user explicitly asks to
  publish.
- `cd frontend && npm run build` must succeed before calling anything
  done; for gameplay-feel changes (all four items here are gameplay
  feel), actually drive the canvas rather than just eyeballing the diff
  — see `docs/dev-notes.md` for the headless-Chrome approach used
  previously in this sandbox.
- Update `docs/version-log.md`, `docs/update-directions.md`,
  `docs/roadmap.md`, a new `docs/handoffs/roadmap-handoff-vX.Y.Z.md`,
  and `docs/handoffs/ledger.md` before stopping, per `docs/skib-sdlc.md`.
