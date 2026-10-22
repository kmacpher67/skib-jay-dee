# Roadmap Handoff v0.4.89 — Weapon Ammo and Pickup Pressure

**Created by:** Codex (GPT-5)
**Created on:** 2026-10-22
**Session mode:** Mode B — code and delivery

## Shipped

- Handgun ammo stacks to six shots and handgun pickups no longer erase an
  existing handgun inventory.
- Handgun and Boom Stick coexist in `runner.weapons`; the selected weapon is
  used until empty, then the other loaded weapon is selected automatically.
- Gun spawn odds are explicitly higher on every level.
- Level 1 now uses a 36 skreem threshold and a 45-second minimum before the
  normal advance checks can succeed.
- Each extra chaser arrival has independent random, wall-safe chances to add a
  gun pickup and a helpful moving mushroom charge-up.
- Existing `runner.gun` compatibility behavior is retained for Chaser Beta and
  the older Boom Stick tests.

## Verification

- `npm run build` passed under Node 24.
- Focused Playwright coverage passed for handgun, Boom Stick, Chaser Beta,
  chaser join ramp, ammo stacking/coexistence, and Level 1/arrival tuning.

## Explicitly not done

The visible level countdown, generalized chaser respawn cooldown, Fart Blocker
award/effect, final Level 4–6 live-balance tuning, and GitHub issue #10 closure
remain separate work.

## Copy-paste: next natural steps

```text
Continue in Mode A. Read docs/skib-sdlc.md, docs/update-directions.md,
docs/roadmap.md, docs/future-versions.md, and this handoff. Issue #10's
weapon/ammo slice shipped in v0.4.89. Plan only one of the remaining slices:
the visible level countdown, generalized chaser respawn cooldown, or Fart
Blocker award/effect. Do not change frontend code in the planning session.
Keep the current six-shot handgun inventory, Boom Stick coexistence/fallback,
Level 1 45-second minimum, wall-safe arrival pickups, portrait layout, cookie
profile state, and Quick Play face rotation intact.
```
