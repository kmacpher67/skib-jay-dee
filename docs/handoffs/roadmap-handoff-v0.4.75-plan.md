# Roadmap Handoff Plan v0.4.75 — Top HUD Bar Layout Fix + Audio Overlay Refinement

**Created by:** Codex GPT-5 — 2026-08-07
**Created on:** 2026-08-07
**Last updated by:** Codex GPT-5 — 2026-08-07
**Session mode:** Mode A (Planning / refinement only — docs only, no code,
no build, `GAME_ITERATION` not bumped)
**Mode impact:** `Both — shared`

## Why this doc exists

Ken surfaced a screenshot-level UI problem: the top HUD bar leaves a
white/empty strip that wastes portrait space and can overlap the live HUD
labels (`CREEMS`, `SHEEBS`, `LEVEL`, and the `WARD` badge). At the same
time, there is a closely related audio idea for a richer state-reactive
overlay layer.

The layout issue is ready to become a small code slice. The audio idea is
close, but it still needs a clearer asset list and a tighter trigger /
mix decision before anyone should wire it in.

## Recommended shape

1. **Fix the top HUD bar layout first.**
   - Audit the top HUD container in the menu/game shell and remove dead
     width/padding that is creating the empty strip.
   - Keep the live status pills readable at phone widths and fullscreen
     widths.
   - Preserve the portrait 9:16 feel; this should be a cleanup of the
     existing shell, not a re-layout of the whole game.
   - Verify the `WARD` badge does not collide with the stat pills on
     smaller portrait screens.
2. **Treat the audio overlay as a follow-on refinement, not a brand-new
   sound system.**
   - The intended behavior is a background / ambient layer that reacts to
     game state, with cues for:
     - level start,
     - near-miss,
     - low health / high-risk state.
   - Keep the global mute toggle authoritative. If a settings screen is
     added later, mirror that state there, but do not introduce a second
     mute concept.
   - Start with a small mix pass, not a full audio mixer UI: one ambient
     bed plus short event stingers is enough for the first slice.
   - Asset sourcing still needs a human decision. Use this as a
     refinement checkpoint, not a promise that the right clips already
     exist.

## Current state

- `docs/roadmap.md` already has the live HUD issue called out as GitHub
  issue `#1`.
- The same roadmap experiment also captured the audio sub-item, but it
  has not yet been separated into a code-ready slice.
- `frontend/src/App.jsx` already owns the main shell / HUD placement,
  which makes this a good fit for a focused UI pass instead of a broader
  engine rewrite.
- `frontend/src/GameEngine.js` already has the game-state hooks this
  audio pass would hang off of, but the actual asset and mix plan is not
  yet pinned down.

## Why this is better than leaving the current layout alone

- The top strip becomes useful again instead of dead whitespace.
- The player can read the live stats without the HUD fighting itself.
- The audio idea stays aligned with the actual game states already in
  code, instead of growing into a generic sound-system project.
- The next coding agent gets a small, concrete UI fix and a separate
  refinement-gated audio brief instead of one fuzzy mega-item.

## Files likely touched

- `frontend/src/App.jsx` — top HUD shell / placement adjustments, and the
  eventual audio trigger wiring if the follow-on slice is cleared.
- `frontend/src/App.css` — layout, spacing, and responsive top-bar rules.
- `frontend/src/GameEngine.js` — likely only for the later audio
  triggers / hooks, not the layout fix.
- `frontend/src/assets/audio/` — only if the audio pass lands with
  concrete clips.
- `docs/audio-recording-brief-for-alex.md` — source-audio recording brief
  for the human/voice pass.
- `docs/roadmap.md` / `docs/future-versions.md` / `docs/update-directions.md`
  / `docs/version-log.md` / `docs/handoffs/ledger.md` — keep the plan
  and backlog trail current.

## Explicitly not done

- No code changes yet.
- No `GAME_ITERATION` bump.
- No deploy.
- No audio asset recording or sourcing decision.
- No new settings screen.

## Refinement needed before the audio slice is code-ready

The following should be pinned down before anyone treats the audio
overlay as a bounded implementation slice:

- Which clips are the actual source of truth?
- Is the ambient layer chase-only, or does it also play in menu/game
  transitions?
- What are the rough mix levels for ambient vs. stingers?
- Should the existing mute control be mirrored anywhere else, or is the
  current menu/HUD toggle enough?
- If there is no new asset list yet, should the next agent defer the
  audio piece and only land the HUD layout fix?

## Copy-paste: next coding session

```text
Read docs/skib-sdlc.md, then docs/update-directions.md, then
docs/handoffs/roadmap-handoff-v0.4.75-plan.md, then docs/roadmap.md.

Implement the top HUD bar layout fix first:

1. Audit the top HUD container in frontend/src/App.jsx and frontend/src/App.css.
2. Remove the dead whitespace / excess padding that creates the empty white strip.
3. Keep the live status labels readable and non-overlapping at portrait phone width and fullscreen width.
4. Verify the WARD badge no longer collides with CREEMS / SHEEBS / LEVEL.
5. Smoke-test the layout in the browser after `cd frontend && npm run build`.

If and only if the audio overlay item has been refined enough to proceed,
use the same session to:

6. Add a small ambient layer tied to game state (level start / near-miss /
   low health).
7. Keep the existing mute toggle authoritative; do not add a second mute system.
8. Start with a minimal mix pass rather than a full settings UI.

Do not bump GAME_ITERATION or deploy.
Do not invent audio assets or settings behavior that Ken has not confirmed.
```
