# Roadmap Handoff v0.4.70

## Summary of Work Completed
- **Difficulty Selector Fix**: Replaced obsolete hardcoded checks (`'easy'`, `'hardcore'`) with the actual profile cookie string values (`'noob'`, `'casual'`, `'4chan-st'`) in `GameEngine.js`.
- **Level 5 Chaser Tuning**: 
  - Reduced the baseline Level 5 speed multiplier for chasers from `1.15x` to `1.05x`.
  - Added a specific speed reduction for 'noob' difficulty (`NOOB_DIFFICULTY_CHASER_SPEED_SHAVE = 0.05`), providing an easier experience for beginners on higher levels.
  - Implemented a `0.7x` speed penalty for chasers moving while inside a wall (`wallHackLevel === true` && `_hitsWall(chaser)`).
- **Raman Aunt Tuning**: Shifted the extra spawn eligibility for RAMAN_AUNT to Level 5+ instead of Level 4+.
- **Level 4 Ramen Aisle Pickup Bump**: 
  - Increased spawn rates significantly on Level 4 (index `3`) for positive pickups: Schleimy Potion (now 100% chance), Jayden Gun (30%), Taco Bell (30%), and Decoy (30%).
  - Added a tight-squeeze gap to the right-side room in `mapGrids.js` (`RAMEN_AISLE_GRID`).
  - Relocated the Turdstone Token spawn directly behind this tight-squeeze gap (coordinates `820, 220`), requiring the player to use a Schleimy Potion to reach it.
- **E2E Testing**: Added `level5-tuning-v0.4.70.spec.js` to verify:
  1. The speed difference between 'noob' and 'casual' difficulties on Level 5.
  2. The 0.7x speed penalty when a wall-phasing Level 5+ chaser overlaps with a wall.
  3. The static spawn of the Turdstone Token on Ramen Aisle.

## Playwright Tests
- Ran `npx playwright test e2e/level5-tuning-v0.4.70.spec.js` successfully.

## Deployment
- Bumped `GAME_ITERATION` to `v0.4.70` in `frontend/src/version.js`.
- Generated standard static build output and deployed via `./scripts/deploy-static.sh`.
