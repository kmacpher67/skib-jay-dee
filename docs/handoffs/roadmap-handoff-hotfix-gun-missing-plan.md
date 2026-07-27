# Roadmap Handoff Plan v0.4.44 — Hotfix: Can't Fire During Close-Call Freeze

**Status:** Implemented and committed.

## Background
An earlier pass by a Gemini AI agent drafted an RCA and a fairly heavy refactor
plan (extracting `_updateRunnerMovement` / `_updateChaserMovement` out of
`_update(dt)`) for a reported "gun goes missing during the scare screen" bug.
Before executing that plan, Claude re-verified the RCA directly against
`GameEngine.js` and found:

1. **Confirmed, real bug:** during the `close-call-freeze` phase (the 1.0s
   pause right after the `near-capture` jumpscare, while the chaser is within
   100px of the player), `_update(dt)` called `_updateCloseCallFreeze(dt)` and
   then hit an early `return`. Fire-button handling (`fireHeld` / `_tryFire`)
   and `_updateBullets(dt)` live further down in the same function, so they
   never ran during the freeze. The player's taps on the fire button were
   silently dropped, and when the freeze ended the chaser resumed at full
   speed already adjacent to the player — reads exactly like "my gun stopped
   working right before I got caught."
2. **Not a bug, by design:** `_drawNearCapture(ctx)` (the 2.5s jumpscare
   before the freeze) intentionally fills the whole canvas with a black
   background + jumpscare face and a caption. No input is processed during
   that phase at all (movement and firing are both inert), so hiding the
   on-screen joystick/fire button there is consistent with the rest of the
   screen being blacked out — not a rendering oversight. Adding the controls
   back on top of the jumpscare would be a cosmetic, non-functional change
   with no matching behavior fix, so it was left alone.

## Fix Implemented
`GameEngine.js`, `close-call-freeze` branch of `_update(dt)`: instead of an
early return after `_updateCloseCallFreeze(dt)`, also run the fire-cooldown
tick, fire-button edge detection (`_tryFire()`), and `_updateBullets(dt)`
before returning. `_tryFire()` and `_updateBullets()` are self-contained
(no dependency on runner/chaser movement, which correctly stays frozen), so
no extraction/refactor of `_update(dt)` was needed — a 5-line addition inside
the existing branch was sufficient.

Net effect: during the freeze, the player can now see (controls were already
drawn during `close-call-freeze`) and actually use the fire button to stun
the chaser before it resumes chasing at full speed.

## Scope Note
The heavier refactor proposed in the original draft (extracting movement into
`_updateRunnerMovement` / `_updateChaserMovement`) was not needed and was not
done — it would have touched much more of the core loop for no behavioral
benefit beyond what the targeted fix above already achieves.
