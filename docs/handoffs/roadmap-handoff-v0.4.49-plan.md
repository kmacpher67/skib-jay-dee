# Roadmap Handoff Plan v0.4.49 — Broth Slip (Raman-Aunt-Toilet Lady)

**Created by:** Composer — 2026-07-27
**Last updated by:** Composer — 2026-07-27
**Session mode:** Mode A (Planning — docs only, no code changes)

## Goal

Add Raman-Aunt-Toilet Lady as a new `chaserType` with **Broth Slip** — a
hot-ramen trail that drops friction to ~zero for 2s when the runner steps in
it, forcing drift instead of clean steering. Fills the roster's area-denial
gap (distinct from Skib-Daddy's pull and the CEO of Drains' proposed slow).

## Design reference (already settled)

- Ability concept: **resolved** 2026-07-27 — see
  `docs/level-progression-and-endgame-plan.md` Flag item 6 and
  `docs/dialog_content_chasing.md` "Broth Slip" section.
- Face: reuse `ant-k-raman` or `anti-k-raman-2` from `CHASER_FACE_POOL` (no
  new asset).
- Dialog: spawn bark, on-trail-hit taunt, themed capture line — line list
  already drafted in `dialog_content_chasing.md`.

## Recommended implementation defaults (needs Ken sign-off)

These are **recommendations**, not decisions — do not code until Ken confirms
or corrects (per `docs/skib-sdlc.md`).

| Parameter | Recommended default | Rationale |
|---|---|---|
| `chaserType` id | `raman-aunt` | Matches existing face ids |
| Base speed | `0.88×` normal chaser | Slightly slower; hazard is the trail |
| Trail spawn interval | Every `0.35s` while moving | Visible line without filling the map |
| Trail segment lifetime | `4s` | Long enough to matter, short enough to clear |
| Trail width | `28px` | Roughly runner hitbox width |
| Friction debuff | `0.05×` steering response for `2s` | "Ice physics" drift |
| Where she spawns | Level 5+ extra-chaser rotation only | Same tier as wall-hacks; map-agnostic |
| Spawn chance | `12%` when an extra chaser slot opens | Rare enough to be a surprise |

**Spawn rule recommendation:** when `_maybeSpawnExtraChaser()` fires on
`levelIndex >= 4`, roll `raman-aunt` before a generic face — do not replace
the lead chaser.

## Files likely touched (Mode B, once unblocked)

- `frontend/src/gameContent.js` — `CHASER_TYPES.raman-aunt` entry (trail
  config, face id).
- `frontend/src/GameEngine.js` — trail segment array, collision check on
  runner, friction multiplier on steering input, wire into extra-chaser spawn.
- `frontend/src/dialog.js` — `BROTH_SPAWN_LINES`, `BROTH_HIT_LINES`,
  `BROTH_CAPTURE_LINES` pools (copy from `dialog_content_chasing.md`).
- `frontend/e2e/broth-slip.spec.js` — force spawn, step in trail, assert
  drift multiplier active.

## Flag for Ken

1. Confirm or adjust the stat table above (especially spawn chance and trail
   lifetime).
2. Confirm spawn rule: Level 5+ extra-chaser rotation only (recommended) vs.
   also guaranteed on Level 7 climax roster later.

## Explicitly not in scope

- New level / map (she is rotation-only).
- New face photo.
- Audio clips (stub text bubbles only until Ken records).

---

## Copy-paste: next coding session (after Ken confirms)

```text
Read docs/handoffs/roadmap-handoff-v0.4.49-plan.md, docs/dialog_content_chasing.md
(Broth Slip section), docs/characters.md.

Only start if Ken confirmed the recommended defaults (or supplied alternatives)
in this chat.

Implement raman-aunt chaserType with Broth Slip trail hazard per the stat table.
Wire Level 5+ extra-chaser spawn roll. Add dialog pools to dialog.js.

Verify: cd frontend && npm run build && npx playwright test e2e/broth-slip.spec.js
```
