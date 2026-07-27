# Roadmap Handoff Plan v0.4.42

**Created by:** Claude Sonnet 5 — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-27
**Session mode:** Mode A (Planning — docs only, no code changes)

## Source

From `docs/roadmap.md` incremental backlog:
> **Menu brag stat: best level + fewest deaths.** Companion goal to the
> Phase 7 risk/reward items above — once losing sheebs/items past
> level 3/4 is real, players will want to see their best run at a glance
> (e.g. "Best level 4 in 3 deaths"). Cookie profile already tracks
> `highestLevel` and lifetime deaths/`deathsHistory`, so this is mostly a
> menu display item, not new persistence. Small, do after the risk/reward
> items land so there's something worth bragging about.

## Current Behavior

- The profile (in `frontend/src/lib/cookies.js`) tracks `highestLevel` and `deaths` (total lifetime deaths). It does not currently track the "fewest deaths to reach highestLevel", although `deathsHistory` contains the history. However, `deathsHistory` is capped at the last 50 captures, so it cannot be reliably used to compute the "fewest deaths for a specific run from level 1 to X".
- The game engine (`frontend/src/GameEngine.js`) doesn't track deaths-per-run explicitly for persistence, other than counting session deaths.

## Decisions made this planning pass

1. **New Profile Field: `bestRun`**: We need a new field in the profile to persist this brag stat.
   ```js
   bestRun: {
     level: 1, // highest level reached in a single run
     deaths: 0, // deaths taken during that run
   }
   ```
2. **Update Logic in `App.jsx`**:
   - Track session deaths locally in `App.jsx` or use `GameEngine.js`'s session death count (`sessionDeaths`).
   - When a level is cleared (e.g., `handleLevelClear`), check if the current run's level exceeds `profile.bestRun.level`, or if it equals it but with fewer session deaths. If so, update `profile.bestRun` and persist it.
3. **Menu UI**: Add a UI element on the main menu, perhaps a small pill or text under the "User [Name]" section or in the `perk-strip`, showing "Best: Lvl {X} ({Y} deaths)".

## Files likely touched

- `frontend/src/lib/cookies.js` — add `bestRun: { level: 1, deaths: 0 }` to `normalizeProfile()`.
- `frontend/src/App.jsx` — update `bestRun` logic during `handleLevelClear`. Render the new UI on the menu.
- `docs/profiles-and-identity.md` — document the new `bestRun` field.
- `docs/roadmap.md` — mark "Menu brag stat" as done once shipped.

## Explicitly not in scope

- Retroactive calculation (older profiles will just start at Lvl 1 / 0 deaths for their `bestRun` and update on their next run).
- Changes to core gameplay mechanics.

---

## Copy-paste: next coding agent

```text
Read docs/skib-sdlc.md, docs/update-directions.md, docs/roadmap.md,
docs/profiles-and-identity.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.42-plan.md).

Your slice: Menu brag stat (best level + fewest deaths).

1. In frontend/src/lib/cookies.js, update `normalizeProfile()` to include a `bestRun` object if it doesn't exist: `bestRun: p.bestRun || { level: 1, deaths: 0 }`.
2. In frontend/src/App.jsx, in `handleLevelClear()`, you receive `index` (the new level number). You should also extract the current run's death count. (GameEngine.js tracks `sessionDeaths` - you may need to add it to the state or access it from the engine instance). If `index > profile.bestRun.level` OR (`index === profile.bestRun.level` AND `sessionDeaths < profile.bestRun.deaths`), update `profile.bestRun` and save.
3. In `frontend/src/App.jsx`, render this stat on the main menu. A good place is near the status pills or user profile area. Display it as "Best Run: Lvl {X} ({Y} deaths)".
4. Update `docs/profiles-and-identity.md` to document the new `bestRun` profile field.

Verification:
- cd frontend && npm run build
- Play a round, die once, clear a level, ensure "Best Run" updates.

After landing: update docs/version-log.md, docs/update-directions.md,
docs/roadmap.md (check off "Menu brag stat"), docs/handoffs/ledger.md, 
VersionModal.jsx if bumping GAME_ITERATION. Generate roadmap-handoff-v0.4.42.md.
```
