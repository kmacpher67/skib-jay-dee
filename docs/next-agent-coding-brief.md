# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

**Created by:** Codex (GPT-5) — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-28 (v0.4.71 completeness audit)

Check `frontend/src/version.js` for live `GAME_ITERATION` (**v0.4.70** —
Level 5 speed rebalance + difficulty wiring fix + Ramen Aisle reward
pass, shipped by a concurrent session partway through the v0.4.71 audit,
see `roadmap-handoff-v0.4.70.md`).

Full audit and ranked candidate queue:
`docs/handoffs/roadmap-handoff-v0.4.71-plan.md` (supersedes the earlier
`v0.4.66-plan.md` — v0.4.65/v0.4.67/v0.4.68/v0.4.69/v0.4.70 all shipped
since then). Next unblocked pick: **Micro-Skib** (`v0.4.55-plan.md`).

## Do this next — `roadmap-handoff-v0.4.55-plan.md` (Micro-Skib chaser)

Code-ready per Ken 2026-07-27: replace-extra-spawn chaser, Level 3+, 65%
hitbox, 0.85x speed. Note: `VersionModal.jsx` already has a changelog
entry claiming this shipped as v0.4.55 — it didn't (verified: no
`micro-skib` string anywhere in `GameEngine.js`). Shipping this for real
makes that entry true instead of false; see `v0.4.71-plan.md` Finding #1.

## After that — pick from the ranked queue in `v0.4.71-plan.md`

| Order | Slice | Handoff detail |
|---|---|---|
| 1 | Micro-Skib chaser | `v0.4.55-plan.md` — do first |
| 2 | Runner pose collapse (3 unique) | `v0.4.56-plan.md` |
| 3 | Badge award counts | `v0.4.72-plan.md` (renumbered from `v0.4.67-plan.md` — that slot was consumed by a different shipped feature, see `v0.4.71-plan.md` Finding #2) |

**Note on #1 and #2:** `frontend/src/components/VersionModal.jsx` already
has changelog entries claiming Micro-Skib (v0.4.55) and pose collapse
(v0.4.56) shipped — they didn't (verified: no `micro-skib` string
anywhere in the engine, `RUNNER_FACE_POOL` still has 5 entries not 3).
Shipping these two for real makes the existing entries true instead of
false; don't add new duplicate changelog text for them, the old entries
already cover it once the code catches up.

## Do not pick up yet

- **Full Difficulty Function / Debt Lock math** — the *wiring bug* was
  fixed by v0.4.70; the auto-tuner/full Method C formula stays
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
- Everything through v0.4.70 listed as shipped in
  `roadmap-handoff-v0.4.71-plan.md`'s status table (and its "Update"
  note) — do not re-implement.

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
4. The specific slice handoff you are implementing (`v0.4.55-plan.md` first)
