# Roadmap Handoff — v0.4.11-plan (docs-only)

**Session date:** 2026-07-26
**Previous version:** v0.4.10 (see `docs/handoffs/roadmap-handoff-v0.4.10.md`).

This was a docs review/audit session, not new feature planning. The ask
was to refresh and review `docs/roadmap.md` and `docs/handoffs/`, verify
what's actually done vs. started vs. still open, itemize anything
unfinished/unscheduled, and hand the next coding agent a clean starting
point. No code changed, no build was run, `GAME_ITERATION` stays
`v0.4.6`.

## What this session found

1. **The full v0.4.3-plan three-session backlog is genuinely done.**
   Verified directly against the code (not just the docs):
   `MAX_CHASERS = 5` (`GameEngine.js:306`), the Pipeworks
   `pipeworksSkreems`/`PIPEWORKS_MAX_PRESSURE_SKREEM_GOAL` gate, the
   `onLevelClear({ index, name })` payload, the `handleLevelClear`-based
   lvl2 video trigger, and the 15s-or-first-extra-chaser ambient delay
   are all present, building (`npm run build`), and passing the full
   6-test Playwright suite. This matches v0.4.10's own write-up.

2. **One checked-off item's verification doesn't fully hold up.**
   `docs/roadmap.md`'s "RESOLVED — no new death video" item was marked
   `[x]` in v0.4.10 with the reasoning "the video only appears after
   Pipeworks clears, so it no longer overlaps the catch state on
   arrival." That's true but incomplete: it only rules out the
   *arrival* overlap the original bug was about. Tracing
   `_startLevelAdvance()` (`GameEngine.js:688`) shows the `level-up`
   phase that blocks captures only lasts `phaseTimer = 1.25s`; once
   `phase` flips back to `'chase'`, captures resume immediately while
   the `<video>` overlay (`z-index: 15`, above `GameCanvas`) can still be
   rendering for several more seconds (up to App.jsx's 11s safety
   timeout). A capture in that window would still visually hide the
   jump-scare. Re-opened as its own item in `docs/roadmap.md` rather than
   silently re-checking the box — this is a real, traceable bug, not a
   hypothetical.

3. **Minor test-description staleness, not a bug.**
   `frontend/e2e/pipeworks-clear.spec.js` still says "4 chasers" in its
   title (left over from `MAX_CHASERS = 4`) and only forces 3 extra
   spawns. It still passes because it sets `pipeworksSkreems` directly
   rather than asserting an exact chaser count, so it isn't actually
   exercising the real 5-chaser gate. Logged in
   `docs/future-versions.md`, not fixed here (too small to be its own
   session, cheap to fold into whichever session touches Pipeworks
   next).

4. **v0.4.10's own suggested next step needs a caveat.** Its copy-paste
   pointed at "Audio 2: capture-line and chaser-bark voice clips, 1:1
   with text" as the next pickup. That item requires **recording actual
   voice clips per line** — it is not a pure coding task, an agent
   cannot generate real voice performances. Per `docs/skib-sdlc.md`'s
   Mode A rule ("flag anything Ken needs to do himself"), this is
   reprioritized below rather than handed to a coding agent as-is.

## Backlog re-triage (what's actually ready for a coding agent right now)

Ready, no outside dependency, ordered by size:

1. **Jump-scare/lvl2-video overlap fix** (found this session, item 2
   above). Smallest, and it's a latent correctness bug adjacent to work
   that just shipped — highest priority pick.
2. **Near-capture interlude** (`docs/handoffs/roadmap-handoff-v0.4.5-plan.md`)
   — already fully scoped and unblocked, its own clean increment.
3. **`pipeworks-clear.spec.js` description/coverage fix** — trivial,
   worth doing opportunistically alongside either of the above rather
   than as its own session.

Blocked on Ken (do not start without him):
- Audio 2 (1:1 voice clips) — needs real recordings.
- Second Yoodeling Unc pose — needs the photo dropped into `images/`.
- Distinct getting-captured/captured and uncaring/default photos — needs
  real distinct shots or confirmation to collapse the pool to 3 poses.

Larger/parked, not next:
- World Star intro cinematic, face-crop upload, level data extraction,
  cosmetic shop item, new character ability, multiplayer spike (do
  last).

## Copy-paste: next natural steps for the next agent

```
Read docs/skib-sdlc.md (Mode B), then docs/update-directions.md, then
docs/roadmap.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.11-plan.md).

Pick up the jump-scare/lvl2-video overlap fix first (small, self-contained,
front-end only):

1. In frontend/src/App.jsx and/or frontend/src/components/GameCanvas.jsx,
   hide the lvl2 transition video the instant the engine's phase becomes
   'caught' — e.g. add an effect keyed off a new onCaught-adjacent signal,
   or have GameCanvas expose the current phase so App.jsx can call
   hideLvl2Transition() as soon as a capture starts. Alternative: if you
   check the actual lvl2-transition.mp4 duration and it's short enough
   that the 1.25s level-up phase plus playback can never reach the next
   capture in practice, document that reasoning in docs/roadmap.md instead
   of changing code — but verify it with real numbers, don't assume.
2. While you're in frontend/e2e/pipeworks-clear.spec.js, update its title
   and the 3-spawn setup to say/use 5 chasers (MAX_CHASERS is now 5), so
   the test description matches reality. Small, do it in the same
   session.
3. Verify: cd frontend && npm run build, then npx playwright test (6
   tests must still pass), then drive a real capture in the browser
   shortly after a Pipeworks clear to confirm the jump-scare is now
   visible, not hidden behind the video.
4. Update docs/version-log.md, docs/update-directions.md, docs/roadmap.md
   (check off the reopened item), docs/handoffs/ledger.md, and create
   docs/handoffs/roadmap-handoff-vX.Y.Z.md, then commit (no push unless
   asked).

Next increment after that (already fully scoped, no further planning
needed): the near-capture interlude in
docs/handoffs/roadmap-handoff-v0.4.5-plan.md.

Do not start "Audio 2: 1:1 capture/bark voice clips" — it needs Ken to
record real voice clips first; ask him before treating it as a coding
task. Same for the second Yoodeling Unc pose and the distinct
getting-captured/captured photos — both need Ken to supply assets.

Stay front-end only, keep the 9:16 portrait layout, don't touch cookie
persistence, don't bump GAME_ITERATION or deploy unless explicitly asked.
```
