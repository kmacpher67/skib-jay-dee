# Roadmap Handoff — v0.4.8

**Session date:** 2026-07-26
**Previous version:** v0.4.6 (see `docs/handoffs/roadmap-handoff-v0.4.6.md`).

This was a Mode B (code and delivery) session. Per `docs/skib-sdlc.md`'s
ordering rule ("do the oldest open/unfinished handoff, not the newest"),
this picked up **Session 1** of the three-session backlog documented in
`docs/handoffs/roadmap-handoff-v0.4.3-plan.md` and
`docs/next-agent-coding-brief.md` — the extra-chaser speed ramp. That
backlog is older (v0.4.2-plan/v0.4.3-plan) than the separate near-capture
interlude backlog from `v0.4.5-plan`, and is also flagged in
`docs/update-directions.md` as the higher-priority queue since it traces
to direct user playtest feedback. `GAME_ITERATION` stays `v0.4.0`;
nothing was deployed.

## Code-monkey lane attempt

The user asked to use the code-monkey lane if it's ready. Checked and it
is operational: `OLLAMA_HOST` and the `desktop-gaming` profile are both
reachable, and `./scripts/run_code_monkey.sh` successfully dispatches and
returns a chat completion. A real dispatch was tried against a
session-1-scoped bounded prompt (not the full three-session copy-paste
block, to keep it properly bounded per `docs/skib-sdlc.md`'s Code Monkey
lane guidance) on both `thinkpad-local` (qwen3:4b) and `desktop-gaming`
(qwen3:8b, used for the recorded attempt below).

The response was a plausible-looking diff, but did not match the real
file: it invented `MAX_CHASERS = 5` (actually `3`), used wrong line
numbers, added a second conflicting `const chaserSpeed` declaration in
the same scope, and referenced a non-existent `class GameEngine`
declaration style (the real file uses `export class GameEngine`). Not
safe to apply as-is, and the lane itself only prints text — there's no
auto-apply step, so a human/agent has to review and land the result
regardless of backend. Implemented the change directly instead of
iterating further on prompts, given the nuance required (layering a new
ramp on top of an existing rubber-band system without breaking either).

This isn't a lane bug — `docs/skib-sdlc.md`'s Code Monkey section already
frames it as being for small, well-bounded slices; a subtle physics/feel
change to a shared hot-path function is closer to the edge of what a 4B/8B
local model should be trusted with unreviewed.

## What this session did

1. **Implemented the extra-chaser speed ramp.**
   - `frontend/src/GameEngine.js`: added a `lerp(a, b, t)` helper next to
     `clamp()`.
   - Added `CHASER_JOIN_RAMP_START = 0.7` and
     `CHASER_JOIN_RAMP_SECONDS = 5` next to the existing
     `CHASER_SPEED_MOD_*` constants.
   - `_maybeSpawnExtraChaser()` no longer sets
     `baseSpeed: this.chaser.baseSpeed * 0.92`; it now spawns with
     `baseSpeed: this.chaser.baseSpeed` and a new `joinRamp: 0` field.
   - The chase-update loop (inside the per-chaser `for` loop) now does:
     ```js
     chaser.joinRamp = Math.min(1, (chaser.joinRamp ?? 1) + dt / CHASER_JOIN_RAMP_SECONDS)
     const joinRampMod = lerp(CHASER_JOIN_RAMP_START, 1, chaser.joinRamp)
     const chaserSpeed = chaser.baseSpeed * this.chaserSpeedMod * joinRampMod
     ```
     The lead chaser (`this.chasers[0]`, set up elsewhere in the
     constructor/`_startLevel`) never gets a `joinRamp` field, so
     `chaser.joinRamp ?? 1` keeps it at full ramp — matching its
     pre-existing behavior exactly, nothing changes for the lead chaser.
2. **Added e2e coverage.** `frontend/e2e/chaser-join-ramp.spec.js` forces
   an immediate extra-chaser spawn (`engine.extraChaserTimer = 0` instead
   of waiting out the real `EXTRA_CHASER_INTERVAL`), asserts the new
   chaser's `joinRamp` starts well below fully-ramped and its effective
   speed is below the lead chaser's, then fast-forwards `joinRamp` to `1`
   to confirm it reaches full speed.
3. **Updated docs.** `docs/roadmap.md` (checked off the item),
   `docs/update-directions.md`, `docs/version-log.md`,
   `docs/next-agent-coding-brief.md` (marked Session 1 done, pointed at
   Session 2 as the start), `docs/handoffs/ledger.md`, and this handoff.

## Verification performed

- `cd frontend && npm run build` succeeds.
- `npx playwright test` — all 5 tests pass (4 pre-existing +
  `chaser-join-ramp.spec.js`).

## What's explicitly not done

- **Session 2 — Pipeworks 4-chaser/max-speed clear condition.** Bump
  `MAX_CHASERS` from `3` to `4`, and gate Pipeworks's `advanceAt` on all
  4 chasers being active and fully ramped (`joinRamp === 1` for every
  extra chaser), with a separate tunable skreem-threshold constant. Fully
  spec'd in `docs/handoffs/roadmap-handoff-v0.4.3-plan.md` and
  `docs/next-agent-coding-brief.md`.
- **Session 3 — lvl2 timing fix + death-visual verification.** Move the
  lvl2 transition trigger off `handleLevelChange`'s arrival index onto
  the Pipeworks-clear event, then confirm the jump-scare still shows
  unobstructed. Same source docs as above.
- **The separate v0.4.5-plan near-capture interlude** — still open, its
  own increment, not touched this session.
- No `GAME_ITERATION` bump, no deploy — not requested this session.

## Copy-paste: next natural steps for the next agent

```
Read docs/skib-sdlc.md (Mode B: oldest open/unfinished handoff first),
then docs/update-directions.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.8.md), then
docs/handoffs/roadmap-handoff-v0.4.3-plan.md for the full three-session
spec.

Session 1 (extra-chaser speed ramp) is done as of v0.4.8. Pick up
Session 2 next:

Session 2 — Pipeworks's 4-chaser/max-speed clear condition:
- Bump `MAX_CHASERS` from `3` to `4` (`frontend/src/GameEngine.js`, near
  `EXTRA_CHASER_INTERVAL`).
- Make Pipeworks only advance once all 4 chasers are active and each
  extra chaser's `joinRamp` has reached `1` (fully ramped, using the
  v0.4.8 mechanism) — track this as a separate counter/gate, not a reuse
  of the plain `levelSkreems` timer, per
  docs/handoffs/roadmap-handoff-v0.4.3-plan.md. Expose the exact skreem
  threshold as a named constant (e.g. `PIPEWORKS_MAX_PRESSURE_SKREEM_GOAL`)
  so it's easy to retune, in the neighborhood of the existing
  `advanceAt: 68` for Pipeworks.
- Verify: clear Pipeworks only after the 4-chaser/max-speed gate is
  satisfied; other levels should keep their current `advanceAt` behavior
  unchanged.
- Add or extend a Playwright test (see `frontend/e2e/chaser-join-ramp.spec.js`
  for the pattern of forcing engine state via `window.__skibEngine`
  instead of waiting on real-time chase movement).

After Session 2 lands, Session 3 (lvl2-video timing fix + death-visual
verification) is the last item in this backlog — see
docs/handoffs/roadmap-handoff-v0.4.3-plan.md for its exact file/line
targets.

Each session stays front-end only. Follow docs/skib-sdlc.md: build
(`cd frontend && npm run build`), run `npx playwright test`, update
docs/version-log.md + docs/update-directions.md + docs/roadmap.md + a new
docs/handoffs/roadmap-handoff-vX.Y.Z.md + ledger entry, then commit.
Only bump `GAME_ITERATION` and run `./scripts/deploy-static.sh <short-name>`
if the user explicitly asks to publish.
```
