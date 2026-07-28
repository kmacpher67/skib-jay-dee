# Roadmap Handoff Plan v0.4.65 — Post-deploy game-repo `git push` (needs refinement)

**Created by:** Cursor Composer — 2026-07-28
**Last updated by:** Cursor Composer — 2026-07-28
**Session mode:** Mode A (Planning / refine — docs only, no code)
**Status:** **Needs refinement** — Ken workflow captured; implementation
approach not chosen. Do not code until Ken picks an option below.

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
# sketch only — not implemented
nohup bash -c 'sleep 90 && git push origin HEAD' &
```

- **Pros:** Agent returns immediately; trivial to add as optional flag on
  deploy script (`--push-game-repo-after=90`).
- **Cons:** Push fires even if deploy failed or version never appeared;
  needs guardrails (only if `deploy-static` succeeded; optional
  `--no-delayed-push`).

### Option B — Post-deploy hook file + cron/`at`

`deploy-static.sh` writes a small marker file (commit SHA + timestamp).
A separate `scripts/maybe-push-game-repo.sh` (cron every minute, or
`at now + 2 minutes`) checks marker + optional HTTP probe of live
`version.js` / iteration string, then pushes and clears marker.

- **Pros:** Can verify prod before push; decoupled from agent session.
- **Cons:** More moving parts; needs live URL probe logic.

### Option C — Git hook on game repo (post-commit)

Detect "deploy commits" via message pattern (e.g. body contains
`deploy-static` or a `GAME_ITERATION` bump in the same commit) and queue
delayed push.

- **Pros:** Automatic for deploy-shaped commits.
- **Cons:** Hard to distinguish planning-only commits; hooks are easy to
  get wrong; still need async sleep somewhere.

### Option D — Keep manual; document the checklist only

Add a one-liner to `docs/deployment.md` and the deploy script's success
output: "When the version shows in prod, run: `git push`".

- **Pros:** Zero automation risk.
- **Cons:** Still manual.

**Planning recommendation:** start refinement with **Option A** as a
**non-default flag** on `deploy-static.sh` (`--delayed-game-push 90`),
plus clear stdout telling the agent the push is scheduled. Escalate to
Option B only if blind sleep proves unreliable.

## Explicitly not in scope (until refinement)

- Changing when the **website** repo is pushed (already in deploy script).
- Running production e2e from the deploy script (CI owns that).
- Pushing on every commit without a deploy.

## Flag for Ken (refinement)

1. Preferred option: A (delayed background push), B (probe then push), C
   (hook), or D (manual checklist only)?
2. Default delay seconds: 60, 90, or configurable?
3. Should delayed push run only when `deploy-static.sh` is invoked (never
   on plain `git commit`)?
4. OK to add `--delayed-game-push` as opt-in first, not default?

## Relationship to other docs

- Deploy flow today: `docs/deployment.md`, `docs/skib-sdlc.md` §5.
- Production e2e: `frontend/package.json` (`test:e2e:prod`), `.github/workflows/e2e.yml`.

---

## Copy-paste: next planning agent (Mode A refine)

```text
Mode A — refine v0.4.65 only, no code unless Ken picked an option.

1. Read docs/handoffs/roadmap-handoff-v0.4.65-plan.md and scripts/deploy-static.sh.
2. If Ken answered the four Flag-for-Ken questions, record his choice and
   update this handoff to code-ready with a bounded copy-paste block.
3. Do not implement until Ken explicitly picks an approach.
```

## Copy-paste: Mode B (blocked until refinement)

```text
BLOCKED — Ken has not chosen an approach in roadmap-handoff-v0.4.65-plan.md.

When unblocked: implement the chosen option only; verify with a dry-run
that does not push to origin unless Ken confirms.
```
