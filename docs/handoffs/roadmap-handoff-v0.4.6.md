# Roadmap Handoff — v0.4.6

**Session date:** 2026-07-26
**Previous version:** v0.4.5-plan (docs-only, see
`docs/handoffs/roadmap-handoff-v0.4.5-plan.md`); last shipped code was
v0.4.4 (see `docs/handoffs/roadmap-handoff-v0.4.4.md`).

This was a Mode B (code and delivery) session. Per `docs/skib-sdlc.md`'s
ordering rule, it picked up the oldest open/unfinished handoff item —
runner pose-to-state mapping, queued since `roadmap-handoff-v0.4.1-plan.md`
and confirmed as the next natural step in `roadmap-handoff-v0.4.4.md`.
The newer `v0.4.5-plan` near-capture-interlude backlog item was checked
first (per the "check for a concurrent planning session" step) and
confirmed to be a separate, still-open increment — not touched this
session. `GAME_ITERATION` stays `v0.4.0`; nothing was deployed.

## What this session did

1. **Implemented runner pose-to-state mapping.**
   - Added `RUNNER_STATE_FACES` to `frontend/src/gameContent.js`,
     resolving the `jayden-getting-captured` and `jayden-captured` pool
     entries by id so they're addressable outside the random rotation.
   - `frontend/src/GameEngine.js`: `setFaces()` now also accepts
     `runnerIsCustom`, `runnerGettingCapturedFace`, and
     `runnerCapturedFace`. `_triggerCaught()` stashes the runner's
     current face and swaps to `gettingCapturedFace` the instant a
     capture happens (unless the player uploaded a custom face).
     `_updateCaught()` swaps to `capturedFace` once the jump-scare zoom
     hits its cap (`zoom >= 3`), then restores the original face when
     the caught beat ends and `phase` returns to `'chase'`.
   - `frontend/src/components/GameCanvas.jsx` preloads the two state
     faces alongside the existing runner/chaser face load, and passes a
     new `runnerIsCustom` prop through from `frontend/src/App.jsx` (which
     already tracked this in its `runnerIsCustom` state for the
     `handlePlay()` random-reroll logic — just wasn't wired to the
     canvas before).
   - Kept the existing random-default-pose behavior in `randomFaces()`
     completely unchanged, per the original plan wording.
2. **Added e2e coverage for the new behavior.**
   - `frontend/src/components/GameCanvas.jsx` now exposes
     `window.__skibEngine = engine` after construction — debug-only, no
     gameplay effect, added specifically so a test can force game state
     directly instead of depending on real-time chase movement/timing.
   - `frontend/e2e/caught-face.spec.js`: teleports the chaser onto the
     runner to force an immediate capture, then asserts (by object
     identity, not by asset `src` — see the discovery below) that the
     runner's face becomes `gettingCapturedFace` on capture,
     `capturedFace` once the zoom caps out, and the original face again
     once `phase` returns to `'chase'`.
3. **Discovered a real asset bug — flagged, not fixed.**
   - While writing the test, comparing images by `src` failed in a way
     that led to running `md5sum` on the underlying files:
     `jayden-getting-captured.jpg` is byte-identical to
     `jayden-captured.jpg`, and `jayden-uncaring-4029.jpg` is
     byte-identical to `jayden-default.jpg`. Only 3 of the 5 documented
     `RUNNER_FACE_POOL` poses are actually distinct photos today.
   - Per `docs/skib-sdlc.md`'s constraint that default faces are real
     family photos and shouldn't be replaced/regenerated without asking,
     this was documented as a Ken-only follow-up in `docs/roadmap.md` and
     `docs/characters.md` rather than silently "fixed" by picking new
     images or renaming the pool myself.
   - The new pose-swap code is unaffected by this — it swaps the correct
     *pool entries*, it's just that two of those entries currently render
     the same picture.
4. **Updated docs.** `docs/roadmap.md` (checked off the item, added the
   asset-duplicate follow-up), `docs/characters.md` (documented the new
   mapping behavior and the duplicate-photo finding),
   `docs/update-directions.md`, `docs/version-log.md`,
   `docs/handoffs/ledger.md`, and this handoff.

## Verification performed

- `cd frontend && npm run build` succeeds.
- `npx playwright test` — all 4 tests pass, including the new
  `caught-face.spec.js`.
- Manually reasoned through the zoom-timing edge case (zoom ramps
  1x→3x over ~0.4s at `dt * 5`/sec, well within the 2.6s caught-phase
  window) and confirmed via the passing test that the "held" stage
  transition actually fires before the phase reverts, not after.

## What's explicitly not done

- **The photo-duplication issue itself** — needs Ken to supply real
  distinct shots for `jayden-getting-captured` and/or
  `jayden-uncaring-4029`, or explicitly confirm collapsing the pool to 3
  poses. Don't guess a fix. See `docs/roadmap.md`.
- **v0.4.5-plan's near-capture interlude** — fully scoped, fully
  unblocked, not started this session (separate increment).
- **The v0.4.2-plan/v0.4.3-plan backlog** (extra-chaser speed ramp,
  Pipeworks's 4-chaser/max-speed clear condition, lvl2-video timing fix,
  death-visual overlap verification) — still the highest-priority open
  backlog (direct user playtest feedback), not touched this session.
- No `GAME_ITERATION` bump, no build/deploy beyond local verification —
  not requested this session.

## Copy-paste: next natural steps for the next agent

```
Read docs/skib-sdlc.md (Mode B: oldest open/unfinished handoff first),
then docs/update-directions.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.6.md).

Two backlogs are open and fully unblocked-or-documented, in oldest-first
order:

1. Near-capture interlude (from v0.4.5-plan, oldest still-open item):
   when a skib gets close enough to feel like a near-capture but before
   the real caught/collision path fires, pause the chase, show
   frontend/src/assets/jayden-getting-captured.jpg full-screen, and
   overlay one short parody caption from a small random pool (seed it
   with the user's "Noob-noob no no!!!" / "Thanks, Noob-Noob. This guy
   gets it." style lines). Keep the real caught/jump-scare state as the
   actual fail path — this is a comedic beat, not a replacement. Put any
   new caption pool in frontend/src/dialog.js. See
   docs/handoffs/roadmap-handoff-v0.4.5-plan.md for the full scoping.

2. The v0.4.2-plan/v0.4.3-plan backlog (higher priority — direct user
   playtest feedback, but a separate multi-item sequence from item 1):
   extra-chaser speed ramp -> Pipeworks's 4-chaser/max-speed clear
   condition -> lvl2-video arrival-vs-clear timing fix -> death-visual
   overlap verification. Fully spec'd with exact edits in
   docs/handoffs/roadmap-handoff-v0.4.3-plan.md and
   docs/next-agent-coding-brief.md.

Not a coding task, needs Ken directly: jayden-getting-captured.jpg and
jayden-uncaring-4029.jpg are byte-identical duplicates of
jayden-captured.jpg and jayden-default.jpg (md5sum-confirmed this
session). The new runner pose-to-state mapping code (this session) is
correct and ready, but won't look different until Ken supplies real
distinct photos for those ids, or confirms collapsing the pool to 3
unique poses. Don't guess a fix or crop/regenerate photos yourself.

Pick ONE increment per session per docs/skib-sdlc.md's sizing rule.
After implementing: cd frontend && npm run build must succeed; drive the
canvas for real (see docs/dev-notes.md's headless-Chrome approach, or
this session's window.__skibEngine + forced-state trick in
frontend/e2e/caught-face.spec.js for verifying specific engine states
without waiting on real-time movement). Then update
docs/version-log.md, docs/update-directions.md, docs/roadmap.md, a new
docs/handoffs/roadmap-handoff-vX.Y.Z.md, and docs/handoffs/ledger.md.
Commit your work. Do not bump GAME_ITERATION or run
./scripts/deploy-static.sh unless the user explicitly asks to publish.
```
