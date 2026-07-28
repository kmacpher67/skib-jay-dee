# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

**Created by:** Codex (GPT-5) — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-28 (v0.4.71 completeness audit)

Check `frontend/src/version.js` for live `GAME_ITERATION` (**v0.4.69** —
Chaser Beta gun AI + profile isolation, see `roadmap-handoff-v0.4.69.md`).

Full audit and ranked candidate queue:
`docs/handoffs/roadmap-handoff-v0.4.71-plan.md` (supersedes the earlier
`v0.4.66-plan.md` — v0.4.65/v0.4.67/v0.4.68/v0.4.69 all shipped since
then). Next unblocked pick: **`v0.4.70-plan.md`** (Level 5 speed
rebalance + difficulty selector wiring fix + Level 4 reward pass) — every
open question on it is already resolved by Ken.

## Do this next — `roadmap-handoff-v0.4.70-plan.md`

Fully code-ready, no open questions. Fixes a real bug (the difficulty
selector shipped in v0.4.60 has zero effect on chase difficulty — dead
`'easy'`/`'hardcore'` checks instead of the real `'noob'`/`'casual'`/
`'4chan-st'` values) plus rebalances Level 5 chaser pressure and adds a
Ramen Aisle (Level 4) reward pass. Full copy-paste block is at the bottom
of that file — follow it directly.

## After that — pick from the ranked queue in `v0.4.71-plan.md`

| Order | Slice | Handoff detail |
|---|---|---|
| 1 | Level 5 rebalance + difficulty wiring fix | `v0.4.70-plan.md` — do first |
| 2 | Micro-Skib chaser | `v0.4.55-plan.md` |
| 3 | Runner pose collapse (3 unique) | `v0.4.56-plan.md` |
| 4 | Badge award counts | `v0.4.72-plan.md` (renumbered from `v0.4.67-plan.md` — that slot was consumed by a different shipped feature, see `v0.4.71-plan.md` Finding #2) |

**Note on #2 and #3:** `frontend/src/components/VersionModal.jsx` already
has changelog entries claiming Micro-Skib (v0.4.55) and pose collapse
(v0.4.56) shipped — they didn't (verified: no `micro-skib` string
anywhere in the engine, `RUNNER_FACE_POOL` still has 5 entries not 3).
Shipping these two for real makes the existing entries true instead of
false; don't add new duplicate changelog text for them, the old entries
already cover it once the code catches up.

## Do not pick up yet

- **Full Difficulty Function / Debt Lock math** — the *wiring bug* is
  fixed by `v0.4.70-plan.md`; the auto-tuner/full Method C formula stays
  design-only in `difficulty-mechanics-plan.md`.
- **Audio 2 phase 1** — blocked on Ken recording `CAPTURE_LINES` clips.
- **Yoodeling Unc-2** — blocked on asset drop.
- **Role Reversal full v1.5 recovery, outcome UX** — the menu Beta pill
  and Chaser Beta AI/profile-isolation work are shipped; the 60s
  timer/Rematch-Menu question in `v0.4.61-plan.md` is still unanswered.
  Do not ship outcome UX changes without that answer.
- **Sentry + PostHog SDK slice** (`v0.4.64-plan.md` § SDK) — blocked on
  Ken (tool tier + privacy/consent). Debug State Dump from the same plan
  already shipped standalone (v0.4.64).
- **Interactive content pack** — not code-ready, needs a Mode A slicing
  pass first.
- Everything through v0.4.69 listed as shipped in
  `roadmap-handoff-v0.4.71-plan.md`'s status table — do not re-implement.

## Parallel track (Ken priority override)

If Ken redirects to something not in this queue, use his instruction —
but still respect the "blocked on Ken" list above; don't invent an
answer to an open design question on his behalf.

## Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test`
- Optional map regression: `python3 scripts/audit-map-widths.py`

## Read first

1. `docs/skib-sdlc.md`
2. `docs/update-directions.md`
3. `docs/handoffs/roadmap-handoff-v0.4.71-plan.md`
4. The specific slice handoff you are implementing (`v0.4.70-plan.md` first)
