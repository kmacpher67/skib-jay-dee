# Change Ledger — Skib-Jay-Dee-Toilet

A flat, append-only, one-line-per-change list of everything that's landed,
in order. This is the fast-scan index; for *why* a change happened, see the
matching entry in [docs/version-log.md](../version-log.md), and for the
full session write-up see the matching
`docs/handoffs/roadmap-handoff-vX.Y.Z.md` file (introduced starting
v0.4.0 — earlier versions only have a version-log entry).

Never edit past lines. Append a new line (or block) per version when you
update `docs/version-log.md`.
2026-07-27 | v0.4.40 | Added Shart Knocker active ability (charge from Taco Bell Grande, hit FIRE to stun chaser) and Flaming Ass badge
2026-07-27 | v0.4.39.1 | Fixed Level 4 spawn point to stop runner from starting inside a wall
2026-07-27 | v0.4.39 | Added Enhanced Death Logs telemetry (timePlayed, sessionSheebDelta, sessionSkreemDelta) to deathsHistory
2026-07-27 | v0.4.39 | Added Fair Use / Parody Warning and GitHub feedback link to Main Menu footer
2026-07-27 | infra/docs (GPT-5.3-Codex) | Fixed E2E workflow failures: CI local prebuild + preview-only Playwright webServer in CI, production smoke/full split, and RCA documented in dev-notes + README
2026-07-27 | infra/docs (Claude, Sonnet 5) | Bumped e2e.yml setup-node to Node 22 (was 20); added engines + frontend/.nvmrc; documented Node 20 Actions-runtime deprecation warning vs project Node version in dev-notes.md + README
2026-07-27 | infra/docs (Claude, Sonnet 5) | Revisited same-day: bumped Node target 22 → 24 (current Active LTS, not yet-LTS 26) across e2e.yml/engines/.nvmrc; verified npm ci + build + full e2e suite pass on Node 24; documented LTS-cadence decision in dev-notes.md
2026-07-27 | docs (Claude, Sonnet 5) | Roadmap snapshot: 16 open frontend backlog items tagged; v0.4.40 Shart Knocker plan + next-agent-planning-brief created; queue order locked (v0.4.39 then v0.4.40); v0.4.38-plan marked shipped
2026-07-27 | v0.4.37 | Close-call freeze phase added after near-capture beat
2026-07-27 | v0.4.37 | Clean close-call escape awards +50 sheebs and Slippery badge
2026-07-27 | v0.4.37 | Positive pickups award +5 sheebs on collection
2026-07-27 | v0.4.37 | Added e2e test for close-call rewards and freeze
2026-07-27 | v0.4.38 | Added Level 6 "Jayden's Nightmare House" to the live level list
2026-07-27 | v0.4.38 | Introduced Skib-Daddy-Toilet Guy with Plunger Launch and the Garage Survivor badge
2026-07-27 | v0.4.38 | Refreshed Version modal copy for the shipped Level 6 release note
2026-07-27 | v0.4.38 | Verified the ship state with build + Playwright after fixing the close-call test seam
2026-07-27 | docs (Claude, Sonnet 5) | Backfilled missing `roadmap-handoff-v0.4.37.md`; corrected stale `v0.4.39-plan` (already-shipped items, resolved worktree); fixed a misplaced v0.4.36 fragment in `version-log.md`; rewrote `next-agent-coding-brief.md`; no code changed
2026-07-27 | docs (Codex, GPT-5) | Refined `v0.4.39-plan`, `next-agent-coding-brief.md`, and `difficulty-mechanics-plan.md` to keep Enhanced Death Logs on raw telemetry and park difficulty math in Method C / Debt Lock
2026-07-27 | docs (Claude, Sonnet 5) | Reviewed rolling deaths/sheebs auto-tuning idea; added "Auto-tuning refinement" to `difficulty-mechanics-plan.md` (extend Method C, no `DifficultyManager` class, economy-side lever, level-indexed floors — TBD window/values)
2026-07-27 | docs (Claude, Sonnet 5) | Annotated Level 7+ Mosaic Map of Madness concept as reviewed; flagged the unanswered dimension-shift-trigger question (floor trap vs. held item) for Ken instead of assuming an answer
2026-07-27 | docs (Claude, Sonnet 5) | Added provenance headers to `difficulty-mechanics-plan.md` and `level-progression-and-endgame-plan.md`; addendum appended to open `v0.4.39-plan` handoff
2026-07-27 | v0.4.38 | Extracted Levels 3-5 to grid format.
2026-07-27 | v0.4.38 | Added Level 6 (Jayden's Nightmare House) via grid format.
2026-07-27 | v0.4.38 | Added Skib-Daddy-Toilet Guy with Plunger Launch ability.
2026-07-27 | v0.4.38 | Added Garage Survivor quest room & badge for Level 6.

## v0.4.38 — 2026-07-27 (real code)

- Finished migrating `buildFloodedAnnex`, `buildRamenAisle`, and `buildWorldStarParkingLot` to the grid parser in `GameEngine.js`.
- Added Level 6 (`Jayden's Nightmare House`) using a looping hallway map powered by the new grid system.
- Added Skib-Daddy-Toilet Guy with a Plunger Launch ability (using the `dad-case` face for now).
- Added a `Garage Survivor` landmark badge and quest room for Level 6.
- Tests passed. `GAME_ITERATION` bumped to `v0.4.38` and deployed.

## docs-only planning pass — 2026-07-27

- Queued a new Level 4+ `Shart Knocker` follow-up for the shipped Taco Bell Grande pickup.
- Added the flaming-ass badge seed, item-seed row, roadmap backlog note, and audio-stub guidance to the docs set.


## v0.4.36.1 — 2026-07-27 (real code)

- Finished the uncommitted, half-wired diff flagged in the v0.4.38-plan
  planning pass — a real but incomplete attempt at `v0.4.36`'s own named
  follow-ups (Soggy Toilet Paper, Heavy Plunger, `Friendly Fire` badge).
- Fixed a duplicate `_spawnQuestRoomBadge()` call and a duplicate
  `_maybeSpawnGunPickup()` call at level start.
- Confirmed `this.phase === 'playing'` → `'chase' || 'near-capture'` was
  a real bug fix — `'playing'` was never a valid phase, so the Gawd
  Particle/Schleimy Potion/Taco Bell/Decoy timers were dead code before it.
- Wired real pickup-collection for `soggy-tp` and `heavy-plunger`
  (previously spawned but uncollectible).
- Added a trail-drop + chaser-slow effect for the Soggy Toilet Paper and
  a `_swingPlunger()` knockback hooked to the existing F-key/FIRE-button
  input for the Heavy Plunger.
- Wired a real trigger for the `Friendly Fire` badge via a grace-window
  flag on gun-stunned chasers.
- Removed the leftover `scratch_apply_all*.js` debug files from the repo
  root.
- Added `frontend/e2e/soggy-tp-plunger-friendly-fire.spec.js`; full
  29-test suite (29 active, 1 pre-existing skip) and `npm run build` pass.
- Bumped `GAME_ITERATION` to `v0.4.36.1` and deployed.

## v0.4.38-plan — 2026-07-27 (docs-only)

- Found and flagged an uncommitted, unverified diff already sitting in
  the working tree (`GameEngine.js`, `gameContent.js`, `mapGrids.js` +
  stray `scratch_apply_all*.js` files) — an apparent interrupted attempt
  at `v0.4.36`'s named follow-ups. Documented it prominently in
  `docs/roadmap.md` and `docs/update-directions.md` so it isn't built on
  top of blindly.
- Scoped Level 6 ("Jayden's Nightmare House") + new chaser
  Skib-Daddy-Toilet Guy (Plunger Launch ability) into a ready-to-code
  handoff, `docs/handoffs/roadmap-handoff-v0.4.38-plan.md` — resolved the
  one blocking creative decision (placeholder face: reuse `dad-case`)
  with Ken. Kept Level 7 ("CEO of Drains") parked, not scoped.
- Corrected two roadmap checkboxes that overstated shipped work:
  level-data extraction (only 2 of 5 levels are grid-based) and the
  Secret Interaction Badges item (`Friendly Fire` isn't actually wired,
  only an unwired badge-id stub in the uncommitted diff).
- Updated `docs/characters.md`, `docs/badges.md`,
  `docs/interactive-content-pack.md`, `docs/level-progression-and-endgame-plan.md`,
  `docs/roadmap.md`, and `docs/update-directions.md` to match.

## v0.4.37-plan — 2026-07-27

- Refocused the next open plan toward a fun-first front-end content
  pass: richer dialog, badge flavor, map callouts, and a compact menu
  brag surface.
- Kept the balance-number tuning as a later follow-up instead of mixing
  it into the same single-session handoff.
- Updated the roadmap, update directions, version log, next-agent brief,
  and the open v0.4.37 handoff so the next coding agent has a clean
  starting point.

## v0.4.37-plan addendum — 2026-07-27

- Retargeted the open v0.4.37 handoff toward the close-call freeze and
  reward pass instead of the older content-first polish slice.
- Added `docs/close-call-freeze.md` plus matching roadmap, update
  directions, badges, version-log, and next-agent brief edits so the
  next code session has one clear gameplay-tuning goal.

## v0.4.35 — 2026-07-27

- Implemented **Rolling Pickups**: Mario-style items bouncing around the map granting random helpful/harmful effects on touch (speed, stamina, sheebs vs slow, damage).
- Implemented **Schleimy Potion**: Rare map pickup that shrinks the runner's hitbox by 65% for 4 seconds to squeeze through tight gaps, trading off 20% speed and increasing chaser speed. Added a UI timer bar next to stamina.
- Added **Coolness Lines** triggered on narrow escapes, using the potion, and using the Gawd Particle.
- Added **Hard Chaser Lines** triggered when entering Level 4+ and when the debt economy hits (dying with negative sheebs penalty).
- Cleaned up the old `initialSheebs = 200` leftover default in `GameEngine.js`.
- Verified changes with Playwright (`npm run playwright test`) and `npm run build`.
- Bumped `GAME_ITERATION` to `v0.4.35` and deployed.

## v0.4.35-plan — 2026-07-27

- Seeded `docs/interactive-content-pack.md` with the next wave of
  runner-good, runner-bad, chaser-good, and chaser-bad item ideas plus
  four exploration award seeds.
- Updated `docs/roadmap.md` to call out map personality as a real
  quality goal, mark the shipped v0.4.33 quest-room / Level 4+ floor
  work as done, and add the interactive content pack as a backlog item.
- Updated `docs/future-versions.md`, `docs/badges.md`, and
  `docs/update-directions.md` so the next agent has one obvious place to
  look for the funny secret-item / award follow-up.
- Added a short follow-on note to the open `v0.4.35-plan` handoff,
  keeping the existing rolling-pickups / potion / dialog plan as the
  primary open slice.
- Seeded a new `v0.4.36` handoff for the next map-refactor / cursed-
  pickup / secret-badge slice.

## v0.4.32 — 2026-07-26

- Shipped **early-level progression badges**: Levels 1-3 (Porcelain
  Palace, Pipeworks, Flooded Annex) each auto-spawn a mandatory
  `progressionBadgeId` map pickup (`porcelain-prowler`, `pipe-dreamer`,
  `annex-relic-hunter`); both level-advance branches now require
  `_hasRequiredLevelBadge()` on top of existing skreem/time/chaser
  conditions. `frontend/src/GameEngine.js`.
- Shipped **humor/intrigue random badges**: a new `HUMOR_BADGE_IDS` pool
  (`Mysterious Plunger`, `Golden TP`, `Haunted Rubber Ducky`) rolls an
  18% spawn chance per level start, non-gating, retries at later levels
  if missed. `frontend/src/gameContent.js`, `frontend/src/GameEngine.js`.
- Generalized pickup rendering (`_pickupStyle()`) and the level-clear
  banner's badge-emoji row (now a dynamic `BADGES` lookup instead of a
  hardcoded if-chain) so new badges don't need engine-side render
  changes.
- Added `frontend/e2e/progression-badges.spec.js`; fixed a pre-existing
  flaky stun-value assertion in `frontend/e2e/jayden-gun.spec.js`. Full
  Playwright suite (22 active + 1 pre-existing skip) and `npm run build`
  pass. `GAME_ITERATION` bumped to `v0.4.32` and deployed. See
  `docs/handoffs/roadmap-handoff-v0.4.32.md`.

## v0.4.31 — 2026-07-26

- Shipped the **Jayden Gun**: map pickup (50% base spawn chance/level),
  1-2 usable rounds, dedicated `F` key + touch FIRE button fires in the
  runner's facing direction, 3-5s chaser stun on hit, gun disappears at
  0 ammo. `frontend/src/GameEngine.js`.
- Shipped the **Lucky Charm** shop items (`Lucky Charm` 150/+15%,
  `Golden Lucky Charm` 250/+25%, stacking) and the **Lucky** badge,
  firing on the luck bonus's first actual proc (two-stage roll) per
  Ken's confirmed trigger. `frontend/src/gameContent.js`,
  `frontend/src/GameEngine.js`.
- Added `frontend/e2e/jayden-gun.spec.js` and
  `frontend/e2e/lucky-charm.spec.js`. Full Playwright suite (20
  active + 1 pre-existing skip) and `npm run build` pass.
  `GAME_ITERATION` stays `v0.4.30.1` (no deploy requested). See
  `docs/handoffs/roadmap-handoff-v0.4.31.md`.

## v0.4.31-plan — 2026-07-26 (docs-only)

- Finalized design for two backlog items: the "Jayden" Gun (randomized
  1-2/6 ammo, dedicated-key fire in facing direction, 3-5s stun on hit,
  disappears at 0 ammo, map-pickup acquisition) and a new "Lucky Charm"
  Shleeb Shop item + "Lucky" badge (biases positive-pickup spawn odds).
  All open questions answered directly by Ken. Added the reworded
  process rule to `docs/skib-sdlc.md` ("no code-cowboy sessions" — a
  bug found during planning gets its own Mode B session; don't
  auto-unblock a design decision without the user actually answering
  it). See `docs/handoffs/roadmap-handoff-v0.4.31-plan.md`.

## v0.4.30.1 — 2026-07-26

- **URGENT HOTFIX:** Fixed a `ReferenceError` on boot caused by missing `onBadgeEarned` in the `GameEngine` constructor parameter destructuring. This crash broke the entire game (`<canvas>` failed to mount).

## v0.4.30 — 2026-07-27

- Added persistent Badges system with `earnedBadges` array.
- Defined initial four badges and wired them to trigger on paying off debt, reaching 50 deaths, and clearing level 4.
- Rendered badges as toasts, in the menu, and on the level-clear banner.

## v0.4.29 — 2026-07-26

- Added a `localStorage`-backed profile registry (`sjdt_profiles_v1`) in
  `frontend/src/lib/cookies.js` alongside the existing cookie pair, with
  `listProfiles()`/`switchProfile()`/`createProfile()` exports and new
  `label`/`updatedAt` profile fields.
- Added `frontend/src/components/ProfileSwitcherModal.jsx`; the menu's
  "User `<name>`" pill is now clickable and opens it.
- Added `frontend/e2e/profile-switcher.spec.js`.
- Fixed a `safeParse()`/`JSON.parse(null)` landmine in the new
  `readRegistry()` path (`localStorage.getItem()` returning `null` wasn't
  falling back to `{}`).
- Wrote `docs/profiles-and-identity.md` (full profile attribute table,
  related backlog, Phase 6 server-sync planning notes).
- Bumped `GAME_ITERATION` to `v0.4.29` and deployed.

## v0.4.29-plan — 2026-07-26 (docs-only)

- Scoped a new Phase 7 backlog item in `docs/roadmap.md`: a "Schleimy
  Potion" collectible that temporarily shrinks the runner's hitbox to
  slip through tight map wall gaps, balanced with a risk/reward cost
  (speed penalty + temporary chaser speed-mod bump while active) rather
  than a free escape tool. Also scoped a separate future backlog line
  for a "Micro-Skib" chaser variant sized to fit through the same
  cracks. Closed out Ken's stamina/hit-and-keep-running audit request —
  already shipped in the existing sprint/stamina system, no code needed.
  Clarified the item as a progression-ramp tradeoff rather than a skip
  button, so later levels stay interactive.
  See `docs/handoffs/roadmap-handoff-v0.4.29-plan.md`.

## v0.4.28-plan — 2026-07-26 (docs-only)

- Scoped two new Phase 7 backlog items in `docs/roadmap.md` from Ken's
  follow-up requests: (1) a Level 4 "Stakes Are Real" full-screen
  transition overlay (header, three rule lines, "I ACCEPT MY FATE"
  button, using the `level-4-warning-transition-screen.jpeg` asset Ken
  supplied) that fires once per run on the level 3→4 transition, and (2) a
  new persistent rewards/badges system, blocked on Ken picking an initial
  badge list and persistence/render design. Recorded Ken's answers to the
  v0.4.26-plan product questions (debt badge, all items eligible, rolled
  25% chance, buy-back yes) for the paper trail, and flagged an
  unverified buy-back behavior for the next Mode B session to spot-check.
  See `docs/handoffs/roadmap-handoff-v0.4.28-plan.md`.

## v0.4.28 — 2026-07-26

- Shipped the Level 4 "Stakes Are Real" transition screen. The game now pauses and displays a warning overlay the first time a player reaches The Ramen Aisle (Level 4) per run, explaining the debt and item loss mechanics.
- Bumped `GAME_ITERATION` to `v0.4.28` and deployed to production.

## v0.4.26 — 2026-07-26

- Shipped sheebs debt and item loss risk for experienced players (`highestLevel > 3` and `highestLevel > 4` respectively).
- Adjusted cookie parsing and `GameEngine` state synchronization so that sheebs are allowed to persist and display as negative ("DEBT" badge).
- Added two new playwright test files to cover the new behaviors.
- Bumped `GAME_ITERATION` to `v0.4.26` and deployed to production.

## v0.4.25 — 2026-07-26

- Shipped the post-kill profile system: captures now pause on a reusable
  `ProfileModal`, `deathsHistory` entries now store `chaserId`, and the
  deaths log opens the same profile card from clickable killer-ID pills.
- Bumped `GAME_ITERATION` to `v0.4.25` and updated the shipped changelog
  / docs trail to match.
- Deployed v0.4.25 to production, which also included the fix for the broken face preview images (coerced `[object Object]` bug RCA'd in v0.4.27-plan).

## v0.4.26-plan — 2026-07-26 (docs-only)

- Scoped two new Phase 7 "risk goes up for experienced players" backlog
  items in `docs/roadmap.md`, prompted by Ken's screenshot reaction to
  seeing 240 sheebs alongside 2048 lifetime deaths: (1) let sheebs go
  negative on capture once `profile.highestLevel > 3` instead of always
  flooring at `0`, and (2) let captures above level 4 have a chance to
  strip a previously purchased shop item back out of the profile. Both
  items are explicitly blocked on product decisions from Ken (debt
  display styling; item-loss eligibility/chance/warning/rebuy rules) — see
  `docs/handoffs/roadmap-handoff-v0.4.26-plan.md`.
- Added a "Menu brag stat: best level + fewest deaths" backlog item and a
  new Phase 7 row to the high-level phases table.

## v0.4.25-plan — 2026-07-26 (docs-only, ledger backfill)

- The `roadmap-handoff-v0.4.25-plan.md` file (post-kill chaser profile
  screen, `chaserId` kill-history logging, and a clickable Deaths log)
  already existed from an earlier session but was never given a ledger,
  version-log, or update-directions entry — backfilled here so the docs
  trail matches what's actually on disk. Marked the older
  `roadmap-handoff-v0.4.23-plan.md` as superseded by this fuller-scope
  plan rather than leaving two competing plan files for the same feature.

## v0.4.24 — 2026-07-26

- Implemented the 3-second `resume-countdown` phase after jump-scares in `GameEngine.js`.

## v0.4.24-plan — 2026-07-26 (docs-only)

- Scoped the "Subway Surfers-style resume countdown" feature requested by
  x-lax (relayed via Ken/Alexander): after the jump-scare finishes,
  freeze the world at the reset spawn points and show a pulsing centered
  "3… 2… 1…" (no flashing overlay) before resuming the chase, instead of
  today's instant teleport back into a moving chase.
- Added `docs/resume-countdown.md` with the full before/after code
  walkthrough (exact `GameEngine.js` call sites) and design rationale —
  notably, this keeps the existing jump-scare flash/zoom intact; only the
  beat *after* it changes.
- Added the backlog item to `docs/roadmap.md` and a coding brief in
  `docs/handoffs/roadmap-handoff-v0.4.24-plan.md`.
- No code changed, no build run, `GAME_ITERATION` unbumped. This is a
  separate item from the still-open v0.4.23-plan (post-kill chaser
  profile screen), which remains the oldest unfinished handoff.

## v0.4.22 — 2026-07-26 (real code)

- Implemented level-advance pacing: for every non-Pipeworks level with an `advanceAt` threshold (1, 3, 4), required *all three* of the existing skreem threshold, a new elapsed-in-level time floor (`MIN_LEVEL_SECONDS_BEFORE_ADVANCE` set to `30`s), and `this.chasers.length >= 2` before the level can clear.
- Changed the extra chaser spawn interval to 20 seconds.
- Bumped `GAME_ITERATION` to `v0.4.22`.

## v0.4.21 — 2026-07-26 (real code)

- Added the deaths history log UI: menu Deaths pill now opens a modal
  showing the most recent capture records with timestamps and level
  names.
- Persisted `deathsHistory` in the cookie profile and wired capture
  events to append `{ timestamp, levelName }` records.
- Added Playwright smoke coverage for the seeded history path and bumped
  `GAME_ITERATION` to `v0.4.21`.

## v0.4.20 — 2026-07-26 (real code)

- Removed the stale `initialSheebs = 200` default from
  `frontend/src/GameEngine.js` so the engine always uses the caller's
  value.
- Added `DEATH_SHEEBS_PENALTY = 20` and now subtract up to 20 sheebs on
  capture, floored at zero, without letting the persistent balance go
  negative.
- Bumped `GAME_ITERATION` to `v0.4.20`.

## v0.4.20-plan / v0.4.21-plan / v0.4.22-plan — 2026-07-26 (docs-only)

- Reviewed `roadmap-handoff-v0.4.20-plan.md` and `roadmap-handoff-v0.4.21-plan.md`
  for handoff readiness — both matched their `docs/roadmap.md` backlog
  items exactly, no changes needed.
- Wrote `roadmap-handoff-v0.4.22-plan.md`, resolving the open "tune
  level-1 advance threshold" backlog item with Ken's expanded ask: an
  elapsed-time floor (`MIN_LEVEL_SECONDS_BEFORE_ADVANCE`) plus a
  `chasers.length >= 2` floor, AND'd onto the existing skreem threshold,
  for every non-Pipeworks level. Updated `docs/roadmap.md`'s matching
  backlog item to `RESOLVED` with the confirmed design.

## v0.4.19 — 2026-07-26 (real code)

- Wired real audio for Dad Case Environmental Traps: `handleExtraChaserSpawn`
  in `frontend/src/App.jsx` now plays `door-sounds.m4a` and `lights.m4a`
  together via `playOneShot()` when the `dad-case` chaser spawns, replacing
  the `*DOOR SLAM SOUND*` text placeholder.
- Removed the now-unused `.dad-case-sound-text` CSS class from `index.css`.
- Refreshed `VersionModal.jsx`'s changelog list with a v0.4.19 entry and
  dropped the old hardcoded "current iteration" stub entry in favor of a
  single static list (was duplicating the v0.4.18 note).
- Full 11-test Playwright suite passes. Bumped `GAME_ITERATION` to
  `v0.4.19`.
- Also corrected a stale roadmap checkbox: **Code Monkey host-profile
  routing** was already implemented (`scripts/code_monkey_resolve_backend.py`)
  but still showed unchecked in `docs/roadmap.md`.

## v0.4.18 — 2026-07-26 (real code)

- Added a new menu `WHAT'S NEW` button and a `VersionModal` panel that
  shows the current `GAME_ITERATION` plus a short shipped changelog.
- Styled the version panel to match the existing shop modal treatment.
- Added a Playwright smoke check for the version panel and bumped
  `GAME_ITERATION` to `v0.4.18` for deployment.

## v0.4.18-plan — 2026-07-26 (docs-only)

- Answered a batch of "how does this work" menu/gameplay questions by
  reading the code and writing them up in new `docs/gameplay-mechanics.md`
  (sheebs/profile, deaths counter has no history log, death penalty,
  loadout attributes, extra-chaser mechanic, level-1→Pipeworks advance
  threshold vs. the Pipeworks-clear cinematic gate, version badge
  location).
- Added five new `docs/roadmap.md` backlog items: deaths history log,
  sheebs penalty on capture, tune level-1 advance threshold, remove dead
  `initialSheebs` default (Dad Case traps/Version page/new-profiles were
  already tracked from prior sessions).
- Created `docs/handoffs/roadmap-handoff-v0.4.18-plan.md` with open
  questions for Ken and copy-paste next steps.

## v0.4.17-plan — 2026-07-26 (docs-only)

- Scoped the Dad Case environmental trap feature (visual darkening overlay and sound effect).
- Created the implementation plan in `docs/handoffs/roadmap-handoff-v0.4.17-plan.md`.
- Added the feature to the `docs/roadmap.md` incremental backlog.

## v0.4.17 — 2026-07-26 (real code)

- Implemented Dad Case Environmental Traps: added a visual darkening overlay and a text-stubbed sound effect when the "Dad Case" chaser spawns via the multi-chaser mechanic.
- Modified `_maybeSpawnExtraChaser()` in `frontend/src/GameEngine.js` to pass `faceId` in `onExtraChaserSpawn`.
- Updated `App.jsx` to listen for `faceId === 'dad-case'` to trigger a `.dad-case-darkness` CSS overlay (in `index.css`) with a placeholder sound effect text.
- Bumped `GAME_ITERATION` to `v0.4.17` and deployed.

## v0.4.16 — 2026-07-26 (real code)

- Fixed the initial Sheebs default: new profiles now start at `0` sheebs instead of `200` (`normalizeProfile()` in `frontend/src/lib/cookies.js`).
- Fixed the skreem-loop bug: `startMenuAudio()` in `frontend/src/App.jsx` was actually playing `jayden-skreem-loop.m4a` at real volume on a loop instead of silently priming it for later autoplay; it now primes silently (`volume: 0`, `loop: false`) and self-pauses.
- Added `frontend/e2e/menu-audio-prime.spec.js`; verified it fails against the pre-fix code and passes with the fix. Full 10-test Playwright suite passes.
- Merged `docs/handoffs/dad_case_handoff.md` (Ken's Dad Case profile content, saved to the wrong folder) into `docs/profiles/dad-case.md`; removed the misplaced duplicate.
- Bumped `GAME_ITERATION` to `v0.4.16` and deployed.

## v0.4.15-plan addendum — 2026-07-26 (docs-only)

- Added a new backlog item to `docs/roadmap.md`: **Feature: Parody
  Attribute System (Panic, Grip, Scream, Sus)** — a four-stat block
  (Panic Index inverts controls at high speed, Grip Control governs
  corner-slide drift, Scream Volume drives audio-based NPC alerts, Sus
  Level drives social-deduction-style NPC turns/lockouts/votes).
- Flagged that it will require changes to the `_updateCaught` and
  `update(dt)` loops in `frontend/src/GameEngine.js` for momentum,
  inverted steering, and audio trigger radii — not yet broken into
  single-session increments.
- Extended the still-open `docs/handoffs/roadmap-handoff-v0.4.15-plan.md`
  with this addendum rather than opening a new plan version, per Mode A
  rule 2 (don't duplicate an in-flight plan).

## v0.4.14 — 2026-07-26 (real code)

- Face crop on upload: `FaceUpload.jsx` now oval-masks every uploaded photo (offscreen canvas, square center-crop, ellipse clip, PNG re-export) instead of handing the raw file through, so uploaded faces stop rendering as a stretched square. No `GameEngine.js` changes needed. Added `frontend/e2e/face-crop-verify.spec.js`; full 8-test suite passes.

## v0.4.13-plan — 2026-07-26 (docs-only)

- Re-scoped the lvl2 transition as an RCA item because playtesting says it still fires too early and can crash shortly after playback starts.
- Captured the new gate target in the backlog: 80% map-hall coverage plus 15 seconds with 4 simultaneous skibs.
- Added a fresh copy-paste brief for the next coding agent so the investigation starts with reproduction and instrumentation.

## v0.4.12 — 2026-07-26

- Implemented the near-capture interlude (pause card + parody captions) when a skib gets too close.

## v0.4.11 — 2026-07-26

- Dismissed the lvl2 overlay on capture and reset it on play so the jump-scare cannot be hidden behind the transition video.
- Updated the Pipeworks e2e description/spawn count to match the real 5-chaser gate.
- Added `frontend/e2e/lvl2-transition-clears-on-caught.spec.js` and verified the fix in-browser.

## v0.4.11-plan — 2026-07-26 (docs-only)

- Reviewed docs/roadmap.md and docs/handoffs/ against the actual code; confirmed the full v0.4.3-plan three-session backlog (speed ramp, Pipeworks clear condition, lvl2 timing + audio delay) is genuinely landed and passing.
- Found and reopened one item closed with incomplete verification: the jump-scare can still be hidden behind the lvl2 video for several seconds after a Pipeworks clear, not just on arrival. Logged as its own roadmap item.
- Flagged `pipeworks-clear.spec.js`'s stale "4 chasers" description as a minor coverage gap (test still passes, just inaccurate).
- Re-triaged the backlog: reprioritized away from "Audio 2" (needs Ken to record real voice clips, not a coding task) toward the overlap fix and the already-scoped near-capture interlude.

## v0.4.10 — 2026-07-26

- Bumped Pipeworks to 5 simultaneous chasers, kept the pressure goal at 68, and confirmed the level still clears with all five ramped up.
- Moved the lvl2 transition trigger from arrival to clear by passing `{ index, name }` through `onLevelClear`.
- Delayed the chase ambience until the run has built tension, either after 15 seconds or the first extra chaser spawn.
- Verified in-browser that the ambient does not fire immediately, the five-chaser state appears, and the lvl2 overlay only shows after Pipeworks clears.

## v0.4.9 — 2026-07-26

- Implemented Pipeworks's 4-chaser/max-speed clear condition (Session 2 of the v0.4.3-plan backlog): bumped `MAX_CHASERS` to 4, and made Pipeworks only advance when a separate `pipeworksSkreems` counter reaches `PIPEWORKS_MAX_PRESSURE_SKREEM_GOAL = 68` while all 4 chasers are active and fully ramped (`joinRamp >= 1`).
- Fixed a pre-existing game crash caused by `_maybeSpawnExtraChaser` assigning a string URL to `chaser.face` instead of an `HTMLImageElement`.
- Added `frontend/e2e/pipeworks-clear.spec.js`; full 6-test Playwright suite passes.

## v0.4.8 — 2026-07-26

- Implemented extra-chaser speed ramp (Session 1 of the v0.4.3-plan
  backlog, oldest open/unfinished handoff): `_maybeSpawnExtraChaser()`
  spawns new chasers with `joinRamp: 0` instead of a flat `* 0.92`
  discount; the chase loop ramps `joinRamp` to `1` over
  `CHASER_JOIN_RAMP_SECONDS` (5s) and layers it on top of the existing
  `chaserSpeedMod` rubber-band via a new `lerp()` helper.
- Tried the code-monkey lane per the user's ask first; confirmed
  operational but a real dispatch returned a non-matching diff
  (hallucinated line numbers/constants) — implemented directly instead.
- Added `frontend/e2e/chaser-join-ramp.spec.js`; full 5-test Playwright
  suite passes.
- Added `docs/handoffs/roadmap-handoff-v0.4.8.md`.

## Code Monkey orchestration pass — 2026-07-26

- Added `AGENTS.md` plus the `scripts/run_code_monkey.sh` /
  `scripts/code_monkey_*.py` lane for bounded handoff dispatch.
- Updated `docs/skib-sdlc.md`, `docs/update-directions.md`,
  `docs/next-agent-coding-brief.md`, `docs/roadmap.md`, and the current
  open handoff to advertise the new lane and its Ollama/OpenRouter
  routing hints.

## Code Monkey host-profile routing pass — 2026-07-26

- Added named Ollama host-profile routing to the code-monkey resolver
  and CLI so the lane can switch between `thinkpad-local` and
  `desktop-gaming` without hard-editing URLs.
- Added `docs/handoffs/roadmap-handoff-v0.4.7-plan.md` and updated the
  start docs / roadmap / version log to keep the cheaper local profile
  as the default routing story.

## v0.4.6 — 2026-07-26

- Implemented runner pose-to-state mapping (oldest open handoff item,
  queued since v0.4.1-plan): `frontend/src/GameEngine.js` swaps Jayden's
  face to `jayden-getting-captured` on capture, holds
  `jayden-captured` through the zoomed-in beat, restores the original
  face on chase resume; skipped entirely if the player uploaded a
  custom face.
- Added `RUNNER_STATE_FACES` (`frontend/src/gameContent.js`), a
  `runnerIsCustom` prop threaded through `App.jsx` -> `GameCanvas.jsx` ->
  `GameEngine.setFaces()`, and `window.__skibEngine` debug exposure in
  `GameCanvas.jsx` for e2e verification.
- Added `frontend/e2e/caught-face.spec.js`; full 4-test Playwright suite
  passes.
- Discovered `jayden-getting-captured.jpg`/`jayden-uncaring-4029.jpg` are
  byte-identical duplicates of `jayden-captured.jpg`/`jayden-default.jpg`
  (`md5sum`-confirmed) — flagged as a Ken-only asset follow-up in
  `docs/roadmap.md` and `docs/characters.md`, not fixed/guessed at.
- Added `docs/handoffs/roadmap-handoff-v0.4.6.md`.

## v0.4.5-plan — 2026-07-26

- Scoped a new funny near-capture interlude: pause the chase when a
  skib gets too close, show `jayden-getting-captured.jpg`, and overlay a
  randomized parody caption pool.
- Added the new backlog item to `docs/roadmap.md`.
- Added `docs/handoffs/roadmap-handoff-v0.4.5-plan.md`.

## v0.4.4 — 2026-07-26

- Added new chaser Sky-Diver (Motor Killer): copied
  `images/sky-diver-motor-killer.png` into `frontend/src/assets/`,
  imported it in `frontend/src/gameContent.js`, added a `CHASER_FACE_POOL`
  entry (`sky-diver-motor-killer`).
- Picked up the oldest open handoff (v0.4.1-plan) per Mode B ordering;
  the other unblocked item from that handoff (runner pose-to-state
  mapping) is left for the next session.
- Verified with `npm run build`, the Playwright smoke suite, and a
  headless Chromium run forcing `randomFrom` to select the new pool
  entry to confirm the asset actually loads with no console errors.
- Added `docs/handoffs/roadmap-handoff-v0.4.4.md`.

## v0.4.3-plan — 2026-07-26 (docs-only planning)

- Re-verified the chaser-face-randomization fix (v0.4.2-plan) is live and
  correct in `frontend/src/GameEngine.js:801` — nothing further needed.
- Turned two of v0.4.2-plan's four queued items into fully-specced
  implementation plans (exact lines, exact constants, exact edits): the
  lvl2-video arrival-vs-clear timing fix (move the trigger from
  `onLevelChange` to a data-carrying `onLevelClear`), and the extra-chaser
  join-speed ramp (new `CHASER_JOIN_RAMP_START`/`CHASER_JOIN_RAMP_SECONDS`
  constants, per-chaser `joinRamp` field, layered on top of the existing
  `chaserSpeedMod`).
- Tightened the backlog into a three-session order and mirrored it in the
  handoff copy-paste block so the next agent can keep each session small:
  extra-chaser speed ramp, Pipeworks's 4-chaser/max-speed clear
  condition, then lvl2-video timing fix plus death-visual verification.
- Added `docs/handoffs/roadmap-handoff-v0.4.3-plan.md`.

## v0.4.2-plan — 2026-07-26 (docs-only planning + one pre-existing code fix)

- Committed a chaser-face-randomization fix
  (`frontend/src/GameEngine.js`, `_maybeSpawnExtraChaser()`) found
  already written but uncommitted in the working tree — each extra
  chaser now rolls its own `CHASER_FACE_POOL` entry instead of copying
  the first chaser's face. Builds clean; not this session's own work,
  just landed alongside it.
- Added four bug/feature backlog items to `docs/roadmap.md`: lvl2 video
  fires on arrival instead of on clear, Pipeworks's clear condition
  should require 4 simultaneous chasers (flagged as needing a product
  decision), extra chasers should ramp speed up after joining instead of
  a flat discount, and a "player ded" video item (confirmed via
  `git log --all` that no such clip ever existed in this repo).
- Noted eight unprocessed raw photos in `images/` in `docs/characters.md`.
- Rewrote the stale `docs/next-agent-coding-brief.md` into a concrete
  brief scoped to these four items.
- Added `docs/handoffs/roadmap-handoff-v0.4.2-plan.md`.
- **Follow-up:** user resolved both open design questions in the same
  session. Pipeworks's clear condition confirmed as MAX_CHASERS 3→4 plus
  a skreem threshold gated on all 4 chasers being at max speed; death
  video confirmed as "no new clip, keep the original jump-scare."
  Updated both `docs/roadmap.md` items to `RESOLVED`, extended the
  handoff's copy-paste block with the new dependency order, and updated
  `docs/next-agent-coding-brief.md` so all four items are fully
  unblocked for the next coding session.

## v0.4.1-plan — 2026-07-26 (docs-only, no code shipped)

- Rewrote `docs/characters.md` with real content (runner pose table,
  chaser roster table, planned-new-chasers section).
- Added two new-chaser plan items to `docs/roadmap.md`: Sky-Diver (Motor
  Killer) and a second Yoodeling Unc pose (photo not yet saved to repo).
- Reviewed and documented two face-randomization gaps as roadmap items:
  simultaneous chasers sharing one face, and runner poses never mapped
  to game state.
- Added `docs/handoffs/roadmap-handoff-v0.4.1-plan.md`.

## v0.4.0 — 2026-07-26

- Moved the 11 raw voice clips out of `/audio/` (scratch) into
  `frontend/src/assets/audio/`, transcoded to mono 44.1kHz mp3 per
  `docs/sound-effects-howto.md`, renamed to describe their in-game role
  (e.g. `chaser-bark-close-toiletking.mp3`, `capture-sting-final.mp3`).
- Wired real audio into the previously no-op `GameEngine` hooks:
  `onBoostStart`, `onTired`, plus two new hooks `onChaserBark` and
  `onLevelClear`.
- Added a cookie-persisted mute toggle (`profile.muted`) with a button on
  both the main menu and the in-game HUD.
- Added a low-volume looping chase-ambience track, started on entering
  `playing` and stopped on exit/mute.
- Moved `video/lvl2_thats_total_wipe_out_video_transition.mp4` into
  `frontend/src/assets/video/lvl2-transition.mp4` and wired it as an
  experimental full-screen overlay the first time a run reaches level 2
  (Pipeworks).
- Added a Playwright test for the new mute toggle; discovered and worked
  around a pre-existing CSS bug (`.portrait-frame`'s wide-viewport media
  query) rather than fixing it in-place — logged in
  `docs/future-versions.md`.
- Started this handoff/ledger/future-versions doc trio and linked it from
  `docs/skib-sdlc.md` and `README.md`.

## v0.3.4 — 2026-07-26

- Extracted all in-game text into `frontend/src/dialog.js`.
- Rubber-banded chaser speed across a run (mellow on death, ramp on
  level-up).
- Raised `advanceAt` thresholds; bumped proximity-skreem and chaser-bark
  frequency.
- Added a runner "tired" speech-bubble beat and `onBoostStart`/`onTired`
  no-op hooks (later wired for real in v0.4.0).

## v0.3.3 — 2026-07-26

- Added the first playable audio: a starter loop
  (`jayden-skreem-loop.m4a`), primed on menu interaction, reused as the
  caught-transition sting.

## v0.3.2 — 2026-07-26

- Clarified local-recording vs. shipping-format guidance in
  `docs/sound-effects-howto.md`.

## v0.3.1 — 2026-07-26

- Added `frontend/src/version.js` (`GAME_ITERATION`) and a discreet
  build-iteration badge in the menu/HUD.
- Fixed `scripts/deploy-static.sh` to read the iteration from
  `version.js` instead of taking it as a separate CLI arg (single source
  of truth).

## v0.3.0 — 2026-07-26

- Added The Ramen Aisle and World Star Parking Lot (5 levels total).
- Added a lifetime death counter and a skreem penalty on capture.
- Added the multi-chaser mechanic (extra toilets on a long level).
- Added `docs/skib-sdlc.md`, `docs/roadmap.md`, `docs/sound-effects-howto.md`.

## v0.2.0–v0.2.4 — 2026-07-25/26

- Upgraded from a Phase 1 single-scene prototype to a 3-level playable
  build: fixed sprint, desktop keyboard controls, Shleeb shop, cookie
  persistence, randomized default faces, death counter, process docs.

## v0.4.15 — 2026-07-26 (real code)

- Tightened the lvl2 transition to wait for Pipeworks hall coverage plus a 4-skib survival timer before mounting the video.
- Kept the React overlay dismissal behavior, and added browser coverage for the blocked gate path, the allowed path, the capture-dismiss path, and the end-of-playback path.
- Bumped the visible iteration to `v0.4.15`.

## v0.4.34 — 2026-07-26

- Gave chasers real wall collision on Levels 1-4 (`_moveWithCollision`,
  previously unused by chasers at all) and kept wall-passthrough +
  a 1.15x speed multiplier for Level 5+ (`_moveIgnoringWalls`).
- Added the Gawd Particle: rare Level 5+ pickup, 10s runner wall-hack
  buff, despawns a touched chaser instead of capturing the runner and
  respawns it 15s later via a new `chaserRespawnQueue`.
- Added HUD/visual feedback (gold runner glow, wallhack countdown,
  `✨` pickup style) and `frontend/e2e/level5-wallhacks-gawd-particle.spec.js`.
- Backfilled the missing v0.4.33 `VersionModal.jsx` entry alongside the
  new v0.4.34 one.
- `GAME_ITERATION` bumped to `v0.4.34`, deployed.
- **v0.4.36**: Level Data Extraction, Taco Bell & Decoy Pickups, Secret Badges. (docs/handoffs/roadmap-handoff-v0.4.36.md)
