# Future Version Planning

Work items that are known, scoped-ish, and explicitly **not** part of the
current version. Pull from here into `docs/roadmap.md`'s incremental
backlog when you pick one up, and remove it from this file once it lands
(the ledger and version-log are the permanent record, not this doc — this
is a parking lot, not an archive).

## Audio polish (follow-up to v0.4.0)

- **Volume balance / ducking.** The ambient chase loop, chaser barks, and
  the capture sting currently just layer on top of each other at fixed
  volumes (`frontend/src/App.jsx`). A real pass would duck the ambient
  loop when a bark/sting plays, and let the user split music vs. SFX
  volume instead of one mute-all toggle.
- **Capture-line and chaser-bark clips that match the on-screen text
  exactly.** Right now the audio pool (`CHASER_BARK_URLS` in `App.jsx`)
  plays a random voice clip alongside a random `CHASER_LINES` text line —
  they're thematically related but not paired 1:1. Recording a dedicated
  clip per line (per the original Audio 2 backlog item) would let the
  bubble text and the voice line always match.
- **Menu loop vs. capture sting should be different clips.** They already
  are as of v0.4.0 (`jayden-skreem-loop.m4a` for menu,
  `capture-sting-final.mp3` for the catch) — what's still missing is a
  proper composed menu theme instead of a repurposed voice clip.

## Lvl2 video transition (follow-up to v0.4.0)

- The clip itself (`frontend/src/assets/video/lvl2-transition.mp4`) was
  user-flagged as rough ("sux bad") — treat the current wiring as a
  proof-of-concept, not a final asset. Replace the clip, or replace the
  whole approach with the scripted intro-cinematic plan below, once
  there's a better source video.
- Currently only fires once per run, hardcoded to level index 2, and it
  now waits for the Pipeworks hall-coverage / 4-skib survival gate before
  mounting. If more levels get transition clips, generalize this into a
  `transitionVideoUrl` field per level in the `LEVELS` array
  (`frontend/src/GameEngine.js`) instead of a special-cased check in
  `App.jsx`.
- No skip button — a player who doesn't want to sit through it has to
  wait for `onEnded` or the 11s safety timeout. Add a tap-to-skip
  overlay control.

## Known bug found during v0.4.0 testing (not fixed)

- `.portrait-frame`'s `@media (min-aspect-ratio: 9/16)` rule in
  `frontend/src/index.css` inverts on wide desktop viewports: at a
  standard 1280×720 test viewport it switches to `width:100%; height:auto`
  which (combined with `aspect-ratio: 9/16`) makes the frame ~2275px tall,
  vertically centered and clipped by `.stage`'s `overflow:hidden`. Content
  anchored to the true center (like `.play-btn`) still renders on-screen
  by luck, but anything absolutely positioned near the frame's top/bottom
  edge (the new `.mute-btn-menu`, the existing `.exit-btn`) ends up
  clipped off-screen. Worked around in the new Playwright mute-toggle test
  by forcing a phone-portrait viewport rather than fixing the CSS — the
  media query's actual intent needs to be worked out (it was presumably
  meant for real phones held in landscape, not desktop browser windows)
  before touching it for real.

## Test coverage gap (follow-up to the chaser face randomization fix)

- No automated test exercises `_maybeSpawnExtraChaser()`
  (`frontend/src/GameEngine.js`) — it only fires after 14s of
  uninterrupted chase, which is too slow for the existing Playwright
  smoke suite, and there's no unit-test harness for `GameEngine` outside
  the browser/canvas. The chaser-face-randomization fix (landed
  v0.4.2-plan) was verified by code inspection instead of a test. If
  more `GameEngine` logic needs fast, deterministic tests going forward,
  consider either a test-only time-skip/seam on the chaser-spawn timer,
  or a lightweight unit-test setup (e.g. vitest + jsdom) that can
  instantiate `GameEngine` without a real animation loop.

## Still-open items carried from docs/roadmap.md

These were already tracked before this version and remain open — see
`docs/roadmap.md` for full detail, this is just a pointer so they don't
get lost:

- Intro cinematic (the PDF's "World Star" open).
- Oval/masked face-crop on upload instead of stretch.
- Level data extraction out of hardcoded `buildXxx()` map functions.
- Shop item: cosmetic sink (or another cosmetic-only sheeb sink).
- New character/ability from the PDF roster (Raman-Aunt-Toilet Lady).
  Skib-Daddy landed in v0.4.38.
- Multiplayer spike (Phase 5) — biggest single item, do last.

## Long-Term (LT) roadmap (new 2026-07-27)

Three LT-horizon items dictated by Ken, design-only, sequenced by his own
priority order (finish the arc, then Role Reversal, then MOBA/PvP): see
[docs/roadmap.md](roadmap.md#long-term-lt-roadmap) for the summary and
[roadmap-handoff-v0.4.43-plan.md](handoffs/roadmap-handoff-v0.4.43-plan.md)
for the full writeup and refinement questions.

- Finish the grand arc — Level 10 as the final scene (open reconciliation
  against the existing Level 7 "CEO of Drains" climax plan in
  [level-progression-and-endgame-plan.md](level-progression-and-endgame-plan.md)).
- Role Reversal — players choose chaser or runner. Recommended smallest
  first slice: single-player vs. an AI runner, before any multiplayer work.
- MOBA/PvP mode (2v2 or 4v4 deathmatch-style) — depends on the Phase 5
  multiplayer spike above landing for real first.

## Interactive content seasoning (follow-up to v0.4.35)

The next funniest pass should keep leaning on map identity and small
tradeoff items, not just bigger numbers.

- Map personality pass: anchor room, risky shortcut, gag room, reward
  room. The levels are playable now, but they still need more memorable
  landmarks.
- Secret item catalog: runner-good, runner-bad, chaser-good, and
  chaser-bad pickups, all documented in
  [docs/interactive-content-pack.md](interactive-content-pack.md).
- Future badge seeds: `Bathroom Tourist`, `Dead-End Daredevil`,
  `Gremlin in the Pipes`, and `Chaser Tax Audit`.

## Content-pass follow-up to v0.4.37-plan

- The close-call freeze / reward pass **landed in v0.4.37** — no longer the
  next slice.
- If the next content slice gets too large, defer any extra level-callout
  variants or menu-brag subfields here so the first pass stays small.
- Keep the balance-number tuning as a separate future item instead of
  letting it crowd out the dialog / badge / map-personality work.
- Add at least one focused Playwright check for the new dialog, badge,
  or menu surface when the code lands; the current suite does not cover
  these content surfaces yet.
