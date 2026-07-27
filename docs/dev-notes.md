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

## 2026-07-27 Node 20 deprecation warning (separate from the E2E RCA above)

GitHub Actions runs started printing this on every E2E job:

```
Node.js 20 is deprecated. The following actions target Node.js 20 but are
being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4,
actions/upload-artifact@v4.
```

This is unrelated to the webServer/scope issues fixed above — it's about the
**Actions runtime**, not this project's Node version. Two different things
share the name "Node 20" here:

1. The JS runtime GitHub's runner uses internally to execute action code
   (`actions/checkout`, `actions/setup-node`, `actions/upload-artifact`,
   etc.). GitHub deprecated Node 20 for that runtime and is transparently
   forcing those actions onto Node 24 — hence "being forced to run on
   Node.js 24." This is a warning today; it becomes a hard requirement once
   GitHub finishes the deprecation.
2. `node-version: 20` in our `setup-node@v4` steps in
   [.github/workflows/e2e.yml](../.github/workflows/e2e.yml) — this only
   controls what Node version gets installed to build/run *our app code*
   (`npm ci`, `npm run build`, Playwright). It has no effect on (1).

Setting `node-version: 20` did not cause the warning and bumping it alone
wouldn't have silenced it — the warning is about the actions themselves,
which GitHub controls, not about our workflow's `with: node-version`.

**Local vs CI Node version:** the sandbox this project was originally
developed in ran Node `v21.6.1` / npm `10.2.4`. Node 21 is an odd-numbered
release — those are short-term (non-LTS) lines that stop receiving updates
once the next even release ships, so 21 was already end-of-life upstream
(June 2024). It happened to satisfy Vite 5's `^18 || >=20` engine
requirement, but it was never a version anyone should intentionally target.

### Decision: Node 22 vs Node 24

First pass (this doc, same date) bumped CI + `engines` to Node 22, reasoning
"22 is Active LTS, no reason to stay on 20." Revisited the same day once the
question came up: **is 22 actually still the right target, or should we go
straight to 24?**

Node's release cadence: a new major ships as "Current" every April; odd
majors (21, 23, 25, ...) never get LTS and die on the next even release;
even majors (20, 22, 24, 26, ...) become "Active LTS" that following
October, then "Maintenance LTS" a year after that, then EOL a year after
that. As of this date (2026-07-27):

- **Node 20** — Maintenance LTS, already past general EOL messaging (this is
  the version GitHub's own warning is about, on the Actions-runtime side).
- **Node 22** — now in **Maintenance LTS** (security fixes only, no new
  features/perf work).
- **Node 24** — now the **Active LTS** — the version actually recommended
  for new work today.
- **Node 26** — "Current" only; doesn't become LTS until October 2026 (a
  few months out from this date). Current releases get less production
  hardening and churn faster — not worth adopting early for a project with
  no need for bleeding-edge runtime features.

So 22 wasn't wrong, it's just already one rung behind where "Active LTS"
sits today. **Decision: target Node 24 now**, not 22 and not 26. Re-evaluate
once 26 flips to Active LTS (~October 2026) using the same logic — jump to
the new Active LTS, don't chase Current.

This also happens to line up with the GitHub Actions warning above: GitHub
is forcing the *actions'* internal runtime to Node 24 anyway, so building
our own app code on 24 too means local, CI job-runtime, and CI
action-runtime all agree — no version drift left anywhere in the pipeline.

**Does this project's stack actually need anything Node 24 adds?** No —
Vite 5, Playwright, React, and plain `fetch`/cookie-based persistence have
no dependency on any Node 22→24 feature (native `fetch`, W3C
`test_runner` stability, permission model tweaks, etc. — none of which this
codebase uses). The benefit here is purely **staying on a supported,
patched LTS line and killing local/CI version drift**, not unlocking new
capability.

**Verified before merging this change:** installed Node 24.18.0 via `nvm`,
ran `npm ci`, `npm run build`, and the full local `npm run test:e2e` suite
in `frontend/` — build succeeded and 32/33 Playwright specs passed (1
pre-existing skip, unrelated to Node version). No breakage from the 22 → 24
bump.

Updated to:

- `.github/workflows/e2e.yml` → `node-version: 24` (both jobs)
- `frontend/package.json` → `engines: { "node": ">=24 <25", "npm": ">=10" }`
- `frontend/.nvmrc` → `24`

**If your local machine is on Node 22.x:** that's fine to keep working with
day-to-day (it's still a supported LTS, just Maintenance-phase), but it's no
longer what CI or `engines` target — plan to move to 24 when convenient.
`engines` doesn't hard-block installs (npm only warns unless
`engine-strict=true` is set), so this is a documentation/lint signal, not an
enforced gate.

**One thing this change does *not* affect:** whether your OS-installed Node
version matches what CI builds with. GitHub Actions' `setup-node@v4` step
downloads and installs its own Node distribution on the runner, isolated
from anything mentioned here — it does not read or depend on your local
machine's Node install at all. Bumping your local Node keeps your day-to-day
`npm run dev`/`npm run build` in parity with CI (fewer "works on my machine"
surprises) and keeps you on a supported/patched runtime, but it is not what
makes CI itself build on Node 24 — the workflow file is.
