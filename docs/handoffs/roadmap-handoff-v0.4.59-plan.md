# Roadmap Handoff Plan v0.4.59 — Neon Jump-Scare Upgrade

**Created by:** Antigravity — 2026-07-27
**Last updated by:** Antigravity — 2026-07-27
**Session mode:** Mode A (Planning / investigate — docs only, no code)
**Status:** UNBLOCKED — READY TO CODE

## Trigger

User request: "update docs and roadmap enhance this perk, change it to extra time after restart for player to run away. upgrade perk to give you extra 500ms headstart after scare. deducts -50 Shleebs each time. cost 250"
Context: Image attached showing the "Neon Jump-Scare Filter" perk in the shop. It now costs 250 (up from 200). Its mechanics are changing from "Cosmetic only" to an active mechanic that provides an extra 500ms headstart (freeze time) after a jump-scare / restart, but it deducts 50 Shleebs each time the mechanic triggers.

## Fix plan (Mode B — single session)

1. **Update Shop Item Config (`frontend/src/gameContent.js`)**:
   - Locate the `neon-scare-filter` item in the `SHOP_ITEMS` array.
   - Update `price: 250` (up from 200).
   - Change the description to reflect the new functionality: "Gives you an extra 500ms headstart after a scare. Deducts -50 Shleebs each time." (or similar UI text). Remove the "Cosmetic only" tag/description.

2. **Implement Headstart Mechanic (`frontend/src/GameEngine.js`)**:
   - The game currently triggers a countdown via `_startResumeCountdown()` after a capture.
   - If the player owns the `neon-scare-filter` item, and they have at least 50 Sheebs (or if debt is allowed), grant them an extra 500ms headstart.
   - Wait, the prompt says "extra time after restart for player to run away". Currently, when the countdown finishes, chasers resume immediately. To give a headstart, we should keep the chasers frozen for an extra 500ms after the player gains control, or keep the countdown longer? The instruction specifically says "headstart after scare", which implies the player can move while the chasers are frozen for an extra 500ms.
   - Deduct 50 Sheebs from the player's balance (`this.sheebs -= 50`, clamping based on level 4+ debt rules) when this headstart triggers. Add a visual/audio cue if possible, or just a toast ("-50 Sheebs: Neon Headstart!").

3. **Verify**:
   - Buy the perk for 250 Sheebs.
   - Get captured. After the resume countdown, ensure the player can move while chasers stay frozen for an extra 500ms.
   - Verify that 50 Sheebs are deducted upon this trigger.

## Explicitly not in this pass

- No changes to other shop items.
- No new graphics (reusing the existing Neon Jump-Scare tint).

---

## Copy-paste: next coding session (Mode B)

```text
Mode B unblocked: implement the Neon Jump-Scare Upgrade (v0.4.59).
1. Read docs/handoffs/roadmap-handoff-v0.4.59-plan.md.
2. Update gameContent.js to change neon-scare-filter cost to 250 and update its description.
3. Update GameEngine.js to freeze chasers for an extra 500ms after the resume countdown, allowing the player a headstart, if they own the perk.
4. Deduct 50 Sheebs each time this headstart triggers.
5. Verify in browser.
6. Bump GAME_ITERATION to v0.4.59, update ledger/roadmap, commit, and push.
```
