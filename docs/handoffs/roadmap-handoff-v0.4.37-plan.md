# Roadmap Handoff - v0.4.37-plan

**Session mode:** Mode A (Planning - docs only, no code changes)

This handoff captures the gameplay balancing and reward enhancements requested by the user, specifically addressing early-level difficulty, sheeb reward mechanisms, and dynamic scaling of chaser speeds.

## Feature 1: Sheeb Rewards for Actions
Currently, shooting a chaser and earning badges provide gameplay benefits or status but no direct Sheeb rewards. We will add Sheebs for these actions to ensure players have plenty of mechanisms to get points on early levels.
- **Gun Stun:** Hitting a chaser with the Jayden Gun grants **+25 sheebs**.
- **Badge Earned:** Earning any badge grants **+50 sheebs**. The in-game toast notification will be updated to display `( +50 Sheebs )` alongside the badge name.

## Feature 2: Scaled Death Penalty
Currently, dying docks a flat 20 sheebs across all levels (going negative past level 3). We will scale this so early levels are more forgiving and later levels ramp up.
- **Level 1:** 0 sheebs lost.
- **Level 2:** 10 sheebs lost.
- **Level 3:** 20 sheebs lost.
- **Level 4+:** 30 sheebs lost (can go negative).

## Feature 3: Chaser Speed Tuning & Dynamic Caps
Chasers will start slower, and their maximum speed will be capped based on the current level.
- **Initial Speed:** `this.chaserSpeedMod` will start at `0.8` (down from `1.0`), making Level 1 noticeably more forgiving.
- **Dynamic Max Cap:** Instead of a flat `1.35` max across the whole game, the max speed will scale by level to ensure chasers never exceed the "max amount for a new level":
  - Level 1 Max: 0.9
  - Level 2 Max: 1.0
  - Level 3 Max: 1.15
  - Level 4 Max: 1.25
  - Level 5 Max: 1.35
- **Death Slowdown:** Dying will continue to reduce the speed mod by `-0.1` (existing behavior), but with the new starting speed and caps, the relief will be more palpable.

## Feature 4: Rebalance Level Sheeb Delivery
We will bump the base Sheeb rewards for completing levels to ensure difficulty strictly increases delivery, providing enough stash for a Deep Breath Tank (90 pts) via good play on Level 1.
- Level 1: 40 -> 50 base sheebs
- Level 2: 60 -> 75 base sheebs
- Level 3: 90 -> 100 base sheebs
- Level 4: 120 -> 150 base sheebs
- Level 5: 160 -> 200 base sheebs

---

## 🚀 Copy & Paste Snippet for Code Monkey

When you are ready to unleash the Code Monkey on this balancing pass, feed it this prompt:

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md` and `docs/roadmap.md` before starting.

Your objective is to implement the balancing changes from v0.4.37-plan:

1. **Sheeb Rewards for Actions (`frontend/src/GameEngine.js`):**
   - Add a `grantSheebs(amount)` method to `GameEngine` or directly update `this.sheebs` and call `this.onSheebsChange(this.sheebs)`.
   - In `_updateJaydenGun()`, when a bullet hits a chaser, grant `25` sheebs.
   - In `_hasRequiredLevelBadge()` and `_rollRandomBadges()`, when a badge is newly earned, grant `50` sheebs. Update the `onBadgeEarned` callback payload or the toast UI to indicate `+50 Sheebs`.

2. **Scaled Death Penalty (`frontend/src/GameEngine.js`):**
   - In `_triggerCaught()`, replace `const baseSheebsLost = 20` with a scaled value based on `this.levelIndex`: Level 1 (index 0) = 0, Level 2 = 10, Level 3 = 20, Level 4+ = 30.

3. **Chaser Speed Tuning & Caps (`frontend/src/GameEngine.js`):**
   - Change the initial `this.chaserSpeedMod` in the constructor from `1.0` to `0.8`.
   - Create a helper to get the max speed cap based on level index (e.g. `[0.9, 1.0, 1.15, 1.25, 1.35]`).
   - In `_triggerLevelClear()` and `_triggerCaught()`, use this dynamic max cap instead of the flat `CHASER_SPEED_MOD_MAX` when clamping the speed mod.

4. **Rebalance Level Delivery (`frontend/src/GameEngine.js`):**
   - Update the `reward` field in the `LEVELS` array: 50, 75, 100, 150, 200.

Verify with `npm run build` and the full Playwright suite. Update `docs/roadmap.md`, `docs/handoffs/ledger.md`, `docs/version-log.md`, `docs/update-directions.md`, and generate a new `docs/handoffs/roadmap-handoff-vX.Y.Z.md` per the SDLC checklist. Commit your work before ending the session.
```
