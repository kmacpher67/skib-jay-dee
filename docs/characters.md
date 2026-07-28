# Characters

**Last updated by:** Codex (GPT-5) — 2026-07-28

The in-game roster, as it exists today plus what's planned next. This doc
is the human-readable companion to `frontend/src/gameContent.js`
(`RUNNER_FACE_POOL` / `CHASER_FACE_POOL`) — that file is the source of
truth for what actually loads in the game; this doc explains who's who
and tracks what's planned but not yet wired.

**Pattern for adding a new face:** drop the source image in
`frontend/src/assets/`, import it, and add one entry to `RUNNER_FACE_POOL`
or `CHASER_FACE_POOL` in `frontend/src/gameContent.js`. Don't hardcode a
face path anywhere else in the engine — see `docs/skib-sdlc.md`.

Raw/unprocessed source photos land in the repo-root `images/` scratch
folder first (same pattern `audio/` and `video/` used before their assets
were moved into `frontend/src/assets/`) — a file showing up there means
it's a candidate for the pool, not yet wired.

## Runner — Jayden

Jayden is the human-controlled role in the runner campaign: the kid
getting chased through the Porcelain Palace and beyond.
`RUNNER_FACE_POOL` currently holds five poses of the same person,
randomized as the default face each time the runner game starts (unless
the player uploads a custom face). In Play as Chaser Beta, the selected
runner face instead belongs to the AI opponent; the selected chaser face
belongs to the human. Keep face ownership role-aware when adding
characters; see [role-reversal-design.md](role-reversal-design.md#11-strict-mode-boundary-for-present-systems).

| id | label | vibe |
|---|---|---|
| `jayden-default` | Jayden Default | Neutral, standard running pose. |
| `jayden-uncaring` | Jayden Uncaring | Unbothered, mid-stride. |
| `jayden-skibby` | Jayden Skibby | Grinning, leaning into the chaos. |
| `jayden-getting-captured` | Jayden Getting Captured | Mid-panic, about to get caught. |
| `jayden-captured` | Jayden Captured | Post-capture, resigned. |

As of this session, the engine maps pose → game state for the capture
beat: `jayden-getting-captured` shows the instant a capture happens (the
jump-scare zoom-in), then `jayden-captured` takes over once the zoom
finishes and holds until the chase resumes, when the run's original face
(random default, or the player's uploaded face if custom) comes back.
See `setFaces()` / `_triggerCaught()` / `_updateCaught()` in
`frontend/src/GameEngine.js`.

**Ken's decision (2026-07-27): collapse pool to 3 unique poses** until distinct
photos are supplied. Target ids: `jayden-default`, `jayden-skibby`,
`jayden-captured` (capture zoom-in and hold both use `jayden-captured` until
new getting-captured art exists). Mode B handoff:
[`roadmap-handoff-v0.4.56-plan.md`](handoffs/roadmap-handoff-v0.4.56-plan.md).

**Known asset gap (optional later):** Ken may still drop distinct
getting-captured / uncaring photos — if so, re-expand the pool without a code
session guessing roles.

## Chasers

The toilet-creature roster hunting Jayden. `CHASER_FACE_POOL` currently
holds ten entries. The lead chaser still wears the menu-selected/
uploaded face for the whole run, but as of the v0.4.2-plan session, each
extra chaser spawned by the multi-chaser mechanic now rolls its own
independent pick from `CHASER_FACE_POOL` instead of copying the lead
chaser's face — simultaneous toilets no longer look identical.

| id | label | vibe | profile |
|---|---|---|---|
| `skib-default` | Skib Default | The baseline Skibidty Toilet Guy. | [Profile](profiles/skib-default.md) |
| `toiletman-wet` | Toiletman Wet | Drenched, straight out of the bowl. | [Profile](profiles/toiletman-wet.md) |
| `skib-killn` | Skibbidy Killn | Feral, mid-chase snarl. | [Profile](profiles/skib-killn.md) |
| `dad-case` | Dad Case | Deadpan "dad energy" chaser. | [Profile](profiles/dad-case.md) |
| `yoodelling-unc-alex` | Yoodelling Unc Alex | The yodeling uncle bit — see below, a second pose is planned. | [Profile](profiles/yoodelling-unc-alex.md) |
| `ant-k-raman` | Ant K Raman | Raman-Aunt-Toilet-Lady-adjacent, from the PDF roster. | [Profile](profiles/ant-k-raman.md) |
| `anti-k-raman-2` | Anti K Raman 2 | Alt take on the above. | [Profile](profiles/anti-k-raman-2.md) |
| `ded-dad` | Ded Dad | Deadpan, unsettling. | [Profile](profiles/ded-dad.md) |
| `crazy-jack-chaser` | Crazy Jack | Wild-eyed, unhinged energy. | [Profile](profiles/crazy-jack-chaser.md) |
| `sky-diver-motor-killer` | Sky-Diver (Motor Killer) | Grizzled, leather-jacket biker portrait — a road-warrior/biker take on the chaser roster, distinct from the toilet-creature designs. Landed this session. | [Profile](profiles/sky-diver-motor-killer.md) |

### Planned new chasers (not yet wired — plan only)

One new chaser is still queued up, following the same "drop image →
import → add pool entry" pattern once a coding session picks it up. See
`docs/roadmap.md`'s incremental backlog for the tracked item.

- **Yoodeling Unc — second pose.** A second photo for the existing
  "Yoodelling Unc Alex" bit was shared this session (costume shot: red
  pointed cap, blue-and-white Dutch outfit, "Dutch Boy" paint can,
  windmill/tulip backdrop — a yodeling/Alpine-adjacent gag). **Ken will
  drop the file when ready** at `images/yoodelling-unc-alex-2.png` — still
  **blocked on asset** until then. Once on disk, treat it as a second
  `CHASER_FACE_POOL` entry alongside the existing one rather than a
  replacement — both poses of the same bit.

## Unprocessed source photos (scratch, not yet picked for any role)

Eight more raw phone photos (`images/PXL_20250824_213716870.jpg` through
`images/PXL_20250824_213836255.NIGHT.jpg`) already sit in the repo-root
`images/` scratch folder at the same 554×984 crop other chaser/runner
sources use, but none are referenced from `frontend/src/gameContent.js`
or named/renamed for a specific role yet. Same pattern as Sky-Diver and
the second Yoodeling Unc pose above: before wiring any of these in, the
user needs to say which character/pose each one is meant to be (or
confirm they're just unused burst shots) — don't guess a role and rename
them unprompted.

## OTHER NPC characters (tbd future)

From the PDF roster, not yet represented by any asset or pool entry:

- **Skib-Daddy-Toilet Guy** — Now implemented as the signature chaser for Level 6. Uses the `dad-case` face as a placeholder, has a slower base speed, and a Plunger Launch ability that pulls the runner on hit.
- **Raman-Aunt-Toilet Lady** — **Ability decided 2026-07-27 (design-only,
  not yet coded): "Broth Slip."** She leaves a persistent hot-broth
  trail as she chases; a runner who steps in it gets zero friction for
  2 seconds and drifts uncontrollably into walls/other chasers instead
  of responding to steering input — an area-denial hazard, distinct
  from Skib-Daddy's pull and the CEO of Drains' proposed slow. Uses the
  existing `ant-k-raman`/`anti-k-raman-2` faces (no new asset needed).
  Recommended to appear as a `chaserType` in the Level 5+ multi-chaser
  rotation (map-agnostic hazard, doesn't need her own level), and as a
  likely repeat addition to Level 7's climax roster alongside the CEO of
  Drains. She also gets her own themed bark pool ("Broth Slip" lines) —
  see `docs/dialog_content_chasing.md`. Full writeup in
  `docs/level-progression-and-endgame-plan.md`'s "Flag for Ken" item 6.
  Still needs exact `chaserType` stat tuning before this is a ready-to-
  code handoff.
