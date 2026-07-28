# Next Agent Planning Brief — Skib-Jay-Dee-Toilet

**Created by:** Claude Sonnet 5 — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-28 (v0.4.66 triage consolidation)

Use this when Ken opens a **Mode A** session. For coding, use
`docs/next-agent-coding-brief.md`.

## Start here

**`docs/handoffs/roadmap-handoff-v0.4.66-plan.md`** is the current
consolidated triage: ranked candidate queue plus 4 items that need real
design refinement before they're codeable. Candidate 1 (Debug State
Dump) shipped as `v0.4.64` mid-session — next unblocked pick is
candidate 2 (post-deploy push automation). Read the full doc before
re-deriving a backlog list from scratch.

## Ken deploy note

Game repo `git push` is intentionally **after** prod shows the new
iteration (~30–60s post `deploy-static.sh`). Automation is designed and
code-ready in `roadmap-handoff-v0.4.65-plan.md` — `docs/roadmap.md`'s
"needs refinement" label on this item is stale, see `v0.4.66-plan.md`
candidate #2 for the reconciliation task.

## Current production state

- `GAME_ITERATION`: **v0.4.64** (Debug State Dump, shipped this session).
- Role Reversal menu mode (`v0.4.53`) remains **broken** — recovery in
  `v0.4.61-plan.md`

## Still blocked on Ken

- **Audio 2 phase 1** — record `CAPTURE_LINES` clips (`dialog_content_chasing.md`)
- **Yoodeling Unc-2** — drop `images/yoodelling-unc-alex-2.png`
- **Role Reversal outcome UX** — confirm/change 60s capture/timeout +
  Rematch/Menu (`v0.4.61-plan` Flag for Ken). Menu rename is **decided**;
  full Beta visual treatment is candidate #6 in `v0.4.66-plan.md`.
- **Level 7+ Mosaic trigger mechanism** — floor trap vs. held item, see
  `v0.4.66-plan.md` candidate A.
- **Sentry/PostHog tool tier + privacy posture** — see `v0.4.66-plan.md`
  candidate D.

## Useful Mode A follow-ups (optional)

- Debt Lock Method C spec — `v0.4.66-plan.md` candidate B.
- Interactive content pack slicing — `v0.4.66-plan.md` candidate C.
- Record Ken's Role Reversal answers → `role-reversal-design.md` + `v0.4.61-plan`.

## LT arc (decided)

CEO L7 mid-boss → L10 new finale → endless after. Role Reversal v1 = menu
Beta arcade; deep kit after L10 arc. Hotfix is separate so the menu is not
a broken surface.
