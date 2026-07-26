# Deployment — nginx on kenmacpherson.com

Target from the project brief:
`~/personal/website/kenmacpherson.com/skib-jay-dee-toilet-game/` →
`https://kenmacpherson.com/skib-jay-dee-toilet-game/index.html`

## KNOWN ISSUE (2026-07-26): live domain 404s, IP path works

Confirmed via curl from outside the origin server:

- `http://104.245.39.145/kenmacpherson.com/skib-jay-dee-toilet-game/` → `200`
  (files are on disk and served correctly by *some* nginx block — likely a
  default/catch-all server block using the domain name as a literal
  path segment).
- `curl -H "Host: kenmacpherson.com" http://104.245.39.145/skib-jay-dee-toilet-game/`
  → `404` (root `/` on that same Host header returns `200`, so the vhost
  itself is alive — it just has no `location`/`root` covering this path).
- `https://kenmacpherson.com/skib-jay-dee-toilet-game/` (through Cloudflare)
  → `404`, `cf-cache-status: DYNAMIC` — i.e. Cloudflare is passing the
  request straight to origin, and origin is the one 404ing. **Cloudflare is
  not the problem.**

**Fix**: add the `location /skib-jay-dee-toilet-game/ { ... }` block
below to the real `kenmacpherson.com` server block in nginx (not the
default/catch-all one) and reload nginx. The assumption in the "Phase 1"
section below — that the existing vhost already serves static files
under this path — was wrong; the location block needs to be added
explicitly.

Once fixed, verify with `cd frontend && npm run test:e2e:prod` (see
[README.md](../README.md#end-to-end-tests-playwright)) — it currently
fails against the live URL because the menu/canvas never load, and
should pass once the nginx location block is live.

## Phase 1: static only, nothing extra needed on the server

Phase 1 is a self-contained static site — the frontend does **not** call
the FastAPI backend (see [dev-notes.md](dev-notes.md)). That means, for
now:

1. **Build it:**
   ```bash
   cd frontend
   npm install
   npm run build          # outputs frontend/dist/
   ```
2. **Copy the build output** (not the source) into the deploy path:
   ```bash
   cp -r frontend/dist/* ~/personal/website/kenmacpherson.com/skib-jay-dee-toilet-game/
   ```
   Or run the helper script from the repo root. It builds, rsyncs, and
   commits only the `skib-jay-dee-toilet-game/` subtree in the website
   repo, reading the iteration label straight from
   `frontend/src/version.js` (bump `GAME_ITERATION` there first) and
   pairing it with the short slug you pass in:
   ```bash
   ./scripts/deploy-static.sh intro-badge
   ```
3. **nginx needs no special config beyond serving static files** from that
   directory — no proxy, no CGI, no Python process. If the existing
   `kenmacpherson.com` server block already serves static files under
   that path with a `try_files`/`root` directive, this "just works."
   Example minimal `location` block if one doesn't already exist:
   ```nginx
   location /skib-jay-dee-toilet-game/ {
       root /home/<user>/personal/website/kenmacpherson.com;
       try_files $uri $uri/ /skib-jay-dee-toilet-game/index.html;
   }
   ```
4. `vite.config.js` has `base: './'`, so the build's asset URLs are
   relative — it will work correctly served from that subdirectory
   without any path rewriting.

**CI/CD**: the brief says "ci/cd pushes automatically" — whatever that
pipeline is, it only needs to run steps 1–2 above (`npm ci && npm run
build`, then rsync/copy `dist/` to the deploy path, then commit the
`skib-jay-dee-toilet-game/` subtree with a short iteration slug). No
server restart is required since it's static files.

## Phase 2+: once the backend gets wired in

Not needed yet, but for when multiplayer (WebSocket) actually gets called
from the frontend:

- The FastAPI app needs a **running process** — nginx doesn't execute
  Python. Run it under `uvicorn` (or `gunicorn -k uvicorn.workers.UvicornWorker`)
  as a systemd service, e.g.:
  ```ini
  # /etc/systemd/system/skib-jay-dee-backend.service
  [Service]
  WorkingDirectory=/path/to/skib-jay-dee/backend
  ExecStart=/path/to/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
  Restart=on-failure
  Environment=MONGODB_URI=...
  ```
- nginx then needs a **reverse proxy location for the WebSocket**,
  including the `Upgrade`/`Connection` headers (nginx doesn't proxy
  WebSockets by default without these):
  ```nginx
  location /ws/match {
      proxy_pass http://127.0.0.1:8000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host $host;
  }
  ```
- If Mongo persistence (Phase 4) gets turned on, the `MONGODB_URI` env var
  needs to point at a real instance — currently it's fine to leave unset.
