# Dev Notes — Phase 1 Build Session

Notes and decisions from the session that built Phase 1 (core engine,
movement, jump-scare, face upload, backend scaffolding). Kept here so the
next person (human or agent) doesn't have to re-derive them.

## What got built

- `frontend/` — Vite + React app. `src/GameEngine.js` is a plain-JS class
  (no React state in the hot path) that owns the canvas, the game loop,
  input, and rendering. `App.jsx` is a thin shell: main menu, face upload,
  mount/unmount the engine.
- `backend/main.py` — FastAPI scaffold with a `/ws/match` WebSocket that
  accepts connections and logs `{x, y, role}` per message. Mongo is wired
  through `motor` but only connects if `MONGODB_URI` is set — matches the
  brief's "TBD, roadmap parking lot" note for the database. **The frontend
  does not call this yet** — Phase 1 is single-player/local only per the
  spec; the socket exists so the wire shape is settled before Phase 2
  (multiplayer) depends on it.

## Decisions and why

- **Manual scaffold instead of `npm create vite@latest`.** The installed
  Node (v21.6.1) is older than what the current `create-vite` requires
  (`node:util` `styleText` export missing), so the CLI crashed. Wrote
  `package.json` / `vite.config.js` / `index.html` by hand instead of
  downgrading tooling. If Node gets upgraded later, the CLI would work
  fine too — this isn't a permanent constraint, just what worked today.
- **`base: './'` in `vite.config.js`.** The deployment target is a
  subdirectory (`/skib-jay-dee-toilet-game/`), not domain root. Relative
  asset paths mean the same build works whether it's served from
  `/`, `/skib-jay-dee-toilet-game/`, or opened as a local file — no
  environment-specific rebuild needed.
- **Real family photos as default character faces.** `jayden-default.jpg`
  (from `images/jayden-uncaring-4029.jpg`) and `skib-default.jpg` (from
  `images/Toiletman_wet.jpg`) are copied into `frontend/src/assets/` and
  used as the default Runner/Chaser textures, matching the PDF's "users
  load themselves via face upload" requirement — upload is optional, these
  are just the placeholder default instead of colored squares.
- **Chaser AI is direct seek, no pathfinding.** Phase 1 spec only asks for
  "Chaser hunts Runner" + AABB collision → Caught event. Wall avoidance
  for the chaser was deliberately skipped — it's clamped to map bounds
  but can walk through stall obstacles. Fine for Phase 1; revisit if the
  chase feels too easy/hard once played more.
- **Jump-scare timing:** zoom ramps 1x→3x over ~0.6s, holds through a
  ~2.6s total pause, then both players respawn and the chase resumes
  automatically (no manual restart). Lines are drawn from the PDF's
  capture-screen script (`CAPTURE_LINES` in `GameEngine.js`), chosen
  randomly per catch.
- **Skreem counter** ticks up based on chaser proximity (< 260px), per the
  design doc's "counter ticks up the closer an enemy toilet gets to you."
  No persistence yet — resets on page reload (matches "no database this
  phase").

## Known sandbox quirk — not a code bug

`npm run dev` fails in **this** sandbox with `EMFILE: too many open files,
watch ... inotify_init() failed`. The container's
`fs.inotify.max_user_instances` (128) is already exhausted by other
processes (editor, etc.) unrelated to this project. Workaround used during
this session: `npm run build && npm run preview` (static file server, no
watcher). This is almost certainly fine on a normal dev machine or CI
runner — don't "fix" this by changing the app unless it recurs elsewhere.

## Verification performed

No `chromium-cli` or Playwright available in this sandbox. Verified by:
1. `npm run build` succeeds cleanly.
2. `python3 -m uvicorn main:app` starts, `/health` returns
   `{"status": "ok", "mongo_connected": false}`.
3. Drove headless `google-chrome --remote-debugging-port` directly over
   the DevTools Protocol (hand-rolled Node script using
   `node --experimental-websocket`, since `ws`/`playwright` weren't
   installed) — screenshotted the menu, clicked Quick Play, dispatched
   synthetic `PointerEvent`s on the canvas to drive the joystick, and
   confirmed the runner moved, collided with the chaser, the jump-scare
   fired with a randomized capture line and no console errors, and it
   respawned and resumed the chase afterward.
- **First attempt at synthetic input used CDP's `Input.dispatchMouseEvent`
  and silently did nothing** — the runner never moved. Switched to
  dispatching real `PointerEvent`s from an in-page `Runtime.evaluate`
  script instead, which worked immediately. If you're scripting input
  against this canvas again, prefer in-page `PointerEvent` dispatch over
  CDP's `Input` domain.

## Current follow-up gaps

- No sound yet (flush sound effect, chaser bass-boost loop, jump-scare
  sting, etc. are still on the table).
- No "World Star" intro cinematic (Jayden recording a video, Skib bursting
  from a stall, screen crack transition) — menu has flavor text but not the
  scripted intro.
- Face upload still uses the raw square preview; the design doc called for
  a crop/oval mask instead of stretching.
- No backend persistence or multiplayer wiring yet — the current save uses
  cookies only, and the FastAPI scaffold remains unused by the frontend.
- More character roles / abilities from the PDF roster are still future
  work once the chase loop and content set settle down.

## 2026-07-27 E2E workflow RCA

- Symptom: both jobs in GitHub Actions E2E run `30279865527` failed.
- Local job root cause: Playwright `webServer` was running `npm run build && npm run preview` with a `120000ms` startup timeout. On the runner, this timed out before preview became reachable.
- Production job root cause: CI was running the full feature suite against live production. That creates false failures whenever deployed production and repository HEAD are not in feature parity.

Fix applied in this repo:

- `.github/workflows/e2e.yml`: added an explicit `npm run build` before `npm run test:e2e` in the local job.
- `frontend/playwright.config.js`: in CI, `webServer` now starts preview-only (`npm run preview ...`), binds to `127.0.0.1`, and uses a longer startup timeout.
- `frontend/package.json`: split production commands:
  - `test:e2e:prod` runs smoke-only specs against the live URL.
  - `test:e2e:prod:full` runs the full suite for post-deploy parity checks.

Operational rule going forward:

- Keep scheduled production checks as smoke tests (uptime + core UX).
- Run full production E2E only right after deploying the same revision.
