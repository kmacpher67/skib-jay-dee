# Roadmap Handoff Plan v0.4.43 — Long-Term Roadmap: Role Reversal, MOBA/PvP, Level 10 Arc

**Created by:** Claude Sonnet 5 — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-27
**Session mode:** Mode A (Planning — docs only, no code changes)

## Source

Ken, this session, dictating the Long Term (LT) roadmap directly:

1. "Players can choose chaser or runner. big change needs refinement
   details etc."
2. "MOBA (Multiplayer Online Battle Arena), or MMO?? idk, MOBA like world
   of war craft. or CoD v2v death matches with 4 players or 2v2 matches,
   but we need bodies for this and maybe decent servers."
3. "first we have to finish the grand arch of the game play i think LVL10
   will be the final scene and complete the arch. - working on this in
   the level development now."

Ken's own ordering is the sequencing: **finish the Level 10 arc first**,
then Role Reversal, then MOBA/PvP. This doc records all three as LT
roadmap entries with the refinement questions each one needs before any
of them is code-ready, and reconciles item 3 against the existing
Level 6/7 endgame plan.

## Recap: where the existing plans stood before this session

- **Phase 3 (roster/abilities/role-swapping)** in `docs/roadmap.md`'s
  phase table already had "role-swapping" written into its description
  since early in the project, but no design work has ever been done on
  it — it was an aspirational phrase, not a plan. This session is the
  first time it gets scoped.
- **Phase 5 (multiplayer)** is "backend scaffolded only" — a FastAPI
  WebSocket scaffold exists (per the phase table) but the frontend has
  never connected to it. The roadmap's one-line backlog item
  ("Multiplayer spike (Phase 5)") already flags this as "the biggest
  single item in the whole backlog... expect it to span multiple
  sessions."
- **Endgame arc**: `docs/level-progression-and-endgame-plan.md` proposes
  **Level 7** ("The CEO of Drains") as the climax/final scene, with an
  optional endless "New Game+" or Level 7+ Mosaic map afterward. Level 6
  is shipped (v0.4.38); Level 7 is parked pending Ken's answers to
  questions 3-4 in that doc's "Flag for Ken" section.

Ken's message this session ("I think LVL10 will be the final scene") is
new information that doesn't match the existing Level 7 climax plan.
**This is flagged as an open reconciliation question below, not silently
resolved** — see "Flag for Ken" item 1.

## 1. Grand Arc completion — Level 10 as the final scene

Ken is actively working on level development now (outside this planning
session), so this section is about keeping the docs honest and ready for
whatever lands next, not about designing Levels 7-10 here.

**What changed vs. the existing plan:** `docs/level-progression-and-
endgame-plan.md` currently names Level 7 ("CEO of Drains") as the climax.
Ken's new direction names Level 10. These aren't necessarily in conflict
— Level 7's "CEO of Drains" content could still exist as an earlier
boss/mid-arc beat, with Levels 8-9 as an escalation bridge and Level 10 as
the true finale. But that's a guess, not a decision, and per
`docs/skib-sdlc.md`'s "no code-cowboy" rule this doc is not allowed to
just pick one.

**Refinement questions (flag for Ken):**
1. Does "CEO of Drains" (currently written up as the Level 7 climax) stay
   at Level 7 as a mid-arc boss, move to Level 10 as the final boss, or
   get replaced by a different Level 10 concept entirely?
2. What's the throughline for Levels 8-9? New maps/mechanics, or an
   escalation of existing ones (more chasers, tighter time floors) used
   as connective tissue before the Level 10 finale?
3. Is Level 10 strictly the *last playable level* (game ends/loops after,
   per the existing "New Game+ vs. hard stop" question already open in
   the endgame doc), or is it the last *story* beat with endless play
   continuing past it the way Level 5 already works today?
4. Should Role Reversal and MOBA (sections 2-3 below) be gated behind
   finishing Level 10, or could either ship earlier as a parallel game
   mode? Ken's own phrasing ("first we have to finish the grand arch")
   reads as sequential, recording that as the working assumption here —
   confirm or correct.

**No roadmap renumbering happens in this pass** — `docs/level-
progression-and-endgame-plan.md` keeps its Level 7 content as-is, with a
new note added pointing at this doc and flagging the Level 10 question
above as unresolved. Once Ken answers, a future Mode A session updates
that doc for real (rename/reslot Level 7 content, sketch 8-9, write up
Level 10) before any Level 7+ coding session starts.

## 2. Role Reversal — players choose chaser or runner

Today the game has exactly one playable role: the runner. All chasers are
AI-controlled (`GameEngine.js`'s chaser update loop). Letting a player
*be* a chaser is a genuinely new control scheme, not a reskin — this is
correctly flagged by Ken as "big change needs refinement details."

**What has to exist before this is codeable:**

- **A controllable chaser.** Chasers currently have no input handling at
  all — speed/pathing/abilities (Plunger Launch, wall-hacks, etc.) are
  all AI-driven. Player-controlled chaser movement, camera/POV, and
  which of the AI abilities (if any) a human chaser gets to use on
  purpose are all undesigned.
- **A mode boundary.** Is this a new selectable mode from the main menu
  ("Play as Runner" / "Play as Chaser"), a mid-run swap, or a
  multiplayer-only feature (one human runner, one human chaser, the rest
  AI)? These are very different scopes:
  - **Single-player, AI opponent:** player picks chaser, an AI runner
    plays the runner role. Smallest scope — no multiplayer/server work
    needed, but requires writing a *runner AI* (evasion/pathing) that
    doesn't exist today either (the existing "AI" in this game is 100%
    chaser-side).
  - **Local hot-seat / same-device:** two players, one keyboard split or
    sequential turns. Awkward on the current single-viewport mobile-first
    layout.
  - **True multiplayer:** one human runner, one human chaser (or more),
    over the network. This is the real "cool fun" version Ken is
    describing, but it's fully dependent on Phase 5 (multiplayer spike)
    landing first — there is no server-authoritative match state today.
- **Economy/reward implications.** Sheebs, badges, and the debt economy
  are all runner-centric today (captures cost the runner sheebs, level
  clears pay the runner). Does a chaser role have its own reward loop
  (sheebs for captures?), or is chaser purely a "fun/asymmetric" mode
  with no economy at all?
- **Face/character implications.** Can a chaser-role player use their own
  uploaded face (currently only the runner supports face upload), or do
  they pick from the existing `CHASER_FACE_POOL`? Ties into
  `docs/characters.md`.

**Refinement questions (flag for Ken) — what makes this "cool fun for
players," not just a feature flag:**
1. Which scope first: single-player-vs-AI-runner (smallest, ships without
   Phase 5), or wait for real multiplayer? Recommend the former as a
   testable proof-of-concept for "does chaser POV feel fun at all" before
   investing in networking.
2. Does a human chaser get the same abilities as the AI chasers
   (Plunger Launch, wall-hacks at higher levels, multi-chaser spawns
   assisting them), or a distinct, more limited/more powerful kit tuned
   for being player-controlled?
3. Should chaser-mode have its own progression (a chaser-side sheebs/shop
   economy, chaser-specific badges), or is it a side mode that doesn't
   touch the existing runner economy at all?
4. Win condition for the chaser: capture the runner once? Capture within
   a time limit? Survive a similar "pressure ramps up" structure but
   inverted (the runner gets reinforcements instead of the chaser)?
5. Does this replace/extend any existing level, or is it a wholly
   separate mode selectable from the menu, orthogonal to level
   progression?

## 3. MOBA / PvP mode (2v2, 4v4 deathmatch-style)

Ken's own framing acknowledges the biggest blocker directly: "we need
bodies for this and maybe decent servers." This is explicitly the
largest-scope item of the three, and fully depends on Phase 5
(multiplayer) landing in a real, tested form first — Role Reversal
(section 2) in its multiplayer variant is a *subset* of what this needs,
so it makes sense as the next step after Role Reversal proves the
chaser-POV gameplay loop is fun, not before.

**Open scope questions, not yet a design:**
1. **Format:** small-team asymmetric chase (the existing runner/chaser
   dynamic scaled to teams — e.g. 2 runners vs. 2 chasers) vs. symmetric
   deathmatch (all players are the same role, last-one-standing or
   score-based) — these are very different games built on the same
   engine. Ken's message names both ("MOBA... or CoD v2v death matches")
   without picking one.
2. **Server/infra reality check.** "decent servers" implies real
   infrastructure cost and ops (matchmaking, lobby state, anti-cheat
   surface for a browser game) beyond what a WebSocket scaffold provides.
   This needs a cost/ops conversation before any design work, not just a
   gameplay one.
3. **Player base ("bodies").** A PvP mode with no players to match
   against isn't fun — needs a plan for either bots-to-fill or an
   accepted "friends-only lobby" scope first, rather than assuming public
   matchmaking on day one.
4. **Relationship to the single-player campaign.** Is this a fully
   separate game mode (different menu entry, no shared economy/
   progression with the Level 1-10 campaign), or does campaign
   progression (badges, sheebs, unlocked chasers) carry over into PvP
   loadouts?

**Recommendation:** do not scope this into a bounded handoff yet — it's
correctly placed as the last item in the stated sequence (finish the
Level 10 arc, then Role Reversal single-player, *then* revisit this once
Phase 5 multiplayer is real). Revisit after Role Reversal's single-player
slice ships and Ken has more clarity on "bodies and servers."

## Flag for Ken — decisions this doc does not make up

1. **Level 10 vs. Level 7 climax reconciliation** (section 1, question 1
   above) — blocks updating `docs/level-progression-and-endgame-plan.md`
   for real.
2. **Role Reversal scope** (section 2, question 1) — single-player-vs-AI
   first, or wait for multiplayer.
3. **Role Reversal ability/economy design** (section 2, questions 2-4).
4. **MOBA format** (section 3, question 1) — asymmetric team chase vs.
   symmetric deathmatch.
5. **MOBA infra commitment** (section 3, question 2) — whether "decent
   servers" is something Ken wants to invest in now or later.

## Explicitly not in scope this pass

- No code, no new `chaserType` or control-scheme work.
- No renumbering of `docs/level-progression-and-endgame-plan.md`'s Level
  7 content — that doc gets a pointer note only, real edits wait for
  Ken's answer to question 1 above.
- No commitment to Phase 5 multiplayer scheduling — this doc records the
  dependency, it doesn't queue the multiplayer spike itself.

---

## Copy-paste: next planning session (not a coding handoff)

```text
Read docs/skib-sdlc.md, docs/roadmap.md's new "Long-Term (LT) Roadmap"
section, docs/level-progression-and-endgame-plan.md, then this file
(docs/handoffs/roadmap-handoff-v0.4.43-plan.md).

This is a design-only LT item, not a bounded coding handoff yet. Do not
start coding Role Reversal, MOBA, or Level 7-10 content off this file
alone — it exists to carry open questions for Ken, not settled specs.

If Ken has answered any of the "Flag for Ken" questions above since this
was written:
- Question 1 answered -> update docs/level-progression-and-endgame-plan.md
  for real (reslot/rename Level 7 content, sketch Levels 8-9, write up
  Level 10), then this file's section 1 can be marked resolved.
- Questions 2-4 answered -> turn Role Reversal single-player scope into
  its own bounded -plan.md following the shape of v0.4.38's Skib-Daddy
  slice (small, one session, explicit acceptance criteria).
- Question 4/5 answered -> only then consider drafting a MOBA-specific
  planning doc; do not scope MOBA implementation before Phase 5
  (multiplayer) has shipped a real connected spike.

If none of the questions are answered yet, don't guess — keep this
parked and pull a different, unblocked backlog item from docs/roadmap.md
instead.
```
