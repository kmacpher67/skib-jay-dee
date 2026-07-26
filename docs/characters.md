# Characters

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

Jayden is the one player-controlled role: the kid getting chased through
the Porcelain Palace and beyond. `RUNNER_FACE_POOL` currently holds five
poses of the same person, randomized as the default face each time Quick
Play starts (unless the player uploads a custom face):

| id | label | vibe |
|---|---|---|
| `jayden-default` | Jayden Default | Neutral, standard running pose. |
| `jayden-uncaring` | Jayden Uncaring | Unbothered, mid-stride. |
| `jayden-skibby` | Jayden Skibby | Grinning, leaning into the chaos. |
| `jayden-getting-captured` | Jayden Getting Captured | Mid-panic, about to get caught. |
| `jayden-captured` | Jayden Captured | Post-capture, resigned. |

Right now all five are treated as one interchangeable pool — one is
picked at random when a run starts and stays fixed the whole run. They
were clearly posed with *specific in-game moments* in mind (uncaring →
idle/menu, getting-captured → the jump-scare beat, captured → the "YOU
DIED" screen), but the engine doesn't currently map pose → game state.
See the randomize-logic review in `docs/roadmap.md` for the plan to fix
that mismatch.

## Chasers

The toilet-creature roster hunting Jayden. `CHASER_FACE_POOL` currently
holds ten entries. The lead chaser still wears the menu-selected/
uploaded face for the whole run, but as of the v0.4.2-plan session, each
extra chaser spawned by the multi-chaser mechanic now rolls its own
independent pick from `CHASER_FACE_POOL` instead of copying the lead
chaser's face — simultaneous toilets no longer look identical.

| id | label | vibe |
|---|---|---|
| `skib-default` | Skib Default | The baseline Skibidty Toilet Guy. |
| `toiletman-wet` | Toiletman Wet | Drenched, straight out of the bowl. |
| `skib-killn` | Skibbidy Killn | Feral, mid-chase snarl. |
| `dad-case` | Dad Case | Deadpan "dad energy" chaser. |
| `yoodelling-unc-alex` | Yoodelling Unc Alex | The yodeling uncle bit — see below, a second pose is planned. |
| `ant-k-raman` | Ant K Raman | Raman-Aunt-Toilet-Lady-adjacent, from the PDF roster. |
| `anti-k-raman-2` | Anti K Raman 2 | Alt take on the above. |
| `ded-dad` | Ded Dad | Deadpan, unsettling. |
| `crazy-jack-chaser` | Crazy Jack | Wild-eyed, unhinged energy. |
| `sky-diver-motor-killer` | Sky-Diver (Motor Killer) | Grizzled, leather-jacket biker portrait — a road-warrior/biker take on the chaser roster, distinct from the toilet-creature designs. Landed this session. |

### Planned new chasers (not yet wired — plan only)

One new chaser is still queued up, following the same "drop image →
import → add pool entry" pattern once a coding session picks it up. See
`docs/roadmap.md`'s incremental backlog for the tracked item.

- **Yoodeling Unc — second pose.** A second photo for the existing
  "Yoodelling Unc Alex" bit was shared this session (costume shot: red
  pointed cap, blue-and-white Dutch outfit, "Dutch Boy" paint can,
  windmill/tulip backdrop — a yodeling/Alpine-adjacent gag). **This image
  has not been saved to the repo yet** — before a coding session can wire
  it, the user needs to drop the file into `images/` (matching the
  `images/yoodelling-unc-alex.png` naming pattern, e.g.
  `images/yoodelling-unc-alex-2.png`). Once it's on disk, treat it as a
  second `CHASER_FACE_POOL` entry alongside the existing one rather than
  a replacement — both poses of the same bit.

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

- **Skib-Daddy-Toilet Guy** — PDF describes a distinct ability (Plunger
  Launch), not just a reskin. Tracked in `docs/roadmap.md` as "New
  character" backlog item.
- **Raman-Aunt-Toilet Lady** — the `ant-k-raman` / `anti-k-raman-2` faces
  above may already be standing in for this character visually, but she
  has no distinct gameplay ability yet (Phase 3, not started).
