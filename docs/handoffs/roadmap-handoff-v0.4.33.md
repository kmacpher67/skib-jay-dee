# Roadmap Handoff — v0.4.33

**Session mode:** Mode B (Implementation)

Picked up the oldest unfinished handoff, `docs/handoffs/roadmap-handoff-v0.4.33-plan.md`.
Before coding, refined two open design questions directly with Ken (see
that plan doc's "Clarifications from Ken" section, added this session)
and wrote a new `docs/level-progression-and-endgame-plan.md` scoping
Level 6+ and a proposed endgame arc — Ken had also asked, mid-session,
for a real story arc past Level 5 instead of the game staying endless
forever. That planning doc deliberately keeps Level 6 itself **out of
scope** for this handoff (single-session sizing) — this session only
covers the two items originally scoped: Quest Rooms for Levels 4-5, and
the Level 4+ survival floor.

## What we did

1. **Quest Room landmark badges** (`frontend/src/GameEngine.js`,
   `frontend/src/gameContent.js`):
   - `buildRamenAisle()` (Level 4) now carves a `questRoom` rect (120×200)
     into open floor space clear of the existing aisle grid, enclosed by
     walls with **two** narrow door gaps on opposite sides (north/south,
     50px each) — matching the plan's "openings on each side" spec for
     Level 4.
   - `buildWorldStarParkingLot()` (Level 5) carves a smaller `questRoom`
     (110×120) in the open band above the car grid, enclosed with **one**
     door gap (south, 50px) — a real chokepoint, matching the plan's
     Level 5+ spec.
   - Both map builders now return a `questRoom` field alongside
     `walls`/`puddles`/`theme`; `LEVELS[3]` and `LEVELS[4]` each got a new
     `questBadgeId` field (`ramen-vault-keeper`, `world-star-witness` —
     two new `BADGES` entries).
   - `_spawnQuestRoomBadge()`, called from `_syncLevelState()`, drops a
     guaranteed `type: 'quest-badge'` pickup at the room's center (unlike
     the Jayden Gun/humor badges, no spawn-chance roll — it's a fixed
     landmark). Already-earned badges aren't re-spawned, same dedupe
     pattern as the progression badges.
   - Collecting one only calls `onBadgeEarned()` — **non-gating**, unlike
     the v0.4.32 progression badges. Confirmed by not touching
     `levelBadgeCollected` anywhere in the quest-badge branch.
   - `_pickupStyle()` got a third case (amber/gold) so quest badges read
     as visually distinct from the gun (gray) and progression badges
     (purple).

2. **Level 4+ survival floor** (`frontend/src/GameEngine.js`):
   - New `_meetsLevel4PlusFloor()`: a no-op (`true`) below `levelIndex 3`;
     at Level 4 and beyond, requires `levelElapsed >= 90 + (levelIndex -
     3) * 30` seconds **and** `chasers.length >= 5`.
   - ANDed into the existing generic `advanceAt` branch alongside the
     pre-existing skreems threshold, `MIN_LEVEL_SECONDS_BEFORE_ADVANCE`,
     and `_hasRequiredLevelBadge()` — per Ken's confirmed answer, the new
     floor **stacks with**, not replaces, the skreems check.
   - World Star Parking Lot's `advanceAt` stays `null` (still
     intentionally endless) — the formula is generic and forward-
     compatible for whenever Level 6 actually exists to advance into, but
     nothing changes about Level 5's behavior in this session.

3. **Tests:** `frontend/e2e/quest-rooms-and-level4-floor.spec.js` — one
   spec confirms the Level 4 quest pickup spawns inside the room bounds
   and awards its badge without touching `levelBadgeCollected`; a second
   confirms Level 4 stays stuck in `'chase'` once skreems/old-30s-
   floor/2-chasers are met but the new 90s/5-chaser floor isn't, then
   unlocks once it is. Found and worked around a real gotcha while
   writing these: manually setting `engine.levelIndex = 3` and calling
   `_syncLevelState({ resetPositions: true })` with its default
   `notify: true` fires the existing Level 4 warning overlay's
   `onLevelChange` side effect, which pauses the engine
   (`GameEngine.stop()`, `_raf` goes `null`) until the overlay's accept
   button is clicked — invisible from the engine side, so it silently
   stalls anything waiting on real-time frame ticks. Both new specs pass
   `notify: false` to skip that unrelated side effect.

## What's explicitly not done

- Level 6 ("Jayden's Nightmare House") and the proposed Level 7 climax —
  scoped in the new `docs/level-progression-and-endgame-plan.md`, but
  deliberately its own future handoff, not part of this session.
- World Star's `advanceAt: null` was intentionally left unchanged.
- No new badge art was requested; `ramen-vault-keeper` and
  `world-star-witness` render with existing emoji only.

## Verification

- `cd frontend && npm run build` — clean.
- `npx playwright test` — full suite passes: 25 active specs, 1
  pre-existing skip, 0 failures.
- Manual verification against a local `vite preview` build: screenshotted
  the Level 4 quest room (visible through its north door gap, ramen-bowl
  pickup rendering with the amber/gold style) and confirmed the full
  pickup → `onBadgeEarned` → React toast pipeline fires end-to-end
  ("ACHIEVEMENT UNLOCKED: Ramen Vault Keeper"), and screenshotted the
  Level 5 single-chokepoint room.

## Note on this session

This repo had multiple concurrent Claude Code sessions actively working
in the same working tree during this pass (a separate docs-only content-
pack session landed as `8e0e9ee`, plus at least one other session
appeared to be independently prototyping this same Quest Room feature in
a since-reverted/uncommitted state). No conflicting code ended up
committed — this handoff's diff was verified clean (build + full suite)
immediately before committing, and doc bookkeeping below was deferred
until the concurrent docs session's own commits landed, to avoid
clobbering in-flight edits to shared files like `docs/roadmap.md`.

## Copy-paste: next natural steps

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md`, `docs/update-directions.md`, and
`docs/roadmap.md` before starting.

Quest Rooms (Levels 4-5) and the Level 4+ survival floor shipped in
v0.4.33 — don't redo them. The oldest unfinished handoff is now
`docs/handoffs/roadmap-handoff-v0.4.34-plan.md` (chaser wall-hacks +
the "Gawd Particle"). After that, `docs/level-progression-and-endgame-
plan.md` has a fully-scoped-but-not-yet-a-handoff Level 6 ("Jayden's
Nightmare House" + the Skib-Daddy-Toilet Guy chaser) — it needs Ken's
answers on the two flagged creative questions (chaser face asset, and
whether "Skib-Daddy" is the final name) before it can become a real
Mode B handoff.

Verify with `npm run build` and the full Playwright suite before
calling it done. Update `docs/roadmap.md`, `docs/handoffs/ledger.md`,
`docs/version-log.md`, `docs/update-directions.md`, and a new
`docs/handoffs/roadmap-handoff-vX.Y.Z.md` per the SDLC checklist, and
commit before ending the session.
```
