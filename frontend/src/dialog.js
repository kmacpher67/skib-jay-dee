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
]

// Shown near the runner the moment stamina bottoms out mid-sprint.
export const TIRED_LINES = [
  "AHHH, I'M TIE-RED!",
  'GOTTA CATCH MY BREATH!',
  'NO MORE JUICE!',
  "I'M SO TIE-RED, BRO!",
]
