# Update Directions — Skib-Jay-Dee-Toilet

Use this as the handoff doc for the next agent working in the repo.

**Created by:** Codex (GPT-5) — 2026-07-26
**Last updated by:** Cursor Grok 4.5 — 2026-07-28 (v0.4.59-plan PX/fun refine)

**Doc provenance note:** when you create or materially edit a `docs/`
artifact, keep or add a small metadata block near the top with `Created
by`, `Created on`, `Last updated by`, and `Last updated on`. For
append-only logs and handoffs, put the author/date on each new section or
entry heading so the change trail stays obvious at a glance.

## Current state
- **v0.4.59-plan (docs-only refine — 2026-07-28):** Mode A PX/fun pass on
  Neon Jump-Scare Upgrade. Corrected stale draft (item id
  `jump-scare-filter-neon`, `cost` not `price`, real flow
  caught→caught-profile→resume-countdown→chase, reuse `stunnedUntil`).
  Locked the funny beat: keep magenta/cyan scare tint; after 3…2…1,
  player runs while chasers stun 500ms for −50 sheebs; neon vignette +
  `NEON_HEADSTART_LINES`; broke refusal gag. Still code-ready. See
  `roadmap-handoff-v0.4.59-plan.md`.

- **v0.4.58 (real code, shipped — 2026-07-28):**
  Implemented Option A (Fog of War) desktop screen expansion. Removed the strict 9:16 CSS aspect-ratio constraint from `.portrait-frame`. Updated `GameEngine.js` to calculate `VIEW_W` dynamically based on the actual canvas aspect ratio (clamped to at least 9/16). Implemented a difficulty-based fog of war (radial gradient mask) that obscures the extended peripheral vision for 'normal' and 'hardcore' difficulties. Updated `cookies.js` and `App.jsx` to parse and pass down the `difficulty` state to the `GameEngine`. Fixed E2E test `cosmetic-sink.spec.js` by forcing a 360x640 viewport. `GAME_ITERATION` = v0.4.58. See `roadmap-handoff-v0.4.58.md`.

- **v0.4.60-plan (docs-only, 2026-07-28):** SDLC review, no code — Ken
  asked where the Easy/Normal/4chan-st difficulty setting is. Confirmed
  it was never shipped: only a design doc
  (`docs/difficulty-mechanics-plan.md`) and an open roadmap line exist, no
  code in `frontend/src`. Scoped a minimal code-ready slice (cookie
  `difficulty` field + main-menu selector, no Debt Lock math yet) in
  `roadmap-handoff-v0.4.60-plan.md`. This also unblocks `v0.4.58-plan`'s
  first open question (whether a difficulty picker already exists — it
  didn't, now it's scoped).

- **v0.4.58-plan (docs-only, 2026-07-27):** Mode A refine — Desktop Screen
  Support decision brief cleaned up in
  `roadmap-handoff-v0.4.58-plan.md`. Live gate is **Option A (fog-of-war
  wider shell) vs Option C (scale 9:16 + side art)**; Option B (full FOV)
  soft-parked. Dual Mode B branches written but **blocked on Ken**. No
  code. See also `docs/roadmap.md` backlog line. *(Note: Option A later
  shipped as real `v0.4.58` code — this plan entry is historical.)*

- **v0.4.54 (real code, shipped — 2026-07-27):**
  Near-miss particle burst + brief screen-edge vignette pulse. Also a
  useful canvas `createRadialGradient` precedent for Option A desktop FOW.
  `GAME_ITERATION` = v0.4.54. See commit `52cc320`.

- **v0.4.57 (real code, shipped — 2026-07-27):**
  Hotfix for Rod of Poopdom. Decremented `stinkyTimer` in chase loop to allow a second teleport. Fixed `smokeEffects` particle persistence. See `roadmap-handoff-v0.4.57.md`.

- **v0.4.52 (real code, shipped — 2026-07-27):**
  Turdstone Token — Resurrection Ward. New Epic/Rare map pickup; level-indexed
  spawn chance (1% L1 → 5% L6+); passive ward held in `runner.hasTurdstoneToken`;
  on death while held: no levelIndex++, no currency loss, no chaserSpeedMod ramp
  (Ken's free-do-over decision), deaths counter still increments (Q2). Jump-scare
  still plays, then "SAVED BY THE TURDSTONE!" overlay pauses until player accepts;
  HUD icon shows while held. Sprite `turdstone-toilet-token-perk.png` rendered with
  9-arg center-crop drawImage. 3 new e2e tests all pass. `GAME_ITERATION` = v0.4.52.
  See `roadmap-handoff-v0.4.52.md`.

- **v0.4.57-plan (docs-only, 2026-07-27):** Mode A bug investigation —
  Ken: Rod of Poopdom "works the first time… not the second." Root cause:
  `stinkyTimer` set on warp but never decremented in the chase update loop,
  so the second `_tryTeleport` is gated forever. Hotfix handoff:
  `roadmap-handoff-v0.4.57-plan.md`. **Next code slice — jump queue ahead
  of Slice B.** No code this pass.

- **v0.4.51 (real code, shipped — 2026-07-27):**
  Wall-pinch collision traps — sealed two sub-40px corridor pinches in
  `RAMEN_AISLE_GRID` (L4) and `JAYDENS_NIGHTMARE_HOUSE_GRID` (L6) that
  trapped the 40px runner mid-map. Map-data-only fix; collision code
  untouched. Added `scripts/audit-map-widths.py` + e2e seal checks.
  `GAME_ITERATION` = v0.4.51. See `roadmap-handoff-v0.4.51.md`.

- **v0.4.50 (real code, shipped — 2026-07-27):**
  Cosmetic shop sink — Neon Jump-Scare Filter (200 sheebs, magenta/cyan
  capture tint, no stat effect). Fixed `.portrait-frame` wide-viewport CSS
  clipping footer controls on desktop. `GAME_ITERATION` = v0.4.50. See
  `roadmap-handoff-v0.4.50.md`.

- **v0.4.49 (real code, shipped — 2026-07-27):**
  Broth Slip — `raman-aunt` chaserType with hot-ramen trail on Level 5+.
  `GAME_ITERATION` = v0.4.49. See `roadmap-handoff-v0.4.49.md`.

- **v0.4.48-plan Ken decisions (docs-only, 2026-07-27):** recorded Ken's
  answers in handoffs — Slice B shop labels, Play Recap, Broth Slip defaults,
  LT arc (CEO L7 / L10 finale / endless), Role Reversal v1 scope, Cool Play,
  Micro-Skib, runner pose collapse, Audio 2 phase 1. Created `v0.4.53`–
  `v0.4.56-plan.md`. No code.

- **v0.4.48 (real code, shipped — 2026-07-27):**
  Gameplay Rebalancing remainder — gun hit +25, badge earn +50, scaled
  death penalty (L1 free → L4+ costs 30), chaser speed starts at 0.8 with
  per-level cap, level rewards 50/75/100/150/200/250. `GAME_ITERATION` =
  v0.4.48. See `roadmap-handoff-v0.4.48.md`.

- **v0.4.48-plan (docs-only, 2026-07-27):**
  Mode A pass — full backlog triage against shipped `v0.4.47`. Created
  `roadmap-handoff-v0.4.48-plan.md` (queue + Gameplay Rebalancing handoff),
  `roadmap-handoff-v0.4.49-plan.md` (Broth Slip, Ken confirm), and
  `roadmap-handoff-v0.4.50-plan.md` (cosmetic shop sink). Corrected stale
  roadmap checkboxes; updated `players-guide.md` with Rod of Poopdom; rewrote
  shipped handoffs for v0.4.46/v0.4.47. No code.

- **v0.4.47 (real code, shipped — 2026-07-27):**
  Rod of Poopdom teleport pickup — 5% spawn, 300px warp, wall-block,
  3s Stinky cooldown. `GAME_ITERATION` = v0.4.47. See
  `roadmap-handoff-v0.4.47.md`.

- **v0.4.46 (real code, shipped — 2026-07-27):**
  Menu footer layout fix — scrollable menu, improved footer link styling on
  short mobile viewports. See `roadmap-handoff-v0.4.46.md`.

- **v0.4.45 (real code, shipped — 2026-07-27):**
  Player's Guide modal replaced with external GitHub link to
  `docs/players-guide.md`. See `roadmap-handoff-v0.4.45.md`.

- **v0.4.43 (real code, shipped — 2026-07-27):**
  implemented the **Player's Guide** slice per `roadmap-handoff-v0.4.44-plan.md`
  (next unblocked item after the v0.4.43-plan LT roadmap docs pass). Added
  `docs/players-guide.md`, `PlayersGuideModal.jsx`, and a menu-footer link
  above the GitHub issues link. Clarifies guns/ammo replacement, level-transition
  pickup loss, Level 5+ wall-hacks, and that the Shart Knocker orange FART
  button is not a protective shield. `GAME_ITERATION` bumped to `v0.4.43`
  and deployed.

- **v0.4.43-plan (docs-only, shipped — 2026-07-27):**
  Mode A pass — recorded Ken's Long-Term roadmap dictation (Level 10 grand arc,
  Role Reversal, MOBA/PvP) in `docs/roadmap.md`, `roadmap-handoff-v0.4.43-plan.md`,
  and reconciliation note in `level-progression-and-endgame-plan.md`. No code;
  all three LT items remain parked pending Ken's answers.

- **v0.4.42 (real code, shipped — 2026-07-27):**
  implemented the **Menu Brag Stat** slice from `docs/handoffs/roadmap-handoff-v0.4.42-plan.md`. Added a `bestRun` field to the profile that tracks the highest level reached in a single run and the fewest deaths taken. `App.jsx` now tracks session deaths and updates `bestRun` on level clear, displaying it on the main menu. `GAME_ITERATION` bumped to `v0.4.42` and deployed.

- **v0.4.41 (real code, shipped — 2026-07-27):**
  implemented Slice A of the **Rewards & History panel** from `docs/handoffs/roadmap-handoff-v0.4.41-plan.md`. Added a capped `rewardsHistory` log to the profile which records badges earned and shop purchases. Made the `Rewards` HUD pill a clickable button that opens the new `RewardsHistoryModal.jsx`. Slice B (HUD pill values) remains parked pending design answers. Verified with a new E2E test. `GAME_ITERATION` bumped to `v0.4.41` and deployed.
- **v0.4.40 (real code, shipped — 2026-07-27):**
  implemented the **Shart Knocker** slice from `docs/handoffs/roadmap-handoff-v0.4.40-plan.md`. Picking up a Taco Bell Grande on Level 4+ now grants one `shartCharge`. The runner can trigger it via the F key or the on-canvas FIRE button (which turns orange and reads "FART" while charged). Triggers a fart that stuns the nearest chaser for 3-12 seconds (randomized). A successful hit pays +50 sheebs; a miss pays +5 sheebs. Added the `Flaming Ass` badge, awarded on the first successful hit. Added `shart-knocker-stub.mp3` as a placeholder sound effect. Verified with full Playwright suite including new `frontend/e2e/shart-knocker.spec.js`. `GAME_ITERATION` bumped to `v0.4.40` and deployed.
- **v0.4.39.1 (real code, shipped — 2026-07-27):**
  Fixed the Level 4 spawn point by moving it from `x: 430` to `x: 260` and down to `y: WORLD.height - 140` so the runner starts in an open vertical aisle instead of inside a horizontal map wall segment. `GAME_ITERATION` bumped to `v0.4.39.1` and deployed.
- **v0.4.39 (real code, shipped — 2026-07-27):**
  implemented the **Enhanced Death Logs** + **Parody Warning & Feedback Link** slice from `docs/handoffs/roadmap-handoff-v0.4.39-plan.md`. `GameEngine.js` tracks `sessionSeconds` and `initialSheebs`, reporting `timePlayed`, `sessionSheebDelta`, and `sessionSkreemDelta` on death. `DeathsModal.jsx` renders this telemetry for new records and degrades gracefully for legacy ones. A "Fair Use / Parody Warning" with a link to the GitHub issues tracker (`https://github.com/kmacpher67/skib-jay-dee/issues`) is now displayed at the bottom of the Main Menu. Verified with `npm run build` and `npx playwright test`. `GAME_ITERATION` bumped to `v0.4.39` and deployed.
- **v0.4.39-plan roadmap snapshot (docs-only, 2026-07-27):**
  Mode A pass — **16** open unchecked items in `docs/roadmap.md` incremental
  backlog (frontend snapshot table added). Confirmed v0.4.38 **has landed**
  (`GAME_ITERATION` = v0.4.38; not in progress). Locked queue: v0.4.39
  (death logs + parody warning) → v0.4.40 (Shart Knocker). Created
  `roadmap-handoff-v0.4.40-plan.md` and `next-agent-planning-brief.md`.
  Reviewed landed handoffs v0.4.36–v0.4.38 for SDLC completeness. No code.
- **v0.4.39-plan addendum (docs-only, prior session, 2026-07-27):**
  interactive vibe discussion with Ken on auto-tuning difficulty (rolling
  deaths/sheebs ratio) and the parked Level 7+ Mosaic Map of Madness
  concept. Extended the open `v0.4.39-plan` handoff rather than opening a
  new one. Verdict on auto-tuning: keep the ratio signal, drop the
  outside-AI-proposed `DifficultyManager` class, extend Method C's
  existing knobs instead, prefer an economy-side lever (pickup odds /
  payouts) over touching chaser speed/AI so the chase stays predictable,
  and reuse the `CHASER_SPEED_MOD_MIN/MAX` clamp pattern for level floors
  — full writeup in `docs/difficulty-mechanics-plan.md`'s new
  "Auto-tuning refinement" section, still design-only with explicit TBDs
  (window size, floor/ceiling values). Also reviewed the Mosaic map
  concept and flagged one real gap — the dimension-shift trigger
  mechanism (floor trap vs. held item) was never actually answered by
  Ken, only left open in the source transcript — as a new "Flag for Ken"
  item in `docs/level-progression-and-endgame-plan.md` rather than
  assuming an answer. No scope change to the death-log telemetry /
  parody-warning slice that's still the actual unblocked next code slice.
- **v0.4.38 (real code, shipped — 2026-07-27):**
  migrated `Flooded Annex`, `Ramen Aisle`, and `World Star Parking Lot` to the grid format, extracted from hardcoded pixel-rects. Added Level 6 (`Jayden's Nightmare House`) using a looping hallway grid map. Added Skib-Daddy-Toilet Guy using a new heavy `chaserType` pattern with a `Plunger Launch` ability (using the `dad-case` face for now). Added a `Garage Survivor` landmark badge and quest room for Level 6. Tests passed and deployment succeeded. `GAME_ITERATION` bumped to `v0.4.38`.
- **v0.4.37 (real code):**
  implemented the **Close-Call Freeze & Rewards** slice from
  `docs/close-call-freeze.md` / `docs/handoffs/roadmap-handoff-v0.4.37-plan.md`.
  `GameEngine.js` now has a dedicated `close-call-freeze` phase: once the
  existing near-capture beat resolves, the world (runner movement,
  chaser AI, stamina, skreem gain, timers) freezes for 1 second before
  the chase resumes, giving mobile players a beat to re-center their
  fingers. A clean escape from that freeze now pays +50 sheebs and stays
  tied to the same event that fires the `Slippery When Wet` badge;
  collecting a positive pickup (Jayden Gun, Schleimy Potion, Taco Bell
  Grande, and future entries in a new `POSITIVE_PICKUPS` list in
  `gameContent.js`) now pays +5 sheebs. Covered by
  `frontend/e2e/close-call-rewards.spec.js`. `GAME_ITERATION` bumped to
  `v0.4.37` and deployed. This shipped from a concurrent session and its
  own `docs/handoffs/roadmap-handoff-v0.4.37.md` write-up, the
  `docs/version-log.md`/`docs/handoffs/ledger.md` entries, and this
  bullet were backfilled in a later Mode A pass (2026-07-27) after the
  gap was found during a documentation-continuity review — see the
  "Process note" below on why this drifted.
- **Process note (docs-only, this session, 2026-07-27):** two sessions ran
  close together — one shipped `v0.4.37` as real code, another
  (Codex) wrote `docs/handoffs/roadmap-handoff-v0.4.39-plan.md` as a
  fresh planning pass. The plan doc ended up listing `close-call freeze`
  as still open and re-flagging the (already-resolved-in-`v0.4.36.1`)
  uncommitted-worktree cleanup as urgent, because it was written without
  the benefit of the other session's shipped commit. Corrected in this
  pass: `docs/handoffs/roadmap-handoff-v0.4.39-plan.md` now reflects
  what's actually shipped, the missing `roadmap-handoff-v0.4.37.md` was
  backfilled, a stray, unheaded `v0.4.36` changelog fragment inside
  `docs/version-log.md`'s `v0.4.37-plan` (content-first) entry was given
  its own proper heading, and `docs/next-agent-coding-brief.md` was
  rewritten since it pointed at a slice that has since shipped. Lesson
  for future sessions: **before writing a new `-plan.md`, always check
  `git log`/`frontend/src/version.js` for the actual current
  `GAME_ITERATION`, not just the newest doc file** — a doc can be stale
  relative to code shipped by a parallel session.
- **v0.4.39-plan refinement (docs-only, 2026-07-27):** narrowed the open
  handoff to raw death-log telemetry (`timePlayed`, `sessionSheebDelta`,
  `sessionSkreemDelta`, and death level) plus the parody warning / GitHub
  feedback link. The broader difficulty math is now explicitly parked in
  `docs/difficulty-mechanics-plan.md` as the Method C / Debt Lock track,
  so it does not get tangled up with the death-log UI pass.
- **Planning addendum (docs-only, 2026-07-27):** the Taco Bell Grande
  follow-up is now explicitly queued as a Level 4+ `Shart Knocker`
  slice: one Taco Bell grants one kill-fart charge, a hit stalls the
  nearest chaser for 3-12 seconds, a miss still pays +5 sheebs, and the
  badge/award note calls for a flaming-ass icon plus a stubbed fart SFX
  file. The shipped Taco Bell pickup itself stays unchanged.
- **v0.4.36.1 (real code, most recent shipped version before v0.4.37):** finished the
  uncommitted, half-wired diff flagged earlier this same session (see the
  v0.4.38-plan entry below) — it was a real but incomplete attempt at
  `v0.4.36`'s own named follow-ups. Fixed the duplicate
  `_spawnQuestRoomBadge()` and duplicate `_maybeSpawnGunPickup()` calls at
  level start; confirmed the `this.phase === 'playing'` → `'chase' ||
  'near-capture'` change was actually a real bug fix (`'playing'` was
  never a valid phase value, so several pickup timers were dead code
  before it); wired real pickup-collection for `soggy-tp`/`heavy-plunger`
  (previously spawned but uncollectible), a trail-drop + chaser-slow
  effect for Soggy Toilet Paper, a `_swingPlunger()` knockback hooked to
  the existing F-key/FIRE-button input for the Heavy Plunger, and a real
  trigger for the `Friendly Fire` badge (grace-window tracking on a
  gun-stunned chaser). `FLOODED_ANNEX_GRID`/`RAMEN_AISLE_GRID`/
  `WORLD_STAR_GRID` in `mapGrids.js` are still unused empty placeholders —
  migrating those 3 levels off hardcoded pixel rects is still open.
  Verified with `npm run build` and the full Playwright suite (29 active,
  1 pre-existing skip), including new
  `frontend/e2e/soggy-tp-plunger-friendly-fire.spec.js`. `GAME_ITERATION`
  bumped to `v0.4.36.1` and deployed. See
  `docs/handoffs/roadmap-handoff-v0.4.36.1.md`.
- **v0.4.38-plan (docs-only, later shipped as v0.4.38):** scoped Level 6
  ("Jayden's Nightmare House") and its new chaser, Skib-Daddy-Toilet Guy,
  into a ready-to-code handoff — previously blocked on a face-asset
  decision, then resolved when Ken confirmed reusing the existing
  `dad-case` chaser face as a placeholder. Level 7 ("CEO of Drains")
  stayed parked, explicitly out of scope this pass. Also corrected two
  overstated roadmap checkboxes at the time (level-data extraction was
  still open then; the "Friendly Fire" secret badge wasn't actually
  wired). See `docs/handoffs/roadmap-handoff-v0.4.38-plan.md`,
  `docs/handoffs/roadmap-handoff-v0.4.38.md`, and
  `docs/level-progression-and-endgame-plan.md`.
- **Planning refocus (docs-only, earlier session):** reviewed `docs/handoffs/roadmap-handoff-v0.4.37-plan.md` against the backlog and retargeted the next handoff toward a close-call freeze / reward pass: hold the near-capture beat for 1 second before chase resumes, pay +50 sheebs for a clean escape, and pay +5 sheebs for positive pickup rewards. The broader content-first polish pass stays parked for later.
- **v0.4.36 (real code, most recent session):** implemented the **Level Data Extraction**, **Taco Bell & Decoy Pickups**, and **Secret Badges** items from `docs/handoffs/roadmap-handoff-v0.4.36-plan.md`. Refactored `Porcelain Palace` and `Pipeworks` into 2D character arrays in `frontend/src/mapGrids.js` and parsed them dynamically in `GameEngine.js`, removing pixel spaghetti. Added Taco Bell (speed boost, no steering) and Decoy (aggro pull) pickups. Added 'pacifist-warzone' and 'premature-evacuation' secret badges. Verified with Playwright suite and `npm run build`. `GAME_ITERATION` bumped to `v0.4.36` and deployed. See `docs/handoffs/roadmap-handoff-v0.4.36.md`.
- **v0.4.35 (real code):** implemented the **Rolling Pickups** and **Schleimy Potion** items from `docs/handoffs/roadmap-handoff-v0.4.35-plan.md`. Mario-style items bounce around the map granting random helpful/harmful effects (speed, stamina, sheebs vs slow, damage). The Schleimy Potion shrinks the runner's hitbox by 65% for 4 seconds, trading speed for the ability to squeeze through tight gaps. Also wired `COOLNESS_LINES` and `HARD_CHASER_LINES` into `GameEngine.js`. Removed the dead `initialSheebs = 200` default. Verified with full Playwright suite (26 active) and `npm run build`. `GAME_ITERATION` bumped to `v0.4.35` and deployed. See `docs/handoffs/roadmap-handoff-v0.4.35.md`.
- **v0.4.34 (real code):** implemented the Level 5+
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
- `frontend/src/GameEngine.js` now handles the chase loop, jump-scare, the separate resume-countdown phase, six levels, the shipped Level 4+ quest rooms / survival floor, the Level 5+ chaser wall-hacks + speed bump and the Gawd Particle wall-hack/despawn-respawn counter (v0.4.34), desktop keyboard controls, sprint fixes, a death/skreem-penalty economy, a multi-chaser mechanic (extra toilets join in if a level runs long, with Pipeworks tuned for five simultaneous chasers), a 20-sheebs capture penalty (which can go negative above level 3), and the discreet iteration badge in the HUD.
- `frontend/src/App.jsx` owns the menu, face upload, Shleeb shop, cookie-backed profile state, the play/session handoff, the delayed chase-ambient start, the lvl2 transition overlay lifecycle, the post-kill profile modal / clickable deaths log, and the level 4 warning overlay. The lvl2 video now only mounts after Pipeworks is cleared *and* the engine reports the new hall-coverage / 4-skib survival gate as ready. It also processes 25% item-loss on capture for players above level 4.
- `frontend/src/components/ProfileModal.jsx` now renders the shared killer profile card for both fresh kills and log reopens, while `frontend/src/components/DeathsModal.jsx` shows clickable killer-ID pills.
- `frontend/src/App.jsx` also owns the new menu version log panel, which shows `GAME_ITERATION` plus a short shipped changelog.
- Planning-only review: the current maps are mechanically fine but need stronger landmark identity, so `docs/interactive-content-pack.md` still seeds the next funny runner/chaser item pack and secret awards. The refined `v0.4.37-plan` now points at the near-capture freeze / reward pass instead of the older content-first polish slice.
- `frontend/src/version.js` is the single place to bump the visible iteration number. Currently **v0.4.54**.
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
- `docs/close-call-freeze.md`
- `docs/handoffs/roadmap-handoff-v0.4.37.md`
- `docs/handoffs/roadmap-handoff-v0.4.38-plan.md`
- `docs/handoffs/roadmap-handoff-v0.4.39-plan.md`
- `docs/handoffs/roadmap-handoff-v0.4.40-plan.md`
- `docs/next-agent-planning-brief.md`
- `docs/difficulty-mechanics-plan.md`
- `docs/level-progression-and-endgame-plan.md`
- `frontend/src/mapGrids.js`
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
- The canvas currently has six levels:
  - Porcelain Palace
  - Pipeworks
  - Flooded Annex
  - The Ramen Aisle
  - World Star Parking Lot
  - Jayden's Nightmare House
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

- **The uncommitted working tree from earlier this session is resolved** —
  finished and shipped as `v0.4.36.1`. No longer on this list.
- **Level 6 ("Jayden's Nightmare House") has already landed** —
  shipped in `v0.4.38`. No longer on this list.
- **Jayden Gun + Lucky Charm/Lucky badge landed in v0.4.31** — no longer on this list. Rolling Pickups (Mario-style) is still a separate, undesigned backlog item.
- **v0.4.26-plan shipped as v0.4.26** (negative sheebs debt + item loss above level 3/4) — that line is stale, corrected here.
- **Early-level progression badges + humor/random badges landed in v0.4.32** — no longer on this list. Quest Rooms and the Level 4+ 90-second survival floor shipped in v0.4.33. **Chaser Wall Hacks + the Gawd Particle landed in v0.4.34** — no longer on this list either. The old content-polish slice is still in `v0.4.35-plan`.
- **Close-call freeze + reward payout landed in v0.4.37** — no longer on this list. See `docs/handoffs/roadmap-handoff-v0.4.37.md`.
- The next map-architecture follow-up is parked in `docs/handoffs/roadmap-handoff-v0.4.36-plan.md` so the v0.4.35 content-polish slice can stay small.
- `v0.4.25` is now shipped: the post-kill profile card, killer-ID logging, and clickable deaths log are in production.
- **Game identity / multiple cookie-backed save slots landed in v0.4.29** — the profile switcher, `localStorage` registry, and `docs/profiles-and-identity.md` are all in place. No longer on this list.
- **v0.4.39-plan and v0.4.40-plan are both shipped** (as `v0.4.39`,
  `v0.4.39.1`, and `v0.4.40` — confirmed against `frontend/src/version.js`
  and corrected two stale unchecked boxes in `docs/roadmap.md` this pass).
  Neither is "the current open handoff" anymore.
- **Coding queue:** see `docs/next-agent-coding-brief.md` (near-miss
  `v0.4.54` already shipped). **Blocked — do not code:** Desktop Screen
  Support until Ken picks A or C
  (`roadmap-handoff-v0.4.58-plan.md`). Also blocked: Audio 2 recordings,
  Yoodeling Unc-2. Planning: `next-agent-planning-brief.md`.
- Do **not** start Audio 2 until Ken records **capture-line** clips (phase 1
  scope only — see `dialog_content_chasing.md`).
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
- Keep the portrait 9:16 layout (desktop FOV exception is *not* approved —
  see blocked `v0.4.58-plan`; Option C would keep 9:16, Option A would need
  an explicit constraint update when Ken picks it).
- Do not break the cookie profile flow when touching the shop or the level rewards.
- Preserve the local image gallery behavior so random defaults still change between plays.
