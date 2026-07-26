# Dialog Content: Chasing and Captures

This document memorializes the in-game dialog text used during the chase and capture events. 
It exists as a human-AI documentation trail to track what lines exist, where they are used, and to organize the to-do list for human voice recording.

All active text is implemented in `frontend/src/dialog.js`. If you add a line here, make sure it gets added there (and vice versa).

## Audio Recording To-Do List (For Ken)

For the "Audio 2" roadmap item, we want the voice clips to perfectly match the on-screen text bubbles 1:1. 
Below are the lines currently in the game. Please record them according to the `docs/sound-effects-howto.md` guidelines and save them with the suggested filenames in `frontend/src/assets/audio/`.

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

### Capture Lines
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

### Tired Lines
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
