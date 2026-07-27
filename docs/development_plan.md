# Skib-Jay-Dee Development Plan
**Updated:** 2026-07-27

This document summarizes the current state of the development roadmap, open items ready for handoff, and what's currently blocked or needing design. It serves as an index for ongoing planning and execution.

## Current State

- **Shipped Version:** v0.4.40
- **Most Recent Mechanics:** Level 6, Skib-Daddy chaser, Cursed & Blessed Map Pickups (Taco Bell, Soggy TP, Fake Jayden, Heavy Plunger), and Shart Knocker (v0.4.40).
- **Recent Polish:** Enhanced Death Logs, Parody Warning (v0.4.39).

## Backlog / Roadmap Review

The following items are currently tracked in the `docs/roadmap.md`. We have separated them into categories based on their readiness for coding.

### 🟢 Ready for Coding (Open Handoffs)

These items have finalized planning documents and are ready for a coding session (Mode B).

1. **Rewards & History panel (Slice A)**
   - **Plan:** `docs/handoffs/roadmap-handoff-v0.4.41-plan.md`
   - **Description:** A new modal mimicking the Deaths log, allowing players to see their history of badges earned, shop items purchased, and eventually reward payouts.
   - **Action:** Ready to execute via `Code Monkey` or a Mode B coding agent.

2. **Menu brag stat: best level + fewest deaths**
   - **Plan:** `docs/handoffs/roadmap-handoff-v0.4.42-plan.md`
   - **Description:** Add a "Best Run" stat tracking the highest level reached with the fewest session deaths.
   - **Action:** Ready to execute via `Code Monkey` or a Mode B coding agent.

### 🟡 Design & Planning Phase (Vibes/Design only)

These items are currently blocked on design decisions, Ken's feedback, or require a dedicated Mode A planning session before writing code.

1. **Menu HUD: live-data pills (v0.4.41 Slice B)**
   - **Status:** Requires Ken's decision on whether the stat pills are just a labeling fix or if we are building a new difficulty/history-linked stat modifier.
2. **Cosmetic sink shop item**
   - **Status:** Needs a concept (e.g., jump-scare filter skin) and price points designed before handoff.
3. **Micro-Skib chaser**
   - **Status:** AI/pathing work requires a design pass (spawn conditions, additive vs. replacement chaser).
4. **Interactive content pack**
   - **Status:** Requires defining a catalog of secret items and gag awards. See `docs/interactive-content-pack.md`.
5. **Gameplay Rebalancing**
   - **Status:** Partially shipped. Needs decision on whether to split or combine remaining changes (+25 gun hit, +50 badge, death penalty scale).
6. **Difficulty Function / Auto-tune**
   - **Status:** Open TBDs on window sizes and floor/ceiling variables. See `docs/difficulty-mechanics-plan.md`.
7. **Level 7+ Mosaic Map**
   - **Status:** Requires answering the dimension-shift trigger question (floor trap vs held item). See `docs/level-progression-and-endgame-plan.md`.

### 🔴 Blocked on Assets (Ken's Action Required)

These items cannot proceed until new assets are uploaded to the repository.

1. **Audio 2**
   - Need capture-line and chaser-bark voice clips (1:1 with text).
2. **Yoodeling Unc 2**
   - Need the second costume photo for "Yoodelling Unc Alex" in `images/yoodelling-unc-alex-2.png`.
3. **Distinct Runner Poses**
   - Need distinct getting-captured/captured photos to replace duplicates in the pool.

### 🔵 Large/Future Epics

1. **Multiplayer Phase 5** (FastAPI WebSocket multiplayer)
2. **Intro Cinematic** (World Star video transition/cutscene)

---

## SDLC Process Reminder
For agents processing this plan: 
- **Mode A (Planning):** Update the `roadmap.md` and create `-plan.md` handoffs. Do not touch `frontend/src`.
- **Mode B (Coding):** Pick up an open `-plan.md` handoff in the **Ready for Coding** section. Update the ledger, versions, and build the frontend.
