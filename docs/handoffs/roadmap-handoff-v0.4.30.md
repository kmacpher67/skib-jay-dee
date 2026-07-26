# Roadmap Handoff — v0.4.30

**Session mode:** Mode B (Implementation)

Implemented the Rewards/Badges system as spec'd by Ken in the planning pass. The system provides an `earnedBadges` array on the user profile to persist badges across sessions.

## What we did

1. **`frontend/src/lib/cookies.js`:** Added `earnedBadges` to the default normalized profile so it persists automatically.
2. **`frontend/src/gameContent.js`:** Added a `BADGES` object defining the initial four badges ("Financial Wizardry (or Fraud)", "Glutton for Punishment", "Slippery When Wet", "Devs Owe Me Five Bucks").
3. **`frontend/src/GameEngine.js`:** Added the `onBadgeEarned` callback to the constructor. Wired up conditions:
   - Paying off debt (`this.sheebs` transitioning from `< 0` to `>= 0`) triggers "Financial Wizardry".
   - Reaching exactly 50 `this.deaths` triggers "Glutton for Punishment".
   - Clearing level 4 (`this.levelIndex >= 3`) triggers "Devs Owe Me Five Bucks".
   - Also added logic in `_drawBanner` to render earned badges (as emojis) at the bottom of the level-clear/level-transition screen.
4. **`frontend/src/App.jsx`:**
   - Plumbed `handleBadgeEarned` through to `GameCanvas` and `GameEngine`.
   - On badge trigger, updates `profile.earnedBadges` uniquely, and triggers a 5-second `activeBadgeToast` state.
   - Rendered the `activeBadgeToast` overlay on top of the game canvas.
   - Added a badge display block on the main menu, directly under the status pills.
5. **Docs:** Updated `docs/roadmap.md`, `docs/handoffs/ledger.md`, `docs/version-log.md`, and `docs/update-directions.md` per SDLC. Added the Jayden Gun and Rolling Pickups to the backlog.

## What's explicitly not done

- "Slippery When Wet" is defined in `BADGES` but not hooked up in `GameEngine.js` yet, because the Schleimy Potion it depends on does not exist yet.
- Playwright tests for badges were deferred to keep the slice tight (manual verified).

## Verification

- `cd frontend && npm run build` passed successfully.
- Triggered level 4 clear and verified the toast appears and the menu updates.

## Copy-paste: next natural steps

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md` and `docs/roadmap.md` before starting.

Scope for this pass: Choose between the two newly added backlog items for planning:
1. **The "Jayden" Gun:** Plan out the mechanics (ammo, aiming, etc.) and propose a design.
2. **Rolling Pickups (Mario-Style):** Plan out how rolling good/bad items will function, move, and spawn on the map.

Write a Mode A plan for whichever you choose, creating a `roadmap-handoff-v0.4.31-plan.md` doc.
```
