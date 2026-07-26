---
code_monkey_backend: ollama
code_monkey_model: qwen3:8b
done_condition_cmd: cd frontend && npm run build
---

# Roadmap Handoff — v0.4.12

**Session date:** 2026-07-26
**Previous version:** v0.4.11 (see `docs/handoffs/roadmap-handoff-v0.4.11-plan.md`)

This session tackled the near-capture interlude item from the v0.4.5-plan backlog. 

## What this session did

1. **Implemented the near-capture interlude.**
   - Created a new phase `'near-capture'` in `frontend/src/GameEngine.js`.
   - The trigger fires when a chaser gets closer than 100 pixels (`dist < 100`), pausing the action.
   - Shows `jayden-getting-captured.jpg` full-screen overlaid with a random caption from a new `NEAR_CAPTURE_LINES` pool.
   - The pause lasts 2.5 seconds, then resumes the chase.
   - Added a `nearCaptureCooldown` of 15 seconds to prevent spamming the player.
2. **Updated Dialog Pool.**
   - Added `NEAR_CAPTURE_LINES` to `frontend/src/dialog.js` containing parody captions.
3. **Verified the functionality.**
   - Built the game successfully and checked Playwright test passes.

## What's explicitly not done

- Did not work on Audio 2: 1:1 capture/bark voice clips, as Ken needs to record voice clips first.
- Did not bump `GAME_ITERATION` or deploy.
- Did not fix the duplicate poses for Jayden in `RUNNER_FACE_POOL` (still needs Ken's new images).

## Copy-paste: next natural steps for the next agent

```
Read docs/skib-sdlc.md, then docs/update-directions.md, then this file (docs/handoffs/roadmap-handoff-v0.4.12.md).

Check docs/roadmap.md for the next open backlog item. Note:
- Audio 2 is blocked on the user providing voice clips. 
- The custom runner poses are blocked on the user providing images.
- A good candidate might be starting on the World Star intro cinematic or the face crop on upload, but confirm with the user first.

Follow the standard process: implement one small feature, verify, update docs, and commit.
Do not bump GAME_ITERATION or deploy unless asked.
```
