# Roadmap Handoff — v0.4.15-plan

**Session date:** 2026-07-26
**Previous version:** v0.4.14 (Face crop on upload feature).

This was a Mode A planning session to scope out new game profile management, resolve initial sheeb counts, fix audio loops, and lay the groundwork for Nintendo-style character review screens.

## What this session did

1. **Updated Roadmap:** Added multiple new backlog items (Profiles, Sheeb balance fix, Version page, Skreem loop fix, New map layout, Lvl 2 transition review).
2. **Created Character Profile Stubs:** Created `docs/profiles/` and stubbed out `.md` files for all ten characters (`skib-default`, `toiletman-wet`, `skib-killn`, `dad-case`, `yoodelling-unc-alex`, `ant-k-raman`, `anti-k-raman-2`, `ded-dad`, `crazy-jack-chaser`, `sky-diver-motor-killer`).
3. **Updated characters.md:** Added links from the main characters document to these new profile stubs. Ken will fill in the missing content (Main Scare, Killing Tricks, Best Dialogs) for each profile.

## What's explicitly not done

- No code changes were made to the game logic.
- `GAME_ITERATION` was not bumped and nothing was deployed, per the user's instruction for this Mode A session ("commit files no push no code").

## Required Action from Ken
- **Content Creation:** Please review the stubbed Markdown files inside `docs/profiles/` (e.g. `skib-default.md`) and fill in the missing details (`Main Scare`, `Killing Tricks`, `Best Dialogs`). This content will be used to build the Nintendo-style "Skib Profile Reviewer" in a future update.

## Copy-paste: natural next steps for new agent

```text
Read docs/skib-sdlc.md (Mode B), then docs/update-directions.md, then docs/roadmap.md, then this file (docs/handoffs/roadmap-handoff-v0.4.15-plan.md).

The user has requested the following features to be implemented next:

1.  **Fix Initial Sheebs:** In `frontend/src/lib/cookies.js`, change the default starting `sheebs` from 200 (or 240) to 0. (Very quick win).
2.  **Fix Skreem Loop Bug:** After any amount of interaction with the main screen, the game loops the player's scream sound. Investigate and fix the audio triggering logic so this doesn't happen on the menu.
3.  **Setup Version Page:** Add a simple "Version" page to the frontend menu that displays the current `GAME_ITERATION` and changelog info.
4.  **Game Identity & New Profiles:** Allow the user to keep their existing game identity and create a new game profile, still using front-end cookies only (e.g. allowing multiple saved games/slots).

Unless the user says otherwise, default to fixing the Sheebs bug and the Skreem loop bug first, as they are high-impact fixes. 
Verify with `cd frontend && npm run build && npx playwright test`. 
Update docs/version-log.md, docs/update-directions.md, docs/roadmap.md, docs/handoffs/ledger.md, and commit. Do not bump GAME_ITERATION or deploy unless asked.
```
