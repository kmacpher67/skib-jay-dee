# Skib-Jay-Dee-Toilet

A mobile-first, vertical-portrait ("WORLD STAR!!!") 2D chase game — a
satirical Skibidi Toilet parody. Skibidty Toilet Guy hunts Jayden through
"The Porcelain Palace." See [`Skib-jay-dee-toilet game-init-v1.pdf`](Skib-jay-dee-toilet%20game-init-v1.pdf)
for the full design doc, characters, and dialogue script.

**Status: Phase 1+** — core engine, movement, chase mechanic, jump-scare,
face upload, five playable levels, desktop key support, Shleeb shop,
cookie-backed user persistence, a lifetime death counter with a skreem
penalty on capture, and a multi-chaser mechanic that adds more toilets if
a level runs long. Multiplayer, role-swapping, audio, and the intro
cinematic remain future work — see [docs/roadmap.md](docs/roadmap.md).

## Quick start

```bash
cd frontend
npm install
npm run build
npm run preview -- --host   # serves the built game
```

Open the printed URL on a phone (or a browser resized to portrait) — that's
the intended experience: drag the joystick bottom-left to run, hold
SPRINT bottom-right to escape, or use Arrow/WASD keys plus SPACE on
desktop. The Shleeb shop works from the menu, and your user id / balance
persist in cookies between reloads.

> If `npm run dev` fails with an `EMFILE`/`inotify` error on your machine,
> that's a file-watcher limit issue unrelated to this code — use the
> build+preview flow above, or see [docs/dev-notes.md](docs/dev-notes.md).

### Backend (optional, not used by the frontend yet)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Exposes `GET /health` and a `WS /ws/match` endpoint that logs player
coordinates. Not called by Phase 1 gameplay — scaffolding for Phase 2
multiplayer. See [docs/dev-notes.md](docs/dev-notes.md) for why.

## Project structure

```
frontend/            Vite + React app
  src/GameEngine.js   Canvas game loop, joystick + keyboard input, multi-
                      level chase AI, multi-chaser spawning, death/skreem
                      economy, jump-scare camera zoom — plain JS
  src/App.jsx         Main menu, face upload, Shleeb shop, mounts GameEngine
  src/gameContent.js  Random face gallery + shop item definitions
  src/lib/cookies.js  Cookie-backed profile persistence
  src/components/ShopModal.jsx  Front-end shop overlay
  src/assets/         Default character face textures (see below)
backend/
  main.py             FastAPI + WebSocket scaffold, optional Mongo
images/               Source photos + the game design PDF's reference images
docs/                 Design source docs, dev notes, deployment guide
```

## Face upload

The main menu lets you upload a photo for the Runner and/or Chaser; it's
converted to base64 in-browser and drawn onto that player's canvas sprite.
Defaults (if you don't upload anything) are real photos from `images/`:
Jayden as the Runner, "Toiletman" as the Chaser.

## End-to-end tests (Playwright)

```bash
cd frontend
npx playwright install chromium   # first time only
npm run test:e2e                  # builds, serves, and tests the local build
npm run test:e2e:prod              # tests the live production URL
```

`test:e2e` boots `vite build && vite preview` itself (see
`playwright.config.js`) and checks the menu loads and Quick Play/Shop work.
`test:e2e:prod` points the same spec at
`https://kenmacpherson.com/skib-jay-dee-toilet-game/` with no local
webServer — run it after any deploy to confirm the live site actually
serves the game, not just a 200 on some unrelated page. See
[docs/deployment.md](docs/deployment.md) for a known issue this currently
catches.

## Deployment

See [docs/deployment.md](docs/deployment.md) — Phase 1 is a static build,
copied straight into the nginx doc root. No server process required until
the backend actually gets wired up in a later phase.

## Roadmap

| Phase | Focus | Status |
|---|---|---|
| 1 | Core chase loop, jump-scare, face upload, desktop controls | **Done** |
| 1.5 | 5 levels, Shleeb shop, cookie profile, death/skreem economy, multi-chaser pressure | **Done** |
| 2 | Audio pass | Not started |
| 2.5 | World Star intro cinematic | Not started |
| 3 | More characters, abilities, map variants, role-swapping | Not started |
| 4 | Oval face-crop on upload | Not started |
| 5 | FastAPI WebSocket multiplayer, lobby, server-authoritative roles | Backend scaffolded, not wired up |

The full phased backlog — broken into single-session-sized increments, plus
a plan for scaling level/map authoring — lives in
[docs/roadmap.md](docs/roadmap.md). Full original design detail is in the
source PDF and [docs/code-seed-initial.md](docs/code-seed-initial.md).

Versioned design and plan notes live in [docs/version-log.md](docs/version-log.md).
Every agent working in this repo follows the process in
[docs/skib-sdlc.md](docs/skib-sdlc.md). Adding sound effects? Start at
[docs/sound-effects-howto.md](docs/sound-effects-howto.md).

For a ready-to-paste brief on what to do next, see
[docs/update-directions.md](docs/update-directions.md).
