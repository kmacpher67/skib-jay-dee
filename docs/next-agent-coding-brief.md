# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

Copy and paste the block below into the next coding agent session. This
brief follows the three-session order documented in
`docs/handoffs/roadmap-handoff-v0.4.3-plan.md`.

---

You're continuing work on **Skib-Jay-Dee-Toilet** in
`/mnt/data/projects/skib-jay-dee`. The latest planning pass tightened
the backlog into a three-session sequence:
1. extra-chaser speed ramp
2. Pipeworks 4-chaser/max-speed clear condition
3. lvl2 video timing fix, then death-visual verification

Follow `docs/skib-sdlc.md`'s process: read the docs it lists, work in
single-session increments, build + verify, update the docs, and commit
before stopping.

Read first:

1. `docs/skib-sdlc.md`
2. `docs/update-directions.md`
3. `docs/handoffs/roadmap-handoff-v0.4.3-plan.md`
4. `frontend/src/App.jsx`
5. `frontend/src/GameEngine.js`

## Session 1: extra-chaser speed ramp

`_maybeSpawnExtraChaser()` (`GameEngine.js:780-803`) still gives extra
chasers a flat spawn discount forever. Add a per-chaser ramp so newly
joined chasers start slower and climb to full speed over a few seconds,
layered on top of the existing `chaserSpeedMod` rubber-band
(`CHASER_SPEED_MOD_*`, `GameEngine.js:310-314`). Verify by surviving
long enough for a second/third chaser to spawn and confirming the fresh
one visibly lags before matching the pack.

## Session 2: Pipeworks clear condition

Bump `MAX_CHASERS` from `3` to `4` (`GameEngine.js:301`) and make
Pipeworks only advance once all four chasers are active and fully
ramped, with a separate skreem gate/goal for that "4-up, all maxed"
state. This is Level 2/Pipeworks-specific; do not change other levels'
`advanceAt` behavior unless asked.

## Session 3: lvl2 timing fix + death-visual verification

Move the lvl2 transition trigger off `handleLevelChange`'s arrival index
(`App.jsx:156-166`) and onto the Pipeworks clear event. After that,
confirm the original jump-scare still shows unobstructed and no new
death clip was introduced. Same `lvl2-transition.mp4` asset, no new
files.

## Constraints (see also `docs/skib-sdlc.md`)

- Front-end only. Don't touch the `backend/` scaffold.
- Keep the 9:16 portrait layout.
- Don't break cookie persistence or the random default face rotation.
- No prod deploy - don't bump `GAME_ITERATION` or run
  `./scripts/deploy-static.sh` unless the user explicitly asks to
  publish.
- `cd frontend && npm run build` must succeed before calling anything
  done; for gameplay-feel changes, actually drive the canvas rather
  than just eyeballing the diff - see `docs/dev-notes.md` for the
  headless-Chrome approach used previously in this sandbox.
- Update `docs/version-log.md`, `docs/update-directions.md`,
  `docs/roadmap.md`, a new `docs/handoffs/roadmap-handoff-vX.Y.Z.md`,
  and `docs/handoffs/ledger.md` before stopping, per `docs/skib-sdlc.md`.
