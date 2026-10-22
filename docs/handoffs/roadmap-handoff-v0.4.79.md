# Roadmap Handoff v0.4.79 — Boom Stick Splat + Shatter Cutaway

**Created by:** Claude Sonnet 5.5 — 2026-10-22
**Created on:** 2026-10-22
**Last updated by:** Claude Sonnet 5.5 — 2026-10-22
**Session mode:** Mode B (code and delivery)

## What Landed

- Slice D in `frontend/src/GameEngine.js`: `_startCutaway()`, `_updateCutaway()`, `_drawCutaway()`, `_drawShards()`, `_stampSplotch()`, `_drawSplotches()`. `SHARD_POLYS` is a fixed seeded 6x6 jittered lattice (25 irregular quads).
- One cutaway per blast, sim frozen for its duration (hit-stop is implicit), max 1.75s; reduced-motion (`prefers-reduced-motion`) = 0.2s cracked flash then quote card, 0.9s max.
- Splotches: cap 12, stamped at 0.62s (immediately in reduced-motion), reset on level sync. Crimson vs goop by `difficulty === 'noob'`.
- `splatEffects` now holds comic particles (not text). Muzzle flash + 6px camera kick on every shot.
- Placeholder assets named per `docs/splat-effects-brief-for-alex.md`: `frontend/src/assets/splat/splat-{crimson,goop}-{1..4}.png` (imported via `SPLAT_SPRITES` in `gameContent.js`) and `frontend/src/assets/audio/boom-stick-{blast,shatter,splat,reload,pickup}.mp3` (synthesized stubs, NOT imported/wired).
- Tests: `frontend/e2e/boom-stick-d-cutaway.spec.js`; full suite 72 passed, 1 skipped.

## Not Done

- Slice E: subtitle pools, difficulty caption routing, SFX wiring + mute. Stub mp3s are ready to import.
- Slice F: final voice (needs Ken's recordings). Voice `bs-*.mp3` not stubbed.
- Real art from Alex: replace PNGs/mp3s in place with the same filenames.
- Cutaway not tested visually on a real 9:16 device; dev screenshots were on a wide desktop canvas.
- Handgun ammo table, chaser HP tiers, persistent body count, `Splat` death gag.

## Copy-Paste: Next Natural Steps

```text
Work in Mode B. Read docs/skib-sdlc.md, docs/update-directions.md,
docs/roadmap.md, docs/splat-effects-brief-for-alex.md, and
docs/handoffs/roadmap-handoff-v0.4.79.md.

Implement only Boom Stick Slice E: import the stub (or Alex's final)
boom-stick-*.mp3 files from frontend/src/assets/audio/, play blast on fire,
shatter at cutaway 0.28s, splat at 0.62s, reload during reload; mute must
suppress them. Add difficulty-routed kill caption pools in
`_pickCutawayQuote()` per the brief. Hook into GameEngine.js.

Run `cd frontend && npm run build && npx playwright test`.
Update the SDLC docs and commit. Deploy via ./scripts/deploy-static.sh.
```
