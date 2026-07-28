# Roadmap Handoff Plan v0.4.61 — Role Reversal refine (Play as Chaser)

**Created by:** Cursor Grok 4.5 — 2026-07-28
**Last updated by:** Cursor Grok 4.5 — 2026-07-28
**Session mode:** Mode A (Planning / refine — docs only, no code)
**Status:** Design verdict recorded; **hotfix Mode B is unblocked** for the
narrow scope below. Deep kit / multiplayer / 2v2 stay out of scope.
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
- Do **not** update `docs/roadmap.md`.
- Annotate docs; create dedicated design doc; commit; leave copy-paste
  next steps for a further refine / coding agent.

## Verdict (this session)

**Keep + refine. Feasible. Not too much — if ruthlessly scoped.**

- Do **not** rip the feature out.
- Do **not** expand into multiplayer / 2v2 / full chaser campaign.
- Next coding work = **thin playable loop** (hotfix + AI flee + 1v1
  isolation + clean round end).
- Optional interim: soft-hide the menu button if hotfix is delayed
  (Ken decision — see Flag for Ken).

Full Q&A, RCA, LT sequencing, and iterative attack plan live in
[`docs/role-reversal-design.md`](../role-reversal-design.md). Summary:

| Question | Answer |
|---|---|
| Remove or keep? | **Keep** (optionally soft-hide until hotfix) |
| Can we make it playable without boiling the ocean? | **Yes** — 1–2 Mode B sessions |
| Reuse NPC chase + add attacks later? | **Yes** — move/sprint first; optional Plunger-on-FIRE later |
| Helps runner design? | **Yes** as a mirror/lab once playable |
| Helps LT 2v2? | **Partial** — needed control scheme scaffolding; not networking |
| Roadmap posture | Parallel side mode / preliminary; not a L10 blocker; **no roadmap.md edit this pass** |

## RCA (must fix in Mode B — do not "redesign around")

In `frontend/src/GameEngine.js` chase update, lead-chaser human branch
reassigns `const stepX` / `const stepY`. That throws every frame → joystick
/ WASD never move the chaser. Combined with AI runner idle beyond 300px,
the arena looks empty and frozen (matches Ken's screenshot).

Also incomplete: extra chasers still spawn; catch path still runner-death
shaped in `App.jsx` `handleCaught`; no dedicated rematch/menu round end.

## Scope for next Mode B (unblocked hotfix — v1.5)

1. Fix human chaser movement (`let` steps or separate variables; apply
   `_getMoveVector()` + sprint to `chasers[0]` only).
2. Improve `_getRunnerEvadeVector` enough that the AI runner **wanders
   even when far** and **flees when close** (still dumb is OK; wall-aware
   pathfinding is *not* required this slice).
3. In `isChaserMode`: no extra-chaser spawns; no campaign level-advance;
   camera already focuses lead chaser — keep that.
4. Capture-once win → clear round-over UX (return to menu **or** rematch;
   default recommendation: menu + "Gotcha!" line). Skip runner death
   economy / item-loss / deaths++ for this mode.
5. Verify with real pointer/keyboard playtest + `npm run build`. Add a
   small e2e if a debug hook can assert chaser position changes under
   forced input (optional but preferred).

## Explicitly NOT in this pass

- Multiplayer, WebSockets, 2v2, MOBA.
- Chaser economy / badges / shop.
- Full campaign-as-chaser.
- Human Plunger Launch / wall-hacks (park as optional v1.6 after feel is good).
- Editing `docs/roadmap.md` (Ken: leave alone this refine).
- Any `GAME_ITERATION` bump until Mode B actually ships code.

## Flag for Ken

1. Soft-hide `PLAY AS CHASER` until hotfix lands? (rec: only if hotfix is
   not the next coding session)
2. Round-over: menu vs rematch? (rec: menu for v1.5)
3. Approve optional later slice: Plunger Launch on FIRE for human chaser?

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

## Copy-paste: next natural steps (further planning agent)

```text
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
   coding copy-paste block.
```

## Copy-paste: next coding session (Mode B hotfix)

```text
Mode B — Role Reversal v1.5 hotfix (Play as Chaser playable thin loop).

1. Read docs/role-reversal-design.md and
   docs/handoffs/roadmap-handoff-v0.4.61-plan.md (Scope for next Mode B).
2. Fix GameEngine.js: human chaser movement must not reassign const
   stepX/stepY; drive chasers[0] from _getMoveVector() + sprint.
3. Make AI runner wander when far and flee when close
   (_getRunnerEvadeVector). Keep it simple — no full pathfinding.
4. isChaserMode: disable extra-chaser spawns and campaign level advance;
   capture-once win must not apply runner death economy / item-loss;
   return to menu (or rematch if Ken chose rematch) with a clear Gotcha.
5. Verify: npm run build + manual joystick/WASD playtest that the chaser
   moves and can tag the runner. Prefer a small e2e using
   window.__skibEngine if practical.
6. Update version-log, ledger, update-directions, this handoff → shipped
   roadmap-handoff-v0.4.61.md, VersionModal. Bump GAME_ITERATION only
   when shipping. No roadmap.md edit unless Ken asks. No multiplayer.
```
