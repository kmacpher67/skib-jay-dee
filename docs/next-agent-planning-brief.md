# Next Agent Planning Brief — Skib-Jay-Dee-Toilet

**Created by:** Claude Sonnet 5 — 2026-07-27
**Last updated by:** Cursor Composer — 2026-07-28 (Raman recurrence + debug dump)

Use this when Ken opens a **Mode A** session. For coding, use
`docs/next-agent-coding-brief.md`.

## Ken deploy note

Game repo `git push` is intentionally **after** prod shows the new
iteration (~30–60s post `deploy-static.sh`). Automation scoped in
`roadmap-handoff-v0.4.65-plan.md` — **needs refinement**, not coded.

## Current production state

- `GAME_ITERATION`: **v0.4.60** (`frontend/src/version.js`)
- Role Reversal menu mode (`v0.4.53`) remains **broken** — recovery in
  `v0.4.61-plan.md`

## Active planning handoff

**`docs/handoffs/roadmap-handoff-v0.4.62-plan.md`** — frontend iteration
bundle: finish Rewards lineage (shop labels + Play Recap), then pose
collapse + Micro-Skib. Sequencing rationale and triage table live there.

## Coding queue (unblocked)

See `docs/next-agent-coding-brief.md`. Four slices in order; Role Reversal
is a parallel track, not part of the bundle.

## Still blocked on Ken

- **Audio 2 phase 1** — record `CAPTURE_LINES` clips (`dialog_content_chasing.md`)
- **Yoodeling Unc-2** — drop `images/yoodelling-unc-alex-2.png`
- **Role Reversal outcome UX** — confirm/change 60s capture/timeout +
  Rematch/Menu (`v0.4.61-plan` Flag for Ken). Menu rename + Beta color
  are **decided**.

## Useful Mode A follow-ups (optional)

- **Raman Rows recurrence RCA** — v0.4.52.1 fix verified still in tree;
  Ken still stuck on v0.4.60. Collect interim browser dump from
  `roadmap-handoff-v0.4.64-plan.md` or prioritize Debug State Dump Mode B.
- Debt Lock Method C TBDs in `difficulty-mechanics-plan.md` (selector done).
- Scope **Debug State Dump** into Mode B — handoff copy-paste is in
  `roadmap-handoff-v0.4.64-plan.md` (code-ready, unblocked).
- Record Ken's Role Reversal answers → `role-reversal-design.md` + `v0.4.61-plan`.

## LT arc (decided)

CEO L7 mid-boss → L10 new finale → endless after. Role Reversal v1 = menu
Beta arcade; deep kit after L10 arc. Hotfix is separate so the menu is not
a broken surface.
