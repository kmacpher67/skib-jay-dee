# Roadmap Handoff Plan v0.4.64 — App Tracking / Instrumentation (Analytics + Error Monitoring)

**Created by:** Claude Sonnet 5 — 2026-07-28
**Last updated by:** Claude Sonnet 5 — 2026-07-28
**Session mode:** Mode A (Planning / features refinement — docs only, no code)
**Status:** Design-only / TBD. Not code-ready — two open decisions block a
coding session (see "Blocked on Ken" below).

**Note on file history:** this content was originally written to
`roadmap-handoff-v0.4.62-plan.md` in this same session, but a concurrent
session (Cursor Composer) landed unrelated content — a Rewards/polish
bundle — at that same path and number (commit `80c063e`), and a third
concurrent session (Antigravity) then also claimed `v0.4.63-plan.md`
(Main Menu UI cleanup). Re-filed here at the next free number so nothing
is lost. If you're picking a number for your own next handoff, `ls
docs/handoffs/ | grep -E "0\.4\.6[0-9]"` first — this repo runs several
concurrent planning sessions and the number is claimed on write, not on
reservation.

## Trigger

Ken dropped a snippet at
[`docs/notes-snippets/app-tracking-instrumentation.md`](../notes-snippets/app-tracking-instrumentation.md)
and asked for a features refinement pass (no code):

- Add a roadmap item to track player usage.
- Can we use a cloud tool for this? What about CORS?
- What's missing? What benefits the player, and Ken as developer?
- How does this interact with the 2v2/multiplayer roadmap?
- Can we add a support mechanism? Interplayer chat?
- Given a limited personal server, what should stay in the parking lot
  until server-side work is ready — do we need server-side at all, or
  eventually? Does this help Ken's other hosted apps?

Follow-up (same session): Ken flagged that the roadmap's existing
**Debug State Dump** item (`docs/roadmap.md`) may relate to this — see
"Relationship to Debug State Dump" below.

## Findings

**The game is a fully static site today** (confirmed in
[deployment.md](../deployment.md)) — nginx serves `frontend/dist/` as
plain files under `kenmacpherson.com/skib-jay-dee-toilet-game/`. No
process runs server-side. The FastAPI `backend/` directory is scaffolding
only, not deployed (Phase 5).

**CORS is not actually a blocker for this feature.** Third-party
analytics/error SDKs (Sentry, PostHog, etc.) work by having the player's
browser POST directly to *the vendor's* domain, not Ken's. CORS is
enforced by the *receiving* server — these vendors already ship
permissive CORS headers for exactly this pattern. So: front-end-only
works, and this needs **zero server-side code** to ship. This is the key
difference from multiplayer/chat below.

**Recommended tools — both free-tier, both `npm install` + one init call:**

- **Sentry** — crash/error tracking + performance (covers "bugs errors,
  code performance, memory, slowness, crashes"). Free tier ~5k
  events/month.
- **PostHog** — product/usage analytics + session replay + funnels
  (covers "player usage, number of players, time in app, levels").
  Generous free tier; self-hostable later if Ken ever wants to leave the
  cloud tier.

Both are literally the two tools the pasted Gemini search result named
(Sentry, LogRocket, OpenReplay) — Sentry + PostHog is the cheaper/more
generic pairing that covers the same ground (crash + replay) without
locking into LogRocket's pricing.

## Refinement — answers to Ken's specific questions

1. **What's missing from the original ask?** PII/privacy masking.
   PostHog session replay records the screen; this game has a face-upload
   feature, so replay must mask that input (and any future upload
   surfaces) by default, not as an afterthought. This is a real decision,
   not a config detail — see "Blocked on Ken" below.
2. **Benefit to players:** indirect but real — crash/perf visibility
   means bugs get fixed faster and balance tuning gets evidence instead
   of guesses. A more direct, in-tone benefit: expose aggregate stats
   back to players as comedic flavor text (e.g. "73% of Skibs never
   escape Pipeworks") — same data source as the item below, zero extra
   infra.
3. **Benefit to Ken as developer:** this is the *same* data source the
   already-backlogged **Pickup-consumption tracking + "Play Recap"
   screen** item needs (see `roadmap.md`) — PostHog funnels answer "where
   do players quit," "which badges nobody earns," "which levels get
   replayed," for free, instead of hand-rolling that logic client-side.
   Worth sequencing this near that item rather than as an island.
4. **Support mechanism — yes, and it's nearly free given the above.** A
   "Report a Bug" button that fires a tagged Sentry event (with a
   session-replay link attached) turns every player bug report into a
   direct, reproducible artifact instead of a vague DM. No server needed
   beyond what Sentry/PostHog already host.
5. **Interplayer chat — different animal, do not bundle.** Chat needs a
   live channel (WebSocket/pub-sub) plus moderation — that's a Phase 5
   (real backend) dependency already scoped in the LT roadmap, not
   something an analytics SDK gives you. Keep it parked with multiplayer,
   not folded into this item.
6. **Impact on 2v2/multiplayer roadmap:** neutral — this doesn't block or
   get blocked by Phase 5. It can ship now, independently. Once Phase 5
   lands, the *same* PostHog/Sentry projects extend server-side for real
   match telemetry (queue times, match balance) instead of needing a
   second system.
7. **What stays parking-lot until server-side is ready:** real-time
   match/session telemetry, interplayer chat, and any live leaderboard
   that needs a shared DB Ken owns (Phase 6, Mongo). What ships now,
   front-end only: error/crash tracking, session replay, usage funnels,
   the in-app bug-report button, and client-side event counts — all via
   a third-party SaaS's own hosted API, never touching Ken's server.
8. **Do we need server-side ever?** Only once multiplayer/chat/shared
   leaderboards land (Phase 5/6) — and even then, that server work is
   already scoped independently of this feature; analytics doesn't add a
   new server requirement of its own.
9. **Benefit to Ken's other kenmacpherson.com apps:** yes — one Sentry
   org / PostHog account can host multiple "projects," one per static
   site. Same init snippet + masking pattern drops into any other app on
   the same domain with near-zero marginal setup cost.

## Relationship to Debug State Dump

`docs/roadmap.md` already carries: *"Feature: Debug State Dump. Add a
debug function (e.g., triggered by `Triple Q` or `ctrl+alt+del`) that
performs a debug dump and allows copying game position data, relative
position level, and all debug info for problem-solving."*

That's the same "support mechanism" goal as item 4 above, via a
different mechanism — a manual, no-third-party-SaaS snapshot instead of
an automatic SDK capture:

- **Debug State Dump** = player/dev-triggered, client-only, copies raw
  state (position, level, debug info) to clipboard. No account, no SDK,
  no network call at all.
- **Sentry "Report a Bug" button** (item 4 above) = automatic, tied to a
  session-replay link, requires the Sentry/PostHog accounts this plan
  scopes.

They're complementary, not duplicates: the Debug State Dump's clipboard
output is exactly what a player would paste into a Sentry event's
context field, or into a Discord/email report, if the SDKs aren't wired
up yet. **Recommendation:** ship Debug State Dump first (it's small,
client-only, no blocked decisions) as the interim/manual support path,
then fold its output format into the Sentry bug-report button's event
payload once the SDK tier is chosen. They belong in the same roadmap
cluster, not as separate unrelated backlog lines.

## Blocked on Ken

- **Which tool tier:** confirm Sentry + PostHog (recommended) vs. a
  single all-in-one vendor (LogRocket) vs. self-hosted (OpenReplay) —
  affects pricing and setup steps.
- **Privacy/consent posture:** does session replay need a visible
  consent notice for this game's audience, and what exactly gets masked
  by default (face-upload input, at minimum)? This is a product decision,
  not something a coding agent should default on its own.

Neither blocker requires code to resolve — once Ken answers both, this
becomes code-ready as a small, single-session slice (SDK install + init +
event tagging on key funnels + the bug-report button). Debug State Dump
itself is **not** blocked and could ship independently first.

## Copy-paste: next natural steps

```
Mode A still open on the SDK piece — do not start that slice until Ken
answers both "Blocked on Ken" questions above (tool tier, privacy/consent
posture). Debug State Dump has no such blocker and can go first/standalone.

Debug State Dump slice (small, unblocked):
1. Bind a debug-dump trigger (e.g. Triple-Q or a dev-only key combo) in
   `GameEngine.js` / `App.jsx` that serializes current run state
   (position, level index, phase, chaser count, key timers) to an object.
2. Copy it to clipboard (`navigator.clipboard.writeText`) as formatted
   JSON; no network call, no third-party dependency.
3. Verify: `npm run build`, manual check the dump contains enough to
   reproduce a reported bug.

SDK slice (after Ken answers the two blockers):
1. `npm install @sentry/react posthog-js` in `frontend/`.
2. Init both early in `frontend/src/main.jsx`, gated behind env-based
   DSN/API-key config (no secrets committed).
3. Mask the face-upload input explicitly in PostHog's replay config.
4. Tag key funnel events: level start/clear, capture, badge earned,
   shop purchase — reuse the existing `rewardsHistory` log's event
   points in GameEngine.js as the tagging seams, don't invent new ones.
5. Add a "Report a Bug" button (menu or pause screen) that fires a
   tagged Sentry event, attaching the Debug State Dump payload (if
   shipped) plus the current PostHog session-replay URL.
6. Verify: `npm run build`, confirm no console errors with SDKs
   disabled (dev without DSN set) and enabled (dev with a real DSN).
7. Update `docs/roadmap.md`, `docs/version-log.md`,
   `docs/handoffs/ledger.md` per normal Mode B closeout.

Do not scope interplayer chat or real-time match telemetry into either
slice — those stay parked under Phase 5 multiplayer.
```
