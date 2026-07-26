# Feature: Resume Countdown (Subway Surfers-style revive beat)

Requested by Ken relaying feedback from x-lax (via a text thread with
Alexander). The raw ask, cleaned up: after a capture, the game currently
zooms into the jump-scare and then teleports straight back into the chase
with no beat in between. That instant reset feels disorienting — a cheap
death right after respawning is common because the player has no moment
to reorient. Subway Surfers solves this with a frozen frame and a big
center "3, 2, 1" before play resumes.

## What this is *not*

This does **not** remove the existing jump-scare (the red flash + zoom +
capture-line beat in `_drawJumpscare()`/`_updateCaught()`). Ken and the
team like that beat; it's the payoff for getting caught. The complaint is
specifically about what happens *after* it — the abrupt teleport back into
a moving chase. The raw ChatGPT suggestion in the original ask said "remove
the flash," but that flash belongs to the jump-scare itself, not the new
countdown — leave it alone. The new phase only needs to make sure no
flashing/overlay artifacts *carry over* into the countdown once it starts.

## Current flow (as of v0.4.22)

`frontend/src/GameEngine.js`:

1. `_triggerCaught()` sets `this.phase = 'caught'`, `this.phaseTimer = 2.6`,
   resets `this.zoom = 1`, swaps the runner's face to the "getting
   captured" pose, applies the skreem/sheebs penalty, and fires
   `onDeath`/`onSkreem`/`onCaught`.
2. `_updateCaught(dt)` ramps `this.zoom` up to `3` over the 2.6s window
   (`_drawJumpscare()` draws the flashing red overlay + capture line while
   `phase === 'caught'`), swaps to the "held/resigned" face once the zoom
   maxes out, and when `phaseTimer` hits `0`: **immediately** resets both
   runner and chaser to their spawn points, restores the pre-capture face,
   resets stamina, and sets `this.phase = 'chase'` — the chase resumes at
   full speed on the very next frame.

There is no beat between "jump-scare ends" and "chase is live again."

## New flow

1. `_updateCaught(dt)` — when `phaseTimer` hits `0`, instead of resetting
   positions and going straight to `'chase'`, reset runner/chaser to spawn
   (same as today, this is the "frozen frame" — the player already sees
   where they'll resume), then set `this.phase = 'resume-countdown'` and
   `this.countdownTimer = 3.0`. Leave `_preCaughtRunnerFace` restore,
   stamina reset, `chaserLineTimer`/`runnerLineTimer` reset, and
   `chasers = [this.chaser]` exactly where they are now — those all belong
   to "the world is back at rest," which the countdown phase should show.
2. New `_updateResumeCountdown(dt)`: ticks `this.countdownTimer -= dt`.
   While `> 0`, everything stays frozen — no movement/AI updates for
   runner or chasers (the existing `update(dt)` early-returns or
   branches on phase already, same pattern as `'caught'`/`'near-capture'`
   today). When `countdownTimer <= 0`, set `this.phase = 'chase'` and
   `this.phaseTimer = 0` — chase resumes exactly like it does today, just
   one beat later.
3. `draw()`: add `if (this.phase === 'resume-countdown')
   this._drawResumeCountdown(ctx)`, alongside the existing map/entity draw
   (which already renders whatever phase is active — no special-casing
   needed there since runner/chasers are already parked at spawn).
4. New `_drawResumeCountdown(ctx)`: no red flash, no jitter text. Draw a
   single large centered digit — `Math.ceil(this.countdownTimer)` clamped
   to `1..3` — with a light scale-pulse (e.g. scale driven by
   `1 + 0.15 * (1 - (this.countdownTimer % 1))`, resetting each time the
   integer ticks over) so each number "pops" once instead of sliding
   smoothly. A translucent dark backdrop (not red, not strobing) behind
   the digit keeps it readable over the map without implying danger.

## Why a new phase instead of extending `'caught'`

Keeping `'caught'` scoped to just the jump-scare (flash + zoom + capture
line) means `_drawJumpscare()` doesn't need a branch for "am I still
flashing or now counting down," and other code that checks
`phase === 'caught'` (HUD suppression, control-drawing gates, etc.) keeps
its current meaning. A distinct `'resume-countdown'` phase is one `if`
away from every place that already switches on `this.phase`.

## Scope / non-goals

- No new assets required — this is canvas text, same as the existing
  jump-scare capture-line rendering.
- Doesn't touch the near-capture interlude (`'near-capture'` phase) —
  that's a separate pre-capture beat and isn't part of this ask.
- Doesn't change the skreem/sheebs penalty, face-swap logic, or the
  jump-scare's own duration/visuals.
- No audio requested in the original ask; if a countdown tick sound is
  wanted later, that's a follow-up, not part of this increment.

## Verification

- `cd frontend && npm run build`.
- Full Playwright suite, plus a targeted assertion (new spec, mirroring
  `frontend/e2e/caught-face.spec.js`'s `window.__skibEngine` debug-hook
  pattern) that forces a capture and asserts: `phase` transitions
  `'caught'` → `'resume-countdown'` → `'chase'` in order, runner/chaser
  positions don't change during the countdown, and `phase ===
  'resume-countdown'` for roughly 3 seconds before flipping to `'chase'`.
- Manual browser pass: get caught, confirm jump-scare plays as before,
  then a frozen "3… 2… 1…" appears with no red flash, then the chase
  resumes smoothly with no jump/teleport feel.

See [docs/roadmap.md](roadmap.md) for backlog placement and
[docs/handoffs/roadmap-handoff-v0.4.24-plan.md](handoffs/roadmap-handoff-v0.4.24-plan.md)
for the coding brief.
