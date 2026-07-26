# Roadmap Handoff — v0.4.31-plan

**Session mode:** Mode A (Planning — docs only, no code changes in this doc's scope)

Note on process: the canvas-boot crash originally investigated alongside
this plan was fixed, verified (18/18 Playwright tests), and shipped as
its own real code session — **v0.4.30.1**, see `docs/handoffs/ledger.md`
/ `docs/version-log.md`. It is not part of this plan doc. Going forward,
a bug found during planning gets its own Mode B session and its own
version — this doc stays plan-only.

This handoff finalizes the design for the two backlog items queued in
v0.4.30 (`docs/roadmap.md`): the "Jayden" Gun and the new "Lucky Charm"
shop item that surfaced while designing the Gun's acquisition path.
**All open questions below were answered directly by Ken on 2026-07-26.**

## Feature 1: The "Jayden" Gun

Goal: a funny, cool, challenging gun for the runner that keeps the game
difficult and interesting. Explicitly **not** a power fantasy or an "I
win" button — the constraints below exist specifically to keep it from
trivializing the chase.

### Confirmed design

- **Capacity:** randomized on pickup — only 1-2 usable shots out of a
  6-round cylinder (mostly empty chambers). Single-use pickup: once
  ammo runs out, the gun disappears rather than persisting as inventory.
- **Fire input:** a dedicated key fires a shot in the runner's current
  facing/movement direction. Skill-based, no auto-aim.
- **Hit effect:** a 3-5 second stun — the chaser freezes and plays a
  dazed animation/sound, then resumes at normal speed. No permanent
  despawn (would make the game meaningfully easier, against the goal).
- **Acquisition:** map pickup by default (same pattern as the Schleimy
  Potion), **plus** the new Lucky Charm shop item below raises the odds
  it (and other positive pickups) spawn — buying luck, not buying
  guaranteed guns.

### Still open (small, non-blocking — decide during coding, don't guess)

- Exact fire cooldown between shots (if the player somehow gets a
  second usable round).
- Comedic flavor specifics: a cap-gun "click" sound on an empty
  chamber, and a small "ouch"/dazed reaction (sound or text bubble) on
  the chaser when hit.

## Feature 2: "Lucky Charm" Shleeb Shop item + "Lucky" badge

Surfaced directly from the Gun's acquisition design — Ken's answer was
"both": the Gun spawns as a random map pickup, *and* there's a shop item
that increases the likelihood of positive pickups (Gun, Schleimy
Potion, future good items) showing up on the map. Pairs with a new
5th badge for "getting lucky."

### Confirmed design

- New Shleeb Shop item (alongside `turbo-clogs`, `deep-breath-tank`,
  `sheeb-magnet` in `frontend/src/gameContent.js` /
  `docs/gameplay-mechanics.md`) that raises the spawn odds of positive
  map pickups. A luck stat, not a guaranteed-spawn-per-run item.
- New badge, "Lucky" — 5th entry in `BADGES`, asset spec added to
  `docs/profiles/awards-badges-descriptions.md` (Asset 5, four-leaf
  clover + sparkle).

### Still open (flag for Ken before/during coding)

- The item's sheebs cost and the exact odds bump it grants (e.g. +X%
  positive-pickup spawn chance).
- Badge trigger: recommended to fire the first time the luck bonus
  actually *procs* (causes an extra positive pickup to spawn) rather
  than just on purchase — that's the moment that actually feels lucky.
  Needs Ken's explicit confirmation, same as the two items above, before
  a coding session treats it as settled.

## Execution order

Rolling Pickups (Mario-style) is a separate, still-undesigned backlog
item (`docs/roadmap.md`) — not in scope for this plan or its copy-paste
block below.

```text
code_monkey_model: default
code_monkey_backend: default

You are a Code Monkey agent working on Skib-Jay-Dee-Toilet in Mode B.
Read `docs/skib-sdlc.md` and `docs/roadmap.md` before starting. This is
a Mode B (code) session picking up an already-finalized Mode A plan —
do not re-litigate the confirmed decisions above, but do stop and ask
before guessing on anything still listed "open" above.

Scope for this pass — size to one session; if both don't fit, ship the
Gun first and leave Lucky Charm as the next handoff's opening item:
1. **The Jayden Gun:** map-pickup item, randomized 1-2/6 ammo, dedicated
   fire key in facing direction, 3-5s stun on hit, disappears at 0 ammo.
2. **Lucky Charm shop item + Lucky badge:** new shop entry that biases
   positive-pickup spawn odds; wire the "Lucky" badge to fire on the
   first actual proc (confirm this trigger call with Ken if it wasn't
   already settled by the time you start).

Verify with `npm run build` and the full Playwright suite before
calling it done. Update `docs/roadmap.md`, `docs/handoffs/ledger.md`,
`docs/version-log.md`, `docs/update-directions.md`, and a new
`docs/handoffs/roadmap-handoff-vX.Y.Z.md` per the SDLC checklist, and
commit before ending the session.
```
