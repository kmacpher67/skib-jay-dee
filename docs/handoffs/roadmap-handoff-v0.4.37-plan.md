# Roadmap Handoff: v0.4.37-plan

**Session mode:** Mode A (Planning only)

This plan was retargeted after the latest gameplay feedback. The next
single-session slice is no longer the content-first polish pass; it is a
close-call feel pass that adds a 1-second freeze after the near-capture /
pre-kill skreem beat and pays sheebs for clean escapes and positive
pickups. Keep the broader dialog / badge / map-personality work parked
for later in `docs/future-versions.md`.

## Context

The current game already has two separate recovery beats:

- the funny near-capture interlude in `near-capture`
- the post-capture `resume-countdown` beat

The new ask is about the first one. When the chaser gets too close and
the pre-kill skreem beat fires, the player needs a short 1-second breather
before the chase resumes so they can re-center their fingers on mobile
and actually recover from the warning.

At the same time, the clean escape and pickup economy needs a tiny bump:

- +50 sheebs for escaping the close call
- +5 sheebs for picking up a positive reward item

## Work to do

1. **Add the close-call freeze.**
   - Read `docs/close-call-freeze.md` first.
   - Update `frontend/src/GameEngine.js` at the near-capture branches
     around the phase checks at lines ~937, ~942, ~947 and the trigger
     points at ~1768 and ~1782.
   - Add a 1-second pause after the existing near-capture beat resolves.
     Prefer a tiny dedicated phase/timer if that keeps the current
     `near-capture` and `resume-countdown` meanings separate.
   - Do not touch the post-capture `resume-countdown` flow.

2. **Wire the reward payouts.**
   - Award +50 sheebs once when the runner cleanly escapes the close-call
     beat.
   - Award +5 sheebs when the runner picks up a positive reward item.
   - Keep the positive item list data-driven in `frontend/src/gameContent.js`
     so `Jayden Gun`, `Schleimy Potion`, `Taco Bell Grande`, and future
     positive pickups can share one flag or reward field.
   - Keep the `Slippery When Wet` badge aligned with the same close-call
     escape event so the badge and the sheeb payout cannot drift apart.

3. **Add focused tests.**
   - Add a Playwright spec that forces a close call and asserts the chase
     pauses for roughly 1 second before resuming.
   - Add or extend a Playwright spec that proves the close-call escape
     gives +50 sheebs and a positive pickup gives +5 sheebs.
   - Keep the tests deterministic and as small as possible; use the
     existing `window.__skibEngine` debug-hook pattern if it helps.

4. **Update docs if needed after the code lands.**
   - Update `docs/gameplay-mechanics.md` or a more targeted spec if the
     implementation needs a permanent note.
   - If the next shipped version changes, update
     `docs/version-log.md`, `docs/handoffs/ledger.md`,
     `docs/update-directions.md`, `docs/roadmap.md`, and
     `frontend/src/components/VersionModal.jsx` per the normal session
     checklist.

## Execution constraints

- Front-end only.
- Keep the portrait 9:16 layout.
- Do not bump `GAME_ITERATION` or deploy unless the user explicitly asks.
- Keep the current content-first fun pass parked for later.
- Do not change the post-capture `resume-countdown` beat while doing
  this work.

## What’s explicitly not done

- The content-first polish slice is still open, but it is not the next
  session anymore.
- No code changed in this planning session.
- No build, test, deploy, or version bump was run.

## Code Monkey lane

```text
code_monkey_backend="ollama"
code_monkey_model="thinkpad-local"
```

## To dispatch via code monkey:

```text
Read `docs/skib-sdlc.md`, `docs/close-call-freeze.md`, `docs/update-directions.md`, `docs/roadmap.md`, and the near-capture branches in `frontend/src/GameEngine.js` first.

Implement the close-call freeze, +50 sheebs on a clean near-miss, and +5 sheebs on positive pickup collection. Keep the post-capture `resume-countdown` beat untouched and keep the positive-pickup mapping data-driven in `frontend/src/gameContent.js`.

Add the smallest Playwright coverage that forces a close call and verifies the 1-second freeze plus the sheeb payouts. If you need a second spec, make it focused and deterministic.

Verification:
- `cd frontend && npm run build`
- `cd frontend && npx playwright test`
```
