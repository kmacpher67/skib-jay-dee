> **Correction (2026-08-11, Claude Sonnet 5, same day):** this plan's
> premise was wrong — Micro-Skib chaser and runner pose collapse were
> **already shipped in `v0.4.71`** (verified against real code in
> `GameEngine.js`/`gameContent.js`, not just doc claims), and Badge
> award counts were **already shipped in `v0.4.72`**. `docs/roadmap.md`
> had stale unchecked boxes for all three; corrected there. The real
> `v0.4.76` slot went to the Heavy Plunger rebalance instead (GitHub
> issue #2) — see `roadmap-handoff-v0.4.76.md`. Steps 1-3 of the
> "Recommended build order" below are stale; only step 4 (Play Recap)
> and step 5 (Debug State Dump) are still open. Do not act on the
> "Copy-paste: next coding session" block at the bottom of this file —
> it re-implements features that already exist.

# Roadmap Handoff Plan v0.4.76 - Ready Queue Refresh After v0.4.75

**Created by:** Codex GPT-5 - 2026-08-11
**Created on:** 2026-08-11
**Last updated by:** Codex GPT-5 - 2026-08-11
**Session mode:** Mode A (Planning / refinement only - docs only, no code,
no build, `GAME_ITERATION` not bumped)
**Mode impact:** `Runner only`

## Why this doc exists

`v0.4.75` already shipped the top HUD bar cleanup. The next useful step
is to rank the already-scoped, code-ready slices so the next coding
session has one obvious landing spot instead of re-deriving the queue.

This handoff is a queue refresh, not a new feature spec. The actual slice
details remain in the existing handoffs:

- `roadmap-handoff-v0.4.55-plan.md` - Micro-Skib chaser
- `roadmap-handoff-v0.4.56-plan.md` - runner pose collapse
- `roadmap-handoff-v0.4.72-plan.md` - badge award counts
- `roadmap-handoff-v0.4.62-plan.md` - pickup tracking + Play Recap
- `roadmap-handoff-v0.4.64-plan.md` - Debug State Dump

## Current state

- `GAME_ITERATION` is now `v0.4.75`.
- The top HUD bar complaint is functionally resolved in code.
- The related GitHub issue still has an open audio overlay sub-item, so
  do not treat issue `#1` as fully complete yet.
- The next code-ready slices are all small and bounded; none of them
  require a new Ken decision.

## Recommended build order

1. **Micro-Skib chaser** - `v0.4.55-plan.md`
   - Smallest counterpressure slice.
   - Also clears the false `VersionModal.jsx` changelog claim for
     `v0.4.55`.
2. **Runner pose collapse** - `v0.4.56-plan.md`
   - Small data cleanup.
   - Also clears the false `VersionModal.jsx` changelog claim for
     `v0.4.56`.
3. **Badge award counts / repeat-award history** - `v0.4.72-plan.md`
   - Adds a separate count layer without changing badge unlock behavior.
4. **Pickup-consumption tracking + Play Recap** - `v0.4.62-plan.md`
   - Completes the rewards/history family with the player-facing recap
     surface.
5. **Debug State Dump** - `v0.4.64-plan.md`
   - Support-only, no-SDK helper; useful when the team wants a manual
     diagnostic tool before bigger work.

## Why this order

- Micro-Skib and runner pose collapse are the cleanest way to pay down
  the false changelog debt before adding more gameplay surface.
- Badge counts and Play Recap both live in the rewards/history family,
  but they should stay as separate slices so each one stays small.
- Debug State Dump is useful, but it does not need to block the smaller
  gameplay cleanup items.

## Explicitly not done

- No code changes.
- No `GAME_ITERATION` bump.
- No deploy.
- No audio overlay implementation.
- No new gameplay design decisions.

## Copy-paste: next coding session

```text
Read docs/skib-sdlc.md, then docs/update-directions.md, then
docs/handoffs/roadmap-handoff-v0.4.76-plan.md, then
docs/handoffs/roadmap-handoff-v0.4.55-plan.md, then docs/roadmap.md.

Implement Micro-Skib first:

1. Replace one extra-chaser spawn, not an additive chaser.
2. Keep the Level 3+ gate, 65% hitbox, 0.85x speed, and placeholder
   sprite behavior from the handoff.
3. Verify with `cd frontend && npm run build && npx playwright test`.

If Micro-Skib ships cleanly, stop there and let the next coding session
pick up runner pose collapse from `roadmap-handoff-v0.4.56-plan.md`.
Do not bundle in badge counts or Play Recap in the same session.
Do not bump GAME_ITERATION or deploy.
```
