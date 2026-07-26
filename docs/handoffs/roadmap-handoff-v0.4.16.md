# Roadmap Handoff — v0.4.16

**Session date:** 2026-07-26
**Previous version:** v0.4.15 (see `docs/handoffs/roadmap-handoff-v0.4.15.md`).

This was a Mode B coding session. The oldest unfinished handoff was
`docs/handoffs/roadmap-handoff-v0.4.15-plan.md`, whose copy-paste block
recommended fixing the Sheebs default and the skreem-loop bug first
(high-impact, unless the user said otherwise). Along the way, a
misplaced content file (`docs/handoffs/dad_case_handoff.md`) was found
and merged into its correct location.

## What this session did

1. **Fixed the initial Sheebs default.** `frontend/src/lib/cookies.js`'s
   `normalizeProfile()` fell back new/invalid `sheebs` values to `200`;
   it now falls back to `0`. Existing persisted profiles are unaffected
   (the fallback only applies when `profile.sheebs` isn't a finite
   number).
2. **Fixed the skreem-loop bug.** `frontend/src/App.jsx`'s
   `startMenuAudio()` was written as an autoplay-unlock "priming" hook
   (wired as `onPrimeAudio` on the menu's `onPointerDown`), but it
   actually called `getAudio(menuAudioRef, skreemLoopUrl, true, 0.22)` —
   real volume, `loop: true` — and played it for real. The very first
   pointer interaction on the menu started the player-scream clip
   looping audibly for as long as the user stayed there. It now primes
   the same `<Audio>` element silently (`loop: false`, `volume: 0`) and
   pauses itself once the browser's `play()` promise resolves, so future
   real playback (e.g. a dedicated menu-music track) is still unlocked.
3. **Merged misplaced Dad Case profile content.** Ken had filled in the
   Dad Case profile's real content, but saved it as a new file,
   `docs/handoffs/dad_case_handoff.md`, instead of editing the actual
   stub at `docs/profiles/dad-case.md`. Merged the content into the
   correct file and removed the duplicate from `docs/handoffs/`.
4. **Added regression coverage.** `frontend/e2e/menu-audio-prime.spec.js`
   monkey-patches `window.Audio` to record `play`/`pause` calls and their
   `loop`/`volume` values, clicks the menu, and asserts the priming call
   is silent, non-looping, and self-pausing. Verified this test fails
   against the pre-fix code (stashed the fix, rebuilt, served the old
   build standalone on a second port) before confirming it passes with
   the fix applied.
5. **Bumped the visible iteration and deployed.**
   `frontend/src/version.js` now reports `v0.4.16`.

## Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test` — full 10-test suite passes.
- Manually confirmed the new test fails against the pre-fix `App.jsx` by
  stashing the change, rebuilding, and serving the old build standalone
  (bypassing Playwright's `reuseExistingServer` webServer, which would
  otherwise mask a stale build) — the test failed as expected
  (`loop: true` instead of `false`), then passed once the fix was
  restored.

## What's explicitly not done

- **Version page** (menu panel showing `GAME_ITERATION` + changelog) —
  next unclaimed item from the v0.4.15-plan copy-paste block.
- **Game identity & new profiles** (multiple cookie-backed save slots) —
  last unclaimed item from that block; needs its own design pass before
  coding (the cookie helper currently assumes a single active profile).
- The Parody Attribute System (Panic/Grip/Scream/Sus) addendum is still
  plan-only.
- Two unrelated, uncommitted docs-only edits were found already sitting
  in the working tree at session start (`AGENTS.md` and
  `docs/skib-sdlc.md` — notes on `OPENROUTER_API_KEY` and keeping
  code-monkey slices small; `frontend/src/dialog.js` — Dad Case's lines
  added to `CHASER_LINES`). These look like legitimate in-flight work
  from a concurrent session, not something this session authored — left
  untouched and uncommitted here rather than bundled in, so whoever is
  mid-edit on them doesn't lose context. If no one claims them, the next
  session should just commit them as-is.

## Copy-paste: next natural steps for the next agent

```text
Read docs/skib-sdlc.md (Mode B), then docs/update-directions.md, then
docs/roadmap.md, then this file (docs/handoffs/roadmap-handoff-v0.4.16.md).

Before starting: `git status` first. Three files may still be sitting
uncommitted from a concurrent session (AGENTS.md, docs/skib-sdlc.md,
frontend/src/dialog.js) — read their diffs; if they look complete and
no one is actively mid-edit, just commit them as their own small commit
before picking up new work.

The oldest unclaimed items are the last two from the v0.4.15-plan block:
1. **Version page:** add a simple page/panel to the menu showing the
   current `GAME_ITERATION` (frontend/src/version.js) plus a short
   changelog, mirroring docs/handoffs/ledger.md. Front-end only.
2. **Game identity & new profiles:** let a player keep their existing
   cookie-backed profile and also start a new one (multiple save slots),
   cookie-only, no backend. Needs a short design pass on how slot
   switching interacts with the single-cookie assumption in
   frontend/src/lib/cookies.js before coding — consider flagging this
   as needing a quick product decision rather than guessing the UX.

Unless the user says otherwise, pick whichever of the two feels more
single-session-sized once you've looked at the current cookies.js/App.jsx
shape — the Version page is likely the smaller, safer pick to start with.

Verify with `cd frontend && npm run build && npx playwright test`.
Update docs/version-log.md, docs/update-directions.md, docs/roadmap.md,
docs/handoffs/ledger.md, and commit. Bump GAME_ITERATION and deploy only
once verified working locally.
```
