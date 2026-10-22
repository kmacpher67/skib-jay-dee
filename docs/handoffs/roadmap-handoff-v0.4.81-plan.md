# Roadmap Handoff Plan v0.4.81 — Wire the Boom Stick Splat Sound

**Created by:** Claude Sonnet 5.5
**Created on:** 2026-10-22
**Last updated by:** Claude Sonnet 5.5
**Session mode:** Mode A (planning only — docs only; no code, no build, no version bump, no deploy)

Sequencing: v0.4.80 is reserved for the issue #9 chaser wall-spawn fix
(`roadmap-handoff-v0.4.80-plan.md`). This slice ships after it, or in
whatever order Ken picks. If v0.4.80 ships first, use the next patch
number at ship time.

## Why

Ken supplied a fart sound for the splat and it was dropped over the
placeholder `frontend/src/assets/audio/boom-stick-splat.mp3` (committed
`b757e7e`). A deploy then published nothing, because no code imports the
file, so Vite never bundles it. None of the `boom-stick-*.mp3` stubs are
wired. This slice wires only the splat clip, as the first piece of Slice E.

## Bounded implementation slice

Play `boom-stick-splat.mp3` once per blast, at the moment the splotches
are stamped. The stamp point is `_stampAllSplotches()` in
`frontend/src/GameEngine.js` (about line 2636). It runs once per cutaway:
at the 0.62s mark normally, or up front under reduced motion, guarded by
`c.stamped`.

1. `GameEngine.js`: add an `onSplat` option to the constructor, defaulted
   to a no-op next to `onShart`. Call `this.onSplat()` inside
   `_stampAllSplotches()` right after `c.stamped = true`. That gives one
   sound per blast, not one per victim.
2. `components/GameCanvas.jsx`: accept `onSplat` and pass it into the
   `GameEngine` options, same as `onShart`.
3. `App.jsx`: import the file as
   `import boomStickSplatUrl from './assets/audio/boom-stick-splat.mp3'`,
   add `const handleSplat = () => playOneShot(boomStickSplatUrl, 0.6)`
   beside `handleShart`, and pass `onSplat={handleSplat}` to `GameCanvas`.
   `playOneShot` already respects the mute flag, so no extra mute code.

Do not wire the other `boom-stick-*.mp3` stubs or any `bs-*` voice files
in this slice. Do not add subtitles. Do not change splotch art, cutaway
timing, or the blast logic.

## Known quirk (not a blocker)

The clip is 1.32s. The brief (`docs/splat-effects-brief-for-alex.md`)
asked for under 0.5s. Cutaway max is 1.75s, so it fits, but a fast second
blast restarts the clip because `playOneShot` resets `currentTime`. That
is acceptable. Ken may trim the file later with no code change.

## Verification contract

Add a small Playwright test (pattern: `frontend/e2e/boom-stick-d-cutaway.spec.js`,
using `window.__skibEngine`) that:

- replaces `engine.onSplat` with a counter, fires a blast with 2+ exploding
  victims, and asserts the counter is exactly 1 after the cutaway ends; and
- repeats under `prefers-reduced-motion: reduce` and asserts exactly 1.

Then confirm the build bundles the clip:
`ls frontend/dist/assets | grep -i boom-stick-splat` must list one file.

Run:

```text
cd frontend && npm run build && npx playwright test
```

Per the current AGENTS.md rule, on a green run bump `GAME_ITERATION`,
update the version page (`VersionModal.jsx`; the "Still to come" entry
should drop the splat sound), update the SDLC docs and ledger, commit,
and deploy with `./scripts/deploy-static.sh splat-sfx`.

## Explicitly not done in this handoff

- Slice E remainder: subtitles, `boom-stick-blast`, `-shatter`, `-reload`,
  `-pickup` wiring.
- Slice F: voice assets (blocked on Ken's recordings and approval).
- Trimming the fart clip to the 0.5s brief.

## Copy-paste: next coding session

```text
Work in Mode B. Read docs/skib-sdlc.md, docs/update-directions.md,
docs/roadmap.md, and docs/handoffs/roadmap-handoff-v0.4.81-plan.md.

Implement only the splat sound wiring. In frontend/src/GameEngine.js add
an onSplat option (no-op default beside onShart) and call this.onSplat()
inside _stampAllSplotches() right after c.stamped = true. Pass onSplat
through frontend/src/components/GameCanvas.jsx. In frontend/src/App.jsx
import ./assets/audio/boom-stick-splat.mp3, add
handleSplat = () => playOneShot(boomStickSplatUrl, 0.6), and pass
onSplat={handleSplat} to GameCanvas. Do not wire other boom-stick audio.

Add a Playwright test asserting exactly one onSplat call per blast, with
and without reduced motion. Confirm frontend/dist/assets contains
boom-stick-splat. Run `cd frontend && npm run build && npx playwright test`.
If green: bump GAME_ITERATION, update VersionModal and the SDLC docs and
ledger, commit, deploy with ./scripts/deploy-static.sh splat-sfx.
Stop after this slice.
```

Dispatch hints: `code_monkey_backend=ollama`,
`code_monkey_model=thinkpad-local`. Three tiny edits plus one test, so a
single copy-paste is small enough for the local model.
