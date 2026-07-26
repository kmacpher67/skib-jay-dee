# Roadmap Handoff — v0.4.1-plan (docs-only)

**Session date:** 2026-07-26
**Previous version:** v0.4.0 (see `docs/handoffs/roadmap-handoff-v0.4.0.md`)

This session was explicitly docs/plan-only — no code changed, no build
was run, `GAME_ITERATION` stays `v0.4.0`. It exists so a future coding
session can pick up four scoped items without re-deriving the
investigation.

## What this session did

1. **Cleaned up `docs/characters.md`.** It was a bare list of image
   embeds with no context. Rewrote it with a runner pose table, a
   chaser roster table (with the "shared pool" behavior noted), and a
   "planned new chasers" section for the two items below.
2. **Documented two new planned chasers** in `docs/roadmap.md`'s
   incremental backlog:
   - **Sky-Diver (Motor Killer)** — source photo already exists at
     `images/sky-diver-motor-killer.png` (repo-root scratch, same
     pattern `audio/`/`video/` used before). Not yet copied into
     `frontend/src/assets/` or added to `CHASER_FACE_POOL`.
   - **Yoodeling Unc, second pose** — a second costume photo (red cap,
     Dutch/windmill backdrop, "Dutch Boy" paint can) was shared in
     conversation this session but **has not been saved to the repo**.
     Blocked until the user drops the file into `images/` — flagged in
     both `docs/characters.md` and the roadmap item.
3. **Reviewed the chaser/runner face-randomization logic** (didn't
   change it) and found two real gaps, written up as roadmap backlog
   items with exact file/line references:
   - `frontend/src/GameEngine.js:419-421` (`setFaces()`) assigns one
     chaser face to every entry in `this.chasers`, including chasers
     spawned later by the multi-chaser mechanic
     (`frontend/src/GameEngine.js:786-800`). Simultaneous toilets
     currently all wear an identical face.
   - `frontend/src/gameContent.js`'s `randomFaces()` only ever picks one
     runner face per run. The five `RUNNER_FACE_POOL` poses
     (`jayden-default`, `jayden-uncaring`, `jayden-skibby`,
     `jayden-getting-captured`, `jayden-captured`) look purpose-shot for
     specific game states but there's no pose-to-state mapping.
4. Started this handoff file and the matching `docs/handoffs/ledger.md`
   entry.

## Verification performed

- None required — no code changed. `docs/characters.md` and
  `docs/roadmap.md` were proofread for accuracy against the current
  `frontend/src/gameContent.js` and `frontend/src/GameEngine.js` (face
  pool contents, line numbers for the randomization review, confirmed
  `images/sky-diver-motor-killer.png` exists on disk and the Yoodeling
  Unc second-pose file does not).

## What's explicitly not done

- No `frontend/src/assets/` or `frontend/src/gameContent.js` changes —
  both new chasers are plan-only.
- No fix to the shared-face randomization bug — documented as a roadmap
  item, not patched.
- No runner pose-to-state wiring — documented as a roadmap item, not
  patched.
- No `GAME_ITERATION` bump, no build, no deploy.

## Copy-paste: next natural steps for the next agent

```
Read docs/skib-sdlc.md, then docs/update-directions.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.1-plan.md) — the previous session
was docs/plan-only, so there's no new code to catch up on beyond
v0.4.0. Four ready-to-pick-up items are queued in docs/roadmap.md's
"Incremental backlog":

1. New chaser: Sky-Diver (Motor Killer) — source photo already at
   images/sky-diver-motor-killer.png. Copy into frontend/src/assets/,
   import, add one CHASER_FACE_POOL entry in
   frontend/src/gameContent.js (see crazy-jack-chaser for the pattern).
   No blockers, can start immediately.
2. New chaser: Yoodeling Unc, second pose — BLOCKED until the user
   drops the second costume photo into images/ (e.g.
   images/yoodelling-unc-alex-2.png). Ask the user for the file before
   starting this one; don't invent or regenerate the image yourself.
3. Chaser face randomization fix — frontend/src/GameEngine.js:419-421
   (setFaces()) currently gives every chaser in this.chasers the same
   face, including ones spawned later by the multi-chaser mechanic
   (frontend/src/GameEngine.js:786-800). Give each newly-spawned extra
   chaser its own independent random pick from CHASER_FACE_POOL instead
   of copying this.chaser.face. Small, self-contained, no new assets.
4. Runner pose-to-state mapping — frontend/src/gameContent.js's
   randomFaces() only picks one runner face per run. Wire
   jayden-getting-captured to show on the jump-scare beat and
   jayden-captured on the caught/"YOU DIED" screen, keeping the
   existing random-default and custom-upload behavior otherwise
   unchanged. See docs/characters.md's runner pose table.

Pick items 1, 3, and/or 4 (item 2 needs the user first) as one
single-session increment each — don't try to do all four at once.
Follow docs/skib-sdlc.md: build (npm run build), test, update
docs/version-log.md + docs/update-directions.md + docs/roadmap.md +
a new docs/handoffs/roadmap-handoff-vX.Y.Z.md + ledger entry, then
commit. Only bump GAME_ITERATION and run
./scripts/deploy-static.sh <short-name> if the user asks to publish.
```
