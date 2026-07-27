# Roadmap Handoff Plan v0.4.39

**Created by:** Codex (GPT-5) — 2026-07-27
**Last updated by:** Claude (Sonnet 5) — 2026-07-27

This session is a Mode A planning pass to review all front-end roadmap open and partial items, refine them, and prepare a handoff for the next coding session.

> **Correction (Claude (Sonnet 5), 2026-07-27):** this handoff was
> written concurrently with another session that shipped `v0.4.37`
> (Close-Call Freeze & Rewards, commit `15da833`) and finished the
> uncommitted-worktree cleanup as `v0.4.36.1` in an *earlier* session —
> neither was visible to whichever session wrote the list below, so it
> understated what's already shipped. Corrected here against the actual
> `frontend/src/version.js` (`GAME_ITERATION = 'v0.4.37'`) and `git log`:
> item 1 (close-call freeze) and item 5 (Friendly Fire) are done, the
> "URGENT" worktree cleanup is done, and item 10's "currently partially
> implemented in the uncommitted worktree" phrasing is stale — that WIP
> was finished and shipped as `v0.4.36.1`, but the underlying migration
> gap (Flooded Annex/Ramen Aisle/World Star still hardcoded) is real and
> stays open. See `docs/update-directions.md`'s "Process note" for the
> full account of how this drifted, and
> `docs/handoffs/roadmap-handoff-v0.4.37.md` for the backfilled v0.4.37
> write-up.

## What's Left: Open Roadmap & Backlog Items

The following are the remaining open items on the `roadmap.md` backlog:

1. ~~Close-call freeze + reward payout~~ — **shipped v0.4.37**, see `docs/handoffs/roadmap-handoff-v0.4.37.md`. No longer open.
2. **Gameplay Rebalancing (later follow-up):** Adjust sheebs rewards, scaled death penalties, and chaser speeds. Natural next tuning pass now that v0.4.37 landed the reward mechanic itself.
3. **Micro-Skib chaser:** Implement a smaller chaser variant to counter the Schleimy Potion. Requires AI/pathing updates.
4. **Interactive content pack:** Add a catalog of runner/chaser items and exploration awards. (See `interactive-content-pack.md`).
5. ~~Secret Interaction Badges (Friendly Fire)~~ — **shipped v0.4.36.1**, see `docs/handoffs/roadmap-handoff-v0.4.36.1.md`. No longer open.
6. **Audio 2: Voice clips (Optional):** Record and integrate 1:1 voice clips for capture-lines and chaser-barks. Needs audio files from Ken.
7. **Intro cinematic:** Script the World Star open as a pre-chase phase in `GameEngine.js`.
8. **Shop item: cosmetic sink:** Add a cosmetic-only shop item for players with maxed stats.
9. **Menu brag stat:** Show best level and fewest deaths on the menu.
10. **Level data extraction:** Finish migrating `buildFloodedAnnex`/`buildRamenAisle`/`buildWorldStarParkingLot` to the grid format in `mapGrids.js`. (The uncommitted WIP that used to sit here was finished and shipped as `v0.4.36.1`, but only added empty placeholder grid exports — the three levels themselves are still hardcoded pixel-rect functions. Prerequisite for Level 6.)
11. **New character + Level 6:** Implement Skib-Daddy-Toilet Guy and "Jayden's Nightmare House". See `roadmap-handoff-v0.4.38-plan.md`. Recommended after item 10.
12. **New chaser: Yoodeling Unc, second pose:** Needs the user to provide the image file `yoodelling-unc-alex-2.png`.
13. **Follow-up: Supply distinct runner photos:** User needs to provide distinct runner face photos for captured/getting-captured and default states.
14. **Multiplayer spike (Phase 5):** The big one. Needs FastAPI WebSocket integration.
15. **Enhanced Death Logs:** Record time played and sheebs/skreems achieved (plus/minus) in the kill history log.
16. **Parody Warning & Feedback Link:** Add a UI warning about parody/fair use, and a link to GitHub issues for complaints.
17. **Difficulty Function:** Selectable difficulty scaling based on `docs/difficulty-mechanics-plan.md`. Needs Ken to pick Method A/B/C before coding — do not guess.
18. **Cool Play (Chaser Evasion):** Enhance evasion mechanics for a cooler gameplay experience.

## What's Needed to Complete Outstanding Items

- **Assets Required from Ken:**
  - `yoodelling-unc-alex-2.png` for the second pose.
  - Real, distinct photos for the runner `captured`, `getting-captured`, and `default` states.
  - Audio clips if the 1:1 dialog audio feature (Audio 2) is desired.
- **Decisions Required from Ken:**
  - Difficulty: Review `docs/difficulty-mechanics-plan.md` and choose an implementation method (Method A, B, or C).
  - Cool Play: Define what specific mechanics would make evasion feel cooler (e.g., dynamic FOV sliding, near-miss effects).
- **Working tree:** clean as of this correction (verified via `git status`) — no cleanup step needed before the next Mode B session.

## Copy-paste: next natural steps

```markdown
**Mode B — Implementation Pass**

Read `docs/handoffs/roadmap-handoff-v0.4.39-plan.md` first (note its
correction block — items 1 and 5 already shipped, don't redo them).
Also skim `docs/handoffs/roadmap-handoff-v0.4.37.md` so you know what
v0.4.37 already added (the close-call freeze phase and the
`POSITIVE_PICKUPS` reward hook) before touching related code.

1. **Enhanced Death Logs:** Update the `deathsHistory` cookie schema in `cookies.js` to include `timePlayed` and `sessionScore` (sheeb delta), and display these in the Deaths modal (`App.jsx`).
2. **Parody Warning & Link:** Add the Parody/Fair Use warning and the GitHub issues link to the main menu or a new settings modal in `App.jsx`.

**Verification:**
- Run `npm run build` in `frontend/`.
- Verify the Deaths history modal shows the new fields on a fresh kill.
- Verify the Parody warning and link render correctly in the UI.

**Code Monkey Hints:** `code_monkey_backend` `code_monkey_model`
```
