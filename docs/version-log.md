# Version Log — Skib-Jay-Dee-Toilet

This file memorializes the design and plan decisions made during the
front-end upgrade pass. Starting v0.4.0, each version also gets a fuller
session write-up in `docs/handoffs/roadmap-handoff-vX.Y.Z.md` and a
one-line-per-change entry in `docs/handoffs/ledger.md` — this file stays
focused on *why*, those two are the *what* and *when*.

## v0.4.35 — Rolling Pickups & Schleimy Potion shipped (2026-07-27)

### What changed

- Implemented the v0.4.35 content-polish slice exactly as planned.
- **Rolling Pickups:** Added 2-4 randomly moving items per level that bounce off walls. They grant helpful (speed boost, stamina refill, 20 sheebs) or harmful (stamina drain, 10 skreems damage) effects when touched, colored green/red with mushroom/bomb emojis.
- **Schleimy Potion:** Added a rare map pickup (15% base chance) that shrinks the runner's hitbox (from 40x40 to 14x14) for 4 seconds, allowing players to slip through tight map gaps. While active, the runner's speed drops by 20% and the chasers gain a 20% speed boost. A green UI timer bar appears next to the stamina bar while active.
- **Dialog Triggers:** Added `COOLNESS_LINES` and `HARD_CHASER_LINES` to `dialog.js`. Coolness lines trigger on narrow escapes (`near-capture`), using the Schleimy Potion, and using the Gawd Particle. Hard Chaser lines trigger randomly from chaser barks in Level 4+, and unconditionally when the player is caught in Level 4+ and suffers a debt penalty.
- Removed the dead `initialSheebs = 200` default from the `GameEngine.js` constructor, cleaning up stale code.
- Verified changes with a full `npm run build` and `npx playwright test`. All 26 tests passed.

### Design decisions

- Decided to shrink both `w` and `h` dimensions of the runner when the potion is active, along with updating `x` and `y` to keep the runner centered during the shrink/grow effect.
- Tied the potion duration to 4 seconds and the effect to a green UI bar next to the stamina bar, matching the spec.
- Allowed the rolling pickups to use `_hitsWall` to bounce off map geometry, making them dynamic map elements.

## v0.4.35-plan — Content review and secret-item spec seeded (2026-07-27)

### What changed

- Reviewed the current gameplay chain with the v0.4.31 gun/lucky charm
  pair, the v0.4.32 badge pass, and the shipped v0.4.33 quest-room /
  Level 4+ floor slice in mind. The verdict from the docs review is
  that the game is mechanically in a good place, but the maps still
  need stronger landmark identity and the content layer needs more
  funny tradeoffs.
- Added a new content-spec doc, `docs/interactive-content-pack.md`,
  collecting the next wave of runner-good, runner-bad, chaser-good, and
  chaser-bad items plus a few exploration awards.
- Updated `docs/roadmap.md` to explicitly call out the map personality
  goal and to add the interactive content pack as a backlog item.
- Updated `docs/future-versions.md`, `docs/badges.md`, and
  `docs/update-directions.md` so the next agent has one place to look
  for the funny secret-item / award follow-up.
- Added a short follow-on note to the open `v0.4.35-plan` handoff so
  the current rolling-pickups / potion / dialog plan has a clean link to
  the new content pack instead of spawning a competing plan file.
- Seeded a new follow-on handoff, `docs/handoffs/roadmap-handoff-v0.4.36-plan.md`,
  for the next map-refactor / cursed-pickup / secret-badge slice.

### Design decisions

- Kept the new item ideas data-driven and front-end only. The point of
  this pass is to make levels feel more memorable, not to add another
  engine architecture branch.
- Chose a separate content-spec file rather than stuffing the new item
  catalog into the existing handoff prose. That keeps the open plan
  readable while still giving the next coding session a durable source
  of truth.
- Treated map quality as a readability problem as much as a challenge
  problem. The next good map should be describable in one sentence, not
  just measured by how many walls it has.

### Non-goals

- No gameplay code changed in this session.
- No build, test, deploy, or version bump was run.
- No new art assets or production badge icons were added.

## v0.4.32 — Early-level progression badges + humor badges shipped (2026-07-26)

### What changed

- Implemented **Feature 1: Retrofit Early Level Badges** from the
  confirmed v0.4.32-plan design: `LEVELS[0..2]` (Porcelain Palace,
  Pipeworks, Flooded Annex) each got a new `progressionBadgeId` field.
  `_spawnProgressionBadge()`, called from `_syncLevelState()` on every
  level start, drops one `type: 'badge'` pickup at a random walkable
  point (reusing the Jayden Gun's `_findRandomWalkableSpawn()` helper).
  Both places a level can clear — the Pipeworks pressure-goal branch and
  the generic `advanceAt` branch — now additionally require a new
  `_hasRequiredLevelBadge()` guard, so Levels 1-3 can't be left until
  their badge is found, on top of every pre-existing condition. Levels
  4-5 have no `progressionBadgeId` and are unaffected.
- Design call made during coding (small, non-blocking, per the plan
  doc's own instruction not to guess on *blocking* items only): a badge
  already earned in a past run is not re-required on replay —
  `levelBadgeCollected` is set immediately instead of spawning a
  redundant pickup, so the gate is a one-time "explore this level once"
  ask rather than a forced fetch-quest on every playthrough.
- Implemented **Feature 2: Humor & Intrigue Random Badges**: a new
  `HUMOR_BADGE_IDS` pool in `frontend/src/gameContent.js`
  (`mysterious-plunger`, `golden-tp`, `haunted-rubber-ducky`, each a new
  `BADGES` entry with its own lore/emoji). `_maybeSpawnHumorBadge()`,
  also called from `_syncLevelState()` on every level (not just 1-3),
  rolls `HUMOR_BADGE_SPAWN_CHANCE = 18%` and spawns one pickup for a
  randomly chosen not-yet-earned humor badge on success. These never
  touch `levelBadgeCollected` or any advance check — pure optional
  exploration reward. A missed roll at one level gets another shot at
  the next, matching the plan's "if missed in early levels, they can
  potentially spawn in later levels."
- Generalized `_drawPickups()` into a `_pickupStyle()` lookup by
  `pickup.type` (gun/badge/humor-badge each get distinct colors) instead
  of one hardcoded gun-only style. Also replaced `_drawBanner()`'s
  hardcoded badge-emoji if-chain (which had grown a duplicate `'lucky'`
  line from the concurrent v0.4.31 session's edits) with a dynamic
  `earnedBadges.map(id => BADGES[id]?.emoji)` lookup — future badges
  don't need an engine-side rendering change at all.
- Added `frontend/e2e/progression-badges.spec.js` (blocks-then-unlocks
  the level-1 advance on badge pickup; humor badge spawn/collect without
  touching the gate) and fixed a pre-existing flaky assertion in
  `frontend/e2e/jayden-gun.spec.js` (the stun value naturally decays a
  few hundredths of a second between being set and read; loosened `>=
  3` to `>= 2.9` with a comment).
- `GAME_ITERATION` bumped to `v0.4.32` and deployed
  (`./scripts/deploy-static.sh badge-retrofit`).

### Non-goals for this pass

- Quest Rooms & Landmark Badges and the Level 4+ 90-second survival
  floor are a separate, already-scoped backlog item
  (`docs/handoffs/roadmap-handoff-v0.4.33-plan.md`) — not touched here.
- No new custom badge art was requested or added; the five new badges
  render with existing emoji only, same as every badge shipped so far.

## v0.4.31 — Jayden Gun + Lucky Charm shipped (2026-07-26)

### What changed

- Implemented the **Jayden Gun** exactly per the confirmed v0.4.31-plan
  design: `frontend/src/GameEngine.js` now spawns a map pickup once per
  level (`GUN_BASE_SPAWN_CHANCE = 50%`, `_maybeSpawnGunPickup()`),
  grants 1-2 usable rounds on collection (`GUN_AMMO_ONE_CHANCE = 70%`
  for 1, else 2), fires a bullet in the runner's current facing
  direction on a dedicated `F` key (plus an on-canvas touch FIRE button
  that only renders while a gun is held), stuns whatever chaser it hits
  for a random 3-5s (frozen in place, dazed sprite overlay, no
  despawn), and removes the gun from inventory the instant ammo hits
  zero. Runner facing is now tracked continuously off the existing move
  vector (`runner.facing`) instead of a new input scheme.
- Implemented the **Lucky Charm** Shleeb Shop items and the **Lucky**
  badge. Ken's answer to the cost/odds prompt was "both" tiers: `Lucky
  Charm` (150 sheebs, +15% positive-pickup odds) and `Golden Lucky
  Charm` (250 sheebs, +25%), added to `SHOP_ITEMS` in
  `frontend/src/gameContent.js` and stacking additively in
  `buildLoadout()`'s new `luckBonus` field (same pattern as the
  existing speed/stamina/reward bonuses). The gun's spawn roll is a
  two-stage check — a base roll against 50%, and only if that fails, a
  second roll against the owned `luckBonus` — so a spawn that only
  succeeded because of the second roll is unambiguously "the luck bonus
  actually procing," matching Ken's confirmed trigger. The `lucky`
  badge fires (once, deduped like the other badges) the first time that
  second roll succeeds.
- Comedic flavor (left open, non-blocking, decided during coding): an
  empty-handed `F` press shows a `*click*`-style speech bubble
  (`GUN_CLICK_LINES` in `frontend/src/dialog.js`); a landed shot shows a
  dazed reaction line above the chaser (`GUN_HIT_LINES`). Fire cooldown
  set to `GUN_FIRE_COOLDOWN = 0.6s` between shots.
- Added `frontend/e2e/jayden-gun.spec.js` (pickup → ammo → aimed shot →
  stun window → gun-disappears-at-0-ammo → empty-handed click, all via
  direct engine state manipulation like the existing specs) and
  `frontend/e2e/lucky-charm.spec.js` (forces the base roll to fail and
  the luck roll to succeed via a scoped `Math.random` override, asserts
  the bonus pickup spawns and the `lucky` badge fires exactly once).
  Full 21-test suite (20 active, 1 pre-existing `test.skip`) passes;
  `npm run build` is clean.
- Manually verified in a headless preview (screenshots, not just
  assertions): the gun pickup sprite renders on the map, the ammo HUD
  and FIRE button appear once held, and both new shop cards render with
  correct copy/cost/effect labels.

### Design decisions

- Kept ammo pickups as "already-usable rounds" (1-2) rather than
  simulating literal empty chambers during firing — the "6-round
  cylinder, mostly empty" framing from the plan is flavor/lore for why
  the roll is so stingy, not a per-shot RNG layer. This keeps the skill
  ceiling on aiming, not luck-of-the-draw misfires.
- Chose the two-stage roll (base, then luck-only-if-base-failed) for
  the badge trigger instead of just checking "did the player own a
  charm when something spawned," because the plan's confirmed trigger
  is specifically "the bonus procs," i.e. causes a spawn that wouldn't
  have happened otherwise — the two-stage roll is the direct, honest
  implementation of that counterfactual instead of an approximation.
- Made the two Lucky Charm tiers independent, stacking shop items
  (matching every other shop item's ownership-check pattern) rather
  than an upgrade/replace pair, since Ken's answer was "both" — buying
  both nets the full +40%.
- Placed the touch FIRE button above the SPRINT button and gated its
  render on actually holding a gun, so the mobile control layout stays
  uncluttered for the (common) case of not currently having one.
- `GAME_ITERATION` stays `v0.4.30.1` — bump/deploy was explicitly scoped
  to "only if asked" for this session, and it wasn't.

### Known non-goals for this pass

- No Rolling Pickups (Mario-style) work — separate, still-undesigned
  backlog item, out of scope per the plan doc.
- No Schleimy Potion — still its own blocked-on-tuning backlog item; the
  Lucky Charm's "future good items" framing is forward-looking, not a
  claim that the potion exists yet.
- Didn't retroactively add the missing v0.4.30/v0.4.30.1 entries to
  `VersionModal.jsx`'s `PAST_VERSION_NOTES` (a pre-existing gap, not
  something this session's scope touched) — only this version's own
  entry was added.

## v0.4.31-plan — Jayden Gun + Lucky Charm design finalized (2026-07-26)

### What changed

- Locked in the design for the "Jayden" Gun: randomized 1-2/6 ammo,
  single-use map pickup, dedicated-key fire in the runner's facing
  direction (skill-based, no auto-aim), 3-5s stun on hit (not a
  despawn — keeps difficulty intact). All four open questions
  (fire input, hit effect, acquisition, comedic flavor direction)
  answered directly by Ken.
- Ken's acquisition answer surfaced a new backlog item: a "Lucky
  Charm" Shleeb Shop item that raises the spawn odds of positive map
  pickups (Gun, Schleimy Potion, future good items), paired with a new
  5th "Lucky" badge. Spec added to
  `docs/profiles/awards-badges-descriptions.md`.
- Still open, non-blocking: Gun fire cooldown and exact comedic-flavor
  sound/text; Lucky Charm's sheebs cost, odds bump, and the badge's
  exact trigger (recommended: fires on the luck bonus's first actual
  proc, not on purchase) — flagged for Ken to confirm during coding
  rather than guessed at.
- Added a "no code-cowboy sessions" rule to `docs/skib-sdlc.md`: a bug
  found mid-planning gets its own real Mode B session instead of being
  patched inline in a `-plan.md`, and a design item can't be marked
  "unblocked" for a coding session unless the user actually answered
  it (not just a recommendation the agent wrote itself). This was
  prompted by this session's own earlier deviation — the canvas-boot
  hotfix (v0.4.30.1) was a legitimate fix, but it was applied and
  partially documented inside the Mode A plan doc instead of as its
  own clean Mode B delivery.
- No code changed in this session; `GAME_ITERATION` stays `v0.4.30.1`.

## v0.4.30.1 — Hotfix: Canvas Boot Crash (2026-07-26)

### What changed

- **URGENT:** Fixed a `ReferenceError` on boot caused by missing `onBadgeEarned` in the `GameEngine` constructor parameter destructuring. This error crashed the React tree before the `<canvas>` could mount, breaking the game completely (discovered via 12 failing tests).
- Bumped `GAME_ITERATION` to `v0.4.30.1` and deployed to production.

## v0.4.30 — Badges System (2026-07-27)

### What changed

- Added a persistent rewards/badges system. Initial four badges: "Financial Wizardry", "Glutton for Punishment", "Slippery When Wet" (deferred logic), and "Devs Owe Me Five Bucks".
- Badges show as toasts on earn, render on the menu, and in the level-change banner.

### Design decisions

- Kept `earnedBadges` in `cookies.js` to match `ownedItems`. Passed down to `GameEngine.js` to draw during `_drawBanner` natively.

### Known non-goals for this pass

- Did not implement the Schleimy Potion (prereq for Slippery When Wet) yet.

## v0.4.29 — profile switcher / multiple save slots (2026-07-26)

### What changed

- Picked up the oldest unclaimed backlog item, "Game identity & new
  profiles (multiple save slots)," per Ken's ask to review the roadmap
  for user/profile attributes and land the switcher.
- `frontend/src/lib/cookies.js` gained a `localStorage`-backed profile
  registry (`sjdt_profiles_v1`, `{ [userId]: profileJSON }`) mirrored
  alongside the existing single-active-profile cookie pair, plus
  `listProfiles()`, `switchProfile(userId)`, and `createProfile(label)`.
  The profile shape gained `label` (optional nickname) and `updatedAt`
  (sort key for the switcher list).
- New `frontend/src/components/ProfileSwitcherModal.jsx`, opened by
  clicking the "User `<name>`" pill on the main menu (now a button, was a
  plain `<span>`). Lists every profile ever active in this browser with
  level/sheebs/deaths, badges the active one, offers "Play as this
  profile" to switch, and a nickname field + "+ NEW PROFILE" button to
  create a new save slot.
- Added `frontend/e2e/profile-switcher.spec.js` covering list → create →
  switch-back; full 18-test Playwright suite (1 pre-existing skip)
  passes.
- Wrote `docs/profiles-and-identity.md`: the full profile attribute
  table (every field, who reads/writes it), the related backlog items
  (badges, brag stat, debt/item-loss), and a planning-only writeup of
  what Phase 6 (server-side/Mongo persistence) still needs decided
  before it can be coded — identity/auth, sync strategy, and migration
  of existing local data.
- Bumped `GAME_ITERATION` to `v0.4.29` and deployed.

### Design decisions

- Kept the existing cookie contract (`sjdt_user_id` / `sjdt_profile_v1`)
  completely unchanged for "which profile is active right now" — every
  other place in the codebase that calls `loadProfile()`/`persistProfile()`
  needed zero changes. The registry is additive, not a replacement.
- Chose `localStorage` over trying to cram multiple profiles into cookies
  — no clean multi-value cookie convention exists, and `deathsHistory`
  alone makes a single profile blob push against the ~4KB cookie budget
  well before a second profile would fit.
- `switchProfile()` falls back to `createProfile()` for an unregistered
  id defensively, even though the UI only ever offers ids it already
  listed from the same registry — cheap safety net, not expected to fire.
- Deliberately did not cap how many profiles a browser can hold. This is
  local-only opt-in data; a ceiling is easy to add later if it ever
  becomes a real problem, not worth guessing a number now.
- Docs-heavy session by design (Ken's ask): `docs/profiles-and-identity.md`
  exists specifically so the next Phase 6 session doesn't have to
  re-derive the current data model from scratch, and so future sessions
  update one table instead of leaving `deathsHistory`'s `chaserId`
  addition undocumented the way this session found it.

### Known non-goals for this pass

- No backend/Mongo work — Phase 6 stays planning-only, per the
  front-end-only constraint in `docs/skib-sdlc.md`.
- No cap on profile count, no delete-a-profile action, no cross-device
  linking — all flagged as open follow-ups in
  `docs/profiles-and-identity.md`, not silently skipped.
- Found and fixed a pre-existing landmine while building this:
  `safeParse(localStorage.getItem(key), fallback)` didn't fall back
  correctly because `JSON.parse(null)` returns JS `null` instead of
  throwing (it coerces `null` to the string `"null"`) — `readRegistry()`
  now guards against that explicitly. Scoped to the new registry read
  path only; the existing cookie-based `safeParse()` calls were never
  affected since `readCookie()` returns `''` (which does throw) instead
  of `null` for a missing cookie.

## v0.4.29-plan — Schleimy Potion planning + stamina audit (2026-07-26)

### What changed

- No code — docs-only planning pass.
- Wrote `docs/handoffs/roadmap-handoff-v0.4.29-plan.md` scoping a new
  "Schleimy Potion" collectible (temporary hitbox shrink so the runner
  can pass through tight wall gaps) with a risk/reward cost (speed
  penalty + temporary chaser speed-mod bump while active) instead of a
  free escape tool, plus a separate future backlog line for a
  "Micro-Skib" chaser variant that would also fit through those cracks.
- Closed out Ken's stamina/"take a hit and keep running" ask as already
  shipped — `GameEngine.js` already has a full stamina/sprint system;
  no code needed, just documented and checked off in `docs/roadmap.md`.
- Refined Ken's forwarded AI-brainstormed list of challenge-escalation
  ideas down to one buildable mechanic (mobility/speed trade-off) plus
  one separately-scoped future idea (micro-enemy), rather than copying
  the full brainstorm into the backlog verbatim.

### Design decisions

- Chose a **cost while active** (speed penalty + chaser speed-mod bump)
  over the brainstormed "combat lockout," since the game has no combat
  to lock out — the mobility trade-off is the direct equivalent.
- Cut the brainstormed "moving/pulsing wall geometry" idea entirely (new
  animation system, bigger scope than a single item) rather than fold it
  into this slice.
- Kept the Micro-Skib chaser counterweight as its own backlog line
  instead of bundling it with the potion — new enemy-AI work shouldn't
  ride along with a single item pickup's scope.
- Reframed the ask as a progression problem: later levels should stay
  interactive, so the potion is documented as a tradeoff tool rather
  than a route to bypass the map.

## v0.4.28 — Level 4 transition screen (2026-07-26)

### What changed

- `frontend/src/dialog.js` now exports a `LEVEL_4_RULES` constant containing the text for the new Level 4 transition screen.
- `frontend/src/App.jsx` now mounts a `Level4WarningOverlay` (using the `level-4-warning-transition-screen.jpeg` background) the first time a run hits level index 4 (The Ramen Aisle). The overlay pauses the game engine using `engineRef.current?.stop()` and resumes it on dismissal.
- Added `frontend/e2e/level-4-warning.spec.js` to assert the overlay appears once per run, correctly pauses/unpauses the game engine, and doesn't appear on subsequent level 4 triggers.
- Bumped `GAME_ITERATION` to `v0.4.28` and deployed to production.

### Design decisions

- Decided to pause the game using `engineRef.current?.stop()` and `start()` inside `App.jsx`, rather than extending the `GameEngine`'s phase state. This allows the modal to be entirely front-end driven without complicating the engine loop.
- The badges system is explicitly held back as it is still waiting on product decisions (which badges to include, UI location, persistence design).

### Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test` (all 18 pass)

## v0.4.28-plan — Level 4 transition screen and badges planning (2026-07-26)

### What changed

- No code — docs-only planning pass.
- Wrote `docs/handoffs/roadmap-handoff-v0.4.28-plan.md` scoping the Level
  4 "Stakes Are Real" transition overlay (full copy, trigger point, file
  locations, and the real image asset Ken supplied,
  `frontend/src/assets/level-4-warning-transition-screen.jpeg`) and a new
  rewards/badges backlog item.
- Fleshed out the two placeholder Phase 7 roadmap lines in
  `docs/roadmap.md` (previously bare one-liners) with the full spec, and
  updated the Phase 7 status row to reflect that debt/item-loss shipped
  in v0.4.26 while the transition screen and badges are still open.

### Design decisions

- Transition screen is unblocked and ready for Mode B — copy and trigger
  point are fully specified. Badges system is explicitly held back from
  Mode B until Ken picks an initial badge list and where they persist/
  render; shipping a half-designed badges feature would just create
  rework.
- Kept the transition screen and badges as two separate backlog items
  rather than one bundled slice — the transition screen is
  small/self-contained and ready now, the badges system needs another
  product round first.

## v0.4.26 — Sheebs debt and item loss (2026-07-26)

### What changed

- `frontend/src/GameEngine.js` now subtracts up to 20 sheebs on capture and drops the floor-at-0 clamp when `highestLevel > 3`, allowing sheebs balances to go negative.
- `frontend/src/App.jsx` now correctly synchronizes the negative sheebs and displays a red "DEBT" badge in the HUD and Main Menu when in debt.
- `frontend/src/App.jsx` drops a random item from `ownedItems` with a 25% chance on capture when `highestLevel > 4`.
- `frontend/src/lib/cookies.js` was modified to remove the `Math.max(0, ...)` clamp in `normalizeProfile()`, allowing negative sheebs to persist.
- `frontend/e2e/negative-sheebs.spec.js` and `frontend/e2e/item-loss.spec.js` added for playwright coverage.

### Design decisions

- Added `this.onSheebsChange(this.sheebs)` into the engine capture flow to synchronize the sheebs state with React without breaking existing UI component lifecycles.
- Kept the product decisions strictly decoupled from the UI transitions—which were delegated to a future session.
- Fixed a bug where negative sheebs were being inadvertently stripped during the cookie load pass.

### Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test` (all 17 pass)

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
 it's now technically achievable — kept it at the value that felt right in
  the previous session's playtesting, since Level 5's own new difficulty
  spike (below) is a separate lever.

## v0.4.34 — Level 5+ escalation: Wall Hacks & the Gawd Particle (2026-07-26)

### What changed

- Picked up `docs/handoffs/roadmap-handoff-v0.4.34-plan.md` (the oldest
  unfinished handoff) and implemented both of its features in
  `frontend/src/GameEngine.js`.
- **Chaser wall hacks (Feature 1):** discovered while reading the code
  that chasers never actually collided with walls at all — only the
  runner used `_moveWithCollision`/`_hitsWall`. Rather than literally
  "disable wall collision at Level 5" (a no-op against the real code),
  gave chasers real wall-aware movement below Level 5 (`levelIndex < 4`,
  reusing the runner's existing `_moveWithCollision`) so hiding
  spots/chokepoints actually mean something on Levels 1-4, and kept the
  original always-pass-through behavior for Level 5+ (`levelIndex >= 4`,
  new `_moveIgnoringWalls` helper) so "the rules break down" reads as a
  real shift instead of no change. Also applied a flat `1.15x`
  (`LEVEL5_PLUS_CHASER_SPEED_MULT`) chaser speed multiplier at Level 5+.
- **The Gawd Particle (Feature 2):** new `gawd-particle` pickup type,
  spawn-gated to `levelIndex >= 4` at an 8% roll per level
  (`GAWD_PARTICLE_SPAWN_CHANCE`), following the same
  `_findRandomWalkableSpawn()` pattern as the Jayden Gun/badges. On
  pickup, sets `gawdParticleActive` + a 10s `gawdParticleTimer`
  (`GAWD_PARTICLE_BUFF_SECONDS`), during which the runner also uses
  `_moveIgnoringWalls`. While active, a runner/chaser collision that
  would normally trigger a capture instead despawns that chaser (removed
  from `this.chasers`) and queues it in a new `chaserRespawnQueue` with a
  15s timer (`CHASER_RESPAWN_SECONDS`); `_updateChaserRespawns()` ticks
  the queue each frame and re-adds the chaser at its stored `spawn`
  point (added a `spawn` field to both the main chaser and
  `_maybeSpawnExtraChaser()`'s extras) once the timer elapses. Both the
  buff and the respawn queue are cleared on level change and on death,
  same as the rest of per-run chase state.
- Added a gold glow around the runner while the buff is active
  (`_drawGawdParticleGlow`), a HUD "✨ WALLHACK: Xs" countdown next to the
  ammo readout, and a `gawd-particle` pickup style (`✨`, gold border).
- New `frontend/e2e/level5-wallhacks-gawd-particle.spec.js`: confirms
  chasers are blocked by a synthetic wall pre-Level-5 but pass clean
  through it at Level 5 (stepping in real per-frame `dt` — an early
  version of this test used a single 1-second `update()` call and
  accidentally proved a pre-existing tunneling artifact in the simple
  AABB collision instead of the actual wall-hack behavior); confirms the
  particle never spawns before Level 5 and does spawn after over 400
  rolls; confirms the runner buff lets it cross a wall and blocks it
  again once the buff (or when it's not present) expires; and confirms
  the despawn-then-respawn-at-spawn-point cycle for a touched chaser.
  Full 27-test suite (26 active, 1 pre-existing skip) plus `npm run
  build` pass.
- Backfilled two missing `VersionModal.jsx` entries: v0.4.33 (Quest Room
  badges + Level 4+ survival floor) was never added to the in-game "What
  shipped lately" list despite shipping in the prior session — added it
  alongside the new v0.4.34 entry.
- `GAME_ITERATION` bumped to `v0.4.34` and deployed via
  `./scripts/deploy-static.sh`.

### Design decisions

- Chose to give chasers genuine wall collision below Level 5 instead of
  a no-op "disable" of collision that was never there — the handoff's
  intent (walls matter until Level 5, then don't) only exists if there's
  an actual before/after difference. Flagged this deviation here rather
  than silently reinterpreting the spec.
- Reused the extra-chaser corner-spawn object as the `spawn` field
  directly (`this.chasers.push({ ..., spawn })`) instead of a separate
  lookup table, so respawn logic stays a straight readback with no new
  bookkeeping structure.
- Kept the Gawd Particle's respawn queue best-effort on capacity (no
  `MAX_CHASERS` check before re-adding) — a chaser that despawned was
  already counted against the cap, so at worst a respawn can transiently
  put the roster one over `MAX_CHASERS`, which is low-stakes and simpler
  than threading a second wait condition through the queue.

### Known non-goals for this pass

- No audio cue for collecting the Gawd Particle or for a chaser despawn
  — flagged as a natural follow-up in `docs/future-versions.md`, not
  guessed at.
- No new badge tied to collecting the Gawd Particle or wall-hacking a
  chaser; the handoff didn't ask for one and the existing badge set
  doesn't have an obvious slot for it.
- Didn't retune `LEVEL5_PLUS_CHASER_SPEED_MULT`/`GAWD_PARTICLE_*`
  constants beyond the handoff's suggested ranges — real playtesting
  feedback should drive any further tuning.
