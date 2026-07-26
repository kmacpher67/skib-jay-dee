# Roadmap Handoff — v0.4.18-plan

**Session date:** 2026-07-26
**Previous version:** v0.4.17-plan (see
`docs/handoffs/roadmap-handoff-v0.4.17-plan.md`, Dad Case environmental
traps — still unclaimed/uncoded).

This was a Mode A planning session (docs only, no code). Ken reviewed a
screenshot of the live main menu and asked a batch of "how does this
work" / "where is this" questions, plus a few feature asks. This session
answered the "how does it work" questions by reading the code, wrote
those answers up as a permanent reference doc, and turned the feature
asks + one already-answered "why is this fast" complaint into scoped
backlog items. No code was touched.

## What this session did

1. **Wrote `docs/gameplay-mechanics.md`** — a reference doc (not a plan)
   answering, against the current code:
   - Where the "create a new profile" feature is (nowhere yet — it's the
     existing unclaimed "Game identity & new profiles" backlog item).
   - Where death history is recorded when the Deaths pill is tapped
     (nowhere — it's a plain `<span>`, no click handler, no per-death
     log; only a lifetime counter).
   - Why sheebs default confusion exists (already fixed to `0` in
     v0.4.16 via `normalizeProfile()`; flagged a leftover dead
     `initialSheebs = 200` default in `GameEngine.js`'s constructor that
     never actually fires).
   - What currently happens on capture (skreems penalty + chaser
     slowdown, both already implemented) vs. what's missing (a sheebs
     penalty — the "-20 sheebs on death" ask is net-new work).
   - How the Speed/Stamina/Rewards perk-strip numbers are computed
     (`buildLoadout()` in `gameContent.js`, from owned shop items) and
     where they're applied in `GameEngine.js`.
   - How the multi-chaser mechanic spawns extra toilets
     (`_maybeSpawnExtraChaser()`, `EXTRA_CHASER_INTERVAL`, `MAX_CHASERS`,
     join-ramp).
   - The two distinct mechanisms behind "LVL2 Pipeworks upgrade comes
     too quick" — the level-1-exit `advanceAt` threshold (unstarted
     tuning work, likely the real culprit) vs. the Pipeworks-clear
     cinematic gate (already tuned twice, v0.4.10 and v0.4.15 — don't
     confuse the two).
   - Where the version badge lives (`.build-tag` at the bottom of the
     main menu, sourced from `frontend/src/version.js`) and confirmed
     there's no dedicated version/changelog screen yet (existing
     "Version page" backlog item).
2. **Added five new backlog items to `docs/roadmap.md`**, each scoped to
   fit one session: deaths history log, sheebs penalty on capture,
   tuning the level-1 advance threshold, and removing the dead
   `initialSheebs` default. Cross-linked each to the relevant section of
   `gameplay-mechanics.md` instead of re-explaining the mechanism inline.
3. **Did not touch** the two already-unclaimed items from prior
   handoffs (Dad Case traps, Version page, Game identity & new
   profiles) — they're still open, just not restated in full here; see
   `docs/roadmap.md`'s incremental backlog for the current list.

## Open questions for Ken

- **Sheebs penalty amount:** `-20` per capture was Ken's number in the
  original ask. `GameEngine.js`'s per-level rewards are 40/60/90/120/160
  — `-20` is meaningful but not crushing against level 1, less so by
  level 5. Confirm `-20` flat is still right, or whether it should scale
  with level/reward like the skreem penalty does (`DEATH_SKREEM_PENALTY`
  is a fraction, not a flat number).
- **Level-1 advance threshold:** no target number picked yet. Next
  planning pass (or the coding session, if the fix is small enough to
  just try and playtest) should pick a new `advanceAt` for level 1 (or
  reconsider the proximity-based gain formula itself) and playtest it —
  this is a feel/pacing call, not something to guess from the code
  alone.
- **Deaths history scope:** full per-death detail (timestamp + level +
  which chaser) vs. a simpler "last N deaths" list — worth a quick
  product call before coding since it affects the cookie profile shape.

## Copy-paste: next natural steps for the next agent

```text
Read docs/skib-sdlc.md (Mode B for coding, Mode A if more planning is
needed first), then docs/update-directions.md, then docs/roadmap.md,
then docs/gameplay-mechanics.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.18-plan.md).

This was a planning-only session (docs/gameplay-mechanics.md +
docs/roadmap.md backlog additions, no code). The backlog now has these
unclaimed items, oldest-first:
1. Dad Case Environmental Traps (from v0.4.17-plan — still needs a sound
   asset from Ken; check frontend/src/assets/audio/ before assuming it's
   still missing).
2. Version page (show GAME_ITERATION + a short changelog on the menu).
3. Game identity & new profiles (multiple cookie save slots).
4. Deaths history log (new this session — needs the "scope" open
   question above answered, or just pick the simpler "last N deaths"
   shape and go).
5. Sheebs penalty on capture (new this session — needs the "-20 flat vs.
   scaled" open question answered, or just ship -20 flat and note it's
   tunable).
6. Tune the level-1 -> Pipeworks advance threshold (new this session —
   needs actual playtesting to pick a number, not a guess from the
   formula alone).
7. Remove the dead `initialSheebs = 200` default in GameEngine.js
   (small, bundle with whichever GameEngine session above touches that
   file).

Unless Ken says otherwise, (5) and (7) are the smallest/safest pure-code
pick to start a Mode B session with (7 is a one-line cleanup, 5 is a
small additive constant near `DEATH_SKREEM_PENALTY`) — both are also
already answered well enough in gameplay-mechanics.md to code without
another planning pass. (4) and (6) genuinely benefit from Ken's input
on the open questions above before coding starts.

Verify with `cd frontend && npm run build && npx playwright test`.
Update docs/version-log.md, docs/update-directions.md, docs/roadmap.md,
docs/handoffs/ledger.md, and commit. Bump GAME_ITERATION and deploy only
once verified working locally.
```
