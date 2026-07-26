# Roadmap Handoff — v0.4.25-plan

**Session mode:** Mode A (Planning only)

This plan outlines the new post-kill screen, kill history tracking mechanism, and the new Profile Pages system requested by Ken. When a kill occurs (player is captured), after the kill skreem is done shaking, we want to record who did the kill in the profile history, and then display a profile page for that chaser with humorous text about their "toilet cleanup killen". Furthermore, the "Deaths Log" will now show which chaser killed the player, and allow clicking on that profile to view their Profile Page.

## Design summary

1. **Kill History Tracking Update**
   - We need to add the `chaserId` (who killed the player) to the `deathsHistory` array in the cookie (`sjdt_profile_v1`).
   - `frontend/src/lib/cookies.js`: Update `normalizeProfile` to also keep `chaserId` as a string when loading or saving `deathsHistory`.
   - `frontend/src/GameEngine.js`: Update `_updateChase(dt)` or `_triggerCaught` to identify exactly which chaser caught the player. Save the `chaserId` (e.g. `this.caughtBy = catchingChaser.face`). Update the `this.onDeath` payload to include `chaserId`.
   - `frontend/src/App.jsx`: Update `handleDeath` to receive `chaserId` and store it in `deathsHistory`.

2. **The Post-Kill Profile Screen & Profile Pages System**
   - Create a `CHASER_PROFILES` object in `frontend/src/gameContent.js` that maps chaser IDs (e.g., `skib-default`, `dad-case`, `toiletman-wet`) to an object with `name`, `vibe`, and `tricks`.
   - Introduce a new `ProfileModal.jsx` component that takes a `chaserId` and displays their full profile page, including their portrait, Name, and bio (the "shyt talk screen").
   - **Post-Kill Overay:** After the jump-scare finishes (the shake is done in `GameEngine.js`), automatically show this `ProfileModal` in `App.jsx` for the chaser that just killed the player. Include a "Continue" button to dismiss it and go back to the menu.
   - **Deaths Log Updates:** Modify `DeathsModal.jsx` to render the `chaserId` visually. Add an `onClick` event to the chaser in the log to open the `ProfileModal` for that specific killer. Add a way to close the profile and go back to the log.

## What's explicitly not done yet (Code Monkey target)

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent. Your task is to implement the post-kill chaser profile screen, kill history logging, and the clickable Deaths log.

1. **Profile Data:** In `frontend/src/gameContent.js`, create a new exported const `CHASER_PROFILES` that maps chaser IDs to an object with `name`, `vibe`, and `tricks`. Stub out funny info for a few chasers based on the markdown docs (e.g. Toiletman Wet: "Leaves a permanent, low-grip puddle trail...").
2. **Cookie Logging:** In `frontend/src/lib/cookies.js`, update `normalizeProfile` to keep `chaserId`. In `App.jsx`, update `handleDeath` to accept `chaserId` and include it in `nextHistory`.
3. **Trigger Logging:** In `frontend/src/GameEngine.js`, when a capture happens (`_triggerCaught`), determine the `id` of the chaser that caught the player, and pass it to `this.onDeath`.
4. **Profile Modal & Post-Kill Screen:** Create `ProfileModal.jsx`. In `App.jsx`, track a new state `caughtByProfileId`. When a capture finishes shaking, show `ProfileModal` with this ID.
5. **Clickable Deaths Log:** In `DeathsModal.jsx`, display the `chaserId` for each death. Make it clickable. When clicked, it should trigger an `onViewProfile(chaserId)` callback that opens `ProfileModal.jsx` on top.

Verification:
- Run `npm run build` to ensure syntax is correct.
- Launch the game, get caught by a chaser, and verify that after the shake, the chaser's profile info is displayed on screen.
- Verify that `deathsHistory` is updating in the cookie with `chaserId`.
- Open the Deaths log, verify `chaserId` is visible, click it, and verify the Profile Modal opens.
- Once verified, bump `GAME_ITERATION` to `v0.4.25`, update `docs/handoffs/roadmap-handoff-v0.4.25.md`, `docs/roadmap.md`, `docs/handoffs/ledger.md`, and commit.
```
