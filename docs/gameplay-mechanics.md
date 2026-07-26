# Gameplay Mechanics Reference

Answers to "how does X actually work" questions about the live build,
written against the code as of `v0.4.16`. This is a reference doc, not a
plan — see `docs/roadmap.md` for open work and
`docs/handoffs/roadmap-handoff-v0.4.18-plan.md` for the backlog this doc
fed into.

## Profile & currency (sheebs)

- A profile is created automatically the first time the game loads —
  `loadProfile()` in `frontend/src/lib/cookies.js` reads two cookies
  (`sjdt_user_id`, `sjdt_profile_v1`) and, if missing, generates a new
  `userId` and a fresh profile via `normalizeProfile({})`.
- **There is no "create a new profile" UI action.** The menu always
  shows whichever profile is in the browser's cookies; there's no button
  to start over or manage multiple identities. See the "Game identity &
  new profiles" backlog item in `docs/roadmap.md` — unclaimed.
- New-profile sheebs default is `0` (`normalizeProfile()`,
  `frontend/src/lib/cookies.js:50`) — fixed in v0.4.16 (previously fell
  back to `200`). `frontend/src/GameEngine.js` still has a stray
  `initialSheebs = 200` default parameter on the `GameEngine` constructor
  (line ~345), but it's dead in practice: `App.jsx` always passes
  `initialSheebs={profile.sheebs}` explicitly, so the class default never
  fires. Worth deleting for clarity — see backlog.
- Sheebs are earned on level clear: `this.sheebs += reward` where
  `reward` is the per-level `LEVELS[i].reward` value (40/60/90/120/160),
  scaled by `1 + loadout.rewardBonus` (`GameEngine.js:712-716`).
- **Sheebs are never lost on capture today.** Only `skreems` (the
  in-run proximity meter, a different number from `sheebs`) take a
  penalty on death — see "Death penalty" below. A sheebs penalty on
  death (e.g. -20) is not implemented; see backlog.

## Deaths counter (no history log)

- `profile.deaths` is a single lifetime integer, persisted in the cookie
  profile. It only ever increases (`handleDeath` in `App.jsx` takes
  `Math.max(current.deaths, nextDeaths)`).
- The "Deaths" pill on the main menu (`App.jsx`'s `<span>Deaths
  {profile.deaths}</span>`) is a plain `<span>`, not a button — it has no
  click handler and nothing happens when it's tapped. There is no
  per-death record anywhere (no timestamp, no level, no cause) — only
  the running total. A tap-to-see-history feature would be new work, not
  a bug fix; see backlog.

## Death penalty (what actually happens on capture)

`_triggerCaught()` in `GameEngine.js` (~line 978):

- `this.deaths += 1` (lifetime counter, see above).
- `skreemsLost = round(this.skreems * DEATH_SKREEM_PENALTY)` where
  `DEATH_SKREEM_PENALTY = 0.3` — the player loses 30% of their
  **skreems** (proximity/progress meter for the current run), not
  sheebs.
- `this.chaserSpeedMod` is stepped by `CHASER_SPEED_MOD_DEATH_STEP =
  -0.1`, clamped to `[CHASER_SPEED_MOD_MIN=0.62,
  CHASER_SPEED_MOD_MAX=1.35]`. This is a rubber-band: **dying already
  slows the chasers down** for the next life, on purpose (see the
  comment at `GameEngine.js:315-319` — a fresh spawn right after dying
  shouldn't immediately die again). Each level cleared instead nudges it
  back up by `CHASER_SPEED_MOD_LEVEL_STEP = 0.06`, so a long clean run
  gets harder over time and a rough run gets a bit of mercy.
- So "slow down chasers on death" is already the existing design intent
  — what's missing relative to the ask is a **sheebs** penalty (e.g.
  -20) on top of the skreems penalty. That's a small, additive change;
  see backlog.

## Loadout attributes (Speed / Stamina / Rewards)

Shown on the menu's perk strip (`App.jsx`: `Speed +{loadout.speedBonus}`,
`Stamina +{loadout.staminaBonus}`, `Rewards +{...rewardBonus}`), computed
by `buildLoadout(profile.ownedItems)` in `frontend/src/gameContent.js`
from purchased Shleeb Shop items:

| Shop item | Attribute | Effect |
|---|---|---|
| `turbo-clogs` | Speed | `+28` |
| `deep-breath-tank` | Stamina | `+30` |
| `sheeb-magnet` | Rewards | `+25%` |

These three numbers flow into `GameCanvas.jsx` as
`loadoutSpeedBonus`/`loadoutStaminaBonus`/`loadoutRewardBonus` props,
then into `GameEngine`'s constructor, which applies them once at game
start (`GameEngine.js:462-468`):

- `this.runner.baseSpeed = 180 + loadout.speedBonus` — raises the
  runner's flat movement speed (before the `x1.8` sprint multiplier).
- `this.maxStamina = 100 + loadout.staminaBonus` — raises the sprint
  meter's ceiling, so sprint lasts longer before "tired" kicks in.
- Reward bonus is applied per level clear, not at construction: `reward
  * (1 + loadout.rewardBonus)` (`GameEngine.js:712`).

If it's at `0`, the item isn't owned yet — the perk strip always reads
straight off the currently-owned loadout, it isn't a separate "attribute
system" a player can upgrade level by level. (Note: `docs/roadmap.md`'s
future-versions parking lot also references a separate, unbuilt "Parody
Attribute System" (Panic/Grip/Scream/Sus) — that's an unrelated, not-yet
started idea, don't conflate it with the shop-loadout bonuses described
here.)

## Extra chasers (multi-chaser pressure mechanic)

- `EXTRA_CHASER_INTERVAL = 14` seconds: if the runner survives 14
  uninterrupted seconds without being caught, `_maybeSpawnExtraChaser()`
  (`GameEngine.js:854`) adds another toilet to `this.chasers[]`, up to
  `MAX_CHASERS = 5` for Pipeworks (other levels currently share the same
  cap; see the per-level roster idea in the roadmap's "levels and new
  maps" plan for making this level-specific).
- Extra chasers pick an independent random face from `CHASER_FACE_POOL`
  (`gameContent.js`) rather than copying the lead chaser's face — the
  lead chaser (`chasers[0]`) is always the menu-selected/uploaded face.
- A freshly spawned extra chaser doesn't move at full speed immediately:
  `joinRamp` climbs from `CHASER_JOIN_RAMP_START = 0.7` to `1.0` over
  `CHASER_JOIN_RAMP_SECONDS = 5` seconds, so new arrivals ease in instead
  of instantly matching the lead chaser's speed.
- The timer resets to `EXTRA_CHASER_INTERVAL` on every capture and every
  level change, so the pressure ramp restarts fresh each life/level
  rather than carrying over.
- Spawning an extra chaser also arms the ambient chase-audio loop
  (`onExtraChaserSpawn` → `armAmbientAudio()` in `App.jsx`) if it hasn't
  armed already (it also self-arms after a flat 15s regardless).

## Round / level advancement ("why does the round…")

Two separate, easy-to-conflate mechanisms control pacing around
Pipeworks — this is very likely the source of the "comes too quick"
feedback, because they answer different questions:

### 1. Entering level 2 (Porcelain Palace → Pipeworks)

Every level has an `advanceAt` skreem threshold in the `LEVELS` array
(`GameEngine.js:253-304`):

| Level | `advanceAt` (skreems) | `reward` |
|---|---|---|
| 1. Porcelain Palace | 26 | 40 |
| 2. Pipeworks | 68 | 60 |
| 3. Flooded Annex | 112 | 90 |
| 4. The Ramen Aisle | 154 | 120 |
| 5. World Star Parking Lot | `null` (no further advance) | 160 |

`levelSkreems` accumulates every frame a chaser is within 300px of the
runner: `gain = dt * (300 - dist) * 0.06` (`GameEngine.js:807-810`).
Concretely, at `dist = 100` that's `~12/sec`; at `dist = 50` it's
`~15/sec`. Level 1's threshold of `26` can be crossed in under 2-3
seconds of close pursuit, which reads as "the level-up (into Pipeworks)
happens almost instantly" if the chaser gets close early — because n
this gain is proximity-based, not time-based, a player who's chased hard
right out of the gate levels up far faster than one who stays evasive.
**This is the mechanism behind "LVL2 Pipeworks upgrade comes too
quick"** — it's the level-1-exit threshold, not a Pipeworks-specific
setting. Tuning it (raising `advanceAt` for level 1, or changing the
skreem-gain formula to be less proximity-front-loaded) is unstarted
work — see backlog.

### 2. Clearing Pipeworks (the lvl2 cinematic gate)

This is a *different*, already-tuned gate that controls when the
`lvl2-transition.mp4` cinematic plays, not when Pipeworks starts.
`_updatePipeworksGateProgress()` (`GameEngine.js:928-950`) requires
**both**:

- `pipeworksHallCoverage >= PIPEWORKS_HALL_COVERAGE_GOAL` (`0.8`, i.e.
  the runner must have physically visited 80% of Pipeworks's walkable
  30px grid cells), and
- `pipeworksFourSkibSeconds >= PIPEWORKS_GATE_REQUIRED_SECONDS` (`15`
  continuous seconds with `chasers.length >= PIPEWORKS_GATE_REQUIRED_CHASERS
  (4)` present).

Only once both are true does `pipeworksTransitionReady` flip, which is
what makes `onLevelClear` report `showLvl2Transition: true` in `App.jsx`.
This was already tightened across v0.4.10 and v0.4.15 specifically
because it fired too early in earlier builds — see
`docs/handoffs/roadmap-handoff-v0.4.15.md` and the "RESOLVED" backlog
entries in `docs/roadmap.md`. **If the "too quick" complaint is actually
about this cinematic, it's already been iterated on twice; if it's about
the level-1→2 transition itself (most likely, per the `advanceAt`
numbers above), that's the open item.**

## Version display

`frontend/src/version.js` exports `GAME_ITERATION` (currently
`'v0.4.16'`). It's rendered as a small `<p className="build-tag">` at
the very bottom of the main menu (`App.jsx`'s `MainMenu` component,
`aria-label="Game iteration {iteration}"`) — deliberately understated
(small/muted styling in `App.css`), not a dedicated screen. There is no
in-game changelog/version panel yet — that's the open "Version page"
backlog item (show `GAME_ITERATION` plus a short changelog mirroring
`docs/handoffs/ledger.md`).
