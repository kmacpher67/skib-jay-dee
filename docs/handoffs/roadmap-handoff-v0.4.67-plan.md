# Roadmap Handoff Plan v0.4.67 — Badge Award Counts / Repeat-Award History

**Created by:** Codex GPT-5 — 2026-07-28
**Session mode:** Mode A (Planning / refinement only — docs only, no code,
no build, `GAME_ITERATION` not bumped)

## Why this doc exists

Ken asked for a new planning pass to make badge / token awards countable
instead of just binary. Right now `earnedBadges` only answers “has this
badge ever been earned?”, not “how many times has it been awarded?”

This handoff keeps the existing unique-unlock behavior intact and scopes a
small, code-ready slice to add award counts / repeat-award history without
rewriting the badge system.

## Current state

- `profile.earnedBadges` is still the unique unlock set. It should stay
  that way so progression checks and quest gating do not change.
- `rewardsHistory` already exists and is the right precedent for a
  timestamped reward log, but it currently only reflects single-event
  badge earns and purchases.
- The only directly related backlog item that is already code-ready is
  **Pickup-consumption tracking + Play Recap** in
  `roadmap-handoff-v0.4.62-plan.md`. Keep that separate. It shares the
  rewards/history family, but it is a distinct slice and should not be
  merged into this handoff.

## Decision for this slice

1. **Add a persisted badge-award count structure.**
   - Use a new profile field, `badgeAwardCounts`, keyed by badge id.
   - Keep it additive and backwards-compatible: default to an empty object
     on older profiles.
   - Do not change `earnedBadges` dedupe / unlock semantics.
2. **Show a tiny count surface in the existing rewards area.**
   - Keep the UI lightweight.
   - Recommended surface: a compact “Badge awards: N” summary in the
     existing rewards/history area, with per-badge counts available for
     future expansion.
   - If a badge count is greater than `1`, a small `xN` treatment can be
     added later, but this slice does not need a new modal.
3. **Keep the rest of the rewards stack separate.**
   - Do not fold Play Recap into this slice.
   - Do not change the `rewardsHistory` schema in this slice unless it is
     required for the count display.

## Files likely touched

- `frontend/src/lib/cookies.js` — add `badgeAwardCounts` to the normalized
  profile shape and preserve it on load/save.
- `frontend/src/App.jsx` — increment badge counts at the existing badge
  award point and feed a tiny summary into the menu/rewards surface.
- `frontend/src/components/RewardsHistoryModal.jsx` or the existing menu
  badge area — show the count summary in the smallest possible surface.
- `docs/profiles-and-identity.md` — document the new field.
- `docs/badges.md` — clarify that `earnedBadges` remains the unique set
  while counts live separately.
- `frontend/e2e/` — add a focused test that seeds or simulates a profile
  with repeated badge counts and verifies the summary renders.

## Explicitly not done

- No code changes yet.
- No `GAME_ITERATION` bump.
- No deploy.
- No merge with the Play Recap slice.
- No redesign of the existing badge unlock logic.

## Copy-paste: next coding session

```text
Read docs/skib-sdlc.md, then docs/update-directions.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.67-plan.md), then
docs/roadmap.md and docs/badges.md, then
docs/profiles-and-identity.md.

Implement badge award counts without changing unlock behavior:

1. Add a new persisted profile field, `badgeAwardCounts`, defaulting to
   an empty object on older saves.
2. Keep `profile.earnedBadges` as the unique unlock set. Do not change
   badge gating or quest logic.
3. Increment the appropriate badge count whenever the badge-award path
   fires, and keep the existing `rewardsHistory` behavior intact unless a
   small metadata addition is needed for the summary UI.
4. Surface a minimal count summary in the existing rewards area
   (preferred: compact “Badge awards: N” readout).
5. Add one focused Playwright check that verifies the count summary
   renders from a seeded profile or simulated award path.
6. Verify with `cd frontend && npm run build` and `npx playwright test`.

Do not pull in Play Recap; it stays in roadmap-handoff-v0.4.62-plan.md.
Do not bump GAME_ITERATION or deploy.
```
