# Roadmap Handoff v0.4.77 — Boom Stick C1 Spawn And Ammo

**Created by:** Codex GPT-5 — 2026-09-20
**Created on:** 2026-09-20
**Last updated by:** Codex GPT-5 — 2026-09-20
**Session mode:** Mode B (code and delivery)
**Mode impact:** Runner campaign first; Chaser Beta remains protected by
the existing shared weapon field shape.

## What Landed

- Completed the Boom Stick Slice C1 contract from
  `roadmap-handoff-v0.4.77-plan.md`.
- Added named Boom Stick constants and helper methods for the level /
  difficulty event table, Lucky assist trimming, and event pickup spawn.
- Rolls now happen at level start and whenever an extra chaser spawns.
- Successful events spawn a loaded `boom-stick` pickup if the runner does
  not own the weapon, otherwise one `boom-stick-shell` pickup.
- A live Boom Stick event pickup is refreshed instead of duplicated.
- The runner can hold one loaded shell and up to five reserve shells.
- Empty Boom Stick state starts a 0.85s reload timer and loads one shell
  from reserve when it completes.
- Boom Stick firing is intentionally parked for Slice C2; pressing FIRE
  while holding it shows a short "blast comes next" line and does not
  consume ammo or fire handgun bullets.
- Added `frontend/e2e/boom-stick-c1.spec.js` for the table, Lucky cap,
  pickup selection, duplicate prevention, reserve cap, and reload path.

## Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test frontend/e2e/boom-stick-c1.spec.js frontend/e2e/jayden-gun.spec.js frontend/e2e/lucky-charm.spec.js`
- Full-suite and deploy verification were run after docs updates in this
  delivery session.

## Not Done

- No cone damage, explosion rolls, survivor stun/knockback, body count,
  respawn behavior, splotch decal, portrait-shatter cutaway, or Boom
  Stick voice/SFX.
- No broad Jayden Gun ammo rebalance, chaser HP table, persistent body
  count, or `Splat` death gag from the wider GitHub issue #3.
- No final spoken audio; Slice F still waits for Ken recordings or asset
  approval.

## Copy-Paste: Next Natural Steps

```text
Work in Mode B. Read docs/skib-sdlc.md, docs/update-directions.md,
docs/roadmap.md, docs/handoffs/roadmap-handoff-v0.4.77-plan.md, and
docs/handoffs/roadmap-handoff-v0.4.77.md.

Implement only Boom Stick Slice C2: blast geometry and hit outcomes.

1. Keep the existing v0.4.77 C1 spawn/ammo helpers intact.
2. Make `_tryFire()` handle `runner.gun.kind === 'boom_stick'` for real:
   consume one loaded shell, respect reload/cooldown, and keep reserve
   reload behavior.
3. Hit every eligible chaser in a forward 230px range / 70-degree total
   cone, blocked by existing wall geometry.
4. For each hit chaser, independently roll 1-in-3 explosion. Exploded
   chasers are removed from the active roster, increment a session body
   count, and enter the existing respawn queue for 12 seconds. Survivors
   get a 7s stun plus 90px knockback clamped by collision.
5. Grant the existing gun-hit sheeb reward once per blast, not once per
   target.
6. Use a temporary `SPLAT!` / smoke-effect fallback only. Do not build
   splotch decals, portrait-shatter cutaway, final subtitles, final SFX,
   or the broader handgun/HP rebalance in this slice.
7. Add deterministic Playwright coverage for cone inclusion/exclusion,
   wall blocking, explosion vs survivor RNG, one reward per blast, body
   count increment, 12s respawn, and no effect on out-of-cone chasers.

Run `cd frontend && npm run build && npx playwright test`.
Update the required SDLC docs, commit, push, and deploy only if Ken asks.
```

