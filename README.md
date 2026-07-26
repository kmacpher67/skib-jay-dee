# Skib-Jay-Dee-Toilet

A mobile-first, vertical-portrait ("WORLD STAR!!!") 2D chase game — a
satirical Skibidi Toilet parody. Skibidty Toilet Guy hunts Jayden through
"The Porcelain Palace." See [`Skib-jay-dee-toilet game-init-v1.pdf`](Skib-jay-dee-toilet%20game-init-v1.pdf)
for the full design doc, characters, and dialogue script.

**Status: Phase 1+** — core engine, movement, chase mechanic, jump-scare,
face upload, three playable levels, desktop key support, Shleeb shop, and
cookie-backed user persistence. Multiplayer, role-swapping, and deeper
content passes remain future work (see [Roadmap](#roadmap) below).

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
                      level chase AI, jump-scare camera zoom — plain JS
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

## Deployment

See [docs/deployment.md](docs/deployment.md) — Phase 1 is a static build,
copied straight into the nginx doc root. No server process required until
the backend actually gets wired up in a later phase.

## Roadmap

| Phase | Focus | Status |
|---|---|---|
| 1 | Core chase loop, jump-scare, face upload, desktop controls, 3 levels, Shleeb shop, cookie profile | **Done** (this repo) |
| 2 | FastAPI WebSocket multiplayer, lobby, server-authoritative roles | Backend scaffolded, not wired up |
| 3 | More characters, abilities, map variants, role-swapping | Not started |
| 4 | Audio pass, intro cinematic, oval face crop, saved cosmetics, UI polish | Not started |

Full detail in the source design doc and [docs/code-seed-initial.md](docs/code-seed-initial.md).

For a ready-to-paste brief on what to do next, see
[docs/update-directions.md](docs/update-directions.md).
