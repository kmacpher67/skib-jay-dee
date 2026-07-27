# Roadmap Handoff Plan v0.4.50 — Cosmetic Shop Sink

**Created by:** Composer — 2026-07-27
**Last updated by:** Composer — 2026-07-27
**Session mode:** Mode A (Planning — docs only, no code changes)

## Goal

Give sheebs a cosmetic-only spend path once stat upgrades are purchased —
a small, self-contained shop item with no gameplay effect.

## Proposed item

| Field | Value |
|---|---|
| id | `jump-scare-filter-neon` |
| name | Neon Jump-Scare Filter |
| price | 200 sheebs |
| effect | Cosmetic only — tints the capture jump-scare overlay magenta/cyan for this profile |
| persistence | `profile.ownedItems` (same as stat upgrades) |
| stackable | No — one purchase, permanent |

**Why this item:** jump-scare is already a distinct visual beat
(`_drawJumpscare()`); a color filter is easy to toggle via a profile flag
without touching chase mechanics. Funny, visible, zero balance risk.

## Files likely touched

- `frontend/src/gameContent.js` — add to `SHOP_ITEMS`.
- `frontend/src/App.jsx` — pass cosmetic flag to `GameCanvas` / engine if needed.
- `frontend/src/GameEngine.js` — read flag in `_drawJumpscare()` for tint.
- `frontend/e2e/cosmetic-sink.spec.js` — purchase item, force capture, assert
  tint class or canvas fill color differs.

## Optional fast-follow (same session if small)

**`.portrait-frame` wide-viewport bug** (`docs/future-versions.md`): on desktop
viewports wider than 9:16, the menu clips footer controls. Fix: change the
`@media (min-aspect-ratio: 9/16)` rule in `frontend/src/index.css` to keep
`height: 100%` / `width: auto` inside `.stage` instead of inverting to
`width: 100%` / `height: auto`. Include a Playwright test at 1280×720 that
asserts the mute button is visible.

## Explicitly not in scope

- New stat upgrades or economy rebalance.
- Multiple cosmetic tiers (one item proves the pattern).

---

## Copy-paste: next coding session (Mode B)

```text
Read docs/handoffs/roadmap-handoff-v0.4.50-plan.md.

Add "Neon Jump-Scare Filter" cosmetic shop item (200 sheebs, no stat effect).
Wire a magenta/cyan tint in _drawJumpscare() when profile owns the item.

Optional: fix .portrait-frame wide-viewport CSS per future-versions.md.

Verify: cd frontend && npm run build && npx playwright test
```
