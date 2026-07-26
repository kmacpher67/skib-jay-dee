# Roadmap Handoff — v0.4.17-plan

**Session date:** 2026-07-26
**Previous version:** v0.4.16 (see `docs/handoffs/roadmap-handoff-v0.4.16.md`).

This was a Mode A planning session. The user requested to plan out environmental traps for the "Dad Case" chaser — specifically a visual darkening overlay and a sound effect (like a slamming door or light switch) when he spawns as an extra chaser.

## What this session did

1. **Scoped the Dad Case environmental trap feature:** 
   - When Dad Case spawns via the multi-chaser mechanic (`_maybeSpawnExtraChaser()`), a visual darkening overlay and a sound effect will trigger to simulate the lights being turned off.
2. **Created the implementation plan:**
   - Modify `GameEngine.js` to send the `faceId` in the `onExtraChaserSpawn` payload.
   - Update `App.jsx` to listen for the `faceId`. If it's `'dad-case'`, trigger a `dadCaseSpawned` state and play the sound effect.
   - Add a CSS overlay (e.g., `.dad-case-darkness`) in `index.css` that conditionally renders based on the `dadCaseSpawned` state.
3. **Updated the backlog:** Added this feature to the incremental backlog in `docs/roadmap.md`.
4. **Updated the ledger:** Added a v0.4.17-plan entry to `docs/handoffs/ledger.md`.

## Open Questions (Requires Ken's Input)

- We need a sound effect asset for the "slamming door" or "light switch" (e.g., `dad-case-lights-out.mp3`). Ken, please drop this asset into `frontend/src/assets/audio/` so the next agent can wire it up, or let us know if we should use a placeholder for now.

## Copy-paste: next natural steps for the next agent

```text
Read docs/skib-sdlc.md (Mode B), then docs/update-directions.md, then docs/roadmap.md, then this file (docs/handoffs/roadmap-handoff-v0.4.17-plan.md).

The next unclaimed items in the backlog include:
1. **Dad Case Environmental Traps:** Implement a visual darkening overlay and a sound effect when Dad Case spawns.
   - Modify `_maybeSpawnExtraChaser()` in `frontend/src/GameEngine.js` to pass `faceId` in `onExtraChaserSpawn`.
   - Update `App.jsx` to listen for `faceId === 'dad-case'` and trigger a `.dad-case-darkness` CSS overlay (in `index.css`) and play a sound effect (check if Ken added an asset in `frontend/src/assets/audio/`, else use a placeholder).
2. **Version page:** Add a simple page/panel to the menu showing the current `GAME_ITERATION` plus a short changelog.
3. **Game identity & new profiles:** Let a player keep their existing profile and start a new one (multiple save slots).

Unless the user explicitly asks for the Version page or profiles, pick the Dad Case Environmental Traps task first since it was just planned.

Verify with `cd frontend && npm run build && npx playwright test`.
Update docs/version-log.md, docs/update-directions.md, docs/roadmap.md, docs/handoffs/ledger.md, and commit. Bump GAME_ITERATION and deploy only once verified working locally.
```
