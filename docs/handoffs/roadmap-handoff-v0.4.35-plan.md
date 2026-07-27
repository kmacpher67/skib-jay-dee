# Roadmap Handoff — v0.4.35-plan

**Session mode:** Mode A (Planning — docs only, no code changes in this doc's scope)

This handoff details the implementation of new interactive items on the map, a new potion mechanic, and the integration of "coolness" and difficulty-based dialog.

## Feature 1: Rolling Pickups (Mario-Style)

Add dynamic items that move around the map rather than being static pickups.
- **Mechanics:** These items bounce around the walls or move in semi-random paths. 
- **Mix of effects:** Must be a mix of good items (buffs to stamina or speed, point bonuses) and bad items (debuffs like temporary slowness, or taking damage/skreems).
- **Implementation:** Add a new `rollingPickups` array to `GameEngine.js`, update them in `_updateChase`, and check for collision with the runner.

## Feature 2: Schleimy Potion

A new collectible that temporarily shrinks the runner's hitbox, allowing them to slip through tight map gaps and chokepoints.
- **Acquisition:** Treat this as a rare map pickup (similar to the Jayden Gun).
- **Effect:** Shrinks the player hitbox by 65% for 4 seconds. 
- **Tradeoff:** Movement speed drops by ~20% and chaser speed gets a temporary bump while active. This forces the player to use it strategically. 
- **UI:** Show a HUD timer bar next to the stamina bar when active.

## Feature 3: Coolness Dialog & Cleanup

Integrate the newly drafted "Coolness Dialog" and do a minor cleanup.
- **Dialog integration:** In `frontend/src/dialog.js`, add `COOLNESS_LINES` and `HARD_CHASER_LINES` arrays based on `docs/dialog_content_chasing.md`. 
- **Triggers:** Trigger coolness lines when the runner has a near-miss or uses an item (like Schleimy Potion or Gawd Particle). Trigger hard chaser lines when Level 4+ starts or when the debt economy applies.
- **Cleanup:** Remove the dead `initialSheebs = 200` default parameter in `GameEngine.js` constructor, as this was obsoleted by the cookie profile manager.

## Follow-on content note

The next content-heavy follow-up should use
[`docs/interactive-content-pack.md`](../interactive-content-pack.md) as
the source of truth for the funny secret-item / award pass. Keep that
work separate from the three-feature slice above so the rolling pickups /
Schleimy Potion / dialog session stays small and readable.

## Execution order

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md` and `docs/roadmap.md` before starting. This is
a Mode B (code) session picking up an already-finalized Mode A plan.

Scope for this pass:
1. **Rolling Pickups:** Implement moving/bouncing items in `GameEngine.js` that offer buffs and debuffs.
2. **Schleimy Potion:** Add a new potion map pickup that shrinks the runner's hitbox by 65% for 4 seconds, while reducing speed and boosting chaser speed. Add a UI timer bar for the active effect.
3. **Dialog & Cleanup:** Add `COOLNESS_LINES` and `HARD_CHASER_LINES` to `dialog.js` and trigger them in `GameEngine.js`. Remove `initialSheebs = 200` from `GameEngine.js`.

Verify with `npm run build` and the full Playwright suite before
calling it done. Update `docs/roadmap.md`, `docs/handoffs/ledger.md`,
`docs/version-log.md`, `docs/update-directions.md`, and a new
`docs/handoffs/roadmap-handoff-vX.Y.Z.md` per the SDLC checklist, and
commit before ending the session.
```
