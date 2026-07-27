# Difficulty Mechanics Plan

## Overview
The difficulty system in Skib-Jay-Dee-Toilet is designed to be chaotic, funny, and fundamentally alter the "feel" of the game at each tier. It does not just scale enemy health—it scales the game's attitude towards the player.

We are implementing a three-tier system: **Noob**, **Casual**, and **4chan-st** (Shyt-Talker).

## Difficulty Tiers

### 1. Noob (Easy)
- **Focus:** Easy fun, exploring the map, and learning the game without stress.
- **Feel:** Forgiving and slow.
- **Gameplay Impact:**
  - Chaser base speed reduced by 20%.
  - Extra chaser spawn interval doubled.
  - Huge stamina pool and fast regen (can sprint almost endlessly).
  - High Sheeb drops, zero capture penalty.
  - *Vibe:* The game gently nudges the player along.

### 2. Casual (Normal)
- **Focus:** Relaxed play with a fair, light challenge.
- **Feel:** The standard, intended baseline experience (current v0.4.x tuning).
- **Gameplay Impact:**
  - Standard Chaser speed and pressure ramps.
  - Standard Sheebs economy and debt mechanics.
  - Fair warning on captures (the Skreem grace period functions normally).
  - *Vibe:* Standard chase panic.

### 3. 4chan-st (Shyt-Talker / Hardcore)
- **Focus:** Extreme pain, mockery, and punishing mechanics for elite players.
- **Feel:** Fast, unfair, and actively insulting.
- **Gameplay Impact:**
  - Chasers are significantly faster (+20% base speed) and cut off escape routes tighter.
  - "Instant Death": The proximity Skreem grace period is drastically shortened or removed. If they touch you, you're caught immediately.
  - Punishing Economy: Massive Sheeb penalties. Getting caught drops you deep into debt instantly.
  - *Vibe (The Mockery):* This is the core of this mode. When you die, the game actively insults you. We will add a dedicated `SHYT_TALKER_LINES` pool to `dialog.js`. The post-kill screens will roast the player for their lack of skill, and chaser barks during the game will be relentless taunts.

## Implementation Methods

To achieve this, we will combine **Stat Scaling** (Method A) and **Mechanical Complexity** (Method B).

1. **The Toggle:** Add a Difficulty Selector to the main menu (defaulting to Casual).
2. **GameEngine Hooks:** `GameEngine.js` will read `profile.difficulty` and apply multipliers to `CHASER_SPEED_MOD`, `staminaRegen`, and `capturePenalty`.
3. **Mid-Run vs Locked Difficulty:** 
   - **Noob/Casual:** Players can toggle between these modes at any time during a profile play. Switching changes the current score multipliers dynamically. This prioritizes player enjoyment.
   - **4chan-st (Hardcore):** Locking into this mode at the start of a run grants an exclusive scoring algorithm benefit (and unique badge eligibility). If a player toggles down to Casual mid-run to survive, they forfeit the Hardcore scoring bonuses and badge for that run. 
4. **Dialog Hooks:** `_triggerCaught()` and the chase update loop will check if `difficulty === '4chan-st'`. If true, it overrides standard dialog pools with the punishing `SHYT_TALKER_LINES` pool.

## Next Steps for Code Monkey
- [ ] Add `difficulty` field to the cookie profile (default: 'Casual').
- [ ] Build the UI toggle in the main menu.
- [ ] Write the `SHYT_TALKER_LINES` in `dialog.js` (needs Ken to provide the funniest/most savage insults).
- [ ] Wire the speed/stamina multipliers in `GameEngine.js` based on the selected tier.
