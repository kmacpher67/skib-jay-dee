# Roadmap Handoff — v0.4.25

**Session date:** 2026-07-26
**Previous version:** v0.4.24 (see `docs/handoffs/roadmap-handoff-v0.4.24.md`).

This was a Mode B implementation session that landed the post-kill
profile system and the clickable deaths log, using the fuller-scope
`v0.4.25-plan` as the source of truth. The older `v0.4.23-plan` is
superseded and kept only for historical context.

## What this session did

1. **Logged killer IDs in capture history:** `frontend/src/lib/cookies.js`
   now preserves `chaserId` in `deathsHistory`, and `frontend/src/App.jsx`
   stores the killer ID, level, and timestamp whenever a capture lands.
2. **Captured the exact chaser that made contact:** `frontend/src/GameEngine.js`
   now records the colliding chaser in `_triggerCaught()`, passes its
   `faceId` through `onDeath`, and exposes the caught chaser data to the
   UI once the jump-scare shake ends.
3. **Built a reusable profile card:** `frontend/src/gameContent.js`
   exports `CHASER_PROFILES`, and `frontend/src/components/ProfileModal.jsx`
   renders the reusable killer profile page used both after a fresh kill
   and when reopening a profile from the deaths log.
4. **Made the deaths log clickable:** `frontend/src/components/DeathsModal.jsx`
   now renders killer-ID pills that open the same profile modal on top of
   the log.
5. **Shipped it:** bumped `GAME_ITERATION` to `v0.4.25`, updated the
   version log/ledger/update-directions/roadmap docs, and kept the
   existing resume-countdown code path untouched as a separate gameplay
   feature.

## What was explicitly skipped

- Did not change the separate `resume-countdown` flow that already lives
  in `GameEngine.js`; the new post-kill profile screen now returns to the
  menu instead of chaining into that beat.
- Did not start the blocked `v0.4.26-plan` balance escalation work.
- Did not add any new backend or persistence layer beyond the existing
  cookie profile.

## Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test`

## Copy-paste: next natural steps for the next agent

```text
Read docs/skib-sdlc.md (Mode B), then docs/update-directions.md, then docs/roadmap.md, then docs/handoffs/roadmap-handoff-v0.4.26-plan.md.

The next unfinished handoff is v0.4.26-plan, but it is blocked on Ken's product decisions. Do not code it until the blockers in the handoff are answered.

When it becomes unblocked, implement the two Phase 7 risk/reward items:
1. allow negative sheebs above level 3, with whatever debt-display styling Ken approves;
2. allow captures above level 4 to strip a previously purchased shop item, with the warning/rebuy rules Ken confirms.

Verify with `cd frontend && npm run build && npx playwright test`.
Update docs/version-log.md, docs/update-directions.md, docs/roadmap.md, docs/handoffs/ledger.md, and commit. Bump GAME_ITERATION and deploy only once verified working locally.
```
