# Roadmap Handoff — v0.4.4

**Session date:** 2026-07-26
**Previous version:** v0.4.0 shipped (see `docs/handoffs/roadmap-handoff-v0.4.0.md`);
most recent docs-only session was v0.4.3-plan.

This was a Mode B (code and delivery) session. It picked up the oldest
open/unfinished handoff, `docs/handoffs/roadmap-handoff-v0.4.1-plan.md`,
per `docs/skib-sdlc.md`'s ordering rule, and implemented exactly one of
its two remaining unblocked items: the new Sky-Diver (Motor Killer)
chaser. `GAME_ITERATION` stays `v0.4.0` and nothing was deployed — no
publish was requested this session.

## What this session did

1. **Added the Sky-Diver (Motor Killer) chaser.**
   - Copied `images/sky-diver-motor-killer.png` (repo-root scratch,
     already on disk from the v0.4.1-plan session) into
     `frontend/src/assets/sky-diver-motor-killer.png`.
   - Imported it in `frontend/src/gameContent.js` and added it to
     `CHASER_FACE_POOL` as `{ id: 'sky-diver-motor-killer', label:
     'Sky-Diver (Motor Killer)', src: skyDiverMotorKiller }` — the tenth
     entry in the pool, following the same pattern as `crazy-jack-chaser`.
   - No `GameEngine.js` changes needed — new pool entries are picked up
     automatically by the existing `randomFrom(CHASER_FACE_POOL)` calls
     (menu-selected default, and each independently-spawned extra chaser).
2. **Updated `docs/characters.md`** — moved Sky-Diver from "planned new
   chasers" into the chaser roster table, and trimmed the planned section
   down to the one remaining blocked item (Yoodeling Unc second pose).
3. **Checked off the roadmap item** in `docs/roadmap.md`'s incremental
   backlog.

## Verification performed

- `cd frontend && npm run build` succeeds; `dist/assets/` includes the
  new `sky-diver-motor-killer-*.png` bundle.
- `npx playwright test` (existing smoke suite) passes, 3/3.
- Additionally ran `vite preview` and drove it with a headless Chromium
  session via the project's installed Playwright, with
  `Math.random` monkey-patched to force `randomFrom()` to resolve to the
  pool's last entry (the new Sky-Diver one). Confirmed:
  - The browser issues a real network request for
    `sky-diver-motor-killer-*.png` and it resolves 200.
  - No console or page errors during menu load and Quick Play.
  - This exercises the same `new Image()` load path
    (`frontend/src/components/GameCanvas.jsx`'s `loadImage()` /
    `setFaces()`) used by every other pool entry, so the new asset is
    confirmed wired correctly end-to-end, not just present in the bundle.

## What's explicitly not done

- **Runner pose-to-state mapping** — the other unblocked item from
  `roadmap-handoff-v0.4.1-plan.md`. Not started this session, kept as a
  separate increment per the single-session sizing rule. See
  `frontend/src/gameContent.js`'s `RUNNER_FACE_POOL` / `randomFaces()`
  and `docs/characters.md`'s runner pose table.
- **Yoodeling Unc, second pose** — still blocked. The costume photo has
  not been saved to `images/`. Don't start this until the user drops the
  file in.
- No `GAME_ITERATION` bump, no build/deploy beyond local verification —
  not requested this session.
- The four items queued from the v0.4.2-plan session (speed-ramp →
  clear-condition → video-timing → death-visual verification) were not
  touched — they're a separate, already-fully-planned backlog (see
  `docs/next-agent-coding-brief.md`), and this session deliberately
  finished clearing the older v0.4.1-plan handoff first per the "oldest
  unfinished handoff" ordering rule.

## Copy-paste: next natural steps for the next agent

```
Read docs/skib-sdlc.md (Mode B: oldest open/unfinished handoff first),
then docs/update-directions.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.4.md).

Two backlogs are now open, both fully unblocked-or-documented:

1. Runner pose-to-state mapping (leftover from v0.4.1-plan, ready now):
   frontend/src/gameContent.js's RUNNER_FACE_POOL has five Jayden poses
   but randomFaces() only ever picks one per run. Keep the random
   default pick for whichever pose starts a run (and keep custom
   uploaded faces unchanged), but additionally swap the runner's face to
   jayden-getting-captured on the jump-scare beat and jayden-captured on
   the "YOU DIED"/caught screen. See docs/characters.md's runner pose
   table for what each id represents, and frontend/src/GameEngine.js for
   where the jump-scare and capture/death beats fire.

2. The v0.4.2-plan backlog (speed-ramp -> clear-condition -> video-timing
   -> death-visual verification), fully spec'd with exact edits in
   docs/handoffs/roadmap-handoff-v0.4.3-plan.md and
   docs/next-agent-coding-brief.md. Higher priority per direct user
   playtest feedback, but it's a separate multi-item sequence from item 1
   above — don't mix the two into one session.

Still blocked on the user: Yoodeling Unc's second costume photo has
never been saved to images/ — don't start that item.

Pick ONE increment per session per docs/skib-sdlc.md's sizing rule.
After implementing: cd frontend && npm run build must succeed; drive the
canvas for real (see docs/dev-notes.md's headless-Chrome approach, or
this session's Math.random-forcing trick for verifying a specific face
pool entry actually loads). Then update docs/version-log.md,
docs/update-directions.md, docs/roadmap.md, a new
docs/handoffs/roadmap-handoff-vX.Y.Z.md, and docs/handoffs/ledger.md.
Commit your work. Do not bump GAME_ITERATION or run
./scripts/deploy-static.sh unless the user explicitly asks to publish.
```
