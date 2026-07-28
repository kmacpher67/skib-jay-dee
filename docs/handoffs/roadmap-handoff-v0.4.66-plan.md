# Roadmap Handoff Plan v0.4.66 — Next-Iteration Candidate Queue & Refinement Triage

**Created by:** Claude Sonnet 5 — 2026-07-28
**Session mode:** Mode A (Planning / refinement only — docs only, no code,
no build, `GAME_ITERATION` not bumped)

## Why this doc exists

Ken asked for a no-code planning pass: review the roadmap backlog and
open handoffs, front-end only, and answer:

1. What's available to work on in the next iteration of handoff plan(s)?
2. Assemble candidates for the next handoff(s).
3. What needs refinement before it's codeable?
4. Break out each candidate with a copy-paste brief for a fresh agent to
   review/refine further.

This doc is the consolidated answer. It does not replace the individual
`-plan.md` files it points to — those stay the source of truth for their
own scope. `docs/next-agent-planning-brief.md` and
`docs/next-agent-coding-brief.md` are updated alongside this to stop
pointing at stale iteration numbers.

## ⚠️ Flag before anything else: uncommitted stray version bump

`frontend/src/version.js` currently reads `GAME_ITERATION = 'v0.4.64'` in
the **working tree, uncommitted** (`git diff` confirms; last real commit
set it to `v0.4.63`). No commit implements v0.4.64 — `buildDebugDump()`
does not exist anywhere in `frontend/src/` or `frontend/e2e/`. This looks
like a leftover from a Mode B session that bumped the constant before
writing the feature, then stopped.

**Mode A does not touch `frontend/src/`, so this file was left as found.**
Whoever picks up the next Mode B session (most likely to implement Debug
State Dump itself, see below) should either:
- finish the Debug State Dump slice and let `v0.4.64` become real, or
- revert the file to `'v0.4.63'` first if picking up different work,

so the constant never ships out of sync with what actually landed. Do not
carry this stray edit into a docs-only commit.

## Current confirmed state (verified this session, not from stale notes)

- `GAME_ITERATION` at last real commit: **v0.4.63** (Main Menu UI Clean
  Up, shipped `b87dd0d`).
- `roadmap-handoff-v0.4.62-plan.md` Slice 1 (Rewards HUD shop labels)
  shipped as `v0.4.62`. Slices 2–4 (Play Recap, pose collapse,
  Micro-Skib) are still open — see queue below.
- `roadmap-handoff-v0.4.64-plan.md` (Debug State Dump + Sentry/PostHog)
  and `roadmap-handoff-v0.4.65-plan.md` (post-deploy game-repo push) are
  both fully designed/code-ready on their unblocked slices but **neither
  has shipped code** — only docs commits exist for them so far.
- `docs/next-agent-planning-brief.md` and `docs/next-agent-coding-brief.md`
  both still said `v0.4.60`/`v0.4.63` as "current" in places — corrected
  in this session (see diffs alongside this file).

## Candidate queue for the next handoff(s), ranked

Ranking factors in Ken's explicit 2026-07-28 priority bump ("helps RCA
the Ramen Aisle recurrence") ahead of the previously-queued bundle order.

| # | Candidate | Readiness | Source doc |
|---|---|---|---|
| 1 | Debug State Dump | Code-ready, unblocked | `v0.4.64-plan.md` |
| 2 | Post-deploy game-repo push automation | Code-ready, unblocked (tooling, not gameplay) | `v0.4.65-plan.md` |
| 3 | Pickup-consumption tracking + Play Recap | Code-ready | `v0.4.62-plan.md` Slice 2 / `v0.4.41-plan.md` addendum |
| 4 | Runner pose collapse (3 unique) | Code-ready | `v0.4.56-plan.md` |
| 5 | Micro-Skib chaser | Code-ready | `v0.4.55-plan.md` |
| 6 | Role Reversal Beta label/recolor only | Code-ready, small, decided | LT roadmap item in `roadmap.md`, design in `role-reversal-design.md` |
| 7 | Role Reversal full v1.5 recovery | Partially blocked (outcome UX) | `v0.4.61-plan.md` |

Items 1–6 need **no further design refinement** — a Mode B agent can
pick any of them up cold. They're listed here as review/sanity-check
targets per Ken's ask, not because they're actually stuck. Item 7 is
blocked on one open question, called out in its own block below.

### 1. Debug State Dump — copy-paste for a reviewing agent

```text
Task: Sanity-check roadmap-handoff-v0.4.64-plan.md's Debug State Dump
slice (bottom copy-paste block only — ignore the Sentry/PostHog section,
that stays blocked on Ken) before it goes to a Mode B session.

Read: roadmap-handoff-v0.4.64-plan.md, GameEngine.js's existing
window.__skibEngine hook, docs/skib-sdlc.md Mode A rules (no code).

Check for:
1. Does the proposed buildDebugDump() field list still match current
   GameEngine state fields (phase, runner shape, chasers, brothFrictionTimer,
   sheebs, deaths, difficulty)? Grep GameEngine.js for any fields added
   since 2026-07-28 that a debug dump should also capture (e.g. new
   pickup timers from Micro-Skib or Play Recap if those land first).
2. Is Triple-Q still a safe keybind, or does anything newer already bind
   Q (check _onKeyDown)?
3. Note frontend/src/version.js currently has an UNCOMMITTED stray bump
   to v0.4.64 with no matching code — flag this to whoever picks up the
   Mode B session so they don't double-bump or ship a mismatched version.

Output: either confirm the copy-paste block in v0.4.64-plan.md is still
accurate as-is, or edit that file's block in place with corrections.
Do not implement code. Do not touch frontend/src/.
```

### 2. Post-deploy game-repo push automation — copy-paste for a reviewing agent

```text
Task: roadmap-handoff-v0.4.65-plan.md says "Design decided" and has a
full Mode B copy-paste block, but docs/roadmap.md's backlog line still
says "Needs refinement (2026-07-28)." Reconcile that inconsistency.

Read: roadmap-handoff-v0.4.65-plan.md (full Design + Copy-paste sections),
docs/roadmap.md's "Tooling: Post-deploy delayed git push" bullet,
scripts/deploy-static.sh.

Do:
1. Re-read the "Decided — Option E" section and the Mode B copy-paste
   block at the bottom of v0.4.65-plan.md. Confirm it's internally
   consistent (poll interval, timeout, marker filename all agree between
   prose and copy-paste).
2. If it holds up, update docs/roadmap.md's bullet to say "Code-ready"
   instead of "Needs refinement" so the next coding session doesn't
   assume there's an open design question that isn't actually there.
3. If you find a real gap (e.g. no .gitignore entry instruction, no
   handling for a repo with no remote `origin` configured yet), add it
   to the plan doc's "Open tuning knobs" section rather than leaving it
   implicit.

Output: docs/roadmap.md bullet updated to reflect true readiness; note
any real gaps found directly in v0.4.65-plan.md. Do not implement code.
```

### 3. Pickup-consumption tracking + Play Recap — copy-paste for a reviewing agent

```text
Task: Confirm roadmap-handoff-v0.4.62-plan.md Slice 2 (and its source,
the addendum in v0.4.41-plan.md) is still accurate now that Slice 1
(shop labels) has shipped as v0.4.62, and Main Menu UI Clean Up (v0.4.63)
has since changed layout around it.

Read: roadmap-handoff-v0.4.62-plan.md (Slice 2 section), v0.4.41-plan.md
addendum, roadmap-handoff-v0.4.63.md (what actually changed in the menu
layout), current App.jsx / RewardsHistoryModal.jsx.

Check for:
1. Does the planned "Stats tab in Rewards modal" placement still make
   sense against the v0.4.63 menu layout changes (status-row consolidation,
   mute button relocation)?
2. Does the pickup list to track (Jayden Gun, Schleimy Potion, Taco Bell,
   Rod of Poopdom, Turdstone, Heavy Plunger, Soggy TP, badges) still match
   gameContent.js's current SHOP_ITEMS / pickup set, or has anything been
   added/renamed since this slice was scoped?

Output: confirm the Slice 2 copy-paste block is still accurate, or patch
it in place. Do not implement code.
```

### 4. Runner pose collapse (3 unique) — copy-paste for a reviewing agent

```text
Task: Quick staleness check on roadmap-handoff-v0.4.56-plan.md before a
Mode B session picks it up — this is a small, low-risk slice, so the
review should be fast.

Read: roadmap-handoff-v0.4.56-plan.md, RUNNER_FACE_POOL in gameContent.js.

Check: has RUNNER_FACE_POOL changed (new faces added/removed) since this
plan was written? If yes, note which entries the "collapse to 3 unique"
instruction now applies to. If no, just confirm the block is still
accurate as written.

Output: one-line confirmation or a small patch to the plan doc. Do not
implement code.
```

### 5. Micro-Skib chaser — copy-paste for a reviewing agent

```text
Task: Quick staleness check on roadmap-handoff-v0.4.55-plan.md.

Read: roadmap-handoff-v0.4.55-plan.md, current chaser-spawn logic in
GameEngine.js (_maybeSpawnExtraChaser and related chaserType handling,
since Raman-Aunt and Skib-Daddy chaserTypes landed after this was
originally scoped).

Check: does the "replace extra spawn, L3+, 65% hitbox, 0.85x speed" spec
still fit cleanly alongside the chaserType variants that exist now
(dad-case, raman-aunt)? Does Micro-Skib need its own chaserType entry or
can it reuse an existing chaser's face pool with modified stats?

Output: confirm the plan doc's copy-paste block is still accurate, or
patch it in place with the current chaserType picture. Do not implement
code.
```

### 6. Role Reversal Beta label/recolor — copy-paste for a reviewing agent

```text
Task: This is the smallest open item in the LT roadmap — recolor/label
the "PLAY AS CHASER" menu entry as experimental/Beta. It's already
decided (not blocked on Ken), just never broken out as its own bounded
Mode B slice.

Read: docs/roadmap.md's "Long-Term (LT) Roadmap" section, item 2's
"Beta-removal debt" sub-bullet, role-reversal-design.md, current
MainMenu markup in App.jsx (the PLAY AS CHASER button, already renamed
from QUICK PLAY's sibling per v0.4.62).

Do: write a small, bounded Mode B copy-paste block (few lines: which CSS
class/color token to use for "experimental" styling, where the label
text goes, e.g. a small "(Beta)" suffix already partially present per
v0.4.62's rename — confirm whether the visual "Beta" treatment already
exists or is still just the text rename). If a design decision is
genuinely still open (e.g. exact color), flag it, don't invent one.

Output: a new small copy-paste block appended to role-reversal-design.md
or a fresh roadmap-handoff-v0.4.6x-plan.md, whichever fits without
duplicating v0.4.61-plan.md's larger recovery scope. Do not implement
code.
```

### 7. Role Reversal full v1.5 recovery — still blocked, refine the open question only

```text
Task: v0.4.61-plan.md's outcome UX (60s capture/timeout loop,
Rematch/Menu result card) is still awaiting Ken's confirmation on the
exact timer value and rematch behavior. Do not mark this unblocked
without an actual answer from Ken in the conversation.

Read: v0.4.61-plan.md "Flag for Ken" section, role-reversal-design.md
§12 two-mode documentation contract.

Do: if this session has Ken present and he answers the open question,
record his exact answer in v0.4.61-plan.md and role-reversal-design.md,
then mark the item unblocked in docs/roadmap.md. If Ken is not present,
leave it blocked — do not guess an answer on his behalf and do not
soften the "blocked" language.

Output: either a recorded decision + unblock, or no change (still
blocked). Do not implement code.
```

## Needs real design refinement (not just a staleness check)

These are genuinely not code-ready — a fresh agent should spend a Mode A
session resolving the open question(s), not just confirming a stale doc.

### A. Level 7+ Mosaic Map of Madness

```text
Task: docs/roadmap.md flags this as reviewed-but-still-TBD — one open
question was never answered: floor trap vs. held item to trigger a
dimension shift. See "Flag for Ken" item 7 in
docs/level-progression-and-endgame-plan.md.

Read: docs/level-progression-and-endgame-plan.md (full), the Mosaic
bullet in docs/roadmap.md's incremental backlog.

Do: if Ken is present, ask him directly which trigger mechanism he wants
(floor trap that fires on entry, vs. a held item the player chooses to
use). Do not pick for him. If he's not present, leave this parked and
say so explicitly — don't advance its status.

Output: either a recorded decision that unblocks scoping, or confirmation
it remains TBD.
```

### B. Difficulty Function — Debt Lock math (Method C)

```text
Task: The starting-difficulty selector shipped (v0.4.60), but the actual
"Debt Lock" math (Method C) referenced in docs/difficulty-mechanics-plan.md
is still design-only.

Read: docs/difficulty-mechanics-plan.md in full, the sheebs-debt economy
already shipped in v0.4.26 (GameEngine.js capture-penalty clamp logic) so
any new math composes with what's live, not a parallel system.

Do: draft the actual formula/thresholds for Method C (how difficulty
selection modifies the debt-lock behavior) as a concrete, codeable spec —
inputs, outputs, edge cases (level <=3 floor behavior, level >4 debt
behavior) — in difficulty-mechanics-plan.md. If a product decision is
needed from Ken (e.g. how harsh "4chan-st" difficulty's debt multiplier
should be), flag it explicitly rather than picking a number.

Output: an updated difficulty-mechanics-plan.md with either a concrete,
codeable spec or an explicit list of remaining open questions for Ken.
```

### C. Interactive content pack (secret items, gag awards, map personality)

```text
Task: docs/interactive-content-pack.md exists as a concept doc but
roadmap.md still lists this as open with no bounded slice.

Read: docs/interactive-content-pack.md in full, the existing pickup
catalog in gameContent.js (Jayden Gun, Schleimy Potion, Taco Bell,
Turdstone, Rod of Poopdom, Heavy Plunger, Soggy TP) so new proposals
don't duplicate an existing mechanic under a new name.

Do: break the concept doc's ideas into 1-2 single-session-sized slices
(per docs/skib-sdlc.md sizing rules) with concrete data shapes (name,
trigger, effect, spawn rate) instead of a general concept list. Flag
anything that needs a Ken product decision (which items, drop rates)
rather than picking defaults yourself.

Output: either a new roadmap-handoff-vX.Y.Z-plan.md with a bounded
first slice, or an explicit list of decisions still needed from Ken if
the concept is too underspecified to slice yet.
```

### D. Sentry + PostHog SDK slice (app tracking, non-Debug-Dump half)

```text
Task: v0.4.64-plan.md already fully scoped this — it is blocked on two
Ken decisions, not on more agent-side design work. Do not re-derive the
plan; just check whether Ken has answered either question yet.

Read: v0.4.64-plan.md "Blocked on Ken" section (tool tier: Sentry+PostHog
vs. LogRocket vs. self-hosted; privacy/consent posture for session
replay).

Do: if Ken answers either question in this session, record it verbatim
in v0.4.64-plan.md and update its "Status" line. If not, leave as
blocked — this item does not need further agent-side refinement, only
Ken's input.

Output: recorded answer(s) if given, otherwise no change.
```

## Blocked on Ken (no refinement possible, action items only)

- **Audio 2 phase 1** — Ken needs to record `CAPTURE_LINES` clips. See
  `dialog_content_chasing.md`.
- **Yoodeling Unc, second pose** — Ken needs to drop
  `images/yoodelling-unc-alex-2.png`. See `characters.md`.
- **Role Reversal outcome UX** — Ken needs to confirm the 60s timer /
  Rematch-Menu design (candidate 7 above).
- **Sentry/PostHog tool tier + privacy posture** — candidate D above.
- **Level 7+ Mosaic trigger mechanism** — candidate A above.

None of these should be marked "unblocked" in `docs/roadmap.md` until
Ken actually answers in a real conversation — per `docs/skib-sdlc.md`'s
"no code-cowboy" rule, a recommendation an agent writes itself is not a
decision Ken made.

## Not next iteration (parked, correctly so)

- **Multiplayer spike (Phase 5)** — explicitly the largest single item
  in the backlog; only after everything above feels solid.
- **Intro cinematic** — no blockers, but large and not prioritized this
  pass; stays in the general backlog.

## Copy-paste: for the next Mode A session picking up this doc

```text
Read docs/handoffs/roadmap-handoff-v0.4.66-plan.md in full first — it's
the current triage index. Before adding new candidates, check whether
any of its 7 ranked queue items or 4 lettered refinement items have
already been picked up (git log since 2026-07-28, and whether their
source -plan.md files show new edits). Extend this doc rather than
re-deriving the same list from roadmap.md again.

If Ken is present and answers any "Blocked on Ken" question, record the
answer in the specific source doc named next to that item (not just
here), then update this doc's status line and docs/roadmap.md's
checkbox/annotation to match.

Also check whether frontend/src/version.js's uncommitted v0.4.64 stray
bump (flagged at the top of this doc) has been resolved — if a Mode B
session shipped real v0.4.64 code, note that at the top of this section;
if not and it's still dangling, keep flagging it.
```
