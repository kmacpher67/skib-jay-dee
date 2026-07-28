# Roadmap Handoff Plan v0.4.68 — Level 4 Warning Audio Pass

**Created by:** Codex GPT-5 — 2026-07-28
**Session mode:** Mode A (Planning / refinement only — docs only, no code, no build, `GAME_ITERATION` not bumped)
**Status:** Code-ready planning slice. The three Level 4 warning clips are already in `frontend/src/assets/audio/`; the next coding agent should wire them into the existing Ramen Aisle warning overlay without changing gameplay flow.

## Trigger

Ken recorded three new clips for the Level 4 ("The Ramen Aisle") warning overlay:

- `level-4-warning-sting.mp3` — sting for the moment the warning overlay opens.
- `level-4-warning-voice.mp3` — voiceover that should play immediately after or alongside the sting.
- `level-4-accept-fate.mp3` — accept button cue for "I ACCEPT MY FATE".

The game already has a Level 4 warning overlay path in `frontend/src/App.jsx`, with existing audio helpers and a global mute toggle. This slice is just about wiring the new clips into that existing flow, not redesigning the overlay.

## Current state

- `frontend/src/App.jsx` already imports the existing audio assets, tracks global mute in `profile.muted`, and has reusable helpers for one-shot playback.
- The Level 4 warning is currently driven by `showLevel4Warning`, set from `handleLevelChange({ index })` when the player reaches Level 4 for the first time.
- `handleAcceptLevel4Warning()` is the right button-click hook for resuming the game after the warning.
- `docs/sound-effects-howto.md` already recommends preloading with the standard HTML5 `Audio` constructor and resetting `currentTime` before replay.

## Decision for this slice

1. **Use the existing App-level audio pattern.**
   - Import the three new URLs in `frontend/src/App.jsx`.
   - Instantiate them with the normal `Audio` constructor pattern already used elsewhere in the app.
   - Prefer a small helper or refs that match the existing audio style instead of inventing a new subsystem.
2. **Play the overlay-open sounds on the open transition, not on render.**
   - Trigger the sting and voice exactly when `showLevel4Warning` flips to `true`.
   - Do not fire them on every re-render of the overlay component.
   - Reset both clips with `currentTime = 0` before each play.
3. **Play the accept clip from the accept handler.**
   - `handleAcceptLevel4Warning()` should play `level-4-accept-fate.mp3` before the engine resumes.
   - Reset `currentTime = 0` before play so repeat runs still work cleanly.
4. **Respect the global mute toggle.**
   - If the profile is muted, skip all three plays.
   - Keep mute behavior consistent with the existing one-shot audio helpers.
5. **Keep scope tight.**
   - No audio ducking pass.
   - No volume-slider redesign.
   - No new level logic or overlay UX changes.

## Files likely touched

- `frontend/src/App.jsx` — import the three new URLs, add the play hooks, and wire the Level 4 warning open/accept paths.
- `frontend/src/assets/audio/level-4-warning-sting.mp3` — new asset already present.
- `frontend/src/assets/audio/level-4-warning-voice.mp3` — new asset already present.
- `frontend/src/assets/audio/level-4-accept-fate.mp3` — new asset already present.
- `frontend/e2e/level-4-warning.spec.js` or a nearby Playwright test — add a focused regression that proves the warning opens and the accept button still resumes play while the audio hooks are wired.
- `docs/version-log.md`, `docs/handoffs/ledger.md`, `docs/update-directions.md`, `docs/roadmap.md`, `docs/future-versions.md` — update the planning trail after the code lands.

## Explicitly not done

- No code changes yet.
- No `GAME_ITERATION` bump.
- No deploy.
- No audio ducking or mix balancing.
- No menu audio changes.
- No chaser/bark follow-up work from the broader audio backlog.

## Copy-paste: next coding session

```text
Read docs/skib-sdlc.md, then docs/update-directions.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.68-plan.md), then
docs/sound-effects-howto.md, then inspect the existing Level 4 warning
flow in frontend/src/App.jsx.

Implement the Level 4 warning audio pass:

1. Import the three new audio URLs in frontend/src/App.jsx:
   - frontend/src/assets/audio/level-4-warning-sting.mp3
   - frontend/src/assets/audio/level-4-warning-voice.mp3
   - frontend/src/assets/audio/level-4-accept-fate.mp3
2. Instantiate them with the same HTML5 Audio pattern the app already
   uses for one-shot clips.
3. Play the sting + voice exactly when showLevel4Warning flips to true
   (overlay open), not on every render.
4. Play the accept-fate clip inside handleAcceptLevel4Warning() before
   resuming the engine.
5. Respect the global mute toggle before calling play().
6. Reset currentTime = 0 before every play so repeated runs still start
   cleanly.
7. Add a focused regression test around the Level 4 warning overlay
   open/accept path if needed, then verify with:
   - cd frontend && npm run build
   - cd frontend && npx playwright test frontend/e2e/level-4-warning.spec.js
     (or the nearest warning overlay test if that file name changes)

Keep the scope strictly to the three warning clips. Do not change the
overlay text, the warning pause logic, or GAME_ITERATION.
```
