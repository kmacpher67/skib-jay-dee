# Handoff: v0.4.69 (Shipped)

**Created by:** Codex (GPT-5) — 2026-07-28
**Last updated by:** Codex (GPT-5) — 2026-07-28

## Implemented Features

1. **Profile Isolation**
   - App.jsx ignores sheeb/badge/death/level-clear telemetry when `isChaserMode` is true.
   - GameEngine zeros out the stat loadout from the profile in Chaser mode, ensuring the AI runner does not unfairly get player shop buffs.

2. **AI Runner Gun Logic**
   - In `_getRunnerEvadeVector`, the AI biases toward guns in the far branch and away from bad rolling pickups.
   - In `_updateRunner` / `update`, the AI checks distance to the chaser and fires back (stunning the human chaser) when in range, triggering a taunt from `CHASER_BETA_RUNNER_GUN_TAUNTS`.

3. **Dialog Additions**
   - Added `CHASER_BETA_OPENER_LINES` and displayed them via `bannerText` on run start.
   - Added `CHASER_BETA_RUNNER_GUN_TAUNTS`.
   - Added `CHASER_BETA_WIN_LINES` shown in the capture UI when the chaser catches the runner.

4. **Testing**
   - Added `e2e/chaser-beta.spec.js` asserting profile callback isolation and AI runner panic-fire functionality.

## Verification
- Both Playwright tests (`Slice A` and `Slice B`) in `chaser-beta.spec.js` pass.
- Application builds cleanly via `npm run build`.

## Next Steps
- Review `docs/version-log.md` for update.
- Evaluate remaining backlog items.
