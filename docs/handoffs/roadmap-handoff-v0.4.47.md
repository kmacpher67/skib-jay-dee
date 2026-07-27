# Roadmap Handoff v0.4.47 — Rod of Poopdom (Teleport Mechanic)

**Created by:** Antigravity — 2026-07-27
**Last updated by:** Composer — 2026-07-27

## Goal

Add an uncommon map pickup that grants a one-use-at-a-time teleport escape
with a cooldown debuff.

## Changes made

- `frontend/src/GameEngine.js`:
  - `ROD_OF_POOPDOM_SPAWN_CHANCE = 0.05` (5% per level start).
  - Pickup type `rod-of-poopdom`; sets `runner.rod = true` on collect.
  - Activation via `T` key or FIRE button when rod is held (replaces gun/
    plunger while active — same pattern as other held items).
  - Teleport toward pointer/facing direction, capped at **300px**.
  - Destination blocked if inside a wall (no snap-to-nearest).
  - **Stinky** debuff: `stinkyTimer = 3s` cooldown before reuse.
  - Brown smoke VFX at departure point.
  - FIRE button shows **WARP** (orange-brown) while charged; countdown while
    on cooldown.

## Design decisions (resolved at ship time)

| Open question (from plan) | Shipped answer |
|---|---|
| Teleport range | 300px cap |
| Wall at destination | Deny teleport (no snap) |
| Key binding | `T` + FIRE when held (not shared with gun while rod active) |

## Verification

- `npm run build` passed.
- Manual: collect rod, warp within range, confirm wall-block and cooldown.

## What's explicitly not done

- No dedicated art asset (uses colored pickup rect + smoke particles).
- Not documented in Player's Guide until this planning pass — see updated
  `docs/players-guide.md`.
- No Playwright spec yet — recommend adding in a fast-follow.

## Next steps

Gameplay Rebalancing remainder (`roadmap-handoff-v0.4.48-plan.md`).
