# Roadmap — Skib-Jay-Dee-Toilet

This is the working backlog for single-session increments. Keep changes
small, buildable, and front-end first unless the user explicitly asks
otherwise.

## Completed

- Core chase loop, jump-scare, face upload, desktop controls, three levels,
  Shleeb shop, cookie profile, kill counter, and docs trail.

## Next natural increments

1. World Star intro cinematic
   - Jayden recording a video
   - Skib bursting from a stall
   - screen crack / dramatic transition

2. Audio pass
   - flush / ambience / chase loop / jump-scare sting
   - simple browser-safe playback

3. Face upload polish
   - crop or oval-mask the uploaded image
   - keep upload flow intact

4. Level tuning and expansion
   - rebalance current three levels
   - add one new level only if it stays session-sized

5. Roster expansion
   - add more characters or abilities from the PDF
   - keep the face-pool pattern in `frontend/src/gameContent.js`

6. Backend later, if asked
   - persistence
   - multiplayer
   - server authority

## Session rules

- Keep each session to one meaningful increment.
- Build after changes with `cd frontend && npm run build`.
- Update `docs/version-log.md`, `docs/update-directions.md`, and this file
  whenever a meaningful change lands.
- Do not treat the backend scaffold as in scope unless the user asks for it.

