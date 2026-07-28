


- sdlc NO code plan only 
- synthesize the following feedback from multiple other agents. 
- update docs with your thoughts and improvements. 
- refinement and goal seeking: how do we make player experience better for role reversal, should we even do it, if so make it funny cool interactive. 
```
Mode A follow-up — Role Reversal refine (no code).

1. Read docs/skib-sdlc.md, docs/role-reversal-design.md, and
   docs/handoffs/roadmap-handoff-v0.4.61-plan.md.
2. Read docs/handoffs/roadmap-handoff-v0.4.53.md (original ship) and
   docs/handoffs/roadmap-handoff-v0.4.43-plan.md (LT Role Reversal / 2v2).
3. If Ken answered the Flag-for-Ken questions, record them in
   role-reversal-design.md + this handoff; do not invent answers.
4. If Ken wants deeper chaser fantasy (attacks, multi-toilet, arena
   identity) AFTER the hotfix, extend this -plan or open the next
   -plan — still no multiplayer, still no roadmap.md edit unless Ken asks.
5. Do not implement code in a planning session. Leave Mode B to the
   coding copy-paste block in v0.4.61-plan.
```
-- from gemini 
```
# Design Doc: Role Reversal v1 (Play as Chaser)
**Status:** In Development / Prototyping (Demoted from "Shipped")
**Goal:** Provide an interesting asymmetric gameplay experience where the player hunts an AI runner, serving as a technical stepping stone for 2v2 multiplayer.

## 1. The Core Problem (Why v0.4.53 Broke)
The previous handoff treated Role Reversal as a UI/State change[cite: 2]. However, the underlying `GameEngine.js` currently hardcodes human input (WASD/Joystick) directly to the Runner object, and hardcodes Seek AI directly to the Chaser object. 

To fix directional controls not functioning, we must decouple the controller from the entity.

## 2. Iterative Development Path

### Phase A: The Input Abstraction (Technical Fix)
- Create an `InputHandler` that outputs a generic movement vector.
- Assign the `InputHandler` to the Player Chaser.
- **Verification:** The player can successfully navigate the map as a Chaser using the joystick/keyboard.

### Phase B: NPC Runner Evasion AI (The Chase)
- The original v1 handoff noted that runner AI does not exist today[cite: 2].
- Create a basic `EvasionAI` for the NPC Runner. 
- **Logic:** The NPC should cast rays to find walkable paths away from the Player Chaser. 
- **Objective:** The NPC Runner attempts to survive for 60 seconds.

### Phase C: Chaser Kit & Attack Features (The Fun)
- Simply bumping into the runner is anti-climactic for a player.
- Give the Player Chaser an active ability mapped to the `F` / `FIRE` button.
- **Iterative additions:** Start with a simple "Lunge" (short speed burst). Later, map specific abilities based on the chosen face (e.g., *Broth Slip* for Raman-Aunt, *Plunger Launch* for Skib-Daddy).

## 3. Long-Term (LT) Alignment
This mode is not a distraction; it is a prerequisite. By completing Phases A and B, we create entity-agnostic inputs and entity-agnostic AI. This is exactly the architecture required for the LT goal of 2v2 Deathmatches.

## 4. Mode Constraints (v1)
- **Menu mode only:** Separate from campaign progression[cite: 2].
- **Opponent:** AI-controlled runner[cite: 2].
- **Economy:** None in v1 (no sheebs, badges, or shop)[cite: 2].
- **Multiplayer:** Out of scope for v1[cite: 2].
```
--- 
- other instructions from gemini you can follow as you wish. 
```Read docs/handoffs/roadmap-handoff-v0.4.53.md and the new docs/role-reversal-design.md.

The previous Role Reversal delivery is broken because directional controls do not function for the chaser. 

Your task is to implement Phase A and Phase B from role-reversal-design.md:
1. Refactor GameEngine.js to decouple human input from the Runner object. Route keyboard/joystick movement vectors to the active Player entity (whether it is a Runner or a Chaser).
2. Implement a rudimentary Evasion AI for the NPC Runner so it actively runs away from the player when in Role Reversal mode.
3. Win Condition: Player catches the NPC Runner within 60 seconds.

Do NOT implement multiplayer, economy, or advanced chaser attacks yet. Focus strictly on making the human chaser move smoothly and the AI runner flee.

Verify: npm run build + manual playtest to ensure joystick/WASD moves the Chaser and the AI Runner runs away.``` 
- GOAL: refine the quality of role reversal feature (it's currently broken) can we salvage some decent play out of it.
- KEN: change the color of the "PLAY AS CHASER" * some sort of float over explaining it's experimental "beta" - put a note in the roadmap to remove this when we feel that the play is nolonger shytty. 
- KEN: change the label "Quick Play" to "Play as Runner"
- what considertaions need to be made for future and present features and existing roadmap items as we have both modes of play? How do we document this? Where should we document it? in a  docs/.md file? create related links where the role reverse will have an impact or need to be understood. 
- commit progress when completed.  