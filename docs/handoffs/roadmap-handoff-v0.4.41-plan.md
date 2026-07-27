# Roadmap Handoff Plan v0.4.41

**Created by:** Claude Sonnet 5 — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-27 (addendum: pickup-consumption tracking + Play Recap)
**Session mode:** Mode A (Planning — docs only, no code changes)

Source: Ken sent a menu screenshot (2026-07-27) with two red annotations pointing
at the bottom status pills:

1. "current speed and stamina based on difficulty and history actions store buys"
   — pointing at the `Speed +0` / `Stamina +0` / `Rewards +0%` pills.
2. "enable rewards button to show history of rewards and buys" — pointing at the
   `Rewards` pill specifically.

GOAL (Ken's words, paraphrased): a "cool area" for the player to check the
history of how they got stuff — badges, awards, purchases — not just a
snapshot number.

This plan does **not** queue ahead of the still-open
`docs/handoffs/roadmap-handoff-v0.4.39-plan.md`/`v0.4.40-plan.md` lineage —
both of those have already shipped as real code (v0.4.39, v0.4.39.1, v0.4.40;
confirmed against `frontend/src/version.js` and `docs/update-directions.md`
this session, and the stale unchecked boxes in `docs/roadmap.md` for the
v0.4.39 items were corrected in this same pass). This is a new, separate
slice — next in line whenever a coding session picks it up.

## Current behavior (verified by reading the code, not guessing)

- `frontend/src/App.jsx:663-668` (`perk-strip`) renders three `<span>`s (not
  buttons — nothing is clickable) sourced entirely from
  `buildLoadout(profile.ownedItems)` in `frontend/src/gameContent.js:280-294`:
  `speedBonus` (+28 from `turbo-clogs`), `staminaBonus` (+30 from
  `deep-breath-tank`), `rewardBonus` (+0.25 from `sheeb-magnet`). All three are
  **pure shop-purchase deltas** — there is no live difficulty signal, no
  history/streak signal, and no in-run state feeding these numbers today.
- `profile.ownedItems` (`frontend/src/lib/cookies.js`) is an unordered `Set`-like
  array of item ids — no purchase timestamp, no price paid recorded.
- `profile.earnedBadges` is the same shape — an unordered array of badge ids,
  no `earnedAt` timestamp.
- The only history-with-timestamps pattern that exists today is
  `profile.deathsHistory` (capped last 50, `normalizeProfile()` in
  `cookies.js:61-104`) plus its UI, `DeathsModal.jsx`, opened via the
  `Deaths {profile.deaths}` button (`onOpenDeaths` in `App.jsx:628`). This is
  the template to copy for a "rewards" equivalent — the Deaths pill is already
  exactly what Ken is asking for, just for kills instead of gains.

## Decisions made this planning pass

1. **Split into two independently shippable slices**, not one big feature —
   matches the "small, single-session increments" rule in `docs/skib-sdlc.md`:
   - **Slice A — Rewards & History panel** (the bigger ask, matches Ken's
     stated GOAL directly). Do this one first; it's the actual "cool area."
   - **Slice B — HUD pills reflect more than shop bonus.** Smaller, but has
     an open design question (see below) that should get Ken's answer before
     a coding session picks it up, so it may end up shipping after Slice A.
2. **New unified `rewardsHistory` log on the profile, not three separate
   arrays.** Recommend one capped list (mirror `deathsHistory`'s `.slice(-50)`
   pattern) with a `type` discriminator instead of separate
   `badgeHistory`/`purchaseHistory`/`payoutHistory` arrays:
   ```js
   {
     timestamp: 1732741200000,
     type: 'badge' | 'purchase' | 'payout',
     label: 'Financial Wizardry' | 'Turbo Clogs' | 'Close-call escape',
     amount: null | -150 | 50,   // sheebs delta if applicable, else null
     level: 4,                   // current level at the time, if known
     levelName: 'The Ramen Aisle',
   }
   ```
   One array is simpler to cap, sort, and render (one modal, reverse-
   chronological, optionally client-side filterable by `type`) than three
   parallel structures that all need their own cap/migration logic.
3. **No retroactive backfill.** Existing profiles with `ownedItems`/
   `earnedBadges` already set won't get synthetic history entries — the log
   starts recording from whenever a session ships this, same way
   `deathsHistory`'s telemetry fields degraded gracefully for older entries
   (`DeathsModal.jsx` already has this "some fields may be null" pattern to
   copy). Don't invent fake timestamps for past purchases.
4. **Reuse the `DeathsModal.jsx` pattern for the new modal** (working name
   `RewardsHistoryModal.jsx`): same header/close-pill/list-card structure,
   reverse-chronological, capped display window (recommend showing the most
   recent 15-20 given three event types now share one feed instead of one).
5. **Slice A does not change how badges/purchases are gated or granted** —
   this is purely an additive logging layer next to the existing
   `earnedBadges`/`ownedItems` arrays (which stay as-is; other code already
   depends on their exact shape per the field table in
   `docs/profiles-and-identity.md`). Do not fold this into a rewrite of those
   fields.
6. **Reward payout events worth logging** (so the log isn't just badges +
   purchases): close-call escape (+50), positive-pickup collection (+5), gun
   hit (+25, pending the still-parked Gameplay Rebalancing item), Shart
   Knocker hit/miss (+50/+5, already shipped v0.4.40), level-clear rewards.
   Recommend starting with badge-earn + purchase entries only in the first
   coding slice (smallest correct increment) and adding payout-event logging
   as a fast follow-up once the log/modal scaffold exists — don't block the
   whole feature on wiring every payout source in one sitting.

## Open question flagged for Ken (Slice B, blocking a coding session)

The screenshot annotation says the pills should reflect "difficulty and
history actions," but today there is no such mechanic anywhere in the game —
`speedBonus`/`staminaBonus` are 100% shop-purchase-derived, and no existing
system (debt economy, level number, badges) currently modifies the runner's
actual speed or stamina. Two different things could be meant, and they're
very different scopes:

- **(a) Cosmetic/labeling fix only.** The numbers are already "real" (they
  reflect actual owned items applied in-game), just presented as a bare
  delta. Small fix: show them as an effective total or add a tooltip/caption
  clarifying "from Shleeb Shop purchases," no new game mechanic.
- **(b) Actually build a difficulty/history-linked stat modifier.** E.g., a
  small stamina bonus for surviving longer runs, or a speed penalty tied to
  the existing debt tier (`highestLevel > 3`) to make the risk visible in the
  HUD, not just the sheebs pill. This is new game-balance design, not a
  plumbing fix — needs its own numbers and its own decision, likely folded
  into the already-parked `docs/difficulty-mechanics-plan.md` track rather
  than invented fresh here.

**Recommendation:** ship (a) as part of Slice B (cheap, matches what's
actually true today) and treat (b) as a new candidate for
`docs/difficulty-mechanics-plan.md`'s backlog rather than assuming it's
wanted — don't guess new game-balance numbers on Ken's behalf. Do not start
Slice B in a coding session until Ken confirms which of (a)/(b) — or both —
is wanted.

## Files likely touched (Mode B, Slice A — Rewards & History panel)

- `frontend/src/lib/cookies.js` — add `rewardsHistory` to `normalizeProfile()`
  (same filter/map/cap-at-N pattern as `deathsHistory`).
- `frontend/src/App.jsx` — `handleBadgeEarned` and `handlePurchase` push a new
  `rewardsHistory` entry; make the `Rewards` pill a `<button>` wired to a new
  `onOpenRewardsHistory` handler/modal-open state (mirror
  `onOpenDeaths`/`handleOpenDeaths`).
- New `frontend/src/components/RewardsHistoryModal.jsx` — mirror
  `DeathsModal.jsx` structure and styling classes.
- `docs/profiles-and-identity.md` — add `rewardsHistory` to the profile shape
  block and the field-ownership table once it's real.
- `frontend/e2e/rewards-history.spec.js` — new spec; force a purchase + a
  badge earn via `window.__skibEngine`/profile fixtures (same pattern as
  `frontend/e2e/menu-audio-prime.spec.js` or `jayden-gun.spec.js` for
  precedent), assert the modal shows both entries in the right order.

## Explicitly not in scope this slice

- Slice B (HUD pill number logic) — blocked on Ken's (a)/(b) answer above.
- Retroactive backfill of history for existing profiles.
- Wiring every payout-event source into the log on day one (start with
  badges + purchases, add payout events as a fast follow-up).
- Any change to `earnedBadges`/`ownedItems` gating logic or shape.
- New badges tied to this feature itself (e.g. a "completionist" badge for
  viewing your own history) — funny idea, not asked for, don't add it
  unprompted.

---

## Addendum (2026-07-27): pickup-consumption tracking + "Play Recap"

Ken's follow-up ask (same session, docs-only): track when players consume
the map pickups — mushrooms/bombs and the rest of the item roster — and
give the player a way to look back at a history of play. Explicit
reference point: "I hate that about CoD, no good recap and review of play
statistics" — CoD's post-match summary is the anti-pattern to avoid,
something better/clearer is the bar.

**Verified by reading the code (not guessing):** pickup consumption is
currently a total blind spot for logging of any kind — not just missing
timestamps like badges/purchases, but **no callback fires into `App.jsx`/
the profile at all** when a pickup is consumed:

- The two rolling "Mario-style" pickups from v0.4.35 (`isGood: true` +
  `effect: 'speed'|'stamina'|'sheebs'`, or `isGood: false` +
  `effect: 'slow'|'damage'`) are handled entirely inside
  `_updateRollingPickups()` (`frontend/src/GameEngine.js:1292-1336`) — these
  are Ken's "mushrooms" (good, green) and "bombs" (bad, red) from the
  version-log entry describing v0.4.35. They mutate `this.sheebs`/
  `this.stamina`/`this.skreems` directly and never surface which pickup was
  touched to any profile-facing callback.
- The named pickups (`gun`, `schleimy-potion`, `taco-bell`, `decoy`,
  `soggy-tp`, `heavy-plunger`, `gawd-particle`) are each handled in their
  own branch around `GameEngine.js:1240-1289` — same story, no
  consumption-event callback exists yet, even though several of these
  already trigger badges/sheeb payouts that *do* eventually reach the
  profile through other paths (badge earn, sheeb delta).
- Net effect: there is no way today to answer "what did I pick up, when,
  and on which level" for any item in the game, good or bad.

### Decision: extend the same `rewardsHistory` log, don't build a parallel one

Add a fourth `type: 'pickup'` entry to the `rewardsHistory` schema from the
main plan above, instead of a separate pickup-only log — one array, one cap,
one modal to maintain:

```js
{
  timestamp: 1732741300000,
  type: 'pickup',
  label: 'Schleimy Potion' | 'Mushroom (Speed)' | 'Bomb (Damage)' | ...,
  amount: 20 | null | -10,   // sheebs or skreems delta if the pickup caused one, else null
  level: 3,
  levelName: 'Flooded Annex',
  outcome: 'good' | 'bad',    // lets the recap screen separate helpful vs. harmful pickups at a glance
}
```

This needs one new engine-level hook: `GameEngine` needs an
`onPickupConsumed(entry)` callback (constructor option, same convention as
the existing `onBadgeEarned`/`onSheebsChange`/`onSkreem` callbacks already
wired from `App.jsx`), fired from both `_updateRollingPickups()` and each
named-pickup collection branch. This is the one real "new plumbing" piece
of this addendum — everything else is additive to the Slice A log/modal.

### New surface: "Play Recap" (the actual "cool area," CoD-but-better)

Ken's ask is bigger than "show me a list" — it's "give me a recap and
review of play statistics" as a first-class moment, not just a buried log.
Recommend a dedicated **Play Recap** screen, separate from (but reusing
data with) the `RewardsHistoryModal` from Slice A:

- **Per-run recap:** shown once, right after a run ends (capture or menu
  return) — mirrors the post-kill profile-card beat that already exists
  (`_triggerCaught()`/the post-kill profile page in `App.jsx`), so it
  slots into a beat the player already expects instead of being a brand
  new interruption pattern. Content: pickups consumed this run (good vs.
  bad, grouped by item, with counts — "3x Mushroom, 1x Bomb" beats a raw
  timestamped list for a single run), sheebs/skreems delta, time survived,
  level reached, badges earned this run. This is the direct answer to "no
  good recap" — CoD's problem is burying this in a menu the player has to
  go dig for after the fact; showing it once, right when the run ends,
  fixes that without new persistent UI.
- **Lifetime stats view:** opened from the menu (same `Rewards` pill from
  Slice A, or a new dedicated pill/button — open question below) —
  aggregates across all `rewardsHistory` entries: most-consumed pickup,
  best single-run sheeb haul, total mushrooms vs. bombs touched, etc. This
  is the "history of play" half of the ask and can reuse the exact same
  `rewardsHistory` array Slice A already introduces — no new persistence
  beyond the `type: 'pickup'` entries above.
- Recommend building the **per-run recap first** (smaller, self-contained,
  highest "wow that's better than CoD" impact for the size) and treating
  the lifetime aggregate view as a fast-follow once the data has been
  accumulating for a few sessions — an aggregate view over an empty/
  near-empty log isn't very useful to look at yet.

### Open questions flagged for Ken (blocking a coding session on this addendum)

1. **Where does the per-run recap live relative to the existing post-kill
   profile card?** Shown back-to-back (capture → profile card → recap →
   menu), merged into one screen, or does recap only show on a *level
   clear* / voluntary menu return (i.e., not on death, since the post-kill
   card already owns that beat)? Recommend: only on level-clear/menu
   return, so it doesn't compete with the existing capture beat for
   attention — but this is Ken's call, not an assumption to code against.
2. **Does the lifetime aggregate view get its own pill, or live inside the
   Slice A `RewardsHistoryModal` as a second tab?** Recommend a second tab
   in the same modal (badges/purchases/pickups + an "aggregates" tab)
   rather than a fifth pill crowding the `perk-strip` — but flag for Ken
   since it changes Slice A's UI shape slightly.
3. **Bad-pickup entries ("bombs," `soggy-tp`, etc.) — brag-worthy or just
   informational?** Should the recap frame "you got bombed 3 times" as a
   badge-adjacent stat (comedic, matches the game's tone) or keep it
   neutral/informational? No wrong answer, just a tone call before writing
   any copy.

### Files likely touched (Mode B, this addendum — separate slice from A/B above)

- `frontend/src/GameEngine.js` — add `onPickupConsumed` callback option;
  call it from `_updateRollingPickups()` and each named-pickup branch
  (~lines 1240-1336).
- `frontend/src/App.jsx` — wire `onPickupConsumed` to push a
  `rewardsHistory` entry (same array as Slice A); track a small
  per-run-only accumulator (reset on level start / new run) to feed the
  recap screen without re-deriving it from the full lifetime log every
  time.
- New `frontend/src/components/PlayRecapModal.jsx` (or extend
  `RewardsHistoryModal.jsx` with a recap mode — depends on question 1's
  answer).
- `docs/interactive-content-pack.md` — the pickup-id/effect table there is
  the reference list for what `label`/`outcome` strings the recap should
  use; keep names consistent with that doc instead of inventing new ones.
- `frontend/e2e/pickup-history.spec.js` and/or an extension of
  `frontend/e2e/rewards-history.spec.js` — force a mushroom + a bomb pickup
  via `window.__skibEngine`, assert both produce `rewardsHistory` entries
  with the right `outcome`.

### Explicitly not in scope for this addendum

- Building the lifetime-aggregate view before the per-run recap exists —
  do the smaller, higher-impact piece first.
- Retuning any pickup's actual gameplay effect (speed/stamina/sheebs/
  damage numbers) — this is a logging-only addition, not a rebalance.
- A full CoD-style multi-tab stat dashboard (weapon accuracy-style
  breakdowns, etc.) — scope this to what the game actually has data for
  today; don't invent stats nothing tracks yet.

---

## Copy-paste: next coding agent (Slice A first)

```text
Read docs/skib-sdlc.md, docs/update-directions.md, docs/roadmap.md,
docs/profiles-and-identity.md, docs/badges.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.41-plan.md).

Your slice: Rewards & History panel (Slice A only — do not start Slice B,
it's blocked on a decision from Ken, see "Open question" section above).

1. Add a capped `rewardsHistory` array (last 50, same pattern as
   `deathsHistory`) to `normalizeProfile()` in frontend/src/lib/cookies.js.
   Entry shape: { timestamp, type: 'badge'|'purchase', label, amount, level,
   levelName }. Use `amount: null` for badge entries (no sheeb delta), the
   item price (negative) for purchases.
2. In frontend/src/App.jsx: `handleBadgeEarned` and `handlePurchase` each push
   one new `rewardsHistory` entry alongside their existing writes to
   `earnedBadges`/`ownedItems`. Don't change what those two arrays already
   store or how gating logic reads them.
3. Make the `Rewards +{n}%` pill in the perk-strip (App.jsx ~line 666) an
   actual `<button>` (mirror the existing `deaths-pill` button pattern at
   ~line 628), wired to open a new modal.
4. Build `frontend/src/components/RewardsHistoryModal.jsx`, structurally
   mirroring `DeathsModal.jsx` (header, close-pill, reverse-chronological
   list, empty state). Show the most recent 15-20 entries.
5. Add `frontend/e2e/rewards-history.spec.js` covering: a purchase produces a
   history entry, a badge earn produces a history entry, the modal opens/
   closes, and an empty-profile state renders the empty message.

Verification:
- cd frontend && npm run build
- cd frontend && npx playwright test

After landing: update docs/version-log.md, docs/update-directions.md,
docs/roadmap.md (check off the "Rewards & History panel" item),
docs/profiles-and-identity.md (add rewardsHistory to the profile shape +
field table), docs/handoffs/ledger.md, VersionModal.jsx if bumping
GAME_ITERATION. Generate roadmap-handoff-v0.4.41.md per SDLC. Do not bump
or deploy unless the user asks.

Slice B (HUD pills) stays parked until Ken answers the (a)/(b) question in
this file's "Open question flagged for Ken" section — do not code it in the
same slice as Slice A, and do not pick an answer on Ken's behalf.

There is also a pickup-consumption-tracking + "Play Recap" addendum in this
same file (below the "Explicitly not in scope this slice" section) — do not
start it in the same session as Slice A, and do not start it at all until
Ken answers its three open questions (recap placement vs. the post-kill
card, one modal vs. a new pill, tone for bad-pickup stats).
```
