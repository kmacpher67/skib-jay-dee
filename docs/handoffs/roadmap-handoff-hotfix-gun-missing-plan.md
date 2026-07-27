# Roadmap Handoff Plan v0.4.44 — Hotfix: Gun Missing & Close-Call Freeze Inputs

**Created by:** Claude Sonnet 5
**Session mode:** Mode A (Planning — docs only, no code changes)

## RCA: "Gun Missing & Unable to Shoot" Bug
The player reported that after the "scare screen popup" (the `near-capture` phase), their gun was missing and they were unable to shoot the chaser before it came at them. 

The root cause is a combination of rendering and game loop structure bugs in `GameEngine.js`:
1. **Visual Disappearance:** During the `near-capture` phase (2.5s popup), `_drawControls(ctx)` is intentionally skipped. This hides the on-screen joystick and fire buttons, leading the player to believe their gun went "missing."
2. **Input Deadzone during Freeze:** When the game transitions to `close-call-freeze` (1.0s), the game loop in `_update(dt)` calls `this._updateCloseCallFreeze(dt)` and then executes an **early return**. 
   - Because all the core game logic (input processing, `fireHeld` checking, `_tryFire()`, and `_updateBullets()`) is flattened inside `_update(dt)` below that return statement, the player's frantic taps on the Fire button are completely ignored.
   - When the 1.0s freeze ends, the chaser (who was already <100px away) resumes full speed and instantly catches the player before they can react.

## Proposed Implementation Plan

**1. Keep Controls Visible During Jumpscares**
- Modify `_drawControls(ctx)` calls in `GameEngine.js` to ensure the HUD controls are rendered during the `near-capture` phase, so the player never thinks their gun was taken away.

**2. Refactor `_update(dt)` to Support Partial Freezes**
- Extract the monolithic logic inside `_update(dt)` into dedicated helper methods:
  - `_updateRunnerMovement(dt)`
  - `_updateChaserMovement(dt)`
- Modify the `close-call-freeze` phase logic so it no longer triggers an early `return`.
- Instead, use a phase check to conditionally skip `_updateRunnerMovement` and `_updateChaserMovement` during `close-call-freeze`.
- Allow the input processing (`fireHeld`, `_tryFire`) and `_updateBullets(dt)` to continue running during `close-call-freeze`. This gives the player the intended XXX milliseconds to shoot and stun the frozen chaser *before* it comes at them "all crazy."

## Flag for Ken
- **SDLC Rule:** I've identified this as a structural refactor of the core `_update` loop rather than a simple 1-line hotfix. According to `skib-sdlc.md`, I am stopping here and presenting this handoff plan for your approval before writing any code.
- Please review the RCA and proposed refactor. If you approve, we can transition to Mode B (Execution) and implement these fixes.

---

## Copy-paste: next planning session (Mode B)

```text
Read docs/handoffs/roadmap-handoff-hotfix-gun-missing-plan.md.
Transition to Mode B (Execution).
Implement the proposed refactor to GameEngine.js:
1. Make _drawControls visible during near-capture.
2. Refactor _update(dt) to extract runner/chaser movement logic.
3. Allow input processing and bullet updates to run during close-call-freeze.
```
