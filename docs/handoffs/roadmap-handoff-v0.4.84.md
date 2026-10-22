# Roadmap Handoff v0.4.84 — Pac-Man Tunnel Egg, Slice 2

**Created by:** Claude Sonnet 5.5 — 2026-10-22
**Created on:** 2026-10-22
**Last updated by:** Claude Sonnet 5.5 — 2026-10-22
**Session mode:** Mode B (code and delivery)

Executes Slice 2 of `roadmap-handoff-v0.4.83-plan.md` (GitHub issue #8).

## What Landed

- Captions in noob / casual / 4chan-st pools plus a first-ever-discovery caption, shown through `runnerLine`.
- `onPacmanSfx('chime'|'whoosh')` engine callback; App reuses existing clips (boom-stick pickup, boost start) through `playOneShot`, so mute works.
- Play Recap line with tunnel trip count; players-guide entry.
- Test added to `frontend/e2e/pacman-tunnel.spec.js`; full suite 90 passed, 1 skipped.

## Notes

- Caption copy is agent-written placeholder; Ken asked for copy but none was provided. Edit `PACMAN_CAPTIONS` / `PACMAN_FIRST_CAPTIONS` in `GameEngine.js`.
- Tunnel trips are counted in `App.handlePacmanSfx`, not the engine.

## Follow-up v0.4.85

Stub assets added: `frontend/src/assets/pacman/pacman-egg.png`, `pacman-tunnel-left.png`, `pacman-tunnel-right.png`, `frontend/src/assets/audio/pacman-chime.mp3`, `pacman-tunnel-whoosh.mp3`. Overwrite by filename for Alex's finals.

## Not Done

- Slice 3: Alex's art/audio, dropped in by filename. Chaser tunnel use, up/down portal, #10 countdown.
- Issue #8 stays open.
