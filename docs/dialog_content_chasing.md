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

### directions for alex to create the audio files: 

Here are three edgy, rapid-fire capture lines tailored for your adult "4chan-st" difficulty. They blend the stuttering, cynical meta-commentary of Rick and Morty with aggressive, internet-poisoned trash talk.
## 4chan-st (Shyt-Talker) Capture Lines

* "Oh, wow. Shocking. You died. In a literal two-button toilet game. I—I'd tell you to git gud, but honestly, your neural pathways are clearly operating on a room-temperature thermostat. Go back to watching the skibidi family, you absolute brain-rot enthusiast. Just delete the app, man. Save your device the embarrassment."
* Suggested filename: shyt-talker-insult1.mp3
* "Boom! Caught you, you absolute scrub! What happened? Did a little fart noises distract your two remaining brain cells? It’s a 2D grid, bro! You just had to run away from a screaming family member! My grandson could code a bot to beat this blindfolded, and he’s currently huffing glue in the garage. Log off forever."
* Suggested filename: shyt-talker-insult2.mp3
* "Are you—are you actually serious right now? You chose the hard mode just to get absolutely clapped by a literal shyt-poster? Wow. Incredible execution. Truly a peak gamer moment. Pull your pants up, wipe your tears, and go ask your mom for a juice box, because this difficulty clearly owns your soul."
* Suggested filename: shyt-talker-insult3.mp3

Would you like to write more lines focusing on a specific family member chaser, or should we brainstorm some voice acting direction to get that perfect unhinged, stuttering delivery?

## voice acting hints for alex: 

To get that perfect blend of unhinged Rick and Morty cynicism and chaotic 4chan energy, your voice actor needs to focus on rhythm, breath, and micro-expressions rather than just shouting.
Here is the voice acting direction you can give your actor or use to evaluate auditions:
## 1. The Vocal Archetype: "The Exhausted Genius Smug-Lord"

* The Tone: A mix of extreme boredom and sudden, explosive annoyance. The character thinks everyone else is a complete idiot.
* The Energy: Fast, highly conversational, and deeply sarcastic. Avoid standard "video game villain" or "scary monster" voices. The humor comes from the chaser sounding like a real, deeply toxic internet user who is annoyed they even have to look at the player.

## 2. Delivery Techniques

* The "Rick" Stutter (Micro-Hesitations): Do not write out "u-u-uh" mechanically. Instead, have the actor repeat words or syllables at the start of thoughts as if their brain is moving too fast for their mouth.
* Example: "I—I'd tell you..." should sound like "I-I'd" said in a single, rushed breath.
* Sudden Sharp Inhales: Have the actor take a sharp, audible gasp for air right before breaking into a fast insult. It mimics the anxious, high-strung energy of Rick Sanchez.
* Vocal Fry and Sighs: Drop into a low, gravelly, bored tone (vocal fry) at the end of sentences. Starting a line with a heavy, annoyed sigh establishes instant dominance over the player.
* Laughing At the Player: Mid-sentence chuckles or a sharp "Ha!" right before a punchline makes the insult feel personal and mocking.

## 3. Script-Specific Direction Prompts
Give these direct prompts to your actor before they record the lines from earlier:

* For Line 1 ("Oh, wow. Shocking..."): "Start this line completely deadpan, like you are looking at a broken microwave. Build up the speed on 'neural pathways', and deliver the 'brain-rot' part with pure, dripping disgust."
* For Line 2 ("Boom! Caught you..."): "Start this one with an explosive, manic high-energy spike on 'Boom!', then immediately drop down into a fast, whispering-style rant for the rest of the sentence. Sound like you are leaning into their face."
* For Line 3 ("Are you—are you actually serious..."): "Play this with genuine, baffled disbelief. You aren't just mad; you are genuinely shocked by how bad the player is. Stutter hard on the 'are you—are you' part."

## 4. Audio Production Tip
Since these are full-screen jump-scare style lines, do not add heavy reverb or sci-fi echoes. Keep the vocal mix completely "dry," crisp, and pushed right to the front of the audio mix. It should sound like the chaser just grabbed the player's actual headphones and whispered directly into their ears.


--- 

## new almost gotcha audo for 4chan-st mode. 

You should definitely use new, distinct dialogue for the "almost gotcha" moments rather than recycling the capture lines.
When a chaser gets close, the player is in high-adrenaline survival mode. The audio needs to be shorter, hyper-panicked, and breathy, acting as an urgent gameplay cue. If you play a full, mocking insult before they actually die, it will confuse the player about whether they have lost yet.
Here are 5 dynamic "Almost Gotcha" lines designed for a 2-3 second scare factor, along with the audio mechanics to make them work.
## "Almost Gotcha" Proximity Lines (2-3 Seconds)
These lines cut off instantly if the player manages to break the line of sight or gain distance.

* "I SMELL THE BRAIN ROT! [Loud sniff]"
* Suggested filename: shyt-talker-near1.mp3
* "Ooh, I'm gonna wipe you! I'm right behind you, bro!"
* Suggested filename: shyt-talker-near2.mp3
* "[Gasping Rick-style breath] C-C-COMING FOR THAT TOILET ASS!"
* Suggested filename: shyt-talker-near3.mp3
* "GG, kid! GG! Say goodbye to your streak!"
* Suggested filename: shyt-talker-near4.mp3
* "[Wet fart sound effect followed by manic laughing] EXHAUST PIPES COMIN' HOT!"
* Suggested filename: shyt-talker-near5.mp3

------------------------------
## How to Code and Mix the "Almost Gotcha" Audio
To make these 2-3 second lines actually scary and useful for gameplay, implement these audio tricks:

* The "Proximity Panic" Filter: Unlike the dead-silent, dry capture lines, these proximity lines should use a 3D spatial audio (panning) engine. If the chaser is approaching from the bottom-left of the screen, the voice must scream out of the player's left headphone speaker.
* The Overdrive Trigger: Pitch the voice slightly up (1-2%) and increase the volume dynamically the closer the chaser gets. It creates an auditory illusion of a manic person running full speed at the player.
* The Instant Choke-Off: If the runner uses a dash or successfully turns a corner to escape, instantly cut the audio line off mid-word with a swift 0.1-second fade out. Hearing "I'm gonna wipe y—" get cut short adds a massive rush of relief and rewards the player for escaping.


--- 

## more details on stylistic choices 

Integrating fast-paced, cynical, and meta-referential dialogue from shows like Rick and Morty or 4chan-style culture can benefit a game by adding comedic relief, subverting traditional tropes, and driving rapid player engagement. Key benefits include comedic pacing, world-building through cynicism, and breaking the fourth wall. 
Comedic Pacing and Delivery 

• Rapid-fire banter: Characters talk over each other, finish sentences, and ignore grand exposition to keep the energy high. 
• Treated mundanity: Characters react to cosmic horrors or magic spells with bored annoyance instead of awe. 
• Improvised feel: Lines sound loose, stuttered, and unpolished, making the characters feel surprisingly human despite the bizarre setting. 

World-Building and Tone 

• Dark nihilism: Nothing matters on a grand scale, which frees the writers (and players) to make wildly chaotic choices without heavy moral weight. 
• Cynical deconstruction: Classic fantasy or sci-fi rules are openly mocked and broken by characters who know they are in a trope-heavy universe. 
• Unfiltered edge: 4chan-style irony and absurdity introduce unpredictable, chaotic elements that keep players guessing. 

Player Engagement 

• Meta-commentary: Acknowledging game mechanics, UI elements, or quest clichés directly through dialogue makes the game self-aware and funny. 
• Meme integration: Absurdist humor and catchphrases stick in the player's mind and build community culture outside the game. 

Would you like to explore how to apply this writing style to a specific game genre (like an RPG or a shooter) or create a sample dialogue scene for your project? 
AI responses may include mistakes.

