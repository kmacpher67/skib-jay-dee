# Difficulty Mechanics Plan

## Overview
The goal is to introduce a selectable difficulty function that scales the challenge for different types of players, while retaining the core gameplay loop. We need to define what difficulty means in Skib-Jay-Dee-Toilet, the options available, and the gameplay impact of each setting.

## Difficulty Tiers

### 1. Casual / "Noob-Noob" (Easy)
- **Target Audience:** Players who want to explore, read the dialog, and laugh at the jokes without getting stressed.
- **Gameplay Impact:**
  - Chaser base speed reduced by 15%.
  - Extra chaser spawn interval doubled (slower pressure ramp).
  - Skreem penalty on capture is halved; Sheeb penalty removed or capped at 10.
  - Generous stamina pool (+25%) and faster regen.
- **Inference:** A more forgiving environment where mistakes don't instantly end the run or bankrupt the player.

### 2. Standard / "Just Running" (Normal)
- **Target Audience:** The baseline experience.
- **Gameplay Impact:**
  - This is the current tuning of the game (v0.4.x).
  - Standard speed, standard sheebs debt (past level 3), standard capture penalties.

### 3. Sweaty / "CEO of Drains" (Hard)
- **Target Audience:** Players who have bought all shop upgrades and find the base game too easy.
- **Gameplay Impact:**
  - Chaser base speed increased by 15%.
  - Multi-chaser pressure ramps up faster (shorter intervals).
  - Negative pickups (e.g., Heavy Plunger, Soggy TP) spawn more frequently.
  - Shop items have a higher chance of being lost on capture (past level 4).
  - *Bonus:* Higher Sheeb payout (+25%) for surviving/clearing levels.

## Implementation Methods

### Method A: Global Multiplier (Simple)
- Introduce a `difficulty` state in the player's profile (0 = Easy, 1 = Normal, 2 = Hard).
- In `GameEngine.js`, apply a global modifier to `CHASER_SPEED_MOD_MAX`, stamina drain rates, and penalty values based on the selected difficulty.
- **Pros:** Fast to implement. Low risk of breaking specific levels.
- **Cons:** Can feel numerical rather than systemic (just "faster enemies").

### Method B: AI & Map Variations (Complex)
- Difficulty changes not just stats, but behavior.
- Easy: Skibs have larger turn radii (can't corner as tightly).
- Hard: Skibs try to cut off the player's path instead of just following directly. Levels spawn additional hazard tiles (more puddles).
- **Pros:** Deeply rewarding and genuinely changes how the game is played.
- **Cons:** High development cost (needs new AI pathing logic).

### Method C: The "Debt" Lock (Progression-Based)
- Difficulty is tied to the current Level and Sheeb debt. 
- You don't choose the difficulty in a menu; it is dynamically inferred. If you are deep in negative sheebs, the game activates "Repo Mode" where Skibs are faster until you clear your debt. If you are positive, it remains standard.
- **Pros:** Blends perfectly with the existing risk/reward economy.
- **Cons:** Might frustrate players who get stuck in a death loop and can't lower the difficulty manually.

## Next Steps / Discussion
- Do we want a classic menu toggle (Method A) or a dynamic system (Method C)?
- Should difficulty affect badge unlock eligibility? (e.g., "Must be on Normal or Hard to earn X badge").
- **Action:** Discuss with Ken before writing code.
