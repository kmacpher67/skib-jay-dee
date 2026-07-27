# Roadmap Handoff Plan v0.4.58 — Desktop Screen Size & Aspect Ratio

**Created by:** Antigravity — 2026-07-27
**Last updated by:** Claude — 2026-07-27 (added Option A implementation sketch)
**Session mode:** Mode A (Planning / investigate — docs only, no code)
**Status:** BLOCKED ON DESIGN DECISION (Field of view balance) — Ken has reviewed the discussion below and is still undecided between Option A and Option C.

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

## Discussion log — 2026-07-27

Ken shared a desktop screenshot (`image_799dc6.png`) showing the unused side columns on a widescreen monitor and asked for a breakdown of the tradeoffs before deciding. Summary of that discussion:

**Why seeing the whole map is a real advantage, not just a nitpick:**

| Feature | Impact of seeing the whole map |
| --- | --- |
| Tension & horror | Drastically reduced — jump-scares and aggressive zooms lose their punch if every chaser is visible from a mile away. |
| Multi-chaser pressure | The game spawns extra toilets when a level runs long; full visibility lets players track and route around new spawns immediately, neutralizing the intended pressure. |
| Item balance | Items like the Fake Jayden Decoy (300px radius, 4s distraction) are balanced around limited visibility — perfect visibility means perfect decoy placement every time. |

**Why limiting FOV still matters, even on a bigger screen:**
- Preserves the original design intent (strict portrait, 9:16 aspect ratio).
- Maintains the claustrophobia that makes close-call mechanics (e.g. "Slippery When Wet" escapes) rewarding.
- Protects late-game mechanics like the Level 5+ Chaser Wall Hacks, which rely on the player not knowing exactly where the enemy will emerge.

**Two desktop-friendly approaches that came out of the discussion (map to the options above):**
- **Scale the 9:16 container (≈ Option C):** Scale the whole 9:16 canvas up to match the desktop monitor's height. Jayden and the Skibs get physically larger and easier to see, but the *amount* of map visible is unchanged. Dead space on the sides gets filled with themed borders/arcade cabinet art instead of plain black bars.
- **Fog of War / darkness mask (≈ Option A):** Widen the aspect ratio to 16:9 for desktop, but shroud everything outside a radius around Jayden in darkness so effective sight distance matches mobile. There's already a precedent for this pattern — the Dad Case chaser's `.dad-case-darkness` overlay.

**Outcome:** Ken finds this a good discussion but has not picked a direction yet. No option has been eliminated. Revisit this handoff once a choice is made (A, B, or C) before starting Mode B implementation.

### Reference: generic mobile→desktop scaling checklist

Ken also pulled a generic (engine-agnostic) answer on how a mobile 9:16 game is typically expanded to full desktop size. Not specific to this codebase (no engine specified — assumes something like Unity/Godot/Phaser/Construct), but useful as a checklist once an option is chosen:

**Engine settings:**
- Base resolution: change project settings from a portrait size to a horizontal desktop size.
- Scale mode: use "Scale Fit" or "Expand" so the game fills the wide screen instead of showing black side bars.
- Aspect ratio: unlock or change the target aspect ratio from fixed portrait to flexible/landscape.

**Code and layout:**
- CSS/canvas: set the HTML canvas width/height to fill the browser window.
- Camera view: update the main camera zoom/orthographic size so more of the game world is visible on the sides.
- UI positions: move buttons/scores from top/bottom corners to the new left/right edges.

Since this project renders via `GameEngine.js` on an HTML canvas (not Unity/Godot/Phaser/Construct), the equivalent touchpoints here are: the canvas resize/scale logic in `GameEngine.js`, the `viewCoords`-based camera math in `_drawWorld`, and the portrait container styling in `frontend/src/App.jsx`. This lines up with the Fix plan below — whichever option (A/B/C) is chosen still touches these same three spots.

Source: AI-generated overview citing gamemaker.io's mobile resolution-scaling tutorial and Android large-screen resizability docs; general background, not vetted against this codebase.

### Discussion: Option A implementation sketch (Fog of War)

Follow-up discussion leaning specifically into Option A (Fog of War / vignette), confirming it as "the best way to keep the game fair while still updating the layout for desktop viewports." Restates the core problem — an unrestricted wider viewport lets desktop players see chasers approaching much earlier and plan escapes too easily — then sketches an implementation:

**Balancing the viewport:**
- Keep the core visual gameplay arena (the area actually visible/legible to the player) identical in size across mobile and desktop.
- Render the canvas in 16:9 so it fills the desktop screen, but shroud everything outside the original 9:16 vertical boundary using the existing darkness logic.

**Darkness overlay — two variants to choose between:**
- A brightly lit vertical column in the center of the screen matching the mobile width (keeps the "portrait strip in the middle" look), or
- A circular light radius centered on Jayden that doesn't expand past the mobile field of view (a true vignette that follows the player instead of staying centered on screen).

**Implementation notes:**
- CSS: a radial-gradient overlay centered on the player's screen coordinates to shroud the extended desktop edges in black.
- Canvas: if drawing directly on the HTML canvas, `globalCompositeOperation = 'destination-in'` can clip/mask outer visibility instead of (or in addition to) a CSS overlay.

**UI/control adjustments that come with widening to desktop (apply regardless of which FOV option is chosen):**
- Keep the top stats bar (SHEEBS, DEATHS) stretched/centered across the wider top layout.
- Hide the virtual joystick and red SPRINT button when a desktop screen width is detected.
- Show the ARROWS / WASD + SPACE keyboard prompt exclusively for desktop users.

This sharpens the Option A entry in the Fix plan below (radial gradient overlay in `_drawWorld`) with concrete CSS/canvas techniques, but it's still gated on Ken picking Option A over B/C — no code has been written yet.

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
