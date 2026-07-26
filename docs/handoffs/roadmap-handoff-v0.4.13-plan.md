---
code_monkey_backend: ollama
code_monkey_model: qwen3:8b
done_condition_cmd: cd frontend && npm run build
---

# Roadmap Handoff — v0.4.13-plan

**Session date:** 2026-07-26
**Previous version:** v0.4.12 (see `docs/handoffs/roadmap-handoff-v0.4.12.md`).

This was a docs-only planning / RCA-scoping session, not a code session.
The ask was to capture the lvl2 transition bug more precisely: the video
still starts too early for the user's expectation, and gameplay can crash
shortly after the video plays. The next coding agent should treat this as
root-cause analysis first, behavior change second.

## What this session did

1. **Scoped the bug as an RCA item.**
   - Added a new open roadmap item in `docs/roadmap.md` describing the
     too-early lvl2 transition and the crash that can follow it.
   - Captured the target gate requested by the user: the lvl2 video
     should not play until the player has covered 80% of the map halls
     and survived 15 seconds with 4 simultaneous skibs.
2. **Updated the repo handoff docs.**
   - Added the RCA note to `docs/update-directions.md` so the next agent
     sees the issue immediately.
   - Appended a planning entry to `docs/version-log.md` and a flat
     summary line to `docs/handoffs/ledger.md`.
3. **Prepared the next coding brief.**
   - Created this handoff with a bounded copy-paste block that starts
     with reproduction and instrumentation before any user-facing gate
     change.

## What's explicitly not done

- No gameplay code changed.
- No build or Playwright run.
- No `GAME_ITERATION` bump.
- No deploy.
- No decision yet on whether the crash is in `App.jsx`, `GameEngine.js`,
  the overlay lifecycle, or the multi-chaser update loop.

## Copy-paste: next natural steps for the next agent

```
Read docs/skib-sdlc.md (Mode B), then docs/update-directions.md, then
docs/roadmap.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.13-plan.md).

This is RCA first, behavior change second. Reproduce the lvl2 crash in
the browser before you edit the gate.

Focus files:
- frontend/src/App.jsx
- frontend/src/GameEngine.js
- frontend/src/components/GameCanvas.jsx
- frontend/e2e/pipeworks-clear.spec.js
- frontend/e2e/lvl2-transition-clears-on-caught.spec.js

Do this in order:
1. Reproduce the too-early lvl2 video and the post-video crash, then add
   temporary logging or browser probes around phase changes, overlay
   mount/unmount, chaser count, and the clear path.
2. Decide where the crash actually lives: App overlay lifecycle,
   GameEngine level advance, or a multi-chaser state bug.
3. Implement the stricter gate only after the RCA confirms the correct
   fix. Target behavior: the lvl2 video must not play until the player
   has covered 80% of the map halls and survived 15 seconds with 4
   simultaneous skibs.
4. Add or adjust tests so the new threshold and the crash regression are
   covered.
5. Verify with `cd frontend && npm run build`, then `npx playwright
   test`, plus a manual browser check that the overlay stays hidden
   until the new gate is met and no crash follows playback.
6. Update docs/version-log.md, docs/update-directions.md,
   docs/roadmap.md, docs/handoffs/ledger.md, and commit. Do not bump
   GAME_ITERATION or deploy unless asked.
```
