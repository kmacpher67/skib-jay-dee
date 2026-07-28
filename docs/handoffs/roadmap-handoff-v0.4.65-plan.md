# Roadmap Handoff Plan v0.4.65 — Post-deploy game-repo `git push`

**Created by:** Cursor Composer — 2026-07-28
**Last updated by:** Claude — 2026-07-28
**Session mode:** Mode A (Planning / refine — docs only, no code)
**Status:** **Design decided.** Ken specified the shape (post-commit hook,
not inside `deploy-static.sh`; skip non-deploy commits automatically).
This doc turns that into a bounded Mode B copy-paste. A couple of tunable
numbers (poll interval / timeout) are picked as sensible defaults below —
flag if Ken wants different ones, but they shouldn't block starting.

## Trigger

Ken's deploy habit (2026-07-28):

1. Ship a feature locally (commit in **this** repo, bump `GAME_ITERATION`,
   run `./scripts/deploy-static.sh <short-name>`).
2. `deploy-static.sh` builds, rsyncs, commits, and **pushes the website
   repo** (`~/personal/website/kenmacpherson.com`) — already automated.
3. Wait **~30–60 seconds** for the website GitHub Action / nginx deploy so
   the new build is live.
4. Confirm the iteration in the browser (menu version list / HUD badge).
5. **Then** `git push` **this game repo** so production e2e
   (`npm run test:e2e:prod`) and the scheduled `production` job in
   `.github/workflows/e2e.yml` can verify against the live URL that now
   matches the committed revision.

The gap: step 5 is manual and easy to forget. Automating it inside
`deploy-static.sh` with a blocking `sleep 60 && git push` would hold up
the coding agent for the whole wait. Ken wants a design that does **not**
block the agent session.

## Current behavior (verified)

- `scripts/deploy-static.sh` — builds, rsyncs, commits + pushes **website
  repo only**. Does not touch `origin` on the game repo.
- Game repo push is a separate, later human step after prod looks right.
- Production e2e is wired in CI; pushing the game repo is when Ken wants
  that signal to run against a known-live deploy.

## Problem statement

| Goal | Constraint |
|---|---|
| Push game repo after prod is likely live | Must not block Mode B agent for 60–90s |
| Tie push to a deploy, not every commit | Doc-only / planning commits should not auto-push |
| Stay simple on Ken's machine | No mystery background daemons without an off switch |

## Candidate approaches (pick one in refinement)

### Option A — Detached delayed push script

After deploy, spawn a background job from the game repo:

```bash
# sketch only — not implemented should run after a CODE MODE version to prod change. 
nohup bash -c 'sleep 90 && git push origin HEAD' &
```

- **Pros:** Agent returns immediately; trivial to add as optional flag on
  deploy script (`--push-game-repo-after=90`).
- **Cons:** Push fires even if deploy failed or version never appeared;
  needs guardrails (only if `deploy-static` succeeded; optional
  `--no-delayed-push`). Blind sleep can't tell doc commits from deploy
  commits, and living inside `deploy-static.sh` breaks the normal
  commit → deploy → push flow (see Ken's note below).

### Option B — Post-deploy hook file + cron/`at`

`deploy-static.sh` writes a small marker file (commit SHA + timestamp).
A separate `scripts/maybe-push-game-repo.sh` (cron every minute, or
`at now + 2 minutes`) checks marker + optional HTTP probe of live
`version.js` / iteration string, then pushes and clears marker.

- **Pros:** Can verify prod before push; decoupled from agent session.
- **Cons:** More moving parts; needs live URL probe logic on its own.

### Option C — Git hook on game repo (post-commit)

Detect "deploy commits" via message pattern (e.g. body contains
`deploy-static` or a `GAME_ITERATION` bump in the same commit) and queue
delayed push.

- **Pros:** Automatic for deploy-shaped commits; fires right after
  `git commit`, not bolted onto the deploy script.
- **Cons:** Message-pattern matching is fragile — needs a more reliable
  signal for "this is a code-mode/deploy commit."

### Option D — Keep manual; document the checklist only

Add a one-liner to `docs/deployment.md` and the deploy script's success
output: "When the version shows in prod, run: `git push`".

- **Pros:** Zero automation risk.
- **Cons:** Still manual.

### Decided — Option E: post-commit hook (C) + marker probe (B) + background wait (A)

Ken's refinement (2026-07-28) picked pieces of A/B/C over any single one:

1. **Trigger lives in a `post-commit` hook on the game repo, not in
   `deploy-static.sh`.** The deploy/version-push script's job stays
   build → rsync → commit → push *website repo* only, unchanged. Adding
   a blocking `sleep 60 && git push` there breaks the normal
   commit → deploy → confirm → push flow Ken already uses by hand.
2. **The hook must not fire for "no code" / Mode A commits.** Rather
   than parsing commit messages (Option C's weak point), key off a
   real signal: did **this commit's diff** change
   `frontend/src/version.js`'s `GAME_ITERATION`? Docs-only / Mode A
   commits never touch that file, so they're skipped for free — no
   flag needed, and no race between a doc commit and a code-mode commit
   landing back-to-back (the doc commit is structurally invisible to
   the hook).
3. **Don't push blind (Option A's weak point) — wait for the marker
   (Option B) before pushing.** `deploy-static.sh` drops a small marker
   file at the end of a successful website push. The hook spawns a
   *detached* background watcher (returns instantly, never blocks the
   agent) that polls for a marker matching the commit's `GAME_ITERATION`
   and only then runs `git push origin HEAD`. If the marker never shows
   up (deploy failed, or Ken never ran `deploy-static.sh` for this
   commit), the watcher times out and does **not** push — logs a line
   and leaves it for a manual push, same as today.

This is what's specified in the copy-paste block below.

## Explicitly not in scope (until refinement)

- Changing when the **website** repo is pushed (already in deploy script).
- Running production e2e from the deploy script (CI owns that).
- Pushing on every commit without a deploy.

## Design (decided)

### Files

- **`.git/hooks/post-commit`** (not tracked by git; installed via a new
  `scripts/install-hooks.sh` that symlinks it, so a fresh clone can set
  it up with one command) — thin wrapper that calls
  `scripts/game-repo-post-commit.sh`.
- **`scripts/game-repo-post-commit.sh`** (new, tracked):
  - Compare `frontend/src/version.js` between `HEAD` and `HEAD^` for
    the current commit (`git diff --unified=0 HEAD^ HEAD -- frontend/src/version.js`,
    or `git show HEAD^:frontend/src/version.js` vs current). If
    `GAME_ITERATION` is unchanged (or `HEAD^` doesn't exist, e.g. first
    commit), exit 0 immediately — no-code / Mode A commit, nothing to do.
  - If `GAME_ITERATION` changed, spawn detached:
    `nohup bash scripts/wait-and-push-game-repo.sh "$ITERATION" >>/tmp/skib-game-push.log 2>&1 & disown`
    and return immediately (does not block the commit or the agent).
- **`scripts/wait-and-push-game-repo.sh`** (new, tracked): given an
  `ITERATION` string, polls every 5s (default, tunable) for up to 5
  minutes (default, tunable) for a marker file written by
  `deploy-static.sh` matching that iteration. On match, runs
  `git push origin HEAD` from the game repo root and logs success. On
  timeout, logs a warning and exits without pushing.
- **`scripts/deploy-static.sh`** — one addition only, at the very end
  after the existing website `git push` succeeds: write
  `.skib-deploy-marker` (repo-root, gitignored) containing
  `ITERATION=<value>` and a timestamp. Everything else in the script is
  unchanged — it still does not touch the game repo's `origin`.

### Why this satisfies the constraints

| Constraint | How |
|---|---|
| Don't block Mode B agent 60-90s | Hook spawns detached background process and returns instantly |
| Don't push on non-deploy commits | Gate is a real `GAME_ITERATION` diff, not a message pattern or manual flag |
| Don't put `git push` in the deploy script | Push lives in the post-commit hook + waiter script; deploy script only ever drops a marker file |
| No blind sleep | Waiter polls for the deploy marker instead of guessing a fixed delay |
| No silent push of an undeployed version | Timeout with no marker = no push, logged, same manual fallback as today |

### Open tuning knobs (defaults chosen, flag if Ken wants different)

1. Poll interval: **5s**.
2. Timeout before giving up: **5 minutes**.
3. Marker file name/location: **`.skib-deploy-marker`** at repo root
   (add to `.gitignore`).
4. Hook installed via `scripts/install-hooks.sh` rather than committing
   into `.git/hooks/` directly (hooks aren't tracked by git).

## Relationship to other docs

- Deploy flow today: `docs/deployment.md`, `docs/skib-sdlc.md` §5.
- Production e2e: `frontend/package.json` (`test:e2e:prod`), `.github/workflows/e2e.yml`.

---

## Copy-paste: Mode B (implement v0.4.65)

```text
Mode B — implement v0.4.65: auto game-repo push after a confirmed deploy.

Read first: docs/handoffs/roadmap-handoff-v0.4.65-plan.md (Design section),
scripts/deploy-static.sh.

Build, in order:
1. scripts/wait-and-push-game-repo.sh <ITERATION>
   - Poll every 5s, timeout 5 min, for a marker file `.skib-deploy-marker`
     (repo root) containing a line `ITERATION=<value>` matching $1.
   - On match: `git push origin HEAD` from repo root, log to
     /tmp/skib-game-push.log, exit 0.
   - On timeout: log a warning line, exit 1 (no push).
2. scripts/game-repo-post-commit.sh
   - Read GAME_ITERATION from frontend/src/version.js at HEAD; compare to
     HEAD^'s copy of the same file (skip cleanly if HEAD^ doesn't exist
     or the file didn't change — exit 0, no output needed).
   - If changed: spawn
     `nohup bash scripts/wait-and-push-game-repo.sh "$ITERATION" >>/tmp/skib-game-push.log 2>&1 & disown`
     and exit 0 immediately.
3. scripts/install-hooks.sh
   - Symlinks .git/hooks/post-commit -> ../../scripts/game-repo-post-commit.sh
     (or writes a 3-line wrapper that execs it), idempotent to re-run.
4. scripts/deploy-static.sh — add ONE block at the very end, after the
   existing `git -C "$WEBSITE_ROOT" push` succeeds: write
   `.skib-deploy-marker` at the game-repo root with `ITERATION=$ITERATION`
   and a timestamp. Do not otherwise change this script's flow.
5. Add `.skib-deploy-marker` to .gitignore.
6. Run scripts/install-hooks.sh once locally as part of this session's
   verification (documented as a one-time setup step in docs/deployment.md
   too, since hooks aren't cloned with the repo).

Verify:
- A commit that does NOT touch frontend/src/version.js's GAME_ITERATION
  produces no background process and no log line (Mode A / no-code commit
  is a no-op).
- A commit that bumps GAME_ITERATION, with no matching deploy marker ever
  written, times out after 5 min and logs a warning without pushing.
- A commit that bumps GAME_ITERATION, followed by a real
  `./scripts/deploy-static.sh <name>` run that writes the matching marker,
  results in the waiter picking it up and running `git push origin HEAD`
  within one poll interval of the marker appearing.
- `deploy-static.sh`'s existing website build/rsync/commit/push behavior
  is unchanged (still exits 0 immediately when there's nothing to deploy).

Update docs/deployment.md with the one-time `scripts/install-hooks.sh`
setup step, plus docs/version-log.md, docs/roadmap.md, and create
docs/handoffs/roadmap-handoff-v0.4.65.md summarizing what shipped, per
docs/skib-sdlc.md.
```
