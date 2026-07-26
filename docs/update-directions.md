# Update Directions — Skib-Jay-Dee-Toilet

Use this as the handoff doc for the next agent working in the repo.

## Current state

- Front end only. The backend scaffold exists, but the current gameplay and menu do not call it.
- `frontend/src/GameEngine.js` now handles the chase loop, jump-scare, three levels, desktop keyboard controls, and sprint fixes.
- `frontend/src/App.jsx` owns the menu, face upload, Shleeb shop, cookie-backed profile state, and the play/session handoff.
- Default faces are randomly shuffled from the local gallery each time the user presses play, unless they upload custom faces.
- User id, sheeb balance, purchased items, and highest cleared level persist in cookies.

## Files to check first

- `README.md`
- `docs/version-log.md`
- `docs/dev-notes.md`
- `frontend/src/GameEngine.js`
- `frontend/src/App.jsx`
- `frontend/src/gameContent.js`
- `frontend/src/lib/cookies.js`
- `frontend/src/components/GameCanvas.jsx`
- `frontend/src/components/ShopModal.jsx`

## Current gameplay features

- Mobile joystick still works bottom-left.
- Sprint button is now a hold-to-run state instead of getting stuck.
- Desktop players can use Arrow keys or WASD to move and SPACE to boost.
- The canvas currently has three levels:
  - Porcelain Palace
  - Pipeworks
  - Flooded Annex
- The Shleeb shop is front-end only and sells stat upgrades that persist in cookies.

## Where to edit things

- Add or rebalance levels in `frontend/src/GameEngine.js`.
- Add or change shop items in `frontend/src/gameContent.js`, then keep the purchase logic aligned in `frontend/src/App.jsx`.
- Change persistence fields in `frontend/src/lib/cookies.js`.
- Change menu/shop presentation in `frontend/src/App.jsx` and `frontend/src/App.css`.
- Change game HUD, controls, or level rendering in `frontend/src/GameEngine.js`.

## Natural follow-up work

- Add the scripted World Star intro cinematic.
- Add sound effects and background audio.
- Crop or mask uploaded faces instead of stretching the raw image.
- Add more character roles or abilities from the PDF roster.
- Add more level variants once the current three feel tuned.
- Wire up backend persistence or multiplayer only after the front-end loop feels solid.

## Version record

- The current upgrade checkpoint is documented in [docs/version-log.md](docs/version-log.md).
- When future agents make a meaningful change, append a new version section there so the design and plan trail stays durable.

## Constraints to keep respecting

- Keep the app front-end only unless the user explicitly asks for backend work.
- Keep the portrait 9:16 layout.
- Do not break the cookie profile flow when touching the shop or the level rewards.
- Preserve the local image gallery behavior so random defaults still change between plays.
