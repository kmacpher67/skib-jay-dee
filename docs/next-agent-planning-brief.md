# Next Agent Planning Brief — Skib-Jay-Dee-Toilet

**Created by:** Claude Sonnet 5 — 2026-07-27
**Last updated by:** Composer — 2026-07-27

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
5. `docs/roadmap.md` — incremental backlog (frontend snapshot at top).
6. `docs/future-versions.md` — parked work not yet queued.
7. Active handoffs in `docs/handoffs/`:
   - **Current coding queue:** `roadmap-handoff-v0.4.48-plan.md` (Gameplay
     Rebalancing — unblocked) → `roadmap-handoff-v0.4.50-plan.md` (cosmetic
     sink) → `roadmap-handoff-v0.4.49-plan.md` (Broth Slip — Ken confirm).
   - **Blocked on Ken:** `roadmap-handoff-v0.4.41-plan.md` Slice B (HUD
     pills) and Pickup/Play Recap addendum; `roadmap-handoff-v0.4.43-plan.md`
     (LT roadmap).
8. Design tracks (vibes / not ready to code):
   - `docs/difficulty-mechanics-plan.md` — Method C / Debt Lock.
   - `docs/level-progression-and-endgame-plan.md` — Level 7+ / Level 10
     reconciliation / Mosaic map.

## Current production state (2026-07-27)

- `GAME_ITERATION`: **v0.4.47** (Rod of Poopdom). Confirmed in
  `frontend/src/version.js`.
- Last shipped: v0.4.47 → v0.4.46 (menu footer) → v0.4.45 (Player's Guide
  link) → v0.4.43 (Player's Guide modal, superseded).

## Frontend backlog count

**15** unchecked items in `docs/roadmap.md`. See snapshot table there.

| Bucket | Count | Examples |
|---|---|---|
| Unblocked next | 2 | Gameplay Rebalancing, cosmetic shop sink |
| Specced — Ken confirm | 1 | Broth Slip |
| Design-only / TBD | 7 | Difficulty Function, Cool Play, Micro-Skib, Mosaic L7+, HUD Slice B, Pickup/Play Recap, content pack |
| Blocked on Ken | 3 | Audio 2, Yoodeling Unc photo, runner pose duplicates |
| Large / later | 2 | Intro cinematic, Multiplayer |

## Open questions Ken can answer in a vibes session

1. **Broth Slip tuning** — confirm defaults in `roadmap-handoff-v0.4.49-plan.md`
   (spawn chance, trail lifetime, Level 5+ gate).
2. **Rewards HUD pills (Slice B)** — cosmetic label fix (a) vs. real
   difficulty-linked modifiers (b)? (`v0.4.41-plan`)
3. **Play Recap** — placement vs. post-kill card, modal tabs vs. new pill,
   tone for bad pickups (`v0.4.41-plan` addendum).
4. **Cool Play / Micro-Skib** — pick MVP slice from `v0.4.48-plan` refinements.
5. **LT roadmap** — Level 10 vs Level 7 climax, Role Reversal scope (`v0.4.43-plan`).
6. **Mosaic dimension shift** — floor trap vs. held item (`level-progression-and-endgame-plan.md`).
7. **Runner pose duplicates** — new photos or collapse pool to 3?
8. **Gameplay Rebalancing** — OK to ship the numbers in `v0.4.48-plan` as-is?

## What a planning session should produce

- Updates to `docs/` only (no `frontend/src/` changes).
- Extend or correct an existing `-plan.md` rather than spawning parallel
  versions unless the queue truly moved on.
- Append `docs/version-log.md` + `docs/handoffs/ledger.md`.
- Refresh `docs/update-directions.md`.
- End with a fenced copy-paste block for the next agent.
- **Commit** before stopping.

## Copy-paste: fresh planning agent window

```text
Mode A only — no code, no build, no deploy.

Read AGENTS.md, docs/skib-sdlc.md, docs/update-directions.md,
frontend/src/version.js, docs/roadmap.md, docs/next-agent-planning-brief.md.

GAME_ITERATION is v0.4.47. Open coding handoff:
docs/handoffs/roadmap-handoff-v0.4.48-plan.md (Gameplay Rebalancing).

If Ken answers an open question, record it in the relevant -plan.md — do not
mark items unblocked unless Ken actually answered in this chat.

Deliverables: updated docs only, ledger + version-log append, commit.
```
