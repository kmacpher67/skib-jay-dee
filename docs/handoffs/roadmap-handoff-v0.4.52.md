# Roadmap Handoff v0.4.52 — Turdstone Token (Resurrection Ward)

**Created by:** Claude Sonnet 4.6 — 2026-07-27
**Session mode:** Mode B (Code and delivery — shipped)
**Status:** SHIPPED — v0.4.52 deployed to production

## What shipped

New pickup: **The Turdstone Token** — a passive, single-use resurrection ward.

Full implementation detail is in `docs/version-log.md` v0.4.52 entry. Short
summary of changes:

- `frontend/src/gameContent.js` — imports `turdstone-toilet-token-perk.png`,
  re-exports as `turdstoneTokenSprite`; adds `'turdstone-token'` to
  `POSITIVE_PICKUPS`.
- `frontend/src/GameEngine.js` — constants, static sprite image load,
  `runner.hasTurdstoneToken` field, `_maybeSpawnTurdstoneToken()` (level-indexed
  1%→5% spawn), pickup-collection branch, `_triggerCaught` Turdstone branch
  (no levelIndex++, no currency loss, no chaserSpeedMod ramp, `turdstoneSaved: true`
  in payloads), `_drawPickups` center-crop drawImage branch, `_drawHud` WARD icon.
- `frontend/src/App.jsx` — `showTurdstoneOverlay` state, `turdstoneOverlayRef`,
  updated `handleCaught` / `handleCaughtProfileReady` / new `handleAcceptTurdstone`,
  Turdstone overlay JSX.
- `frontend/src/App.css` — turdstone overlay styles.
- `frontend/src/components/VersionModal.jsx` — prepended v0.4.52 entry.
- `frontend/src/version.js` — `GAME_ITERATION = 'v0.4.52'`.
- `frontend/e2e/turdstone-token.spec.js` — 3 new e2e tests (all pass).

## Ken's design decisions (Q1-Q5, settled this session)

| Q | Decision |
|---|----------|
| Q1 — Spawn rarity | Level-indexed: 1% L1, +1%/level, cap 5% L6+ |
| Q2 — Death counter | Yes, still increments (`deaths += 1`) |
| Q3 — Speed ramp | No ramp — free do-over (Epic/Rare feel) |
| Q4 — Save UX | Distinct overlay: "SAVED BY THE TURDSTONE!" pauses until player accepts |
| Q5 — HUD visibility | Small purple WARD icon visible while held |

## What's explicitly not done

- No Turdstone save sound effect (Ken mentioned toilet flush — needs audio asset).
- Player's Guide entry for Turdstone Token not added (parked — next agent can
  add it to `docs/players-guide.md`).
- `v0.4.57-plan` Rod of Poopdom `stinkyTimer` hotfix still queued — this
  shipped because Ken directed the v0.4.52 handoff explicitly.

## Copy-paste: next coding agent

```text
Read docs/skib-sdlc.md, then docs/update-directions.md, then this file.

Priority queue (oldest unfinished first):
1. docs/handoffs/roadmap-handoff-v0.4.57-plan.md — Rod of Poopdom second-teleport
   fix. stinkyTimer set on warp but never decremented. Add a `this.stinkyTimer =
   Math.max(0, this.stinkyTimer - dt)` decrement in the chase update loop
   (_updateChase or equivalent) so the ROD_OF_POOPDOM_COOLDOWN gate actually
   clears after 3s. Add e2e. Ship as v0.4.53 (check frontend/src/version.js first
   for current GAME_ITERATION).
2. After the hotfix, proceed to docs/handoffs/roadmap-handoff-v0.4.53-plan.md
   (Play Recap) or whichever is next oldest unfinished in docs/handoffs/.

Verify: cd frontend && npm run build, then npx playwright test.
After code lands: update docs/version-log.md, docs/roadmap.md,
docs/handoffs/ledger.md, docs/update-directions.md,
frontend/src/components/VersionModal.jsx. Bump GAME_ITERATION in
frontend/src/version.js. Deploy via ./scripts/deploy-static.sh <slug>.
Commit all session files.
```
