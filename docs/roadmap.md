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
fallback to `OLLAMA_HOST` or switch to `desktop-gaming` /
OpenRouter when needed. The handoff's own bounded copy-paste block is
the prompt body.

## Where things stand (as of this session)

Done: core chase loop, jump-scare capture, face upload + random default
faces, five levels (Porcelain Palace → Pipeworks → Flooded Annex → The
Ramen Aisle → World Star Parking Lot), desktop keyboard controls, sprint,
Shleeb shop, cookie-backed profile (user id, sheebs, owned items, highest
level, lifetime deaths), skreem-on-proximity, skreem-penalty + death count
on capture, a multi-chaser mechanic (extra toilets join in if a level runs
long, with Pipeworks tuned for five simultaneous chasers), and a discreet build-iteration badge tied to a shared
frontend constant plus the deploy-commit helper. All in-game text now
lives in one place, `frontend/src/dialog.js` (`CAPTURE_LINES`,
`CHASER_LINES`, `TIRED_LINES`) — edit lines there without touching
`GameEngine.js`. Chaser speed is now rubber-banded across a run: each
capture mellows it out (`CHASER_SPEED_MOD_DEATH_STEP`), each level
cleared ramps it back up (`CHASER_SPEED_MOD_LEVEL_STEP`), clamped between
`CHASER_SPEED_MOD_MIN`/`MAX` in `GameEngine.js`. Levels also run longer
now (raised `advanceAt` thresholds) and proximity skreem gain/chaser-bark
frequency were bumped up. As of v0.4.0 the game also has a first real
audio pass — chase ambience (now layered in later), capture sting, chaser
barks, boost/tired stingers, a cookie-persisted mute toggle — plus an
experimental (rough) lvl2 video transition whose trigger now waits for
Pipeworks clear and an additional hall-coverage / 4-skib survival gate.
Still front-end only — no backend, no multiplayer, no full scripted intro
cinematic. See
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
| 4 | Oval/masked face-crop on upload instead of stretch | Done (v0.4.14) |
| 5 | FastAPI WebSocket multiplayer, server-authoritative roles | Backend scaffolded only |
| 6 | Mongo-backed profile (replaces cookies) | Not started |

## Plan: handling levels and new maps (plan only — not implemented)

The current level system (`frontend/src/GameEngine.js`, `LEVELS` array +
buildXxx() map functions) works but doesn't scale well past ~6-8 levels
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
extra-chaser speed ramp (done, v0.4.8) -> Pipeworks 5-chaser clear +
lvl2 timing + ambient layering (done, v0.4.10) -> Audio 2: capture-line
and chaser-bark voice clips, 1:1 with text.

- [x] **Fix initial Sheebs balance.** Landed v0.4.16 — new profiles now
  start at `0` sheebs instead of `200` (`normalizeProfile()` in
  `frontend/src/lib/cookies.js`). Existing persisted profiles are
  unaffected.
- [x] **Fix skreem-loop bug on the menu.** Landed v0.4.16 — the first
  pointerdown on the menu was starting `jayden-skreem-loop.m4a` playing
  audibly and looping forever instead of silently priming it for later
  autoplay. `startMenuAudio()` in `frontend/src/App.jsx` now primes at
  `volume: 0`/`loop: false` and pauses itself once `play()` resolves.
  Covered by `frontend/e2e/menu-audio-prime.spec.js`.
- [x] **Dad Case Environmental Traps.** Landed in v0.4.17 — visual darkening overlay and a text-stubbed sound effect when the "Dad Case" chaser spawns via the multi-chaser mechanic.
- [ ] **Deaths history log.** The menu's "Deaths" pill (`App.jsx`) is
  read-only display of a lifetime counter with no click handler — tapping
  it does nothing today. Add a per-death record (timestamp, level, maybe
  which chaser caught you) to the cookie profile and a small
  modal/panel that opens on tap to show it. See
  [gameplay-mechanics.md](gameplay-mechanics.md#deaths-counter-no-history-log).
- [ ] **Sheebs penalty on capture.** Dying currently only costs `skreems`
  (30% of the in-run proximity meter, `DEATH_SKREEM_PENALTY` in
  `GameEngine.js`) — sheebs (the persistent shop currency) are untouched.
  Add a flat sheebs penalty on capture (e.g. `-20`, floored at `0`) as its
  own constant next to `DEATH_SKREEM_PENALTY`. Note the "slow the chasers
  down on death" half of this ask is already implemented
  (`CHASER_SPEED_MOD_DEATH_STEP`) — this item is only the missing sheebs
  half. See
  [gameplay-mechanics.md](gameplay-mechanics.md#death-penalty-what-actually-happens-on-capture).
- [ ] **Tune the level-1 → Pipeworks advance threshold.** `LEVELS[0].advanceAt
  = 26` in `GameEngine.js` can be crossed in a couple seconds of close
  pursuit since skreem gain is proximity-based
  (`dt * (300 - dist) * 0.06`), which reads as "Pipeworks arrives
  instantly." This is a different mechanism from the already-tuned
  Pipeworks-clear cinematic gate (hall coverage + 4-skib survival,
  landed v0.4.10/v0.4.15) — don't re-tune that one by mistake. See
  [gameplay-mechanics.md](gameplay-mechanics.md#round--level-advancement-why-does-the-round).
- [ ] **Remove dead `initialSheebs = 200` default.** `GameEngine.js`'s
  constructor still defaults to `200` if no `initialSheebs` is passed,
  left over from before the v0.4.16 cookie-default fix. `App.jsx` always
  passes the real profile value so this never fires in practice, but it's
  misleading to read. Small cleanup, bundle with another GameEngine
  session rather than its own.
- [ ] **Version page.** Add a simple page/panel to the menu that shows
  the current `GAME_ITERATION` (`frontend/src/version.js`) plus a short
  changelog pulled from or mirroring `docs/handoffs/ledger.md`. Front-end
  only, no new persistence needed.
- [ ] **Game identity & new profiles (multiple save slots).** Let a
  player keep their existing cookie-backed profile and also start a new
  one, still cookie-only (no backend) — e.g. a small slot picker on the
  menu that swaps which `sjdt_profile_v1`-style cookie is active. Needs
  a bit of design thought on how slot switching interacts with
  `frontend/src/lib/cookies.js`'s single-cookie assumption before
  coding.
- [x] **Audio 1: SFX plumbing.** Landed v0.4.0 — real clips wired for
  menu loop, capture sting, chase ambience, boost/tired stingers, chaser
  barks, and level start/clear, plus a cookie-persisted mute toggle. See
  [sound-effects-howto.md](sound-effects-howto.md) and
  [future-versions.md](future-versions.md) for what's still rough
  (volume ducking, a real menu theme).
- [ ] **Audio 2: capture-line and chaser-bark voice clips, 1:1 with text.**
  **Note: This is an optional enhancement.** The dialog is fully playable 
  as non-audio visual popups (speech bubbles/text), so audio is not 100% 
  required for those playing muted (e.g. at work/church).
  v0.4.0 wired a themed *pool* of chaser-bark/scream/taunt clips that
  plays alongside the random `CHASER_LINES` text, but it's not a matched
  pair per line yet. If desired, record one clip per `CAPTURE_LINES` and
  `CHASER_LINES` entry for a real 1:1 match. See
  [future-versions.md](future-versions.md) and [dialog_content_chasing.md](dialog_content_chasing.md).
- [x] **Audio 3: ambient chase loop.** Landed v0.4.10 —
  `chase-ambient-bopbop.mp3` now stays quiet on chase start and only
  arms after roughly 15 seconds or the first extra chaser spawn,
  whichever happens first. Ducking during `caught`/`level-up` is still
  future work, tracked in [future-versions.md](future-versions.md).
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
- [x] **Face crop on upload.** Landed v0.4.14 — `FaceUpload.jsx` now
  center-crops each uploaded photo to a square on an offscreen canvas,
  clips it with an ellipse mask, and re-exports it as a PNG data URL
  before handing it to the parent. `_drawEntity()` needed no changes
  since the transparency is baked into the uploaded image itself. See
  `frontend/e2e/face-crop-verify.spec.js`.
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
- [x] **Funny near-capture interlude.** When a skib gets too close, pause
  the chase, pop `jayden-getting-captured.jpg` full-screen, and stamp the
  user's parody captions over it as a short meme card. Start with the
  supplied "Noob-noob no no!!!" / "Thanks, Noob-Noob. This guy gets it."
  style lines, then pick one at random from a small caption pool. This is
  a separate beat from the actual caught/jump-scare state, not a new
  death screen. Landed in v0.4.12.
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
- [x] **Lvl2 transition video fires too early — gate it to clearing
  Pipeworks, not arriving at it.** Landed v0.4.10 — `GameEngine.js`
  now calls `onLevelClear({ index: this.levelIndex + 1, name:
  this.level.name })`, `App.jsx` moved the `index === 2` check into
  `handleLevelClear`, and the experimental `lvl2-transition.mp4` only
  appears after Pipeworks is actually cleared.
- [x] **RCA: lvl2 transition still fired too early for playtime, and the
  game could crash shortly after the video starts.** Landed v0.4.15 —
  `GameEngine.js` now tracks Pipeworks hall coverage plus a 4-skib
  survival timer and only reports `showLvl2Transition: true` when both
  gates are met; `App.jsx` now only mounts the overlay when that flag is
  present. Playwright now covers the blocked gate path, the allowed path,
  the capture-dismiss path, and the end-of-playback path; browser probes
  in Chromium didn't surface a page error when the transition played all
  the way through.
- [x] **RESOLVED — Tie Pipeworks's clear condition to surviving 5
  simultaneous chasers at their max speed, gated by a skreem threshold.**
  User confirmed the design and the current tuning now uses 5 skibs.
  Landed v0.4.10 on top of v0.4.9's clear logic:
  1. Bumped `MAX_CHASERS` from `4` to `5` (`GameEngine.js:306`).
  2. Pipeworks's clear condition now requires all 5 chasers to be active and fully ramped before accumulating `pipeworksSkreems`.
  3. Kept `PIPEWORKS_MAX_PRESSURE_SKREEM_GOAL = 68`; Pipeworks now advances when `pipeworksSkreems >= PIPEWORKS_MAX_PRESSURE_SKREEM_GOAL`.
  4. Browser-verified the five-chaser setup still clears cleanly.
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
- [x] **RESOLVED — no new death video, keep the original jump-scare
  working.** User confirmed: "my bad the ded is still the original" —
  there is no new death-specific video wanted; option (a) from the
  original writeup is correct. The existing jump-scare zoom
  (`_drawJumpscare()`, canvas-drawn when `phase === 'caught'`, see
  `GameEngine.js:873`) is and stays the only death feedback. The browser
  verification for the lvl2 timing fix confirmed the video only appears
  after Pipeworks clears, so it no longer overlaps the catch state on
  arrival.
