# Roadmap Handoff Plan v0.4.63 — Main Menu UI Clean Up

**Created by:** Antigravity — 2026-07-28
**Session mode:** Mode A (Planning / refine — docs only, no code)
**Status:** Code-ready. No `GAME_ITERATION` bump until Mode B ships this slice.

## Trigger

Ken asked to create a roadmap feature for UI clean up on the intro app screen (officially called the Main Menu). 
Specifically, the top profile stats (User ID, difficulty, sheebs, etc.) need to fit on a single line on mobile via responsive flex wrapping or responsive sizing. Also, the vertical spacing throughout the Main Menu should be tightened so the bottom version info and links fit on screen without scrolling.

## Scope

**Main Menu UI Clean Up (`frontend/src/App.jsx` and/or `frontend/src/index.css` or inline styles):**
- Fix the `.status-pill` / profile pill layout so they flex, wrap, or resize elegantly on narrow viewports to avoid the cramped overlap currently seen.
- Reduce vertical margins or padding on the Main Menu so that the bottom `build-tag` (version number) is visible above the fold on typical viewports without scrolling.

**Docs Updated:**
- `docs/roadmap.md` has been updated with the UI Clean Up item.
- `docs/players-guide.md` has been updated to officially name the intro screen the **Main Menu**.

## Copy-paste: Next natural steps for the coding agent

```text
Pick up the UI Clean Up from roadmap-handoff-v0.4.63-plan.md.

**Files to modify:**
- `frontend/src/App.jsx` (and potentially `frontend/src/index.css`)

**What to do:**
1. Fix the top row of profile stats (User ID, Noob-Noob, sheebs, level, deaths) so they fit nicely on mobile sizing using flex wrapping or responsive sizes.
2. Reduce the vertical spacing / margins / gaps on the Main Menu so the version number and links at the very bottom are visible without needing to scroll.
3. Test locally in the browser (`npm run dev`) and resize the window to mobile width/height to confirm the design holds up.
4. When done, bump `GAME_ITERATION` in `frontend/src/version.js` to `v0.4.61` or whatever is next, commit, and ship it.
```
