# Roadmap Handoff — v0.4.27-plan

**Session mode:** Mode A (Planning / RCA)
**Session date:** 2026-07-26
**Status: ROOT-CAUSE FOUND, FIX ALREADY COMMITTED, NOT YET DEPLOYED.**
Only remaining action is a deploy — see "What's actually left" at the
bottom. This is the highest-priority item in the backlog: production is
currently broken for every visitor.

## Trigger

Ken shared a screenshot of the live menu at
`kenmacpherson.com/skib-jay-dee-toilet-game/` showing broken-image icons
in both the "Your Face (Runner)" and "Skib (Chaser)" preview boxes.

## Root cause (confirmed against the live site, not guessed)

The **currently deployed** production build (commit `84bf087`, `v0.4.24`)
stores the **entire face-pool entry object** (`{ id, label, src }` from
`RUNNER_FACE_POOL` / `CHASER_FACE_POOL` in `frontend/src/gameContent.js`)
directly in the `runnerFace` / `chaserFace` React state in
`frontend/src/App.jsx`:

```js
// v0.4.24 (deployed), frontend/src/App.jsx
const [runnerFace, setRunnerFace] = useState(() => randomFaces().runnerFace)
const [chaserFace, setChaserFace] = useState(() => randomFaces().chaserFace)
```

That object is passed straight through as `previewSrc` to
`frontend/src/components/FaceUpload.jsx`, which renders
`<img src={previewSrc} />`. React/the browser coerces the object to the
string `"[object Object]"` for the `src` attribute, so it requests
`.../skib-jay-dee-toilet-game/%5Bobject%20Object%5D`, which 404s — hence
the broken-image icon. This fires on **every page load, for both boxes,
unconditionally** — not intermittent, since the random pick always
returns an object, never a string.

Verified two ways:
1. A headless Playwright script pointed at the **live production URL**
   captured both `<img>` elements resolving to
   `src=".../skib-jay-dee-toilet-game/[object%20Object]"` with a `404`
   response and `naturalWidth: 0`.
2. Ruled out the alternative theories first: rebuilt locally and diffed
   the deployed JS bundle against a fresh build — both correctly append
   `.href` to the `new URL(...)` Vite asset resolution (not a Vite/asset
   pipeline bug), and confirmed several pool entries are byte-identical
   duplicate source photos via `md5sum` (a separate, lower-severity,
   already-known issue — causes some entries to silently show the wrong
   photo, not a broken icon — tracked in the v0.4.6 update-directions
   entry and `docs/characters.md`, not the cause of this bug).

This is **not a new regression** — `RUNNER_FACE_POOL`/`CHASER_FACE_POOL`
have been arrays of `{id, label, src}` objects since the `c699164`
"Upgrade toilet game front end" commit, and the two `useState`
initializers were never updated to unwrap `.src`. It's been live and
broken since around then.

## The fix landed mid-session, by Ken directly

While this RCA was in progress, Ken committed the pending
`v0.4.25` work (`8339417 "v0.4.25 post-kill profile pages"`) from a
parallel session. That commit happens to include the correct fix as a
side effect of an unrelated rename done for the new profile-modal
feature:

```js
// now committed at HEAD, frontend/src/App.jsx
const [runnerFaceSelection, setRunnerFaceSelection] = useState(() => randomFaces().runnerFace)
const [chaserFaceSelection, setChaserFaceSelection] = useState(() => randomFaces().chaserFace)
...
const runnerFace = runnerFaceSelection?.src ?? null
const chaserFace = chaserFaceSelection?.src ?? null
```

`frontend/src/version.js` now reads `v0.4.25` at `HEAD`. Re-verified
after the commit landed:

- `cd frontend && npm run build` succeeds.
- `npx playwright test` — 12 passed, 1 pre-existing skip
  (`resume-countdown.spec.js`, unrelated to this fix).
- Served the fresh `dist/` locally (`vite preview`) and ran a headless
  check against it: both face preview `<img>` elements resolved to real
  photo assets with nonzero `naturalWidth` and zero failed requests —
  the fix works.

## What's actually left

The code fix is committed and verified. It is **not deployed** —
`~/personal/website/kenmacpherson.com`'s newest deploy commit is still
`0328c9f ... v0.4.24 v0.4.24-resume-countdown`; there is no `v0.4.25`
entry there yet. The live site visitors see right now is still the
broken `v0.4.24` build.

```text
Read docs/skib-sdlc.md (Mode B) first.

The fix for the broken face-preview images is already committed at HEAD
(commit 8339417, "v0.4.25 post-kill profile pages") and already verified
in this session (npm run build + full Playwright suite pass, manual
headless check against a local `vite preview` confirms both face
previews load real images with no failed requests).

There is nothing left to code for this specific bug. The only remaining
step is to deploy what's already on HEAD:

1. Confirm `frontend/src/version.js` still reads `v0.4.25` (it does as of
   this handoff).
2. Run `cd frontend && npm run build && npx playwright test` one more
   time immediately before deploying, in case anything has changed since.
3. `./scripts/deploy-static.sh <short-name>` from the repo root (e.g.
   `post-kill-profile-facefix`).
4. After deploying, spot-check the live menu in a real browser (reload
   several times — the face pool is randomized, so multiple reloads
   exercise more pool entries) to confirm no broken-image icons.
5. Update `docs/handoffs/ledger.md` and `docs/update-directions.md` to
   note the deploy happened (the version-log/roadmap entries for v0.4.25
   already exist from the commit that landed the code).
```

## Docs-drift note (now resolved by the commit, flagged for awareness)

Before `8339417` landed, `docs/roadmap.md` and
`docs/update-directions.md` disagreed with each other and with the repo
state: roadmap.md checked off the v0.4.25 items as "Landed," while
update-directions.md said v0.4.25-plan was "still open," and
`frontend/src/version.js` was still `v0.4.24` with no matching deploy
commit anywhere. That's no longer a contradiction now that the code is
actually committed — but the **deploy** step described above still
hasn't happened, so don't assume "Landed" in the docs means "live in
production." Those are two different things in this repo (commit vs.
deploy), and it's worth double-checking that distinction on any future
"is this actually live" question rather than trusting a roadmap checkmark
alone.

## What's explicitly not done this session

- No new code was written this session — the fix was already sitting in
  a pending commit that a parallel session landed independently.
- Did not run `deploy-static.sh` — deploys are a "commit progress and
  hand off" boundary the user should explicitly confirm, and the current
  ask was RCA + handoff, not "ship it."
- Did not touch the separate, still-open `v0.4.26-plan.md` (sheebs debt /
  item-loss economy), which remains blocked on Ken's product decisions
  and queued behind this deploy.
