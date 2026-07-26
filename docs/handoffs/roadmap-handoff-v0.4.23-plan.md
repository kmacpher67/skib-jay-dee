# Roadmap Handoff — v0.4.23-plan

> **Superseded — see [roadmap-handoff-v0.4.25-plan.md](roadmap-handoff-v0.4.25-plan.md)
> instead.** A later planning pass expanded this scope to also cover
> `chaserId` kill-history logging and a clickable Deaths log, and that
> fuller plan is what a Mode B session should implement. Left here for the
> design-rationale trail only — do not code from this file.

**Session mode:** Mode A (Planning only)

This plan outlines the new post-kill screen and tracking mechanism requested by Ken. When a kill occurs (player is captured), after the kill skreem is done shaking, we want to record who did the kill in the profile history, and then display a profile page for that chaser with humorous text about their "toilet cleanup killen".

## Design

1. **Kill History Tracking**
   - The game already tracks a generic `lifetime_deaths` in `frontend/src/lib/cookies.js`.
   - We need to add a `kill_history` or `deaths` array to the profile object (or a separate cookie if size is a concern, but `sjdt_profile_v1` is small enough for a short bounded list).
   - Each entry should store the `chaserId` (e.g. `toiletman-wet`), `timestamp`, and `level` they died on.
   - Limit the history to the last ~50 deaths so the cookie doesn't bloat.
   - Call this update in `_triggerCaught` or similar inside `frontend/src/GameEngine.js`, passing the `chaser.face` (the id) to the cookie update function.

2. **The Post-Kill Profile Screen**
   - Currently, `phase === 'caught'` displays a jump-scare zoom in `GameEngine.js:873` (`_drawJumpscare`), and eventually the user clicks "Play Again" or "Menu".
   - We need to introduce a new phase or UI overlay. After the jump-scare finishes (the shake is done), show a profile card overlay.
   - The profile card should display the Chaser's portrait, their Name, and a short humorous bio about their "toilet cleanup killen" or main scare.
   - The data for these profiles (Name, Vibe, Killing Tricks) should be pulled into a new constant map in `frontend/src/gameContent.js` (e.g., `CHASER_PROFILES`), populated from the completed markdown profiles in `docs/profiles/`.
   - Add a "Next" or "Continue" button to the profile screen to proceed to the standard death summary (if any) or directly to the "Play Again" / "Menu" buttons.

## What's explicitly not done yet (Code Monkey target)

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent. Your task is to implement the post-kill chaser profile screen and kill history logging.

1. **Profile Data:** In `frontend/src/gameContent.js`, create a new exported const `CHASER_PROFILES` that maps chaser IDs (e.g., `skib-default`, `dad-case`, `toiletman-wet`) to an object with `name`, `vibe`, and `tricks`. Stub out funny info for a few chasers based on the markdown docs (e.g. Toiletman Wet: "Leaves a permanent, low-grip puddle trail...").
2. **Cookie Logging:** In `frontend/src/lib/cookies.js`, add logic to log deaths. `updateProfile` should accept a new death object `{ chaserId, level, timestamp }` and unshift it to a `deathHistory` array in the cookie, keeping only the most recent 50 entries.
3. **Trigger Logging:** In `frontend/src/GameEngine.js`, when a capture happens (`_triggerCaught`), determine the `id` of the chaser that caught the player, and call the cookie log function.
4. **Display Overlay:** In `frontend/src/App.jsx` (or `GameEngine.js` if it's drawn on canvas), create a new visual state that occurs *after* the jump-scare shake is done. This state should display the chaser's profile info (Name, Vibe, Trick) and image. 
5. **Dismissing:** Ensure the user can dismiss the profile screen to return to the menu or play again, just as they currently click out of the death screen.

Verification:
- Run `npm run build` to ensure syntax is correct.
- Launch the game, get caught by a chaser, and verify that after the shake, the chaser's profile info is displayed on screen.
- Verify that `deathHistory` is updating in the cookie.
- Once verified, bump `GAME_ITERATION` to `v0.4.23`, update `docs/handoffs/roadmap-handoff-v0.4.23.md`, `docs/roadmap.md`, `docs/handoffs/ledger.md`, and commit.
```
