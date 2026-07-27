# Dialog Content: Chasing and Captures

**Author:** kenmac
**Created:** 2026-07-26

This document memorializes the in-game dialog text used during the chase and capture events. 
It exists as a human-AI documentation trail to track what lines exist, where they are used, and to organize the to-do list for human voice recording.

All active text is implemented in `frontend/src/dialog.js`. If you add a line here, make sure it gets added there (and vice versa).

- these lines should be non-audio popup also. 

## Audio Recording To-Do List (For Ken)

**Note:** All of the dialog below is *already fully functional* in the game as visual, non-audio popups (speech bubbles and full-screen text). This means the audio is **not 100% required** — players can still fully enjoy the dialog while playing at work or church with the sound muted!

The voice clips are purely an optional enhancement for the "Audio 2" roadmap item to make the voice clips match the on-screen text bubbles 1:1. 

If/when you decide to record them, please follow the `docs/sound-effects-howto.md` guidelines and save them with the suggested filenames in `frontend/src/assets/audio/`.

### Chaser Lines
*Shown in a speech bubble above the chaser when it's closing in.*

- [ ] "SKIBIDI SKIBIDI!"
  - **Suggested filename:** `chaser-bark-skibidi.mp3`
- [ ] "I SEE YOU! YOU CAN RUN, BUT YOU CAN'T WIPE!"
  - **Suggested filename:** `chaser-bark-iseeyou.mp3`
- [ ] "YOU'RE COMPLETELY STALLED!"
  - **Suggested filename:** `chaser-bark-stalled.mp3`
- [ ] "SPACE BAR? MORE LIKE ESCAPE BAR."
  - **Suggested filename:** `chaser-bark-spacebar.mp3`
- [ ] "SKREEEEEEEEEE!"
  - **Suggested filename:** `chaser-bark-skreee.mp3`
- [ ] "AAAAAHHHH SKIBIDI!"
  - **Suggested filename:** `chaser-bark-ahhh.mp3`
- [ ] "I CAN HEAR YOU SCREEEEAMING!"
  - **Suggested filename:** `chaser-bark-hear-screaming.mp3`
- [ ] "SKIBIDI DOP DOP DOP YES YES!"
  - **Suggested filename:** `chaser-bark-dopdop.mp3`

### Capture Lines by SKIB.
*Shown full-screen, jump-scare style, when the runner gets caught.*

- [ ] "JAYDEN CAPTURED!"
  - **Suggested filename:** `capture-sting-jayden-captured.mp3`
- [ ] "YOU JUST GOT PLUNGED!"
  - **Suggested filename:** `capture-sting-plunged.mp3`
- [ ] "LOOKS LIKE YOU'RE COMPLETELY OUT OF PAPER!"
  - **Suggested filename:** `capture-sting-outofpaper.mp3`
- [ ] "TOOT-AL-OO! DOWN THE DRAIN YOU GO!"
  - **Suggested filename:** `capture-sting-tootaloo.mp3`
- [ ] "THAT'S A TOTAL WIPEOUT!"
  - **Suggested filename:** `capture-sting-wipeout.mp3`

### Tired Lines by Runner
*Shown near the runner the moment stamina bottoms out mid-sprint.*

- [ ] "AHHH, I'M TIE-RED!"
  - **Suggested filename:** `runner-tired-ahhh.mp3`
- [ ] "GOTTA CATCH MY BREATH!"
  - **Suggested filename:** `runner-tired-catch-breath.mp3`
- [ ] "NO MORE JUICE!"
  - **Suggested filename:** `runner-tired-no-juice.mp3`
- [ ] "I'M SO TIE-RED, BRO!"
  - **Suggested filename:** `runner-tired-bro.mp3`

### Near-Capture Interlude Lines
*Shown full-screen during the funny near-capture pause card.*

- [ ] "Noob-noob no no!!!"
  - **Suggested filename:** `near-capture-noobnoob.mp3`
- [ ] "Thanks, Noob-Noob. This guy gets it."
  - **Suggested filename:** `near-capture-thanks.mp3`
- [ ] "Oh lawd he comin!"
  - **Suggested filename:** `near-capture-ohlawd.mp3`
- [ ] "Too close for comfort!"
  - **Suggested filename:** `near-capture-tooclose.mp3`
- [ ] "Skib is right behind you!"
  - **Suggested filename:** `near-capture-behindyou.mp3`

### Coolness Dialog & Taunts (Difficulty Ramp)
*Shown during higher difficulty levels (Level 4+) or when the runner is executing slick moves (like narrow escapes or using the Gawd Particle).*

**Runner "Coolness" Lines (narrow escapes / item use):**
- [ ] "Too fast for the bowl!"
  - **Suggested filename:** `runner-cool-toofast.mp3`
- [ ] "Slippery like soap!"
  - **Suggested filename:** `runner-cool-slippery.mp3`
- [ ] "Not today, plumbing!"
  - **Suggested filename:** `runner-cool-nottoday.mp3`
- [ ] "I am the Gawd Particle!"
  - **Suggested filename:** `runner-cool-gawd.mp3`

**Chaser "Challenge" Lines (Level 4+ / Wall Hacks):**
- [ ] "WALLS CAN'T SAVE YOU NOW!"
  - **Suggested filename:** `chaser-hard-walls.mp3`
- [ ] "NO WHERE TO HIDE!"
  - **Suggested filename:** `chaser-hard-nohide.mp3`
- [ ] "I AM INEVITABLE. I AM SKIBIDI."
  - **Suggested filename:** `chaser-hard-inevitable.mp3`
- [ ] "YOUR DEBT IS DUE!"
  - **Suggested filename:** `chaser-hard-debt.mp3`

### 4chan-st (Shyt-Talker) Capture Lines
*Shown full-screen, jump-scare style, when the runner gets caught on 4chan-st difficulty. These should actively insult the player's lack of skill.*

- [ ] "[KEN: WRITE INSULT 1 HERE]"
  - **Suggested filename:** `shyt-talker-insult1.mp3`
- [ ] "[KEN: WRITE INSULT 2 HERE]"
  - **Suggested filename:** `shyt-talker-insult2.mp3`
- [ ] "[KEN: WRITE INSULT 3 HERE]"
  - **Suggested filename:** `shyt-talker-insult3.mp3`
