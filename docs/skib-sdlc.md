# The Skib-SDLC

The process every agent — human or AI — follows when working in this repo.
It exists because this project is handed between agent sessions constantly;
the process is what keeps a session's context from evaporating the moment
the session ends.

Every agent picking up work here, including you, follows these steps.

## Mode 0: which mode is this session?

Two distinct session modes run against this repo, often interleaved by
different agents at different times:

- **Mode A — Planning / arch / goals refinement.** Docs and decisions
  only. No code changes, no build, no deploy. Produces (or updates) a
  handoff plus copy-paste instructions for a future coding session.
- **Mode B — Code and delivery.** Picks up the oldest unfinished handoff,
  implements it, verifies it, updates the docs/ledger, and ships.

If the user doesn't say which mode, infer it from the ask ("let's plan
the next chunk" / "no code yet" → Mode A; "build it" / "let's ship this"
→ Mode B). When in doubt, ask rather than guess — the two modes have very
different blast radius (Mode A touches only `docs/`, Mode B touches code
and can push to prod).

### Mode A — Planning / arch / goals refinement

1. **Plan only, no code.** Don't touch anything under `frontend/src/` or
   `backend/`, don't run builds, don't bump `GAME_ITERATION`, don't
   deploy. This session's output is entirely in `docs/`.
2. **Check for a running/parallel planning session first.** Another
   planning session may already be in flight. Before writing a new
   handoff, look at `docs/handoffs/` for the most recent
   `roadmap-handoff-vX.Y.Z-plan.md` and read it plus its "Copy-paste:
   next natural steps" section — if it already covers what you were
   about to plan, don't duplicate it; extend or correct it instead
   (append, don't silently overwrite someone else's in-flight thinking).
3. **Review the backlog for natural fits.** Read `docs/roadmap.md` and
   `docs/future-versions.md` and look for where roadmap items can be
   incorporated together, sequenced sensibly, or merged instead of
   spawning parallel one-offs.
4. **Update or create a handoff.** Find the newest or open/unfinished
   handoff (`docs/handoffs/roadmap-handoff-vX.Y.Z-plan.md`, using the
   `-plan` suffix and *not* bumping `GAME_ITERATION` — that only happens
   when code actually ships). If one is already open and unfinished,
   extend it rather than starting a new version. Otherwise create the
   next one, following the structure of
   `docs/handoffs/roadmap-handoff-v0.4.2-plan.md`.
5. **Always include a copy-paste block for the next coding agent.** The
   handoff must end with a fenced code block a coding agent can paste
   verbatim to pick up the work — what to read first, which roadmap
   items are unblocked vs. blocked on a decision, exact files/lines,
   and the verify/deploy steps from Mode B below.
6. **Flag anything Ken needs to do himself.** If a roadmap item needs
   outside action — an asset only Ken has, a product decision, an
   account/credential, anything outside what an agent can do
   unattended — call it out explicitly in its own section (not buried
   in prose) so it's impossible to miss, and don't mark that item as
   unblocked in the copy-paste block until it's resolved.
7. **Update `docs/roadmap.md` / `docs/future-versions.md`** with
   whatever was scoped or reprioritized this session, same as any other
   session (see step 4 in the shared checklist below).

### Mode B — Code and delivery

1. **Check for a concurrent planning session.** Look at `docs/handoffs/`
   for a `-plan` handoff newer than the last shipped
   `roadmap-handoff-vX.Y.Z.md` — if one exists, read it for any updates
   to the oldest unfinished handoff before starting, so you're not
   working from a stale plan.
2. **Pick the work.** Unless the user specifies otherwise, do the oldest
   open/unfinished handoff (not the newest — clear the backlog in
   order). "Unfinished" means its "What's explicitly not done" /
   copy-paste section still has unclaimed items.
3. **Do the implementation**, following the read-first, single-session
   sizing, and verification steps below (sections 1-3 of the shared
   checklist).
4. **Update the coding ledger, docs/, and tests** — same doc set as any
   session (`docs/handoffs/ledger.md`, `docs/version-log.md`,
   `docs/update-directions.md`, `docs/roadmap.md`, a new/updated
   `docs/handoffs/roadmap-handoff-vX.Y.Z.md`), plus any test coverage the
   change warrants.
5. **Commit progress as you go**, and push to prod (bump
   `GAME_ITERATION`, run `./scripts/deploy-static.sh <short-name>`) once
   the version is verified working locally — don't batch an entire
   session's work into a single uncommitted pile.
6. **Create copy-paste instructions for the natural next steps**, same
   requirement as Mode A's handoff — leave the next agent (planning or
   coding) able to start cold.

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
- **`docs/handoffs/roadmap-handoff-vX.Y.Z.md`** — one file per version
  that lands, matching the `GAME_ITERATION` you bump to. Longer-form than
  `update-directions.md`: what the session did, how it was verified, what
  was explicitly skipped, and a copy-paste "what to do next" block for
  the next agent. See `docs/handoffs/roadmap-handoff-v0.4.0.md` for the
  template — copy its structure for new versions.
- **`docs/handoffs/ledger.md`** — append a short bullet list under a new
  `## vX.Y.Z — <date>` heading, one line per change. This is the
  fast-scan flat index; `version-log.md` has the *why*, the handoff file
  has the full session narrative, the ledger is just "what landed, in
  order." Never edit past entries.
- **`docs/future-versions.md`** — move anything you scoped out of this
  session here (not into `roadmap.md`, which is the *pull-from* backlog;
  this is the *park-it-here* list for things surfaced but not queued
  yet). Remove items from here once they actually land in a future
  session — the ledger and version-log are the permanent record, this
  file is just a parking lot.

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
