# Roadmap Handoff — v0.4.31-plan

**Session mode:** Mode A (Planning)

This handoff prepares the next set of work for the codebase. It addresses two primary goals: fixing a newly introduced regression causing widespread test failures, and designing the "Jayden Gun" feature from the backlog.

## Part 1: Test Regression Investigation (FIXED)

A recent change from v0.4.30's Badges system integration broke the core game boot sequence. The Playwright test suite was failing with 12 errors related to the `<canvas>` failing to mount.

**Root Cause:** The `onBadgeEarned` callback was passed from `GameCanvas.jsx` to `GameEngine.js`, but it was missing from the destructured parameter list in the `GameEngine` constructor. This caused `onBadgeEarned || (() => {})` to throw a `ReferenceError` on boot, crashing the React tree before the canvas could mount.

**Resolution:** Added `onBadgeEarned` to the constructor arguments in `GameEngine.js`. All 18 tests now pass successfully.

---

## Part 2: Feature Design — The "Jayden" Gun

The user requested a new item for the runner: a funny, cool, challenging gun that keeps the game difficult and interesting. It is explicitly **not** a power fantasy or an "I win" button.

### Key Constraints & Requirements
- **Extremely Limited Capacity:** Randomized each time it's picked up (1-2 usable shots, max 3 out of a 6-round cylinder). Mostly empty chambers.
- **Single-use Pickup:** Once ammo runs out, the gun disappears. It is not a permanent inventory item.
- **Tone:** Must fit the comedic, slightly unhinged tone of the game.

### Design Decisions to Finalize (Flag for Ken):
Before writing code for the gun, we need product alignment on the following:

1. **Aiming / Fire Input:**
   - *Options:* Click/key to fire in the direction the runner is facing, or auto-aim at the nearest chaser?
   - *Recommendation:* Spacebar or a specific key (e.g., 'F') to fire in the direction of movement. This keeps it skill-based rather than auto-aim (which leans toward a "power fantasy").
2. **Hit Effect:**
   - *Options:* Stun, slow, or instant despawn?
   - *Recommendation:* A 3-5 second "stun" where the chaser stops moving and plays a dazed animation/sound. Despawning permanently might make the game too easy, violating the core constraint.
3. **Acquisition:**
   - *Options:* Map pickup vs. Shleeb Shop item.
   - *Recommendation:* Map pickup (like the upcoming Schleimy Potion). It makes map traversal more dynamic and rewards risky pathing.
4. **Comedic Flavor:**
   - *Idea:* A "cap gun" sound effect. If it fires an empty chamber, it plays a pathetic *click*. If it hits, the chaser could show a funny "ouch" face or text bubble.

## Execution Order

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md` and `docs/roadmap.md` before starting.

Scope for this pass:
1. **Fix the Tests:** Root cause the canvas boot failures (12 failing tests) and get the build green.
2. **Implement the Gun (If approved):** Once the design questions above are answered by the user, build out the Jayden Gun feature as specced.
```
