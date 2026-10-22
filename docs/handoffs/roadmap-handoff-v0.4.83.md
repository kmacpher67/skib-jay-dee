# Roadmap Handoff v0.4.83 — Pac-Man Tunnel Egg, Slice 1

**Created by:** Claude Sonnet 5.5 — 2026-10-22
**Created on:** 2026-10-22
**Last updated by:** Claude Sonnet 5.5 — 2026-10-22
**Session mode:** Mode B (code and delivery)

Executes Slice 1 of `roadmap-handoff-v0.4.83-plan.md` (GitHub issue #8).

## What Landed

- Egg roll, always-place after discovery, boosted roll with badge `waka-waka-flush`, wall-safe placement.
- Activation: tunnels, `levelTimeBonus` +20s, first-time badge.
- Runner-only wrap on per-level `tunnelRows`, 0.3s lockout. Canvas placeholders.
- Tests: `frontend/e2e/pacman-tunnel.spec.js`; full suite 89 passed, 1 skipped.

## Notes

- Difficulty keys are `noob` / `casual` / `4chan-st` (plan said "hardcore").
- The +50 sheebs comes from the existing first-time badge payout in `App.handleBadgeEarned`; the engine does not add sheebs itself (avoids double pay).
- `tunnelRows` are center-y bands (`{y, h: 20}`) chosen by scanning for wall-free edge columns; Level 4's only clear lane is near the top (y~120).
- Tunnels are not mandatory; the 40px runner wraps only when pressing into the edge on a tunnel row.

## Not Done

- Slice 2: captions in three difficulty pools, placeholder chime/whoosh, Play Recap line, players-guide entry.
- Slice 3: Alex's art/audio. Chaser tunnel use (unanswered), up/down portal, #10 countdown.
- Issue #8 stays open.

## Copy-paste: next coding session (Slice 2)

```text
Work in Mode B. Read docs/skib-sdlc.md, docs/handoffs/roadmap-handoff-v0.4.83.md
and -v0.4.83-plan.md. Implement Slice 2 of issue #8 only: three-pool captions
(noob/casual/4chan-st; ask Ken for copy if not provided), placeholder chime and
whoosh via the Boom Stick E mute-respecting playOneShot path, Play Recap line,
docs/players-guide.md entry. Verify with cd frontend && npm run build && npx playwright test.
Then docs, bump GAME_ITERATION, commit, deploy ./scripts/deploy-static.sh pacman-presentation, comment on #8 (keep open).
```
