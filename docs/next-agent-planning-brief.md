# Next Agent Planning Brief — Skib-Jay-Dee-Toilet

**Created by:** Claude Sonnet 5 — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-27

Use this when Ken opens a **Mode A** session (planning / vibes / research —
**no code**). For the next **coding** slice, use
`docs/next-agent-coding-brief.md` instead.

## Start here (read order)

1. `AGENTS.md` — repo rules; planning-only by default unless a handoff says
   to code.
2. `docs/skib-sdlc.md` — Mode A vs Mode B; extend in-flight `-plan.md`
   files instead of duplicating.
3. `docs/update-directions.md` — what actually shipped vs what docs say.
4. `frontend/src/version.js` — **always** check `GAME_ITERATION` here;
   docs can lag parallel sessions.
5. `docs/roadmap.md` — incremental backlog (frontend snapshot section at
   top of open items).
6. `docs/future-versions.md` — parked work not yet queued.
7. Active handoffs in `docs/handoffs/`:
   - `roadmap-handoff-v0.4.39-plan.md` (death logs + parody warning) and
     `roadmap-handoff-v0.4.40-plan.md` (Shart Knocker) are both **shipped**
     (`v0.4.39`, `v0.4.39.1`, `v0.4.40`) — no longer the active queue.
   - **Current open handoff:** `roadmap-handoff-v0.4.41-plan.md` (Rewards &
     History panel + HUD live-data pills, from Ken's screenshot feedback).
     Slice A (history panel) is code-ready; Slice B (HUD pill numbers) is
     blocked on a decision from Ken — see that file's "Open question"
     section.
8. Design tracks (vibes / not ready to code):
   - `docs/difficulty-mechanics-plan.md` — Method C / Debt Lock; auto-tune
     refinement section has open TBDs (window size, floor/ceiling).
   - `docs/level-progression-and-endgame-plan.md` — Level 7+ Mosaic map;
     **Flag for Ken item 7** (dimension-shift trigger) still unanswered.

## Current production state (2026-07-27, revised)

- `GAME_ITERATION`: **v0.4.40** (Shart Knocker on top of the v0.4.39 death
  logs/parody warning, and v0.4.39.1's Level 4 spawn fix). Confirmed
  against `frontend/src/version.js` — the previous "v0.4.38" note here was
  stale, corrected this pass.
- Nothing is mid-flight in code right now. The active work is planning-only:
  `roadmap-handoff-v0.4.41-plan.md` (Rewards & History panel + HUD
  live-data pills).

## Frontend backlog count

**17** unchecked items remain in `docs/roadmap.md`'s incremental backlog.
See the snapshot table in that file for status tags. Summary:

| Bucket | Count | Examples |
|---|---|---|
| Unblocked next | 0 | Slice A of v0.4.41-plan is code-ready but not yet claimed |
| Needs more design | 7 | Micro-Skib, Cool Play, Difficulty Function, Mosaic L7+, Broth Slip, HUD live-data pills (Slice B), Rewards & History panel design nuances |
| Blocked on Ken | 3 | Audio 2 clips, Yoodeling Unc photo, distinct runner poses |
| Large / later | 4 | Content pack, Intro cinematic, Multiplayer, Rebalancing remainder |
| Small polish | 2 | Cosmetic shop sink, menu brag stat |

## Open questions Ken can answer in a vibes session

Copy these into chat if Ken wants to steer without coding:

1. **Parody warning placement** — footer on main menu vs small "Legal /
   Parody" modal vs first-run only? (`v0.4.39` defaults to least-new-UI:
   compact menu footer + issues link).
2. **Death log display** — show raw `sessionSheebDelta` / `sessionSkreemDelta`
   as signed numbers, or human labels ("+12 sheebs this run")?
3. **Shart Knocker** — allow fart during `close-call-freeze`, or chase-only?
   Nearest chaser vs directional cone?
4. **Gameplay Rebalancing** — gun hit +25 and badge +50 still open; close-call
   +50 and pickup +5 already shipped in v0.4.37. Want the rest in one slice or
   split?
5. **Mosaic map dimension shift** — floor trap vs held item to trigger? (See
   `level-progression-and-endgame-plan.md` Flag item 7.)
6. **Auto-tune difficulty** — rolling deaths/sheebs window size and economy
   floor/ceiling values (`difficulty-mechanics-plan.md` Auto-tuning section).
7. **Runner pose duplicates** — supply distinct photos or collapse pool to 3
   unique poses?
8. **Yoodeling Unc second pose** — drop `images/yoodelling-unc-alex-2.png`
   when ready.

## What a planning session should produce

- Updates to `docs/roadmap.md` / `docs/future-versions.md` only (no
  `frontend/src/` changes).
- Extend or correct an existing `-plan.md` rather than spawning a parallel
  version unless the queue truly moved on.
- Append `docs/version-log.md` + `docs/handoffs/ledger.md`.
- Refresh `docs/update-directions.md` current-state bullet.
- End with a fenced copy-paste block for the next coding or planning agent.
- **Commit** before stopping (`docs/` only).

## Copy-paste: fresh planning agent window

```text
Mode A only — no code, no build, no deploy.

Read AGENTS.md, docs/skib-sdlc.md, docs/update-directions.md,
frontend/src/version.js, docs/roadmap.md, docs/future-versions.md,
docs/next-agent-planning-brief.md.

Ken wants planning / vibes / research. Current shipped version is v0.4.40.
Open planning handoff: docs/handoffs/roadmap-handoff-v0.4.41-plan.md
(Rewards & History panel + HUD live-data pills). Slice A is code-ready;
Slice B is blocked on a decision from Ken (see that file).

Before writing new plans, check git log and version.js — docs may be
stale relative to parallel coding sessions.

If Ken answers an open question from the planning brief, record the
decision in the relevant spec doc and the active -plan.md; do not mark
items unblocked for coding unless Ken actually answered in this chat.

Deliverables: updated docs only, ledger + version-log append, commit,
and copy-paste instructions for the next agent.
```
