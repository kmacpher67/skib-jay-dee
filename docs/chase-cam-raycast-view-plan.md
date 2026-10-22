# Chase-Cam / Raycast View Mode — Technical Strategy and Roadmap Guide

**Created by:** Claude Sonnet 5.5 — 2026-10-22
**Created on:** 2026-10-22
**Last updated by:** Claude Sonnet 5.5 — 2026-10-22
**Last updated on:** 2026-10-22
**Session mode:** Mode A (planning / architecture — docs only, no code, no build, no version bump, no deploy)

Purpose: evaluate a Duke Nukem 3D / Wolfenstein-style pseudo-3D "chaser is
behind Noob-Noob (Jayden)" presentation, record the technical strategy,
and list the open content, rules and parody questions so a GitHub roadmap
issue (`roadmap` label, template `.github/ISSUE_TEMPLATE/roadmap-item.md`)
can point here. Nothing in this doc is a decision by Ken unless it says so.
Per `docs/skib-sdlc.md`, a recommendation written here is **not** a settled
decision; every item under "Open decisions" needs Ken's answer before a
code-ready handoff is written.

## 1. Origin and ask

Ken saw a search result about DOOM running natively in browsers
(WebAssembly/Emscripten, WAD files, Freedoom, HTML5 canvas) and asked:

- Could we do a Duke Nukem-style of play where the chaser is behind
  noob-noob (nickname for Jayden)?
- Would it be a memory issue?
- How could we switch to this new mechanic?

The exact meaning of "behind" is **not yet settled** (see Open decisions
D1). Three readings are evaluated below.

## 2. Current architecture (verified in code, 2026-10-22)

- Frontend only: React 18 + Vite 5, **no game-engine or 3D dependencies**
  (`frontend/package.json`).
- `frontend/src/GameEngine.js` (~3.4k lines) owns simulation **and**
  rendering in one class. `draw()` (around line 2771) clears the canvas,
  applies a camera that keeps the runner at screen center
  (`_applyCamera`), then draws map, trails, pickups, entities and HUD in
  2D.
- Canvas is portrait: `VIEW_H = 640`, `VIEW_W = 640 * aspect` (about 360
  for 9:16), set at ~line 463.
- Maps are character grids in `frontend/src/mapGrids.js` (`.` open,
  `#` wall, ~90 columns wide). That is exactly the input a raycaster
  needs.
- `isChaserMode` already exists as a mode flag (human plays the chaser,
  AI runner flees). It is the template for adding a view/mode flag.
- Input is touch joystick plus buttons mapped in screen space
  (`VIEW_W`, `VIEW_H` helpers near lines 820–870).

Key consequence: simulation (positions, collisions, chasers, perks, Boom
Stick) is already grid-based 2D. A pseudo-3D view can be a **second
renderer over the same state**, not a second game.

## 3. Memory and performance evaluation

**Verdict: memory is not the risk. CPU/fill-rate, controls and content
cost are.**

| Item | Estimate | Notes |
|---|---|---|
| Raycaster code | a few KB | DDA grid raycast, no libraries needed |
| Framebuffer | ~1 MB | 360x640 RGBA; render at lower internal resolution (e.g. 180 columns) and upscale |
| Wall textures | small | Reuse flat colors / a few tiny tiles; no WAD files |
| Sprites | existing face images | Faces and props drawn as distance-scaled billboards; images are already loaded in `GameCanvas.jsx` |
| DOOM/Wasm port | rejected | Emscripten + WAD loading + license/size baggage; solves a problem this game does not have |
| Real risk | mobile frame rate | Per-column raycast + per-frame sprite sort must hold ~30 fps on a mid-range phone |
| Real risk | portrait 9:16 | Wolf3D-style view is wide; portrait gives a narrow FOV, so turning and awareness need design |

Do **not** adopt a 3D library (three.js, Babylon) for this. It would add
a large dependency to a currently dependency-free engine for a look that a
raycaster gives for free.

## 4. Three interpretations of "chaser behind Noob-Noob"

| Option | Description | Cost | Risk | Fit |
|---|---|---|---|---|
| **A. Over-the-shoulder pseudo-3D (Duke 3D / Wolf3D raycast)** | Camera sits behind Jayden; chaser approaches from behind/into view; the chaser's face scales up as a billboard sprite | Medium | Controls in portrait, FOV, rear awareness | Best match to the ask; reuses grids |
| **B. Duke Nukem 2 style side-scroller** | Horizontal platformer, chaser pursues from behind on the left | High | New physics, new level data, throws away grids | Poor reuse; effectively a new game |
| **C. First-person toggle on the existing game** | Same sim, camera-view switch only | Low–Medium | Mostly presentation; weakest "Duke" feel | Cheapest spike; good first slice of A |

Recommendation (not a decision): treat **A as the target and C as its
first slice**. Build the renderer seam and a single-map spike before any
gameplay-rule change.

## 5. Technical strategy: how to switch mechanics

1. **Keep `GameEngine.js` simulation untouched as the source of truth.**
   Positions, collision, chaser AI, pickups, perks and Boom Stick stay 2D
   grid logic. Per the SDLC, a view mode must not change rules unless a
   rules decision is made (D3).
2. **Introduce a `viewMode` seam**, modeled on `isChaserMode`: values
   `topdown` (current) and `raycast` (new). Plumb it like the existing
   mode flag (`GameCanvas.jsx` props into the `GameEngine` constructor).
3. **Split rendering from simulation incrementally.** `draw()` is the
   only large rendering entry point; a `RaycastRenderer` should read
   engine state (runner, chasers, pickups, grid) and draw columns plus
   sprites into the same canvas. No engine rewrite; extract only what the
   renderer needs to read.
4. **Feature flag, off by default.** Surface it as an opt-in (Quick Play
   option or profile cookie setting). Preserve portrait 9:16, the
   cookie-backed profile state, and random default-face rotation on Quick
   Play (AGENTS.md rules).
5. **Controls remap.** Top-down input is screen-space joystick. A chase
   cam needs camera-relative input: options are (a) swipe/drag to turn
   with auto-forward, (b) joystick left/right = turn, up = forward, or
   (c) keep screen-space joystick but rotate the camera to the runner's
   heading. Needs a playtest-driven decision (D4).
6. **Rear-view for "chaser behind you".** In forward-facing pseudo-3D the
   chaser is behind the camera and invisible. Options: a rear-view mirror
   strip, a proximity-driven face-in-mirror jump scare, directional
   audio/vignette warnings, or an auto-looking-back "Mario Kart" glance
   button (D2).
7. **Performance budget** (must be agreed before building): 30 fps on a
   mid-range phone, internal render width <= 200 columns, sprite count cap,
   and an automatic fall back to `topdown` if frame time exceeds budget.
8. **Verification path** (Mode B, later): Playwright smoke test that the
   `raycast` mode mounts, renders a non-blank frame and can be exited
   back to `topdown`; manual frame-rate check on a real phone.

### Suggested slice order (for a future `-plan` handoff)

| Slice | Scope | Blocked on |
|---|---|---|
| S0 | Decide D1-D5 below; write the handoff with copy-paste block | Ken's answers |
| S1 | `viewMode` seam plus renderer interface, `topdown` unchanged (pure refactor, no visual change) | S0 |
| S2 | `RaycastRenderer` spike: walls only, one map, Jayden camera, no sprites | S1 |
| S3 | Billboard sprites: chaser face, pickups, Boom Stick event pickup | S2 |
| S4 | Controls remap plus rear-view/jump-scare mechanic | D2, D4 |
| S5 | Perf pass, fallback, Quick Play opt-in toggle, tests | S3, S4 |
| S6 | Content/parody pass (audio, dialogue, badges) | D5, assets |

Slices S1-S5 each need to stay small. If the Ollama code-monkey lane is
used, S1 and S2 must be split further (AGENTS.md: very small bounded
blocks).

## 6. Interactions with existing systems (must be reviewed)

- **Boom Stick (v0.4.77-plan / C1 shipped):** cone blast, 1.75s portrait
  Voronoi-shatter cutaway and splotch were designed for the top-down
  view. A raycast view needs its own aim/cone representation; C2 should
  ship in top-down first. See `docs/handoffs/roadmap-handoff-v0.4.77-plan.md`.
- **Role Reversal / Chaser Beta (`docs/role-reversal-design.md`):** a
  first-person "you are the chaser" view is a natural fit for the
  Duke-style fantasy; decide whether `viewMode` applies to both modes (D6).
- **Heavy Plunger swing / stain, Jayden Gun, pickups:** each has a
  top-down hit shape; each needs a view-agnostic definition before a
  second renderer draws them.
- **Level progression (levels 1-6, warning screens, transitions):**
  confirm map grids render acceptably as 3D corridors (wide open
  `PORCELAIN_GRID` areas read poorly in a raycaster).
- **Existing doc: `docs/gameplay-mechanics.md`, `docs/players-guide.md`:**
  both need a "view mode" section when anything ships.

## 7. Content issues to address

- **Wall and floor art.** The campaign maps are bathroom/porcelain themed
  with no authored wall textures. Need a minimal textured-wall set (tile,
  grime, "danger" variants per level) or a deliberate flat-color style.
- **Sprite art.** Chaser/runner/pickup sprites need distance-scaling
  readability; user-uploaded faces (`FaceUpload.jsx`) need crop/contrast
  handling at tiny sizes.
- **Rear-view / mirror art** and jump-scare frames for chaser-behind
  moments; existing capture art (`jayden-captured.jpg`,
  `jayden-getting-captured.jpg`) may be reusable.
- **Audio:** footsteps, "he's behind you" proximity layers. Any new
  recordings depend on Ken (see `docs/audio-recording-brief-for-alex.md`).
- **Dialogue and HUD copy** for the mode (menu label, tutorial blurb,
  warning text); Level 4 warning overlay style is a reusable pattern.

## 8. Gameplay rules to decide

- Does the view mode change the rules, or only the presentation (D3)?
- Is the chaser visible only in a rear-view device, or can the player turn
  around (D2)?
- Turning model: tank-style turning, free look, or heading-locked camera
  (D4)?
- Scoring/Sheebs/badges: same economy in both views, or a separate
  leaderboard so a harder (or easier) view does not skew profiles?
  Chaser Beta keeps cosmetic-only badges; this mode needs a stated
  position.
- Boom Stick aim in first person: auto-aim cone toward the chaser behind
  you, or a "turn and fire" requirement?
- Difficulty: does blind/rear-chase pressure require different chaser
  speed or spawn tuning?
- Quick Play rule: view mode must not alter the random default-face
  rotation.

## 9. Creative / parody issues

The user-facing frame is a Duke Nukem 3D / DOOM-era pastiche. Open
questions to settle before shipping copy or art:

- **Trademark/IP:** do not use Duke Nukem, DOOM, Wolfenstein names,
  logos, sprites, sounds, HUD faces or exact catchphrases. Parody must be
  a transformation (original Skibidi-Toilet-flavored lines and art), not
  a reuse. Keep inspiration at the genre level (raycast look, mirror
  jump scare, "kick ass / chew gum"-style rhythm written as original
  lines). Review wording against the existing *Army of Darkness*-style
  parody lines in the Boom Stick plan for consistency and risk.
- **Tone:** keep the existing absurd, juvenile, bathroom humor consistent
  with `docs/characters.md` and `docs/dialog_content_chasing.md`.
- **Nickname usage:** "Noob-Noob" is Ken's nickname for Jayden; confirm
  Jayden (and family) is fine with the new in-game branding/lines.
- **Faces:** user-uploaded faces rendered large as a looming billboard
  intensifies the jump-scare; keep the existing neon/jumpscare setting
  (`neonJumpscareFilter`) and any accessibility/photosensitivity
  considerations in scope.
- **Age/safety:** a pursuit-from-behind jump-scare presentation should
  not escalate beyond the current game's tone.
- **Soundtrack:** retro-FPS style music needs original or licensed
  material; do not sample commercial tracks.

## 10. Open decisions (Ken to answer)

| ID | Question | Options |
|---|---|---|
| D1 | What does "chaser behind noob-noob" mean? | A raycast behind-the-shoulder / B side-scroller / C view toggle |
| D2 | How does the player perceive the chaser behind them? | Rear-view strip / look-back button / audio+vignette only / free turn |
| D3 | Cosmetic mode or rule-changing mode? | Presentation only / new rules |
| D4 | Control scheme in portrait 9:16 | Swipe-turn+auto-forward / tank joystick / heading-locked |
| D5 | Art direction for textures/sprites | Flat-color retro / authored bathroom tiles / reuse existing art |
| D6 | Applies to Chaser Beta too? | Runner only / both |
| D7 | Is this worth an experiment spike first, or schedule after Boom Stick C2+? | Spike now / after C2 |

## 11. Not now / explicit non-goals

- No Wasm DOOM port, no WAD loading, no external 3D engine.
- No backend changes.
- No change to top-down as the default.
- No `GAME_ITERATION` bump or deploy as part of the planning issue.

## 12. Draft GitHub issue summary (paste into the `roadmap` issue)

**Title:** `[Roadmap] Chase-cam raycast view mode (Duke-3D-style, chaser behind Noob-Noob)`

**Summary:** Evaluate and prototype an opt-in pseudo-3D raycast view where
the chaser pursues from behind Jayden, built as a second renderer over the
existing grid simulation.

**Why:** Fresh genre-parody twist that reuses `mapGrids.js` and
`isChaserMode`-style flagging; memory cost is negligible, so risk is
mobile frame rate, portrait controls and content.

**Proposed behavior:** see sections 4-6 of
`docs/chase-cam-raycast-view-plan.md` (viewMode seam, RaycastRenderer,
rear-view mechanic, opt-in toggle, fallback).

**Acceptance criteria (draft):**

- [ ] D1-D7 answered by Ken
- [ ] A `-plan` handoff with copy-paste block exists
- [ ] S1 seam lands with no visual change to top-down
- [ ] Raycast spike holds ~30 fps on a mid-range phone
- [ ] IP/parody review complete

**skib-sdlc status:** Design-only / needs a decision from Ken.
