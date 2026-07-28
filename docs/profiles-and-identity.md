# Profiles & Identity

**Mode impact:** `Runner only` for gameplay progression. Play as Chaser
Beta may read the selected runner/chaser faces and mute preference, but
v1 must not change sheebs, owned items, highest level, deaths,
`deathsHistory`, best run, badges, or rewards. See the isolation matrix in
[role-reversal-design.md](role-reversal-design.md#11-strict-mode-boundary-for-present-systems).

What a "user" is in this game today, how identity/profile switching works
as of `v0.4.29`, every gameplay attribute currently riding on a profile,
and what has to change before any of it can move server-side. Written
because the profile object keeps growing a field every couple of sessions
(sheebs → deaths → deathsHistory → chaserId → muted → now label) and
nothing previously described the shape as a whole.

## What a profile is today

Everything lives in `frontend/src/lib/cookies.js`. There is no login, no
account, no server — a "user" is just an id the browser mints for itself
the first time the game loads.

```js
{
  userId: 'sjdt-89f62320',   // minted once via crypto.randomUUID(), never changes
  label: '',                 // optional nickname, new in v0.4.29 — falls back to userId in the UI
  sheebs: 0,                 // currency, can go negative once highestLevel > 3 (v0.4.26)
  ownedItems: [],            // Shleeb Shop purchases (ids from gameContent.js SHOP_ITEMS)
  highestLevel: 1,           // gates the debt/item-loss/level-4-warning mechanics
  deaths: 0,                 // lifetime capture count
  bestRun: { level: 1, deaths: 0 }, // tracks fewest deaths to reach a level in a single run
  deathsHistory: [],         // last 50 captures: { timestamp, level, levelName, chaserId }
  rewardsHistory: [],        // last 50 rewards: { timestamp, type, label, amount, level, levelName }
  muted: false,              // audio preference
  updatedAt: 0,              // new in v0.4.29, last-touched epoch ms — used to sort the switcher list
}
```

`normalizeProfile()` is the single source of truth for this shape —
anything read from a cookie or `localStorage` passes through it, so a
missing/corrupt field always resolves to a safe default instead of
crashing the menu.

## Storage: cookies + a localStorage registry (v0.4.29)

Before this session there was exactly one active profile per browser,
stored in two cookies (`sjdt_user_id` pointing at `sjdt_profile_v1`).
That's still true for "which profile is active right now" — nothing
about the single-active-profile cookie contract changed, so any code
reading `loadProfile()`/`persistProfile()` still works unmodified.

What's new is a **registry**: every profile that has ever been active in
this browser is also mirrored into `localStorage['sjdt_profiles_v1']` as
`{ [userId]: profileJSON }`. That registry is what makes "show me all my
profiles" and "switch without losing the other one's progress" possible
without a backend — cookies alone can't hold more than one profile's
worth of state at a time in any clean way (no multi-value cookie
convention, and 4KB cookie limits get tight fast with `deathsHistory`).

New `cookies.js` exports:

- `listProfiles()` — every registered profile, newest-touched first.
- `switchProfile(userId)` — makes `userId` the active cookie profile.
  Falls back to `createProfile()` if the id isn't registered (defensive,
  shouldn't happen from the UI since the switcher only lists known ids).
- `createProfile(label)` — mints a new `userId`, normalizes a fresh
  profile with the given nickname, activates it.

`loadProfile()` now prefers the registry entry over the raw
`sjdt_profile_v1` cookie when both exist (registry is the fuller,
multi-profile-aware source; the cookie stays as the fallback/back-compat
path for a browser that visited before `v0.4.29`).

## UI: the profile switcher (v0.4.29)

Clicking the "User `<name>`" pill on the main menu (`frontend/src/App.jsx`,
`MainMenu`) opens `frontend/src/components/ProfileSwitcherModal.jsx`:

- Lists every profile from `listProfiles()`, each showing its
  label/userId, level, sheebs, and death count, with the active one
  badged `ACTIVE`.
- "Play as this profile" on any non-active card calls `switchProfile()`
  and re-renders the whole menu against the new profile.
- A nickname field + "+ NEW PROFILE" button calls `createProfile()`.
  Nickname is optional — an unnamed profile just displays its raw
  `sjdt-xxxxxxxx` id, same as before this feature existed.

Nothing about *how many* profiles a browser can hold is capped. That's an
acceptable gap for now (this is local-only, opt-in data a player is
choosing to create) but worth a ceiling if this ever becomes a support
question.

## Every gameplay system that reads/writes a profile field

Useful to have in one place — this is the actual blast radius of "the
profile shape changed":

| Field | Written by | Read by |
|---|---|---|
| `sheebs` | shop purchases, level-clear rewards, capture penalty (`GameEngine.js`) | HUD balance, debt badge styling, shop afford-checks |
| `ownedItems` | shop purchases (`App.jsx handlePurchase`) | `buildLoadout()` (speed/stamina/reward bonuses), item-loss roll above level 4 |
| `highestLevel` | level-clear (`App.jsx handleLevelChange`) | debt-floor gate (>3), item-loss gate (>4), Level 4 warning trigger, (planned) brag-stat display |
| `deaths` | every capture (`App.jsx handleDeath`) | HUD, Deaths pill count |
| `bestRun` | level-clear (`App.jsx handleLevelClear`) | HUD best run text |
| `deathsHistory` | every capture, now tagged with `chaserId` | `DeathsModal.jsx` log, `ProfileModal.jsx` killer-profile lookup |
| `rewardsHistory` | every badge earn, every purchase (`App.jsx`) | `RewardsHistoryModal.jsx` log |
| `muted` | mute toggle | all `Audio()` playback gating |
| `label` | profile switcher "+ NEW PROFILE" | menu user pill, switcher list |
| `updatedAt` | every `persistProfile()`/`switchProfile()` call | switcher list sort order only |

Anything that reads `profile.*` in `App.jsx` or a component should assume
this table is current — update it here if a session adds a new field,
same as `deathsHistory` should have been documented the session it grew
`chaserId` (it wasn't, which is part of why this doc exists now).

## Related backlog already in `docs/roadmap.md`

Pulled together here so a future session doesn't have to re-grep the
whole roadmap to find everything that touches identity/profile:

- **Rewards/badges system** (landed v0.4.30) — badge ids live alongside
  `ownedItems`/`deathsHistory` in the same profile object as
  `earnedBadges`, automatically per-save-slot since the switcher landed
  first. Today `earnedBadges` is still a unique id set; repeat-award
  counts would need a separate field so unlock checks do not change.
- **Rewards & History panel / HUD live-data pills** (design-only,
  2026-07-27) — a planned `rewardsHistory` field (capped last-50 log of
  badge-earn and purchase events, same shape convention as
  `deathsHistory`) so the menu's `Rewards` pill can open a history modal
  the same way the `Deaths` pill opens `DeathsModal.jsx`. Not yet
  implemented — `ownedItems`/`earnedBadges` today are unordered id sets
  with no timestamp, so there is nothing to build a history view from
  until this field exists. Full design writeup, open questions, and the
  copy-paste coding brief are in
  [docs/handoffs/roadmap-handoff-v0.4.41-plan.md](handoffs/roadmap-handoff-v0.4.41-plan.md).
  When this lands, add `rewardsHistory` to the profile-shape block above
  and a new row to the field-ownership table below.
- **Pickup-consumption tracking + "Play Recap"** (design-only, addendum
  added 2026-07-27) — a follow-up ask on the same session: log every map
  pickup consumed (mushrooms/bombs from v0.4.35, gun, Schleimy Potion,
  Taco Bell, Decoy, Soggy TP, Heavy Plunger, Gawd Particle) as a
  `type: 'pickup'` entry in the same planned `rewardsHistory` array, plus
  a per-run "Play Recap" surface. Verified gap: `GameEngine.js` currently
  fires **no callback at all** when any pickup is consumed — this needs a
  new `onPickupConsumed` engine callback alongside the existing
  `onBadgeEarned`/`onSheebsChange`/`onSkreem` ones before any profile
  field can be written. See the "Addendum" section of
  [docs/handoffs/roadmap-handoff-v0.4.41-plan.md](handoffs/roadmap-handoff-v0.4.41-plan.md)
  for the schema, the three open questions for Ken, and why this reuses
  Slice A's log instead of a parallel one.
- **Menu brag stat: best level + fewest deaths** (open) — purely a
  display feature over existing `highestLevel`/`deathsHistory`, would
  read especially well now that a player can have more than one save
  slot to compare against each other.
- **Sheebs debt economy / high-level item loss** (landed v0.4.26) — both
  already gated on `highestLevel`, both now correctly scoped per-profile
  since each save slot has its own `highestLevel`.
- **Phase 6: Mongo-backed profile (replaces cookies)** (not started) —
  see the server-sync section below, this is the same item, now with an
  actual local data model to migrate instead of a blank slate.
- **Phase 5: FastAPI WebSocket multiplayer** (backend scaffolded only) —
  `backend/main.py` has `/ws/match` accepting `player_id` query params
  already, which lines up naturally with `profile.userId` as the wire
  identity once multiplayer actually reads the frontend profile.

## Path to server-side storage (Phase 6, not started)

This session deliberately did **not** touch `backend/`, per the
front-end-only constraint in `docs/skib-sdlc.md` — this section is
planning only, so the next session that does pick up Phase 6 isn't
starting from zero.

What's already in place that Phase 6 can lean on:

- `profile.userId` is already a stable, globally-unique-enough id
  (`crypto.randomUUID()`-derived) — it can become the Mongo document's
  `_id` or a unique index with no reshaping.
- `normalizeProfile()` already fully validates/repairs the shape on every
  read — the exact same function can validate a payload coming back from
  a `GET /profile/:userId` response before it's trusted client-side.
- The registry pattern (multiple full profiles keyed by `userId`, mirrored
  locally) maps directly onto "sync every local profile to its own server
  document" — no local data model change needed, just a new sync layer
  that POSTs `persistProfile()`'s output somewhere instead of (or in
  addition to) `localStorage`/cookies.

What Phase 6 still has to decide before coding, in rough dependency order:

1. **Identity vs. authentication.** `userId` today is anonymous and
   device-bound — nothing proves the same human owns two browsers' worth
   of `sjdt-xxxxxxxx` ids. Server storage without some claim mechanism
   (email, a short claim code shown in the switcher, OAuth) just moves
   the "profiles trapped in one browser" problem from `localStorage` to
   a database row nobody can find from a second device. This blocks
   anything past "the same single-browser experience, now on a server."
2. **Sync strategy.** Two real options: (a) server is the source of
   truth once online, client keeps a cache and pushes on every
   `persistProfile()` call (needs conflict handling for
   offline/multi-tab writes); (b) client stays authoritative, server is
   an export/backup target only, no live gameplay logic depends on
   network availability. Given "front-end only, no multiplayer yet" is
   still the current constraint, (b) is the lower-risk starting point —
   ship a "back up my profile" action before ship "the server decides my
   sheebs balance."
3. **What ships first: backup, or actual multiplayer state.** Phase 5
   (multiplayer) and Phase 6 (persistence) don't have to land together.
   A `POST /profile` backup endpoint using the existing FastAPI scaffold
   is a much smaller slice than wiring `/ws/match` into real gameplay,
   and de-risks the identity/sync questions above before multiplayer
   makes them urgent.
4. **Migration of existing local data.** Whatever ships needs a one-time
   "upload what's already in this browser's registry" step, not just
   persistence for profiles created after the feature ships — otherwise
   every existing player's progress (sheebs, deaths, highest level) is
   silently orphaned.

None of this is scheduled — it's queued behind Phase 5 in
`docs/roadmap.md` same as before. This section exists so that whenever a
session does pick it up, it starts from "here's the shape and the open
decisions" instead of re-deriving both from scratch.
