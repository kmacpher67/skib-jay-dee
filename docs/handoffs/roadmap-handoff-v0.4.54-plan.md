# Roadmap Handoff Plan v0.4.54 — Cool Play: Near-Miss Burst

**Created by:** Composer — 2026-07-27
**Last updated by:** Composer — 2026-07-27
**Session mode:** Mode A — **code-ready** (Ken confirmed 2026-07-27)

## Source

Ken chose **near-miss particle burst first** from the Cool Play options in
`roadmap-handoff-v0.4.48-plan.md`. Corner-slide skid marks deferred.

## Slice spec

When the runner **escapes** the existing `near-capture` proximity band (chaser
was within range, capture did not happen), spawn:

1. Short radial particle burst at runner position (~0.3s, 8–12 particles).
2. Brief screen-edge vignette pulse (~0.2s, subtle).

Reuse existing near-capture / close-call detection — **no new AI, no physics
changes.**

## Files likely touched

- `frontend/src/GameEngine.js` — detect escape-from-near-capture edge;
  particle array + draw pass; optional vignette in `_draw` overlay.
- `frontend/e2e/near-miss-burst.spec.js` — force near-capture then escape via
  `window.__skibEngine` debug hook.

## Explicitly not in scope

- Corner-slide visuals (fast-follow).
- Dynamic FOV, slide physics, stamina changes.

## Copy-paste: Mode B

```text
Read docs/handoffs/roadmap-handoff-v0.4.54-plan.md.

Add near-miss particle burst + vignette pulse when runner escapes near-capture
proximity. No gameplay stat changes.

Verify: cd frontend && npm run build && npx playwright test
```
