# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

Copy and paste the block below into the next coding agent session.

---

You’re continuing work on **Skib-Jay-Dee-Toilet** in `/mnt/data/projects/skib-jay-dee`.

Read these first:

1. `README.md`
2. `docs/update-directions.md`
3. `docs/dev-notes.md`
4. `frontend/src/App.jsx`
5. `frontend/src/GameEngine.js`
6. `frontend/src/gameContent.js`
7. `frontend/src/lib/cookies.js`

Current state:

- Front end only.
- Three levels are already wired up.
- Desktop controls work with Arrow keys / WASD plus SPACE.
- Sprint is fixed.
- Shleeb shop works and persists in cookies.
- User id and save state persist in cookies.
- Default faces are randomized from the local image gallery on each play.

Your next best coding steps, in order:

1. Add the scripted World Star intro cinematic.
   - Jayden recording a video
   - Skib bursting from a stall
   - screen crack / transition moment
   - keep it front-end only

2. Add audio.
   - flush / ambience / chase loop / jump-scare sting
   - keep it simple and browser-safe

3. Improve uploaded face rendering.
   - crop or mask to an oval / face frame instead of stretching raw squares
   - keep existing upload flow intact

4. Add another meaningful level or tune the current ones.
   - only after the cinematic and audio feel solid
   - do not break existing level progression

5. Add more content from the PDF roster if needed.
   - new characters
   - abilities
   - chase variants

Constraints:

- Keep the app front-end only unless explicitly asked for backend work.
- Preserve cookie persistence.
- Preserve the random default face rotation.
- Keep the 9:16 portrait layout.
- Avoid touching unrelated git changes that are already present in the workspace.

When you finish a step, run `npm run build` in `frontend/` and report the result.

