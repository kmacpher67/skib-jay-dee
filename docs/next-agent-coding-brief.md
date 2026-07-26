# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

Copy and paste the block below into the next coding agent session. This
brief is scoped to the four items queued in the v0.4.2-plan session
(docs-only, 2026-07-26) — see
`docs/handoffs/roadmap-handoff-v0.4.2-plan.md` for the full
investigation and the follow-up where the user resolved both open
design questions. **All four items are now fully unblocked** — no
further product decisions are needed before coding.

---

You're continuing work on **Skib-Jay-Dee-Toilet** in
`/mnt/data/projects/skib-jay-dee`. The last session was docs/plan-only —
no gameplay code has changed since v0.4.0 (one small pre-existing
chaser-face-randomization fix landed alongside the docs, see
`docs/version-log.md`'s v0.4.2-plan entry). Follow `docs/skib-sdlc.md`'s
process (read the docs it lists, work in single-session increments,
build + verify, update the docs, commit before stopping — Mode B in
`docs/skib-sdlc.md`).

Read first:

1. `docs/skib-sdlc.md`
2. `docs/update-directions.md`
3. `docs/handoffs/roadmap-handoff-v0.4.2-plan.md` (the investigation
   behind every item below, plus the "Follow-up" section documenting
   the user's answers)
4. `frontend/src/App.jsx`
5. `frontend/src/GameEngine.js`

Four items. Do them in this order — 2 and 3 are one connected mechanic
and 3 depends on 1's state existing first:

## 1. Extra-chaser speed ramp (do this first — item 2 depends on it)

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
(`GameEngine.js:745`, inside the main chase-update loop). Also expose a
simple way to check "has this chaser finished ramping to its max speed"
(e.g. a boolean flag or comparing the ramp multiplier to 1.0) — item 2
needs that state per chaser.

## 2. Pipeworks clear condition: 4 chasers at max speed, skreem-gated (RESOLVED design)

User confirmed: "YES. for XX amount of SKREEM points and max speed of
the chasers." Implement:

- Bump `MAX_CHASERS` from `3` to `4` (`GameEngine.js:301`).
- Change Pipeworks's clear condition (`advanceAt: 68`,
  `GameEngine.js:762`) so it no longer just counts `levelSkreems` on a
  timer. It should only progress toward clearing once **all 4 chasers
  are simultaneously active and each has reached its own max speed**
  (lead chaser's `chaserSpeedMod` at `CHASER_SPEED_MOD_MAX`; every extra
  chaser's spawn-ramp from item 1 finished). Track skreems earned during
  that "4-up, all maxed" state as a separate counter/gate rather than
  reusing `levelSkreems` outright, and advance the level once that
  gated counter hits a threshold.
- The exact skreem-goal number ("XX") is intentionally left as a tunable
  constant, not fixed by this plan — pick something in the neighborhood
  of the current `advanceAt: 68` and playtest/adjust. Name it clearly
  (e.g. a new per-level field, or a constant like
  `PIPEWORKS_MAX_PRESSURE_SKREEM_GOAL`) so a future session can retune
  it without hunting through `GameEngine.js`.
- This is Level 2/Pipeworks-specific — don't change how other levels'
  `advanceAt` works unless asked.

## 3. Fix lvl2 transition video timing (depends on item 2 redefining "cleared")

`App.jsx:156-166` (`handleLevelChange`) fires
`setShowLvl2Transition(true)` when `index === 2` — that's the *arrival*
index reported the moment the runner reaches Pipeworks, i.e. right after
Level 1 is cleared. The user wants the clip to play after Pipeworks
itself is cleared (the transition into Level 3, Flooded Annex), not on
arrival. Once item 2 defines the real "Pipeworks cleared" event, move
the video trigger onto that instead of the arrival index — check
whether `onLevelClear` already carries enough info, or adjust
`handleLevelChange`'s index check to mean "just advanced past Pipeworks"
instead of "just arrived at Pipeworks." Same asset
(`lvl2-transition.mp4`), no new files.

## 4. Death-visual verification (RESOLVED — no new asset)

User confirmed: "my bad the ded is still the original" — no new
death-specific video is wanted. The existing canvas-drawn jump-scare
zoom (`_drawJumpscare()`, fires whenever `phase === 'caught'`) is and
stays the only death feedback. Nothing to build here — just verify,
after item 3 lands, that the jump-scare can't be visually blocked by the
lvl2 `<video>` overlay (`App.jsx:281-291`, absolutely positioned on top
of `GameCanvas`). If a capture and the lvl2 transition genuinely can
never be simultaneous (they shouldn't be, once item 3's timing fix is
in), there's likely nothing left to change — just confirm it and move
on.

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
