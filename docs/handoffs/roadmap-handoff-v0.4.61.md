# Roadmap Handoff Plan v0.4.61 — Role Reversal refine (Play as Chaser)

**Created by:** Cursor Grok 4.5 — 2026-07-28
**Last updated by:** Codex (GPT-5) — 2026-07-28
**Session mode:** Mode A (Planning / refine — docs only, no code)
**Status:** Refined recovery plan recorded. Menu naming/Beta treatment and
the narrow technical isolation work are unblocked. Timer/rematch and the
later active ability remain planning recommendations until Ken confirms.
Deep kit / multiplayer / 2v2 stay out of scope.
**Design source of truth:** [`docs/role-reversal-design.md`](../role-reversal-design.md)

## Trigger

Ken (2026-07-28), Mode A refine of previously delivered `v0.4.53`:

- Feature delivered too soon / not reviewed enough.
- Play as Chaser broken — player does not move; directional controls dead.
- Unclear what the player is supposed to do (game is runner-centric; no
  real NPC runner role).
- Evaluate: refine to playable vs too much; remove vs keep simple.
- Goal: interesting gameplay experience.
- Consider LT 2v2 / deathmatch direction **without implementing** it.
- Earlier pass: do **not** update `docs/roadmap.md`.
- Annotate docs; create dedicated design doc; commit; leave copy-paste
  next steps for a further refine / coding agent.

Ken's follow-up (2026-07-28) supersedes the earlier roadmap constraint:

- Keep the Chaser entry visible, recolor it, and explain that it is an
  experimental Beta.
- Rename `QUICK PLAY` to `PLAY AS RUNNER`.
- Add a roadmap reminder to remove the Beta treatment only when play is
  no longer rough.
- Audit present/future features now that two roles exist.

## Verdict (this session)

**Keep + refine. Feasible. Not too much — if ruthlessly scoped.**

- Do **not** rip the feature out.
- Do **not** expand into multiplayer / 2v2 / full chaser campaign.
- Next coding work = **thin playable loop** (hotfix + AI flee + 1v1
  isolation + clean round end).
- Keep the entry visible but visibly experimental; it must not look as
  mature as the runner campaign.

Full Q&A, RCA, LT sequencing, and iterative attack plan live in
[`docs/role-reversal-design.md`](../role-reversal-design.md). Summary:

| Question | Answer |
|---|---|
| Remove or keep? | **Keep as a visibly experimental Beta**, with a defined salvage gate |
| Can we make it playable without boiling the ocean? | **Yes** — 1–2 Mode B sessions |
| Reuse NPC chase + add attacks later? | **Yes** — move/sprint first; prefer one universal `BOWL RUSH` lunge later |
| Helps runner design? | **Yes** as a mirror/lab once playable |
| Helps LT 2v2? | **Partial** — needed control scheme scaffolding; not networking |
| Roadmap posture | Parallel side mode / preliminary; roadmap carries explicit Beta-removal debt |

## RCA (must fix in Mode B — do not "redesign around")

In `frontend/src/GameEngine.js` chase update, lead-chaser human branch
reassigns `const stepX` / `const stepY`. That throws every frame → joystick
/ WASD never move the chaser. Combined with AI runner idle beyond 300px,
the arena looks empty and frozen (matches Ken's screenshot).

Also incomplete: extra chasers still spawn; catch path still runner-death
shaped in `App.jsx` `handleCaught`; no dedicated rematch/menu round end.

## Scope for next Mode B (bounded recovery — v1.5)

1. Menu honesty: rename `QUICK PLAY` to `PLAY AS RUNNER`; give
   `PLAY AS CHASER` a distinct Beta color and a concise adjacent
   experimental float-over. Recommended visual is hazard yellow
   (`#FFD54A`) with near-black text in `.chaser-btn`; remove the current
   inline brown style. The explanation must work on tap/mobile and be
   screen-reader associated, not hover-only. Preserve the random face
   reshuffle on both play buttons.
2. Fix human chaser movement. Reuse the existing movement-vector producer
   through a small active-human-entity seam; do not create a standalone
   `InputHandler` class solely for this bug. Drive `chasers[0]` from input
   and sprint, and prove normal Runner movement did not regress.
3. Replace idle/opposite-vector evasion with bounded wall-aware steering:
   walkable waypoint while far, flee candidate probes while near, and
   stuck recovery. Full A* pathfinding is not required.
4. Enforce the mode matrix in `docs/role-reversal-design.md`: one human
   chaser, one AI runner, one arena; no extra chasers, campaign advance,
   pickups, loadout leakage, skreem/death flow, item loss, badges,
   profile/economy writes, or Level 4 campaign overlays.
5. Give the Beta a dedicated objective/HUD and result path. Recommended
   shape is a 60-second `FLUSH CLOCK`, capture-to-win, timeout-to-lose,
   then Rematch/Menu. Because Ken has not explicitly confirmed the timer
   or rematch choice, settle that before treating this item as code-ready.
6. Verify with real mobile pointer and keyboard playtests plus automated
   coverage for chaser movement, runner stuck recovery, both outcomes,
   zero profile mutation, and a normal Runner-mode movement regression.

## Explicitly NOT in this pass

- Multiplayer, WebSockets, 2v2, MOBA.
- Chaser economy / badges / shop.
- Full campaign-as-chaser.
- Human Plunger Launch / wall-hacks / `BOWL RUSH` (park as optional v1.6
  after the recovery feels good).
- Any `GAME_ITERATION` bump until Mode B actually ships code.

## Flag for Ken

1. ~~Soft-hide vs leave visible?~~ **Resolved:** leave visible, recolor,
   and add experimental/Beta float-over.
2. Approve the recommended 60-second round with capture/timeout outcomes?
3. Approve Rematch + Menu on the result card?
4. After recovery only: approve a universal `BOWL RUSH` lunge on FIRE
   before any face-specific human kits?

## Relationship to other handoffs

- Supersedes the "ready to deepen kit" reading of
  [`roadmap-handoff-v0.4.53.md`](roadmap-handoff-v0.4.53.md) — that ship
  was under-reviewed; annotate it as **shipped broken / needs v0.4.61
  refine**.
- Does not replace LT writeup
  [`roadmap-handoff-v0.4.43-plan.md`](roadmap-handoff-v0.4.43-plan.md).
- Does not jump the coding queue ahead of unrelated unblocked slices
  unless Ken prioritizes "fix broken menu mode" — see copy-paste blocks
  below for both paths.

---

## Experience and architecture refinement (Codex, 2026-07-28)

- A timer, target locator, funny two-outcome card, and rematch are what
  turn "movement works" into a legible arcade loop. Movement-only is a
  diagnostic milestone, not the Beta exit.
- Candidate-heading collision probes are enough for v1 runner AI; a new
  raycasting subsystem or full pathfinder is unnecessary until playtests
  prove it.
- The `isChaserMode` flag must behave as a ruleset boundary. The current
  engine still lets campaign systems tick; acceptance now includes no
  profile mutation and no campaign content leakage.
- Every future gameplay plan must include a `Mode impact` tag using the
  contract in `docs/role-reversal-design.md`.
- Keep Beta visible until the documented exit criteria pass; if two
  bounded recovery slices still cannot make it fun, soft-hide it.

## Copy-paste: next natural steps (further planning agent)

```text
Mode A follow-up — Role Reversal refine (no code).

1. Read docs/skib-sdlc.md, docs/role-reversal-design.md, and
   docs/handoffs/roadmap-handoff-v0.4.61-plan.md.
2. Read docs/handoffs/roadmap-handoff-v0.4.53.md (original ship) and
   docs/handoffs/roadmap-handoff-v0.4.43-plan.md (LT Role Reversal / 2v2).
3. If Ken answered the Flag-for-Ken questions, record them in
   role-reversal-design.md + this handoff; do not invent answers.
4. Record Ken's timer/rematch/BOWL RUSH answers without inventing them.
5. If Ken wants deeper chaser fantasy (attacks, multi-toilet, arena
   identity) AFTER the recovery, open the next -plan. Keep multiplayer
   separate.
6. Do not implement code in a planning session. Leave Mode B to the
   coding copy-paste block.
```

## Copy-paste: next coding session (Mode B hotfix)

```text
Mode B — Role Reversal v1.5 hotfix (Play as Chaser playable thin loop).

1. Read docs/role-reversal-design.md and
   docs/handoffs/roadmap-handoff-v0.4.61-plan.md (Scope for next Mode B).
2. App.jsx/App.css: QUICK PLAY -> PLAY AS RUNNER; distinct PLAY AS
   CHASER Beta treatment + short experimental explanation. Preserve
   random default face rotation.
3. GameEngine.js: route the existing move vector to the active human
   entity; fix const step reassignment; verify both runner and chaser
   movement. Do not add a standalone InputHandler class.
4. Build bounded wall-aware AI runner steering: far waypoint, near flee
   candidate probes, stuck recovery. No full A*.
5. Make isChaserMode a strict 1v1 arcade ruleset: no extra toilets,
   campaign progression/HUD/pickups/loadout/economy/profile mutation.
6. BLOCK before coding the outcome UX unless Ken has confirmed the
   recommended 60-second capture/timeout + Rematch/Menu shape.
7. Verify npm run build + full e2e, real joystick/WASD playtests, both
   outcome paths, no profile mutation, and normal runner regression.
8. Update version-log, ledger, update-directions, this handoff → shipped
   roadmap-handoff-v0.4.61.md, VersionModal. Bump GAME_ITERATION only
   when shipping. No multiplayer.
```
