# Roadmap Handoff - v0.4.36-plan

**STATUS: SHIPPED as v0.4.36.** All three features below landed — see
[roadmap-handoff-v0.4.36.md](roadmap-handoff-v0.4.36.md) for what actually
got built and its own "Follow-up / Next Steps" list (Soggy Toilet Paper,
Heavy Plunger, Friendly Fire badge, migrating Levels 3-5 to the grid
format). This file is kept for historical reference only — don't dispatch
work from it again. **Important:** the working tree as of the v0.4.38-plan
planning pass (2026-07-27) has uncommitted, unverified code that looks like
an interrupted attempt at those exact follow-ups — see the "Uncommitted
working tree" callout in `docs/update-directions.md` before starting any
new Mode B session.

**Session mode:** Mode A (Planning - docs only, no code changes)

This handoff captures the next map architecture refactor and the new
chaotic content pool. Quest Rooms and the Level 4+ survival floor are
already live from v0.4.33; this slice keeps us from painting ourselves
into a hardcoded pixel-rectangle corner as we build more landmark-heavy
maps.

## Feature 1: Level Data Extraction (Map Refactor)
Now that the quest-room landmarks already exist, the next step is to
stop hardcoding pixel rectangles.
- **Action:** Convert `buildPorcelainPalace` and `buildPipeworks` into 2D grid arrays (e.g., `["######", "#....#", "######"]`). 
- **Engine Update:** Create a parser in `GameEngine.js` that reads the grid and automatically generates the `[x, y, w, h]` wall arrays dynamically based on a fixed tile size (e.g., 40x40 pixels).

## Feature 2: Cursed & Blessed Pickups
Add double-edged interactive items to the map to create chaotic decision-making.
- **Taco Bell Grande:** +50% speed, zero steering control for 3s.
- **Fake Jayden Decoy:** Forces Skib aggro away from the player for 4s.

## Feature 3: Secret Badges
Add the following to `BADGES` in `gameContent.js`:
- `pacifist-warzone`: Survived Level 4 with a loaded gun, never fired.
- `premature-evacuation`: Died in under 5 seconds on Level 1.

---

## 🚀 Copy & Paste Snippet for Code Monkey

When you are ready to unleash the Code Monkey on the map refactor (which unlocks everything else), feed it this prompt:

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B. 
Read `docs/skib-sdlc.md` and `docs/roadmap.md` before starting. 

Your objective is to implement "Feature 1: Level Data Extraction" to save us from hardcoded pixel-math spaghetti before we build Level 4+ Quest Rooms.

1. In `frontend/src/GameEngine.js`, deprecate the manual `this.map.walls.push({x, y, w, h})` logic for `buildPorcelainPalace`. 
2. Replace it with a 2D array representation of the map (using strings like `"######"`, `"#....#"`).
3. Write a small parser within `GameEngine.js` that iterates over the 2D array and generates the exact same bounding boxes based on a uniform tile size. 
4. Ensure the game plays exactly the same visually and physically. 

Verify with `npm run build` and the full Playwright suite. Update `docs/roadmap.md`, `docs/handoffs/ledger.md`, `docs/version-log.md`, `docs/update-directions.md`, and generate a new `docs/handoffs/roadmap-handoff-vX.Y.Z.md` per the SDLC checklist. Commit your work before ending the session.
```
