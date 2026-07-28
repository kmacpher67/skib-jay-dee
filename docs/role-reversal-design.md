# Role Reversal Design — Play as Chaser

**Created by:** Cursor Grok 4.5 — 2026-07-28
**Created on:** 2026-07-28
**Last updated by:** Claude Sonnet 5 — 2026-07-28
**Last updated on:** 2026-07-28
**Session mode:** Mode A (planning / refine — docs only, no code)

> **2026-07-28 update (Claude Sonnet 5):** Ken playtested Chaser Beta in
> the browser after the `v0.4.61` movement/steering recovery — the mode
> is playable (human chaser moves, AI runner flees) but the AI runner
> picked up the Jayden Gun and never shot back. New requirement: the
> runner AI must use helpful items and avoid harmful ones. This also
> surfaced that the "Pickups/quest rooms: Off in recovery slice" row in
> the mode matrix below was **never actually enforced in code** —
> `_syncLevelState()` spawns campaign pickups unconditionally regardless
> of `isChaserMode`. See
> [`roadmap-handoff-v0.4.69-plan.md`](handoffs/roadmap-handoff-v0.4.69-plan.md)
> for the corrected scope: pickups stay **on** (superseding the earlier
> "off" call, since Ken has now played and wants to keep them, just used
> intelligently), badges/tokens stay cosmetic-only (no profile/economy
> writes), and the AI runner gets seek-helpful/avoid-harmful pickup
> steering plus gun-fire-back logic.

Dedicated design doc for the Role Reversal / "Play as Chaser" feature that
shipped early as `v0.4.53`. Companion handoff:
[`docs/handoffs/roadmap-handoff-v0.4.61-plan.md`](handoffs/roadmap-handoff-v0.4.61-plan.md).
LT context:
[`docs/handoffs/roadmap-handoff-v0.4.43-plan.md`](handoffs/roadmap-handoff-v0.4.43-plan.md).
Original (under-reviewed) ship note:
[`docs/handoffs/roadmap-handoff-v0.4.53.md`](handoffs/roadmap-handoff-v0.4.53.md).

> **Roadmap direction changed in the follow-up refine:** Ken explicitly
> asked for a roadmap reminder to remove the experimental treatment only
> when the mode is no longer rough. That request supersedes the earlier
> "no roadmap edit" constraint for this docs-only pass.

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

**Recommendation: B (keep + refine).** Ken's follow-up resolves the menu
posture: leave the entry visible, change its color, and attach a concise
experimental/Beta callout. Do not present it as equal in maturity to the
runner game yet.

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
| **v1.5 recovery (next Mode B)** | Human chaser | Thin but wall-aware AI runner | Move + sprint only | Short timed tag round |
| **v1.6 optional fun slice** | Same | Better flee / feint behavior | One universal `BOWL RUSH` lunge on FIRE / F | Time the risky tag |
| **Later** | Same or multi-toilet human+AI | Better runner AI (uses pickups?) | Selective AI ability port | Still single-player side mode |
| **LT multiplayer** | Human chaser(s) | Human runner(s) | Shared ability vocabulary | Phase 5 dependency |

Rationale: the existing chaser update loop already encodes pursuit, stun,
projectiles, wall-hacks. For v1.5 we **bypass AI pursuit for `chasers[0]`
and drive it from input** (already attempted). The generic movement-vector
function already exists, so a new `InputHandler` class would add indirection
without fixing the mode boundary. Use a small "active human entity" seam and
prove that runner controls still work. Later, one universal lunge is a
cleaner first human ability than silently granting every face Skib-Daddy's
character-specific Plunger Launch.

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

1. Recover it behind honest Beta treatment; soft-hide only if the
   two-slice salvage gate fails.
2. Keep deepening Role Reversal as a **parallel side mode**, not a blocker
   that must finish before L7–L10 content.
3. Use the controllable-chaser path as the preliminary for multiplayer
   roles once Phase 5 exists — do not pretend single-player Role Reversal
   *is* 2v2.

---

## 7. Roadmap planning posture

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
- Keep a visible roadmap debt: remove the `Beta`/experimental menu
  treatment only after the exit criteria in section 13 pass and Ken
  approves the mode as genuinely fun.

---

## 8. Open questions for Ken

| # | Question | Planning recommendation |
|---|---|---|
| 1 | Soft-hide `PLAY AS CHASER` until hotfix, or leave visible? | **Resolved by Ken (2026-07-28): leave visible, recolor it, and add an experimental/Beta float-over** |
| 2 | Rematch in-place vs return to menu on capture win? | Recommend a result card with both **Rematch** and **Menu** |
| 3 | Allow extra AI toilets in chaser mode? | **No** for v1.5 — 1v1 only |
| 4 | First active ability after recovery? | Prefer a universal `BOWL RUSH` lunge; keep Plunger Launch character-specific |
| 5 | Gate mode behind Level 10 clear? | **No** for side mode; keep always-available once playable |
| 6 | Is Role Reversal still after L10 arc for *deep* work? | Yes — hotfix now, deep kit later |
| 7 | Timed round and rematch shape? | Recommend 60 seconds, catch = chaser win, timeout = runner win, then Rematch / Menu |

Until Ken answers, Mode B should only implement the **unblocked hotfix
scope** in `roadmap-handoff-v0.4.61-plan.md`. The menu labels/Beta
treatment are now unblocked. Do not record the 60-second timer, rematch,
or lunge as Ken decisions until he explicitly accepts them.

---

## 9. Files involved (for future Mode B)

- `frontend/src/GameEngine.js` — `isChaserMode`, `_getRunnerEvadeVector`,
  const `stepX`/`stepY` bug, capture branch, camera focus
- `frontend/src/App.jsx` — `PLAY AS CHASER`, `handlePlay(true)`,
  `handleCaught` (still runner-death shaped)
- `frontend/src/components/GameCanvas.jsx` — passes `isChaserMode`

No backend. No economy. No roadmap renumbering.

---

## 10. Follow-up synthesis — what makes this a game, not a debug toggle

The outside feedback is directionally right on three points: input must be
entity-agnostic, the runner needs an actual evasion role, and contact-only
capture needs more theater. The refinement is to avoid overbuilding those
ideas before the thin loop earns deeper work.

### Recommended one-minute arcade loop

1. Menu says **PLAY AS RUNNER** and **PLAY AS CHASER — BETA**. The chaser
   button uses a distinct experimental color and a nearby float-over:
   "Experimental beta — hunt the AI runner. No sheebs or campaign progress."
   Recommended treatment is hazard yellow (`#FFD54A`) with near-black
   text, implemented in `.chaser-btn` rather than an inline style. Because
   the game is mobile-first, the explanation must be visible/tappable and
   associated with the button for assistive tech; a hover-only tooltip is
   insufficient.
2. A three-beat opener says **YOU'RE THE TOILET NOW** and states the goal.
3. A **FLUSH CLOCK** counts down from 60 seconds. The human wins by tagging
   the runner; the runner wins on timeout.
4. An off-screen target arrow or brief footprint/scent trail keeps the
   portrait camera from turning the hunt into "where did the sprite go?"
5. The result card makes either outcome funny, then offers **REMATCH** and
   **MENU**. Candidate copy: "CAUGHT IN 4K (AND PORCELAIN)" on a tag;
   "OUTRUN BY A HUMAN. DEVASTATING." on timeout.

The 60-second clock and rematch are a **planning recommendation from the
agent feedback**, not a recorded Ken answer. They are the best current
shape because the clock supplies urgency, creates a real loss condition,
and makes tuning measurable without importing campaign progression.

### NPC runner behavior required for a fair chase

"Move directly away" is not enough; it pins the NPC against a wall. A
bounded v1 approach does not need A* pathfinding:

- Far away: move toward a periodically chosen walkable waypoint instead
  of idling.
- Under pressure: score several candidate headings (away, angled left,
  angled right) with short collision probes; choose a walkable direction
  that increases distance without entering a dead end immediately.
- When nearly tagged: allow an occasional telegraphed panic burst on a
  cooldown, not a constant speed advantage.
- If position changes by less than a small threshold for a few seconds,
  abandon the current heading/waypoint and recover.

This gives the runner legible behavior the player can learn. Perfect
evasion is not the goal: the human should win through route choice and
timed sprinting, not because the NPC freezes or lose because it reads
inputs unfairly.

### First active ability after the recovery

If move + sprint + timer is understandable but dull, add exactly one
universal tool in the next slice:

- **BOWL RUSH** on FIRE / `F`: short lunge, obvious wind-up, visible
  cooldown, and enough overshoot that missing is funny and costly.
- It does not deal damage; contact still tags the runner.
- Do not port AI wall-hacks, automatic Plunger Launch, Broth Slip, or a
  face-specific kit in the recovery slice.

Specific chaser kits can come later once chaser selection is a real
loadout choice. A universal lunge tests whether active hunting is fun
without coupling the beta to one face.

### Multi-toilet direction

Extra AI toilets should remain off in the first playable version because
they can steal the player's only objective. A later "toilet squad" variant
could let helpers herd or block the runner while only the human chaser can
score the tag. That is a new mode/ruleset, not a hidden reuse of the
campaign spawn timer.

## 11. Strict mode boundary for present systems

Role Reversal should be treated as a separate arcade ruleset, not campaign
state with the actors swapped.

| System | Play as Runner | Play as Chaser Beta |
|---|---|---|
| Human-controlled entity | Runner | Lead chaser only |
| AI-controlled entity | One or more chasers | One runner |
| Level progression | Campaign Levels 1–10 / endless plan | None; one explicit arena |
| Economy/profile writes | Sheebs, badges, deaths, best run, rewards | None in v1; do not mutate the profile |
| Shop/loadout bonuses | Apply to human runner | Do not leak onto the AI runner or human chaser |
| Pickups/quest rooms | Campaign rules | **On, corrected 2026-07-28** — pickups spawn and the AI runner should seek helpful ones (per `POSITIVE_PICKUPS`) and use them (e.g. fire the gun at the human chaser), and route around harmful ones; badges/tokens stay visually present but must not write profile/economy state. See [`roadmap-handoff-v0.4.69-plan.md`](handoffs/roadmap-handoff-v0.4.69-plan.md). |
| Extra chasers | Campaign pressure | Off; 1v1 only |
| Skreems/near-capture/death flow | Runner campaign | Replaced by target + clock + result |
| Difficulty selector | Runner campaign tuning | Pin a documented Beta baseline until runner-AI difficulty is designed |
| Camera/fog | Focus human runner | Focus human chaser; supply target-finding aid |
| Audio/dialog | Runner panic, chaser threats | Runner taunts/panic, chaser victory/failure; no runner-death sting |
| Face selections | Human runner / AI lead chaser | AI runner / human lead chaser |

The recovery acceptance test must assert the right-hand column. Fixing
movement alone while leaving campaign callbacks active does not satisfy
the Role Reversal goal.

## 12. Documentation contract for two modes

This file is the source of truth for cross-mode behavior. Avoid duplicating
the full matrix in every feature doc.

For every new gameplay roadmap item or handoff, add a **Mode impact** line
with one of:

- `Runner only`
- `Chaser Beta only`
- `Both — shared behavior`
- `Both — role-specific behavior`
- `TBD — blocked; do not implement`

Then answer only the affected checklist items:

1. Who receives human input?
2. Who receives AI, and what does difficulty mean?
3. What is the win/loss event?
4. Which HUD, camera, audio, and dialog communicate it?
5. Are pickups, abilities, and map mechanics enabled?
6. Can profile/economy/progression state change?
7. What regression proves the other role still works?

Where to document:

- `docs/role-reversal-design.md`: cross-mode contract, experience goals,
  Beta exit criteria, and future chaser direction.
- `docs/roadmap.md`: status, sequence, and explicit Beta-removal debt.
- `docs/handoffs/*-plan.md`: exact single-session implementation contract.
- `docs/players-guide.md`: only behavior that is actually shipped and
  usable; keep the known-Beta warning until recovery lands.
- Feature-specific docs: one short Mode impact note plus a link here when
  behavior differs; do not fork the entire feature specification.

## 13. Beta exit / salvage gate

Keep the feature only if the recovery creates repeatable chase decisions.
The button loses its experimental treatment only when all are true:

- Joystick and WASD move the human chaser without console/runtime errors.
- The normal Runner mode still passes its movement/sprint regression.
- The AI runner moves for the whole round, navigates around walls, and
  has stuck recovery; it does not idle simply because the chaser is far.
- The player can both win and lose a round; both outcomes have a clear
  Rematch/Menu path.
- No chaser round changes sheebs, badges, deaths, best run, rewards,
  owned items, highest level, or campaign difficulty state.
- Portrait mobile and desktop playtests make the target findable.
- At least five manual tuning rounds show non-automatic outcomes: catches
  require route choice, while timeouts remain possible.
- **(Added 2026-07-28)** The AI runner visibly uses pickups it collects —
  at minimum, fires the gun back at the pursuing human chaser — instead
  of carrying items inertly. See
  [`roadmap-handoff-v0.4.69-plan.md`](handoffs/roadmap-handoff-v0.4.69-plan.md).
- Ken explicitly approves removing the Beta treatment.

If those criteria cannot be met in two bounded Mode B slices, soft-hide
the entry and keep the controller/AI work as internal multiplayer
scaffolding. Do not keep a permanently broken public button because it
might be useful later.

## 14. Existing and future roadmap impact audit

| Roadmap/document area | Mode impact now | Required note |
|---|---|---|
| Levels 7–10 / endgame | Runner only | Deep Role Reversal still follows the story arc; Beta is one arena |
| Difficulty / Debt Lock | Runner only for now | Chaser difficulty later means runner-AI competence, not harsher debt |
| Pickups / interactive content | Runner only in recovery | Each future item must declare which actor can collect/use it |
| New chaser abilities | Both — role-specific later | Separate AI trigger from human input before exposing a kit |
| Faces / characters | Both — role-specific | Menu-selected runner becomes NPC in Chaser Beta; selected chaser is human |
| Audio/dialog | Both — role-specific | Speaker and target must not assume the human is always Jayden |
| Profiles/history/economy | Runner only | Do not log chaser catches as runner deaths |
| Desktop FOV/fog | Both — shared shell | Camera focus and target locator follow the human entity |
| Player's Guide | Both after recovery | Document Beta controls/objective without implying campaign rewards |
| Multiplayer / 2v2 | Future both | Reuse role ownership seams, not single-player AI rules or profile economy |
