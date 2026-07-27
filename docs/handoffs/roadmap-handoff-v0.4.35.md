# Handoff: v0.4.35 (Shipped)

## What was done
1. **Rolling Pickups**: Added the Mario-style rolling pickups to the engine. They bounce off map walls and grant helpful (speed boost, stamina refill, sheebs) or harmful (slow/stamina drain, damage) effects on collision.
2. **Schleimy Potion**: Shipped the potion as a rare map pickup (15%). When collected, it shrinks the runner's hitbox by 65% for 4 seconds, allowing players to squeeze through tight map gaps. It comes with a 20% runner speed penalty and a 20% chaser speed boost while active. Added a green UI timer bar next to the stamina bar.
3. **Dialog Triggers**: Added `COOLNESS_LINES` and `HARD_CHASER_LINES` to `dialog.js`. Coolness lines trigger on narrow escapes (during `near-capture` zoom), using the potion, and using the Gawd Particle. Hard chaser lines trigger randomly from chaser barks in Level 4+ and always on a capture in Level 4+ when debt is applied.
4. **Cleanup**: Removed the stale `initialSheebs = 200` default from `GameEngine.js`'s constructor.

## Verification
- Built frontend cleanly (`npm run build`).
- Full playwright test suite passed (`npx playwright test`).
- Bumped `GAME_ITERATION` to `v0.4.35` and deployed.

## Next Up
The game is mechanically solid. The next target is the map-refactor and the remaining interactive content pack elements (Cursed & Blessed pickups, Secret Interaction Badges, and map personality/landmarks). See `docs/handoffs/roadmap-handoff-v0.4.36-plan.md`.
