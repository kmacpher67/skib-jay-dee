# Version Log — Skib-Jay-Dee-Toilet

This file memorializes the design and plan decisions made during the
front-end upgrade pass. Starting v0.4.0, each version also gets a fuller
session write-up in `docs/handoffs/roadmap-handoff-vX.Y.Z.md` and a
one-line-per-change entry in `docs/handoffs/ledger.md` — this file stays
focused on *why*, those two are the *what* and *when*.

## v0.4.25 — Post-kill profile pages shipped (2026-07-26)

### What changed

- `frontend/src/GameEngine.js` now captures the exact chaser that made
  contact, logs its `faceId` into the capture payload, and pauses the
  game in a post-kill profile state after the jump-scare shake finishes.
- `frontend/src/gameContent.js` now exports `CHASER_PROFILES`, so the
  post-kill card and the deaths log can render per-chaser flavor text
  from one shared content map instead of duplicating the prose in the UI.
- `frontend/src/lib/cookies.js` now preserves `chaserId` in
  `deathsHistory`, and `frontend/src/App.jsx` stores it when a capture is
  recorded.
- `frontend/src/components/ProfileModal.jsx` provides the reusable
  profile card used both after a fresh kill and when a player reopens a
  killer from the deaths log. `frontend/src/components/DeathsModal.jsx`
  now shows killer-ID pills that reopen the same profile page.
- `frontend/src/version.js` bumped the visible build tag to `v0.4.25`.

### Design decisions

- Kept the profile page and the deaths-log reopen path on one shared
  modal so the killer portrait/name/flavor text stays consistent no
  matter how the player opens it.
- Stored the killer identity in the existing cookie-backed death history
  instead of adding a second persistence layer, because the history
  remained comfortably small and the repo already had the right profile
  cookie in place.
- Let the fresh-kill profile card dismiss back to the menu, while the
  deaths-log version dismisses back to the log. That keeps the capture
  beat quick and the historical browse path non-destructive.

### Explicitly not done

- Did not remove the separate `resume-countdown` code path in
  `GameEngine.js`; it remains in the tree as a separate gameplay feature
  and is not used by the new post-kill profile flow.
- Did not start the negative-sheebs / item-loss escalation work in
  v0.4.26-plan.

## v0.4.26-plan — Risk/reward escalation planning pass (2026-07-26)

### What changed

- Added two new backlog items to `docs/roadmap.md` under a new "Phase 7"
  row: a sheebs debt economy (negative balance allowed on capture once
  `profile.highestLevel > 3`) and a losable-shop-item mechanic once
  `profile.highestLevel > 4`. Also added a "menu brag stat" companion
  goal (best level + fewest deaths) to give players something to show
  off once the stakes are real.
- Wrote `docs/handoffs/roadmap-handoff-v0.4.26-plan.md` with the full
  design summary and a Code Monkey coding brief that is explicitly
  gated on product decisions, not ready to dispatch yet.
- No code changed; `GAME_ITERATION` stays `v0.4.24`.

### Design decisions

- Trigger for this pass was Ken's reaction to a menu screenshot (240
  sheebs, 2048 lifetime deaths) — "I should have negative or zero
  sheebs." Investigated and confirmed this is not a bug: sheebs are
  earned from level-clear rewards as well as lost on capture, and every
  capture only docks a flat 20, floored at `0`
  (`Math.max(0, this.sheebs - sheebsLost)` in `GameEngine.js`). Chose to
  treat the reaction as a legitimate design prompt rather than closing it
  as "working as intended" — added the negative-balance-for-veterans item
  instead of silently leaving it alone.
- Deliberately scoped the debt/negative-sheebs change to apply only past
  `highestLevel > 3`, keeping the existing floor for newer players so the
  economy doesn't feel punishing before someone has a real shot at
  earning it back.
- Deliberately did **not** write concrete implementation logic for the
  item-loss mechanic (which items, deterministic vs. chance, warning
  UI) — these are product calls, not something to guess at per
  `docs/skib-sdlc.md`'s "flag anything Ken needs to do himself" step.
  Flagged explicitly in the handoff's "Flag for Ken" section instead of
  burying it in prose.

### Known non-goals for this pass

- No code changes, no build run.
- Did not touch the still-open v0.4.25-plan (post-kill profile system) —
  unrelated feature, queued ahead of this one.
- Did not resolve the product decisions needed to make v0.4.26-plan
  codeable — that's explicitly left for Ken.

## v0.4.25-plan — Post-kill profile system, ledger backfill (2026-07-26)

### What changed

- No new design work this session — `docs/handoffs/roadmap-handoff-v0.4.25-plan.md`
  already existed (expanding the superseded v0.4.23-plan with `chaserId`
  kill-history logging, a `CHASER_PROFILES` content map, a `ProfileModal`
  shown after a capture's shake finishes, and a clickable Deaths log) but
  had never been logged here, in the ledger, or in
  `docs/update-directions.md`. This entry and the matching ledger/
  update-directions edits backfill that gap so the docs trail matches
  what's actually on disk.
- Marked `docs/handoffs/roadmap-handoff-v0.4.23-plan.md` as superseded
  (added a pointer at the top of the file) rather than leaving two
  competing plan files scoping the same feature.

### Design decisions

- Kept `roadmap-handoff-v0.4.25-plan.md`'s content as-is rather than
  rewriting it — it was already a complete, coherent plan; the gap was
  purely in the surrounding doc trail, not the plan itself.

## v0.4.24 — Resume countdown implementation (2026-07-26)

### What changed

- Implemented the "resume countdown" feature planned in `v0.4.24-plan`.
- Replaced the direct transition from `'caught'` to `'chase'` with a new 3-second `'resume-countdown'` phase in `GameEngine.js`.
- Added a visual 3-second countdown digit overlay with a light scale-pulse effect over a translucent backdrop.
- Added Playwright test coverage `frontend/e2e/resume-countdown.spec.js`.

## v0.4.24-plan — Resume countdown planning pass (2026-07-26)

### What changed

- Scoped a new backlog item requested by x-lax (relayed by Ken via a text
  thread with Alexander): after the jump-scare capture beat finishes,
  freeze the action at the reset spawn points and show a large, pulsing
  centered "3… 2… 1…" countdown before resuming the chase, instead of
  today's instant teleport straight back into a moving chase.
- Wrote `docs/resume-countdown.md`: the current flow
  (`_triggerCaught()`/`_updateCaught()`/`_drawJumpscare()` in
  `frontend/src/GameEngine.js`), the proposed new flow (a distinct
  `'resume-countdown'` phase, not an extension of `'caught'`), and why a
  new phase is cleaner than overloading the existing one.
- Added the item to `docs/roadmap.md`'s incremental backlog and a fully
  specced coding brief in
  `docs/handoffs/roadmap-handoff-v0.4.24-plan.md`.

### Design decisions

- Refined the user's raw ask (which came through a "remove the flash"
  suggestion from an unrelated chat transcript) to clarify that the
  jump-scare's flash/zoom/capture-line beat is a separate, liked feature
  and should stay untouched — only the abrupt reset-and-resume *after*
  it is the actual complaint, so the fix targets that transition, not
  the jump-scare itself.
- Chose a brand-new `'resume-countdown'` phase over extending `'caught'`
  so existing phase-gated code (HUD, controls, `_drawJumpscare`) doesn't
  need special-casing for "which sub-beat of caught is this."
- No audio requested for the countdown ticks in the original ask; parked
  as a possible follow-up, not scoped into this pass.

### Known non-goals for this pass

- No gameplay code changed, no build/test run, no `GAME_ITERATION` bump.
- Doesn't touch the near-capture interlude or the still-open v0.4.23-plan
  post-kill profile screen — those are separate, unrelated backlog items.

## v0.4.21 — Deaths history log UI (2026-07-26)

### What changed

- `frontend/src/App.jsx`: the menu's `Deaths` pill is now clickable and
  opens a new `DeathsModal` panel. When the game reports a capture, the
  app appends `{ timestamp, levelName }` to the cookie-backed
  `deathsHistory` array.
- `frontend/src/lib/cookies.js`: `normalizeProfile()` now includes a
  sanitized `deathsHistory` array in the persisted profile shape.
- `frontend/src/components/DeathsModal.jsx`: new modal that shows the
  latest 10 capture records with timestamps and level names.
- `frontend/src/components/VersionModal.jsx`: added a v0.4.21 changelog
  note for the new deaths history log UI.
- `frontend/e2e/smoke.spec.js`: added coverage that seeds a profile with
  death history, opens the modal, and checks the saved entries render.
- `frontend/src/version.js`: bumped the visible build tag to
  `v0.4.21`.

### Design decisions

- Kept the history format deliberately small: timestamp plus level name,
  since the user asked for a small modal and the menu doesn't need a
  bigger profile timeline yet.
- Trimmed the visible list to the most recent 10 entries so the panel
  stays compact on the portrait menu.
- Reused the existing cookie profile path instead of introducing a
  second persistence layer.

### Explicitly not done

- The broader **game identity / multiple save slots** backlog item is
  still open for a future session.

### Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test` (12/12 pass)

## v0.4.20 — GameEngine cleanup and Sheebs penalty (2026-07-26)

### What changed

- `frontend/src/GameEngine.js`: removed the stale `initialSheebs = 200`
  default from the constructor signature so the engine now relies on the
  caller's real value, and added `DEATH_SHEEBS_PENALTY = 20` alongside
  the existing skreem-loss penalty.
- `frontend/src/GameEngine.js`: `_triggerCaught()` now subtracts up to
  20 sheebs on capture, floored at `0`, without letting the persistent
  balance go negative.
- `frontend/src/version.js`: bumped the visible build tag to
  `v0.4.20`.

### Design decisions

- Kept the sheebs penalty in `GameEngine.js` next to the existing death
  skreem penalty so the capture economics stay in one place.
- Used a flat `20` sheebs loss, matching the handoff's bounded scope and
  leaving tuning to a later balance pass if needed.

### Explicitly not done

- The deaths history log UI is still queued for the next versioned
  increment.

### Verification

- `cd frontend && npm run build`

## v0.4.19 — Dad Case Environmental Traps: real audio (2026-07-26)

### What changed

- `frontend/src/App.jsx`: imported `door-sounds.m4a` and `lights.m4a`;
  `handleExtraChaserSpawn` now calls `playOneShot(dadCaseDoorUrl, 0.6)`
  and `playOneShot(dadCaseLightsUrl, 0.6)` together when `faceId ===
  'dad-case'`, replacing the `*DOOR SLAM SOUND*` text placeholder. The
  `.dad-case-darkness` overlay div no longer wraps any child text.
- `frontend/src/index.css`: removed the now-unused `.dad-case-sound-text`
  class.
- `frontend/src/components/VersionModal.jsx`: added a v0.4.19 changelog
  entry and simplified the component to render `PAST_VERSION_NOTES`
  directly instead of injecting a separately hardcoded "current
  iteration" entry that would have gone stale every bump.
- Bumped `GAME_ITERATION` to `v0.4.19` in `frontend/src/version.js`.

### Design decisions

- Picked up the fully-specced v0.4.19-plan implementation plan as-is —
  the audio assets (`door-sounds.m4a`, `lights.m4a`) were already
  uploaded to `frontend/src/assets/audio/`, so this was a small,
  unblocked, single-session slice.
- Reused the existing `playOneShot()` pool instead of adding new audio
  plumbing, matching how every other one-shot SFX in `App.jsx` is
  played.

### Explicitly not done

- No new gameplay/backlog items scoped this session; picked the oldest
  fully-unblocked item off the plan queue per Mode B ordering.

### Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test` (11/11 pass)

## v0.4.17 — Dad Case Environmental Traps (2026-07-26)

### What changed

- `frontend/src/GameEngine.js`: `_maybeSpawnExtraChaser()` now resolves and passes `faceId` via `onExtraChaserSpawn`.
- `frontend/src/App.jsx` & `frontend/src/index.css`: Added a state `dadCaseSpawned` that listens for the `dad-case` faceId from the extra chaser spawn event. When triggered, it mounts a `.dad-case-darkness` overlay with a text placeholder for a door slam sound.
- Bumped `GAME_ITERATION` to `v0.4.17` in `frontend/src/version.js` and deployed.

### Design decisions

- Decided to use a text placeholder on screen for the sound effect per the user's explicit instruction to "stub out locations for audio sounds to be dropped in later, right now just put the sounds on screen as overlay text when the sould should happen," superseding the plan's instruction to check for an audio asset.
- The `dadCaseSpawned` state resets on caught, play, or level change to ensure the trap resets cleanly.

### Explicitly not done

- **Version page** and **Game Identity & New Profiles** (from the backlog) were left for the next natural steps.

## v0.4.18 — Version page (2026-07-26)

### What changed

- `frontend/src/App.jsx`: added a new `WHAT'S NEW` button to the main menu and a `VersionModal` overlay that shows the current `GAME_ITERATION` plus a short shipped changelog.
- `frontend/src/components/VersionModal.jsx`: added the new version panel content, including the current build tag and a compact recent-changes list.
- `frontend/src/App.css`: added the version modal styling so it matches the existing shop panel treatment.
- `frontend/e2e/smoke.spec.js`: added a Playwright smoke check that opens the version log and verifies it shows the live iteration string.
- Bumped `GAME_ITERATION` to `v0.4.18` in `frontend/src/version.js` and deployed.

### Design decisions

- Kept the changelog intentionally short and static, mirroring the recent shipped notes instead of adding new runtime parsing or persistence. This keeps the feature front-end only and cheap to maintain.
- Reused the shop modal's general look and feel so the menu gains a new panel without introducing a second visual language.
- Kept the version notes tied to the live iteration prop for the current-release entry so the panel stays aligned with the visible build tag after future bumps.

### Explicitly not done

- **Game identity & new profiles** is still open and remains the next natural backlog item.
- Did not add any new persistence or runtime docs parsing for the changelog.

## v0.4.16 — Sheebs default fix + menu skreem-loop fix (2026-07-26)

### What changed

- `frontend/src/lib/cookies.js`: `normalizeProfile()`'s fallback starting
  `sheebs` balance is now `0` instead of `200`, per the oldest unclaimed
  item in `docs/handoffs/roadmap-handoff-v0.4.15-plan.md`'s copy-paste
  block.
- `frontend/src/App.jsx`: fixed the "skreem loop" bug where the first
  pointerdown anywhere on the menu started `jayden-skreem-loop.m4a`
  playing audibly (`volume: 0.22`) and looping forever (`loop: true`).
  `startMenuAudio()` was written as an autoplay-unlock "priming" hook
  (`onPrimeAudio`) but actually played the clip for real instead of just
  unlocking it. It now primes the same `<Audio>` element silently
  (`loop: false`, `volume: 0`) and immediately pauses it once the
  browser's `play()` promise resolves, so later real playback (e.g. a
  future dedicated menu-music track) is still unlocked without the
  scream looping in the background.
- Added `frontend/e2e/menu-audio-prime.spec.js`, which monkey-patches
  `window.Audio` to record `play`/`pause` calls and their `loop`/`volume`
  values, clicks the menu, and asserts the priming call is silent,
  non-looping, and self-pausing. Verified this test fails against the
  pre-fix code (reproduced by stashing the fix and serving a standalone
  build) before confirming it passes with the fix.
- Merged `docs/handoffs/dad_case_handoff.md` (Ken's filled-in content for
  the Dad Case profile stub) into `docs/profiles/dad-case.md`, the
  correct location per the v0.4.15-plan handoff, and removed the
  misplaced duplicate from `docs/handoffs/`.

### Design decisions

- Kept the Sheebs fallback as a plain constant change rather than adding
  a migration — cookies already parse missing/invalid values through
  `Number.isFinite`, so existing players with a real persisted `sheebs`
  value are unaffected; only fresh profiles get `0` instead of `200`.
- Fixed the skreem-loop bug at the priming call site instead of adding a
  broader "auto-stop after N seconds" safety net — the root cause was
  that priming was never supposed to produce audible, looping playback
  in the first place.

### Explicitly not done

- **Version page** (display `GAME_ITERATION` + changelog in the menu) —
  next unclaimed item from the v0.4.15-plan copy-paste block.
- **Game Identity & New Profiles** (multiple cookie-backed save slots) —
  last unclaimed item from the same block; bigger than a single-session
  increment, needs its own scoping pass.
- The Parody Attribute System (Panic/Grip/Scream/Sus) addendum is still
  plan-only, not broken into sub-increments yet.

## v0.4.15 — lvl2 hall-coverage gate + playback crash RCA (2026-07-26)

### What changed

- `frontend/src/GameEngine.js` now tracks Pipeworks hall coverage on a
  coarse walkable grid plus a survival timer that only advances while
  four or more skibs are present. When Pipeworks clears, the engine now
  includes `showLvl2Transition` in the `onLevelClear` payload only if
  both gates are satisfied.
- `frontend/src/App.jsx` now only mounts the lvl2 transition video when
  the clear payload explicitly marks the gate as ready. The transition
  still dismisses on capture and on playback end, but it can no longer
  appear early just because Pipeworks advanced.
- Updated the browser coverage around the transition path:
  - `frontend/e2e/pipeworks-clear.spec.js` now proves the video stays
    hidden when the hall-coverage / 4-skib gate is not met, and appears
    when it is.
  - `frontend/e2e/lvl2-transition-clears-on-caught.spec.js` still checks
    capture dismissal, and now also waits for the clip to finish once and
    confirms the app keeps running without a page error.

### Design decisions

- Kept the gate calculation in `GameEngine.js` rather than React so the
  decision is based on real run state, not UI timing.
- Chose a coarse hall grid instead of raw pixel tracing. The map already
  uses hand-authored wall rectangles, so a walkable-cell coverage sample
  is a simple, deterministic approximation that is cheap to evaluate
  every frame and easy to inspect in tests.
- Treated the new gate as a video-only gate, not a new level-clear gate.
  Pipeworks still advances the same way; the transition clip just waits
  until the run has earned it.

### Known non-goals for this pass

- No new transition clip or skip button.
- No `GAME_ITERATION` bump beyond the visible release tag, and no deploy
  until the release step is run.

## v0.4.14 — face crop on upload (2026-07-26)

### What changed

- `frontend/src/components/FaceUpload.jsx` no longer hands the raw uploaded
  image straight to the parent. A new `cropToOval()` helper loads the file
  into an offscreen `<canvas>`, center-crops it to a square, clips it with
  an ellipse path, and re-exports it as a PNG data URL before calling
  `onFace()`. Both the Runner and Chaser upload slots go through the same
  path since `App.jsx` wires both through the same `FaceUpload` component.
- `_drawEntity()` in `GameEngine.js` needed no changes — it already draws
  `entity.face` with `ctx.drawImage()` into the entity's square bounding
  box, so once the uploaded image itself carries a transparent oval mask,
  the corners render through to the background automatically.
- Added `frontend/e2e/face-crop-verify.spec.js`: uploads a real asset
  through the actual file input, confirms the preview `<img>` is a
  `data:image/png` (not the original raw file), then decodes that PNG on
  an in-page canvas and asserts a corner pixel is fully transparent
  (`alpha === 0`) while the center pixel is opaque — proof the mask
  actually clipped the image rather than just changing the encoding.

### Design decisions

- Cropped at upload time, not at draw time, matching the existing roadmap
  wording ("oval crop/mask step at upload time") — this keeps
  `_drawEntity()`/`GameEngine.js` untouched and means the cost of masking
  is paid once per upload, not every frame.
- Used a fixed `CROP_SIZE = 256` offscreen canvas regardless of the
  entity's on-screen size, since the sprite is later stretched to whatever
  `entity.w`/`entity.h` are anyway — this keeps the stored data URL
  resolution-independent of gameplay tuning.
- Left the default (non-uploaded) gallery faces alone — the roadmap item
  specifically scoped this to *uploaded* faces, and the shipped
  `RUNNER_FACE_POOL`/`CHASER_FACE_POOL` defaults are curated crops already
  handled outside this component.
- Verified visually, not just by unit-style pixel assertion: took an
  in-game screenshot after uploading a real photo and confirmed the sprite
  renders an oval face inside its square colored border instead of a
  stretched raw square.

### Known non-goals for this pass

- Default gallery/random faces are unchanged — still raw square draws, by
  design (see above).
- No change to the stroke/border drawn around each entity in
  `_drawEntity()` — the square colored outline stays, only the photo
  inside it is now oval.
- `GAME_ITERATION` stays unbumped, no deploy, per the user's instruction
  for this session.

## v0.4.13-plan — lvl2 RCA planning pass (2026-07-26)

### What changed

- Re-scoped the lvl2 transition work after playtesting feedback: the current video gate is still too permissive for the user's expectation, and there is a crash shortly after the video starts that needs root-cause analysis before any further timing tweaks.
- Added a new roadmap item that makes the next coding session start with reproduction and instrumentation, then tighten the gate to the user's requested bar: 80% map-hall coverage plus 15 seconds with 4 simultaneous skibs.
- Prepared a fresh copy-paste brief for the next coding agent so the investigation starts from the real files (`App.jsx`, `GameEngine.js`, `GameCanvas.jsx`) instead of guesswork.

### Design decisions

- Chose to treat this as RCA first, behavior change second. The previous "video fires on clear" fix is still valid, but it is not sufficient for the new playability target.
- Kept the new gate requirement in the roadmap and handoff docs rather than baking it into code here, because the next session still needs to confirm whether the crash is in the overlay lifecycle, the level-advance path, or the multi-chaser update loop.

### Known non-goals for this pass

- No gameplay code changed.
- No build, test run, `GAME_ITERATION` bump, or deploy.

## v0.4.12 — near-capture interlude pass (2026-07-26)

### What changed

- Implemented the near-capture interlude from the v0.4.5-plan backlog. When a skib gets too close (`dist < 100`), the game pauses the chase and shows `jayden-getting-captured.jpg` full-screen with a random parody caption.
- Added `NEAR_CAPTURE_LINES` to `frontend/src/dialog.js` to serve as the caption pool.
- Added `nearCaptureCooldown` to `GameEngine.js` so the interlude doesn't trigger repeatedly in quick succession.
- Verified in the browser that the card appears at the right time and the chase resumes correctly.

### Design decisions

- Kept the interlude as a separate beat from the actual caught/jump-scare path, as requested. It uses its own `near-capture` phase and renders the full-screen image overlaid with the text.
- Added a 15-second cooldown to `nearCaptureCooldown` to prevent the interlude from firing repeatedly if the player remains barely ahead of the chaser after unpausing.

### Known non-goals for this pass

- No `GAME_ITERATION` bump or deploy (as requested).
- No new death clip or actual capture changes.
- Did not tackle 1:1 voice clips or custom runner face logic for the interlude.

## v0.4.10 — 5-skib Pipeworks + delayed ambient pass (2026-07-26)

### What changed

- Bumped `MAX_CHASERS` from 4 to 5 so Pipeworks now expects five active,
  fully ramped chasers before its pressure meter can advance the level.
  Kept `PIPEWORKS_MAX_PRESSURE_SKREEM_GOAL = 68` unchanged because the
  existing threshold still felt playable with the extra chaser.
- Changed `GameEngine.onLevelClear` to carry `{ index, name }` and moved
  the lvl2 transition trigger out of `handleLevelChange` and into
  `handleLevelClear`, so `lvl2-transition.mp4` now waits for the actual
  Pipeworks clear event instead of the arrival event.
- Added an `onExtraChaserSpawn` callback and used it, plus a 15-second
  timer, to arm the chase ambience only after tension has built instead
  of starting `chase-ambient-bopbop.mp3` the instant the chase screen
  appears.
- Verified the behavior in-browser against the built preview: no early
  ambient start, ambient logs once the first extra chaser is forced in,
  five chasers are present, and the lvl2 overlay stays hidden until
  Pipeworks is cleared.

### Design decisions

- Kept the Pipeworks threshold at 68 rather than tuning it just because
