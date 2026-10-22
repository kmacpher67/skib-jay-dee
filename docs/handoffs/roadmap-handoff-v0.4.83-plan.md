# Roadmap Handoff Plan v0.4.83 — Pac-Man Tunnel Easter Egg (Issue #8)

**Session mode:** Mode A (planning / refinement only — docs only; no code,
no build, no version bump, no deploy)
**Mode impact:** Runner campaign (Levels 1–6). Not Chaser Beta, not the
future boss mode.

GitHub issue: [#8](https://github.com/kmacpher67/skib-jay-dee/issues/8).
Inputs: Ken's issue body plus the "ai code monkey" recommendation comment
containing Ken's inline answers.

## Issues review done this session

- #5 and #9 are already closed on GitHub (shipped v0.4.78 / v0.4.81).
- #1 stays open: layout fix shipped v0.4.75, but sub-item 1.1 (audio overlay)
  is still unchecked.
- #2 stays open: shipped v0.4.76, roadmap says close once Ken confirms the
  feel in a live playtest. **Ken: confirm and say "close #2" to close it.**
- #3 stays open (Slice F voice, broader handgun/HP). #4, #6, #7, #8, #10 are
  unshipped.

## Settled by Ken (from issue + comment)

1. A collectible **Pac-Man award** ("the egg") spawns randomly on a level map.
2. Collecting it **activates side tunnels for the rest of that level**:
   runner exits one side edge and re-appears on the opposite side
   (left→right and right→left). Per-level activation only.
3. First discovery makes the award **permanent for the current game session**
   (resets on a new game). Every later level then **always places the egg on
   the map**; it is no longer random, but the player must still touch it to
   open the tunnels on that level. No cool down.
4. Spawn probability starts low at Level 1 (lowest on Noob-noob), rises with
   level (meaningful from Level 2, even on Noob-noob), and rises with
   difficulty. Eligible from Level 1 per the comment (the issue body said
   Level 2; the comment's "beginning around Level 1, lower probability"
   wins).
5. Reward is small one-time points/sheebs. Tunnels are never mandatory.
6. Round time extends on activation (issue body "Round time extends").
7. Optional up/down portal is **out of scope** for this slice.
8. Sound: Pac-Man-parody chime and tunnel-travel sound, with a PG-13
   Noob-noob variant and a 4chan-st variant (content to be written).
   Alex makes glyph/visuals/audio.

## Ken's answers (2026-10-22) — decisions now settled

1. **Name + reward:** accepted as proposed — "Waka Waka Flush", +50 sheebs,
   granted once on first-ever discovery.
2. **Visibility:** tunnel openings are drawn and usable **only after the egg
   is touched on that level**. Once activated in a game, the egg is placed at
   the start of every later level in that game (no roll).
3. **Cross-game memory:** once a player has *ever* earned the award, it is a
   **high-frequency** award in every later game: much higher first-appearance
   odds early in a game. This needs **cookie-profile persistence** (e.g. an
   `earnedBadges` entry `waka-waka-flush`, already supported by
   `normalizeProfile` in `frontend/src/lib/cookies.js`), so the earlier
   "session-scoped only" note is superseded. Within-game permanence
   (item above) still resets each new game.
4. **Round time:** no countdown needed. Activating the tunnel **extends that
   level's total length by extra seconds** (tunable constant, placeholder
   +20s) by raising the level's advance threshold
   (`MIN_LEVEL_SECONDS_BEFORE_ADVANCE`, `GameEngine.js:304`, used at ~1722 and
   the Level 4+ `requiredSeconds` check at ~2060). Not tied to issue #10.

### Still unanswered (agent uses safe default, do not widen)

- **Chasers using tunnels:** not answered. Default: runner-only, no chaser
  movement changes.
- **Re-activation reward on later levels:** default none.

## Ken-side / Alex todo (cannot be done by an agent)

- [ ] Alex: tunnel entrance/exit visual treatment (side-edge opening art).
- [ ] Alex: Pac-Man-inspired but original chime (egg pickup/activation).
- [ ] Alex: short tunnel-travel whoosh.
- [ ] Alex: award unlock sting (optional).
- [ ] Alex: award glyph/icon (or reuse existing badge style).
- [ ] Ken + creative: PG-13 Noob-noob and 4chan-st caption/line variants for
  pickup, first-ever discovery, and first tunnel use.
- Stub placeholders (silent or reused mp3 + canvas-drawn tunnel) ship first,
  same pattern as Boom Stick placeholders; real assets drop in by filename.

## Design

### Spawn roll (mirror Boom Stick C1)

Hook: level start, in `_syncLevelState()` after the map and pickups are
built, using the same style as `_tryBoomStickEvent()`
(`frontend/src/GameEngine.js:1777`).

```text
levelStep  = { noob: 0.015, casual: 0.03, hardcore: 0.045 }[difficulty]
baseChance = min(0.60, 0.04 + (displayedLevel - 1) * levelStep)
```

Initial table (tunable constants, Ken to adjust):

| Level | Noob-noob | Casual | 4chan-st |
|---:|---:|---:|---:|
| 1 | 4% | 4% | 4% |
| 2 | 5.5% | 7% | 8.5% |
| 3 | 7% | 10% | 13% |
| 6 | 11.5% | 19% | 26.5% |

Note: Ken's comment says noob-noob should still have "better chances starting
at level 2"; the table does that. These are placeholders — the egg is rare by
design and only first-discovery uses the roll.

State: `this.pacmanDiscovered` (bool, per game run, reset on a new game like
other run-scoped state such as the chaser speed persistence at
`GameEngine.js:352`); the lifetime flag is the profile badge. Per level: `this.pacmanActive` (false at level start),
`this.pacmanEgg` (pickup or null).

- If `pacmanDiscovered` (found earlier in this game) → always place the egg
  (no roll).
- Else roll the chance: `baseChance`, or, if the profile already holds the
  `waka-waka-flush` badge from a prior game, the boosted chance
  `min(0.85, baseChance * 4 + 0.25)` (placeholder; tunable, high frequency
  per Ken). Level 1 gets the boost too.
- Place with the existing wall-safe pickup placement helper (issue #5 fix) so
  it never lands in walls. One egg per level maximum.

### Activation and tunnel behavior

- Touching the egg: consume it, set `pacmanActive = true`, set
  `pacmanDiscovered = true`, extend the level advance threshold by the
  tunable extra seconds, and grant the +50 sheebs and the profile badge
  **only the first time ever (badge not yet earned)** (re-activation on later levels grants nothing,
  or a token amount — Ken to confirm; default: nothing).
- While active, `_moveWithCollision()` (`GameEngine.js:2834`) currently
  clamps x to `[24, WORLD.width - 24 - w]`. For the **runner only**, when
  active and the runner's body center is past the left/right edge band on a
  tunnel row, teleport to the opposite edge band instead of clamping.
  `WORLD` is 900×1500 portrait, so this is a horizontal wrap.
- Tunnel rows: a fixed pair of horizontal lanes per level (suggested one
  lane at mid-height), chosen so the edge column is wall-free on both sides.
  Implement as a per-level `tunnelRows` list in the level definition with a
  safety assert in the test that each lane is clear of `map.walls` at both
  edges. Cooldown: a ~0.3 s re-entry lockout after wrapping so the runner
  does not bounce back.
- Chasers never use the tunnels in v1 (no change to chaser movement).
- Does not apply to Level 6 boss-style mechanic changes or any future boss
  mode; Level 6 is eligible only if its map has a clear lane.
- Draw: tunnel openings drawn on active levels only (pending Ken's visibility
  answer); egg drawn as a simple canvas glyph until Alex's art lands.

### Persistence / cookies

`pacmanDiscovered` is per game and resets on a new game. The lifetime
"has ever earned it" flag is the `waka-waka-flush` entry in the cookie
profile's `earnedBadges` (cookie-backed profile state must be preserved per
AGENTS.md), granted on first activation, and drives the boosted roll. Add the
badge to `docs/badges.md`. A level-lifetime counter of tunnel uses may feed the Play
Recap (optional, not required).

## Slicing (each bounded for the code-monkey lane)

- **Slice 1 (engine, code-ready once Ken answers the section above):**
  state fields, roll, always-place-after-discovery, egg pickup + one-time
  reward, runner-only tunnel wrap on configured lanes, canvas-drawn
  placeholder visuals, no new audio files. Playwright via
  `window.__skibEngine`.
- **Slice 2 (presentation):** captions in three difficulty pools, placeholder
  chime/whoosh wired with the mute behavior established by Boom Stick E,
  Play Recap line, `docs/players-guide.md` and `docs/badges.md` entries.
- **Slice 3 (blocked on Alex):** real art/audio dropped in by filename.

## Verification contract (Slice 1)

Playwright (`cd frontend && npm run build && npx playwright test`):

- With `pacmanDiscovered=false`, force the roll high/low and assert egg
  presence accordingly on a level reset.
- With `pacmanDiscovered=true`, assert the egg is placed on every level 1–6,
  not inside walls (rect check against `engine.map.walls`), tunnels inactive
  until touched.
- Touch egg → `pacmanActive`, level advance threshold raised by the extra
  seconds, reward and badge granted only when the profile lacks the badge.
- With the badge in the profile, the first-appearance chance uses the boosted
  formula; a fresh profile uses the base formula.
- Move the runner off the left edge on a tunnel row while active → appears
  on the right edge, clear of walls, and not re-wrapped immediately; same in
  the other direction; no wrap when inactive or on a non-tunnel row.
- New game resets `pacmanDiscovered`.

Mode B ships per `docs/skib-sdlc.md`: bump `GAME_ITERATION`, ledger,
version-log, roadmap, deploy with `./scripts/deploy-static.sh pacman-tunnel`,
post a comment on #8 (Slice 1 only; leave #8 open until Slices 2–3 land).

## Explicitly not done

- No code in this session. No up/down portal. No chaser tunnel use. No visible
  level countdown (that is #10). No real audio/art.

## Copy-paste: next coding session (unblocked, Slice 1)

```text
Work in Mode B. Read docs/skib-sdlc.md, docs/update-directions.md,
docs/roadmap.md, and docs/handoffs/roadmap-handoff-v0.4.83-plan.md.

PRECONDITION: Ken's answers are recorded in the plan ("Ken's answers")
(answered by Ken 2026-10-22, see "Ken's answers"; chaser tunnel use stays
runner-only).

Implement only Slice 1 of GitHub issue #8 in frontend/src/GameEngine.js:
session flag pacmanDiscovered, per-level pacmanActive/pacmanEgg, level-start
spawn roll mirroring _tryBoomStickEvent, always-place after first discovery,
wall-safe egg placement, one-time +50 sheebs reward + profile badge
"waka-waka-flush" (award "Waka Waka Flush"), boosted roll when the badge is
already owned, +20s level-length extension on activation, tunnels drawn and
usable only after activation, runner-only horizontal wrap on per-level
tunnelRows with a 0.3s lockout. Canvas-drawn placeholders only.
Do not touch chaser movement, add audio files, or add a visible countdown timer.

Run `cd frontend && npm run build && npx playwright test`. If green, update
SDLC docs, bump GAME_ITERATION, commit, deploy with
`./scripts/deploy-static.sh pacman-tunnel`, comment on #8 (keep open).
```

Dispatch hints: `code_monkey_backend=ollama`,
`code_monkey_model=thinkpad-local` (split Slice 1 further if the model times
out).
