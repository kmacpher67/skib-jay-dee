# Roadmap Handoff v0.4.46 — Menu Footer Layout Fix

**Created by:** Antigravity — 2026-07-27
**Last updated by:** Composer — 2026-07-27

## Goal

Fix main-menu footer clipping on short mobile screens and improve footer
link styling.

## Changes made

- `frontend/src/App.css` — changed `.menu` from `overflow: hidden` to
  `overflow-y: auto; overflow-x: hidden` with extra bottom padding so footer
  links (Player's Guide, issues, parody warning) scroll into view on short
  viewports.
- Added `.menu-footer` / `.parody-warning` styling (smaller font, improved
  spacing, link colors).
- `frontend/src/App.jsx` — footer link grouping cleanup.

## Verification

- `npm run build` passed.
- Manual check: footer reachable via scroll on phone-height viewport.

## What's explicitly not done

- No gameplay changes.
- `.portrait-frame` wide-desktop bug remains open — tracked in
  `docs/future-versions.md`, optional fix bundled in `roadmap-handoff-v0.4.50-plan.md`.

## Next steps

Player's Guide link simplification (v0.4.45) was the next slice in queue.
