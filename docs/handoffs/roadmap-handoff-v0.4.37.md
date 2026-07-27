# Handoff: v0.4.37 (Shipped)

**Created by:** Claude (Sonnet 5) — 2026-07-27 (backfilled retroactively;
see note below)
**Last updated by:** Claude (Sonnet 5) — 2026-07-27

> **Provenance note:** this write-up was not created in the same session
> that shipped the code (commit `15da833`, "v0.4.37: Close-call freeze
> and sheeb rewards"). That session updated `docs/version-log.md`,
> `docs/handoffs/ledger.md`, and one `docs/roadmap.md` checkbox, but
> never generated the per-version `docs/handoffs/roadmap-handoff-vX.Y.Z.md`
> file the SDLC requires (`docs/skib-sdlc.md` step 4). A later Mode A
> documentation-continuity review found the gap and backfilled this file
> from the version-log entry, the ledger lines, the shipped diff, and
> `docs/close-call-freeze.md` (the original design spec). Treat the
> "What was done" / "Verification" sections below as an accurate
> reconstruction of that session's work, not a live account of it.

## What was done

Implemented the **Close-Call Freeze & Rewards** slice specced in
`docs/close-call-freeze.md`, picked from the (then-current)
`docs/handoffs/roadmap-handoff-v0.4.37-plan.md` — the next single-session
increment after `v0.4.36.1` finished the prior session's interrupted
work.

1. **New `close-call-freeze` phase.** `frontend/src/GameEngine.js` now
   transitions into a dedicated `close-call-freeze` phase once the
   existing near-capture / pre-kill skreem beat resolves
   (`_updateCloseCallFreeze(dt)`), instead of letting the chase resume
   immediately. Runner movement, chaser AI, stamina, skreem gain, and
   timers all stay locked for the freeze's duration (~1 second) so a
   mobile player gets a beat to re-center their fingers before the
   chase moves again. Kept deliberately separate from the unrelated
   post-capture `resume-countdown` phase (v0.4.24) — the two recovery
   beats don't share code or state.
2. **Close-call escape reward.** A clean escape from the freeze (i.e.
   the runner isn't caught during it) now pays **+50 sheebs**, tied to
   the same event that already fires the `Slippery When Wet` badge so
   the reward and the brag moment can't drift apart.
3. **Positive pickup reward.** Collecting a positive-effect item now
   pays **+5 sheebs** on top of its own effect. Reward eligibility is
   data-driven via a `POSITIVE_PICKUPS` list added to
   `frontend/src/gameContent.js` (Jayden Gun, Schleimy Potion, Taco Bell
   Grande — matches the pool named in `docs/close-call-freeze.md`), so
   future positive pickups can opt in by adding an entry rather than a
   new branch in the engine.
4. Added `frontend/e2e/close-call-rewards.spec.js` covering the freeze
   timing and both reward paths.
5. Backfilled the `VersionModal.jsx` "What shipped lately" entry for
   `v0.4.37`.

## Verification

- `npm run build` — clean (per the shipped commit's diff stat).
- New `frontend/e2e/close-call-rewards.spec.js` added alongside the
  existing suite.
- `GAME_ITERATION` bumped to `v0.4.37` (`frontend/src/version.js`) and
  deployed.

*(These are recorded as reported at the time in `docs/version-log.md`
and `docs/handoffs/ledger.md`; this backfill pass did not re-run the
build or suite itself since Mode A is docs-only — see
`docs/skib-sdlc.md`.)*

## Design decisions

- Chose a dedicated `close-call-freeze` phase rather than repurposing
  `resume-countdown` or the `near-capture` phase, matching
  `docs/close-call-freeze.md`'s explicit "keep this separate" guidance.
- Made positive-pickup reward eligibility data-driven
  (`POSITIVE_PICKUPS` in `gameContent.js`) instead of hardcoding pickup
  IDs in the engine, so the interactive-content-pack backlog items can
  slot into the same reward path later.

## What's explicitly not done

- The broader **content-first fun pass** (richer dialog, badge flavor,
  map callouts, a menu brag surface) from the superseded
  `v0.4.37-plan — Content-first refocus` entry in `docs/version-log.md`
  — that framing was itself replaced by the close-call freeze/reward
  scope before this version shipped. Still parked, not part of this
  release.
- Level 6 ("Jayden's Nightmare House") and the level-data-extraction
  migration — separate scope, see
  `docs/handoffs/roadmap-handoff-v0.4.38-plan.md`.
- The **Gameplay Rebalancing** follow-up (`docs/roadmap.md`'s scaled
  sheeb rewards/death penalties/chaser-speed-cap item) — that's the
  *next* tuning pass after this one landed the mechanic, not part of
  this slice.

## Next up

`docs/handoffs/roadmap-handoff-v0.4.39-plan.md` is the current open
planning pass (corrected in this same documentation-continuity session
to stop listing this feature as still open). Its recommended next slice
is **Enhanced Death Logs** plus the **Parody Warning & Feedback Link**
UI addition — both small, unblocked, front-end-only items.
