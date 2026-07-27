# Roadmap Handoff Plan v0.4.58 — Desktop Screen Size & Aspect Ratio

**Created by:** Antigravity — 2026-07-27
**Last updated by:** Antigravity — 2026-07-27
**Session mode:** Mode A (Planning / investigate — docs only, no code)
**Status:** BLOCKED ON DESIGN DECISION (Field of view balance)

## Trigger

User request: 
> "users asking for computer screen size for desktop screen devices so bigger playing size. is it too much of an advantage for user to see the whole map? Should we limit field of view? IDK, make this question."

Currently, the game forces a portrait 9:16 layout centered on the screen, matching mobile. Desktop users want to use their full widescreen monitor for a larger playing surface.

## Investigation (read-only)

The game's rendering relies on a 360x640 canvas (or similar portrait constraints). If we expand this to a responsive 16:9 or full browser window:
1. **Map rendering**: `GameEngine.js` `_drawWorld` relies on `viewCoords`. If the view expands, more of the map is drawn. 
2. **Gameplay advantage**: A widescreen desktop player would see chasers approaching from much farther away on the left and right sides than a mobile player. This breaks the tension of the jump-scare/chase loop, which relies on the limited viewport to hide distant threats.

## ⚠️ Flag for Ken (Product Decision Required)

Before we write code for this, we need to decide how to handle the extra screen real estate on desktop to preserve game balance:

**Question: Is it too much of an advantage for desktop users to see the whole map? Should we limit the field of view?**

Options for Ken to choose from:
- **Option A: The "Fog of War" / Vignette.** Let the canvas expand to full screen, but draw a heavy dark vignette or "fog" around the player that matches the mobile viewport's sight distance. You get a big screen, but you can't see threats any earlier than mobile players. (Recommended for balance and horror vibe).
- **Option B: Let them see everything.** Just expand the camera viewport. Desktop players get a huge advantage and can plan their routes easily.
- **Option C: Letterboxing with background art.** Keep the play area locked to 9:16 portrait (so the field of view stays identical), but scale it up slightly and fill the left/right empty desktop space with cool static artwork or UI panels (stats, inventory, etc.) instead of just black bars.

**Reply with your choice (A, B, or C) so we can finalize this handoff.**

## Fix plan (Mode B — single session)

*(To be finalized after Ken's decision)*

- If A: Update `GameEngine.js` camera/resize logic to allow widescreen, but add a radial gradient overlay centered on the player in `_drawWorld`.
- If B: Update `GameEngine.js` resize logic to fill screen, adjust UI overlay positioning.
- If C: Update CSS/layout in `frontend/src/App.jsx` to scale the 9:16 container as large as possible vertically, and add filler side panels.

## Explicitly not in this pass

- No code changes until the design decision is made.
- No multiplayer balancing yet.

---

## Copy-paste: next coding session (Mode B)

```text
Mode B pending design decision. Do not execute until Ken selects Option A, B, or C from the handoff plan.
```
