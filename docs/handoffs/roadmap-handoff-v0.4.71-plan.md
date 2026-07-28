# Roadmap Handoff Plan v0.4.71 — Completeness Audit of v0.4.60–v0.4.69

**Created by:** Claude Sonnet 5 — 2026-07-28
**Session mode:** Mode A (Planning / refinement only — docs only, no code,
no build, `GAME_ITERATION` not bumped)

## Why this doc exists

Ken asked: "did everything land from `roadmap-handoff-v0.4.66-plan.md`? It
looks like only .67 got made — review this and all the plans from
.60–.69 for completeness and missing items." This doc is that audit,
verified against `git log`, `frontend/src/version.js` history, and a grep
of the actual shipped code (not just doc claims). It supersedes
`roadmap-handoff-v0.4.66-plan.md` as the current triage index — that doc
is now historical, read this one first.

**Bottom line: more landed than Ken's "only .67" impression suggested.**
`GAME_ITERATION` is actually **v0.4.69** — v0.4.65 (post-deploy push),
v0.4.67 (pickup tracking + Play Recap), v0.4.68 (Level 4 warning audio),
and v0.4.69 (Chaser Beta gun AI + profile isolation) all shipped for
real. But three real problems surfaced during this audit, listed below,
and several docs (`roadmap.md`'s backlog snapshot, both next-agent
briefs) had drifted stale enough to cause exactly this confusion.

## Verification method

For every `-plan.md` between v0.4.60 and v0.4.69, checked:
1. Does a matching non-`-plan` `roadmap-handoff-vX.Y.Z.md` exist?
2. Does `git log --oneline` show a real shipping commit for that version?
3. Does the claimed feature actually exist in the code (grep for the
   specific function/field/string named in the plan)?

## Finding #1 (real bug, needs a decision): two fabricated changelog entries

`frontend/src/components/VersionModal.jsx`'s `PAST_VERSION_NOTES` array
has entries for **v0.4.55 ("Micro-Skib Chaser")** and **v0.4.56 ("Runner
Pose Pool Collapse")** claiming both shipped. Neither did:

- `git log -p -- frontend/src/version.js` shows `GAME_ITERATION` jumping
  directly from `v0.4.54` to `v0.4.57` — v0.4.55 and v0.4.56 were never
  real shipped iterations.
- `grep -rn "micro-skib\|microSkib" frontend/src/GameEngine.js
  frontend/src/gameContent.js` returns nothing — no Micro-Skib chaser
  type exists in the engine.
- `RUNNER_FACE_POOL` in `frontend/src/gameContent.js` still has **5**
  entries (`jayden-default`, `jayden-captured`, `jayden-uncaring`,
  `jayden-skibby`, `jayden-getting-captured`), not the 3 the collapse
  plan (`roadmap-handoff-v0.4.56-plan.md`) specifies.
- `docs/version-log.md` has no entries for v0.4.55 or v0.4.56 either —
  only the in-game modal has them.
- `docs/roadmap.md` itself still lists both as open, unshipped,
  code-ready items (see the Micro-Skib and pose-collapse bullets in the
  Incremental backlog) — so the roadmap and the actual code agree with
  each other; only `VersionModal.jsx` disagrees, with players-facing
  text claiming shipped features that don't exist.

**This is a player-facing integrity bug**, not just a docs gap — anyone
opening "What's shipped lately" in the live game sees two features
described as live that aren't. Per `docs/skib-sdlc.md`'s no-code-cowboy
rule, this doc does not fix it (Mode A touches no code). It needs its
own Mode B session. Two options for that session, either is
Ken-decidable but neither requires him to answer anything up front:
  - (a) delete the two false `PAST_VERSION_NOTES` entries, or
  - (b) actually implement Micro-Skib (`v0.4.55-plan.md`) and pose
    collapse (`v0.4.56-plan.md`) for real, which would make the existing
    entries retroactively true.
Recommend (b) since both plans are already marked code-ready and are
next in the coding queue anyway (see queue below) — a Mode B session
doing them for real closes this gap without deleting anything.

## Finding #2 (real bug, fixed in this doc): v0.4.67 version-number collision

Two unrelated `-plan.md` docs both claimed the `v0.4.67` slot:

- `roadmap-handoff-v0.4.67-plan.md` (Codex GPT-5, 2026-07-28) scoped
  **Badge Award Counts / Repeat-Award History**.
- The version that actually shipped as `v0.4.67` (commit `7e29921`,
  "Shipped v0.4.67: Pickup-consumption tracking + Play Recap") is a
  **different feature** — Slice 2 of `roadmap-handoff-v0.4.62-plan.md`.

Badge Award Counts was never implemented — confirmed via
`grep -rn "badgeAwardCounts" frontend/src/` returning nothing. Its plan
doc is sound (Ken hasn't seen or rejected it), it just has the wrong
version number stamped on it, which would confuse a coding agent picking
it up next to a `version.js` that already says `v0.4.67` for something
else.

**Fix applied by this doc:** renumbered the Badge Award Counts plan to
`roadmap-handoff-v0.4.72-plan.md` (content unchanged, collision note
added at the top). `roadmap-handoff-v0.4.67-plan.md` is left in place
(append-only, don't delete history) with a correction header pointing to
the new file. `docs/roadmap.md`'s badge-award-counts bullet is updated to
point at `v0.4.72-plan.md`.

## Finding #3 (docs staleness, fixed in this doc): three docs drifted since v0.4.66

- `docs/roadmap.md`'s "Frontend open backlog snapshot" table (added
  during the v0.4.66 triage) still said `GAME_ITERATION` is v0.4.64 and
  listed v0.4.65/v0.4.67/v0.4.68/v0.4.69 as open/unshipped — all four
  have since shipped for real. Updated in this session (see diff
  alongside this file).
- `docs/next-agent-planning-brief.md` and `docs/next-agent-coding-brief.md`
  both still pointed at `v0.4.66-plan.md` as "start here" and said
  `GAME_ITERATION` is v0.4.64. Rewritten in this session to point here
  and to `v0.4.70-plan.md` (the actual next unblocked pick).
- `docs/roadmap.md`'s "Tooling: Post-deploy delayed git push" bullet
  still said "Needs refinement (2026-07-28)" even though it shipped as
  `v0.4.65` (commit `d0197f6`) the same day. Checked off in this session.
- `docs/roadmap.md`'s LT roadmap "Beta-removal debt" sub-bullet (recolor/
  label `PLAY AS CHASER` as experimental) was still unchecked even though
  `frontend/src/App.jsx:904` already renders a red "BETA" pill on that
  button. Checked off in this session.

This is the same failure mode Ken is reacting to: individual sessions
correctly shipped their own slice and updated their own handoff, but the
**cross-cutting summary docs** (the .66 triage table, the two
next-agent briefs) weren't touched by those later Mode B sessions, so
they silently went stale. Read `docs/roadmap.md`'s per-item bullets (the
"Incremental backlog" section), not the summary table, when in doubt —
the per-item bullets tracked accurately through this whole span; the
summary table did not.

## Confirmed status of every v0.4.60–v0.4.69 item

| Version | What it was | Real status |
|---|---|---|
| v0.4.60 | Difficulty selector (Noob-Noob/Casual/4chan-st) UI + persistence | **Shipped**, but selector has zero effect on chase difficulty — dead `'easy'`/`'hardcore'` string checks in `GameEngine.js`. Fix is Part 1 of `v0.4.70-plan.md`. |
| v0.4.61 | Play as Chaser (Beta) — human chaser + AI runner recovery | **Shipped.** Outcome UX (60s timer / Rematch-Menu) still open, see Finding-adjacent note below. |
| v0.4.62 | Rewards HUD Slice 1 (shop labels) | **Shipped.** Slice 2 (pickup tracking/Play Recap) shipped separately as v0.4.67. |
| v0.4.63 | Main Menu UI clean up | **Shipped.** |
| v0.4.64 | Debug State Dump | **Shipped.** (Sentry/PostHog half of the same plan doc stays blocked on Ken — tool tier + privacy posture.) |
| v0.4.64.1–.3 | Level 4 warning input hotfixes | **Shipped**, all three. |
| v0.4.65 | Post-deploy game-repo push automation | **Shipped** (commit `d0197f6`) — `docs/roadmap.md` bullet was stale, now fixed. |
| v0.4.66 | (Triage/audit doc, not a feature) | This doc's predecessor. Superseded by this file. |
| v0.4.67 | Pickup-consumption tracking + Play Recap | **Shipped** (commit `7e29921`). Collides with a same-numbered plan for Badge Award Counts — see Finding #2. |
| v0.4.67-plan (Badge Award Counts) | Badge/token repeat-award counts | **Not shipped.** Renumbered to `v0.4.72-plan.md`, see Finding #2. |
| v0.4.68 | Level 4 warning audio (sting/voice/accept-fate clips) | **Shipped.** |
| v0.4.69 | Chaser Beta: AI runner gun-seek/panic-fire + full profile isolation + dialog theater | **Shipped**, in two slices (profile isolation, then gun interaction) per its own plan's Mode B breakdown. |
| v0.4.70 | Level 5 chaser-speed rebalance + difficulty-selector wiring fix + Level 4 reward pass | **Code-ready, not yet shipped.** All open questions resolved by Ken (`docs/handoffs/ledger.md`'s 2026-07-28 entries). This is the correct next Mode B pick. |

## Still-open items not tied to a specific version number (unchanged by this audit)

These were accurately triaged in `v0.4.66-plan.md` and remain accurate —
re-verified, not re-derived:

- **Micro-Skib chaser** (`v0.4.55-plan.md`) — code-ready, not shipped
  (see Finding #1).
- **Runner pose collapse to 3 unique** (`v0.4.56-plan.md`) — code-ready,
  not shipped (see Finding #1).
- **Badge award counts** — code-ready, renumbered to `v0.4.72-plan.md`
  (see Finding #2).
- **Interactive content pack** (`interactive-content-pack.md`) — still
  concept-only, needs slicing into a bounded first increment.
- **Difficulty Debt Lock math (full Method C)** — the *wiring bug*
  (selector doesn't affect gameplay at all) is being fixed in
  `v0.4.70-plan.md`, but the actual debt-lock formula/thresholds remain
  design-only in `docs/difficulty-mechanics-plan.md`.
- **Level 7+ Mosaic Map of Madness** — blocked on Ken (floor-trap vs.
  held-item trigger question, never answered).
- **Sentry + PostHog SDK slice** — blocked on Ken (tool tier + privacy
  posture).
- **Audio 2 phase 1** — blocked on Ken (needs to record `CAPTURE_LINES`
  clips).
- **Yoodeling Unc, second pose** — blocked on Ken (needs to drop the
  image asset).
- **Role Reversal full v1.5 recovery, outcome UX** — blocked on Ken
  (60-second capture/timeout + Rematch/Menu shape still unconfirmed,
  per `v0.4.61-plan.md` "Flag for Ken"). Note: this is a *different* open
  question than the v0.4.69 Chaser Beta AI work, which shipped and did
  not require this answer.
- **Multiplayer spike (Phase 5)** — parked, largest item in the backlog.
- **Intro cinematic** — parked, no blockers, just not prioritized.

## Updated candidate queue for the next Mode B session

Ranked by what's actually unblocked and code-ready right now:

| # | Candidate | Source doc |
|---|---|---|
| 1 | Level 5 speed rebalance + difficulty wiring fix + Level 4 rewards | `v0.4.70-plan.md` — **fully resolved, do this next** |
| 2 | Micro-Skib chaser | `v0.4.55-plan.md` |
| 3 | Runner pose collapse (3 unique) | `v0.4.56-plan.md` |
| 4 | Badge award counts | `v0.4.72-plan.md` (renumbered) |
| 5 | Interactive content pack, first bounded slice | needs a Mode A slicing pass first, see `interactive-content-pack.md` |

Recommend running #2 and #3 together in one Mode B session if a coding
agent is picking up two small slices back-to-back — they touch the same
`gameContent.js` face-pool area and would also retroactively make the
`VersionModal.jsx` v0.4.55/v0.4.56 entries true (Finding #1, option b).

## Copy-paste: for the next Mode A session picking up this doc

```text
Read docs/handoffs/roadmap-handoff-v0.4.71-plan.md in full first — it is
the current triage index, superseding v0.4.66-plan.md. Before adding new
candidates, check git log since 2026-07-28 and whether v0.4.70-plan.md
has shipped yet (look for roadmap-handoff-v0.4.70.md and GAME_ITERATION
in frontend/src/version.js).

If Ken is present and answers any "Blocked on Ken" question (Role
Reversal outcome UX timer/rematch, Level 7+ Mosaic trigger, Sentry/
PostHog tool tier+privacy, Audio 2 recording, Yoodeling Unc-2 asset),
record the answer in the specific source doc named next to that item,
then update this doc's status and docs/roadmap.md's checkbox to match.

Do not re-derive the v0.4.60-v0.4.69 completeness table from scratch —
it was verified line-by-line against git log and a code grep this
session; only re-verify an individual row if new commits have landed
that might change it.

Two loose ends flagged by this audit still need a Mode B (not Mode A)
session:
1. The VersionModal.jsx v0.4.55/v0.4.56 false-entry bug (Finding #1) —
   recommended fix is to actually ship Micro-Skib + pose collapse so the
   existing changelog text becomes true, rather than deleting the entries.
2. Nothing else code-side; the v0.4.67 renumbering (Finding #2) is
   already resolved in docs only.
```
