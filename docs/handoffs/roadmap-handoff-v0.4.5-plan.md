# Roadmap Handoff — v0.4.5-plan (docs-only)

**Session date:** 2026-07-26
**Previous version:** v0.4.4 (see `docs/handoffs/roadmap-handoff-v0.4.4.md`);
latest docs-only planning pass before this was v0.4.3-plan.

This session was explicitly docs/plan-only. No code changed, no build was
run, and `GAME_ITERATION` stays `v0.4.0`. The goal here is to make the
next coding session's "funny interlude" request concrete enough that the
engineer can pick it up cold without re-interpreting the joke.

## What this session did

1. **Scoped a new near-capture interlude.**
   - The requested beat is not a new death screen. It is a short, funny
     pause-card that fires when a skib gets *too close* to Jayden.
   - The image to use is already in the repo at
     `frontend/src/assets/jayden-getting-captured.jpg`.
   - The text should be a small randomized caption pool built from the
     user's parody lines, starting with the supplied `Noob-noob no no!!!`
     / `Thanks, Noob-Noob. This guy gets it.` style jokes.
   - The interlude should pause the chase, show the image full-screen,
     then return to gameplay after a short beat. The normal caught /
     jump-scare path stays the real fail state.
2. **Added the feature to the backlog.**
   - Inserted a dedicated roadmap item in `docs/roadmap.md` so the next
     coding session can treat this as its own increment instead of
     smuggling it into the runner pose mapping or the death-visual work.
3. **Started this handoff file and the matching ledger entry.**

## Verification performed

- None required. This was docs-only planning, but the source references
  were checked against the current code so the plan names the right
  hooks:
  - `frontend/src/GameEngine.js` already has a phase-driven chase loop,
    a caught state, and canvas-drawn overlay helpers.
  - `frontend/src/App.jsx` already owns the existing lvl2 overlay state
    pattern that can be mirrored if the interlude needs a DOM-level flag.
  - `frontend/src/dialog.js` is still the single place where on-screen
    text pools live, which makes it the right home for any new parody
    caption array.

## What's explicitly not done

- No `GameEngine.js`, `App.jsx`, `dialog.js`, or asset changes.
- No new phase or overlay behavior implemented yet.
- No `GAME_ITERATION` bump, no build, no deploy.

## Copy-paste: next natural steps for the next agent

```
Read docs/skib-sdlc.md, then docs/update-directions.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.5-plan.md).

Implement the new funny near-capture interlude as a single front-end
increment:

1. The trigger should happen when a skib gets close enough to feel like
   a near-capture, but before the real caught/collision path fires.
2. Pause the chase, show frontend/src/assets/jayden-getting-captured.jpg
   full-screen, and overlay one short parody caption from a small random
   pool (the user's supplied "Noob-noob no no!!!" / "Thanks, Noob-Noob.
   This guy gets it." style lines are the tone target).
3. Keep the existing caught/jump-scare state as the actual death/fail
   path; this interlude is a comedic beat, not a replacement for
   capture.
4. Prefer the existing phase/state pattern in frontend/src/GameEngine.js
   for the pause/card, and keep any new caption pool in
   frontend/src/dialog.js so the text stays centralized.
5. Verify with `cd frontend && npm run build`, then drive the canvas for
   real to confirm the card appears at the right time and the run
   resumes cleanly afterward.

After implementing, update docs/version-log.md, docs/update-directions.md,
docs/roadmap.md, a new docs/handoffs/roadmap-handoff-vX.Y.Z.md, and
docs/handoffs/ledger.md, then commit the work. Do not bump
GAME_ITERATION or deploy unless the user explicitly asks to publish.
```
