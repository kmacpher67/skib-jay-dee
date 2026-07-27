import jaydenDefault from './assets/jayden-default.jpg'
import jaydenCaptured from './assets/jayden-captured.jpg'
import jaydenUncaring from './assets/jayden-uncaring-4029.jpg'
import jaydenSkibby from './assets/jayden-skibby.JPG'
import jaydenGettingCaptured from './assets/jayden-getting-captured.jpg'
import skibDefault from './assets/skib-default.jpg'
import toiletmanWet from './assets/Toiletman_wet.jpg'
import skibKilln from './assets/skibbidy-toilet-killn.jpg'
import dadCase from './assets/dad-case.JPG'
import yoodellingUncAlex from './assets/yoodelling-unc-alex.png'
import antKRaman from './assets/ant-k-raman.PNG'
import antiKRaman2 from './assets/anti-k-raman2.PNG'
import dedDad from './assets/ded-dad.jpg'
import crazyJackChaser from './assets/crazy-jack-chaser.jpeg'
import skyDiverMotorKiller from './assets/sky-diver-motor-killer.png'

export const RUNNER_FACE_POOL = [
  { id: 'jayden-default', label: 'Jayden Default', src: jaydenDefault },
  { id: 'jayden-captured', label: 'Jayden Captured', src: jaydenCaptured },
  { id: 'jayden-uncaring', label: 'Jayden Uncaring', src: jaydenUncaring },
  { id: 'jayden-skibby', label: 'Jayden Skibby', src: jaydenSkibby },
  { id: 'jayden-getting-captured', label: 'Jayden Getting Captured', src: jaydenGettingCaptured },
]

export const CHASER_FACE_POOL = [
  { id: 'skib-default', label: 'Skib Default', src: skibDefault },
  { id: 'toiletman-wet', label: 'Toiletman Wet', src: toiletmanWet },
  { id: 'skib-killn', label: 'Skibbidy Killn', src: skibKilln },
  { id: 'dad-case', label: 'Dad Case', src: dadCase },
  { id: 'yoodelling-unc-alex', label: 'Yoodelling Unc Alex', src: yoodellingUncAlex },
  { id: 'ant-k-raman', label: 'Ant K Raman', src: antKRaman },
  { id: 'anti-k-raman-2', label: 'Anti K Raman 2', src: antiKRaman2 },
  { id: 'ded-dad', label: 'Ded Dad', src: dedDad },
  { id: 'crazy-jack-chaser', label: 'Crazy Jack', src: crazyJackChaser },
  { id: 'sky-diver-motor-killer', label: 'Sky-Diver (Motor Killer)', src: skyDiverMotorKiller },
]

export const CHASER_PROFILES = {
  'skib-default': {
    name: 'Skib Default',
    vibe: 'The baseline Skibidty Toilet Guy.',
    tricks: 'The Royal Flush. He closes distance like the map owes him rent.',
    mainScare: 'Busts out of a stall with zero subtlety and maximum confidence.',
  },
  'toiletman-wet': {
    name: 'Toiletman Wet',
    vibe: 'Drenched, furious, and impossible to keep upright.',
    tricks: 'The Wipeout. Leaves a slick puddle trail that turns every corner into a bad idea.',
    mainScare: 'Drops in with a gross splash and keeps sliding like physics quit.',
  },
  'skib-killn': {
    name: 'Skibbidy Killn',
    vibe: 'Feral, loud, and absolutely unhinged.',
    tricks: 'The Feral Lunge. He commits to the straight line and dares the wall to matter.',
    mainScare: 'A bass-boosted shriek followed by a sprint that looks illegal.',
  },
  'dad-case': {
    name: 'Dad Case',
    vibe: 'Deadpan dad energy with a thermostat in one hand and judgment in the other.',
    tricks: 'The Grounded. He weaponizes lights, doors, and disappointment.',
    mainScare: 'Steps out like he’s about to ask who touched the thermostat.',
  },
  'yoodelling-unc-alex': {
    name: 'Yoodelling Unc Alex',
    vibe: 'Unreasonably cheerful, in the most threatening way.',
    tricks: 'The Yodel Echo. He scrambles your controls and lets the echo do the rest.',
    mainScare: 'Falls from nowhere and fills the hallway with alpine nonsense.',
  },
  'ant-k-raman': {
    name: 'Ant K Raman',
    vibe: 'Raman-aunt chaos in a toilet-sized package.',
    tricks: 'The Hot Plate Hustle. She comes in hot and never really slows down.',
    mainScare: 'Appears with the kind of speed that makes the floor feel smaller.',
  },
  'anti-k-raman-2': {
    name: 'Anti K Raman 2',
    vibe: 'The sequel nobody had the traction for.',
    tricks: 'The Second Serving. Same headache, different angle, more panic.',
    mainScare: 'Materializes like a rerun the runner definitely did not ask for.',
  },
  'ded-dad': {
    name: 'Ded Dad',
    vibe: 'A haunted-parent echo with bad timing and worse manners.',
    tricks: 'The After-Call. He always arrives right after the runner thinks it is safe.',
    mainScare: 'Haunts the hallway like unfinished homework with a pulse.',
  },
  'crazy-jack-chaser': {
    name: 'Crazy Jack',
    vibe: 'Chaotic enough to make every chase feel one bad joke away from collapse.',
    tricks: 'The Sink-or-Slide. He swings wide, then somehow still lands the catch.',
    mainScare: 'Cuts through the map like he’s been personally offended by your ankles.',
  },
  'sky-diver-motor-killer': {
    name: 'Sky-Diver',
    vibe: 'Motor-killer energy with zero regard for personal airspace.',
    tricks: 'The Drop-In. He enters from above like a bad idea with a helmet.',
    mainScare: 'Falls in fast, loud, and somehow already annoyed when he lands.',
  },
}

export function getChaserProfile(faceId) {
  return CHASER_PROFILES[faceId] ?? CHASER_PROFILES['skib-default']
}

export const BADGES = {
  'financial-wizardry': {
    id: 'financial-wizardry',
    name: 'Financial Wizardry (or Fraud)',
    lore: "You didn't just survive the map; you survived the IRS. Your offshore accounts are safe.",
    emoji: '📈',
  },
  'glutton-for-punishment': {
    id: 'glutton-for-punishment',
    name: 'Glutton for Punishment',
    lore: "We get it, you really like the respawn animation. Here's a shiny sticker for your pain.",
    emoji: '💀',
  },
  'slippery-when-wet': {
    id: 'slippery-when-wet',
    name: 'Slippery When Wet',
    lore: "You squeezed through those cracks like a greased pig at a summer fair. It wasn't elegant, but it worked.",
    emoji: '💧',
  },
  'devs-owe-me-five-bucks': {
    id: 'devs-owe-me-five-bucks',
    name: 'Devs Owe Me Five Bucks',
    lore: "Honestly, we didn't think you'd make it this far. The developers were taking bets against you.",
    emoji: '💸',
  },
  'lucky': {
    id: 'lucky',
    name: 'Lucky',
    lore: "That gun spawning right where you needed it wasn't fate. It was the clover in your pocket.",
    emoji: '🍀',
  },
}

export const SHOP_ITEMS = [
  {
    id: 'turbo-clogs',
    name: 'Turbo Clogs',
    cost: 120,
    description: 'More runner speed for those "I am not stopping" moments.',
    effectLabel: '+28 run speed',
  },
  {
    id: 'deep-breath-tank',
    name: 'Deep Breath Tank',
    cost: 90,
    description: 'Bigger stamina bar so the sprint can stay juicy longer.',
    effectLabel: '+30 max stamina',
  },
  {
    id: 'sheeb-magnet',
    name: 'Sheeb Magnet',
    cost: 160,
    description: 'Level rewards get boosted when you clear the madness.',
    effectLabel: '+25% level payouts',
  },
  {
    id: 'lucky-charm',
    name: 'Lucky Charm',
    cost: 150,
    description: 'A four-leaf clover taped to your keys. Good stuff starts turning up more.',
    effectLabel: '+15% positive pickup odds',
  },
  {
    id: 'golden-lucky-charm',
    name: 'Golden Lucky Charm',
    cost: 250,
    description: 'The upgraded charm. Even shinier, even luckier. Stacks with the regular one.',
    effectLabel: '+25% positive pickup odds',
  },
]

export function randomFrom(items) {
  if (!items.length) return null
  return items[Math.floor(Math.random() * items.length)]
}

export function randomFaces() {
  return {
    runnerFace: randomFrom(RUNNER_FACE_POOL) ?? null,
    chaserFace: randomFrom(CHASER_FACE_POOL) ?? null,
  }
}

// The runner poses shot for specific in-game moments rather than the
// random default rotation above — used to swap Jayden's face during the
// jump-scare/caught beat instead of picking a random pose for it.
export const RUNNER_STATE_FACES = {
  gettingCaptured: RUNNER_FACE_POOL.find((face) => face.id === 'jayden-getting-captured')?.src ?? null,
  captured: RUNNER_FACE_POOL.find((face) => face.id === 'jayden-captured')?.src ?? null,
}

export function buildLoadout(ownedItems = []) {
  const owned = new Set(ownedItems)
  let speedBonus = 0
  let staminaBonus = 0
  let rewardBonus = 0
  let luckBonus = 0

  if (owned.has('turbo-clogs')) speedBonus += 28
  if (owned.has('deep-breath-tank')) staminaBonus += 30
  if (owned.has('sheeb-magnet')) rewardBonus += 0.25
  if (owned.has('lucky-charm')) luckBonus += 0.15
  if (owned.has('golden-lucky-charm')) luckBonus += 0.25

  return { speedBonus, staminaBonus, rewardBonus, luckBonus }
}
