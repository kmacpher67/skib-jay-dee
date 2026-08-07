# Audio Recording Brief for Alex

**Created by:** Codex GPT-5 — 2026-08-07
**Created on:** 2026-08-07
**Last updated by:** Codex GPT-5 — 2026-08-07
**Last updated on:** 2026-08-07

This brief is the handoff for the audio-file creation pass that supports
the HUD/audio-overlay refinement work in `roadmap-handoff-v0.4.75-plan.md`.
It is intentionally separate from the code plan: this doc is for making
the source audio files themselves.

## What to make first

Keep the first batch small and useful:

1. **One ambient loop** for the HUD/game-state overlay.
2. **Three short state-reactive stingers**:
   - level start
   - near-miss
   - low health / high-risk
3. **Optional voiced variants** for the same state cues, if time allows.

If you only have time for one pass, do the voiced state cues first and
leave the ambient loop as a second pass.

## File naming rules

- Use lowercase, dash-separated names only.
- Avoid spaces, apostrophes, and mixed casing.
- Prefer `.mp3` for the shipped build; `.ogg` is fine if that is easier
  for source export.
- Keep voice clips short and loop beds seamless.
- Use category prefixes so the folder stays readable:
  - `hud-` for overlay/state cues
  - `near-capture-` for close-call lines
  - `runner-tired-` for low-health/tired lines
  - `capture-sting-` for full capture lines

## Proposed filenames

These are the preferred names for the new overlay batch:

- `hud-ambient-bed-loop.mp3`
- `hud-level-start-sting.mp3`
- `hud-near-miss-sting.mp3`
- `hud-low-health-sting.mp3`

If you record voiced variants for the overlay cues, use:

- `hud-level-start-igottago.mp3`
- `hud-near-miss-tooclose.mp3`
- `hud-low-health-catch-breath.mp3`

If you batch more voice work, keep the existing canonical naming pattern
from `docs/dialog_content_chasing.md`:

- near-capture lines already use `near-capture-*.mp3`
- tired lines already use `runner-tired-*.mp3`
- capture lines already use `capture-sting-*.mp3`

## Tone and performance direction

The voice should feel like the rest of the game: chaotic, funny, and a
little unhinged, but still clear enough to understand on a phone speaker.

- Read it like someone panicking while trying to sound cool.
- Keep the delivery punchy and breathy.
- Do not over-polish it into a studio-voiced commercial read.
- Short takes are better than dramatic long pauses.
- Exaggeration is good; mushy pronunciation is not.

Think: absurd toilet-chase parody, not clean cartoon narration.

## Dialog source of truth

Use the canonical text already maintained in
[`docs/dialog_content_chasing.md`](dialog_content_chasing.md). Do not
invent new lines for this pass.

For the overlay batch, the relevant pools are:

- Level start: use the existing start-of-run rally line from the audio
  notes in `docs/sound-effects-howto.md` and keep the delivery upbeat and
  immediate.
- Near-miss: record the existing near-capture interlude pool.
- Low health: record the existing tired-line pool.

If you want to batch a broader voice pass after the overlay batch, also
record the existing capture lines and chaser lines from the canonical
dialog doc.

## Practical recording notes

- Mono is fine.
- Keep raw takes short.
- Trim dead air.
- Normalize volume before export if possible.
- If a clip can be looped, make the loop seamless instead of long.

## What not to do

- Do not invent new gameplay lines unless Ken asks for them.
- Do not rename the existing canonical line pools in the docs.
- Do not make the clips so polished that they lose the rough parody
  energy.
- Do not wait on code changes before recording the source files.

## Notes for the coder

When the audio overlay slice is eventually implemented, it should pull
from these source files:

- ambient bed for the background layer
- level-start sting
- near-miss sting / voice cue
- low-health sting / voice cue

The code plan remains in `roadmap-handoff-v0.4.75-plan.md`.

