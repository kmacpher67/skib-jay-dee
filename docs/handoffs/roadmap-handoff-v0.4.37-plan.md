# Roadmap Handoff: v0.4.37-plan

## Context
The previous session shipped v0.4.36, which introduced the initial 2D map refactor for Levels 1 and 2, Taco Bell & Decoy pickups, and the first batch of Secret Interaction Badges. We need to finish up the rest of the pickups and badges, as well as port the remaining levels to the 2D grid format.

## Work to do

1. **Complete the Map Refactor:**
   - Convert `buildFloodedAnnex`, `buildRamenAisle`, and `buildWorldStarParkingLot` to the 10x10 2D grid arrays format.
   - Save the grid strings in `frontend/src/mapGrids.js`.
   - Update `GameEngine.js` to parse these remaining levels dynamically using `parseMapGrid`.

2. **Finish the Cursed & Blessed Map Pickups:**
   - **Soggy Toilet Paper:** (Debuff/Trap) Grab leaves a trail draining stamina. Skibs stepping in trail are slowed by 40% for 5s.
   - **Heavy Plunger:** (Cursed) -30% Movement Speed while held. Press `F` to swing 360-arc, knocking back Skibs.

3. **Finish the Secret Interaction Badges:**
   - **Friendly Fire:** Stun a Skib with the Jayden Gun, but immediately get caught by *that exact same Skib* the millisecond the stun wears off.

## Execution Constraints
- Update `GameEngine.js` for the map parsing logic, and make sure `parseMapGrid` can handle the unique elements of the later levels if necessary (or keep them out of the grid if they are special).
- Verify everything works in the browser and playwright.

```bash
code_monkey_backend="ollama"
code_monkey_model="thinkpad-local"
```

## To dispatch via code monkey:
```bash
# Add prompt here if automating
```
