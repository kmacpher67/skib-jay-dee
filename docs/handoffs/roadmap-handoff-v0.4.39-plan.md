# Roadmap Handoff Plan v0.4.39

**Created by:** Codex (GPT-5) — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-27
**Session mode:** Mode A (Planning - docs only, no code changes)

This is a Mode A planning pass. It refines the next code slice so the
death-log telemetry work stays separate from the broader difficulty
design track.

## What this planning pass decided

1. **Enhanced Death Logs should record raw telemetry, not a blended score.**
   - Persist `timePlayed` for each capture record.
   - Persist the raw run deltas as separate fields:
     - `sessionSheebDelta`
     - `sessionSkreemDelta`
   - Keep the died-on level explicit in the record so the Deaths modal
     can show it without guessing from nearby state.
   - Legacy profiles that do not have the new fields must render
     gracefully.
2. **Parody Warning & Feedback Link stays in the same slice.**
   - Add a clear parody / fair-use warning in the main menu or a small
     settings surface.
   - Add a GitHub issues link for complaints and feedback.
3. **Difficulty math is intentionally parked.**
   - The preferred future direction is `Method C (The Debt Lock)` plus a
     lightweight starting selector.
   - That work should live in `docs/difficulty-mechanics-plan.md`, not in
     the death-log telemetry handoff.

## What the next code session should do

1. Update the death-history payload in `frontend/src/lib/cookies.js` so
   new capture records can store the raw telemetry fields above.
2. Update `frontend/src/GameEngine.js` only as needed to populate those
   fields when a capture happens.
3. Update `frontend/src/components/DeathsModal.jsx` so it renders the new
   values and degrades cleanly when an old save slot lacks them.
4. Update `frontend/src/App.jsx` to add the parody / fair-use warning and
   the GitHub issues link.
5. Leave the difficulty balance math, selector UI, and debt-lock tuning
   untouched in this slice.

## Addendum — 2026-07-27 (Claude Sonnet 5): difficulty auto-tuning reviewed, still parked

Ken raised a follow-up design question in a vibe-discussion session: should
the debt-lock difficulty track become a rolling deaths/sheebs-earned
auto-tuner (an outside AI proposed a dedicated `DifficultyManager` class)?
Reviewed and evaluated — see the new "Auto-tuning refinement" section in
`docs/difficulty-mechanics-plan.md` for the full writeup. Short version:

- The rolling ratio signal is good; the `DifficultyManager` class is not —
  extend Method C's existing knobs instead of adding a new subsystem.
- Preferred lever is the run's economy (pickup odds / payouts), not
  chaser speed/AI, so the chase itself stays fully predictable/learnable.
- Per-level floors reuse the existing `CHASER_SPEED_MOD_MIN/MAX`-style
  clamp pattern, applied to the economy knob instead.
- Rolling-window size and exact floor/ceiling values are still TBD.

This does **not** change the scope of this handoff — Enhanced Death Logs
and the parody warning/feedback link are still the only unblocked slice.
The difficulty math, including this refinement, stays parked until a
future planning pass turns it into its own bounded handoff.

Also reviewed the parked **Level 7+ Mosaic Map of Madness** concept in
`docs/level-progression-and-endgame-plan.md` (unrelated to difficulty
math, but reviewed the same session): found and flagged one real open
question that a prior planning pass left unanswered (floor trap vs. held
item to trigger a dimension shift) rather than letting it get silently
assumed later. See that doc's "Flag for Ken" item 7.

## Explicitly not in scope

- No balancing changes to the debt-lock difficulty system.
- No attempt to turn the death log into a single synthetic "score"
  metric.
- No `GAME_ITERATION` bump, build, or deploy in this planning pass.

---

## Copy-paste: next coding agent

```text
Read docs/skib-sdlc.md, then docs/update-directions.md, then
docs/roadmap.md, then docs/difficulty-mechanics-plan.md, then this file.

Your slice is only:
1. Enhanced Death Logs: persist and render raw telemetry fields for each
   death record (`timePlayed`, `sessionSheebDelta`, `sessionSkreemDelta`,
   and the death level). Make sure legacy profiles without the new
   fields still render cleanly.
2. Parody Warning & Feedback Link: add the parody/fair-use warning and a
   GitHub issues link in the main menu or a compact settings surface.

Do NOT touch the difficulty math or selector UI in this pass. The debt
lock / starting-selector work is parked in
docs/difficulty-mechanics-plan.md.

Verification:

- cd frontend && npm run build
- cd frontend && npx playwright test

After the code lands, update docs/version-log.md, docs/update-directions.md,
docs/roadmap.md, docs/handoffs/ledger.md, and generate the shipped
handoff if this becomes a real code session. Do not bump GAME_ITERATION
or deploy unless the user explicitly asks.
```
