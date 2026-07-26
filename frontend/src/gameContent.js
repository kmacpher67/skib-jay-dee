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
]

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
]

export function randomFrom(items) {
  if (!items.length) return null
  return items[Math.floor(Math.random() * items.length)]
}

export function randomFaces() {
  return {
    runnerFace: randomFrom(RUNNER_FACE_POOL)?.src ?? null,
    chaserFace: randomFrom(CHASER_FACE_POOL)?.src ?? null,
  }
}

export function buildLoadout(ownedItems = []) {
  const owned = new Set(ownedItems)
  let speedBonus = 0
  let staminaBonus = 0
  let rewardBonus = 0

  if (owned.has('turbo-clogs')) speedBonus += 28
  if (owned.has('deep-breath-tank')) staminaBonus += 30
  if (owned.has('sheeb-magnet')) rewardBonus += 0.25

  return { speedBonus, staminaBonus, rewardBonus }
}

