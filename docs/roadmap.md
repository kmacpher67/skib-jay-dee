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

## ✅ Uncommitted working tree — RESOLVED as v0.4.36.1 (2026-07-27)

The dirty working tree flagged earlier this session (uncommitted,
unverified `GameEngine.js`/`gameContent.js`/`mapGrids.js` changes plus
`scratch_apply_all*.js` litter) turned out to be a real but half-wired
attempt at `v0.4.36`'s own named follow-ups. Finished it for real this
session:

- Fixed the duplicate `_spawnQuestRoomBadge()` **and** duplicate
  `_maybeSpawnGunPickup()` calls at level start (both were called twice).
- Confirmed the `this.phase === 'playing'` → `'chase' || 'near-capture'`
  change was actually a **bug fix** — `'playing'` was never a valid phase
  value in this engine, so the Gawd Particle/Schleimy Potion/Taco
  Bell/Decoy timers were silently dead code before this change.
- Wired real pickup-collection handling for `soggy-tp` and
  `heavy-plunger` (previously spawned on the map but uncollectible),
  timed trail-dropping + chaser slow-on-touch for the Soggy Toilet
  Paper, and a `_swingPlunger()` knockback hooked up to the existing
  F-key/FIRE-button input for the Heavy Plunger.
- Wired the `Friendly Fire` badge trigger for real (was a set-but-never-
  read flag): a chaser now carries a grace window after a gun-stun wears
  off, and getting caught by that exact chaser within it awards the
  badge.
- Left `FLOODED_ANNEX_GRID`/`RAMEN_AISLE_GRID`/`WORLD_STAR_GRID` in
  `mapGrids.js` as empty placeholders, unused — migrating those three
  levels off hardcoded pixel rects is still open, see the "Level data
  extraction" item below.

Verified with `npm run build` and the full Playwright suite (29 active,
1 pre-existing skip), including a new
`frontend/e2e/soggy-tp-plunger-friendly-fire.spec.js`. Shipped as
`v0.4.36.1`. See `docs/handoffs/roadmap-handoff-v0.4.36.1.md`.

## Where things stand (as of this session)

Done: core chase loop, jump-scare capture, face upload + random default
faces, five levels (Porcelain Palace → Pipeworks → Flooded Annex → The
Ramen Aisle → World Star Parking Lot), desktop keyboard controls, sprint,
Shleeb shop, cookie-backed profile (user id, sheebs, owned items, highest
level, lifetime deaths, deaths history with killer IDs), post-kill
profile pages with a clickable deaths log, skreem-on-proximity,
skreem-penalty + death count on capture, a 20-sheebs capture penalty, a
multi-chaser mechanic (extra toilets join in if a level runs long, with
Pipeworks tuned for five simultaneous chasers), and a discreet
build-iteration badge tied to a shared frontend constant plus the
deploy-commit helper. All in-game text now lives in one place,
`frontend/src/dialog.js` (`CAPTURE_LINES`, `CHASER_LINES`,
`TIRED_LINES`) — edit lines there without touching `GameEngine.js`.
As of v0.4.29, players can also keep multiple cookie-backed save slots in
one browser and switch between them from the menu — see
[docs/profiles-and-identity.md](profiles-and-identity.md) for the full
profile data model and the Phase 6 server-sync path.
Chaser speed is now rubber-banded across a run: each capture mellows it
out (`CHASER_SPEED_MOD_DEATH_STEP`), each level cleared ramps it back up
(`CHASER_SPEED_MOD_LEVEL_STEP`), clamped between `CHASER_SPEED_MOD_MIN`/
`MAX` in `GameEngine.js`. Levels also run longer now (raised `advanceAt`
thresholds) and proximity skreem gain/chaser-bark frequency were bumped
up. As of v0.4.0 the game also has a first real audio pass — chase
ambience (now layered in later), capture sting, chaser barks, boost/tired
stingers, a cookie-persisted mute toggle — plus an experimental (rough)
lvl2 video transition whose trigger now waits for Pipeworks clear and an
additional hall-coverage / 4-skib survival gate. Still front-end only —
no backend, no multiplayer, no full scripted intro cinematic. See
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
| 3 | More characters/abilities per PDF roster, role-swapping | Level 6 (new chaser Skib-Daddy-Toilet Guy w/ Plunger Launch) scoped and ready to code — see [level-progression-and-endgame-plan.md](level-progression-and-endgame-plan.md) and [roadmap-handoff-v0.4.38-plan.md](handoffs/roadmap-handoff-v0.4.38-plan.md). Level 7 climax ("CEO of Drains") stays parked, not scoped this pass. |
| 4 | Oval/masked face-crop on upload instead of stretch | Done (v0.4.14) |
| 5 | FastAPI WebSocket multiplayer, server-authoritative roles | Backend scaffolded only |
| 6 | Mongo-backed profile (replaces cookies) | Not started — local multi-profile groundwork (registry, `label`/`updatedAt`) landed v0.4.29; open decisions on identity/auth, sync strategy, and migration written up in [docs/profiles-and-identity.md](profiles-and-identity.md) |
| 7 | Risk/reward escalation for experienced players (negative sheebs, losable shop items past level 3/4) | Debt economy + item loss landed v0.4.26; difficulty transition screen and badges/awards still pending — see incremental backlog below |

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
6. **Landmark / personality pass.** After quest rooms exist, keep each
   level readable on sight. The next map pass should lean on distinct
   room shapes, a memorable hazard, and one funny reward room so the
   level is more than a corridor chain.

Do not start implementing any of this without picking one numbered item
and treating it as its own increment — this section is a plan, not a
sprint.

## Incremental backlog

Each item below is scoped to fit in one agent session. Pull the next
open one, or reorder if something else is more urgent — just keep items
this small.

The current difficulty-ramp direction is to keep progression
interactive: each new level should add a decision, a tradeoff, or a
counterpressure the player can feel in motion, not just a bigger number.
The maps are playable now, but they still need stronger landmark
identity: one anchor room, one risky shortcut, one gag room, and one
reward room per level would make the chase easier to read and more
memorable.

- [x] **URGENT — live prod bug: broken runner/chaser face preview images.** Landed in the `v0.4.25` deploy. The deployed menu now correctly unwraps the `.src` string instead of coercing the pool object to `[object Object]`. Full RCA in [roadmap-handoff-v0.4.27-plan.md](handoffs/roadmap-handoff-v0.4.27-plan.md).

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
- [x] **Dad Case Environmental Traps.** Landed in v0.4.17 — visual darkening overlay and a text-stubbed sound effect when the "Dad Case" chaser spawns via the multi-chaser mechanic. Real audio wired in v0.4.19 (`door-sounds.m4a` + `lights.m4a` play together, placeholder text/CSS removed) — see below.
- [x] **Dad Case Environmental Traps: real audio.** Landed v0.4.19 — replaced the `*DOOR SLAM SOUND*` text placeholder with real `playOneShot()` calls for `door-sounds.m4a` and `lights.m4a` (both fire together) in `handleExtraChaserSpawn` (`App.jsx`). Removed the now-unused `.dad-case-sound-text` CSS class.
- [x] **Deaths history log.** Landed v0.4.21 — the menu's "Deaths" pill
  now opens a modal that shows the latest capture records with
  timestamps and level names, stored in the cookie profile.
- [x] **Sheebs penalty on capture.** Landed v0.4.20 — dying now deducts a
  flat 20 sheebs on capture, floored at 0, in addition to the existing
  skreem penalty. The "slow the chasers down on death" half of this ask
  was already implemented (`CHASER_SPEED_MOD_DEATH_STEP`).
- [x] **RESOLVED — level-advance pacing is still too fast; add a
  time floor and a two-simultaneous-chasers floor.** Landed in v0.4.22 — for every non-Pipeworks
  level with an `advanceAt` threshold (1, 3, 4), required *all three* of
  the existing skreem threshold, a new elapsed-in-level time floor
  (`MIN_LEVEL_SECONDS_BEFORE_ADVANCE` set to `30`s), and
  `this.chasers.length >= 2` before the level can clear. Also changed
  the extra chaser spawn interval to 20 seconds. Pipeworks
  already requires 5 simultaneous chasers (stricter than 2) so it needs
  no change; the final level has no `advanceAt` and is also unaffected.
  See [gameplay-mechanics.md](gameplay-mechanics.md#round--level-advancement-why-does-the-round).
- [x] **Resume countdown after capture (Subway Surfers-style revive
  beat).** Landed v0.4.24 — After the jump-scare capture beat finishes, instead of
  instantly teleporting the player back into a moving chase, freeze the
  action at the reset spawn points and show a large, pulsing centered
  "3… 2… 1…" countdown before resuming. No flashing/red overlay in this
  new beat — that stays part of the jump-scare only. Fixes cheap
  immediate re-deaths caused by disorienting instant respawns. Fully
  specced in [docs/resume-countdown.md](resume-countdown.md); coding
  brief in
  [roadmap-handoff-v0.4.24-plan.md](handoffs/roadmap-handoff-v0.4.24-plan.md).
- [x] **Post-kill screen and kill logging.** Landed v0.4.25 — when a kill occurs, after the kill skreem is done shaking, the game now records who did the kill in the profile history, then shows a reusable profile page for that chaser before returning to the menu. The profile card uses the `CHASER_PROFILES` content map, and the cookie-backed `deathsHistory` entries now carry `chaserId` alongside the timestamp and level.
- [x] **Profile Pages and clickable Killz log.** Landed v0.4.25 — the killz log now displays a clickable killer-ID pill for each capture, and selecting it reopens the same profile page on top of the log. The profile page can be dismissed back to the log, or from a fresh kill back to the menu.
- [x] **Sheebs debt economy: allow negative balance above level 3.** Right now
  `GameEngine.js` clamps `this.sheebs` to `Math.max(0, ...)` everywhere it's
  touched (constructor, capture penalty, shop spend), so a player can never go
  below `0` regardless of level. Ken flagged the menu math looking wrong from a
  screenshot (240 sheebs shown alongside 2048 lifetime deaths) — current
  behavior is actually consistent (sheebs are earned per level-clear, not just
  lost per death, and the capture penalty is a flat 20), but it's a fair
  prompt to make the risk real for experienced players. Proposed change: once
  `profile.highestLevel > 3`, drop the floor-at-`0` clamp on the capture
  penalty specifically (shop purchases should probably stay floored — you
  can't spend sheebs you don't have) so sheebs can go negative and the player
  visibly owes a debt, while newer players (`highestLevel <= 3`) keep the
  existing safety floor. Needs a small design call on how a negative balance
  displays in the HUD/menu pill (just a negative number? a "debt" styling?)
  before coding — flag for Ken in the next planning pass. See
  [roadmap-handoff-v0.4.26-plan.md](handoffs/roadmap-handoff-v0.4.26-plan.md).
- [x] **High-level risk: lose shop items/rewards above level 4.** Companion
  risk/reward item to the sheebs-debt idea above — once
  `profile.highestLevel > 4`, getting captured should have a chance to strip
  a previously purchased Shleeb shop item (or another persisted reward) back
  out of the profile, not just dock sheebs/skreems. Needs product decisions
  before coding: which items are eligible to be lost (all stat upgrades? just
  cosmetics, once they exist?), whether it's every capture or a rolled chance,
  and whether there's any player-facing warning ("you could lose X") before it
  happens so it doesn't feel purely punitive/unfair. Pairs naturally with the
  sheebs-debt item above as a single "stakes go up past level 4" backlog
  slice, but scope and ship them separately. See
  [roadmap-handoff-v0.4.26-plan.md](handoffs/roadmap-handoff-v0.4.26-plan.md).
- [x] **Level 4 "Stakes Are Real" transition screen.** Debt (v0.4.26) and
  item loss (v0.4.26) are both live now but currently land as a surprise —
  Ken's design call was "big red warning after dying past level 4," not a
  silent mechanic. When a player clears Level 3 and arrives at Level 4,
  pause the game and show a full-screen overlay before the level starts:
  - **Header:** "WARNING: WELCOME TO LEVEL 4. THE STAKES ARE REAL." —
    bold/flashing red retro font, matching the game's existing jump-scare
    styling language.
  - **Body (three rule lines):**
    - "DEBT IS REAL: Your Sheebs no longer stop at zero. Get caught, and
      you go into the red. You owe the Toilet."
    - "SHOP SLOP AT RISK: Every time you are captured, there is a 25%
      chance the Skibs will steal one of your hard-earned stat upgrades."
    - "BUY IT BACK: Stolen items are returned to the Shleeb Shop. Pay off
      your debt and buy them back... if you survive."
  - **Action:** single button, "I ACCEPT MY FATE," dismisses the overlay
    and starts Level 4 (pause/resume should reuse whatever pattern
    `GameEngine.js` already uses for the level-clear/level-up beat).
  - **Trigger:** fires once per run the first time `highestLevel`/current
    level crosses into 4, not on every subsequent level-4 replay in the
    same session — needs a small state flag so it doesn't nag on every
    level transition once past 4.
  - **Text location:** add the copy to `frontend/src/dialog.js` as a new
    `LEVEL_4_RULES` constant (matching how `CAPTURE_LINES`/`CHASER_LINES`
    are organized), overlay component lives in `frontend/src/App.jsx`.
  - **Image asset:** overlay should reference
    `frontend/src/assets/level-4-warning-transition-screen.jpeg` — Ken
    has dropped this in (572x1024, portrait). Still worth keeping a
    guarded import with a `[LEVEL 4 ARTWORK PENDING]` black-box fallback
    in case the asset path ever changes, but it's no longer blocking.
  - Landed in v0.4.28.
- [x] **Rewards/badges system.** Landed v0.4.30 — added `earnedBadges` to cookie persistence, defined `BADGES` array with four initial badges (Financial Wizardry, Glutton for Punishment, Slippery When Wet, Devs Owe Me Five Bucks). Badges render as toasts in-game when earned, in the menu next to the status pills, and at the bottom of the level-clear banner.
- [x] **Feature: The "Jayden" Gun.** Landed v0.4.31 —
  `frontend/src/GameEngine.js` spawns a map pickup once per level (50%
  base chance, boosted by Lucky Charm), grants 1-2 usable rounds, fires
  on a dedicated `F` key / touch FIRE button in the runner's facing
  direction, stuns the hit chaser 3-5s (frozen + dazed sprite, no
  despawn), and the gun disappears at 0 ammo. Fire cooldown 0.6s;
  comedic flavor (`GUN_CLICK_LINES`/`GUN_HIT_LINES`) added to
  `frontend/src/dialog.js`. See
  [roadmap-handoff-v0.4.31.md](handoffs/roadmap-handoff-v0.4.31.md).
- [x] **Feature: "Lucky Charm" Shleeb Shop item + "Lucky" badge.** Landed
  v0.4.31 — two stacking shop items, `Lucky Charm` (150 sheebs, +15%
  positive-pickup odds) and `Golden Lucky Charm` (250 sheebs, +25%),
  added to `SHOP_ITEMS` in `frontend/src/gameContent.js`. The gun's spawn
  roll is two-stage (base roll, then a luck-only roll if the base roll
  fails) so the "Lucky" badge fires exactly on the luck bonus's first
  actual proc, per Ken's confirmed trigger. See
  [roadmap-handoff-v0.4.31.md](handoffs/roadmap-handoff-v0.4.31.md).
- [x] **Feature: Close-call freeze + reward payout.** (Shipped in v0.4.37) When the existing near-capture / pre-kill skreem beat fires, hold the game frozen for 1 second before letting chase resume so mobile players can re-center their fingers and the chase doesn't restart mid-adjustment. A clean near-miss should pay +50 sheebs, and positive pickups should pay +5 sheebs on collection. See [docs/close-call-freeze.md](close-call-freeze.md) and [roadmap-handoff-v0.4.37.md](handoffs/roadmap-handoff-v0.4.37.md).
  - **Positive pickup list:** Jayden Gun, Schleimy Potion, Taco Bell Grande, and future positive pickup items from `docs/interactive-content-pack.md`.
  - **Badge hook:** keep the `Slippery When Wet` badge aligned with the same close-call escape event so the reward and the brag moment stay in sync.
  - **Scope guard:** do not touch the separate post-capture `resume-countdown` beat; this is only for the pre-kill close-call pause.
- [ ] **Feature: Gameplay Rebalancing (later follow-up).**
  - **Sheeb Rewards:** +25 Sheebs for hitting a chaser with the Jayden Gun. +50 Sheebs for the close-call escape reward above. +5 Sheebs for positive pickup collections. +50 Sheebs for earning any badge.
  - **Scaled Death Penalty:** Level 1 (0 loss), Level 2 (10 loss), Level 3 (20 loss), Level 4+ (30 loss, allows negative).
  - **Chaser Speed:** Starts slower (0.8 mod instead of 1.0). Max speed cap now scales by level (0.9 to 1.35) so they never exceed the max for the current level.
  - **Level Rewards:** Base rewards bumped to ensure difficulty increases delivery (50, 75, 100, 150, 200).
- [x] **Feature: Cursed & Blessed Map Pickups (The Mario-Style Roller Expansion).** Items rolling around the map that the player can pick up or capture. You don't know if you want to grab them or run from them until it's too late. All four landed for real as of `v0.4.36.1`.
  - **Taco Bell Grande:** (Double-Edged) +50% Speed for 3 seconds, disables steering. If a Skib hits it, stunned for 2s. Shipped v0.4.36.
  - **Soggy Toilet Paper:** (Debuff/Trap) Grab drops a trail behind the runner for 6s; Skibs stepping in a trail segment are slowed 40% for 5s. Shipped `v0.4.36.1` (the effect is a movement-trail slow, not a stamina drain — matches what actually got built).
  - **Fake Jayden Decoy:** (Blessed) Drops cardboard cutout. Skibs in 300px radius aggro decoy for 4s. Shipped v0.4.36.
  - **Heavy Plunger:** (Cursed) -30% Movement Speed while held. Press `F`/FIRE to swing a knockback arc on nearby Skibs (3 swings, then the plunger is spent). Shipped `v0.4.36.1`.
- [x] **Stamina / take-a-hit-and-keep-running.** Ken asked for a "Call of
  Duty style" stamina feature and guessed it might already exist — it
  does. `GameEngine.js` already has a full stamina system (`maxStamina`,
  drain on sprint, regen otherwise, HUD bar) that lets the runner outrun
  a chaser without dying on first contact. No build needed; closed as an
  audit item. See
  [roadmap-handoff-v0.4.29-plan.md](handoffs/roadmap-handoff-v0.4.29-plan.md).
- [x] **Schleimy Potion.** New collectible that temporarily shrinks the
  runner's hitbox so it can slip through the map's tight wall gaps/corner
  chokepoints (Ken confirmed these traps are "cool map design" and wants
  to keep them, just give players a tool to counter-play them). This is
  a deliberate difficulty-ramp item, not a skip button: while active,
  movement speed drops ~20% and the chaser speed modifier gets a
  temporary bump, so using it mid-chase trades "get through this gap"
  for "get caught faster everywhere else" for a few seconds. Proposed
  defaults: 65% hitbox shrink, 4s duration, HUD timer bar next to the
  stamina bar. Needs a call from Ken on acquisition (map pickup vs.
  Shleeb Shop item — recommending map pickup) and the exact percentages
  before coding. See
  [roadmap-handoff-v0.4.29-plan.md](handoffs/roadmap-handoff-v0.4.29-plan.md).
- [ ] **Micro-Skib chaser (challenge counterweight to the potion).** A
  smaller chaser variant sized to also fit through the tight cracks the
  Schleimy Potion opens up, so a "safe" crack isn't unconditionally safe.
  Deliberately scoped separate from the potion item above — this is new
  enemy-AI/pathing work, not a single mechanic. No design pass done yet
  (spawn conditions, which levels, additive vs. replacement chaser). See
  [roadmap-handoff-v0.4.29-plan.md](handoffs/roadmap-handoff-v0.4.29-plan.md).
- [x] **Level 4+ Difficulty Constraints.** Landed in v0.4.33 — Level 4 and higher now requires at least 90 seconds (scaling up with higher levels) of running and evasion of 5 chasers before the level can clear.
- [x] **Skib-Chaser Evolution (Level 5+).** Landed in v0.4.34 — chasers turned out to have no wall collision at all pre-v0.4.34 (only the runner did), so this gave them real wall-aware movement on Levels 1-4 and kept the always-pass-through behavior plus a `1.15x` speed multiplier for Level 5+ (`levelIndex >= 4`). See `docs/handoffs/roadmap-handoff-v0.4.34.md`.
- [x] **The "Gawd Particle" (Level 5+).** Landed in v0.4.34 — an 8%-per-level Level 5+ pickup grants the runner a 10s wall-hack buff; touching a chaser while it's active despawns the chaser (15s respawn timer) instead of capturing the runner. See `docs/handoffs/roadmap-handoff-v0.4.34.md`.
- [x] **Quest Rooms & Landmark Badges.** Landed in v0.4.33 — Level 4 and Level 5 now each have a dedicated landmark room with a quest badge, with Level 4 keeping two exits and Level 5 tightening into a one-door chokepoint.
- [ ] **Interactive content pack: secret items, gag awards, and map personality.** Add a small data-driven catalog of runner/chaser good and bad items plus exploration awards so levels feel more alive, funny, and readable instead of just harder. See [docs/interactive-content-pack.md](interactive-content-pack.md).
- [ ] **Feature: Shart Knocker (Taco Bell Grande follow-up).** Keep the shipped Taco Bell Grande pickup as-is, but add a separate Level 4+ active ability on top of it: one Taco Bell = one `Kill Fart` charge. While being chased, the runner can trigger it to blast a giant fart that stops the nearest chaser for 3-12 seconds. A hit pays +50 sheebs; a miss still pays +5 sheebs. The move is one-shot per Taco Bell and should land with a flaming-ass badge/award icon plus a stubbed fart SFX file in `frontend/src/assets/audio/` so the code path can play something before the final recording exists.
- [x] **Retrofit Early Level Badges.** Landed v0.4.32 — Levels 1-3
  (Porcelain Palace, Pipeworks, Flooded Annex) each get a `progressionBadgeId`
  (`porcelain-prowler`, `pipe-dreamer`, `annex-relic-hunter`) auto-spawned as
  a map pickup at level start. `GameEngine.js`'s advance checks (both the
  Pipeworks pressure-goal branch and the generic `advanceAt` branch) now
  additionally require `_hasRequiredLevelBadge()`, so a level can't clear
  until its badge is found. If the badge was already earned in a past run,
  it's not re-required. See
  [roadmap-handoff-v0.4.32.md](handoffs/roadmap-handoff-v0.4.32.md).
- [x] **Humor & Intrigue Random Badges.** Landed v0.4.32 alongside the item
  above — a separate, non-gating `HUMOR_BADGE_IDS` pool (`Mysterious
  Plunger`, `Golden TP`, `Haunted Rubber Ducky`) rolls an 18% spawn chance
  each level start, picking from whichever of the three the player hasn't
  earned yet. If the roll fails, the same pool gets another shot at the
  next level start (so it isn't locked to the "early" levels only). See
  [roadmap-handoff-v0.4.32.md](handoffs/roadmap-handoff-v0.4.32.md).
- [x] **Secret Interaction Badges (Humor & Intrigue).** Badges that trigger not from progression, but from players doing stupid things. All three shipped for real as of `v0.4.36.1`.
  - **Pacifist in a Warzone:** Survive Level 4 for 60 seconds while holding the Jayden Gun, but *never fire it*. Shipped v0.4.36.
  - **Premature Evacuation:** Get caught within the first 5 seconds of Level 1. Shipped v0.4.36.
  - **Friendly Fire:** Stun a Skib with the Jayden Gun, but immediately get caught by *that exact same Skib* within a 2s grace window after the stun wears off. Shipped `v0.4.36.1` — was an unwired badge-id stub as of the earlier planning pass this session, now has real trigger logic (`chaser.gunStunned`/`chaser.stunGracePeriod` in `GameEngine.js`).
- [x] **Remove dead `initialSheebs = 200` default.** `GameEngine.js`'s
  constructor still defaults to `200` if no `initialSheebs` is passed,
  left over from before the v0.4.16 cookie-default fix. `App.jsx` always
  passes the real profile value so this never fires in practice, but it's
  misleading to read. Small cleanup, bundle with another GameEngine
  session rather than its own.
- [x] **Version page.** Landed v0.4.18 — the menu now has a
  `WHAT'S NEW` button that opens a version log panel showing the current
  `GAME_ITERATION` (`frontend/src/version.js`) plus a short changelog
  mirrored from the recent shipped notes. Front-end only, no new
  persistence needed.
- [x] **Game identity & new profiles (multiple save slots).** Landed
  v0.4.29 — clicking the "User `<name>`" pill on the menu opens
  `ProfileSwitcherModal.jsx`, listing every profile ever active in this
  browser (mirrored to a new `localStorage` registry alongside the
  existing cookie), with "Play as this profile" to switch and a
  nickname field + "+ NEW PROFILE" to create one. `frontend/src/lib/cookies.js`
  gained `listProfiles()`/`switchProfile()`/`createProfile()` plus a
  `label`/`updatedAt` field on the profile shape; the single-active-profile
  cookie contract is unchanged so nothing else reading `loadProfile()`
  needed touching. Full attribute map, related backlog, and the Phase 6
  server-sync path are written up in
  [docs/profiles-and-identity.md](profiles-and-identity.md). See
  [roadmap-handoff-v0.4.29.md](handoffs/roadmap-handoff-v0.4.29.md).
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
- [x] **Code Monkey: host-profile routing.** Landed in the "Code Monkey
  host-profile routing pass" — `scripts/code_monkey_resolve_backend.py`
  normalizes named Ollama host profiles (`thinkpad-local`,
  `desktop-gaming`) with `thinkpad-local` as the default, and
  `scripts/code_monkey_direct.py` exposes a CLI override. Checkbox was
  stale; ledger already had this marked done. Tooling slice, not
  gameplay.
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
- [ ] **Menu brag stat: best level + fewest deaths.** Companion goal to the
  Phase 7 risk/reward items above — once losing sheebs/items past
  level 3/4 is real, players will want to see their best run at a glance
  (e.g. "Best level 4 in 3 deaths"). Cookie profile already tracks
  `highestLevel` and lifetime deaths/`deathsHistory`, so this is mostly a
  menu display item, not new persistence. Small, do after the risk/reward
  items land so there's something worth bragging about.
- [x] **Level expansion.** Added The Ramen Aisle and World Star Parking Lot
  (5 levels total) — landed this session.
- [~] **Level data extraction** — roadmap item 1 above. **Correction
  (2026-07-27 planning pass):** only `buildPorcelainPalace` and
  `buildPipeworks` actually run through `parseMapGrid`/`frontend/src/mapGrids.js`
  (shipped v0.4.36) — `buildFloodedAnnex`, `buildRamenAisle`, and
  `buildWorldStarParkingLot` in `frontend/src/GameEngine.js` are still
  hardcoded pixel-rect functions, checked `[x]` here previously but that
  overstated it. The uncommitted working-tree diff has started adding
  `FLOODED_ANNEX_GRID`/`RAMEN_AISLE_GRID`/`WORLD_STAR_GRID` exports to
  `mapGrids.js`, but they're empty/placeholder grids, not wired into the
  three `buildXxx()` functions yet, and unverified — see the uncommitted
  working-tree callout above. Finish migrating the remaining three levels
  before hand-authoring Level 6, since Level 6's looping-hallway design
  wants the grid format from day one (see
  [roadmap-handoff-v0.4.38-plan.md](handoffs/roadmap-handoff-v0.4.38-plan.md)).
- [x] **Death/skreem economy.** Lifetime death counter (persisted via
  cookies) and a skreem penalty on capture — landed this session.
- [x] **Multi-chaser pressure.** Extra toilets join in if a level runs
  long without a catch (capped, resets on capture/level change) — landed
  this session.
- [ ] **New character + Level 6: Skib-Daddy-Toilet Guy + "Jayden's
  Nightmare House."** Superseded/scoped for real this session — see
  [level-progression-and-endgame-plan.md](level-progression-and-endgame-plan.md)
  and the new [roadmap-handoff-v0.4.38-plan.md](handoffs/roadmap-handoff-v0.4.38-plan.md).
  Ken confirmed (2026-07-27) reusing an existing chaser face (`dad-case`)
  as Skib-Daddy-Toilet Guy's placeholder until a dedicated photo exists,
  so this is now unblocked for Mode B — a new heavy `chaserType` with a
  Plunger Launch (pull) ability, a looping-hallway map, and a single-door
  "Garage" quest room (`Garage Survivor` badge). Level 7 ("CEO of Drains"
  climax) stays parked, not part of this scope. Recommended to build
  *after* the level-data-extraction item above finishes migrating Levels
  3-5 to the grid format, since Level 6's looping halls are much easier
  to hand-author as a grid.
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
- [ ] **Enhanced Death Logs:** Record time played during the run, store the score achieved (sheebs/skreems plus and minus of a session), and explicitly record the level the player died on in the profile history log.
- [ ] **Parody Warning & Feedback Link:** Add a clear warning in the UI (e.g. settings or intro screen) stating that the game is a parody and sarcasm about life games, plumbing, and society (Fair Use applies). Add a link to the GitHub issues page to "place complaints".
- [ ] **Difficulty Function:** Add selectable difficulty tiers (Noob, Casual, 4chan-st). Include a UI toggle to let players change difficulty mid-run (Noob/Casual can be swapped freely; locking into 4chan-st grants score/badge benefits that are lost if toggled down).
- [ ] **Cool Play (Chaser Evasion):** Polish the mechanics for users running from chasers. Goal is to make evasion feel cooler (e.g. near-miss effects, sliding, dynamic FOV). Needs further definition.
