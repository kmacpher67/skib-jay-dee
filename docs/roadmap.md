# Roadmap — Skib-Jay-Dee-Toilet

Derived from `Skib-jay-dee-toilet game-init-v1.pdf` (the source design doc)
plus the running backlog gathered across sessions. Every agent follows
[docs/skib-sdlc.md](skib-sdlc.md) when picking work from here: small,
single-session increments, docs updated, work committed before stopping.

This is a living doc. Check items off (or annotate why they changed) as
they land, and append new items as they surface — don't let it go stale.

The repo now also has a lightweight code-monkey lane for bounded handoff
execution: `./scripts/run_code_monkey.sh <handoff.md>` can dispatch the
next slice to the cheaper `thinkpad-local` Ollama profile by default,
falling back to `OLLAMA_HOST` or switching to `desktop-gaming` /
OpenRouter when needed. The handoff's own bounded copy-paste block is
the prompt body.

## Where things stand (as of this session)

Done: core chase loop, jump-scare capture, face upload + random default
faces, five levels (Porcelain Palace → Pipeworks → Flooded Annex → The
Ramen Aisle → World Star Parking Lot), desktop keyboard controls, sprint,
Shleeb shop, cookie-backed profile (user id, sheebs, owned items, highest
level, lifetime deaths), skreem-on-proximity, skreem-penalty + death count
on capture, a multi-chaser mechanic (extra toilets join in if a level
runs long), and a discreet build-iteration badge tied to a shared
frontend constant plus the deploy-commit helper. All in-game text now
lives in one place, `frontend/src/dialog.js` (`CAPTURE_LINES`,
`CHASER_LINES`, `TIRED_LINES`) — edit lines there without touching
`GameEngine.js`. Chaser speed is now rubber-banded across a run: each
capture mellows it out (`CHASER_SPEED_MOD_DEATH_STEP`), each level
cleared ramps it back up (`CHASER_SPEED_MOD_LEVEL_STEP`), clamped between
`CHASER_SPEED_MOD_MIN`/`MAX` in `GameEngine.js`. Levels also run longer
now (raised `advanceAt` thresholds) and proximity skreem gain/chaser-bark
frequency were bumped up. As of v0.4.0 the game also has a first real
audio pass — chase ambience, capture sting, chaser barks, boost/tired
stingers, a cookie-persisted mute toggle — plus an experimental (rough)
lvl2 video transition. Still front-end only — no backend, no multiplayer,
no full scripted intro cinematic. See
[docs/handoffs/roadmap-handoff-v0.4.0.md](handoffs/roadmap-handoff-v0.4.0.md)
for the full session write-up and
[docs/future-versions.md](future-versions.md) for what's parked next.

## High-level phases (from the PDF + repo history)

| Phase | Focus | Status |
|---|---|---|
| 1 | Core chase loop, jump-scare, face upload, desktop controls | Done |
| 1.5 | Content pass: more levels, shop, persistence, death/skreem economy | Done (this session) |
| 2 | Audio pass | First pass done (v0.4.0) — see [sound-effects-howto.md](sound-effects-howto.md) and [future-versions.md](future-versions.md) for polish left |
| 2.5 | World Star intro cinematic | Not started (an experimental lvl2 video-transition clip landed as a rough proof of concept, see below) |
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

Recommended next-session order, if we want the tightest handoff:
extra-chaser speed ramp (done, v0.4.8) -> Pipeworks 4-chaser/max-speed clear condition
-> lvl2 video timing fix + death-visual verification.

- [x] **Audio 1: SFX plumbing.** Landed v0.4.0 — real clips wired for
  menu loop, capture sting, chase ambience, boost/tired stingers, chaser
  barks, and level start/clear, plus a cookie-persisted mute toggle. See
  [sound-effects-howto.md](sound-effects-howto.md) and
  [future-versions.md](future-versions.md) for what's still rough
  (volume ducking, a real menu theme).
- [ ] **Audio 2: capture-line and chaser-bark voice clips, 1:1 with text.**
  v0.4.0 wired a themed *pool* of chaser-bark/scream/taunt clips that
  plays alongside the random `CHASER_LINES` text, but it's not a matched
  pair per line yet. Record one clip per `CAPTURE_LINES` and
  `CHASER_LINES` entry for a real 1:1 match. See
  [future-versions.md](future-versions.md).
- [ ] **Audio 3: ambient chase loop.** Landed v0.4.0 —
  `chase-ambient-bopbop.mp3` loops at low volume while `screen ===
  'playing'` in `App.jsx`. Ducking during `caught`/`level-up` not done
  yet, tracked in [future-versions.md](future-versions.md). User feedback:
  "skibby bob bob audio is little over the top to begin" — needs a delay or
  layering so it starts after 15 seconds or when the first extra chaser joins.
- [x] **Audio 4: boost skreem stinger.** Landed v0.4.0 —
  `onBoostStart` now plays `boost-start-igottago-x2.mp3`.
- [x] **Audio 5: stamina-exhausted flat tone.** Landed v0.4.0 —
  `onTired` now plays `runner-tired-run.mp3`.
- [ ] **Intro cinematic.** Script the PDF's "World Star" open (Jayden
  recording, Skib bursts from stall, screen cracks) as a pre-`chase` phase
  in `GameEngine.js`, reusing the existing banner/zoom drawing primitives.
  Front-end only, no new assets required beyond what's already scripted in
  the PDF. An experimental, rough lvl2 transition *video* (not this
  cinematic) landed in v0.4.0 as a separate proof of concept — see
  [future-versions.md](future-versions.md) for its follow-ups.
- [x] **Build iteration badge + deploy commit helper.** Added a shared
  `frontend/src/version.js` constant, a discreet iteration label in the
  menu/HUD, and a deploy helper that builds, syncs, and commits only the
  `skib-jay-dee-toilet-game/` subtree with a short iteration slug.
- [ ] **Code Monkey: host-profile routing.** Make the bounded code-monkey
  lane understand named Ollama host profiles so it can switch between
  the cheap `thinkpad-local` T2000 box and the remote `desktop-gaming`
  host without editing URLs or restarting anything. Keep the cheap
  ThinkPad profile as the default, use `OLLAMA_HOST` as the shell-level
  fallback, and support profile-specific env vars like
  `JUICY_LLM_LOCAL_OLLAMA_BASE_URL` /
  `JUICY_LLM_DESKTOP_GAMING_OLLAMA_BASE_URL`. This is a tooling slice,
  not gameplay.
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
- [ ] **Funny near-capture interlude.** When a skib gets too close, pause
  the chase, pop `jayden-getting-captured.jpg` full-screen, and stamp the
  user's parody captions over it as a short meme card. Start with the
  supplied "Noob-noob no no!!!" / "Thanks, Noob-Noob. This guy gets it."
  style lines, then pick one at random from a small caption pool. This is
  a separate beat from the actual caught/jump-scare state, not a new
  death screen.
- [x] **New chaser: Sky-Diver (Motor Killer).** Landed in the current worktree —
  `frontend/src/assets/sky-diver-motor-killer.png` copied in, imported in
  `frontend/src/gameContent.js`, and added to `CHASER_FACE_POOL` as
  `sky-diver-motor-killer`.
- [ ] **New chaser: Yoodeling Unc, second pose.** A second costume photo
  for the existing "Yoodelling Unc Alex" bit was shared but **not yet
  saved to the repo** — ask the user to drop it in `images/` (e.g.
  `images/yoodelling-unc-alex-2.png`) before starting this item. Once on
  disk, wire it as an *additional* `CHASER_FACE_POOL` entry alongside the
  existing `yoodelling-unc-alex` one, not a replacement. See
  `docs/characters.md`.
- [x] **Chaser face randomization fix.** Landed this session —
  `_maybeSpawnExtraChaser()` (`frontend/src/GameEngine.js`) now rolls an
  independent `randomFrom(CHASER_FACE_POOL)` pick for every extra chaser
  it spawns instead of copying `this.chaser.face`. The lead chaser
  (`this.chasers[0]`) keeps the menu-selected/uploaded face via
  `setFaces()` exactly as before — only chasers spawned later by the
  multi-chaser mechanic now roll independently.
- [x] **Runner pose-to-state mapping.** Landed this session —
  `GameEngine.js` now swaps the runner's face to `jayden-getting-captured`
  the instant a capture happens, holds `jayden-captured` once the
  jump-scare zoom finishes, and restores the run's original face (random
  default, or the player's custom upload untouched) once the chase
  resumes. See `setFaces()` / `_triggerCaught()` / `_updateCaught()` in
  `frontend/src/GameEngine.js`, and `docs/characters.md`.
- [ ] **Follow-up (needs Ken): supply distinct getting-captured/captured
  and uncaring/default photos.** The pose-swap logic above is wired
  correctly but two of the five `RUNNER_FACE_POOL` entries turned out to
  be byte-identical duplicates of two others (confirmed via `md5sum`):
  `jayden-getting-captured.jpg` == `jayden-captured.jpg`, and
  `jayden-uncaring-4029.jpg` == `jayden-default.jpg`. Until real distinct
  photos exist for those ids, the capture beat's zoom-in and zoomed-hold
  will show the same photo twice. Ask Ken for the actual distinct shots
  (or confirm the duplication is intentional and collapse the pool to 3
  unique poses instead of 5). See `docs/characters.md`.
- [ ] **Multiplayer spike (Phase 5).** Only after everything above feels
  solid. Make the frontend actually connect to `/ws/match`, sync two
  browser tabs, server decides who's Chaser. This is the biggest single
  item in the whole backlog — expect it to span multiple sessions, and
  explicitly plan the sub-increments before writing code.
- [ ] **Lvl2 transition video fires too early — gate it to clearing
  Pipeworks, not arriving at it.** **Fully planned as of v0.4.3-plan, ready
  to implement** — see `docs/handoffs/roadmap-handoff-v0.4.3-plan.md` for
  the exact edits. Summary: `App.jsx:156-166` (`handleLevelChange`)
  triggers `setShowLvl2Transition(true)` when `index === 2`, which is the
  *arrival* index reported by `GameEngine.onLevelChange` the moment the
  runner reaches Pipeworks (Level 2) — i.e. right after clearing Level 1.
  Fix: make `onLevelClear()` (`GameEngine.js:685`) pass
  `{ index: this.levelIndex + 1, name: this.level.name }` instead of
  firing with no arguments, move the `index === 2` check into
  `handleLevelClear` (`App.jsx:112`) alongside its existing audio call,
  and delete the old check from `handleLevelChange`. No new assets
  needed, same `lvl2-transition.mp4` clip.
- [ ] **RESOLVED — Tie Pipeworks's clear condition to surviving 5
  simultaneous chasers at their max speed, gated by a skreem threshold.**
  User confirmed the design and requested 5 skibs. Decision, spelled out for implementation:
  1. Bump `MAX_CHASERS` from `3` to `5` (`GameEngine.js:301`) so
     Pipeworks (and any level that runs long) can actually reach a
     5-chaser pile-on.
  2. Pipeworks's clear condition (`advanceAt: 68`, `GameEngine.js:762`)
     should stop being a plain skreem-timer and instead only count
     toward clearing once **all 4 chasers are active and each is at its
     own max speed** — i.e. the lead chaser's `chaserSpeedMod` at
     `CHASER_SPEED_MOD_MAX` (`GameEngine.js:311`) *and* every extra
     chaser's per-chaser spawn-ramp (see the speed-ramp item below) has
     finished climbing to 1.0. Only skreems earned while that "5 chasers,
     all maxed" state holds should count toward the threshold — treat it
     as a separate counter/gate, not just reusing `levelSkreems`.
  3. The exact skreem threshold ("XX") is intentionally a tunable number,
     not fixed by this plan — pick something in the neighborhood of the
     existing `advanceAt: 68` for Pipeworks and playtest it; expose it as
     a named constant (e.g. `PIPEWORKS_MAX_PRESSURE_SKREEM_GOAL` or a new
     per-level field) rather than a magic number, so it's easy to retune
     without hunting through `GameEngine.js`.
  Depends on the speed-ramp item below (need "each chaser at max speed"
  to be a checkable state) and blocks/feeds the lvl2-video item above
  (the video should only show once this new "cleared Pipeworks" event
  fires, not the old flat `advanceAt` check).
- [x] **Extra chasers join slow and should ramp up over a level, not
  stay fixed.** Landed v0.4.8 (Session 1 of the v0.4.3-plan backlog) —
  `_maybeSpawnExtraChaser()` (`GameEngine.js`) no longer applies a flat
  `* 0.92` discount; new chasers spawn with a `joinRamp: 0` field that
  climbs to `1` over `CHASER_JOIN_RAMP_SECONDS` (5s), and the chase-update
  loop multiplies `lerp(CHASER_JOIN_RAMP_START, 1, joinRamp)` into the
  existing `chaser.baseSpeed * this.chaserSpeedMod` calc — layered on top
  of, not replacing, the run-level rubber-band. Lead chaser has no
  `joinRamp` field (`?? 1` keeps it always fully ramped). Covered by
  `frontend/e2e/chaser-join-ramp.spec.js`. See
  `docs/handoffs/roadmap-handoff-v0.4.8.md`.
- [ ] **RESOLVED — no new death video, keep the original jump-scare
  working.** User confirmed: "my bad the ded is still the original" —
  there is no new death-specific video wanted; option (a) from the
  original writeup is correct. The existing jump-scare zoom
  (`_drawJumpscare()`, canvas-drawn when `phase === 'caught'`, see
  `GameEngine.js:873`) is and stays the only death feedback — don't add
  any new asset or plumbing for this. The one remaining task is
  verification, not a decision: confirm the jump-scare still fires
  unobstructed on every capture and isn't visually blocked by the lvl2
  transition overlay, since `showLvl2Transition`'s `<video>`
  (`App.jsx:281-291`) is an absolutely-positioned overlay stacked on top
  of `GameCanvas` and could obscure the jump-scare if a capture and the
  lvl2 transition ever became simultaneous. Once the lvl2-video timing
  fix above lands (video only shows after Pipeworks clears, not on
  arrival), double check the two states genuinely can't overlap, then
  check this item off — no code changes expected beyond that
  verification unless a real overlap is found.

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
