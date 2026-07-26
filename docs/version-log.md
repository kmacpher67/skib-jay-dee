# Version Log — Skib-Jay-Dee-Toilet

This file memorializes the design and plan decisions made during the
front-end upgrade pass. Starting v0.4.0, each version also gets a fuller
session write-up in `docs/handoffs/roadmap-handoff-vX.Y.Z.md` and a
one-line-per-change entry in `docs/handoffs/ledger.md` — this file stays
focused on *why*, those two are the *what* and *when*.

## Code Monkey orchestration pass — 2026-07-26

### What changed

- Added a lightweight code-monkey lane for bounded agent runs:
  `scripts/run_code_monkey.sh` now dispatches a handoff prompt through
  `scripts/code_monkey_direct.py`, which extracts the fenced copy-paste
  block and can target local Ollama via `OLLAMA_HOST` or OpenRouter.
- Added `AGENTS.md` at the repo root so the bounded prompt has a stable
  first stop, and updated `docs/skib-sdlc.md`, `docs/update-directions.md`,
  `docs/next-agent-coding-brief.md`, `docs/roadmap.md`, and the current
  open handoff (`docs/handoffs/roadmap-handoff-v0.4.5-plan.md`) to call
  out the lane.

### Design decisions

- Kept the lane intentionally thin: a prompt extractor, backend/model
  resolver, and OpenAI-compatible chat caller are enough for this repo's
  automation without introducing a new runtime or a second task system.
- Defaulted the local path to Ollama via the shell's `OLLAMA_HOST`, and
  left OpenRouter as the explicit alternate backend rather than mixing
  the two.

### Known non-goals for this pass

- No gameplay code changed.
- No `GAME_ITERATION` bump, build, or deploy.

## v0.4.6 — 2026-07-26

**Previous version:** v0.4.5-plan (docs-only, see
`docs/handoffs/roadmap-handoff-v0.4.5-plan.md`); last shipped code was
v0.4.4.

### What changed

- Implemented the oldest open handoff item, queued since v0.4.1-plan:
  runner pose-to-state mapping. `frontend/src/GameEngine.js` now swaps
  Jayden's face to `jayden-getting-captured` the instant a capture
  happens, holds `jayden-captured` once the jump-scare zoom finishes,
  and restores the run's original face (random default pick, or the
  player's uploaded face untouched) once the chase resumes.
- Added `RUNNER_STATE_FACES` to `frontend/src/gameContent.js` so the two
  state-specific poses are addressable by id instead of only living
  inside the random rotation pool.
- Threaded a new `runnerIsCustom` prop from `App.jsx` through
  `GameCanvas.jsx` into `GameEngine.setFaces()` so the swap never
  overrides a player's uploaded custom face.
- Added `frontend/e2e/caught-face.spec.js`, a new Playwright test that
  forces an immediate capture (teleporting the chaser onto the runner)
  and asserts the face swaps through both states by object identity,
  then restores. Exposed `window.__skibEngine` from `GameCanvas.jsx` for
  this and future e2e verification — debug-only, doesn't change
  gameplay.

### Design decisions

- Compared faces by object identity in the engine/test rather than by
  image `src`, because of a discovery made while testing (see below):
  two of the five `RUNNER_FACE_POOL` photos are byte-identical
  duplicates of two others, so `src` alone can't distinguish them once
  bundled.
- Kept the random *default* pick behavior in `randomFaces()` completely
  unchanged, per the original plan — only the capture beat gets the new
  state-driven override.
- Left the second beat's transition gated on the jump-scare's zoom
  finishing (`zoom >= 3`), not on a fixed timer, so it stays correct even
  if the zoom-in duration constant changes later.

### Discovered while implementing (not a decision, a bug report)

- `md5sum` confirms `jayden-getting-captured.jpg` ==
  `jayden-captured.jpg` and `jayden-uncaring-4029.jpg` ==
  `jayden-default.jpg`, byte-for-byte. Of the five documented poses,
  only three are actually distinct photos today. The new pose-swap code
  is correct and ready, but the capture beat will show the same photo
  twice until Ken supplies real distinct shots for those ids (or
  confirms the pool should collapse to 3 unique poses). Flagged in
  `docs/roadmap.md` and `docs/characters.md` as a Ken-only follow-up —
  not something to guess at, per the "real family photos" constraint in
  `docs/skib-sdlc.md`.

### Known non-goals for this version

- Did not touch the v0.4.5-plan near-capture-interlude backlog item —
  separate increment, not started.
- Did not touch the v0.4.2-plan/v0.4.3-plan backlog (speed-ramp,
  Pipeworks clear condition, lvl2-video timing, death-visual
  verification) — still open, still next in priority after this.
- No `GAME_ITERATION` bump, no deploy — not requested this session.

## v0.4.5-plan — 2026-07-26

**Previous version:** v0.4.4 (see `docs/handoffs/roadmap-handoff-v0.4.4.md`)

### What changed

- Scoped a new funny near-capture interlude: when a skib gets too close,
  pause the chase, show `frontend/src/assets/jayden-getting-captured.jpg`
  full-screen, and overlay a random parody caption from a small pool
  seeded by the user's supplied lines.
- Kept that beat separate from the real caught/jump-scare state so it
  reads as a comic interruption, not a second death screen.
- Added the feature as a dedicated backlog item in `docs/roadmap.md` and
  wrote a fresh plan handoff for the next coding session.

### Design decisions

- Chose to keep the interlude as its own increment rather than folding it
  into the existing runner pose-to-state mapping, because the new beat is
  about timing and pause behavior, not just which Jayden pose is shown at
  capture time.
- Kept the wording intentionally silly so the pause card feels like a gag
  panel, not a serious UI modal.

### Known non-goals for this version

- No code changed yet.
- No new assets added.
- No `GAME_ITERATION` bump, no build, no deploy.

## v0.4.4 — 2026-07-26

**Previous version:** v0.4.3-plan (docs-only, see below)

### What changed

- Added a new chaser: Sky-Diver (Motor Killer). Copied the source photo
  (`images/sky-diver-motor-killer.png`, a grizzled biker portrait shared
  in the v0.4.1-plan session) into `frontend/src/assets/`, imported it in
  `frontend/src/gameContent.js`, and added it to `CHASER_FACE_POOL` as
  `sky-diver-motor-killer` — the tenth entry in the pool, following the
  existing "drop image → import → add pool entry" pattern.
- Picked this item from the oldest open handoff
  (`docs/handoffs/roadmap-handoff-v0.4.1-plan.md`) per `docs/skib-sdlc.md`
  Mode B's "oldest unfinished handoff first" rule. Of that handoff's four
  original items: the chaser-face-randomization fix already landed in
  v0.4.2-plan; the second Yoodeling Unc pose is still blocked on the
  user; the runner pose-to-state mapping is unblocked but was left for a
  future session (this session's single increment, per the sizing rule).

### Design decisions

- Kept the increment to exactly one roadmap item (Sky-Diver) rather than
  also doing the runner pose-to-state mapping in the same session, per
  `docs/skib-sdlc.md`'s single-session sizing rule.
- `GAME_ITERATION` stays `v0.4.0` and no deploy was run — the user asked
  for this session to stay local-only unless publishing is explicitly
  requested.

### Verification performed

- `cd frontend && npm run build` succeeds and bundles the new asset
  (`dist/assets/sky-diver-motor-killer-*.png`).
- The existing Playwright smoke suite (`npx playwright test`) passes (3/3).
- Additionally drove `vite preview` with a headless Chromium session
  (via the project's installed Playwright), forcing `Math.random` so
  `randomFrom(CHASER_FACE_POOL)` resolves to the new last-index entry,
  confirmed the browser actually issues a network request for
  `sky-diver-motor-killer-*.png` (200, loaded) and that no console/page
  errors occur during Quick Play — the same `new Image()` load path used
  by every other pool entry.

### Plan decisions

- Next natural pick from the same handoff: the runner pose-to-state
  mapping (`frontend/src/gameContent.js`'s `RUNNER_FACE_POOL` /
  `randomFaces()`), wiring `jayden-getting-captured` to the jump-scare
  beat and `jayden-captured` to the caught/"YOU DIED" screen.
- The second Yoodeling Unc pose remains blocked until the user saves the
  photo to `images/`.
- The four items queued from the v0.4.2-plan session (speed-ramp →
  clear-condition → video-timing → death-visual verification) remain the
  higher-priority backlog per direct user playtest feedback — see
  `docs/next-agent-coding-brief.md`.

### Implementation decisions worth remembering

- New chaser/runner faces are added by dropping an image file in
  `frontend/src/assets/`, importing it in `frontend/src/gameContent.js`,
  and adding one `{ id, label, src }` entry to the relevant pool — no
  engine changes needed for a plain new face.

### Known non-goals for this version

- No runner pose-to-state mapping (the other unblocked v0.4.1-plan item)
  — left for the next session so this increment stays single-purpose.
- No Yoodeling Unc second pose — still blocked on the user.
- No `GAME_ITERATION` bump, no deploy.

## v0.4.3-plan (docs-only planning)

**Date:** July 26, 2026

### What changed

`GAME_ITERATION` stays `v0.4.0` — this session was explicitly docs/plan
only. It started from a request to work the "chaser face randomization
fix" backlog item, but that item had already shipped in v0.4.2-plan
(committed as `6c388a6`) — re-checked directly against the current
`frontend/src/GameEngine.js:801` and confirmed still correct, so there
was nothing left to plan or build there. Redirected (per the user) to
turning two of v0.4.2-plan's four queued, unblocked items into concrete,
ready-to-type implementation plans instead of leaving them at the
investigation stage:

- **Lvl2-video timing fix**, fully planned: move the transition trigger
  off `onLevelChange`'s arrival index (`App.jsx:156-166`, fires on
  *arriving* at Pipeworks) onto the existing `onLevelClear()` hook
  (`GameEngine.js:685`), which needs to start carrying `{ index, name }`
  data about the level just cleared instead of firing with no arguments.
  Exact edits for both files are in
  `docs/handoffs/roadmap-handoff-v0.4.3-plan.md`.
- **Extra-chaser speed-ramp fix**, fully planned: replace the flat
  `baseSpeed * 0.92` discount in `_maybeSpawnExtraChaser()`
  (`GameEngine.js:794-802`) with a per-chaser `joinRamp` field that
  climbs from a new `CHASER_JOIN_RAMP_START` (0.7) to 1.0× over
  `CHASER_JOIN_RAMP_SECONDS` (5s), applied as a multiplier layered on top
  of the existing run-level `chaserSpeedMod` rubber-band, not replacing
  it. Exact edits in the same handoff file.

### Design / plan note

- Chose `0.7`/`5s` as the join-ramp starting point and duration as a
  concrete default so the next coding session doesn't have to invent
  tuning numbers mid-implementation — cheap to retune after a real
  playtest, but a placeholder anywhere in `[0.6, 0.8]` / `[3, 6]`s would
  have been an equally reasonable guess, so picking one now and writing
  down *why* (give the player a visible adjustment window, not an
  invisible instant discount) beats leaving it as an open question.
- Tightened the follow-up into a three-session order so the next agent
  can keep each pass small and finish one increment at a time: (1)
  extra-chaser speed ramp, (2) Pipeworks's 4-chaser/max-speed clear
  condition, (3) lvl2 video timing fix plus death-visual verification.
  The handoff now carries that order as a copy-paste block.
- Deliberately did not touch the two still-blocked v0.4.2-plan items
  (Pipeworks's 4-chaser clear condition, the death-video confirmation) —
  both still need a one-line product decision from the user before any
  planning beyond what v0.4.2-plan already wrote up would be productive.
- Re-verified file/line references directly against current source
  rather than trusting v0.4.2-plan's numbers from memory — cheap
  insurance against drift now that two sessions have passed since they
  were first recorded.

### Known non-goals for this version

- No `GameEngine.js`/`App.jsx` changes — both plans are plan-only.
- No new tuning constants actually added to code yet (`CHASER_JOIN_RAMP_START`/
  `CHASER_JOIN_RAMP_SECONDS` are specified in the plan, not written).
- No decision made on the two still-blocked v0.4.2-plan items.
- No `GAME_ITERATION` bump, no build, no deploy.

## v0.4.2-plan (docs-only planning + one pre-existing code fix found uncommitted)

**Date:** July 26, 2026

### What changed

This session's own work was docs/plan-only — `GAME_ITERATION` stays
`v0.4.0`. One exception: `frontend/src/GameEngine.js` was found modified
but uncommitted in the working tree at session start (not this session's
work — no matching version-log entry existed for it). It's a complete,
building fix for the "chaser face randomization" gap already tracked in
`docs/roadmap.md`: `_maybeSpawnExtraChaser()` now gives each newly
spawned extra chaser its own independent `randomFrom(CHASER_FACE_POOL)`
pick instead of copying `this.chaser.face`, so simultaneous chasers no
longer all wear an identical face. Verified with `npm run build`
(succeeds) and committed as-is since it was already finished; the
roadmap item is checked off. See `docs/roadmap.md`'s incremental
backlog.

The rest of this session was a planning/docs pass, prompted by user
feedback after playing v0.4.0:

- Wrote up four ready-to-pick-up bugs/feature requests as roadmap
  backlog items with exact file/line references (see
  `docs/roadmap.md`'s incremental backlog):
  1. The lvl2 transition video fires on *arriving* at Pipeworks
     (`App.jsx:156-166`, `index === 2`) instead of on *clearing* it —
     needs to move to a level-clear signal instead of the arrival index.
  2. Pipeworks's clear condition is purely skreem-timer based
     (`advanceAt: 68`) with no tie to chaser count, but the user wants
     the level to specifically require surviving 4 simultaneous chasers
     (`MAX_CHASERS` is currently `3`) — flagged as needing a product
     decision (bump the global cap vs. a per-level condition) before
     coding.
  3. Extra chasers spawned by `_maybeSpawnExtraChaser()` join at a flat
     `0.92x` speed forever — the user wants new chasers to start slower
     and ramp up over the level instead of staying at a fixed discount.
  4. Confirmed via `git log --all` that no "player ded" video has ever
     existed in this repo — the only existing death feedback is the
     canvas-drawn jump-scare zoom (`_drawJumpscare()`). Documented that
     the next session needs to confirm with the user whether they mean
     "make sure the existing jump-scare still fires unobstructed" or
     "add a new, separate death-video clip," and flagged the lvl2 video
     overlay as a possible visual-stacking risk either way.
- Noted eight more unprocessed raw source photos already sitting in
  `images/` (the `PXL_2025...` files) in `docs/characters.md`, following
  the same "ask the user which role before wiring" pattern already used
  for Sky-Diver and the second Yoodeling Unc pose.
- Rewrote `docs/next-agent-coding-brief.md` (it was stale — referenced
  "three levels" when the game has had five since v0.3.0) into a
  concrete, copy-pasteable brief scoped to just these four items.
- Added `docs/handoffs/roadmap-handoff-v0.4.2-plan.md` and a matching
  `docs/handoffs/ledger.md` entry.
- **Follow-up, same session:** the user answered both open design
  questions directly. (1) Pipeworks's clear condition: "YES. for XX
  amount of SKREEM points and max speed of the chasers" — confirmed as
  bump `MAX_CHASERS` 3→4, plus require all 4 chasers at their own max
  speed before a skreem threshold (a tunable constant, not fixed here)
  gates the level clear. (2) Death video: "my bad the ded is still the
  original" — no new clip wanted, the existing canvas jump-scare stays
  as the only death feedback; the remaining task is verification, not
  a build. Updated both `docs/roadmap.md` items to `RESOLVED` with the
  full implementation direction, extended
  `docs/handoffs/roadmap-handoff-v0.4.2-plan.md` with a "Follow-up"
  section and a rewritten copy-paste block reflecting the new
  dependency order (speed-ramp → clear-condition → video-timing →
  death-visual verification), and rewrote
  `docs/next-agent-coding-brief.md` so all four items are coding-ready
  with no outstanding questions.

### Design / plan note

- Kept this strictly docs, per explicit user instruction — the three
  gameplay-feel items (video timing, chaser-count clear condition, speed
  ramp) all touch `GameEngine.js`/`App.jsx` logic that's easy to get
  subtly wrong without a build+playtest loop, and one of them (the
  4-chaser clear condition) has a real design ambiguity that's cheaper
  to resolve in a sentence now than to guess at in code and redo later.
- Investigated rather than assumed on the "player ded" video — grepped
  the full git history before writing up the backlog item, since the
  user's phrasing ("get this back into the play") implied removed
  functionality that turned out not to exist.

### Known non-goals for this version

- No `GameEngine.js`/`App.jsx` changes — all four items are plan-only.
- No `MAX_CHASERS` bump, no chaser-speed-ramp logic, no video-trigger
  change.
- No new video/image assets copied into `frontend/src/assets/`.
- No `GAME_ITERATION` bump, no build, no deploy.

## v0.4.1-plan (docs-only, no code shipped)

**Date:** July 26, 2026

### What changed

No code changed this session — `GAME_ITERATION` stays `v0.4.0`. This was
a planning/docs pass:

- Rewrote `docs/characters.md` with real content: a runner pose table, a
  chaser roster table, and a "planned new chasers" section instead of
  the old bare image list.
- Documented two new chasers as plan-only additions to
  `docs/roadmap.md`'s incremental backlog: **Sky-Diver (Motor Killer)**
  (source photo already at `images/sky-diver-motor-killer.png`, a repo-
  root scratch file, not yet copied into `frontend/src/assets/` or
  wired) and a **second pose for Yoodeling Unc** (photo shared in
  conversation but not yet saved to the repo — needs the user to drop it
  in `images/` before a coding session can pick up the item).
- Reviewed the existing face-randomization logic
  (`randomFaces()`/`setFaces()` in `frontend/src/gameContent.js` and
  `frontend/src/GameEngine.js`) and found two gaps, both written up as
  roadmap backlog items rather than fixed in code this session:
  1. All simultaneous chasers spawned by the multi-chaser mechanic share
     one identical face instead of each rolling independently from
     `CHASER_FACE_POOL`.
  2. The five `RUNNER_FACE_POOL` poses look purpose-shot for specific
     game states (idle, jump-scare, caught) but are only ever picked
     once at random per run — no pose-to-state mapping exists yet.
- Added `docs/handoffs/roadmap-handoff-v0.4.1-plan.md` and a matching
  `docs/handoffs/ledger.md` entry for this planning session.

### Design / plan note

- Kept this pass strictly docs — the user explicitly asked for a plan,
  not code, so the two new-chaser items and the two randomization-logic
  fixes are written up as ready-to-pick-up roadmap items (file paths,
  line numbers, and the exact behavior change) rather than implemented,
  so the next coding session can start immediately without re-deriving
  the investigation.
- Treated the `images/` folder note the same way `audio/` and `video/`
  were treated in earlier sessions: raw source photos land there first,
  and get promoted into `frontend/src/assets/` only when a chaser/runner
  entry is actually wired.

### Known non-goals for this version

- No `CHASER_FACE_POOL`/`RUNNER_FACE_POOL` entries were added — both new
  chasers are plan-only (one is also blocked on the user saving a file).
- No change to `GameEngine.js`'s spawn/face logic — the randomization
  review is a backlog item, not a fix.
- No `GAME_ITERATION` bump — nothing shipped to build/deploy.

## v0.4.0

**Date:** July 26, 2026

### What changed

- Landed the first real audio pass (Phase 2 of `docs/roadmap.md`). Moved
  11 raw voice clips out of the repo-root `/audio/` scratchpad, transcoded
  each to mono 44.1kHz mp3 per `docs/sound-effects-howto.md`'s shipping
  guidance, and renamed them by in-game role instead of their original ad
  hoc names — see `frontend/src/assets/audio/`.
- Wired those clips into `GameEngine`'s existing `onBoostStart`/`onTired`
  hooks (previously no-ops) and two new hooks, `onChaserBark` and
  `onLevelClear`, plus the existing `onCaught`/`onLevelChange` hooks.
- Added a low-volume looping chase-ambience track and a cookie-persisted
  mute toggle (`profile.muted` in `frontend/src/lib/cookies.js`), with a
  button on both the main menu and the in-game HUD.
- Moved the Gemini-generated "lvl2 total wipeout" transition video from
  the repo-root `/video/` scratchpad into
  `frontend/src/assets/video/lvl2-transition.mp4` and wired it as an
  experimental full-screen overlay the first time a run reaches level 2.
- Added a Playwright test for the mute toggle; discovered (but
  deliberately did not fix) a pre-existing CSS bug in `.portrait-frame`'s
  wide-viewport media query.
- Started a new docs trio: `docs/handoffs/roadmap-handoff-v0.4.0.md`
  (this session's full write-up), `docs/handoffs/ledger.md` (flat
  running change history), and `docs/future-versions.md` (parking lot for
  scoped-out work) — linked from `docs/skib-sdlc.md` and `README.md`.

### Design / plan note

- Kept the audio format decision consistent with the existing
  `jayden-skreem-loop.m4a` precedent for the menu loop (left as-is,
  m4a/AAC plays fine in browsers) but transcoded the *new* clips to mp3
  since the how-to doc already recommended it and ffmpeg was available —
  no reason to carry 11 raw AAC voice memos into the shipped bundle when
  a lossy re-encode at the documented shipping spec (mono, 44.1kHz) cuts
  file size roughly in half with no audible loss for short voice clips.
- Used a *themed pool* of chaser-bark/scream/taunt clips (5 clips, played
  randomly whenever the on-screen `CHASER_LINES` bubble refreshes) rather
  than trying to record/attribute a clip per exact line. The user's raw
  clips don't map 1:1 onto the existing `CHASER_LINES` text array, and
  forcing a fake mapping would have been worse than an honest random
  pool — a real 1:1 pass is tracked as follow-up work instead.
- Treated the lvl2 video transition as an experimental proof of concept,
  not a finished feature, per the user's own "it sux bad" framing of the
  clip. Wired it minimally (one overlay, one trigger condition, a safety
  timeout) rather than over-building a general video-transition system
  around a clip that's likely to be replaced.
- Added the handoff/ledger/future-versions doc trio because this repo is
  explicitly designed to be picked up cold by a new agent every session
  (per `docs/skib-sdlc.md`), and a single `update-directions.md` was
  starting to accumulate history rather than staying a snapshot — splitting
  "current state" (update-directions), "why" (version-log), "what
  happened this session" (handoffs/), and "flat change list" (ledger)
  keeps each doc doing one job.

### Known non-goals for this version

- Volume ducking between the ambient loop and one-shot stings/barks.
- A separate music-vs-SFX volume control (mute is all-or-nothing).
- 1:1 capture-line/chaser-bark audio clips matching the exact on-screen
  text (see design note above).
- A real composed menu theme (still a repurposed voice clip).
- A skip button for the lvl2 transition video.
- Fixing the `.portrait-frame` wide-viewport CSS bug (worked around in
  the test, not the app).
- Manually listening to any of the new audio in a real browser — this
  session ran in a sandbox with no audio output, so playback was only
  verified by code path and automated tests. Flagged explicitly in
  `docs/handoffs/roadmap-handoff-v0.4.0.md` as needing a human check.

## v0.3.4

**Date:** July 26, 2026

### What changed

- Extracted all in-game text into `frontend/src/dialog.js`
  (`CAPTURE_LINES`, `CHASER_LINES`, `TIRED_LINES`) so lines can be edited
  or added without touching `GameEngine.js`.
- Chaser speed is now rubber-banded across a run instead of fixed per
  level: each capture ("KILLZ") mellows the chaser out
  (`CHASER_SPEED_MOD_DEATH_STEP = -0.1`), each level cleared ramps it
  back up (`CHASER_SPEED_MOD_LEVEL_STEP = +0.06`), clamped to
  `[0.62, 1.35]×` and applied on top of the existing per-level
  `chaserSpeed`. Persists for the whole run, resets on a fresh game.
- Raised `advanceAt` on levels 1-4 (~40-45% longer per level) so runs
  last noticeably more time before the level-up banner.
- More screeming: proximity skreem radius 260→300 and gain rate
  0.05→0.06, chaser-bark trigger radius 180→200 with a shorter cooldown
  (2.5s→2s), plus four new screaming-themed `CHASER_LINES`.
- Added a runner-side "tired" beat: when a held sprint drains stamina to
  0, a speech bubble now shows a random `TIRED_LINES` entry (e.g. "AHHH,
  I'M TIE-RED!") near the runner, edge-triggered once per exhaustion.
- Added `onBoostStart`/`onTired` no-op hooks to the `GameEngine`
  constructor options, called on the rising edge of a sprint and on
  stamina exhaustion respectively — groundwork for the boost-skreem and
  stamina-tired SFX, not yet wired to any audio.
- Documented requirements for those two future clips as Audio 4/5 in
  `docs/roadmap.md`.

### Design / plan note

- Deliberately did *not* implement the boost/tired audio itself this
  session — no clips exist for them yet (only the menu loop + capture
  sting clip in `frontend/src/assets/audio/`), and the user explicitly
  asked for requirements/roadmap on that piece, not an implementation.
  The engine-side hooks exist now so wiring it later is a small,
  self-contained change (same pattern as `playCaughtAudio` in
  `App.jsx`).
- Kept the rubber-band speed mod as a run-persistent multiplier rather
  than per-level, since the point is to soften the very next spawn after
  a death, not just the current level.

### Known non-goals for this version

- Boost-skreem stinger and stamina-tired flat-tone audio clips
  themselves (see Audio 4/5 in `docs/roadmap.md`).
- Mute toggle / cookie-backed audio preference — still open from v0.3.3.
- No changes to the multi-chaser spawn cadence or map layouts.

## v0.3.3

**Date:** July 26, 2026

### What changed

- Added a starter audio loop to `frontend/src/assets/audio/` and wired it
  into the menu in `frontend/src/App.jsx` so the main page can start a
  looping vocal clip on first interaction.
- Reused the same clip as the caught transition sting so the "YOU DIED"
  beat now has an audible hook while the richer audio pass is still in
  progress.
- Updated `docs/sound-effects-howto.md`, `docs/update-directions.md`, and
  `docs/roadmap.md` so the new asset path, naming convention, and
  remaining audio backlog are visible to the next agent.

### Design / plan note

- The starter audio is intentionally a single reusable clip so the game
  can prove the browser-audio plumbing before we spend time separating it
  into a proper menu loop, line library, and death sting.
- Keeping the raw scratch audio in `/audio/` while copying the playable
  asset into `frontend/src/assets/audio/` lets us move between editor
  source and game-ready output without changing the code path.

### Known non-goals for this version

- No dedicated menu theme has been composed yet.
- No mute toggle or cookie-backed audio preference was added yet.
- No transition video was generated yet.

## v0.3.2

**Date:** July 26, 2026

### What changed

- Clarified the audio how-to in `docs/sound-effects-howto.md` so it now
  answers the local-recording question directly, recommends keeping raw
  takes lossless when possible, and spells out the shipping export format
  as mono `.ogg` or `.mp3` at 44.1kHz.
- Refreshed `docs/update-directions.md` so the next handoff points at the
  updated audio guidance without making the next agent rediscover it.

### Design / plan note

- The repo now distinguishes between capture/editing format and game
  delivery format, which should reduce confusion if someone wants to use
  a better local recording setup.
- Keeping the export guidance in the audio how-to avoids scattering
  format rules across multiple docs.

### Known non-goals for this version

- No gameplay code changed.
- No audio assets were recorded or added yet.
- No frontend build or runtime behavior changed in this pass.

## v0.3.1

**Date:** July 26, 2026

### What changed

- Added a shared build-iteration constant in `frontend/src/version.js`
  and surfaced it discreetly in both the main menu and the in-game HUD.
- Updated `scripts/deploy-static.sh` so it builds the frontend, rsyncs the
  output into the website repo, stages only the
  `skib-jay-dee-toilet-game/` subtree, and commits with the message format
  `kenmacpherson.com - skib-jay-dee toilet game: <iteration> <short-name>`.
- Updated the deployment and handoff docs so the next session uses the
  same short iteration slug when publishing.

### Design / plan note

- The iteration label is intentionally small and non-intrusive so it can
  help match a running build to the deploy commit without adding more UI
  noise.
- Keeping the version string in one frontend module makes future bumps a
  single-file change for both the menu badge and the HUD marker.
- The deploy helper now treats the website folder as the source of truth
  for the published static site and only commits the skib subtree, which
  keeps unrelated website files out of this game's deploy history.

### Known non-goals for this version

- No gameplay or content changes were made in this pass.
- No audio, intro cinematic, or face-crop work was added yet.

### Addendum: deploy script had two sources of truth

- The first pass at `scripts/deploy-static.sh` took the iteration label as
  a manual `<iteration>` CLI arg, separate from `GAME_ITERATION` in
  `frontend/src/version.js`. Nothing enforced that the two matched, so a
  deploy commit message could silently disagree with the iteration tag
  actually baked into that build.
- Fixed by having the script read `GAME_ITERATION` straight out of
  `frontend/src/version.js` instead of accepting it as an argument.
  `version.js` is now the only place the iteration is set; the script
  only takes `<short-name>`: `./scripts/deploy-static.sh intro-badge`.
- Verified with a real deploy run (`version-single-source-fix`): build
  succeeded, rsync populated the website subtree, and the website repo
  committed as `kenmacpherson.com - skib-jay-dee toilet game: v0.3.1
  version-single-source-fix` (commit `ad48764`, not pushed).

## v0.3.0

**Date:** July 26, 2026

### What changed

This entry reconciles v0.2.1–v0.2.4 (which landed piecemeal) into one
accurate summary of where the code actually ended up this session:

- Added two more levels — The Ramen Aisle and World Star Parking Lot —
  bringing the total to five (Porcelain Palace → Pipeworks → Flooded
  Annex → Ramen Aisle → Parking Lot), each with its own theme/wall
  layout per the PDF's map ideas.
- Added a lifetime death counter, persisted via cookies, shown on the
  main menu and in the in-game HUD.
- Getting caught now deducts 30% of the current skreem total (skreems
  were previously never lost).
- Added a multi-chaser mechanic: if the runner survives ~14s of
  uninterrupted chase, another toilet joins from a random corner (capped
  at 3 total). All extra chasers reset back to one on capture or level
  change. HUD shows "TOILETS ON YOU" once more than one is active.
- Added `crazy-jack-chaser.jpeg` to the chaser face pool.
- Added `docs/skib-sdlc.md` (session process for every agent),
  `docs/roadmap.md` (phased backlog + a levels/maps scaling plan, plan
  only), and `docs/sound-effects-howto.md` (audio how-to, nothing
  implemented yet).

### Design / plan note

- Death and skreem-loss are treated as part of the core economy now, not
  just a display counter — this is what makes surviving vs. getting
  caught actually matter for the sheeb payout loop.
- Multi-chaser pressure is deliberately time-based (not skill-based) so
  a level can't be trivially "camped" once the runner learns the map —
  it forces the level-advance skreem threshold to be cleared before the
  chase gets harder than intended.
- Level data is still hardcoded per-level `buildXxx()` functions. That's
  fine at 5 levels; the roadmap's levels/maps plan says to extract it to
  data *before* hand-authoring a 6th/7th.

### Known non-goals for this version

- No audio, no intro cinematic, no face-crop, no backend/multiplayer —
  all still open, tracked in `docs/roadmap.md`.

## v0.2.4

**Date:** July 26, 2026

### What changed

- Added `docs/skib-sdlc.md` to codify the session workflow for future
  agents.
- Added `docs/roadmap.md` as the session-sized backlog to pull from.
- Added `docs/sound-effects-howto.md` as a starter guide for the upcoming
  audio pass.

### Design / plan note

- The repo now has a clearer docs stack for iterative development:
  - `README.md` for project overview
  - `docs/version-log.md` for durable version history
  - `docs/update-directions.md` for the next handoff
  - `docs/skib-sdlc.md` for process rules
  - `docs/roadmap.md` for the next increment queue
  - `docs/sound-effects-howto.md` for the audio subtask kickoff
- This pass intentionally did not change gameplay code; it only tightened
  the documentation trail so the next coding session starts with less
  guessing.

## v0.2.3

**Date:** July 26, 2026

### What changed

- Added the repo-wide session process doc in `docs/skib-sdlc.md`.
- Added a working backlog file in `docs/roadmap.md` so the new session
  process has a concrete increment list to pull from.
- Reinforced the docs-first workflow for iterative development and review.

### Design / plan note

- Documentation now has three layers:
  - `docs/version-log.md` for durable versioned decisions.
  - `docs/update-directions.md` for the immediate handoff to the next agent.
  - `docs/roadmap.md` for the next single-session increments.
- The new `docs/skib-sdlc.md` process doc is intentionally explicit about
  reading order, build verification, and committing every meaningful
  increment.

## v0.2.2

**Date:** July 26, 2026

### What changed

- Added persistent "times killed" tracking to the profile and menu/HUD.
- Kept the existing kill counter in the canvas engine and saved it to
  cookies through the front-end profile flow.

### Design / plan note

- Death count is treated as part of the player profile, alongside user id,
  sheebs, owned items, and best level.
- The counter is intentionally front-end only for now because the current
  game loop still does not depend on backend state.

## v0.2.1

**Date:** July 26, 2026

### What changed

- Added `crazy-jack-chaser.jpeg` to the randomized chaser face pool so it
  can appear during play.
- Kept the rest of the front-end gameplay loop unchanged.

### Design / plan note

- New gallery assets should be folded into `frontend/src/gameContent.js`
  and recorded here so the random-face pool stays auditable over time.

## v0.2.0

**Date:** July 26, 2026  
**Commit:** `c699164` (`Upgrade toilet game front end`)

### What changed

- Upgraded the game from a Phase 1 single-scene prototype into a fuller
  front-end-only playable build.
- Added three levels and progression.
- Fixed sprint so it behaves like a held input instead of getting stuck.
- Added desktop keyboard controls with Arrow keys / WASD movement and
  SPACE boost support.
- Added a working Shleeb shop that spends and persists sheebs.
- Added cookie-backed persistence for user id, balance, owned items, and
  highest cleared level.
- Randomized the default Runner and Chaser faces from local gallery assets
  every time the player presses play.
- Added a new handoff doc for the next agent.

### Design decisions

- Keep the experience front end only for now.
  - The backend scaffold stays untouched until the game loop actually needs
    network persistence or multiplayer.
- Keep the portrait 9:16 layout.
  - The game is still meant to feel like a vertical phone game even when
    played on desktop.
- Keep the local image gallery as the default face source.
  - Randomizing default faces each run gives the game a little variety
    without requiring backend state.
- Keep persistence in cookies for now.
  - This is enough for user id, sheeb balance, and purchase state until a
    real storage layer is justified.
- Keep the shop front-end only.
  - No backend purchase verification yet; the current goal is to prove the
    loop and upgrade economy feel playable.
- Keep level progression simple and readable.
  - Each level is a self-contained map with its own tuning rather than a
    more complex world streaming system.

### Plan decisions

- Priority order for the next coding pass:
  1. Script the World Star intro cinematic.
  2. Add sound effects and background audio.
  3. Improve uploaded face rendering with a crop or oval mask.
  4. Add or tune more levels.
  5. Add more roster content from the PDF if needed.
- Only move to backend persistence or multiplayer after the front-end loop
  feels solid.
- Keep future changes localized to the existing front-end modules unless a
  new architecture is truly required.

### Implementation decisions worth remembering

- `frontend/src/GameEngine.js` owns the canvas hot path.
- `frontend/src/App.jsx` owns menu state, shop state, and profile state.
- `frontend/src/gameContent.js` centralizes shop items and random gallery
  assets.
- `frontend/src/lib/cookies.js` centralizes cookie persistence.
- `frontend/vite.config.js` includes uppercase `.JPG` / `.PNG` assets so the
  local gallery builds correctly.

### Known non-goals for this version

- No backend code was required for the upgrade.
- No audio was added yet.
- No cinematic intro was added yet.
- No crop or oval face mask was added yet.
- No multiplayer or server authority changes were added yet.
