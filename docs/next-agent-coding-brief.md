# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

**Created by:** Codex (GPT-5) — 2026-07-27
**Last updated by:** Codex GPT-5 — 2026-09-20 (Boom Stick refinement pointer)
**Last updated on:** 2026-09-20

Check `frontend/src/version.js` for live `GAME_ITERATION` (**v0.4.76** —
Heavy Plunger rebalance, see `roadmap-handoff-v0.4.76.md`).

> **Correction:** an earlier version of this brief (and a same-day
> concurrent planning doc, `roadmap-handoff-v0.4.76-plan.md`) claimed
> Micro-Skib, runner pose collapse, and Badge award counts were still
> open, based on a grep that was run before those features actually
> landed. All three are verified shipped in real code as of this
> session: `chaserType === 'micro-skib'` in `GameEngine.js` (v0.4.71),
> `RUNNER_FACE_POOL` collapsed to 3 entries in `gameContent.js` (v0.4.71),
> and `profile.badgeAwardCounts` in `cookies.js` (v0.4.72). The
> `VersionModal.jsx` changelog entries for v0.4.55/v0.4.56 are no longer
> false. Do not re-implement any of these.

## Do this next — `roadmap-handoff-v0.4.62-plan.md` Slice 2 (Play Recap)

Code-ready per Ken 2026-07-27: pickup-consumption tracking + a "Play
Recap" screen (level-clear/menu return only, Stats tab in the Rewards
modal, comedic bad-pickup tone). See the addendum in
`roadmap-handoff-v0.4.62-plan.md` for the full spec.

## After that — pick from the ranked queue

| Order | Slice | Handoff detail |
|---|---|---|
| 1 | Pickup tracking + Play Recap | `v0.4.62-plan.md` addendum |
| 2 | Debug State Dump | `v0.4.64-plan.md` |

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
- **HUD top bar layout / audio overlay** — the layout fix shipped in
  `v0.4.75`; the audio overlay follow-up stays parked until the asset
  and trigger decisions are confirmed.
- **GitHub issue #3 (Gun rebalance + Boom Stick shotgun)** — the Boom
  Stick lane is now refined into small code-ready mechanics/VFX/text
  slices in `roadmap-handoff-v0.4.77-plan.md`; the final voice slice
  still waits for recorded/approved assets. Keep the broader handgun
  ammo/HP/body-count work separate rather than attempting the whole
  issue in one run.
- **GitHub issue #4 (Taco fart attack rework)** — blocked on confirming
  the current implementation first.
- Everything through v0.4.76 listed as shipped in `docs/roadmap.md` —
  do not re-implement. If a handoff/plan doc disagrees with the real
  code, trust the code (grep `GameEngine.js`/`gameContent.js`/
  `cookies.js`) over the doc.

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
3. `docs/roadmap.md` (source of truth for what's actually shipped)
4. The specific slice handoff you are implementing (`v0.4.62-plan.md` first)
