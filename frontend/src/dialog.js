// dialog.js
// Central line library for Skib-Jay-Dee-Toilet. Every bit of in-game text
// (capture stings, chaser barks, runner exhaustion lines) lives here so it
// can be tuned without touching GameEngine.js. Add/remove/reword freely —
// just keep each array non-empty, GameEngine picks a random entry at
// trigger time.

// Shown full-screen, jump-scare style, when the runner gets caught.
export const CAPTURE_LINES = [
  'JAYDEN CAPTURED!',
  'YOU JUST GOT PLUNGED!',
  "LOOKS LIKE YOU'RE COMPLETELY OUT OF PAPER!",
  'TOOT-AL-OO! DOWN THE DRAIN YOU GO!',
  "THAT'S A TOTAL WIPEOUT!",
]

// Shown in a speech bubble above the chaser when it's closing in.
export const CHASER_LINES = [
  'SKIBIDI SKIBIDI!',
  "I SEE YOU! YOU CAN RUN, BUT YOU CAN'T WIPE!",
  "YOU'RE COMPLETELY STALLED!",
  'SPACE BAR? MORE LIKE ESCAPE BAR.',
  'SKREEEEEEEEEE!',
  'AAAAAHHHH SKIBIDI!',
  "I CAN HEAR YOU SCREEEEAMING!",
  'SKIBIDI DOP DOP DOP YES YES!',
  "Do you think we own the electric company?!",
  "I'm not mad, Jayden. I'm just disappointed.",
  "Ask your mother.",
  "Who left the lights on in here?!",
]

// Shown near the runner the moment stamina bottoms out mid-sprint.
export const TIRED_LINES = [
  "AHHH, I'M TIE-RED!",
  'GOTTA CATCH MY BREATH!',
  'NO MORE JUICE!',
  "I'M SO TIE-RED, BRO!",
]

// Shown full-screen during a near-capture interlude.
export const NEAR_CAPTURE_LINES = [
  'Noob-noob no no!!!',
  'Thanks, Noob-Noob. This guy gets it.',
  'Oh lawd he comin!',
  'Too close for comfort!',
  'Skib is right behind you!',
]

// Shown near the runner when the Jayden Gun is fired with no rounds left.
export const GUN_CLICK_LINES = [
  '*click*',
  'EMPTY CHAMBER, GENIUS.',
  'SAVE THE DRAMA, IT AIN\'T LOADED.',
]

// Shown in a speech bubble above a chaser the instant it gets stunned.
export const GUN_HIT_LINES = [
  'OW MY BUTTHOLE!',
  'NOT THE FACE!',
  'WHY DOES IT SMELL LIKE GUNPOWDER?!',
  'BRO SHOT ME?!',
  'DAZED AND CONFUSED!',
]

// Level 4 "Stakes Are Real" transition screen text.
export const LEVEL_4_RULES = {
  header: 'WARNING: WELCOME TO LEVEL 4. THE STAKES ARE REAL.',
  body: [
    'DEBT IS REAL: Your Sheebs no longer stop at zero. Get caught, and you go into the red. You owe the Toilet.',
    'SHOP SLOP AT RISK: Every time you are captured, there is a 25% chance the Skibs will steal one of your hard-earned stat upgrades.',
    'BUY IT BACK: Stolen items are returned to the Shleeb Shop. Pay off your debt and buy them back... if you survive.',
  ],
  button: 'I ACCEPT MY FATE',
}

// Runner "Coolness" Lines (narrow escapes / item use):
export const COOLNESS_LINES = [
  'Too fast for the bowl!',
  'Slippery like soap!',
  'Not today, plumbing!',
  'I am the Gawd Particle!',
]

// Chaser "Challenge" Lines (Level 4+ / Wall Hacks):
export const HARD_CHASER_LINES = [
  "WALLS CAN'T SAVE YOU NOW!",
  "NO WHERE TO HIDE!",
  "I AM INEVITABLE. I AM SKIBIDI.",
  "YOUR DEBT IS DUE!",
]

// Raman-Aunt-Toilet Lady — Broth Slip (spawn bark, trail-hit taunt, capture).
export const BROTH_SPAWN_LINES = [
  "BROTH'S ON, BABY! GET IN THE POT!",
  "YOU CAN'T OUTRUN AUNTIE'S SOUP!",
  "SLURP SLURP, I'M COMING FOR SECONDS!",
]

export const BROTH_HIT_LINES = [
  "SLIP N' SLURP, BABY!",
  'THAT BROTH IS PIPING HOT, AND SO IS THIS CHASE!',
  "NOW WHO'S SLIPPERY?!",
]

export const BROTH_CAPTURE_LINES = [
  'SIMMERED DOWN AND SERVED!',
  'INTO THE POT YOU GO!',
]
