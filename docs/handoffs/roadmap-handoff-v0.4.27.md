# Roadmap Handoff — v0.4.27

**Session mode:** Mode B (Deployment only)
**Status: DEPLOYED**

The `v0.4.25` build, which includes the fix for the broken face preview images, has been successfully deployed to production. The production menu now correctly shows the selected face assets. 

`docs/update-directions.md` and `docs/handoffs/ledger.md` have been updated to reflect the deployed state of `v0.4.25`.

## Next Agent Handoff

The next item in the backlog is the Level 4 transition screen (`v0.4.28-plan.md`). Here are the instructions for the next Code Monkey session:

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md` and `frontend/src/App.jsx` /
`frontend/src/GameEngine.js` before touching anything. Confirm v0.4.26
(sheebs debt + item loss) is already committed on this branch first —
if not, stop and flag it, don't stack on top of uncommitted work.

Scope for this pass: ONLY the Level 4 transition screen (item 1 in
`docs/handoffs/roadmap-handoff-v0.4.28-plan.md`). Do not start the
badges/rewards system (item 2) — it's blocked on product decisions Ken
hasn't answered yet.

1. **Copy.** Add a `LEVEL_4_RULES` constant to `frontend/src/dialog.js`
   with the header, three body lines, and button text from the plan doc
   above, verbatim.
2. **Overlay component.** In `frontend/src/App.jsx`, add a full-screen
   overlay that renders `LEVEL_4_RULES` plus
   `frontend/src/assets/level-4-warning-transition-screen.jpeg`,
   following the existing modal/overlay pattern already used for
   `ProfileModal`/version panel. Wire it to pause the game loop the same
   way other overlays do.
3. **Trigger.** Fire the overlay once per run, the first time the player
   transitions from level 3 to level 4 (check wherever `GameEngine.js`
   currently fires the level-up/level-clear transition). Gate on a
   per-run flag so it doesn't re-show on later level-4 visits in the same
   session. Dismiss via the "I ACCEPT MY FATE" button, which resumes play
   into level 4.
4. **Test coverage.** Add a Playwright spec that plays to the level 3→4
   transition and asserts the overlay appears with the expected text,
   image, and dismiss button, and that dismissing it starts level 4
   normally. Assert it does NOT reappear on a second level-4 visit in the
   same run (e.g. after a capture and respawn still inside level 4).

Verification:
- `cd frontend && npm run build` must succeed.
- Full Playwright suite passes, including the new spec.
- Manual browser pass: play to level 4, confirm the overlay shows the
  right copy and image, and "I ACCEPT MY FATE" resumes gameplay
  correctly.
- Once verified, bump `GAME_ITERATION` to `v0.4.28`, update
  `docs/version-log.md`, `docs/update-directions.md`, `docs/roadmap.md`
  (check off the transition-screen item only — leave badges unchecked),
  `docs/handoffs/ledger.md`, and create
  `docs/handoffs/roadmap-handoff-v0.4.28.md` before committing, per
  `docs/skib-sdlc.md`.
```
