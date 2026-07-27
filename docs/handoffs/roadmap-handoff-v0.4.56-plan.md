# Roadmap Handoff Plan v0.4.56 — Runner Pose Pool Collapse

**Created by:** Composer — 2026-07-27
**Last updated by:** Composer — 2026-07-27
**Session mode:** Mode A — **code-ready** (Ken confirmed 2026-07-27)

## Source

Ken: **collapse `RUNNER_FACE_POOL` to 3 unique poses** (distinct photos may
arrive later). Confirmed via `md5sum`: `jayden-getting-captured` ==
`jayden-captured`, `jayden-uncaring` == `jayden-default`.

## Target pool (3 poses)

| id | used for |
|---|---|
| `jayden-default` | Neutral run face (merge uncaring into this) |
| `jayden-skibby` | Grinning / chaos pose |
| `jayden-captured` | Capture beat zoom-in **and** zoomed hold (merge getting-captured into this) |

## Files likely touched

- `frontend/src/gameContent.js` — remove duplicate pool entries; keep
  `RUNNER_STATE_FACES` mapping pointed at the 3 ids above.
- `frontend/src/GameEngine.js` — verify `setFaces()` / capture beat still swaps
  correctly (getting-captured → captured can become same id for both states, or
  skip mid-zoom swap if identical).
- `docs/characters.md` — update pose table to 3 entries; note Ken may add
  distinct photos later without re-expanding pool unless asked.

## Explicitly not in scope

- Deleting asset files from `frontend/src/assets/` (orphan cleanup optional).
- New photo shoots — Ken may drop replacements later.

## Copy-paste: Mode B

```text
Read docs/handoffs/roadmap-handoff-v0.4.56-plan.md and docs/characters.md.

Collapse RUNNER_FACE_POOL to 3 unique ids. Fix capture face-swap logic if the
getting-captured/captured distinction collapses to one image.

Verify: cd frontend && npm run build && npx playwright test e2e/caught-face.spec.js
```
