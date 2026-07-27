# Roadmap Handoff Plan v0.4.49 — Broth Slip (Raman-Aunt-Toilet Lady)

**Created by:** Composer — 2026-07-27
**Last updated by:** Composer — 2026-07-27 (Ken approved defaults)
**Session mode:** Mode A → **code-ready** (Ken confirmed 2026-07-27)

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

## Recommended implementation defaults — **CONFIRMED by Ken 2026-07-27**

Ken approved the stat table below as-is and confirmed **Level 5+ extra-chaser
rotation only** (not Level 7 climax roster yet).

| Parameter | Value |
|---|---|
| `chaserType` id | `raman-aunt` |
| Base speed | `0.88×` normal chaser |
| Trail spawn interval | Every `0.35s` while moving |
| Trail segment lifetime | `4s` |
| Trail width | `28px` |
| Friction debuff | `0.05×` steering response for `2s` |
| Where she spawns | Level 5+ extra-chaser rotation only (`levelIndex >= 4`) |
| Spawn chance | `12%` when an extra chaser slot opens |

When `_maybeSpawnExtraChaser()` fires on `levelIndex >= 4`, roll `raman-aunt`
before a generic face — do not replace the lead chaser.

## Flag for Ken — RESOLVED 2026-07-27

1. ~~Confirm or adjust the stat table~~ — **approved as written.**
2. ~~Confirm spawn rule~~ — **Level 5+ rotation only** (Level 7 roster deferred).

- `frontend/src/gameContent.js` — `CHASER_TYPES.raman-aunt` entry (trail
  config, face id).
- `frontend/src/GameEngine.js` — trail segment array, collision check on
  runner, friction multiplier on steering input, wire into extra-chaser spawn.
- `frontend/src/dialog.js` — `BROTH_SPAWN_LINES`, `BROTH_HIT_LINES`,
  `BROTH_CAPTURE_LINES` pools (copy from `dialog_content_chasing.md`).
- `frontend/e2e/broth-slip.spec.js` — force spawn, step in trail, assert
  drift multiplier active.

## Files likely touched (Mode B)

- New level / map (she is rotation-only).
- New face photo.
- Audio clips (stub text bubbles only until Ken records).

---

## Copy-paste: next coding session

```text
Read docs/handoffs/roadmap-handoff-v0.4.49-plan.md (Ken confirmed 2026-07-27).

Implement raman-aunt chaserType with Broth Slip per the confirmed stat table.
Level 5+ extra-chaser rotation only. Dialog from dialog_content_chasing.md.

Verify: cd frontend && npm run build && npx playwright test e2e/broth-slip.spec.js
```
