# Experiment: how should roadmap items get tracked?

**Status: experimental, Mode A (planning-only) — no code changed.**
Dated 2026-08-07. Not a decision, a comparison for Ken to pick from
(or reject both).

## The question

`docs/roadmap.md` has worked as the single source of truth agents pull
from during the skib-sdlc pipeline (see `docs/skib-sdlc.md`). Two new
asks surfaced:

1. Should there be a dedicated roadmap *page* summarizing in-process
   items, kept in sync as skib-sdlc processes them?
2. Should GitHub Issues be used instead (or in addition), so players
   and contributors with GitHub accounts can comment/annotate on
   individual items?

## Option A: roadmap.md stays authoritative, add a summary page

Keep everything as-is — `docs/roadmap.md` is the working ledger agents
read/write every session per skib-sdlc Mode A/B. Add a lighter
`docs/roadmap-summary.md` (or similar) that's just a filtered "in
process now" view, regenerated/edited each skib-sdlc pass.

**Pros**
- Zero new infra. Already the pattern every agent session follows.
- Full context stays in one place agents already read first (`skib-
  sdlc.md` step 3 explicitly says "read `docs/roadmap.md`").
- No account/auth needed for anyone to read it — repo is already
  public.

**Cons**
- No way for a player or outside contributor to leave a comment
  without opening a PR to a markdown file (high friction, most
  players won't).
- A second summary page is another doc to keep in sync — direct
  violation of the "don't let it go stale" warning already in
  `roadmap.md`'s own header. Real risk it drifts.
- Doesn't solve "let players annotate" at all — that was Ken's actual
  ask, not just organization.

## Option B: GitHub Issues per roadmap item

Each roadmap item becomes a GitHub Issue (`roadmap` label), using the
new `.github/ISSUE_TEMPLATE/roadmap-item.md` template added this
session. `docs/roadmap.md` keeps a one-line pointer + issue link per
item instead of (or alongside) full prose.

**Feasibility check performed this session:**
- Repo is public, `gh` CLI already authenticated as the project owner.
- `MainMenu` in `App.jsx` **already links to
  `https://github.com/kmacpher67/skib-jay-dee/issues`** as the "Fair
  Use / Parody Warning" feedback link (shipped v0.4.39) — so players
  are already being pointed at Issues today, just with nothing there
  to find.
- No existing issue templates or roadmap-specific labels. Created a
  `roadmap` label and an issue template this session (see below).
- Created 4 example issues from the previous conversation's roadmap
  asks — confirms the whole flow (label, template fields, body
  formatting with checkboxes) works end-to-end:
  - [#1 Top HUD bar too wide](https://github.com/kmacpher67/skib-jay-dee/issues/1)
  - [#2 Toilet plunger swing rebalance](https://github.com/kmacpher67/skib-jay-dee/issues/2)
  - [#3 Gun rebalance](https://github.com/kmacpher67/skib-jay-dee/issues/3)
  - [#4 Taco fart attack rework](https://github.com/kmacpher67/skib-jay-dee/issues/4)

**Pros**
- Comments/annotation from anyone with a GitHub account, for free —
  directly answers Ken's ask.
- Already the destination the game's own feedback link points to.
- Cheap to set up — one label, one template, ~15 min of `gh` calls.
  No new service, no new account.
- Labels/milestones give free filtering (`roadmap`, could add
  `code-ready`, `design-only`, `blocked-on-ken` to mirror the
  skib-sdlc status vocabulary already used in `roadmap.md` prose).
- Issue numbers become stable references skib-sdlc handoffs can cite
  (`closes #3`) instead of prose cross-references that can drift.

**Cons**
- Two sources of truth risk: `roadmap.md` (agent-facing, skib-sdlc
  process) and Issues (player-facing) can disagree if not
  deliberately synced.
- Agents don't currently read GitHub Issues as part of the skib-sdlc
  checklist — would need a step added ("check for new/updated
  roadmap issues") or this becomes invisible to coding sessions.
- Public issue comments are unmoderated by default; parody-game
  audience plus fully public repo means some risk of noise/troll
  comments. Low stakes here (no PII, no prod access) but worth
  naming.
- GitHub Issues doesn't replace the *planning depth* `roadmap.md`
  entries carry (full design rationale, playtest quotes, blocked-on
  notes) — issues would need to stay a thinner "tracking + comments"
  layer, not a replacement for the prose ledger.

## Recommendation (non-binding — Ken decides)

Hybrid, not either/or:
- `docs/roadmap.md` stays the skib-sdlc source of truth agents read
  first every session — unchanged.
- New/significant roadmap items *also* get a GitHub Issue (via the new
  template), and the `roadmap.md` entry links to it.
- Add one line to `docs/skib-sdlc.md` Mode A step 3 ("Review the
  backlog for natural fits") telling the planning session to also
  skim open `roadmap` issues for comments/annotations before writing
  a handoff — that's the sync point, not a full mirror.
- Don't try to auto-sync status between the two; a human (or an
  explicit skib-sdlc step) updates both when an item's state changes.
  Auto-sync is a real feature but not needed to validate the
  experiment.

This is intentionally the smallest version of Option B that tests
whether players/contributors actually use it. If the 4 example issues
get zero engagement in a few weeks, that's a real signal to drop it
rather than build more automation around it.

## What was NOT done this session

- No automated sync between `roadmap.md` and Issues.
- No CI/bot to keep them in lockstep.
- No decision baked into `roadmap.md` yet beyond a pointer to this doc
  — see the new entry there.
- No code touched (Mode A only).

## Open question for Ken

Pick one:
- [ ] Go with the hybrid (roadmap.md stays primary, Issues added per
      item, skib-sdlc.md gets the one-line sync step)
- [ ] Issues-only for new items going forward
- [ ] Drop Issues, close the 4 example issues, roadmap.md-only stays
      as-is
