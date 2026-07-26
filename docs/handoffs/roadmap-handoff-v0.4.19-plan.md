# Roadmap Handoff — v0.4.19-plan

**Session date:** 2026-07-26
**Previous version:** v0.4.18-plan (see `docs/handoffs/roadmap-handoff-v0.4.18-plan.md`).

This was a Mode A planning session. Ken uploaded the audio files `door-sounds.m4a` and `lights.m4a` to `frontend/src/assets/audio/` to unblock the "Dad Case Environmental Traps" feature from the backlog. This session planned out the implementation.

## What this session did

1. Created the implementation plan for the Dad Case environmental trap audio effects.
2. Formatted the plan for a Code Monkey lane dispatch (or a Mode B session).

## Implementation Plan: Dad Case Environmental Traps Audio

This plan wires up the newly added audio assets (`door-sounds.m4a` and `lights.m4a`) for the Dad Case chaser.

### App Components
- **File:** `frontend/src/App.jsx`
- Import `door-sounds.m4a` and `lights.m4a` at the top of the file.
- Update `handleExtraChaserSpawn` to trigger `playOneShot()` for both audio assets when `faceId === 'dad-case'`. Play both simultaneously. 
- Remove the placeholder `<div className="dad-case-sound-text">*DOOR SLAM SOUND*</div>` since the real audio will play.

### CSS
- **File:** `frontend/src/index.css`
- Remove `.dad-case-sound-text` as it will no longer be used.

## Copy-paste: next natural steps for the next agent

```text
code_monkey_backend: ollama
code_monkey_model: thinkpad-local

Read docs/skib-sdlc.md (Mode B), then this file (docs/handoffs/roadmap-handoff-v0.4.19-plan.md).

We are implementing the Dad Case Environmental Traps Audio.
1. Modify `frontend/src/App.jsx` to import `door-sounds.m4a` and `lights.m4a` from `./assets/audio/`.
2. In `handleExtraChaserSpawn`, when `faceId === 'dad-case'`, call `playOneShot(doorSoundsUrl, 0.6)` and `playOneShot(lightsUrl, 0.6)`.
3. In `frontend/src/App.jsx`, remove the placeholder `<div className="dad-case-sound-text">*DOOR SLAM SOUND*</div>`.
4. In `frontend/src/index.css`, remove the `.dad-case-sound-text` CSS class.

Verify with `cd frontend && npm run build && npx playwright test`.
Update docs/version-log.md, docs/update-directions.md, docs/roadmap.md, docs/handoffs/ledger.md, and commit. Bump GAME_ITERATION and deploy only once verified working locally.
```
