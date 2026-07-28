# Role Reversal Design — Play as Chaser

**Created by:** Cursor Grok 4.5 — 2026-07-28
**Created on:** 2026-07-28
**Last updated by:** Cursor Grok 4.5 — 2026-07-28
**Last updated on:** 2026-07-28
**Session mode:** Mode A (planning / refine — docs only, no code)

Dedicated design doc for the Role Reversal / "Play as Chaser" feature that
shipped early as `v0.4.53`. Companion handoff:
[`docs/handoffs/roadmap-handoff-v0.4.61-plan.md`](handoffs/roadmap-handoff-v0.4.61-plan.md).
LT context:
[`docs/handoffs/roadmap-handoff-v0.4.43-plan.md`](handoffs/roadmap-handoff-v0.4.43-plan.md).
Original (under-reviewed) ship note:
[`docs/handoffs/roadmap-handoff-v0.4.53.md`](handoffs/roadmap-handoff-v0.4.53.md).

> **Do not update `docs/roadmap.md` from this pass** — Ken asked for a
> dedicated design doc + handoff refine instead of roadmap edits.

---

## 1. What shipped (and why it feels broken)

| Piece | State in live code (`GAME_ITERATION` may be ahead of `v0.4.53`) |
|---|---|
| Menu button `PLAY AS CHASER` | Present in `App.jsx` → `handlePlay(true)` → `isChaserMode` |
| Human moves lead chaser | **Broken** — see RCA below |
| AI runner | Stub only (`_getRunnerEvadeVector`) — flees when close, idles otherwise |
| Win condition | Capture once → `phase = 'caught'` + generic "Gotcha! Round over." |
| Economy | Intended none; catch path still routes through runner-centric `handleCaught` (item-loss risk, capture audio) |
| Extra toilets | Still spawn via `_maybeSpawnExtraChaser` — AI chasers compete with the human |
| Abilities | None for human (move + sprint only, as planned) |
| Map | Reuses campaign Level 1 start (Porcelain Palace), not a dedicated arena |

Ken's playtest (screenshot of empty field + stuck sprite + joystick/SPRINT
overlay) matches the RCA: controls look present, nothing playable happens.

### Root cause analysis (code review only — do not fix in Mode A)

1. **Hard bug — human chaser never moves.** In `GameEngine.js` chase
   update, `stepX` / `stepY` are declared with `const`, then the chaser-mode
   branch tries to reassign them from `_getMoveVector()`. That throws a
   `TypeError` every frame once the lead chaser is not stunned, so player
   input never reaches `_moveWithCollision`. This alone explains
   "directional controls are not functioning."
2. **Runner AI looks dead until pressure exists.** `_getRunnerEvadeVector`
   returns `{0,0}` when the closest chaser is farther than 300px. With a
   frozen human chaser, the AI runner stands still forever → empty arena
   feel.
3. **Runner AI is not a real NPC role.** Flee = opposite vector + wander
   noise. No wall-aware pathing, no pickup use, no stamina/sprint, no
   cornering. The game was built entirely around AI *chasers* hunting a
   human runner; the inverse role is new work, not a flag flip.
4. **Mode boundary is incomplete.** Extra chasers still join; campaign
   clear conditions / skreem economy / near-capture / deaths HUD still
   run on runner-centric assumptions; catch win does not give a clean
   "round over → menu / rematch" loop distinct from runner death.
5. **Process miss.** `v0.4.53` renamed a plan file into a shipped handoff
   and landed ~80 lines without answering the open kit questions or a
   real playtest. Shipped too soon.

---

## 2. What is the player supposed to do as a chaser?

### Fantasy (keep this simple)

You are the toilet. One AI Jayden is on Porcelain Palace. Your job is to
**close the gap and tag them once**. Round ends. No sheebs, no shop, no
level ladder. Same joystick / WASD + Space sprint as the runner — you are
just controlling the hunter sprite and camera.

### Why that was unclear before

Heretofore the entire product is "survive as runner." Chaser abilities
(Plunger Launch, wall-hacks, Broth Slip, rubber-band speed) exist as *AI
pressure on the runner*, not as a player fantasy. Shipping a menu button
without a one-sentence win loop left players with controls and no goal.

### Recommended v1 player brief (copy for UI / Player's Guide later)

> **Play as Chaser** — Hunt the AI runner. Move and sprint. Tag them once
> to win the round. No sheebs. Practice being the toilet.

---

## 3. Verdict: remove, or keep + refine?

| Option | Feasibility | Interesting gameplay? | LT value |
|---|---|---|---|
| **A. Soft-hide / disable menu button until hotfix** | Trivial | None until restored | Preserves code path |
| **B. Keep button + refine to playable thin loop** | **Feasible in 1–2 Mode B sessions** | Yes, if AI runner actually flees | High — controllable chaser + runner AI stubs |
| **C. Rip out Role Reversal entirely** | Medium (revert paths) | Removes a broken surface | Throws away useful scaffolding toward 2v2 |
| **D. Expand now into full chaser kit + campaign inversion** | **Too much** | Eventually yes | Blocks L10 arc; invents systems we do not need yet |

**Recommendation: B (keep + refine), optionally with A as a one-line
interim if Ken wants zero broken menu surface until the hotfix lands.**

Not too much **if** scope stays ruthless:

- Fix movement bug.
- Make AI runner wander + flee (still dumb is OK).
- Disable extra-chaser spawn + campaign advance in this mode.
- Clean round-over → rematch / menu.
- Still no economy, no multiplayer, no Plunger / wall-hacks until a later
  iterative slice.

**Do not** implement 2v2 / MOBA / shared lobby work in this track.

---

## 4. Iterative approach — reuse NPC chase, add attacks later?

**Yes — that is the right shape.**

| Slice | Player | Opponent | Kit | Goal |
|---|---|---|---|---|
| **v1.5 hotfix (next Mode B)** | Human chaser | Thin AI runner | Move + sprint only | Capture once |
| **v1.6 optional** | Same | Slightly smarter flee / wander | Optional: map Plunger Launch (or a single "attack") onto FIRE / F for the human lead chaser | Capture once; learn hunter timing |
| **Later** | Same or multi-toilet human+AI | Better runner AI (uses pickups?) | Selective AI ability port | Still single-player side mode |
| **LT multiplayer** | Human chaser(s) | Human runner(s) | Shared ability vocabulary | Phase 5 dependency |

Rationale: the existing chaser update loop already encodes pursuit, stun,
projectiles, wall-hacks. For v1.5 we **bypass AI pursuit for `chasers[0]`
and drive it from input** (already attempted). Later slices can **re-enable
ability ticks** (Plunger cooldown already on `skib-daddy`) under human
trigger instead of inventing a parallel combat system.

Do **not** let the NPC chase mechanism "keep hunting for you" on the
player-controlled body — that fights the stick. Extra AI toilets joining
mid-round is a separate product question; default for thin playable =
**one human chaser, one AI runner, no extras.**

---

## 5. Does role reversal help the *runner* game?

**Yes, as a design mirror — if the mode is actually playable.**

Playing as chaser teaches:

- Which corners feel unfair as hunter (feeds map pinches / near-miss UX).
- How sprint stamina asymmetry feels from the other side.
- Whether near-capture / resume countdown / jump-scare pacing is funny or
  mean when you are the one causing it.
- Which chaser abilities are satisfying to *use* vs only scary to *face*
  (guides which AI kits to keep for runner campaign).

It does **not** automatically improve runner balance — insight only lands
if someone playtests both roles and writes findings back into runner
tuning. Treat Play as Chaser as a **lab / mirror mode**, not as a second
campaign.

---

## 6. Does role reversal iterate toward LT 2v2 deathmatches?

**Partially — necessary scaffolding, not sufficient progress.**

| Prerequisite for 2v2 / CoD-like matches | Does thin Role Reversal help? |
|---|---|
| Controllable chaser input + camera | **Yes** — this is the missing control scheme |
| Runner that is not always the local human | **Yes** — even a dumb AI runner proves the entity can be AI-driven |
| Ability kit that works for humans | **Later** — optional v1.6+ |
| Network sync / server authority / matchmaking | **No** — still Phase 5 |
| 2v2 team rules, respawn, scoring | **No** — separate design |

Ken's LT sequencing from `v0.4.43-plan`: **Level 10 arc → Role Reversal →
MOBA/PvP**. That order still holds for *deep* Role Reversal. A **broken
menu mode** is worse than a parked one, so the immediate call is:

1. Hotfix or soft-hide (playable thin loop).
2. Keep deepening Role Reversal as a **parallel side mode**, not a blocker
   that must finish before L7–L10 content.
3. Use the controllable-chaser path as the preliminary for multiplayer
   roles once Phase 5 exists — do not pretend single-player Role Reversal
   *is* 2v2.

---

## 7. Roadmap planning posture (no `roadmap.md` edits this pass)

- **Keep** Role Reversal as an LT / side-mode track, not as the next
  campaign feature.
- **Do not** expand scope into multiplayer or 2v2 in coding sessions off
  this doc.
- **Do** treat a playable thin loop as valuable preliminary work toward
  Phase 5 role control.
- **Prioritize interesting gameplay for the main (runner) product** first
  when sessions compete; Role Reversal hotfix is justified only because
  the live menu currently ships a broken mode.
- Full campaign-as-chaser inversion stays out of scope indefinitely until
  Ken asks for it.

---

## 8. Open questions for Ken

| # | Question | Planning recommendation |
|---|---|---|
| 1 | Soft-hide `PLAY AS CHASER` until hotfix, or leave visible? | Soft-hide if next coding session is *not* the hotfix; else leave visible and fix first |
| 2 | Rematch in-place vs return to menu on capture win? | Return to menu with a one-line "Gotcha!" toast for v1.5; rematch button later |
| 3 | Allow extra AI toilets in chaser mode? | **No** for v1.5 — 1v1 only |
| 4 | Port Plunger Launch to human FIRE in a follow-up? | Yes as optional v1.6 — only after move+flee feels good |
| 5 | Gate mode behind Level 10 clear? | **No** for side mode; keep always-available once playable |
| 6 | Is Role Reversal still after L10 arc for *deep* work? | Yes — hotfix now, deep kit later |

Until Ken answers, Mode B should only implement the **unblocked hotfix
scope** in `roadmap-handoff-v0.4.61-plan.md` (movement + thin AI + 1v1
isolation + round end). Soft-hide and Plunger port stay flagged.

---

## 9. Files involved (for future Mode B)

- `frontend/src/GameEngine.js` — `isChaserMode`, `_getRunnerEvadeVector`,
  const `stepX`/`stepY` bug, capture branch, camera focus
- `frontend/src/App.jsx` — `PLAY AS CHASER`, `handlePlay(true)`,
  `handleCaught` (still runner-death shaped)
- `frontend/src/components/GameCanvas.jsx` — passes `isChaserMode`

No backend. No economy. No roadmap renumbering.
