# Roadmap Handoff Plan v0.4.39

This session is a Mode A planning pass to review all front-end roadmap open and partial items, refine them, and prepare a handoff for the next coding session.

## What's Left: Open Roadmap & Backlog Items

The following are the remaining open items on the `roadmap.md` backlog:

1. **Close-call freeze + reward payout:** Implement a 1-second game freeze on near-misses. Needs integration in `GameEngine.js`.
2. **Gameplay Rebalancing (later follow-up):** Adjust sheebs rewards, scaled death penalties, and chaser speeds.
3. **Micro-Skib chaser:** Implement a smaller chaser variant to counter the Schleimy Potion. Requires AI/pathing updates.
4. **Interactive content pack:** Add a catalog of runner/chaser items and exploration awards. (See `interactive-content-pack.md`).
5. **Secret Interaction Badges (Friendly Fire):** Stun a Skib with the Jayden Gun, then get caught by the exact same Skib. Needs implementation.
6. **Audio 2: Voice clips (Optional):** Record and integrate 1:1 voice clips for capture-lines and chaser-barks. Needs audio files from Ken.
7. **Intro cinematic:** Script the World Star open as a pre-chase phase in `GameEngine.js`.
8. **Shop item: cosmetic sink:** Add a cosmetic-only shop item for players with maxed stats.
9. **Menu brag stat:** Show best level and fewest deaths on the menu.
10. **Level data extraction:** Finish migrating Levels 3-5 to the grid format in `mapGrids.js`. (Currently partially implemented in the uncommitted worktree).
11. **New character + Level 6:** Implement Skib-Daddy-Toilet Guy and "Jayden's Nightmare House". See `roadmap-handoff-v0.4.38-plan.md`.
12. **New chaser: Yoodeling Unc, second pose:** Needs the user to provide the image file `yoodelling-unc-alex-2.png`.
13. **Follow-up: Supply distinct runner photos:** User needs to provide distinct runner face photos for captured/getting-captured and default states.
14. **Multiplayer spike (Phase 5):** The big one. Needs FastAPI WebSocket integration.
15. **Enhanced Death Logs:** Record time played and sheebs/skreems achieved (plus/minus) in the kill history log.
16. **Parody Warning & Feedback Link:** Add a UI warning about parody/fair use, and a link to GitHub issues for complaints.
17. **Difficulty Function:** Selectable difficulty scaling based on `docs/difficulty-mechanics-plan.md`.
18. **Cool Play (Chaser Evasion):** Enhance evasion mechanics for a cooler gameplay experience.

## What's Needed to Complete Outstanding Items

- **Assets Required from Ken:**
  - `yoodelling-unc-alex-2.png` for the second pose.
  - Real, distinct photos for the runner `captured`, `getting-captured`, and `default` states.
  - Audio clips if the 1:1 dialog audio feature (Audio 2) is desired.
- **Decisions Required from Ken:**
  - Difficulty: Review `docs/difficulty-mechanics-plan.md` and choose an implementation method (Method A, B, or C).
  - Cool Play: Define what specific mechanics would make evasion feel cooler (e.g., dynamic FOV sliding, near-miss effects).
- **Code Cleanup (URGENT):**
  - There is currently an uncommitted dirty working tree involving `GameEngine.js`, `gameContent.js`, `mapGrids.js`, and scratch files. The next Mode B session MUST review this `git diff`, decide whether to keep, fix, or discard it, and commit it before proceeding with any other items.

## Copy-paste: next natural steps

```markdown
**Mode B — Implementation Pass**

Read `docs/handoffs/roadmap-handoff-v0.4.39-plan.md` first. 

1. **CLEAN UP WORKTREE:** Review the uncommitted dirty working tree. Run `git status` and `git diff`. Decide whether to finish the Level grid extraction (`mapGrids.js`), the "Friendly Fire" badge, and the Heavy Plunger/Soggy TP implementations. Either commit them as a clean version, or stash/discard them.
2. **Enhanced Death Logs:** Update the `deathsHistory` cookie schema in `cookies.js` to include `timePlayed` and `sessionScore` (sheeb delta), and display these in the Deaths modal (`App.jsx`).
3. **Parody Warning & Link:** Add the Parody/Fair Use warning and the GitHub issues link to the main menu or a new settings modal in `App.jsx`.

**Verification:**
- Run `npm run build` in `frontend/`.
- Verify the Deaths history modal shows the new fields on a fresh kill.
- Verify the Parody warning and link render correctly in the UI.

**Code Monkey Hints:** `code_monkey_backend` `code_monkey_model`
```
