# Roadmap Handoff v0.4.80 — Boom Stick Slice E (SFX + Captions)

**Created by:** Claude Sonnet 5.5 — 2026-10-22
**Created on:** 2026-10-22
**Last updated by:** Claude Sonnet 5.5 — 2026-10-22
**Session mode:** Mode B (code and delivery)

Note: `roadmap-handoff-v0.4.80-plan.md` (issue #9) was reserved for this number but, per Ken's ordering, the leftover Slice E work shipped first. Issue #9 ships as v0.4.81.

## What Landed

- `onBoomStickSfx(name)` engine hook (`blast`, `shatter`, `reload`, `pickup`) wired in `App.jsx` via `playOneShot`; mute suppresses all.
- Reload sound plays from `_beginBoomStickReload()`, used by both the fire path and the idle reload path.
- Shatter plays once per cutaway at 0.28s (immediately under reduced motion).
- Difficulty-routed kill caption pools; empty-chamber click line.
- Tests: `frontend/e2e/boom-stick-e-sfx.spec.js`; full suite 77 passed, 1 skipped.

## Not Done

- Splat clip wiring (`roadmap-handoff-v0.4.81-plan.md`, ships as v0.4.82).
- Slice F voice and subtitles for it: needs Ken's recordings.
- Real art/SFX replacement from Alex (same filenames).
- Real-device 9:16 check of the cutaway.
- Handgun ammo table, chaser HP tiers, persistent body count, `Splat` death gag.
