# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

**Created by:** Codex (GPT-5) — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-28 (v0.4.66 triage consolidation)

Check `frontend/src/version.js` for live `GAME_ITERATION` (**v0.4.64** —
Debug State Dump shipped this session, see `roadmap-handoff-v0.4.64.md`).

Full ranked candidate queue with readiness notes:
`docs/handoffs/roadmap-handoff-v0.4.66-plan.md`. Next unblocked pick:
**post-deploy game-repo push automation** (`v0.4.65-plan.md`).

## Sentry/PostHog SDK slice — still blocked

Do **not** install Sentry/PostHog from `roadmap-handoff-v0.4.64-plan.md`'s
SDK section yet — blocked on Ken (tool tier + privacy/consent posture).
The Debug State Dump slice from the same handoff already shipped.

## Primary queue — `roadmap-handoff-v0.4.62-plan.md`

Slice 1 (Rewards HUD shop labels) already shipped as `v0.4.62`. Pick the
**oldest unfinished slice** in this order (one slice per session):

| Order | Slice | Handoff detail |
|---|---|---|
| 1 | Pickup tracking + Play Recap | `v0.4.62-plan.md` Slice 2 / `v0.4.41-plan.md` addendum |
| 2 | Runner pose collapse (3 unique) | `v0.4.56-plan.md` |
| 3 | Micro-Skib chaser | `v0.4.55-plan.md` |

## Do not pick up yet

- **Full Difficulty Function / Debt Lock** — selector shipped v0.4.60; math
  still design-only in `difficulty-mechanics-plan.md`.
- **Audio 2 phase 1** — blocked on Ken recording `CAPTURE_LINES` clips.
- **Yoodeling Unc-2** — blocked on asset drop.
- **Role Reversal full v1.5 recovery** — menu Beta treatment is decided, but
  outcome UX (60s timer, Rematch/Menu) needs Ken's answer. See
  `v0.4.61-plan.md`. Do not ship a movement-only debug toggle as "recovered."
- **Neon Jump-Scare Upgrade, near-miss burst, Rod hotfix, Desktop FOW,
  Difficulty selector** — already shipped (v0.4.54–v0.4.60). Do not
  re-implement.
- **Sentry + PostHog SDK slice** (`v0.4.64-plan.md` § SDK) — blocked on
  Ken (tool tier + privacy/consent). Debug State Dump from same handoff
  is unblocked and may ship standalone.

## Parallel track (Ken priority override)

If Ken says "fix Play as Chaser first," use `v0.4.61-plan.md` instead of
the v0.4.62 bundle — but still wait for timer/rematch confirmation before
outcome UX.

If Ken says "ship debug dump," use `v0.4.64-plan.md` Debug State Dump
slice only (see Ken priority override above).

## Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test`
- Optional map regression: `python3 scripts/audit-map-widths.py`

## Read first

1. `docs/skib-sdlc.md`
2. `docs/update-directions.md`
3. `docs/handoffs/roadmap-handoff-v0.4.62-plan.md`
4. The specific slice handoff you are implementing
