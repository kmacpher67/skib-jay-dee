# Next Agent Planning Brief — Skib-Jay-Dee-Toilet

**Created by:** Claude Sonnet 5 — 2026-07-27
**Created on:** 2026-07-27
**Last updated by:** Codex GPT-5 — 2026-09-20 (Boom Stick refinement pointer)
**Last updated on:** 2026-09-20

Use this when Ken opens a **Mode A** session. For coding, use
`docs/next-agent-coding-brief.md`.

## Start here

For the current gun/shotgun refinement, read
`docs/handoffs/roadmap-handoff-v0.4.77-plan.md`. It renames the proposed
Poop Popper to the Boom Stick and settles the one-shell cone mechanics,
1-in-3 explosion rule, splotch/respawn behavior, portrait-shatter
cutaway, script/timing, and implementation slices. Mechanics/VFX/text
are code-ready; final voice integration waits on approved recordings.

`docs/roadmap.md` is the corrected source of truth as of 2026-08-11 —
read it directly rather than an older triage doc. Two same-day docs in
`docs/handoffs/` (`roadmap-handoff-v0.4.71-plan.md`'s "ranked candidate
queue" and `roadmap-handoff-v0.4.76-plan.md`) both claimed Micro-Skib,
runner pose collapse, and Badge award counts were still open — that was
stale even at the time; verified against real code, all three shipped
in `v0.4.71`/`v0.4.72`. See the correction note at the top of
`roadmap-handoff-v0.4.76-plan.md`.

If you're following the store/menu cleanup request from an earlier
session, use `docs/handoffs/roadmap-handoff-v0.4.74-plan.md` instead.

## Ken deploy note

Game repo `git push` is intentionally **after** prod shows the new
iteration (~30–60s post `deploy-static.sh`). This shipped for real as
`v0.4.65` (commit `d0197f6`) — `docs/roadmap.md`'s checkbox was stale
until the v0.4.71 audit corrected it. No further action needed here.

## Current production state

- `GAME_ITERATION`: **v0.4.76** (Heavy Plunger rebalance — rarer spawn +
  new AoE stain slow-zone; shipped 2026-08-11, see
  `roadmap-handoff-v0.4.76.md`).
- Next unblocked Mode B pick is **Pickup-consumption tracking + Play
  Recap** (`roadmap-handoff-v0.4.62-plan.md` Slice 2), not a planning
  task.
- Role Reversal menu mode (`v0.4.53`→`v0.4.61` recovery) is **live and
  playable**, with its Beta pill shipped too. Outcome UX (60s
  capture/timeout + Rematch/Menu) is still unconfirmed — see below.

## Still blocked on Ken

- **Audio 2 phase 1** — record `CAPTURE_LINES` clips (`dialog_content_chasing.md`)
- **HUD top bar layout / audio overlay** — the layout fix is already
  shipped in `v0.4.75`; the audio follow-up stays parked until the asset
  list / trigger plan is confirmed.
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
  effect) was fixed by v0.4.70; the actual debt-lock math is still
  design-only in `difficulty-mechanics-plan.md`.
- Level-start warp passes — `roadmap-handoff-v0.4.73-plan.md` now scopes
  the requested level-jump idea as a shop-gated progression unlock
  instead of a free selector or stat item.
- Shleeb Shop side-by-side layout + item glossary —
  `roadmap-handoff-v0.4.74-plan.md` turns the shop into a more
  scan-friendly card grid and expands `docs/players-guide.md` to explain
  the current item catalog.
- Top HUD bar cleanup + audio overlay refinement —
  `roadmap-handoff-v0.4.75-plan.md`.
- Interactive content pack slicing — still concept-only, needs a bounded
  first slice cut from `interactive-content-pack.md`.
- Record Ken's Role Reversal answers → `role-reversal-design.md` + `v0.4.61-plan`.
- **Resolved:** the `VersionModal.jsx` false-entry bug (v0.4.55/v0.4.56)
  is fixed — Micro-Skib and pose collapse shipped for real in `v0.4.71`.
  No longer an open item.

## LT arc (decided)

CEO L7 mid-boss → L10 new finale → endless after. Role Reversal v1 = menu
Beta arcade (shipped, pill and all); deep kit after L10 arc. Hotfix is
separate so the menu is not a broken surface.
