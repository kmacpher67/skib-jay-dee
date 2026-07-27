# Roadmap Handoff — v0.4.34-plan

**Session mode:** Mode A (Planning — docs only, no code changes in this doc's scope)

This handoff details the end-game progression features for Level 5 and beyond, focusing on a massive shift in difficulty and a powerful new player tool.

## Feature 1: Skib-Chaser Evolution (Wall Hacks)

At Level 5, the standard rules of engagement break down. 
- **Wall Hacks:** Skib-chasers gain the terrifying ability to move through walls, completely nullifying standard hiding spots or chokepoints.
- **Speed & Attacks:** They gain significantly increased movement speed and more aggressive tracking/attack patterns.
- This creates an overwhelming pressure that forces the player to keep moving constantly.

## Feature 2: The "Gawd Particle"

To counter the evolved Skib-chasers, a new ultra-rare pickup is introduced: the Gawd Particle.
- **Spawn Conditions:** Only appears after Level 5. Very low spawn rate.
- **Player Effect:** When collected, the runner gains the ability to run through walls for a limited time.
- **Chaser Effect:** Contacting a Skib-chaser while under the effects of the Gawd Particle essentially "kills" them—despawning them entirely and forcing them onto a respawn timer before they can reappear in the level.
- This flips the dynamic temporarily, turning the runner into the hunter.

## Execution order

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md` and `docs/roadmap.md` before starting. This is
a Mode B (code) session picking up an already-finalized Mode A plan.

Scope for this pass:
1. **Chaser Evolution:** Implement a wall-collision bypass for Chasers when `currentLevel >= 5`. Increase their base speed and aggressiveness.
2. **Gawd Particle:** Implement the Gawd Particle item. When active on the player, disable player-wall collision, and allow the player to collide with and despawn chasers (with a respawn timer).

Verify with `npm run build` and the full Playwright suite before
calling it done. Update `docs/roadmap.md`, `docs/handoffs/ledger.md`,
`docs/version-log.md`, `docs/update-directions.md`, and a new
`docs/handoffs/roadmap-handoff-vX.Y.Z.md` per the SDLC checklist, and
commit before ending the session.
```
