# Roadmap Handoff — v0.4.26

**Session mode:** Mode B (Code and delivery)

Implemented the negative sheebs debt economy and item loss mechanics for experienced players. 

## What landed

1. **Negative Sheebs (Level 4+)**: 
   - When a player with `highestLevel > 3` is captured, the standard 20 sheeb penalty is applied without flooring to zero.
   - If the balance goes below zero, the sheebs pill in the HUD and Main Menu updates to a red "DEBT" badge displaying the negative balance.

2. **Item Loss (Level 5+)**:
   - When a player with `highestLevel > 4` is captured, there is a 25% chance to lose one randomly selected item from their `ownedItems`.
   - The item is removed from their profile and can be repurchased in the shop later once they climb out of debt.

3. **Test Coverage**:
   - Added `negative-sheebs.spec.js` and `item-loss.spec.js` to verify these behaviors via Playwright.

## What's explicitly not done yet (Code Monkey target)

The difficulty transition screens (level 4+) and the new badges/awards system were scoped as new roadmap items for a future phase and were NOT implemented in this session.

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md` before touching anything. 

The next natural step is to pick up [roadmap-handoff-v0.4.25-plan.md](roadmap-handoff-v0.4.25-plan.md) (post-kill chaser profile + kill history), unless the user asks for something else.
```
