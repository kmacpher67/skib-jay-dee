# Update Directions — Skib-Jay-Dee-Toilet

Use this as the handoff doc for the next agent working in the repo.

## Current state

- **v0.4.34 (real code, most recent session):** implemented the Level 5+
  end-game escalation from `docs/handoffs/roadmap-handoff-v0.4.34-plan.md`
  — **Chaser Wall Hacks** and the **Gawd Particle**. Found while reading
  `GameEngine.js` that chasers never had wall collision at all (only the
  runner did), so instead of a literal "disable collision at Level 5"
  no-op, gave chasers real wall-aware movement on Levels 1-4
  (`_moveWithCollision`, reused from the runner) and kept the
  always-pass-through behavior + a new `1.15x` speed multiplier at
  Level 5+ (`levelIndex >= 4`, `_moveIgnoringWalls`). The Gawd Particle is
  a new Level 5+-only pickup (8% roll/level) that gives the runner the
  same wall-hack for 10s and turns a chaser collision into a despawn +
  15s respawn (`chaserRespawnQueue`) instead of a capture. Added HUD/visual
  feedback (gold runner glow, wallhack countdown) and
  `frontend/e2e/level5-wallhacks-gawd-particle.spec.js`. Full 27-test
  suite (26 active, 1 pre-existing skip) and `npm run build` pass. Also
  backfilled a missing v0.4.33 entry in `VersionModal.jsx`. `GAME_ITERATION`
  bumped to `v0.4.34` and deployed. See
  `docs/handoffs/roadmap-handoff-v0.4.34.md`.
- **v0.4.33 (real code):** Quest Room landmark badges (guaranteed pickup
  in Ramen Aisle / World Star Parking Lot's dedicated quest room) and the
  Level 4+ survival floor (scaling time requirement + all 5 chasers
  active, stacked on the existing skreems threshold). See
  `docs/handoffs/roadmap-handoff-v0.4.33.md`.
- **v0.4.32 (real code):** implemented both items from the v0.4.32-plan handoff — **Retrofit Early Level Badges** (Levels 1-3 each auto-spawn a mandatory `progressionBadgeId` map pickup that must be found before the level can advance, on top of every existing skreem/time/chaser condition) and **Humor & Intrigue Random Badges** (a separate, non-gating `HUMOR_BADGE_IDS` pool with an 18% spawn chance per level start, retrying at later levels if missed). Also generalized pickup rendering and the level-clear banner's badge-emoji lookup to be data-driven off `BADGES` instead of hardcoded per-id branches. New `frontend/e2e/progression-badges.spec.js`; fixed a pre-existing flaky assertion in `frontend/e2e/jayden-gun.spec.js`. Full 23-test suite (22 active, 1 pre-existing skip) and `npm run build` pass. `GAME_ITERATION` bumped to `v0.4.32` and deployed. See `docs/handoffs/roadmap-handoff-v0.4.32.md`.
- **Live production bug (black screen on Quick Play) is now resolved:** v0.4.30's Badges integration left `onBadgeEarned` out of `GameEngine`'s constructor destructuring, throwing a `ReferenceError` on boot and crashing the React tree before `<canvas>` could mount. Fixed, verified (18/18 Playwright), and shipped as **v0.4.30.1** — see `docs/handoffs/roadmap-handoff-v0.4.30.md` and `docs/version-log.md`.
- **v0.4.31 (real code):** implemented both items from the v0.4.31-plan handoff in one session — the **Jayden Gun** (map pickup, 1-2 usable rounds, dedicated `F` key + touch FIRE button, fires in the runner's facing direction, 3-5s chaser stun, gun disappears at 0 ammo) and the **Lucky Charm** shop items + **Lucky** badge (`Lucky Charm` 150/+15%, `Golden Lucky Charm` 250/+25%, stacking; badge fires on the luck bonus's first actual proc via a two-stage spawn roll, confirmed with Ken before coding). New `frontend/e2e/jayden-gun.spec.js` and `frontend/e2e/lucky-charm.spec.js`; full 21-test suite (20 active, 1 pre-existing skip) and `npm run build` pass. `GAME_ITERATION` stays `v0.4.30.1` — bump/deploy was scoped "only if asked" and wasn't. See `docs/handoffs/roadmap-handoff-v0.4.31.md`. Rolling Pickups (Mario-style) is still an undesigned backlog item, unrelated to this session.
- **Process note:** `docs/skib-sdlc.md` now has an explicit "no code-cowboy sessions" rule — don't fix a bug found mid-planning inline in a `-plan.md`, give it its own Mode B session; and don't mark a design question "unblocked" for coding unless the user actually answered it in conversation.
- **Live production bug (broken face preview images) is now resolved:** the `v0.4.25` deploy included the fix where `App.jsx` was coercing the face pool object to `[object Object]`. The production menu now correctly shows the selected face assets.
- Front end only. The backend scaffold exists, but the current gameplay and menu do not call it.
- `frontend/src/GameEngine.js` now handles the chase loop, jump-scare, the separate resume-countdown phase, five levels, the shipped Level 4+ quest rooms / survival floor, the Level 5+ chaser wall-hacks + speed bump and the Gawd Particle wall-hack/despawn-respawn counter (v0.4.34), desktop keyboard controls, sprint fixes, a death/skreem-penalty economy, a multi-chaser mechanic (extra toilets join in if a level runs long, with Pipeworks tuned for five simultaneous chasers), a 20-sheebs capture penalty (which can go negative above level 3), and the discreet iteration badge in the HUD.
- `frontend/src/App.jsx` owns the menu, face upload, Shleeb shop, cookie-backed profile state, the play/session handoff, the delayed chase-ambient start, the lvl2 transition overlay lifecycle, the post-kill profile modal / clickable deaths log, and the level 4 warning overlay. The lvl2 video now only mounts after Pipeworks is cleared *and* the engine reports the new hall-coverage / 4-skib survival gate as ready. It also processes 25% item-loss on capture for players above level 4.
- `frontend/src/components/ProfileModal.jsx` now renders the shared killer profile card for both fresh kills and log reopens, while `frontend/src/components/DeathsModal.jsx` shows clickable killer-ID pills.
- `frontend/src/App.jsx` also owns the new menu version log panel, which shows `GAME_ITERATION` plus a short shipped changelog.
- Planning-only review: the current maps are mechanically fine but need stronger landmark identity, so `docs/interactive-content-pack.md` now seeds the next funny runner/chaser item pack and secret awards.
- `frontend/src/version.js` is the single place to bump the visible iteration number. Currently `v0.4.34` (Level 5+ chaser wall-hacks + the Gawd Particle shipped).
- The repo now also has a code-monkey lane: `./scripts/run_code_monkey.sh`
  can dispatch a bounded handoff to local Ollama using the shell's
  `OLLAMA_HOST` or to OpenRouter. A handoff can advertise its target
  backend/model with `code_monkey_backend` and `code_monkey_model`, and
  the lane now understands named Ollama host profiles
  (`thinkpad-local`, `desktop-gaming`) so the cheap local box can stay
  the default.
- Default faces are randomly shuffled from the local gallery each time the user presses play, unless they upload custom faces.
- User id, sheeb balance (can be negative), purchased items, death count, deaths history (now with killer IDs), and highest cleared level persist in cookies. As of v0.4.29 a browser can hold multiple named save slots — see the profile switcher note below and [docs/profiles-and-identity.md](profiles-and-identity.md) for the full field-by-field data model.
- The deployment helper now takes an iteration label and short slug, then commits only the `skib-jay-dee-toilet-game/` subtree in the website repo.
- The audio how-to now spells out local recording guidance: capture however is convenient, keep raw edits lossless if possible, and export game-ready clips as mono `.ogg` or `.mp3` at 44.1kHz.
- The frontend now has a starter audio loop in `frontend/src/assets/audio/jayden-skreem-loop.m4a`; the menu primes it on first interaction and the caught transition reuses the same clip as a quick sting.
- All in-game text lives in `frontend/src/dialog.js` (`CAPTURE_LINES`, `CHASER_LINES`, `TIRED_LINES`) — edit lines there, not in `GameEngine.js`.
- Chaser speed is now rubber-banded across a run (mellows out on capture, ramps up on level-up) instead of fixed per level; see `CHASER_SPEED_MOD_*` constants in `GameEngine.js`. Levels also last longer (raised `advanceAt`) and proximity skreem gain/chaser barks are more frequent.
- `GameEngine` now exposes `onBoostStart`, `onTired`, `onChaserBark`, `onLevelClear`, and `onExtraChaserSpawn` constructor-option hooks, all wired to real audio or timing hooks as of v0.4.10.
- **v0.4.0 audio pass:** the 11 recorded voice clips from `/audio/` (scratch, now removed) were transcoded to mono 44.1kHz mp3 and moved into `frontend/src/assets/audio/` with names describing their in-game role. They're wired into `App.jsx`: chase ambience loop, capture sting, chaser bark/scream/taunt pool, boost stinger, tired groan, level-start/level-clear stings. A cookie-persisted mute toggle (`profile.muted`) has a button on the menu and in-game HUD.
- **Lvl2 video transition:** `frontend/src/assets/video/lvl2-transition.mp4` (moved from repo-root `/video/`) plays once as a full-screen overlay the first time a run clears Pipeworks and reaches level 2. The current proof-of-concept gate is now stricter: the overlay only mounts when Pipeworks hall coverage and a 4-skib survival window have both been met.
- A new docs-only plan now queues a funny near-capture interlude that uses `frontend/src/assets/jayden-getting-captured.jpg` as a pause card with parody captions. It is intentionally separate from the real caught/jump-scare state.
- Full session detail: `docs/handoffs/roadmap-handoff-v0.4.0.md`. Flat change history: `docs/handoffs/ledger.md`. Scoped-out work: `docs/future-versions.md`.
- **v0.4.1-plan (docs-only):** no code changed, `GAME_ITERATION` is still `v0.4.0`. `docs/characters.md` was rewritten with real content (runner pose table, chaser roster table, planned-new-chasers section). Two new chasers are queued as plan-only roadmap items — Sky-Diver (Motor Killer), source photo already at `images/sky-diver-motor-killer.png`; and a second Yoodeling Unc pose, photo not yet saved to the repo. Also reviewed (not fixed) two randomization gaps: all simultaneous chasers share one face (`frontend/src/GameEngine.js:419-421`), and the five `RUNNER_FACE_POOL` poses are never mapped to game state. See `docs/handoffs/roadmap-handoff-v0.4.1-plan.md` for the copy-paste next-steps block.
- **v0.4.2-plan (docs-only, real code):** no new code changed as this session's own work, but it also landed a complete, already-written **chaser face randomization fix** found uncommitted in the working tree — `_maybeSpawnExtraChaser()` in `frontend/src/GameEngine.js` now gives each newly-spawned extra chaser its own independent `randomFrom(CHASER_FACE_POOL)` pick instead of copying `this.chaser.face`, so simultaneous toilets no longer all wear one identical face. Lead-chaser face behavior (`setFaces()`) is unchanged. Verified with `npm run build` and the existing Playwright smoke suite (both pass); no new automated test covers the multi-chaser-spawn path itself (it only fires after 14s of uninterrupted chase — too slow for the current smoke suite), logged as a test-coverage gap in `docs/future-versions.md`. `GAME_ITERATION` is still `v0.4.0` (no deploy requested). This session also queued four more items in `docs/roadmap.md` from user playtesting feedback: (1) the lvl2 transition video fires on *arriving* at Pipeworks instead of on *clearing* it (`App.jsx:156-166`) — ready to fix; (2) Pipeworks's clear condition should require surviving 4 simultaneous chasers instead of the current skreem-timer-only `advanceAt`, but needs a product decision (`MAX_CHASERS` is `3`, not 4`) — ask the user before coding; (3) extra chasers spawned by `_maybeSpawnExtraChaser()` join at a flat `0.92x` speed forever instead of ramping up after joining — ready to fix; (4) confirmed via full `git log` that no "player ded" death video has ever existed in this repo (the only death feedback is the canvas jump-scare `_drawJumpscare()`). **Both open questions (items 2 and 4) were resolved by the user in a same-day follow-up:** Pipeworks's clear condition is now MAX_CHASERS 3→4 plus a skreem threshold gated on all 4 chasers reaching max speed (exact threshold left tunable); the death video stays as-is, no new clip. All four items in `docs/roadmap.md` are now fully unblocked, recommended order: speed-ramp → clear-condition → video-timing → death-visual verification. Also noted eight more unprocessed raw photos in `images/` in `docs/characters.md`, and rewrote `docs/next-agent-coding-brief.md` twice (once stale-cleanup, once to reflect the resolved decisions). See `docs/handoffs/roadmap-handoff-v0.4.2-plan.md` for the copy-paste next-steps block.
- **v0.4.3-plan (docs-only):** started from a request to work the "chaser face randomization fix," but re-verified that item already shipped in v0.4.2-plan (`frontend/src/GameEngine.js:801`, confirmed still correct) — nothing left to do there; redirected (per the user) to documenting a tighter three-session order in `docs/handoffs/roadmap-handoff-v0.4.3-plan.md`: session 1 extra-chaser speed ramp, session 2 Pipeworks's 4-chaser/max-speed clear condition, session 3 lvl2-video timing fix plus death-visual verification. No code changed, no build run, `GAME_ITERATION` still `v0.4.0`. Also found and cleaned up a stray orphaned text fragment left in `docs/roadmap.md` by the concurrent v0.4.2-plan follow-up edit. `docs/next-agent-coding-brief.md` and the v0.4.3 handoff now mirror that same three-session order.
- **v0.4.4 (real code):** picked up the oldest open handoff (`docs/handoffs/roadmap-handoff-v0.4.1-plan.md`) per Mode B ordering, and shipped one of its two remaining unblocked items — the new **Sky-Diver (Motor Killer)** chaser. `images/sky-diver-motor-killer.png` copied into `frontend/src/assets/`, imported in `frontend/src/gameContent.js`, added to `CHASER_FACE_POOL` (tenth entry, id `sky-diver-motor-killer`). No engine changes needed. Verified with `npm run build`, the Playwright smoke suite, and a headless-Chromium run forcing `Math.random` so `randomFrom(CHASER_FACE_POOL)` resolved to the new entry — confirmed the browser actually requests and loads the asset with no console errors, not just that it's present in the bundle. `GAME_ITERATION` stays `v0.4.0`, no deploy. The other remaining v0.4.1-plan item — runner pose-to-state mapping — was deliberately left for a separate session (single-increment sizing rule); the second Yoodeling Unc pose is still blocked on the user. See `docs/handoffs/roadmap-handoff-v0.4.4.md` for the copy-paste next-steps block.
- **v0.4.5-plan (docs-only):** scoped a new "funny near-capture interlude" backlog item (pause-card + parody captions using `jayden-getting-captured.jpg`, deliberately kept separate from the real caught/jump-scare state). No code changed. See `docs/handoffs/roadmap-handoff-v0.4.5-plan.md`.
- **v0.4.8 (real code, most recent session):** picked up Session 1 of the v0.4.3-plan three-session backlog (the oldest unfinished handoff, older than v0.4.5-plan's near-capture interlude) — **extra-chaser speed ramp**. `frontend/src/GameEngine.js`'s `_maybeSpawnExtraChaser()` no longer gives new chasers a flat `* 0.92` speed discount forever; each now gets a `joinRamp: 0` field that climbs to `1` over `CHASER_JOIN_RAMP_SECONDS` (5s), multiplied into the existing `chaser.baseSpeed * this.chaserSpeedMod` calc via a new `lerp()` helper — layered on top of the run-level rubber-band, not replacing it. Tried the code-monkey lane first per the user's ask: confirmed operational (Ollama reachable on `thinkpad-local`/`desktop-gaming`), but a real dispatch on a session-1-scoped prompt returned a diff with wrong line numbers, an invented `MAX_CHASERS = 5`, and a duplicate declaration — not usable, so implemented directly instead. Added `frontend/e2e/chaser-join-ramp.spec.js` (forces an immediate extra-chaser spawn and asserts the ramp behavior); full 5-test Playwright suite passes. `GAME_ITERATION` stays `v0.4.0`, no deploy requested. See `docs/handoffs/roadmap-handoff-v0.4.8.md`.
- **v0.4.6 (real code):** finished clearing the v0.4.1-plan backlog by implementing **runner pose-to-state mapping**, the item flagged as the next natural step in v0.4.4. `frontend/src/GameEngine.js` now swaps Jayden's face to `jayden-getting-captured` the instant a capture happens, holds `jayden-captured` once the jump-scare zoom finishes (`zoom >= 3`), and restores the run's original face once the chase resumes — skipped entirely if the player uploaded a custom face (new `runnerIsCustom` flag threaded `App.jsx` → `GameCanvas.jsx` → `GameEngine.setFaces()`). Added `RUNNER_STATE_FACES` to `frontend/src/gameContent.js` and a new Playwright test, `frontend/e2e/caught-face.spec.js`, that forces an immediate capture (teleporting the chaser onto the runner via a new debug hook, `window.__skibEngine`, exposed from `GameCanvas.jsx`) and asserts the face swaps by object identity through both states, then restores; full 4-test suite passes. **Found and flagged, did not fix:** `md5sum` confirms `jayden-getting-captured.jpg` == `jayden-captured.jpg` and `jayden-uncaring-4029.jpg` == `jayden-default.jpg`, byte-for-byte — only 3 of the 5 documented runner poses are actually distinct photos. The swap logic is correct and ready, but the capture beat will visibly show the same photo twice until Ken supplies real distinct shots (or confirms the pool should collapse to 3 poses) — flagged in `docs/roadmap.md` and `docs/characters.md`, not guessed at, per the "real family photos" constraint in `docs/skib-sdlc.md`. `GAME_ITERATION` stays `v0.4.0`, no deploy requested. See `docs/handoffs/roadmap-handoff-v0.4.6.md` for the copy-paste next-steps block.
- **v0.4.14 (real code, most recent session before this one):** picked up the **face crop on upload** item from the roadmap's incremental backlog (user picked it from a shortlist of three unblocked candidates: intro cinematic, face crop, level-data extraction). `frontend/src/components/FaceUpload.jsx` now runs every uploaded photo through a new `cropToOval()` helper — center-crop to a square on an offscreen 256x256 canvas, clip with an ellipse path, re-export as a PNG data URL — before handing it to `onFace()`, so both the Runner and Chaser upload slots stop rendering as a stretched raw square. No `GameEngine.js` changes needed since `_drawEntity()` already just `drawImage()`s `entity.face` into the entity's square box; the transparency now baked into the uploaded image does the rest. Added `frontend/e2e/face-crop-verify.spec.js` (uploads a real asset, decodes the resulting PNG on an in-page canvas, asserts a transparent corner pixel vs. an opaque center pixel) — full 8-test Playwright suite passes. Also took a manual in-game screenshot after uploading a real photo to confirm the oval renders correctly on the sprite, not just in the isolated crop check. Default/gallery faces are untouched by design — the roadmap item scoped this to uploads only. `GAME_ITERATION` stays unbumped, no deploy requested. See `docs/handoffs/roadmap-handoff-v0.4.14.md`.
- **v0.4.16 (real code):** picked up the two "high-impact" items the v0.4.15-plan handoff recommended first — **Sheebs default fix** and **skreem-loop fix**. `frontend/src/lib/cookies.js`'s `normalizeProfile()` now falls back new profiles to `0` sheebs instead of `200`. `frontend/src/App.jsx`'s `startMenuAudio()` was the actual bug: it was meant to silently "prime" `jayden-skreem-loop.m4a` on the first menu pointerdown so the browser allows later autoplay, but it called `getAudio(menuAudioRef, skreemLoopUrl, true, 0.22)` — real volume, `loop: true` — and genuinely played it, so the scream clip looped audibly for as long as the player stayed on the menu. It now primes at `volume: 0`/`loop: false` and pauses itself once `play()` resolves. Added `frontend/e2e/menu-audio-prime.spec.js`, which monkey-patches `window.Audio` to record `play`/`pause` calls; verified it fails against the pre-fix code (stashed the fix, rebuilt, served standalone on a second port) before confirming the fix makes it pass — full 10-test Playwright suite passes. Also merged `docs/handoffs/dad_case_handoff.md` (Ken's filled-in Dad Case profile content, saved to the wrong folder) into `docs/profiles/dad-case.md` and removed the misplaced duplicate. `GAME_ITERATION` bumped to `v0.4.16` and deployed. See `docs/handoffs/roadmap-handoff-v0.4.16.md`.
- **v0.4.17 (real code):** implemented the **Dad Case Environmental Traps**. Modified `_maybeSpawnExtraChaser()` in `frontend/src/GameEngine.js` to resolve and pass the chaser's `faceId` in the `onExtraChaserSpawn` payload. Updated `App.jsx` to listen for the `dad-case` faceId, setting a state that mounts a `.dad-case-darkness` overlay and a text placeholder for a slamming door sound. The overlay stays visible while the chase continues and resets cleanly on caught, restart, or level change. Rebuilt and ran the full 10-test Playwright suite (all passed). Bumped `GAME_ITERATION` to `v0.4.17` and deployed. See `docs/handoffs/roadmap-handoff-v0.4.17.md`.
- **v0.4.18 (real code):** added the **Version page** — `App.jsx` imports `VersionModal`, tracks `versionOpen` state, and adds a `WHAT'S NEW` menu button; `VersionModal.jsx` renders the current `GAME_ITERATION` plus a short static changelog list, styled to mirror the shop panel. Added `frontend/e2e/smoke.spec.js` coverage for the panel. Bumped `GAME_ITERATION` to `v0.4.18` and deployed. See `docs/handoffs/roadmap-handoff-v0.4.18.md`.
- **v0.4.19 (real code):** implemented the **Dad Case Environmental Traps: real audio** slice queued by `docs/handoffs/roadmap-handoff-v0.4.19-plan.md` — Ken had already uploaded `door-sounds.m4a` and `lights.m4a` to `frontend/src/assets/audio/`, so this session wired them in and removed the old text stub. `handleExtraChaserSpawn` in `App.jsx` now calls `playOneShot()` for both clips together when the `dad-case` chaser spawns; the `*DOOR SLAM SOUND*` placeholder `<div>` and its `.dad-case-sound-text` CSS class are gone. Also refreshed `VersionModal.jsx`'s changelog (added v0.4.19, simplified away a hardcoded "current iteration" entry that would've gone stale every bump) and fixed a stale roadmap checkbox — **Code Monkey host-profile routing** was already implemented but still showed unchecked. Full 11-test Playwright suite passes. Bumped `GAME_ITERATION` to `v0.4.19`. See `docs/handoffs/roadmap-handoff-v0.4.19.md`.
- **v0.4.21 (real code):** the Deaths pill now opens a modal that shows the latest capture records with timestamps and level names, backed by a new `deathsHistory` array in the cookie profile. `GAME_ITERATION` is now `v0.4.21`, and the current version log/smoke suite were updated to reflect it.
- **v0.4.22 (real code):** the level-advance pacing for non-Pipeworks levels is now gated by an elapsed time floor (`MIN_LEVEL_SECONDS_BEFORE_ADVANCE = 30`) and a minimum chaser count (`this.chasers.length >= 2`), AND'd with the existing skreem threshold. The extra chaser spawn interval was also bumped to 20 seconds. The next open backlog item is the game identity / multiple save slots work.
- **v0.4.23-plan (docs-only, superseded):** scoped a post-kill chaser profile screen and kill-history logging. Superseded by the fuller-scope v0.4.25-plan below (adds `chaserId` logging + clickable Deaths log) — don't code from the v0.4.23-plan file anymore, it's kept only for its design rationale.
- **v0.4.24 (real code, landed):** implemented the "Subway Surfers-style resume countdown" from `docs/handoffs/roadmap-handoff-v0.4.24-plan.md`. After the jump-scare finishes, `GameEngine.js` now enters a new `'resume-countdown'` phase (`_updateResumeCountdown`/`_drawResumeCountdown`) that freezes the world at the reset spawn points for 3 seconds and shows a pulsing centered "3… 2… 1…" (no flashing) before resuming the chase, instead of the old instant teleport back into a moving chase. `frontend/e2e/resume-countdown.spec.js` covers the phase transitions and timing. `GAME_ITERATION` is now `v0.4.24`. See `docs/handoffs/roadmap-handoff-v0.4.24.md`.
- **v0.4.25-plan (docs-only, still open — oldest unfinished handoff):** expands the superseded v0.4.23-plan into a full post-kill profile system — logs `chaserId` in `deathsHistory`, adds a `CHASER_PROFILES` content map and a `ProfileModal.jsx` shown automatically after a capture's shake finishes, and makes the Deaths log clickable to reopen any past killer's profile. This was scoped in an earlier session but never got its ledger/version-log/update-directions entries until this session backfilled them. Fully unblocked, ready for Mode B. See `docs/handoffs/roadmap-handoff-v0.4.25-plan.md`.
- **v0.4.26-plan (docs-only):** scoped two new "stakes go up for experienced players" backlog items (Phase 7 in `docs/roadmap.md`) prompted by Ken's screenshot reaction to seeing 240 sheebs alongside 2048 lifetime deaths — (1) let sheebs go negative on capture once `profile.highestLevel > 3` instead of always flooring at 0, and (2) let captures above level 4 have a chance to strip a previously purchased shop item back out of the profile. **Both items are blocked on product decisions from Ken** (debt-display styling; item-loss eligibility/chance/warning/rebuy rules) — do not dispatch to Code Monkey until those are answered. See `docs/handoffs/roadmap-handoff-v0.4.26-plan.md`. Queued behind v0.4.25-plan, which is still the oldest unfinished handoff.
- **v0.4.29 (real code):** implemented the **profile switcher / multiple save slots** item, the next unclaimed backlog item after v0.4.28. Clicking the "User `<name>`" pill on the menu now opens `ProfileSwitcherModal.jsx`, listing every profile ever active in this browser (a new `localStorage` registry mirrors the existing cookie-backed active profile), with "Play as this profile" to switch and a nickname field to create a new one. `frontend/src/lib/cookies.js` gained `listProfiles()`/`switchProfile()`/`createProfile()` and `label`/`updatedAt` profile fields; the single-active-profile cookie contract everything else relies on (`loadProfile()`/`persistProfile()`) is unchanged. Also wrote `docs/profiles-and-identity.md`, a full profile attribute table plus a Phase 6 (server-side/Mongo) planning writeup — identity/auth, sync strategy, and local-data migration are the open decisions there, nothing coded. `GAME_ITERATION` is now `v0.4.29`. See `docs/handoffs/roadmap-handoff-v0.4.29.md`.
- **v0.4.29-plan refinement (docs-only):** the current difficulty-ramp framing is now explicit: later levels should stay interactive, and the Schleimy Potion is documented as a tradeoff tool rather than a skip button. The separate Micro-Skib counterpressure remains a standalone backlog line so enemy-AI work stays decoupled from the item pickup slice.
- **v0.4.30 (real code):** implemented the **Rewards/Badges system**. `earnedBadges` array added to cookie persistence. Four initial badges defined in `BADGES` in `gameContent.js`. They trigger during gameplay on milestones (paying off debt, 50 deaths, surviving level 4) and appear as a toast message. Badges are also displayed in the main menu beneath the status pills, and at the bottom of the level-clear banner. Backlog updated with Jayden Gun and Mario-style Rolling Pickups. `GAME_ITERATION` is now `v0.4.30`. See `docs/handoffs/roadmap-handoff-v0.4.30.md`.

## Files to check first

- `README.md`
- `AGENTS.md`
- `docs/skib-sdlc.md`
- `docs/version-log.md`
- `docs/roadmap.md`
- `docs/sound-effects-howto.md`
- `docs/dev-notes.md`
- `frontend/src/GameEngine.js`
- `frontend/src/dialog.js`
- `frontend/src/App.jsx`
- `frontend/src/components/ProfileModal.jsx`
- `frontend/src/components/DeathsModal.jsx`
- `frontend/src/components/VersionModal.jsx`
- `frontend/src/gameContent.js`
- `frontend/src/version.js`
- `frontend/src/lib/cookies.js`
- `frontend/src/components/GameCanvas.jsx`
- `frontend/src/components/ShopModal.jsx`
- `docs/handoffs/roadmap-handoff-v0.4.25.md`
- `docs/handoffs/roadmap-handoff-v0.4.25-plan.md`
- `docs/handoffs/roadmap-handoff-v0.4.17.md`
- `docs/handoffs/roadmap-handoff-v0.4.18.md`
- `docs/handoffs/roadmap-handoff-v0.4.18-plan.md`
- `docs/profiles-and-identity.md`
- `frontend/src/components/ProfileSwitcherModal.jsx`
- `docs/handoffs/roadmap-handoff-v0.4.32.md`
- `docs/handoffs/roadmap-handoff-v0.4.31.md`
- `docs/handoffs/roadmap-handoff-v0.4.31-plan.md`
- `frontend/e2e/jayden-gun.spec.js`
- `frontend/e2e/lucky-charm.spec.js`
- `scripts/run_code_monkey.sh`
- `scripts/code_monkey_direct.py`

## Code Monkey Start

If you want to launch the bounded automation lane instead of working
manually:

1. Open `docs/handoffs/` and pick the handoff you want the worker to
   execute.
2. Check whether that handoff has `code_monkey_backend` and
   `code_monkey_model` hints. If not, the local default is Ollama using
   the `thinkpad-local` profile from your shell environment, with
   `OLLAMA_HOST` as the fallback.
3. Run `./scripts/run_code_monkey.sh --dry-run <handoff.md>` once to see
   the exact prompt the worker will get.
4. Run `./scripts/run_code_monkey.sh <handoff.md>` to actually dispatch
   it.
5. Use the handoff's own verification command plus `git diff` to check
   whether the slice worked.
6. To force a profile on the wrapper, add `--profile thinkpad-local` or
   `--profile desktop-gaming`.

## Current gameplay features

- Mobile joystick still works bottom-left.
- Sprint button is now a hold-to-run state instead of getting stuck.
- Desktop players can use Arrow keys or WASD to move and SPACE to boost.
- The canvas currently has five levels:
  - Porcelain Palace
  - Pipeworks
  - Flooded Annex
  - The Ramen Aisle
  - World Star Parking Lot
- The Shleeb shop is front-end only and sells stat upgrades that persist in cookies.
- The profile tracks lifetime deaths (shown in the menu and the in-game HUD); getting caught also deducts a chunk of the current skreem total.
- If the runner survives a level too long without getting caught, extra toilets join the chase (capped, resets on capture or level change) — the HUD shows "TOILETS ON YOU" once more than one is active.
- A discreet version/iteration label now appears in the menu and the in-game HUD so deploys can be matched to a visible build tag.
- New chaser/runner faces are added by dropping an image in `frontend/src/assets/` and adding one entry to `RUNNER_FACE_POOL` / `CHASER_FACE_POOL` in `frontend/src/gameContent.js` — see `crazy-jack-chaser` for the pattern.
- The runner can find a Jayden Gun map pickup (once per level, odds boosted by the Lucky Charm shop items); fire it with `F` or the on-canvas FIRE button to stun the closest chaser you're facing for 3-5s.

## Where to edit things

- Add or rebalance levels in `frontend/src/GameEngine.js`.
- Add or change shop items in `frontend/src/gameContent.js`, then keep the purchase logic aligned in `frontend/src/App.jsx`.
- Change persistence fields in `frontend/src/lib/cookies.js`.
- Bump the visible iteration in `frontend/src/version.js` when you want a new build tag.
- Change menu/shop presentation in `frontend/src/App.jsx` and `frontend/src/App.css`.
- Change game HUD, controls, or level rendering in `frontend/src/GameEngine.js`.

## Natural follow-up work

- **Jayden Gun + Lucky Charm/Lucky badge landed in v0.4.31** — no longer on this list. Rolling Pickups (Mario-style) is still a separate, undesigned backlog item.
- **v0.4.26-plan shipped as v0.4.26** (negative sheebs debt + item loss above level 3/4) — that line is stale, corrected here.
- **Early-level progression badges + humor/random badges landed in v0.4.32** — no longer on this list. Quest Rooms and the Level 4+ 90-second survival floor shipped in v0.4.33. **Chaser Wall Hacks + the Gawd Particle landed in v0.4.34** — no longer on this list either. The current content-polish thread is `v0.4.35-plan` (Rolling Pickups, Schleimy Potion, Coolness Dialog) — that's the oldest unfinished handoff now.
- The next map-architecture follow-up is parked in `docs/handoffs/roadmap-handoff-v0.4.36-plan.md` so the v0.4.35 content-polish slice can stay small.
- `v0.4.25` is now shipped: the post-kill profile card, killer-ID logging, and clickable deaths log are in production.
- **Game identity / multiple cookie-backed save slots landed in v0.4.29** — the profile switcher, `localStorage` registry, and `docs/profiles-and-identity.md` are all in place. No longer on this list.
- Next unclaimed, unblocked items from the backlog: **cosmetic shop item (sink)** and **menu brag stat (best level + fewest deaths)** are both small and open. The badges/rewards system and the Schleimy Potion/Micro-Skib items are still blocked on product decisions from Ken — see their entries in `docs/roadmap.md`. After the current content-polish thread, the new `docs/interactive-content-pack.md` is the source of truth for the next funny secret-item / award pass.
- Phase 6 (server-side/Mongo profile persistence) now has a starting point — `docs/profiles-and-identity.md` lays out the open identity/auth and sync-strategy decisions a future session needs answered before coding it. Still queued behind Phase 5 (multiplayer) in `docs/roadmap.md`, still planning-only.
- The current content-polish planning thread is **v0.4.35-plan**: Rolling Pickups, Schleimy Potion, and Coolness Dialog. The follow-on content catalog lives in `docs/interactive-content-pack.md`, ready to be pulled into a later handoff once the core polish slice lands.
- The lvl2 transition now waits for the Pipeworks coverage/survival gate before mounting, so the next gameplay slice can move on to the remaining backlog instead of re-litigating that RCA.
- Do **not** start "Audio 2: 1:1 capture/bark voice clips" next — it
  needs Ken to record real voice clips first, it's not a pure coding
  task. Ask him before treating it as unblocked.
- The version page is now shipped in v0.4.18 — don't spend another
  session on it unless you want to redesign the panel or expand the
  changelog.
- The v0.4.5-plan near-capture interlude landed in v0.4.12 — no longer on this list.
- Runner pose-to-state mapping landed in v0.4.6 — no longer on this list.
  Its one loose end is a Ken-only ask, not a coding task: supply real
  distinct photos for `jayden-getting-captured`/`jayden-uncaring-4029`
  (currently byte-identical duplicates of `jayden-captured`/
  `jayden-default`), or confirm the pool should collapse to 3 unique
  poses. See `docs/roadmap.md` and `docs/characters.md`.
- Face crop on upload landed in v0.4.14 — no longer on this list.
- Also still open: the 1:1 audio clip work, the World Star intro
  cinematic, level data extraction, and the other smaller future
  items parked in `docs/roadmap.md`.
- Do a real sound-on playthrough of the v0.4.0 audio pass — it was wired and tested (build + Playwright) but never actually listened to in this sandbox (no speakers). Check volume balance before building more on top of it.
- Audio polish: volume ducking, a real composed menu theme, 1:1 capture-line/chaser-bark clips instead of a themed pool. See [docs/future-versions.md](docs/future-versions.md).
- Add a skip button to the lvl2 video transition, and/or replace the clip (user-flagged as rough).
- Fix the `.portrait-frame` wide-viewport CSS bug found during v0.4.0 testing (see [docs/future-versions.md](docs/future-versions.md)) — worked around in the test, not fixed in the app.
- Add the scripted World Star intro cinematic (full script from the PDF, not the standalone lvl2 video clip).
- Crop or mask uploaded faces instead of stretching the raw image — landed v0.4.14.
- Add more character roles or abilities from the PDF roster.
- Extract level data out of hardcoded map-builder functions before hand-authoring more levels — see the level/map plan in [docs/roadmap.md](docs/roadmap.md).
- Wire up backend persistence or multiplayer only after the front-end loop feels solid.

## Version record

- The current upgrade checkpoint is documented in [docs/version-log.md](docs/version-log.md).
- When future agents make a meaningful change, append a new version section there so the design and plan trail stays durable.
- Follow the session process in [docs/skib-sdlc.md](docs/skib-sdlc.md) and pull the next increment from [docs/roadmap.md](docs/roadmap.md).

## Constraints to keep respecting

- Keep the app front-end only unless the user explicitly asks for backend work.
- Keep the portrait 9:16 layout.
- Do not break the cookie profile flow when touching the shop or the level rewards.
- Preserve the local image gallery behavior so random defaults still change between plays.
