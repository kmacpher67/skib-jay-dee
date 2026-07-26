# Roadmap Handoff — v0.4.24-plan

**Session mode:** Mode A (Planning only)

Scopes the "Subway Surfers-style resume countdown" feature requested by
x-lax (relayed by Ken via a text thread with Alexander — see
[docs/resume-countdown.md](../resume-countdown.md) for the full writeup
and design rationale). No code changed this session; `GAME_ITERATION`
stays unbumped.

This is a separate, unrelated feature from the still-open
[roadmap-handoff-v0.4.23-plan.md](roadmap-handoff-v0.4.23-plan.md)
(post-kill chaser profile screen) — that item is still the oldest
unfinished handoff and should be picked up first under Mode B's
oldest-first rule, unless the user specifically asks for this one next.

## Design summary

Keep the existing jump-scare (`_triggerCaught()` / `_updateCaught()` /
`_drawJumpscare()` — flash, zoom, capture line) exactly as-is. Only change
what happens *after* it: instead of resetting positions and immediately
flipping `phase` to `'chase'`, add a new `'resume-countdown'` phase that
freezes the world at the reset spawn points for 3 seconds and draws a
big, pulsing centered digit ("3", "2", "1") with no flashing overlay,
then resumes the chase. Full before/after code walkthrough with exact
call sites is in `docs/resume-countdown.md`.

## What's explicitly not done yet (Code Monkey target)

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md`, `docs/resume-countdown.md`, and
`frontend/src/GameEngine.js` before touching anything.

Your task: implement the "Subway Surfers-Style Resume Countdown" backlog
item from `docs/roadmap.md`.

1. **New phase.** In `frontend/src/GameEngine.js`, `_updateCaught(dt)`
   currently resets runner/chaser positions and sets `this.phase =
   'chase'` the instant `this.phaseTimer <= 0` (around line 1029-1046).
   Change the `if (this.phaseTimer <= 0)` block so that after doing the
   existing position/state resets (keep all of it: spawn positions,
   `chasers = [this.chaser]`, `extraChaserTimer`, `stamina`,
   `chaserLineTimer`/`runnerLineTimer` resets, restoring
   `_preCaughtRunnerFace`), it sets `this.phase = 'resume-countdown'` and
   `this.countdownTimer = 3.0` instead of `this.phase = 'chase'`.
2. **Freeze + tick the countdown.** Add a new method
   `_updateResumeCountdown(dt)`: decrement `this.countdownTimer -= dt`;
   when it drops to `0` or below, set `this.phase = 'chase'` and
   `this.phaseTimer = 0`. Wire it into the main `update(dt)` dispatcher
   the same way `'caught'` and `'near-capture'` already branch (look for
   `if (this.phase === 'caught') { this._updateCaught(dt) }` near line
   759 and mirror that pattern). Runner/chaser movement and AI updates
   must NOT run while `phase === 'resume-countdown'` — same as they
   already don't run during `'caught'`.
3. **Draw the countdown.** In `draw()` (~line 1065-1089), add
   `if (this.phase === 'resume-countdown') this._drawResumeCountdown(ctx)`
   alongside the existing phase-conditional draw calls. Add
   `_drawResumeCountdown(ctx)`: draw a translucent dark (not red, not
   strobing) backdrop, then a single large centered digit —
   `Math.ceil(this.countdownTimer)` — with a light scale-pulse effect.
   No jitter, no red flash, no capture-line text — that's the jump-scare's
   look, this phase should read as calm/neutral.
4. **No leftover overlays.** Confirm nothing from the jump-scare
   (`_drawJumpscare`'s flash rect, capture-line text) can render once
   `phase !== 'caught'` — it shouldn't today since `draw()` already
   gates `_drawJumpscare` on `phase === 'caught'`, but double check no
   other component (e.g. any DOM overlay in `App.jsx` tied to the caught
   state) lingers into the new phase.
5. **Test coverage.** Add `frontend/e2e/resume-countdown.spec.js`,
   mirroring the `window.__skibEngine` debug-hook pattern used in
   `frontend/e2e/caught-face.spec.js`: force a capture, wait out the
   jump-scare, then assert `phase` transitions `'caught'` →
   `'resume-countdown'` → `'chase'` in order, that runner/chaser
   positions don't change during the countdown, and that the countdown
   phase lasts roughly 3 seconds.

Verification:
- `cd frontend && npm run build` must succeed.
- Full Playwright suite passes, including the new spec.
- Manual browser pass: get caught, confirm the jump-scare plays exactly
  as before, then a frozen "3… 2… 1…" appears with no red flash, then the
  chase resumes smoothly with no jump/teleport feel.
- Once verified, bump `GAME_ITERATION` to `v0.4.24`, update
  `docs/version-log.md`, `docs/update-directions.md`, `docs/roadmap.md`
  (check off this item), `docs/handoffs/ledger.md`, and create
  `docs/handoffs/roadmap-handoff-v0.4.24.md` before committing, per
  `docs/skib-sdlc.md`.
```

## Flag for Ken

None — this is pure canvas/engine logic, no new assets needed, no product
decision blocking it.
