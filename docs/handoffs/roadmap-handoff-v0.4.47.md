# Roadmap Handoff v0.4.47-plan — Rod of Poopdom (Teleport Mechanic)

**Created by:** Antigravity
**Status:** PROPOSED (Mode A / Planning)
**Genre Context:** 2D top-down web canvas chaser

## Goal
Introduce a new uncommon/rare map pickup called the "Rod of Poopdom" that grants the player a targeted teleport ability. This gives the runner an emergency escape tool but introduces a cooldown ("Stinky" debuff) so it can't be spammed.

## Feature Spec

*   **Visual Glyph:**
    *   **Icon:** A twisted, brown wooden staff capped with a glowing, fly-swarming emerald.
    *   **Symbol/Indicator:** A spiral coil shape mixed with classic teleportation sparks or particles to indicate a valid teleport location.
    *   **VFX:** Leaves a trail of brown, comical smoke clouds at the departure point when activated.
*   **Spawn & Appearance Rate:**
    *   **Rarity:** Uncommon / Rare Tier.
    *   **Drop Rate:** 3% to 5% chance. Can spawn from specific biome chests or enemies. (Since this game uses random map pickups and shop items, this might be adapted as an uncommon map drop or tied to a future "Sewage" biome level).
    *   **World Limit:** Maximum of 1 or 2 can exist per active map instance to prevent spamming.
*   **Activation Controls:**
    *   **Keyboard:** Press the 'T' key (or 'F', sharing the action button) to instantly teleport to the current mouse cursor location.
    *   **Controller / Touch:** Tap the action button / Right Bumper while aiming the target reticle.
*   **Mechanic & Balancing:**
    *   **Teleport:** Moves the player instantly to the target location.
    *   **Debuff:** Activating it inflicts a short 3-second "Stinky" debuff, preventing consecutive teleports immediately after.

## Open Design Questions for Ken

1.  **Teleport Range Balance:** Since this is a 2D top-down game with wall collision, we should likely cap the maximum teleport distance (e.g., 250-300px) so the player can't teleport off-screen or skip entire hallways. Does a 300px cap sound right?
2.  **Wall Clipping / Safety Check:** Should the teleport perform a collision check at the destination? If the player clicks inside a solid wall, do we deny the teleport (play an error sound), or snap them to the nearest valid floor space?
3.  **Button Overlap:** The 'F' key is currently used for the Jayden Gun and Heavy Plunger. Do we want to reuse 'F' for this staff since a player likely only holds one item at a time, or give it a dedicated 'T' key?

## What's explicitly not done
No code has been written. The implementation is blocked pending Ken's answers to the balance and collision questions.

## Copy-paste: next natural steps (Code Monkey Lane)

```text
code_monkey_backend: ollama
code_monkey_model: thinkpad-local

Read docs/handoffs/roadmap-handoff-v0.4.47-plan.md for the "Rod of Poopdom" feature spec.
Once Ken has answered the Open Design Questions regarding range and wall collisions, implement the following:
1. Add the Rod of Poopdom as a collectible item in `frontend/src/GameEngine.js`.
2. Wire the 'T' or 'F' key to trigger the teleport action to the current mouse coordinates.
3. Validate that the destination is within range and not inside a wall.
4. Apply a 3-second cooldown ("Stinky" debuff) upon use, preventing immediate reuse.
5. Draw the brown smoke VFX at the departure point.
Verify by testing the teleport action and ensuring no wall-clipping occurs.
```
