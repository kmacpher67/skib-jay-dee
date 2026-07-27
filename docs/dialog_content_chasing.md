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
*Shown full-screen, jump-scare style, when the runner gets caught on 4chan-st difficulty. These blend the stuttering, cynical meta-commentary of Rick and Morty with aggressive, internet-poisoned trash talk.*

- [ ] "Oh, wow. Shocking. You died. In a literal two-button toilet game. I—I'd tell you to git gud, but honestly, your neural pathways are clearly operating on a room-temperature thermostat. Go back to watching the skibidi family, you absolute brain-rot enthusiast. Just delete the app, man. Save your device the embarrassment."
  - **Suggested filename:** `shyt-talker-insult1.mp3`
- [ ] "Boom! Caught you, you absolute scrub! What happened? Did a little fart noises distract your two remaining brain cells? It’s a 2D grid, bro! You just had to run away from a screaming family member! My grandson could code a bot to beat this blindfolded, and he’s currently huffing glue in the garage. Log off forever."
  - **Suggested filename:** `shyt-talker-insult2.mp3`
- [ ] "Are you—are you actually serious right now? You chose the hard mode just to get absolutely clapped by a literal shyt-poster? Wow. Incredible execution. Truly a peak gamer moment. Pull your pants up, wipe your tears, and go ask your mom for a juice box, because this difficulty clearly owns your soul."
  - **Suggested filename:** `shyt-talker-insult3.mp3`

### 4chan-st (Shyt-Talker) "Almost Gotcha" Lines
*Shown full-screen during the funny near-capture pause card on 4chan-st difficulty. **Important: These only trigger AFTER Level 3.** They act as an urgent, hyper-panicked gameplay cue.*

- [ ] "I SMELL THE BRAIN ROT! *[Loud sniff]*"
  - **Suggested filename:** `shyt-talker-near1.mp3`
- [ ] "Ooh, I'm gonna wipe you! I'm right behind you, bro!"
  - **Suggested filename:** `shyt-talker-near2.mp3`
- [ ] "*[Gasping Rick-style breath]* C-C-COMING FOR THAT TOILET ASS!"
  - **Suggested filename:** `shyt-talker-near3.mp3`
- [ ] "GG, kid! GG! Say goodbye to your streak!"
  - **Suggested filename:** `shyt-talker-near4.mp3`
- [ ] "*[Wet fart sound effect followed by manic laughing]* EXHAUST PIPES COMIN' HOT!"
  - **Suggested filename:** `shyt-talker-near5.mp3`

---

## Voice Acting Hints & Stylistic Direction

To get that perfect blend of unhinged cynicism and chaotic 4chan energy, focus on rhythm, breath, and micro-expressions rather than just shouting.

**1. The Vocal Archetype: "The Exhausted Genius Smug-Lord"**
* **The Tone:** A mix of extreme boredom and sudden, explosive annoyance. The character thinks everyone else is a complete idiot.
* **The Energy:** Fast, highly conversational, and deeply sarcastic. Avoid standard "video game villain" voices. 

**2. Delivery Techniques**
* **The "Rick" Stutter:** Repeat words or syllables at the start of thoughts as if the brain is moving too fast for the mouth (e.g., "I—I'd tell you..." as a single, rushed breath).
* **Sudden Sharp Inhales:** Take a sharp, audible gasp right before breaking into a fast insult.
* **Vocal Fry and Sighs:** Drop into a low, gravelly, bored tone at the end of sentences. Start with a heavy, annoyed sigh.
* **Laughing At the Player:** Mid-sentence chuckles or a sharp "Ha!" right before a punchline.

**3. Audio Production Notes**
* Keep the vocal mix completely "dry," crisp, and pushed right to the front. No heavy reverb or sci-fi echoes. It should sound like the chaser just grabbed the player's headphones.
* **For the "Almost Gotcha" lines:** Implement a 3D spatial audio (panning) engine based on chaser position, pitch the voice slightly up (1-2%) dynamically as they get closer, and instantly choke off the audio if the player breaks line of sight.

**4. The Core Aesthetic**
* Dark nihilism, cynical deconstruction of tropes, and unfiltered absurdist irony. The game acknowledges its own UI and mechanics to roast the player.

