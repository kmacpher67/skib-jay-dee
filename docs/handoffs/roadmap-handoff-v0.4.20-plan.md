# Roadmap Handoff — v0.4.20-plan

**Session mode:** Mode A (Planning only)

This plan queues the next unblocked, low-hanging items from `docs/roadmap.md` that touch `frontend/src/GameEngine.js`. It is sized perfectly for a Code Monkey dispatch.

## What's explicitly not done yet (Code Monkey target)

The following block is ready for `./scripts/run_code_monkey.sh docs/handoffs/roadmap-handoff-v0.4.20-plan.md`.

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent. Your task is to implement the following changes in `frontend/src/GameEngine.js`.

1. **Remove dead `initialSheebs = 200` default**:
   - In `frontend/src/GameEngine.js` constructor arguments (around line 345), change `initialSheebs = 200,` to just `initialSheebs,`.

2. **Sheebs penalty on capture**:
   - In `frontend/src/GameEngine.js`, add a new constant `const DEATH_SHEEBS_PENALTY = 20` near `DEATH_SKREEM_PENALTY` (around line 313).
   - In the `_triggerCaught()` method (around line 983), where `skreemsLost` is calculated and subtracted, also calculate and apply the sheebs loss.
   - Example: 
     `const sheebsLost = Math.min(this.sheebs, DEATH_SHEEBS_PENALTY);`
     `this.sheebs -= sheebsLost;`
   - Only deduct sheebs if `this.sheebs > 0`. Never let sheebs go negative.

Verification:
- Run `cd frontend && npm run build` to ensure the syntax is correct.
- Since there is no explicit test for sheebs deduction yet, make sure the build passes.

Once done:
- Update `docs/handoffs/roadmap-handoff-v0.4.20.md` with your results (using roadmap-handoff-v0.4.0.md as a template).
- Update `docs/roadmap.md`, `docs/update-directions.md`, and `docs/handoffs/ledger.md`.
- Bump `GAME_ITERATION` to `v0.4.20` in `frontend/src/version.js`.
- Commit your changes.
```
