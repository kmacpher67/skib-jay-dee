# Next-Agent Brief — Skib-Jay-Dee-Toilet

This brief is now a legacy handoff. For the current upgrade state, start
with [docs/update-directions.md](docs/update-directions.md) and the
version record in [docs/version-log.md](docs/version-log.md).

Copy everything below this line into a fresh agent session only if you need
the older Phase 1-era context.

---

You're continuing work on **Skib-Jay-Dee-Toilet**, a mobile-first vertical
("WORLD STAR!!!") 2D chase game parodying Skibidi Toilet. The project root
is `/mnt/data/projects/skib-jay-dee`. Read these three files first, in
order, before touching anything:

1. `README.md` — project overview and how to run it.
2. `docs/dev-notes.md` — decisions made in the Phase 1 build, including a
   sandbox `inotify`/`EMFILE` quirk that broke `npm run dev` (use
   `npm run build && npm run preview` instead if you hit it) and a note
   that CDP's `Input.dispatchMouseEvent` didn't drive the canvas but
   in-page `PointerEvent` dispatch did, if you need to browser-test again.
3. `Skib-jay-dee-toilet game-init-v1.pdf` (in the repo root) — the full
   design doc: characters, maps, dialogue script, roadmap phases. Treat
   this as the source of truth for tone and content, not just the
   Phase 1 code brief in `docs/code-seed-initial.md`.

**Phase 1 (core engine, movement, one map, jump-scare, face upload) is
done** — see `frontend/src/GameEngine.js` for the whole game loop and
`frontend/src/App.jsx` for the menu/upload UI. The FastAPI backend in
`backend/main.py` exists but the frontend doesn't call it yet.

## Pick ONE of these next, don't try all of them at once

Ask the user which they want if it's not obvious from context, rather
than guessing:

**A. Wire up Phase 2 multiplayer.** Make the frontend actually connect to
`/ws/match`, sync runner/chaser positions between two browser tabs, and
have the server (not the client) decide who's the Chaser. This is the
biggest lift — plan for lobby state, a simple room model, and probably a
rewrite of `GameEngine.js`'s local-authority movement into
client-predicts/server-reconciles or server-authoritative.

**B. Flesh out Phase 1 content that the code brief skipped but the PDF
design doc calls for:** the "World Star" intro cinematic (Jayden recording
a video, Skib bursting from a stall, screen crack transition — dialogue is
verbatim in the PDF), sound effects (flush, bass-boost loop, Sonic Shriek),
and an oval face-crop step on upload instead of stretching the raw image
into a square. All isolated, additive changes — good if you want low risk.

**C. Ship it.** Follow `docs/deployment.md` to actually get Phase 1 build
onto `kenmacpherson.com/skib-jay-dee-toilet-game/` — you'll need the user
to confirm they want you to touch their live nginx config/CI, since that's
a shared-system change outside this repo's sandbox.

**D. More characters per the PDF roster** (Raman-Aunt-Toilet Lady,
Screeeeming Kid abilities) — Phase 3 per the roadmap in `README.md`.
Skib-Daddy already shipped in v0.4.38, so only the remaining roster
follow-ups belong here. Only makes sense after A or B; multiple
chasers/abilities need the chase loop and content pass done first.

## Constraints to respect

- Don't touch `npm run dev` to "fix" the EMFILE error — it's this
  sandbox's inotify limit, not a code bug (see dev-notes.md). Verify with
  build+preview instead.
- `vite.config.js` has `base: './'` on purpose (subdirectory deploy
  target) — don't change it back to `/` without checking deployment.md.
- Default character faces in `frontend/src/assets/` are real family
  photos, not placeholder art — if you regenerate or replace them, ask
  first rather than assuming stock/AI-generated placeholders are wanted.
- This is a git repo now (initialized this session) — commit your own
  work with real messages, don't squash onto the initial commit.
