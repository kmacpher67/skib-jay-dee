# The Skib-SDLC

The process every agent — human or AI — follows when working in this repo.
It exists because this project is handed between agent sessions constantly;
the process is what keeps a session's context from evaporating the moment
the session ends.

Every agent picking up work here, including you, follows these steps:

## 1. Read before touching anything

In order:

1. `README.md`
2. `docs/update-directions.md` — current state + what to work on next
3. `docs/version-log.md` — the decision trail from every past session
4. `docs/roadmap.md` — phased backlog, broken into single-session increments
5. `docs/dev-notes.md` — sandbox quirks and old decisions still worth knowing

Don't skip this because a task sounds simple. The reason docs exist is that
"simple" requests (sprint is broken, the shop doesn't work) have turned out
to already be fixed in a prior uncommitted session more than once in this
repo's history — reading first avoids redoing or reverting real work.

## 2. Work in single-session-sized increments

Pull the next unclaimed item from `docs/roadmap.md`. If nothing fits, use
judgment, but keep the change small enough that:

- It fits in one context/session.
- It builds cleanly on its own (`npm run build` in `frontend/`).
- It doesn't require a second half-finished feature to make sense.

Don't try to knock out the whole roadmap in one session. Half-finished
features left uncommitted are worse than a smaller, complete increment.

## 3. Verify before calling it done

- `cd frontend && npm run build` must succeed.
- For UI/gameplay changes, actually run the build+preview flow and drive
  the canvas (pointer events on the joystick/sprint origin, or keyboard
  events) rather than eyeballing the diff. See `docs/dev-notes.md` for the
  headless-Chrome CDP approach used previously in this sandbox
  (`Input.dispatchMouseEvent` does **not** work on this canvas — dispatch
  real `PointerEvent`s via `Runtime.evaluate` instead).

## 4. Update the docs before you stop

Every session that lands a meaningful change updates:

- **`docs/version-log.md`** — append a new version section: what changed,
  design decisions and why, plan decisions for what's next, and anything
  explicitly *not* done this round (non-goals). Never edit past entries;
  append.
- **`docs/update-directions.md`** — keep "Current state," "Files to check
  first," and "Natural follow-up work" accurate for the next agent.
- **`docs/roadmap.md`** — check off or annotate the backlog item(s) you
  completed, and add anything new that surfaced while working.

If you didn't finish an increment, still update the docs to say what state
it's in and what's left — don't leave the next agent to reverse-engineer it
from a half-applied diff.

## 5. Commit your own work

- Commit before ending the session. Don't leave meaningful work
  uncommitted for the next agent to discover as a dirty working tree.
- Use real commit messages describing what changed and why, not "wip" or
  "updates."
- Don't squash onto a previous agent's commit — create a new commit.
- Don't amend or rewrite history that's already landed.
- When publishing the built site, bump `GAME_ITERATION` in
  `frontend/src/version.js` first, then run `./scripts/deploy-static.sh
  <short-name>` from the repo root. The script reads the iteration straight
  from `version.js` (single source of truth) so the website repo gets a
  commit like `kenmacpherson.com - skib-jay-dee toilet game: v0.3.1
  intro-badge` and only the `skib-jay-dee-toilet-game/` subtree is staged.

## Constraints that apply to every increment unless the user says otherwise

- Front-end only. The FastAPI backend in `backend/` stays scaffolding until
  the user explicitly asks for multiplayer/server work.
- Keep the forced portrait 9:16 layout.
- Don't break cookie-backed profile persistence (`frontend/src/lib/cookies.js`).
- Don't break the random default face rotation on Quick Play.
- Default character faces are real family photos, not placeholder art — if
  you'd replace or regenerate them, ask first.
- New chasers/runners are added by dropping an image in
  `frontend/src/assets/` and adding one entry to `RUNNER_FACE_POOL` or
  `CHASER_FACE_POOL` in `frontend/src/gameContent.js` — keep that pattern;
  don't hardcode a face path anywhere else in the engine.
