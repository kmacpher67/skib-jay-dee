# Hand-off: v0.4.73 Level Warp Passes

## Work completed
- **Level Warp Passes**: Added a new progression unlock feature to the Shop.
- Added tracking of level clear counts to player profiles (`levelClearCounts`).
- Added tracking of permanent unlocked start level to player profiles (`highestUnlockedStartLevel`).
- The shop now sells "Warp Pass: Level N" for 1500 sheebs each, gated by 3 clears of Level N-1.
- Updated the main menu to show a compact level-picker dropdown when `highestUnlockedStartLevel > 1`.
- Bypassed levels via warp do not award sheebs, skreems, or badges for skipped content.
- Updated persistence in `frontend/src/lib/cookies.js` to normalize the new profile fields.
- **Test Fixes**: Fixed the failing `level5-tuning-v0.4.70.spec.js` test suite. The test was suffering from timeouts (Promise garbage collected) and TypeError crashes because it was missing a Playwright click on the play button and it was attempting to mock internal variables in an incompatible way with the latest `update()` refactor. Tests now pass (59 passed).
- Verified builds with `npm run build`.

## Mode Impact
`Runner only`. The warp passes are tied to main campaign progression and do not affect the Chaser Beta mode.

## Next up
- Review the `docs/roadmap.md` and continue with the next prioritized feature.
