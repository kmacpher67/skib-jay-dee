# Roadmap Handoff — v0.4.21-plan

**Session mode:** Mode A (Planning only)

This plan queues the next unblocked item: "Deaths history log". This touches UI and cookies, kept separate from v0.4.20's engine changes.

## What's explicitly not done yet (Code Monkey target)

The following block is ready for `./scripts/run_code_monkey.sh docs/handoffs/roadmap-handoff-v0.4.21-plan.md`.

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent. Your task is to implement the Deaths History Log in the UI.

1. **Update cookies.js**:
   - In `frontend/src/lib/cookies.js`, in `normalizeProfile()`, ensure a new array `deathsHistory` (default `[]`) is part of the profile.
   
2. **Update App.jsx UI**:
   - In `frontend/src/App.jsx`, locate the "Deaths: {profile.deaths}" pill (around line 415) in the top-right menu.
   - Make it clickable (`onClick`). When clicked, open a small modal or panel called `DeathsModal` (you can create `frontend/src/components/DeathsModal.jsx` modeled after `VersionModal.jsx`).
   - The modal should list the last N deaths (e.g. up to 10 from `profile.deathsHistory`). If empty, show "No deaths yet." Each entry should show the timestamp and level name.

3. **Update GameEngine integration in App.jsx**:
   - In `App.jsx`, update `handleDeath(nextDeaths)` to also receive the level name where the death occurred, and push a record `{ timestamp: Date.now(), levelName }` to `deathsHistory`.
   - Ensure `GameEngine.js` passes the level name in the `onDeath` callback if needed, or if `App.jsx` already knows the current level, use that.

Verification:
- Run `cd frontend && npm run build` and `npm run test:e2e` to ensure nothing is broken.
- Verify the Deaths modal opens and shows the history.

Once done:
- Update `docs/handoffs/roadmap-handoff-v0.4.21.md` with your results (using roadmap-handoff-v0.4.0.md as a template).
- Update `docs/roadmap.md`, `docs/update-directions.md`, and `docs/handoffs/ledger.md`.
- Bump `GAME_ITERATION` to `v0.4.21` in `frontend/src/version.js`.
- Commit your changes.
```
