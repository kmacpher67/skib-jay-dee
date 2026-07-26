# Roadmap Handoff — v0.4.14

**Session date:** 2026-07-26
**Previous version:** v0.4.13-plan (docs-only RCA scoping, see
`docs/handoffs/roadmap-handoff-v0.4.13-plan.md`).

This was a Mode B coding session. The user pointed at three unblocked
candidates from the roadmap's incremental backlog (intro cinematic, face
crop on upload, level data extraction) and asked for one small increment.
Picked **face crop on upload** as the most self-contained of the three —
it doesn't depend on reading the PDF's intro script or touching the
level/map architecture.

## What this session did

1. **Oval-masked uploaded faces.** `frontend/src/components/FaceUpload.jsx`
   now runs every uploaded photo through a new `cropToOval()` helper:
   loads the file into an `Image`, center-crops it to a square on an
   offscreen 256x256 `<canvas>`, clips with an ellipse path, and
   re-exports as a PNG data URL before calling `onFace()`. Both the
   Runner and Chaser upload slots go through this since `App.jsx` wires
   both through the same component.
2. **No `GameEngine.js` changes needed.** `_drawEntity()` already just
   `drawImage()`s `entity.face` into the entity's square bounding box —
   once the uploaded image itself carries the oval alpha mask, the square
   corners render through to whatever's behind them automatically.
3. **Added `frontend/e2e/face-crop-verify.spec.js`.** Uploads a real
   asset (`jayden-default.jpg`) through the actual `<input type="file">`,
   confirms the preview `<img>` is a `data:image/png` (not the original
   raw file), then decodes that PNG on an in-page canvas and asserts a
   corner pixel is fully transparent (`alpha === 0`) while the center
   pixel is opaque.
4. **Manual visual verification.** Beyond the pixel-level test, took an
   in-game screenshot after uploading a real photo through Playwright and
   confirmed the sprite renders a clean oval face inside its square
   colored border, not a stretched raw square.
5. **Full suite pass.** All 8 Playwright specs (5 pre-existing + the new
   one) pass; `npm run build` succeeds.

## What's explicitly not done

- Default/gallery faces (`RUNNER_FACE_POOL`/`CHASER_FACE_POOL`) are
  unchanged — the roadmap item scoped this to *uploaded* faces only.
- No change to the square colored stroke `_drawEntity()` draws around
  each entity — only the photo inside it is now oval.
- `GAME_ITERATION` was not bumped and nothing was deployed, per the
  user's instruction for this session.
- The other two candidates from the shortlist — the World Star intro
  cinematic and level data extraction — are still open in
  `docs/roadmap.md`.

## Copy-paste: next natural steps for the next agent

```
Read docs/skib-sdlc.md (Mode B), then docs/update-directions.md, then
docs/roadmap.md, then this file (docs/handoffs/roadmap-handoff-v0.4.14.md).

Face crop on upload landed this session — nothing left to do there.

Two things are competing for "oldest unfinished handoff" status:
1. docs/handoffs/roadmap-handoff-v0.4.13-plan.md — RCA-first investigation
   of the lvl2 transition bug (fires too early, can crash after the video
   starts). This is the actual oldest open handoff per Mode B's normal
   ordering rule.
2. The remaining two items from this session's user-given shortlist:
   - Intro cinematic: script the PDF's "World Star" open
     (frontend/src/GameEngine.js, PDF: "Skib-jay-dee-toilet game-init-v1.pdf"
     at the repo root) as a pre-chase phase.
   - Level data extraction: move each level's walls/puddles/theme out of
     hardcoded buildXxx() functions in GameEngine.js into a plain data
     structure (see the "Plan: handling levels and new maps" section in
     docs/roadmap.md for the full multi-step sequence — only do step 1).

Unless the user says otherwise, default to the oldest-unfinished-handoff
rule (item 1, the lvl2 RCA) per docs/skib-sdlc.md Mode B step 2. Verify
with cd frontend && npm run build && npx playwright test. Update
docs/version-log.md, docs/update-directions.md, docs/roadmap.md,
docs/handoffs/ledger.md, and commit. Do not bump GAME_ITERATION or deploy
unless asked.
```
