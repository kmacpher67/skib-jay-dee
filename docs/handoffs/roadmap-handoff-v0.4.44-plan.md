# Roadmap Handoff Plan v0.4.44 — Player's Guide

**Created by:** Claude Sonnet 5 — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-27
**Session mode:** Mode A (Planning — docs only, no code changes)

## Source

Ken, this session:
"Is there players guide.md doc? can we create a players guide with all this little stuff organized in there and linked from the app so the page as a helpful link, maybe at the bottom of the page above theissues and bug link? update this discussion into the players - guide. add anything else you deem necesssary and helpful. like how attacks work, the the brown fart circle i pressed F and knocked out a chaser, but then the brown circle was till there and chaser got me, i thought the brown circle protected me. What is that?"

## Proposed Changes

Currently, the game mechanics are hidden inside `GameEngine.js` and players have to figure them out by trial and error. The goal of this slice is to expose a "Player's Guide" directly inside the game that clarifies these mechanics.

### 1. The Content (`docs/players-guide.md`)
Create a new markdown document `docs/players-guide.md` to serve as the single source of truth for game mechanics. This document should explain:
- **Weapons & Ammo:** How getting a new gun completely replaces the old one.
- **Level Transitions:** Uncollected rewards are lost when moving to the next level.
- **Wall-Hacking Skibs:** Chasers gain the ability to float through walls starting at Level 5, and the Gawd Particle gives the runner this same ability.
- **Attacks (Shart Knocker):** Explain that the "brown fart circle" (Taco Bell Shart charge) is an instantaneous area-of-effect stun that hits the nearest chaser. It does *not* leave a protective zone, despite the lingering visual effect.

### 2. The Frontend UI (`frontend/src/`)
Since a raw markdown file won't render nicely inside a browser for GitHub Pages, we will build a React Modal for the guide (similar to how `VersionModal.jsx` and `DeathsModal.jsx` work).

- **`PlayersGuideModal.jsx`**: Create a new modal component containing the formatted text from the guide.
- **`App.jsx`**: 
  - Add a state hook to toggle the modal (`showPlayersGuide`).
  - Add a "Player's Guide" clickable link in the footer, directly above the "Report issues or leave feedback here" link.

## Flag for Ken
- **Modal vs. External Link:** This plan assumes we are using an in-game React modal to display the text so players don't have to leave the app. Let me know if you would prefer it just links out to a GitHub raw markdown file instead (not recommended for UX).
- **Guns/Ammo logic change:** You mentioned you thought gun ammo should add up instead of replacing. This handoff purely handles *documenting* the current behavior. If you want the ammo logic changed, we should schedule a separate Mode B slice for that gameplay tweak.

## Explicitly not in scope this pass
- No gameplay mechanic changes (e.g., no changes to how ammo adds up or how items spawn). This is strictly documentation and UI.

---

## Copy-paste: next coding session (Mode B)

```text
Read docs/skib-sdlc.md, docs/players-guide.md, and docs/handoffs/roadmap-handoff-v0.4.44-plan.md.

This is a frontend UI and documentation task. No gameplay mechanics are being changed.

1. Create docs/players-guide.md containing the rules for Weapons, Level Transitions, Wall-Hacking, and Attacks (specifically the Shart Knocker).
2. Create frontend/src/components/PlayersGuideModal.jsx that renders this information in a styled React modal.
3. Update frontend/src/App.jsx to include a "Player's Guide" link in the footer above the issues link, which opens the modal.
4. Verify by running `npm run build` and testing the modal in the browser.
5. Update docs/roadmap.md, docs/version-log.md, docs/handoffs/ledger.md, and create docs/handoffs/roadmap-handoff-v0.4.44.md.
6. Commit the changes and bump GAME_ITERATION to v0.4.44.
```
