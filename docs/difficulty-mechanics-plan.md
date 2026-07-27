# Difficulty Mechanics Plan

**Created by:** Codex (GPT-5) — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-27

## Overview
The difficulty system should stay funny, readable, and economy-driven.
Instead of turning the game into a generic three-slider settings menu, the
preferred direction is a small starting-mode selector plus a debt-based
pressure ramp that changes the run as the player gets in trouble.

## Preferred direction

### Method C: The Debt Lock
- If `profile.sheebs < 0`, increase `CHASER_SPEED_MOD_MAX` by 15%.
- Negative pickups such as Heavy Plunger and Soggy TP should spawn 20%
  more often once the player is in debt.
- The difficulty curve should feel like a consequence of the player
  economy, not a separate meta menu they can solve in advance.

### Lightweight starting multiplier
- Use a small initial selector rather than a big tier matrix.
- The working sketch is `Noob-Noob` vs. `CEO of Drains`.
- That selector should apply a flat modifier to starting stamina drain
  and the extra-chaser spawn interval.
- Keep the modifier small enough that the run still feels like the same
  game, just with a different opening pressure.

## What this is not

- Not a mid-run toggle system.
- Not a full three-tier stat tree yet.
- Not the same thing as the death-log score fields; the death log slice
  should store raw run telemetry first, then any derived brag score can be
  computed later from those saved values.
- Not a code-ready implementation in this file. Treat this as the design
  note the later handoff should reference.

## Content follow-up

The roast/dialog flavor for a harder mode can still exist later, but it
should be layered on top of the economy-driven model instead of being the
core of the difficulty system.

## Auto-tuning refinement — reviewed 2026-07-27 (vibe pass, no code)

Ken raised the question of whether Method C should become a full
feedback-loop auto-tuner keyed off a rolling **deaths / sheebs earned**
ratio, prompted by outside AI (Gemini) suggesting a dedicated
`DifficultyManager` class. Reviewed and evaluated this session; the
signal is good, the proposed architecture is not — captured here as the
refined direction, still design-only.

### Verdict: extend Method C, don't add a manager class

A standalone `DifficultyManager` would be a new opaque subsystem sitting
on top of mechanics that already do most of this job
(`CHASER_SPEED_MOD_*` rubber-band, the Debt Lock's `profile.sheebs < 0`
check). Per this repo's own no-premature-abstraction rule
(`docs/skib-sdlc.md`), the rolling ratio should be a derived value that
*feeds* the existing knobs, not a new class that owns them. Concretely:
compute `deaths / sheebsEarned` over a rolling window of the last 5-10
runs (exact window TBD) and use it to adjust the *inputs* Method C
already reads, rather than introducing a second speed-control path that
has to be reconciled with the existing per-run rubber-band
(`CHASER_SPEED_MOD_DEATH_STEP`/`_LEVEL_STEP`). Two speed-adjusting
systems fighting over the same constant is a real risk if this isn't
kept to one lever.

### Preferred lever: economy, not enemy speed/AI

Adopting Gemini's "economic hedging" framing as the default direction:
when the rolling ratio looks bad, do **not** touch chaser speed,
pathing, or wall-hack rules — those stay identical run to run so the
chase itself is fully learnable/predictable (see "Predictability vs.
findability" below). Instead, bail the player out on the yield side:

- Bump positive-pickup spawn odds (Jayden Gun / Schleimy Potion / Taco
  Bell Grande) — this is the same lever the Debt Lock section above
  already proposes for negative pickups, just mirrored to the positive
  side.
- Bump the close-call / clean-escape payout (`docs/close-call-freeze.md`
  already pays +50 sheebs on a clean escape; this would be the
  auto-tuned value, not a new payout event).

### Hard floor bands stay level-indexed, not a new mechanic

The "can't nerf below a floor" requirement is already how
`CHASER_SPEED_MOD_MIN`/`MAX` work today (a clamp, not a menu). The
auto-tune's floor should be the same pattern applied to the *economy*
knob instead of speed: e.g. the positive-pickup-odds bump the rolling
ratio can grant should itself be capped tighter at higher `levelIndex`,
so a player deep in debt at Level 5 still faces a real Level 5, just
with somewhat better luck — not a Level 1 luck table. Exact per-level
caps are TBD, not specified here.

### Predictability vs. findability

Ken's stated goal ("less predictable gameplay is part of player
satisfaction, but some players like maps with specific findable
features") maps cleanly onto keeping this lever on the economy side:
chaser behavior and map layout (including Level 7's Mosaic rooms, once
built) stay the "findable" contract — the same rules produce the same
outcomes for a given seed/level. The auto-tuner's unpredictability lives
entirely in *how generous the run feels*, which is invisible until a
player is already struggling or already crushing it — it doesn't change
what's learnable about the chase itself.

### Still TBD — not decided by this pass

- Exact rolling-window size (5 runs? 10? time-boxed instead of
  run-count-boxed?).
- Exact per-level floor/ceiling values for the economy bump.
- Whether the rolling ratio reads `profile.deathsHistory`/session sheebs
  deltas directly (Enhanced Death Logs' raw telemetry fields, parked in
  `docs/handoffs/roadmap-handoff-v0.4.39-plan.md`) or needs its own
  derived field — recommend reusing the telemetry fields once they ship
  rather than adding a parallel tracking structure.
- This section stays a design note; no `DifficultyManager` class, no
  code, and no tuning constants should be treated as ready-to-implement
  until a follow-up planning pass turns this into a bounded handoff.
