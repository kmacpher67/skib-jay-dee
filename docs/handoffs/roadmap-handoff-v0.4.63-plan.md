# Roadmap Handoff Plan v0.4.63 — Main Menu UI Clean Up

**Created by:** Antigravity — 2026-07-28
**Last updated by:** Codex (GPT-5) — 2026-07-28
**Session mode:** Mode A (Planning / refine — docs only, no code)
**Status:** Code-ready as one bounded Main Menu layout slice. No
`GAME_ITERATION` bump, build, or deploy occurred in planning.

```yaml
code_monkey_backend: default
code_monkey_model: default
```

## Trigger

Ken asked for a responsive cleanup of the intro screen, officially called
the **Main Menu**:

1. Keep the five top profile stats (User, difficulty, sheebs, best level,
   deaths) in one compact horizontal row on mobile.
2. Tighten the Main Menu vertically so the version/footer content is
   easier to reach on common phone viewports.
3. Move the menu mute/unmute control out of the top-left corner and into
   the unused space immediately left of the Runner/Chaser portraits. It
   should be an obvious, small emergency audio control for quiet or
   shared-space play without crowding the portraits.

The third request is part of this existing v0.4.63 Main Menu pass, not a
new roadmap increment. The unrelated v0.4.65 handoff remains deploy/push
tooling and must not absorb this UI work.

## Current implementation seams

- `frontend/src/App.jsx`
  - `MainMenu` currently renders `.mute-btn-menu` as the first child of
    `.menu`, so it is pinned to the screen corner.
  - `.face-row` contains the two `FaceUpload` controls.
  - `.status-row` contains five items.
- `frontend/src/App.css`
  - `.status-row` uses four columns and drops to two columns at 360px,
    which contradicts the requested single-row mobile layout.
  - `.face-preview` is 88px square and the portrait gap is 14px.
  - `.mute-btn` supplies the shared menu/in-game button styling;
    `.mute-btn-menu` supplies the menu-specific positioning.
- `frontend/e2e/smoke.spec.js` already verifies that menu mute state
  carries into the game.
- `frontend/e2e/cosmetic-sink.spec.js` already checks menu mute visibility
  on a wide desktop viewport.

## Locked design

### 1. Compact top profile row

- Keep all five status controls in one horizontal row at supported phone
  widths. Do not restore the current two-row mobile media rule.
- Use compact responsive columns, smaller gaps/padding, and a clamped
  font size. Long User text may wrap *inside its own pill* to two short
  lines, as it does today, but no pill may overlap or push another pill
  onto a second row.
- Preserve every click target and label:
  - User opens the profile switcher.
  - Difficulty cycles the difficulty.
  - Deaths opens the death log.
  - Sheebs/debt and Best level remain readable.
- Do not change cookie/profile data or shorten the persisted user id.

### 2. Vertical cleanup

- Reduce Main Menu-only gaps, margins, and/or padding enough that the
  screen is less scroll-heavy on a 390×844 phone and remains usable at
  320×568.
- Keep scrolling as a safety net for unusually short screens; do not hide
  or crop footer content just to claim it is above the fold.
- Do not shrink the Runner/Chaser images to recover height. Preserve each
  `.face-preview` at 88×88 and retain the existing 14px gap between the
  two portrait controls.

### 3. Menu mute placement

- Move the existing `.mute-btn-menu` JSX into `.face-row`, before the two
  `FaceUpload` controls.
- Give `.face-row` a stable responsive width with the two portraits still
  centered as a pair. Position the menu mute button in the reserved empty
  space at the left side of that row, vertically centered against the
  88px image area rather than against the labels below it.
- Keep the control visually compact: approximately 36–40px, clearly
  smaller than the 88px portraits. It must not overlap either portrait or
  its label.
- Preserve the existing `🔊` / `🔇` glyphs, `aria-label`, click behavior,
  `stopPropagation()`, cookie-backed mute state, and audio logic.
- The in-game `.mute-btn` stays in its current top-left location. Use a
  menu-specific CSS override; do not change the shared rule in a way that
  moves the in-game control.

## Acceptance checks

At 320×568, 360×640, 390×844, and 1280×720:

- The five top status items occupy one row without overlap, clipping, or
  horizontal page scroll.
- The menu mute control appears to the left of the Runner portrait and
  its vertical center falls within the portrait image band.
- Both portrait previews remain 88×88, keep their 14px gap, retain visible
  labels, and do not overlap the mute control.
- Clicking menu mute changes `🔊` to `🔇` (and back), updates the
  accessible name, and the chosen state still carries into gameplay.
- The in-game mute control remains visible in its existing corner.
- Footer/version content remains reachable on short screens, with scroll
  available when the viewport genuinely cannot contain everything.

## Files expected to change in Mode B

- `frontend/src/App.jsx`
- `frontend/src/App.css`
- `frontend/e2e/smoke.spec.js` and/or
  `frontend/e2e/cosmetic-sink.spec.js`
- Normal Mode B closeout docs, including
  `docs/handoffs/roadmap-handoff-v0.4.63.md`

## Explicit non-goals

- No audio volume mixer, panic-mute keyboard shortcut, new sound assets,
  or changes to mute persistence.
- No changes to gameplay HUD/controls or the in-game mute placement.
- No portrait restyle, size reduction, relabeling, or face-upload logic.
- No button-copy, difficulty, economy, or Play-as-Chaser changes.
- Do not use v0.4.65 for this work.

## Copy-paste: bounded Mode B / Code Monkey slice

```text
Implement only the Main Menu layout slice in
docs/handoffs/roadmap-handoff-v0.4.63-plan.md.

1. In App.jsx, move the existing menu mute button into `.face-row`,
   immediately before the two FaceUpload controls. Preserve its glyphs,
   aria-label, stopPropagation, and handler. Do not move the in-game mute.
2. In App.css, keep all five `.status-row` items in one responsive mobile
   row; prevent overlap/overflow. Tighten Main Menu vertical spacing while
   retaining short-screen scrolling.
3. Reserve left-side space inside `.face-row` for a compact 36-40px mute
   control. Keep the portrait pair centered, each preview 88x88, with the
   current 14px portrait gap and visible labels.
4. Extend the existing mute e2e coverage to assert the menu control is
   left of and vertically aligned with the portraits, the previews retain
   size/gap, the top stats remain one row, mute state still carries into
   gameplay, and the in-game mute remains in its corner.
5. Verify from frontend/: `npm run build` and
   `npx playwright test e2e/smoke.spec.js e2e/cosmetic-sink.spec.js`.
6. Commit the implementation and normal Mode B docs. Do not deploy or
   bump GAME_ITERATION unless Ken explicitly asks to publish.
```
