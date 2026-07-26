# Help Me: Adding Sound Effects

No audio exists in the game yet. This doc is for whoever (human or agent)
adds it — how to get the clips, how to prep them, and how to wire them in.
Nothing here has been implemented; it's the "how do I even start" doc.

## Do you need to record anything yourself?

No, not for a first pass. Two options, and you can mix both:

1. **Record it yourself.** Best for anything with your/Jayden's voice
   (the dialogue lines already scripted in the PDF — "SKIBIDI SKIBIDI!",
   "I gotta go! I gotta go!", etc.) since a real voice reading the actual
   jokes is funnier than any stock clip. Your phone's voice memo app is
   fine; see prep steps below.
2. **Use free sound-effect libraries** for ambience, the flush sound, the
   bass-boost loop, and other non-dialogue effects. A few well-known
   sources with usable free/CC-licensed effects:
   - [freesound.org](https://freesound.org) — huge library, mixed
     licenses, always check the license tag per-clip (CC0 is easiest, no
     attribution needed).
   - [mixkit.co](https://mixkit.co) — free sound effects, no attribution
     required under their license.
   - [opengameart.org](https://opengameart.org) — game-focused, CC0/CC-BY
     content, good for chiptune-y ambience.

   Whichever you use, keep a note of where each file came from and its
   license — don't ship anything with an unclear license.

## Recording your own (quick path)

1. Record with your phone (voice memo app) or a laptop mic. A short quiet
   room take is fine — this game's tone is chaotic and lo-fi on purpose,
   it doesn't need studio quality.
2. Trim and export with **Audacity** (free, cross-platform):
   - Trim dead air from the start/end.
   - Normalize volume (`Effect > Volume > Normalize`) so all your clips
     are roughly the same loudness.
   - Export as `.mp3` or `.ogg`, mono, 44.1kHz — keeps file size small.
3. Keep clips short. Jump-scare stings and one-liners should be under two
   seconds; even the "chase loop" ambience should be a short loop (a few
   seconds) rather than a long recording, so it can repeat cheaply.
4. Aim for small files — a few hundred KB at most per clip. This is a
   mobile game; nobody wants a multi-MB audio payload on a cellular
   connection.

## Where files go / how to wire them in (when this gets built)

- Put finished clips in `frontend/src/assets/audio/` (new folder), named
  by what they're for: `flush.mp3`, `chase-loop.mp3`, `jumpscare-sting.mp3`,
  `sonic-shriek.mp3`, etc.
- Browsers require a **user gesture** before audio can autoplay — the
  first tap of "QUICK PLAY" is a good place to unlock/preload the audio
  context, not page load.
- Plain `<audio>` elements (via the `Audio` constructor) are enough for
  one-shot SFX; you don't need the Web Audio API unless you want mixing,
  volume ducking, or looping with crossfade. Given the engine already runs
  a plain-JS game loop in `GameEngine.js`, the simplest integration is:
  - Preload `new Audio(url)` instances once in the `GameEngine` constructor.
  - Call `.currentTime = 0; .play()` on the relevant instance at trigger
    points that already exist in the code: `_triggerCaught()` (jump-scare
    sting + flush), when `chaserLineTimer` resets (chaser bark), and when
    skreems tick up fast (proximity siren / heartbeat, optional).
  - Respect a mute toggle in the menu — some players will be in a quiet
    room. Persist the mute preference the same way `sheebs`/`ownedItems`
    persist, in `frontend/src/lib/cookies.js`.

## What to prioritize first

In order of "funniest per minute of work":

1. Jump-scare sting (plays on `_triggerCaught`) — biggest payoff per the
   PDF's whole design ("blown-out toilet flushing sound... screen goes
   black").
2. Capture-line voice clips — read the `CAPTURE_LINES` in
   `frontend/src/GameEngine.js` out loud, one per line.
3. Chaser bark lines — same idea for `CHASER_LINES`.
4. Ambient chase loop / bass-boost hum — lowest priority, nice-to-have
   background texture.

See also [docs/roadmap.md](roadmap.md) for where audio sits in the overall
backlog.
