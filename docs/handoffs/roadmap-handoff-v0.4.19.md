# Roadmap Handoff — v0.4.19

**Session date:** 2026-07-26
**Previous version:** v0.4.19-plan (see `docs/handoffs/roadmap-handoff-v0.4.19-plan.md`).

This was a Mode B implementation session. It also opened with a full
backlog/ledger review across every `docs/handoffs/roadmap-handoff-*`
file to confirm nothing older was left half-done before picking up new
work.

## Backlog review (done before any code)

Read every handoff and plan file plus `docs/roadmap.md` and
`docs/handoffs/ledger.md` end to end. Findings:

- The only genuinely unblocked, fully-specced, not-yet-implemented item
  was the v0.4.19-plan audio wiring — Ken had already uploaded
  `door-sounds.m4a` and `lights.m4a` to `frontend/src/assets/audio/`,
  unblocking it. This session implemented it.
- Found one **stale roadmap checkbox**: "Code Monkey: host-profile
  routing" was still unchecked in `docs/roadmap.md` even though the
  ledger's "Code Monkey host-profile routing pass" entry and the actual
  code (`scripts/code_monkey_resolve_backend.py`,
  `scripts/code_monkey_direct.py`) show it landed already. Corrected the
  checkbox and added a short note rather than re-doing the work.
- Everything else still open in `docs/roadmap.md` (deaths history log,
  sheebs penalty on capture, level-1 advance threshold tuning, dead
  `initialSheebs` default, game identity/new profiles, 1:1 voice clips,
  intro cinematic, cosmetic shop item, level data extraction, new
  character ability, Yoodeling Unc second pose, distinct
  getting-captured/uncaring photos, multiplayer spike) is confirmed
  genuinely unimplemented — verified against the actual code, not just
  the docs. Two of those (Yoodeling Unc second pose, distinct runner
  photos) are still blocked on Ken supplying image assets.

## What this session did

1. **Wired real Dad Case audio**, replacing the v0.4.17 text stub:
   - `frontend/src/App.jsx` imports `door-sounds.m4a` and `lights.m4a`.
   - `handleExtraChaserSpawn` now calls `playOneShot(dadCaseDoorUrl, 0.6)`
     and `playOneShot(dadCaseLightsUrl, 0.6)` together when `faceId ===
     'dad-case'`.
   - Removed the `*DOOR SLAM SOUND*` placeholder `<div>` and the now-dead
     `.dad-case-sound-text` CSS class in `frontend/src/index.css`. The
     `.dad-case-darkness` overlay itself is unchanged (still renders on
     spawn, resets on caught/play/level-change).
2. **Refreshed the version log panel** (`VersionModal.jsx`): added a
   v0.4.19 entry, and simplified the component to render
   `PAST_VERSION_NOTES` directly instead of separately injecting a
   hardcoded "current iteration" entry — that pattern would have gone
   stale on every future bump (it already had, showing "Version page
   lands" as the v0.4.19 headline before this fix).
3. **Fixed the stale roadmap checkbox** noted above.
4. **Verified and shipped:** rebuilt the frontend, ran the full
   Playwright suite (11/11 pass), bumped `GAME_ITERATION` to `v0.4.19`,
   updated `docs/version-log.md`, `docs/update-directions.md`,
   `docs/roadmap.md`, and `docs/handoffs/ledger.md`.

## What was explicitly skipped

- Did not touch any of the other open backlog items listed above —
  each is its own single-session increment per `docs/skib-sdlc.md`.
- Did not deploy to the live site in this pass — ask before running
  `scripts/deploy-static.sh`, since it pushes to a different repo
  (`kenmacpherson.com`).

## Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test` (11/11 pass)

## Copy-paste: next natural steps for the next agent

```text
Read docs/skib-sdlc.md (Mode B), then docs/update-directions.md, then docs/roadmap.md, then docs/gameplay-mechanics.md, then this file (docs/handoffs/roadmap-handoff-v0.4.19.md).

Backlog was fully reviewed this session — every open item in docs/roadmap.md is confirmed still genuinely unimplemented (not just stale docs). Oldest-first, fully unblocked, not needing more product input from Ken:

1. **Remove dead `initialSheebs = 200` default** in GameEngine.js's constructor (one-line cleanup, `App.jsx` always passes the real profile value so this never fires — safe to bundle with #2 below since both touch GameEngine.js).
2. **Sheebs penalty on capture.** Add a flat sheebs penalty constant (e.g. `-20`, floored at 0) next to `DEATH_SKREEM_PENALTY` in GameEngine.js. The "-20 flat" number is Ken's original ask but unconfirmed against the 40/60/90/120/160 per-level reward scale — ship -20 flat and note it's tunable unless Ken says otherwise.
3. **Deaths history log.** The menu's "Deaths" pill in App.jsx is a read-only lifetime counter with no click handler. Add a per-death record to the cookie profile and a small panel that opens on tap. Simplest shape: "last N deaths" (timestamp + level), not full per-chaser detail, unless Ken wants more.

Items needing Ken's input before coding (do not guess):
- **Tune the level-1 -> Pipeworks advance threshold** — needs actual playtesting to pick a number, not a formula guess.
- **Game identity & new profiles (multiple save slots)** — needs a bit of design thought on how slot switching interacts with the single-cookie assumption in `frontend/src/lib/cookies.js`.
- **Yoodeling Unc second pose** and **distinct getting-captured/uncaring runner photos** — both blocked on Ken supplying image assets to the repo.

Verify with `cd frontend && npm run build && npx playwright test`.
Update docs/version-log.md, docs/update-directions.md, docs/roadmap.md, docs/handoffs/ledger.md, and commit. Bump GAME_ITERATION and deploy only once verified working locally — deploy pushes to a separate repo (kenmacpherson.com), so confirm with Ken first if that's not already standing instruction.
```
