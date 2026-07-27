# Roadmap Handoff v0.4.45 — Player's Guide Link

**Created by:** Antigravity — 2026-07-27
**Last updated by:** Antigravity — 2026-07-27

## Goal
Implement the UI simplification for the Player's Guide, replacing the React modal with a plain link to the markdown file on GitHub.

## Changes Made
- Removed `PlayersGuideModal` import, state, and component from `frontend/src/App.jsx`.
- Changed the "Player's Guide" footer button to a plain `<a>` tag pointing to the GitHub blob view.
- Deleted `frontend/src/components/PlayersGuideModal.jsx`.
- Deleted `.players-guide-*` styles from `frontend/src/App.css`.
- The `docs/players-guide.md` file already contained the note to open an issue, so no further edits were required.
- Verified build and pushed to prod.

## Next steps
Pull the next item from the open backlog.
