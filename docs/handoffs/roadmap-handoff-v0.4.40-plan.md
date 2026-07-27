# Roadmap Handoff Plan v0.4.40

**Created by:** Claude Sonnet 5 — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-27
**Session mode:** Mode A (Planning — docs only, no code changes)

This handoff scopes the **Shart Knocker** follow-up to the shipped Taco Bell
Grande pickup. It is intentionally **not** the current coding slice — pull
`docs/handoffs/roadmap-handoff-v0.4.39-plan.md` first (Enhanced Death Logs +
Parody Warning). Start this one only after v0.4.39 lands or Ken explicitly
reorders the queue.

## What this planning pass decided

1. **Keep the base Taco Bell Grande pickup unchanged.** It still grants the
   existing speed boost and steering lock. Shart Knocker is a separate active
   ability layered on top, not a rewrite of the pickup.
2. **One Taco Bell = one Kill Fart charge.** Collecting Taco Bell Grande
   while the runner is on Level 4+ (`levelIndex >= 3`) grants a single
   `shartCharge` (or equivalent) consumable. No stacking beyond what the
   pickup rules already allow unless Ken later asks for it.
3. **Activation:** while being chased (`phase === 'chase'` or during
   `close-call-freeze` — **decision TBD**, default: chase only), the runner
   triggers the fart with the same input family as the Jayden Gun / Heavy
   Plunger (`F` key + touch FIRE button). `_tryFire()` routing order should
   become: plunger swing → shart knocker (if charged) → gun fire.
4. **Effect:** blast a giant fart toward the runner's facing direction (or
   radial from runner — **default: nearest chaser within ~200px arc** to
   keep implementation small). On hit, stall the target chaser for a random
   3–12 seconds (reuse existing `stunnedUntil` / dazed sprite path from the
   Jayden Gun where possible).
5. **Economy:** hit pays **+50 sheebs**; miss (no chaser in range) still pays
   **+5 sheebs** and consumes the charge. Aligns with close-call and gun-hit
   tuning in the parked Gameplay Rebalancing item.
6. **Badge:** first successful shart hit on Level 4+ awards the **Flaming Ass**
   badge (`flaming-ass` id — confirm against `docs/badges.md` when coding).
   Icon: running stick figure + tiny fire glyph from the badges doc.
7. **Audio stub:** add `frontend/src/assets/audio/shart-knocker-stub.ogg`
   (or `.mp3`) — a placeholder clip Ken can replace later. Wire
   `playOneShot()` on trigger even if the file is silent/short; do not block
   the slice on a real fart recording.

## Files likely touched (Mode B)

- `frontend/src/GameEngine.js` — charge state, `_tryShartKnocker()` or inline
  branch in `_tryFire()`, stun application, sheeb payouts, badge hook.
- `frontend/src/gameContent.js` — badge entry if not already present; optional
  `SHART_KNOCKER` constants (range, min/max stun seconds).
- `frontend/src/App.jsx` — FIRE button label/color when a shart charge is held
  (mirror plunger "SWING" / gun "FIRE" pattern).
- `frontend/src/dialog.js` — optional one-liner pool on hit/miss.
- `frontend/e2e/shart-knocker.spec.js` — force Taco Bell + charge + nearest
  chaser, assert stun timer and sheeb delta (same `window.__skibEngine`
  pattern as `jayden-gun.spec.js`).

## Explicitly not in scope

- Rewriting Taco Bell Grande's base speed/steering effect.
- Level 7 / CEO of Drains or Mosaic map work.
- Gameplay Rebalancing numbers beyond this slice's +50/+5 payouts.
- Real fart SFX recording (stub only).

## Flag for Ken (optional — not blocking coding)

- **Trigger during close-call-freeze?** Default plan is chase-only so the
  ability doesn't collide with the 1-second recovery beat. Say the word if
  farting during the freeze should be allowed for comedy.
- **Facing vs nearest:** nearest-chaser-in-range is the default for a small
  slice; directional cone fart is funnier but slightly more code.

---

## Copy-paste: next coding agent (after v0.4.39 ships)

```text
Read docs/skib-sdlc.md, docs/update-directions.md, docs/roadmap.md,
docs/interactive-content-pack.md, docs/badges.md, then this file.

Prerequisite: v0.4.39 (death-log telemetry + parody warning) should already
be shipped unless Ken explicitly reordered the queue.

Your slice: Shart Knocker — Level 4+ active ability on top of the shipped
Taco Bell Grande pickup.

1. One Taco Bell Grande pickup on Level 4+ grants one shart charge.
2. FIRE / F triggers the fart when a charge is held (after plunger check,
   before gun). Hit nearest chaser in range → 3–12s stun. Hit +50 sheebs;
   miss +5 sheebs. Charge consumed either way.
3. First hit awards Flaming Ass badge (see docs/badges.md).
4. Add audio stub at frontend/src/assets/audio/shart-knocker-stub.ogg and
   playOneShot on trigger.
5. Do not change Taco Bell's base speed/steering pickup behavior.

Verification:
- cd frontend && npm run build
- cd frontend && npx playwright test
- Add frontend/e2e/shart-knocker.spec.js

After landing: update docs/version-log.md, docs/update-directions.md,
docs/roadmap.md, docs/handoffs/ledger.md, VersionModal if bumping
GAME_ITERATION. Generate roadmap-handoff-vX.Y.Z.md per SDLC. Do not bump
or deploy unless the user asks.
```
