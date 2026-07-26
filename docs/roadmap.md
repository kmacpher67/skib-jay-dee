# Roadmap — Skib-Jay-Dee-Toilet

Derived from `Skib-jay-dee-toilet game-init-v1.pdf` (the source design doc)
plus the running backlog gathered across sessions. Every agent follows
[docs/skib-sdlc.md](skib-sdlc.md) when picking work from here: small,
single-session increments, docs updated, work committed before stopping.

This is a living doc. Check items off (or annotate why they changed) as
they land, and append new items as they surface — don't let it go stale.

## Where things stand (as of this session)

Done: core chase loop, jump-scare capture, face upload + random default
faces, five levels (Porcelain Palace → Pipeworks → Flooded Annex → The
Ramen Aisle → World Star Parking Lot), desktop keyboard controls, sprint,
Shleeb shop, cookie-backed profile (user id, sheebs, owned items, highest
level, lifetime deaths), skreem-on-proximity, skreem-penalty + death count
on capture, a multi-chaser mechanic (extra toilets join in if a level
runs long), and a discreet build-iteration badge tied to a shared
frontend constant plus the deploy-commit helper. Still front-end only —
no backend, no multiplayer, no audio, no intro cinematic.

## High-level phases (from the PDF + repo history)

| Phase | Focus | Status |
|---|---|---|
| 1 | Core chase loop, jump-scare, face upload, desktop controls | Done |
| 1.5 | Content pass: more levels, shop, persistence, death/skreem economy | Done (this session) |
| 2 | Audio pass | Not started — see [sound-effects-howto.md](sound-effects-howto.md) |
| 2.5 | World Star intro cinematic | Not started |
| 3 | More characters/abilities per PDF roster, role-swapping | Not started |
| 4 | Oval/masked face-crop on upload instead of stretch | Not started |
| 5 | FastAPI WebSocket multiplayer, server-authoritative roles | Backend scaffolded only |
| 6 | Mongo-backed profile (replaces cookies) | Not started |

## Plan: handling levels and new maps (plan only — not implemented)

The current level system (`frontend/src/GameEngine.js`, `LEVELS` array +
`buildXxx()` map functions) works but doesn't scale well past ~6-8 levels
by hand-authoring wall rectangles. Proposed evolution, in order — each is
its own increment, don't do them all at once:

1. **Extract level data from code.** Move each level's walls/puddles/theme
   out of hardcoded `buildXxx()` functions into a plain data structure
   (array of wall rects + theme colors) per level, still in
   `GameEngine.js` or a new `frontend/src/levels/` folder. Same visual
   result, but now a level is data, not a function — sets up everything
   below.
2. **Tile-based authoring.** Once levels are data, support defining a
   level as a small 2D grid of tile codes (`#` = wall, `~` = puddle, `.` =
   floor) instead of raw pixel rects. Much faster to hand-author a new
   map, and closer to the PDF's "mungus game layout type map" description.
3. **Per-level chaser roster.** The PDF roster (Skibidty Toilet Guy,
   Skib-Daddy, Raman-Aunt-Toilet Lady) implies different levels could
   default to different chaser "types" with different speed/ability
   profiles, not just a reskinned face. Once Phase 3 (character abilities)
   lands, wire a `chaserType` per level.
4. **Level unlock gating / direct select.** Right now all levels are
   reached in one continuous run (advance via skreem threshold). Consider
   letting the menu jump straight to any level up to
   `profile.highestLevel` — quality-of-life, not an architecture change,
   safe to do anytime after item 1.
5. **The PDF's "Infinite Tiled Labyrinth."** The launch map in the PDF is
   described as infinitely regenerating corridors, not a fixed layout.
   That's a genuinely different rendering/collision model (procedural
   chunk generation around the player) — treat as its own future phase,
   only after tile-based authoring (2) exists to generate chunks from.

Do not start implementing any of this without picking one numbered item
and treating it as its own increment — this section is a plan, not a
sprint.

## Incremental backlog

Each item below is scoped to fit in one agent session. Pull the next
open one, or reorder if something else is more urgent — just keep items
this small.

- [ ] **Audio 1: SFX plumbing.** Starter menu/caught audio is now wired
  in `App.jsx` with `frontend/src/assets/audio/jayden-skreem-loop.m4a`;
  still to do: a proper mute toggle in cookies and a cleaner split
  between menu music, line clips, and the caught sting. See
  [sound-effects-howto.md](sound-effects-howto.md).
- [ ] **Audio 2: capture-line and chaser-bark voice clips.** Record/collect
  one clip per `CAPTURE_LINES` and `CHASER_LINES` entry, play the matching
  clip instead of (or alongside) the on-screen text.
- [ ] **Audio 3: ambient chase loop.** Looping low-volume bass-boost hum
  while `phase === 'chase'`, ducked or stopped during `caught`/`level-up`.
- [ ] **Intro cinematic.** Script the PDF's "World Star" open (Jayden
  recording, Skib bursts from stall, screen cracks) as a pre-`chase` phase
  in `GameEngine.js`, reusing the existing banner/zoom drawing primitives.
  Front-end only, no new assets required beyond what's already scripted in
  the PDF.
- [x] **Build iteration badge + deploy commit helper.** Added a shared
  `frontend/src/version.js` constant, a discreet iteration label in the
  menu/HUD, and a deploy helper that builds, syncs, and commits only the
  `skib-jay-dee-toilet-game/` subtree with a short iteration slug.
- [ ] **Face crop on upload.** Replace the raw-square face draw in
  `FaceUpload.jsx`/`_drawEntity()` with an oval crop/mask step at upload
  time (canvas-based crop, no new dependency needed).
- [ ] **Shop item: cosmetic sink.** Now that sheebs have a real economy
  (level rewards, death penalty), consider a cosmetic-only shop item
  (e.g. a jump-scare filter skin) so sheebs have somewhere to go once
  stat upgrades are maxed. Small, self-contained.
- [x] **Level expansion.** Added The Ramen Aisle and World Star Parking Lot
  (5 levels total) — landed this session.
- [ ] **Level data extraction** — roadmap item 1 above. Do this before
  hand-authoring a 6th/7th level.
- [x] **Death/skreem economy.** Lifetime death counter (persisted via
  cookies) and a skreem penalty on capture — landed this session.
- [x] **Multi-chaser pressure.** Extra toilets join in if a level runs
  long without a catch (capped, resets on capture/level change) — landed
  this session.
- [ ] **New character: pick one PDF roster entry** (Skib-Daddy-Toilet Guy
  or Raman-Aunt-Toilet Lady) and give it a distinct ability, not just a
  reskin — e.g. Skib-Daddy's Plunger Launch as a periodic speed burst.
  Depends on nothing above; can happen anytime.
- [ ] **Multiplayer spike (Phase 5).** Only after everything above feels
  solid. Make the frontend actually connect to `/ws/match`, sync two
  browser tabs, server decides who's Chaser. This is the biggest single
  item in the whole backlog — expect it to span multiple sessions, and
  explicitly plan the sub-increments before writing code.

## Session rules

- Keep each session to one meaningful increment (or a small tightly-related
  cluster, as this session did for the content pass).
- Build after changes with `cd frontend && npm run build`.
- Update `docs/version-log.md`, `docs/update-directions.md`, and this file
  whenever a meaningful change lands.
- Do not treat the backend scaffold as in scope unless the user asks for it.

## Constraints (see also skib-sdlc.md)

- Front-end only until the user explicitly asks for backend/multiplayer
  work.
- Keep the 9:16 portrait layout.
- Don't break cookie persistence, random default faces, or the
  single-session-increment discipline above.
