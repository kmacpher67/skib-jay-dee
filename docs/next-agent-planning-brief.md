# Next Agent Planning Brief — Skib-Jay-Dee-Toilet

**Created by:** Claude Sonnet 5 — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-28 (v0.4.71 completeness audit)

Use this when Ken opens a **Mode A** session. For coding, use
`docs/next-agent-coding-brief.md`.

## Start here

**`docs/handoffs/roadmap-handoff-v0.4.71-plan.md`** is the current
consolidated triage — it supersedes `v0.4.66-plan.md` (v0.4.65,
v0.4.67-v0.4.69 all shipped for real since that doc was written; this
brief and `roadmap.md`'s summary table had gone stale pointing at it).
Read the full v0.4.71 doc before re-deriving a backlog list from
scratch — it verifies every v0.4.60–v0.4.69 item against `git log` and
the actual code, not just doc claims, and surfaces two real bugs (a
version-number collision and two false in-game changelog entries).

## Ken deploy note

Game repo `git push` is intentionally **after** prod shows the new
iteration (~30–60s post `deploy-static.sh`). This shipped for real as
`v0.4.65` (commit `d0197f6`) — `docs/roadmap.md`'s checkbox was stale
until the v0.4.71 audit corrected it. No further action needed here.

## Current production state

- `GAME_ITERATION`: **v0.4.69** (Chaser Beta gun AI + profile isolation,
  shipped 2026-07-28).
- `roadmap-handoff-v0.4.70-plan.md` (Level 5 speed rebalance + difficulty
  selector wiring fix + Level 4 reward pass) is **fully code-ready,
  unshipped** — Ken has answered every open question on it. This is the
  correct next Mode B pick, not a planning task.
- Role Reversal menu mode (`v0.4.53`→`v0.4.61` recovery) is **live and
  playable**, with its Beta pill shipped too. Outcome UX (60s
  capture/timeout + Rematch/Menu) is still unconfirmed — see below.

## Still blocked on Ken

- **Audio 2 phase 1** — record `CAPTURE_LINES` clips (`dialog_content_chasing.md`)
- **Yoodeling Unc-2** — drop `images/yoodelling-unc-alex-2.png`
- **Role Reversal outcome UX** — confirm/change 60s capture/timeout +
  Rematch/Menu (`v0.4.61-plan` "Flag for Ken"). The menu Beta pill is
  **shipped**; this is a separate, still-open design question about the
  full v1.5 recovery.
- **Level 7+ Mosaic trigger mechanism** — floor trap vs. held item, see
  `v0.4.71-plan.md`'s still-open list (source: `level-progression-and-endgame-plan.md`).
- **Sentry/PostHog tool tier + privacy posture** — see `v0.4.71-plan.md`'s
  still-open list (source: `v0.4.64-plan.md`).

## Useful Mode A follow-ups (optional)

- Debt Lock Method C spec — the *wiring bug* (selector had zero gameplay
  effect) is fixed by `v0.4.70-plan.md`; the actual debt-lock math is
  still design-only in `difficulty-mechanics-plan.md`.
- Interactive content pack slicing — still concept-only, needs a bounded
  first slice cut from `interactive-content-pack.md`.
- Record Ken's Role Reversal answers → `role-reversal-design.md` + `v0.4.61-plan`.
- **New this pass:** the `VersionModal.jsx` false-entry bug (v0.4.55/
  v0.4.56 claimed shipped, aren't) is a Mode B fix, not Mode A — see
  `v0.4.71-plan.md` Finding #1. Nothing to plan here, just don't let a
  future Mode A session re-derive this as "already done" from the
  in-game changelog.

## LT arc (decided)

CEO L7 mid-boss → L10 new finale → endless after. Role Reversal v1 = menu
Beta arcade (shipped, pill and all); deep kit after L10 arc. Hotfix is
separate so the menu is not a broken surface.
