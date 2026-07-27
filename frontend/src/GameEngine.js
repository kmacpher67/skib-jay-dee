// GameEngine.js
// Vanilla JS / HTML5 Canvas engine for Skib-Jay-Dee-Toilet.
// Keeps the action in one place so React stays out of the hot path.

import { GAME_ITERATION } from './version.js'
import {
  CAPTURE_LINES,
  CHASER_LINES,
  TIRED_LINES,
  NEAR_CAPTURE_LINES,
  GUN_CLICK_LINES,
  GUN_HIT_LINES,
  COOLNESS_LINES,
  HARD_CHASER_LINES,
} from './dialog.js'
import { CHASER_FACE_POOL, getChaserProfile, randomFrom, BADGES, HUMOR_BADGE_IDS, POSITIVE_PICKUPS } from './gameContent.js'
import { PORCELAIN_GRID, PIPEWORKS_GRID, FLOODED_ANNEX_GRID, RAMEN_AISLE_GRID, WORLD_STAR_GRID, JAYDENS_NIGHTMARE_HOUSE_GRID } from './mapGrids.js'

export const WORLD = {
  width: 900,
  height: 1500,
}

const VIEW_W = 360
const VIEW_H = 640

function rectsIntersect(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function makeBoundaryWalls(walls) {
  const t = 24
  walls.push({ x: 0, y: 0, w: WORLD.width, h: t })
  walls.push({ x: 0, y: WORLD.height - t, w: WORLD.width, h: t })
  walls.push({ x: 0, y: 0, w: t, h: WORLD.height })
  walls.push({ x: WORLD.width - t, y: 0, w: t, h: WORLD.height })
}

function parseMapGrid(walls, gridArray, tileSize) {
  const rows = gridArray.length;
  const cols = gridArray[0].length;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (gridArray[r][c] === '#' && !visited[r][c]) {
        let w = 1;
        while (c + w < cols && gridArray[r][c + w] === '#' && !visited[r][c + w]) w++;
        let h = 1, canExpand = true;
        while (r + h < rows && canExpand) {
          for (let i = 0; i < w; i++) if (gridArray[r + h][c + i] !== '#' || visited[r + h][c + i]) { canExpand = false; break; }
          if (canExpand) h++;
        }
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) visited[r + y][c + x] = true;
        walls.push({ x: c * tileSize, y: r * tileSize, w: w * tileSize, h: h * tileSize });
      }
    }
  }
}

function buildPorcelainPalace() {
  const walls = []
  const puddles = []
  makeBoundaryWalls(walls)
  parseMapGrid(walls, PORCELAIN_GRID, 10)
  puddles.push(
    { x: 300, y: 500, r: 60 },
    { x: 650, y: 900, r: 70 },
    { x: 200, y: 1200, r: 55 },
  )
  return {
    walls,
    puddles,
    theme: {
      background: '#e8f4f8',
      wallFill: '#c9c9d1',
      wallStroke: '#8f8f9a',
      puddleFill: 'rgba(120, 190, 255, 0.35)',
    },
  }
}

function buildPipeworks() {
  const walls = []
  const puddles = []
  makeBoundaryWalls(walls)
  parseMapGrid(walls, PIPEWORKS_GRID, 10)

  puddles.push(
    { x: 270, y: 380, r: 45 },
    { x: 520, y: 980, r: 70 },
    { x: 710, y: 620, r: 55 },
  )

  return {
    walls,
    puddles,
    theme: {
      background: '#edf7ef',
      wallFill: '#b9c8b8',
      wallStroke: '#69806d',
      puddleFill: 'rgba(82, 196, 134, 0.25)',
    },
  }
}

function buildFloodedAnnex() {
  const walls = []
  const puddles = []
  makeBoundaryWalls(walls)
  parseMapGrid(walls, FLOODED_ANNEX_GRID, 10)

  puddles.push(
    { x: 200, y: 520, r: 80 },
    { x: 460, y: 1120, r: 65 },
    { x: 700, y: 820, r: 72 },
    { x: 300, y: 1380, r: 55 },
  )

  return {
    walls,
    puddles,
    theme: {
      background: '#f8f0f6',
      wallFill: '#d4b7c9',
      wallStroke: '#8f6e87',
      puddleFill: 'rgba(190, 100, 255, 0.22)',
    },
  }
}

function buildRamenAisle() {
  const walls = []
  const puddles = []
  makeBoundaryWalls(walls)
  parseMapGrid(walls, RAMEN_AISLE_GRID, 10)

  puddles.push(
    { x: 220, y: 340, r: 50 },
    { x: 560, y: 900, r: 60 },
    { x: 760, y: 1250, r: 45 },
  )

  // Landmark quest room (v0.4.33): an enclosed stockroom with two narrow
  // openings on opposite sides (north/south), per the "openings on each
  // side" spec for Level 4. Sits clear of the aisle grid and puddles.
  const questRoom = { x: 740, y: 200, w: 120, h: 200 }

  return {
    walls,
    puddles,
    questRoom,
    theme: {
      background: '#fff6e6',
      wallFill: '#d99a3f',
      wallStroke: '#8a5d1f',
      puddleFill: 'rgba(255, 140, 40, 0.28)',
    },
  }
}

function buildWorldStarParkingLot() {
  const walls = []
  const puddles = []
  makeBoundaryWalls(walls)
  parseMapGrid(walls, WORLD_STAR_GRID, 10)

  puddles.push(
    { x: 260, y: 1160, r: 60 },
    { x: 620, y: 780, r: 55 },
  )

  // Landmark quest room (v0.4.33): a sealed booth with only ONE door — a
  // real chokepoint, per the "Level 5+ single door" spec. Sits in the open
  // band above the car grid.
  const questRoom = { x: 760, y: 50, w: 110, h: 120 }

  return {
    walls,
    puddles,
    questRoom,
    theme: {
      background: '#1c1f2b',
      wallFill: '#3a3f52',
      wallStroke: '#0d0f16',
      puddleFill: 'rgba(255, 255, 255, 0.08)',
    },
  }
}


function buildJaydensNightmareHouse() {
  const walls = []
  const puddles = []
  makeBoundaryWalls(walls)
  parseMapGrid(walls, JAYDENS_NIGHTMARE_HOUSE_GRID, 10)

  const questRoom = { x: 670, y: 70, w: 160, h: 210 }
  puddles.push(
    { x: 400, y: 300, r: 55 },
    { x: 150, y: 900, r: 45 },
  )

  return {
    walls,
    puddles,
    questRoom,
    theme: {
      background: '#1a1a24',
      wallFill: '#5c4b51',
      wallStroke: '#3d3034',
      puddleFill: 'rgba(0, 0, 0, 0.4)',
    },
  }
}

const LEVELS = [
  {
    name: 'Porcelain Palace',
    banner: 'LEVEL 1: PORCELAIN PALACE',
    reward: 40,
    advanceAt: 26,
    chaserSpeed: 130,
    runnerSpawn: { x: WORLD.width / 2 - 20, y: WORLD.height - 200 },
    chaserSpawn: { x: WORLD.width / 2 - 20, y: 150 },
    buildMap: buildPorcelainPalace,
    progressionBadgeId: 'porcelain-prowler',
  },
  {
    name: 'Pipeworks',
    banner: 'LEVEL 2: PIPEWORKS',
    reward: 60,
    advanceAt: 68,
    chaserSpeed: 145,
    runnerSpawn: { x: 260, y: WORLD.height - 132 },
    chaserSpawn: { x: 60, y: 170 },
    buildMap: buildPipeworks,
    progressionBadgeId: 'pipe-dreamer',
  },
  {
    name: 'Flooded Annex',
    banner: 'LEVEL 3: FLOODED ANNEX',
    reward: 90,
    advanceAt: 112,
    chaserSpeed: 162,
    runnerSpawn: { x: 260, y: WORLD.height - 120 },
    chaserSpawn: { x: WORLD.width - 140, y: 260 },
    buildMap: buildFloodedAnnex,
    progressionBadgeId: 'annex-relic-hunter',
  },
  {
    name: 'The Ramen Aisle',
    banner: 'LEVEL 4: THE RAMEN AISLE',
    reward: 120,
    advanceAt: 154,
    chaserSpeed: 172,
    runnerSpawn: { x: WORLD.width / 2 - 20, y: WORLD.height - 150 },
    chaserSpawn: { x: 80, y: 190 },
    buildMap: buildRamenAisle,
    questBadgeId: 'ramen-vault-keeper',
  },
  {
    name: 'World Star Parking Lot',
    banner: 'LEVEL 5: WORLD STAR PARKING LOT',
    reward: 160,
    advanceAt: 196,
    chaserSpeed: 182,
    runnerSpawn: { x: 260, y: WORLD.height - 140 },
    chaserSpawn: { x: WORLD.width - 150, y: 230 },
    buildMap: buildWorldStarParkingLot,
    questBadgeId: 'world-star-witness',
  },
  {
    name: 'Jayden\'s Nightmare House',
    banner: 'LEVEL 6: JAYDEN\'S NIGHTMARE HOUSE',
    reward: 200,
    advanceAt: null,
    chaserSpeed: 190,
    runnerSpawn: { x: 200, y: 1300 },
    chaserSpawn: { x: WORLD.width - 200, y: 200 },
    buildMap: buildJaydensNightmareHouse,
    questBadgeId: 'garage-survivor',
  },

]

const MAX_CHASERS = 5
const EXTRA_CHASER_INTERVAL = 20 // seconds of uninterrupted chase before another toilet joins
const MIN_LEVEL_SECONDS_BEFORE_ADVANCE = 30

// Level 4+ difficulty floor (docs/handoffs/roadmap-handoff-v0.4.33-plan.md):
// advancing past Level 4 (levelIndex 3) and any level beyond it also
// requires surviving a scaling time floor with all 5 chasers active, on
// top of the existing skreems threshold (kept, not replaced, per Ken).
const LEVEL4_PLUS_START_INDEX = 3
const LEVEL4_PLUS_BASE_SURVIVAL_SECONDS = 90
const LEVEL4_PLUS_SURVIVAL_STEP_SECONDS = 30
const LEVEL4_PLUS_REQUIRED_CHASERS = 5
const PIPEWORKS_MAX_PRESSURE_SKREEM_GOAL = 68
const PIPEWORKS_HALL_COVERAGE_GOAL = 0.8
const PIPEWORKS_GATE_REQUIRED_CHASERS = 4
const PIPEWORKS_GATE_REQUIRED_SECONDS = 15
const PIPEWORKS_HALL_GRID_SIZE = 30
const DEATH_SKREEM_PENALTY = 0.3 // fraction of skreems lost on capture
const DEATH_SHEEBS_PENALTY = 20

// Level 5+ end-game escalation (docs/handoffs/roadmap-handoff-v0.4.34-plan.md):
// at Level 5 (levelIndex 4) chasers stop respecting walls (below that they
// path around them like the runner does) and get a flat speed bump. The
// Gawd Particle is a very rare Level 5+ pickup that lets the runner do the
// same for a short window and turns contact with a chaser into a despawn +
// respawn-timer instead of a capture.
const LEVEL5_PLUS_START_INDEX = 4
const LEVEL5_PLUS_CHASER_SPEED_MULT = 1.15
const GAWD_PARTICLE_SPAWN_CHANCE = 0.08
const GAWD_PARTICLE_PICKUP_SIZE = 28
const GAWD_PARTICLE_BUFF_SECONDS = 10
const CHASER_RESPAWN_SECONDS = 15

// Rubber-band chaser speed: each KILLZ (capture) mellows the toilet out a
// bit since a fresh spawn right after dying is the least fun way to lose
// again; each level Jayden clears ramps it back up so the game doesn't get
// permanently easy. Applied as a multiplier on top of the per-level
// chaserSpeed, and persists for the whole run (reset on a fresh game).
const CHASER_SPEED_MOD_MIN = 0.62
const CHASER_SPEED_MOD_MAX = 1.35
const CHASER_SPEED_MOD_DEATH_STEP = -0.1
const CHASER_SPEED_MOD_LEVEL_STEP = 0.06

// A freshly spawned extra chaser joins at a discount and climbs to full
// speed over a few seconds, instead of a flat discount for its whole
// lifetime. Layered on top of chaserSpeedMod, not a replacement for it.
const CHASER_JOIN_RAMP_START = 0.7
const CHASER_JOIN_RAMP_SECONDS = 5

// The Jayden Gun: a rare map pickup, not a power fantasy. Only 1-2 of the
// 6 chambers are ever usable, it never permanently removes a chaser, and
// it vanishes the moment it's out of ammo.
const GUN_BASE_SPAWN_CHANCE = 0.5
const GUN_AMMO_ONE_CHANCE = 0.7 // otherwise rolls 2
const GUN_FIRE_COOLDOWN = 0.6
const GUN_BULLET_SPEED = 480
const GUN_BULLET_SIZE = 8
const GUN_STUN_MIN = 3
const GUN_STUN_MAX = 5
const GUN_PICKUP_SIZE = 28
const FRIENDLY_FIRE_GRACE_SECONDS = 2 // window after a gun-stun wears off for the "Friendly Fire" badge

const SOGGY_TP_SPAWN_CHANCE = 0.08
const SOGGY_TP_PICKUP_SIZE = 24
const SOGGY_TP_DURATION = 6 // seconds the trail keeps dropping after pickup
const SOGGY_TP_TRAIL_INTERVAL = 0.4 // seconds between dropped trail segments
const SOGGY_TP_TRAIL_LIFETIME = 5 // seconds a dropped trail segment stays on the map
const SOGGY_TP_TRAIL_SIZE = 26
const SOGGY_TP_CHASER_SLOW_MULT = 0.6
const SOGGY_TP_CHASER_SLOW_SECONDS = 5

const HEAVY_PLUNGER_SPAWN_CHANCE = 0.08
const HEAVY_PLUNGER_PICKUP_SIZE = 24
const HEAVY_PLUNGER_SWINGS = 3
const HEAVY_PLUNGER_SWING_COOLDOWN = 0.5
const HEAVY_PLUNGER_SWING_RANGE = 120
const HEAVY_PLUNGER_KNOCKBACK = 80

// Humor/intrigue badges (docs/handoffs/roadmap-handoff-v0.4.32-plan.md):
// low-odds optional pickups scattered across levels. Never gate progression
// (unlike progressionBadgeId below) — they're a pure exploration reward, so
// a missed roll one level just means another shot at it next level.
const HUMOR_BADGE_SPAWN_CHANCE = 0.18
const HUMOR_BADGE_PICKUP_SIZE = 28

export class GameEngine {
  constructor(
    canvas,
    {
      onCaught,
      onSkreem,
      onLevelChange,
      onSheebsChange,
      onDeath,
      onBoostStart,
      onTired,
      onChaserBark,
      onLevelClear,
      onExtraChaserSpawn,
      onCaughtProfileReady,
      onBadgeEarned,
      initialSheebs,
      initialDeaths = 0,
      highestLevel = 0,
      earnedBadges = [],
      loadout = {},
    } = {},
  ) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.canvas.width = VIEW_W
    this.canvas.height = VIEW_H

    this.onCaught = onCaught || (() => {})
    this.onSkreem = onSkreem || (() => {})
    this.onLevelChange = onLevelChange || (() => {})
    this.onSheebsChange = onSheebsChange || (() => {})
    this.onDeath = onDeath || (() => {})
    // Placeholder hooks for the boost-skreem / stamina-tired SFX from the
    // audio roadmap (docs/roadmap.md) — no-ops until those clips exist.
    this.onBoostStart = onBoostStart || (() => {})
    this.onTired = onTired || (() => {})
    // Chaser bark line audio (matches the on-screen CHASER_LINES bubble) and
    // the per-level-clear stinger — see Audio 2/3 in docs/roadmap.md.
    this.onChaserBark = onChaserBark || (() => {})
    this.onLevelClear = onLevelClear || (() => {})
    this.onExtraChaserSpawn = onExtraChaserSpawn || (() => {})
    this.onCaughtProfileReady = onCaughtProfileReady || (() => {})
    this.onBadgeEarned = onBadgeEarned || (() => {})

    this.runner = {
      x: WORLD.width / 2 - 20,
      y: WORLD.height - 200,
      w: 40,
      h: 40,
      baseSpeed: 180,
      color: '#3ddc55',
      face: null,
      isCustom: false,
      gettingCapturedFace: null,
      capturedFace: null,
      facing: { x: 0, y: 1 },
      gun: null,
    }
    this.chaser = {
      chaserType: null,
      plungerCooldown: 0,
      x: WORLD.width / 2 - 20,
      y: 150,
      w: 44,
      h: 44,
      baseSpeed: 130,
      color: '#8a5a34',
      face: null,
      stunnedUntil: 0,
    }
    // Extra toilets that join in if the runner survives one level too long.
    // this.chaser is always chasers[0]; extras are cloned from it.
    this.chasers = [this.chaser]
    this.extraChaserTimer = EXTRA_CHASER_INTERVAL

    this.levelIndex = 0
    this.level = LEVELS[0]
    this.map = this.level.buildMap()
    this.bannerText = this.level.banner
    this.pendingLevelIndex = null

    this.maxStamina = 100
    this.stamina = this.maxStamina
    this.sheebs = Number.isFinite(initialSheebs) ? Math.floor(initialSheebs) : 0
    this.skreems = 0
    this.levelSkreems = 0
    this.deaths = Math.max(0, Math.floor(initialDeaths))
    this.earnedBadges = earnedBadges || []
    this.highestLevel = highestLevel
    this.phase = 'intro'
    this.phaseTimer = 1.6
    this.levelSeconds = 0
    this.gunFiredThisLevel = false
    this.zoom = 1
    this.captureLine = CAPTURE_LINES[0]
    this._preCaughtRunnerFace = null
    this._caughtFaceStage = null
    this._caughtChaser = null
    this.chaserLine = ''
    this.chaserLineTimer = 0
    this.runnerLine = ''
    this.runnerLineTimer = 0
    this.wasSprinting = false
    this.staminaExhaustedFired = false
    this.chaserSpeedMod = 1
    this.nearCaptureCooldown = 15
    this.nearCaptureLine = ''
    this.pipeworksHallCoverage = 0
    this.pipeworksFourSkibSeconds = 0
    this.pipeworksTransitionReady = false
    this._pipeworksHallCoverageGrid = null
    this.gawdParticleActive = false
    this.gawdParticleTimer = 0
    this.schleimyPotionActive = false
    this.schleimyPotionTimer = 0
    this.tacoBellActive = false
    this.tacoBellTimer = 0
    this.decoyActive = false
    this.decoyTimer = 0
    this.decoyPos = { x: 0, y: 0 }
    this.soggyTpActive = false
    this.soggyTpTimer = 0
    this.soggyTpTrailTimer = 0
    this.soggyTrails = []
    this.plungerSwingActive = false
    this.plungerSwingTimer = 0
    this.chaserRespawnQueue = []

    this.loadout = { speedBonus: 0, staminaBonus: 0, rewardBonus: 0, luckBonus: 0 }

    this.pickups = []
    this.rollingPickups = []
    this.runner.plunger = null
    this.bullets = []
    this.fireCooldown = 0
    this.luckyBadgeEarned = (earnedBadges || []).includes('lucky')
    this.levelSeconds = 0
    this.gunFiredThisLevel = false
    this.levelBadgeCollected = false

    this.joystick = { active: false, id: null, cx: 0, cy: 0, dx: 0, dy: 0 }
    this.sprintBtn = { active: false, id: null }
    this.fireBtn = { active: false, id: null }
    this.keys = { up: false, down: false, left: false, right: false, sprint: false, fire: false }
    this._firePrevHeld = false

    this.setLoadout(loadout)
    this._syncLevelState({ resetPositions: true, notify: false })
    this.onLevelChange({
      index: this.levelIndex + 1,
      name: this.level.name,
      banner: this.level.banner,
      advanceAt: this.level.advanceAt,
    })

    this._raf = null
    this._lastTime = null
    this._bindInput()
  }

  setFaces({ runnerFace, chaserFace, chaserFaceId, runnerIsCustom, runnerGettingCapturedFace, runnerCapturedFace }) {
    if (runnerFace) this.runner.face = runnerFace
    if (chaserFace) {
      this.chasers.forEach((c) => {
        c.face = chaserFace
        c.faceId = chaserFaceId ?? null
      })
    }
    this.runner.isCustom = !!runnerIsCustom
    if (runnerGettingCapturedFace) this.runner.gettingCapturedFace = runnerGettingCapturedFace
    if (runnerCapturedFace) this.runner.capturedFace = runnerCapturedFace
  }

  setSheebs(sheebs) {
    this.sheebs = Math.floor(sheebs) // allow negative when receiving from outside
  }

  setEarnedBadges(badges) {
    this.earnedBadges = badges || []
    this.luckyBadgeEarned = this.earnedBadges.includes('lucky')
  }

  setLoadout(loadout = {}) {
    this.loadout = {
      speedBonus: Number.isFinite(loadout.speedBonus) ? loadout.speedBonus : 0,
      staminaBonus: Number.isFinite(loadout.staminaBonus) ? loadout.staminaBonus : 0,
      rewardBonus: Number.isFinite(loadout.rewardBonus) ? loadout.rewardBonus : 0,
      luckBonus: Number.isFinite(loadout.luckBonus) ? loadout.luckBonus : 0,
    }

    this.runner.baseSpeed = 180 + this.loadout.speedBonus
    this.maxStamina = 100 + this.loadout.staminaBonus
    this.stamina = clamp(this.stamina, 0, this.maxStamina)
  }

  start() {
    if (this._raf) return
    this._lastTime = performance.now()

    const loop = (now) => {
      const dt = Math.min(0.05, (now - this._lastTime) / 1000)
      this._lastTime = now
      this.update(dt)
      this.draw()
      this._raf = requestAnimationFrame(loop)
    }

    this._raf = requestAnimationFrame(loop)
  }

  stop() {
    if (this._raf) cancelAnimationFrame(this._raf)
    this._raf = null
    this._unbindInput()
  }

  _bindInput() {
    this._onPointerDown = (e) => this._handlePointerDown(e)
    this._onPointerMove = (e) => this._handlePointerMove(e)
    this._onPointerUp = (e) => this._handlePointerUp(e)
    this._onKeyDown = (e) => this._handleKey(e, true)
    this._onKeyUp = (e) => this._handleKey(e, false)
    this._onWindowBlur = () => this._clearHeldInput()
    this._onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') this._clearHeldInput()
    }

    this.canvas.addEventListener('pointerdown', this._onPointerDown)
    window.addEventListener('pointermove', this._onPointerMove)
    window.addEventListener('pointerup', this._onPointerUp)
    window.addEventListener('pointercancel', this._onPointerUp)
    window.addEventListener('keydown', this._onKeyDown)
    window.addEventListener('keyup', this._onKeyUp)
    window.addEventListener('blur', this._onWindowBlur)
    document.addEventListener('visibilitychange', this._onVisibilityChange)
  }

  _unbindInput() {
    this.canvas.removeEventListener('pointerdown', this._onPointerDown)
    window.removeEventListener('pointermove', this._onPointerMove)
    window.removeEventListener('pointerup', this._onPointerUp)
    window.removeEventListener('pointercancel', this._onPointerUp)
    window.removeEventListener('keydown', this._onKeyDown)
    window.removeEventListener('keyup', this._onKeyUp)
    window.removeEventListener('blur', this._onWindowBlur)
    document.removeEventListener('visibilitychange', this._onVisibilityChange)
  }

  _clearHeldInput() {
    this.joystick.active = false
    this.joystick.id = null
    this.joystick.dx = 0
    this.joystick.dy = 0
    this.sprintBtn.active = false
    this.sprintBtn.id = null
    this.fireBtn.active = false
    this.fireBtn.id = null
    this.keys.up = false
    this.keys.down = false
    this.keys.left = false
    this.keys.right = false
    this.keys.sprint = false
    this.keys.fire = false
    this._firePrevHeld = false
  }

  _handleKey(e, isDown) {
    const code = e.code
    let handled = true

    switch (code) {
      case 'ArrowUp':
      case 'KeyW':
        this.keys.up = isDown
        break
      case 'ArrowDown':
      case 'KeyS':
        this.keys.down = isDown
        break
      case 'ArrowLeft':
      case 'KeyA':
        this.keys.left = isDown
        break
      case 'ArrowRight':
      case 'KeyD':
        this.keys.right = isDown
        break
      case 'Space':
        this.keys.sprint = isDown
        break
      case 'KeyF':
        this.keys.fire = isDown
        break
      default:
        handled = false
    }

    if (handled) e.preventDefault()
  }

  _toViewCoords(e) {
    const rect = this.canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * VIEW_W
    const y = ((e.clientY - rect.top) / rect.height) * VIEW_H
    return { x, y }
  }

  _joystickOrigin() {
    return { x: 60, y: VIEW_H - 90 }
  }

  _sprintOrigin() {
    return { x: VIEW_W - 55, y: VIEW_H - 90 }
  }

  _fireOrigin() {
    return { x: VIEW_W - 55, y: VIEW_H - 165 }
  }

  _handlePointerDown(e) {
    const { x, y } = this._toViewCoords(e)
    const j = this._joystickOrigin()
    const s = this._sprintOrigin()
    const f = this._fireOrigin()
    const distJoy = Math.hypot(x - j.x, y - j.y)
    const distSprint = Math.hypot(x - s.x, y - s.y)
    const distFire = Math.hypot(x - f.x, y - f.y)

    if ((this.runner.gun || this.runner.plunger) && distFire < 34) {
      this.fireBtn.active = true
      this.fireBtn.id = e.pointerId
      this._tryFire()
      this.canvas.setPointerCapture?.(e.pointerId)
      return
    }

    if (distSprint < 45) {
      this.sprintBtn.active = true
      this.sprintBtn.id = e.pointerId
      this.canvas.setPointerCapture?.(e.pointerId)
      return
    }

    if (distJoy < 70 || (x < VIEW_W / 2 && y > VIEW_H - 180)) {
      this.joystick.active = true
      this.joystick.id = e.pointerId
      this.joystick.cx = j.x
      this.joystick.cy = j.y
      this._updateJoystickVector(x, y)
      this.canvas.setPointerCapture?.(e.pointerId)
    }
  }

  _handlePointerMove(e) {
    if (this.joystick.active && e.pointerId === this.joystick.id && !this.tacoBellActive) {
      const { x, y } = this._toViewCoords(e)
      this._updateJoystickVector(x, y)
    }
  }

  _handlePointerUp(e) {
    if (e.pointerId === this.joystick.id) {
      this.joystick.active = false
      this.joystick.id = null
      this.joystick.dx = 0
      this.joystick.dy = 0
    }

    if (e.pointerId === this.sprintBtn.id) {
      this.sprintBtn.active = false
      this.sprintBtn.id = null
    }

    if (e.pointerId === this.fireBtn.id) {
      this.fireBtn.active = false
      this.fireBtn.id = null
    }

    try {
      this.canvas.releasePointerCapture?.(e.pointerId)
    } catch {
      // Ignore browsers that reject the release after a cancel.
    }
  }

  _updateJoystickVector(x, y) {
    const maxDist = 50
    let dx = x - this.joystick.cx
    let dy = y - this.joystick.cy
    const dist = Math.hypot(dx, dy)

    if (dist > maxDist) {
      dx = (dx / dist) * maxDist
      dy = (dy / dist) * maxDist
    }

    this.joystick.dx = dx / maxDist
    this.joystick.dy = dy / maxDist
  }

  _getMoveVector() {
    if (this.tacoBellActive) {
      return { x: this.joystick.dx, y: this.joystick.dy }
    }
    if (this.joystick.active) {
      return { x: this.joystick.dx, y: this.joystick.dy }
    }

    const x = (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0)
    const y = (this.keys.down ? 1 : 0) - (this.keys.up ? 1 : 0)
    if (!x && !y) return { x: 0, y: 0 }

    const mag = Math.hypot(x, y) || 1
    return { x: x / mag, y: y / mag }
  }

  _syncLevelState({ resetPositions = false, notify = true } = {}) {
    this.level = LEVELS[this.levelIndex]
    this.map = this.level.buildMap()
    this.chaser.baseSpeed = this.level.chaserSpeed
    this.bannerText = this.level.banner
    this.pendingLevelIndex = null
    this.zoom = 1
    this.chaserLine = ''
    this.chaserLineTimer = 0
    this.runnerLine = ''
    this.runnerLineTimer = 0
    this.levelSkreems = 0
    this.levelElapsed = 0
    this.pipeworksSkreems = 0
    this.chaser.chaserType = this.chaser.faceId === 'dad-case' ? 'skib-daddy' : null
    this.chaser.plungerCooldown = 2
    this.chasers = [this.chaser]
    this.chaser.spawn = this.level.chaserSpawn
    this.chaserRespawnQueue = []
    this.chaserProjectiles = []
    this.gawdParticleActive = false
    this.gawdParticleTimer = 0
    this.schleimyPotionActive = false
    this.schleimyPotionTimer = 0
    this.tacoBellActive = false
    this.tacoBellTimer = 0
    this.decoyActive = false
    this.decoyTimer = 0
    this.extraChaserTimer = EXTRA_CHASER_INTERVAL
    this.nearCaptureCooldown = 15
    this._resetPipeworksGateState()

    if (this.level.name === 'Pipeworks') {
      this._pipeworksHallCoverageGrid = this._buildPipeworksHallCoverageGrid()
    }

    if (resetPositions) {
      this.runner.x = this.level.runnerSpawn.x
      this.runner.y = this.level.runnerSpawn.y
      this.chaser.x = this.level.chaserSpawn.x
      this.chaser.y = this.level.chaserSpawn.y
      this.stamina = this.maxStamina
    }

    this.bullets = []
    this.chaserProjectiles = []
    this.pickups = []
    this.rollingPickups = []
    this.levelBadgeCollected = false
    this._maybeSpawnGunPickup()
    this._spawnQuestRoomBadge()
    this._spawnProgressionBadge()
    this._maybeSpawnHumorBadge()
    this._maybeSpawnGawdParticle()
    this._maybeSpawnTacoBell()
    this._maybeSpawnDecoy()
    this._maybeSpawnSoggyToiletPaper()
    this._maybeSpawnHeavyPlunger()
    this._maybeSpawnSchleimyPotion()
    this._spawnRollingPickups()

    if (this.levelIndex >= 3) {
      this.chaserLine = HARD_CHASER_LINES[Math.floor(Math.random() * HARD_CHASER_LINES.length)]
      this.chaserLineTimer = 3
    }

    if (notify) {
      this.onLevelChange({
        index: this.levelIndex + 1,
        name: this.level.name,
        banner: this.level.banner,
        advanceAt: this.level.advanceAt,
      })
    }
  }

  _startLevelAdvance() {
    if (this.phase !== 'chase' || this.levelIndex >= LEVELS.length - 1) return

    this.phase = 'level-up'
    this.phaseTimer = 1.25
    this.pendingLevelIndex = this.levelIndex + 1
    const nextLevel = LEVELS[this.pendingLevelIndex]
    const reward = Math.round(
      this.level.reward * (1 + this.loadout.rewardBonus),
    )

    const wasInDebt = this.sheebs < 0
    this.sheebs += reward
    if (wasInDebt && this.sheebs >= 0) {
      this.onBadgeEarned('financial-wizardry')
    }
    
    this.onSheebsChange(this.sheebs)
    this.bannerText = nextLevel.banner
    this.chaserSpeedMod = clamp(
      this.chaserSpeedMod + CHASER_SPEED_MOD_LEVEL_STEP,
      CHASER_SPEED_MOD_MIN,
      CHASER_SPEED_MOD_MAX,
    )
    this.onLevelClear({
      index: this.levelIndex + 1,
      name: this.level.name,
      showLvl2Transition: this.level.name === 'Pipeworks' && this.pipeworksTransitionReady,
      pipeworksHallCoverage: this.pipeworksHallCoverage,
      pipeworksFourSkibSeconds: this.pipeworksFourSkibSeconds,
      pipeworksSimultaneousSkibs: this.chasers.length,
    })

    if (this.levelIndex >= 3) {
      this.onBadgeEarned('devs-owe-me-five-bucks')
    }
  }

  update(dt) {
    if (this.phase === 'intro') {
      this.phaseTimer -= dt
      if (this.phaseTimer <= 0) {
        this.phase = 'chase'
        this.bannerText = this.level.banner
      }
      return
    }

    if (this.phase === 'level-up') {
      this.phaseTimer -= dt
      this.zoom = 1
      if (this.phaseTimer <= 0 && this.pendingLevelIndex !== null) {
        this.levelIndex = this.pendingLevelIndex
        this._syncLevelState({ resetPositions: true })
        this.phase = 'chase'
        this.phaseTimer = 0
        this.bannerText = this.level.banner
      }
      return
    }

    if (this.phase === 'caught') {
      this._updateCaught(dt)
      return
    }

    if (this.phase === 'caught-profile') {
      return
    }

    if (this.phase === 'resume-countdown') {
      this._updateResumeCountdown(dt)
      return
    }

    if (this.phase === 'near-capture') {
      this._updateNearCapture(dt)
      return
    }

    if (this.phase === 'close-call-freeze') {
      this._updateCloseCallFreeze(dt)
      return
    }

    if (this.phase === 'chase' || this.phase === 'near-capture') {
      this.levelSeconds += dt
      const wasExhausted = this.stamina <= 0

      if (this.gawdParticleActive) {
        this.gawdParticleTimer = Math.max(0, this.gawdParticleTimer - dt)
        if (this.gawdParticleTimer <= 0) this.gawdParticleActive = false
      }
      if (this.schleimyPotionActive) {
        this.schleimyPotionTimer = Math.max(0, this.schleimyPotionTimer - dt)
        if (this.schleimyPotionTimer <= 0) this.schleimyPotionActive = false
      }
      if (this.tacoBellActive) {
        this.tacoBellTimer = Math.max(0, this.tacoBellTimer - dt)
        if (this.tacoBellTimer <= 0) this.tacoBellActive = false
      }
      if (this.decoyActive) {
        this.decoyTimer = Math.max(0, this.decoyTimer - dt)
        if (this.decoyTimer <= 0) this.decoyActive = false
      }
      if (this.soggyTpActive) {
        this.soggyTpTimer = Math.max(0, this.soggyTpTimer - dt)
        this.soggyTpTrailTimer -= dt
        if (this.soggyTpTrailTimer <= 0) {
          this.soggyTpTrailTimer = SOGGY_TP_TRAIL_INTERVAL
          this.soggyTrails.push({
            x: this.runner.x + this.runner.w / 2 - SOGGY_TP_TRAIL_SIZE / 2,
            y: this.runner.y + this.runner.h / 2 - SOGGY_TP_TRAIL_SIZE / 2,
            w: SOGGY_TP_TRAIL_SIZE,
            h: SOGGY_TP_TRAIL_SIZE,
            lifetime: SOGGY_TP_TRAIL_LIFETIME,
          })
        }
        if (this.soggyTpTimer <= 0) this.soggyTpActive = false
      }
      if (this.soggyTrails.length > 0) {
        this.soggyTrails = this.soggyTrails
          .map((trail) => ({ ...trail, lifetime: trail.lifetime - dt }))
          .filter((trail) => trail.lifetime > 0)
      }
    }
    
    const sprinting = (this.sprintBtn.active || this.keys.sprint) && this.stamina > 0
    if (sprinting) {
      if (!this.wasSprinting) this.onBoostStart()
      this.stamina = clamp(this.stamina - dt * 40, 0, this.maxStamina)
      if (this.stamina <= 0 && !this.staminaExhaustedFired) {
        this.staminaExhaustedFired = true
        this.runnerLine = TIRED_LINES[Math.floor(Math.random() * TIRED_LINES.length)]
        this.runnerLineTimer = 2.2
        this.onTired()
      }
    } else {
      this.stamina = clamp(this.stamina + dt * 20, 0, this.maxStamina)
      if (this.stamina >= this.maxStamina) this.staminaExhaustedFired = false
    }
    this.wasSprinting = sprinting
    this.runnerLineTimer = Math.max(0, this.runnerLineTimer - dt)
    this.nearCaptureCooldown = Math.max(0, this.nearCaptureCooldown - dt)
    this.levelElapsed += dt
    this.fireCooldown = Math.max(0, this.fireCooldown - dt)

    let speed = this.runner.baseSpeed * (this.tacoBellActive ? 1.5 : 1) * (sprinting ? 1.8 : 1)
    if (this.schleimyPotionActive) speed *= 0.8
    if (this.runner.plunger) speed *= 0.7
    const move = this._getMoveVector()
    if (move.x !== 0 || move.y !== 0) this.runner.facing = { x: move.x, y: move.y }
    if (this.gawdParticleActive) {
      this._moveIgnoringWalls(this.runner, move.x * speed * dt, move.y * speed * dt)
    } else {
      this._moveWithCollision(this.runner, move.x * speed * dt, move.y * speed * dt)
    }

    const fireHeld = this.keys.fire || this.fireBtn.active
    if (fireHeld && !this._firePrevHeld) this._tryFire()
    this._firePrevHeld = fireHeld

    this._updateBullets(dt)
    this._updateChaserProjectiles(dt)
    this._updateRollingPickups(dt)
    this._checkPickups()

    this._maybeSpawnExtraChaser(dt)
    this._updateChaserRespawns(dt)
    this._updatePipeworksGateProgress(dt)

    const wallHackLevel = this.levelIndex >= LEVEL5_PLUS_START_INDEX
    let closestDist = Infinity
    let caught = false
    let caughtBy = null
    let nearCapture = false
    const despawning = []

    for (const chaser of this.chasers) {
      const target = this.runner
      const dir = { x: (this.decoyActive ? this.decoyPos.x : target.x) - chaser.x, y: (this.decoyActive ? this.decoyPos.y : target.y) - chaser.y }
      const dist = Math.hypot(dir.x, dir.y) || 1

      if (chaser.stunnedUntil > 0) {
        chaser.stunnedUntil = Math.max(0, chaser.stunnedUntil - dt)
        if (chaser.stunnedUntil <= 0 && chaser.gunStunned) {
          chaser.gunStunned = false
          chaser.stunGracePeriod = FRIENDLY_FIRE_GRACE_SECONDS
        }
      } else {
        chaser.joinRamp = Math.min(1, (chaser.joinRamp ?? 1) + dt / CHASER_JOIN_RAMP_SECONDS)
        if (chaser.stunGracePeriod > 0) chaser.stunGracePeriod -= dt
        const joinRampMod = lerp(CHASER_JOIN_RAMP_START, 1, chaser.joinRamp)
        let speedMult = wallHackLevel ? LEVEL5_PLUS_CHASER_SPEED_MULT : 1
        if (this.schleimyPotionActive) speedMult *= 1.2
        for (const trail of this.soggyTrails) {
          if (rectsIntersect(chaser, trail)) {
            chaser.soggySlowTimer = SOGGY_TP_CHASER_SLOW_SECONDS
          }
        }
        if (chaser.soggySlowTimer > 0) {
          chaser.soggySlowTimer -= dt
          speedMult *= SOGGY_TP_CHASER_SLOW_MULT
        }
        const chaserTypeSpeedMod = chaser.chaserType === 'skib-daddy' ? 0.8 : 1
        const chaserSpeed = chaser.baseSpeed * this.chaserSpeedMod * joinRampMod * speedMult * chaserTypeSpeedMod
        const stepX = (dir.x / dist) * chaserSpeed * dt
        const stepY = (dir.y / dist) * chaserSpeed * dt
        if (chaser.chaserType === 'skib-daddy') {
          chaser.plungerCooldown -= dt
          if (chaser.plungerCooldown <= 0 && dist > 100 && dist < 400) {
            chaser.plungerCooldown = 3
            this.chaserProjectiles.push({
              x: chaser.x + chaser.w / 2 - 10,
              y: chaser.y + chaser.h / 2 - 10,
              w: 20,
              h: 20,
              vx: (dir.x / dist) * 350,
              vy: (dir.y / dist) * 350,
              owner: chaser,
            })
          }
        }
        if (wallHackLevel) {
          this._moveIgnoringWalls(chaser, stepX, stepY)
        } else {
          this._moveWithCollision(chaser, stepX, stepY)
        }
      }

      const dx = this.runner.x - chaser.x
      const dy = this.runner.y - chaser.y
      const runnerDist = Math.hypot(dx, dy) || 1

      if (runnerDist < 300) {
        const gain = dt * (300 - runnerDist) * 0.06
        this.skreems += gain
        this.levelSkreems += gain
        if (
          this.level.name === 'Pipeworks' &&
          this.chasers.length >= MAX_CHASERS &&
          this.chasers.every(c => (c.joinRamp ?? 1) >= 1)
        ) {
          this.pipeworksSkreems += gain
        }
      }
      if (runnerDist < closestDist) closestDist = runnerDist
      if (rectsIntersect(this.runner, chaser)) {
        if (this.gawdParticleActive) {
          despawning.push(chaser)
        } else {
          caught = true
          caughtBy = chaser
        }
      } else if (runnerDist < 100 && this.nearCaptureCooldown <= 0) {
        nearCapture = true
      }
    }

    if (despawning.length > 0) {
      this.chasers = this.chasers.filter((c) => !despawning.includes(c))
      despawning.forEach((chaser) => {
        chaser.joinRamp = 0
        this.chaserRespawnQueue.push({ chaser, timer: CHASER_RESPAWN_SECONDS })
      })
    }

    if (this.chasers.length > 0) this.onSkreem(Math.floor(this.skreems))

    if (this.level.name === 'Pipeworks') {
      if (this.pipeworksSkreems >= PIPEWORKS_MAX_PRESSURE_SKREEM_GOAL && this._hasRequiredLevelBadge()) {
        this._startLevelAdvance()
        return
      }
    } else if (
      this.level.advanceAt &&
      this.levelSkreems >= this.level.advanceAt &&
      this.levelElapsed >= MIN_LEVEL_SECONDS_BEFORE_ADVANCE &&
      this.chasers.length >= 2 &&
      this._hasRequiredLevelBadge() &&
      this._meetsLevel4PlusFloor()
    ) {
      this._startLevelAdvance()
      return
    }

    if (closestDist < 200 && this.chaserLineTimer <= 0) {
      let linePool = CHASER_LINES
      if (this.levelIndex >= 3 && Math.random() < 0.3) {
        linePool = HARD_CHASER_LINES
      }
      this.chaserLine = linePool[Math.floor(Math.random() * linePool.length)]
      this.chaserLineTimer = 2
      this.onChaserBark(this.chaserLine)
    }
    this.chaserLineTimer = Math.max(0, this.chaserLineTimer - dt)

    if (caught) {
      if (caughtBy && caughtBy.stunGracePeriod > 0) {
        this.onBadgeEarned('friendly-fire')
      }
      this._triggerCaught(caughtBy)
    } else if (nearCapture) {
      this._triggerNearCapture()
    }
  }

  _maybeSpawnExtraChaser(dt) {
    if (this.chasers.length >= MAX_CHASERS) return

    this.extraChaserTimer -= dt
    if (this.extraChaserTimer > 0) return

    this.extraChaserTimer = EXTRA_CHASER_INTERVAL
    const corners = [
      { x: 40, y: 40 },
      { x: WORLD.width - 84, y: 40 },
      { x: 40, y: WORLD.height - 84 },
      { x: WORLD.width - 84, y: WORLD.height - 84 },
    ]
    const spawn = corners[Math.floor(Math.random() * corners.length)]
    let extraFace = this.chaser.face
    let extraFaceId = null
    const randomItem = randomFrom(CHASER_FACE_POOL)
    if (randomItem) {
      const img = new Image()
      img.src = randomItem.src
      extraFace = img
      extraFaceId = randomItem.id
    }

    this.chasers.push({
      x: spawn.x,
      y: spawn.y,
      w: 44,
      h: 44,
      baseSpeed: this.chaser.baseSpeed,
      joinRamp: 0,
      stunnedUntil: 0,
      color: this.chaser.color,
      face: extraFace,
      faceId: extraFaceId,
      spawn,
    })
    this.onExtraChaserSpawn({
      count: this.chasers.length,
      index: this.chasers.length - 1,
      faceId: extraFaceId,
    })
  }

  _checkPickups() {
    if (this.pickups.length === 0) return

    this.pickups = this.pickups.filter((pickup) => {
      if (!rectsIntersect(this.runner, pickup)) return true

      if (POSITIVE_PICKUPS.includes(pickup.type)) {
        this.sheebs += 5
        this.onSheebsChange(this.sheebs)
      }

      if (pickup.type === 'gun') {
        const ammo = Math.random() < GUN_AMMO_ONE_CHANCE ? 1 : 2
        this.runner.gun = { ammo }
      } else if (pickup.type === 'badge') {
        this.levelBadgeCollected = true
        this.onBadgeEarned(pickup.badgeId)
      } else if (pickup.type === 'humor-badge') {
        this.onBadgeEarned(pickup.badgeId)
      } else if (pickup.type === 'quest-badge') {
        this.onBadgeEarned(pickup.badgeId)
      } else if (pickup.type === 'gawd-particle') {
        this.gawdParticleActive = true
        this.gawdParticleTimer = GAWD_PARTICLE_BUFF_SECONDS
        this.runnerLine = COOLNESS_LINES[Math.floor(Math.random() * COOLNESS_LINES.length)]
        this.runnerLineTimer = 2
      } else if (pickup.type === 'schleimy-potion') {
        this.schleimyPotionActive = true
        this.schleimyPotionTimer = 8
        this.runner.x += 13
        this.runner.y += 13
        this.runner.w = 14
        this.runner.h = 14
        this.runnerLine = COOLNESS_LINES[Math.floor(Math.random() * COOLNESS_LINES.length)]
        this.runnerLineTimer = 2
      } else if (pickup.type === 'taco-bell') {
        this.tacoBellActive = true
        this.tacoBellTimer = 3
        if (this.joystick.dx === 0 && this.joystick.dy === 0) {
          this.joystick.dy = -1
        }
      } else if (pickup.type === 'decoy') {
        this.decoyActive = true
        this.decoyTimer = 4
        this.decoyPos = { x: pickup.x, y: pickup.y }
      } else if (pickup.type === 'soggy-tp') {
        this.soggyTpActive = true
        this.soggyTpTimer = SOGGY_TP_DURATION
        this.soggyTpTrailTimer = 0
        this.runnerLine = 'Ugh, soggy...'
        this.runnerLineTimer = 1.5
      } else if (pickup.type === 'heavy-plunger') {
        this.runner.plunger = { swings: HEAVY_PLUNGER_SWINGS }
        this.runnerLine = 'Got a plunger. Time to swing.'
        this.runnerLineTimer = 1.5
      }
      return false
    })
  }

  _updateRollingPickups(dt) {
    if (this.rollingPickups.length === 0) return
    this.rollingPickups = this.rollingPickups.filter(pickup => {
      pickup.x += pickup.vx * dt
      if (this._hitsWall(pickup)) {
        pickup.x -= pickup.vx * dt
        pickup.vx *= -1
      }
      pickup.y += pickup.vy * dt
      if (this._hitsWall(pickup)) {
        pickup.y -= pickup.vy * dt
        pickup.vy *= -1
      }
      
      if (rectsIntersect(this.runner, pickup)) {
        if (pickup.isGood) {
          this.sheebs += 5
          this.onSheebsChange(this.sheebs)
          
          if (pickup.effect === 'speed') {
            this.runnerLine = 'Speed boost!'
            this.runnerLineTimer = 1.5
            this.stamina = this.maxStamina
          } else if (pickup.effect === 'stamina') {
            this.stamina = this.maxStamina
          } else if (pickup.effect === 'sheebs') {
            this.sheebs += 20
            this.onSheebsChange(this.sheebs)
          }
        } else {
          if (pickup.effect === 'slow') {
            this.runnerLine = 'Ugh, so slow!'
            this.runnerLineTimer = 1.5
            this.stamina = 0
          } else if (pickup.effect === 'damage') {
            this.skreems += 10
            this.levelSkreems += 10
            this.onSkreem(Math.floor(this.skreems))
          }
        }
        return false
      }
      return true
    })
  }

  _hasRequiredLevelBadge() {
    return !this.level.progressionBadgeId || this.levelBadgeCollected
  }

  _meetsLevel4PlusFloor() {
    if (this.levelIndex < LEVEL4_PLUS_START_INDEX) return true
    const requiredSeconds =
      LEVEL4_PLUS_BASE_SURVIVAL_SECONDS +
      (this.levelIndex - LEVEL4_PLUS_START_INDEX) * LEVEL4_PLUS_SURVIVAL_STEP_SECONDS
    return this.levelElapsed >= requiredSeconds && this.chasers.length >= LEVEL4_PLUS_REQUIRED_CHASERS
  }

  _spawnProgressionBadge() {
    const badgeId = this.level.progressionBadgeId
    if (!badgeId) return

    if (this.earnedBadges.includes(badgeId)) {
      this.levelBadgeCollected = true
      return
    }

    const spawn = this._findRandomWalkableSpawn()
    if (!spawn) {
      this.levelBadgeCollected = true
      return
    }

    this.pickups.push({
      type: 'badge',
      badgeId,
      x: spawn.x,
      y: spawn.y,
      w: GUN_PICKUP_SIZE,
      h: GUN_PICKUP_SIZE,
    })
  }

  _maybeSpawnHumorBadge() {
    const unearned = HUMOR_BADGE_IDS.filter((id) => !this.earnedBadges.includes(id))
    if (unearned.length === 0) return
    if (Math.random() >= HUMOR_BADGE_SPAWN_CHANCE) return

    const spawn = this._findRandomWalkableSpawn()
    if (!spawn) return

    this.pickups.push({
      type: 'humor-badge',
      badgeId: randomFrom(unearned),
      x: spawn.x,
      y: spawn.y,
      w: HUMOR_BADGE_PICKUP_SIZE,
      h: HUMOR_BADGE_PICKUP_SIZE,
    })
  }

  _spawnQuestRoomBadge() {
    const badgeId = this.level.questBadgeId
    const room = this.map.questRoom
    if (!badgeId || !room) return
    if (this.earnedBadges.includes(badgeId)) return

    this.pickups.push({
      type: 'quest-badge',
      badgeId,
      x: room.x + room.w / 2 - GUN_PICKUP_SIZE / 2,
      y: room.y + room.h / 2 - GUN_PICKUP_SIZE / 2,
      w: GUN_PICKUP_SIZE,
      h: GUN_PICKUP_SIZE,
    })
  }

  _maybeSpawnGunPickup() {
    const luckBonus = this.loadout.luckBonus || 0
    const baseRoll = Math.random() < GUN_BASE_SPAWN_CHANCE
    let luckProced = false

    if (!baseRoll && luckBonus > 0) {
      luckProced = Math.random() < luckBonus
    }

    if (!baseRoll && !luckProced) return

    const spawn = this._findRandomWalkableSpawn()
    if (!spawn) return

    this.pickups.push({
      type: 'gun',
      x: spawn.x,
      y: spawn.y,
      w: GUN_PICKUP_SIZE,
      h: GUN_PICKUP_SIZE,
    })

    if (luckProced && !this.luckyBadgeEarned) {
      this.luckyBadgeEarned = true
      this.onBadgeEarned('lucky')
    }
  }

  _maybeSpawnGawdParticle() {
    if (this.levelIndex < LEVEL5_PLUS_START_INDEX) return
    if (Math.random() >= GAWD_PARTICLE_SPAWN_CHANCE) return

    const spawn = this._findRandomWalkableSpawn()
    if (!spawn) return

    this.pickups.push({
      type: 'gawd-particle',
      x: spawn.x,
      y: spawn.y,
      w: GAWD_PARTICLE_PICKUP_SIZE,
      h: GAWD_PARTICLE_PICKUP_SIZE,
    })
  }

  _maybeSpawnSoggyToiletPaper() {
    if (Math.random() > SOGGY_TP_SPAWN_CHANCE) return
    const spawn = this._findRandomWalkableSpawn()
    if (!spawn) return
    this.pickups.push({
      type: 'soggy-tp',
      x: spawn.x,
      y: spawn.y,
      w: SOGGY_TP_PICKUP_SIZE,
      h: SOGGY_TP_PICKUP_SIZE,
      sprite: '🧻',
    })
  }

  _maybeSpawnHeavyPlunger() {
    if (Math.random() > HEAVY_PLUNGER_SPAWN_CHANCE) return
    const spawn = this._findRandomWalkableSpawn()
    if (!spawn) return
    this.pickups.push({
      type: 'heavy-plunger',
      x: spawn.x,
      y: spawn.y,
      w: HEAVY_PLUNGER_PICKUP_SIZE,
      h: HEAVY_PLUNGER_PICKUP_SIZE,
      sprite: '🪠',
    })
  }

  _maybeSpawnSchleimyPotion() {
    if (Math.random() > 0.15) return
    const cx = WORLD.width / 2
    const cy = WORLD.height / 2
    this.pickups.push({
      type: 'schleimy-potion',
      x: cx,
      y: cy,
      w: GAWD_PARTICLE_PICKUP_SIZE,
      h: GAWD_PARTICLE_PICKUP_SIZE,
      vx: 0,
      vy: 0,
      sprite: '🧪',
    })
  }

  _maybeSpawnTacoBell() {
    if (Math.random() > 0.05) return
    const cx = this.map.walls[0].x + this.map.walls[0].w / 2
    const cy = this.map.walls[0].y + this.map.walls[0].h / 2
    this.pickups.push({
      type: 'taco-bell',
      x: cx,
      y: cy,
      w: 28,
      h: 28,
      vx: 0,
      vy: 0,
      sprite: '🌮',
    })
  }

  _maybeSpawnDecoy() {
    if (Math.random() > 0.05) return
    const cx = WORLD.width / 2
    const cy = WORLD.height / 2
    this.pickups.push({
      type: 'decoy',
      x: cx,
      y: cy,
      w: 28,
      h: 28,
      vx: 0,
      vy: 0,
      sprite: '🧍',
    })
  }

  _spawnRollingPickups() {
    const count = 2 + Math.floor(Math.random() * 3)
    for (let i = 0; i < count; i++) {
      const spawn = this._findRandomWalkableSpawn()
      if (!spawn) continue
      const isGood = Math.random() > 0.4
      const angle = Math.random() * Math.PI * 2
      this.rollingPickups.push({
        x: spawn.x,
        y: spawn.y,
        w: 24,
        h: 24,
        vx: Math.cos(angle) * 110,
        vy: Math.sin(angle) * 110,
        isGood,
        effect: isGood ? randomFrom(['speed', 'stamina', 'sheebs']) : randomFrom(['slow', 'damage']),
      })
    }
  }

  _findRandomWalkableSpawn() {
    for (let attempt = 0; attempt < 30; attempt++) {
      const x = 60 + Math.random() * (WORLD.width - 120)
      const y = 60 + Math.random() * (WORLD.height - 120)
      const rect = { x, y, w: GUN_PICKUP_SIZE, h: GUN_PICKUP_SIZE }
      if (this._hitsWall(rect)) continue

      const distFromRunnerSpawn = Math.hypot(x - this.level.runnerSpawn.x, y - this.level.runnerSpawn.y)
      if (distFromRunnerSpawn < 150) continue

      return { x, y }
    }
    return null
  }

  _swingPlunger() {
    if (!this.runner.plunger || this.runner.plunger.swings <= 0 || this.fireCooldown > 0) return
    this.fireCooldown = HEAVY_PLUNGER_SWING_COOLDOWN
    this.runner.plunger.swings -= 1
    this.plungerSwingActive = true
    this.plungerSwingTimer = 0.2

    for (const chaser of this.chasers) {
      const dist = Math.hypot(
        (chaser.x + chaser.w / 2) - (this.runner.x + this.runner.w / 2),
        (chaser.y + chaser.h / 2) - (this.runner.y + this.runner.h / 2),
      )
      if (dist < HEAVY_PLUNGER_SWING_RANGE) {
        const dx = chaser.x - this.runner.x
        const dy = chaser.y - this.runner.y
        const dir = Math.hypot(dx, dy) || 1
        const stepX = (dx / dir) * HEAVY_PLUNGER_KNOCKBACK
        const stepY = (dy / dir) * HEAVY_PLUNGER_KNOCKBACK
        this._moveWithCollision(chaser, stepX, stepY)
      }
    }

    if (this.runner.plunger.swings <= 0) {
      this.runner.plunger = null
    }
  }

  _tryFire() {
    if (this.runner.plunger) {
      this._swingPlunger()
      return
    }

    if (this.runner.gun) {
      this.gunFiredThisLevel = true
      if (this.runner.gun.chambers <= 0 || this.fireCooldown > 0) return
    }
    this.fireCooldown = GUN_FIRE_COOLDOWN

    if (!this.runner.gun || this.runner.gun.ammo <= 0) {
      this.runnerLine = GUN_CLICK_LINES[Math.floor(Math.random() * GUN_CLICK_LINES.length)]
      this.runnerLineTimer = 1.2
      return
    }

    this.runner.gun.ammo -= 1
    const dir = this.runner.facing
    this.bullets.push({
      x: this.runner.x + this.runner.w / 2 - GUN_BULLET_SIZE / 2,
      y: this.runner.y + this.runner.h / 2 - GUN_BULLET_SIZE / 2,
      w: GUN_BULLET_SIZE,
      h: GUN_BULLET_SIZE,
      vx: dir.x * GUN_BULLET_SPEED,
      vy: dir.y * GUN_BULLET_SPEED,
    })

    if (this.runner.gun.ammo <= 0) this.runner.gun = null
  }

  
  _updateChaserProjectiles(dt) {
    if (this.chaserProjectiles.length === 0) return

    this.chaserProjectiles = this.chaserProjectiles.filter((proj) => {
      proj.x += proj.vx * dt
      proj.y += proj.vy * dt

      if (proj.x < 0 || proj.x > WORLD.width || proj.y < 0 || proj.y > WORLD.height) return false
      if (this._hitsWall(proj)) return false

      if (rectsIntersect(proj, this.runner)) {
        // pull runner towards chaser
        const dx = proj.owner.x - this.runner.x
        const dy = proj.owner.y - this.runner.y
        const dist = Math.hypot(dx, dy) || 1
        const pullDist = 60
        this._moveWithCollision(this.runner, (dx/dist)*pullDist, (dy/dist)*pullDist)
        return false
      }

      return true
    })
  }

  _updateBullets(dt) {
    if (this.bullets.length === 0) return

    this.bullets = this.bullets.filter((bullet) => {
      bullet.x += bullet.vx * dt
      bullet.y += bullet.vy * dt

      if (bullet.x < 0 || bullet.x > WORLD.width || bullet.y < 0 || bullet.y > WORLD.height) return false
      if (this._hitsWall(bullet)) return false

      for (const chaser of this.chasers) {
        if (rectsIntersect(bullet, chaser) && !(chaser.stunnedUntil > 0)) {
          chaser.stunnedUntil = GUN_STUN_MIN + Math.random() * (GUN_STUN_MAX - GUN_STUN_MIN)
          chaser.gunStunned = true
          this.chaserLine = GUN_HIT_LINES[Math.floor(Math.random() * GUN_HIT_LINES.length)]
          this.chaserLineTimer = 2
          this.onChaserBark(this.chaserLine)
          return false
        }
      }

      return true
    })
  }

  _resetPipeworksGateState() {
    this.pipeworksHallCoverage = 0
    this.pipeworksFourSkibSeconds = 0
    this.pipeworksTransitionReady = false
    this._pipeworksHallCoverageGrid = null
  }

  _buildPipeworksHallCoverageGrid() {
    const cols = Math.ceil(WORLD.width / PIPEWORKS_HALL_GRID_SIZE)
    const rows = Math.ceil(WORLD.height / PIPEWORKS_HALL_GRID_SIZE)
    const walkable = new Set()

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = Math.min(
          WORLD.width - 1,
          col * PIPEWORKS_HALL_GRID_SIZE + PIPEWORKS_HALL_GRID_SIZE / 2,
        )
        const y = Math.min(
          WORLD.height - 1,
          row * PIPEWORKS_HALL_GRID_SIZE + PIPEWORKS_HALL_GRID_SIZE / 2,
        )
        if (!this._hitsWall({ x, y, w: 1, h: 1 })) {
          walkable.add(row * cols + col)
        }
      }
    }

    return {
      cols,
      rows,
      walkable,
      visited: new Set(),
      total: walkable.size,
    }
  }

  _updatePipeworksGateProgress(dt) {
    if (this.level.name !== 'Pipeworks' || !this._pipeworksHallCoverageGrid) return

    const grid = this._pipeworksHallCoverageGrid
    const runnerCenterX = this.runner.x + this.runner.w / 2
    const runnerCenterY = this.runner.y + this.runner.h / 2
    const col = clamp(Math.floor(runnerCenterX / PIPEWORKS_HALL_GRID_SIZE), 0, grid.cols - 1)
    const row = clamp(Math.floor(runnerCenterY / PIPEWORKS_HALL_GRID_SIZE), 0, grid.rows - 1)
    const index = row * grid.cols + col

    if (grid.walkable.has(index) && !grid.visited.has(index)) {
      grid.visited.add(index)
      this.pipeworksHallCoverage = grid.total > 0 ? grid.visited.size / grid.total : 0
    }

    if (this.chasers.length >= PIPEWORKS_GATE_REQUIRED_CHASERS) {
      this.pipeworksFourSkibSeconds += dt
    }

    this.pipeworksTransitionReady =
      this.pipeworksHallCoverage >= PIPEWORKS_HALL_COVERAGE_GOAL &&
      this.pipeworksFourSkibSeconds >= PIPEWORKS_GATE_REQUIRED_SECONDS
  }

  _moveWithCollision(entity, dx, dy) {
    const tryX = { ...entity, x: entity.x + dx }
    if (!this._hitsWall(tryX)) entity.x = clamp(tryX.x, 24, WORLD.width - 24 - entity.w)

    const tryY = { ...entity, y: entity.y + dy }
    if (!this._hitsWall(tryY)) entity.y = clamp(tryY.y, 24, WORLD.height - 24 - entity.h)
  }

  _hitsWall(entity) {
    return this.map.walls.some((wall) => rectsIntersect(entity, wall))
  }

  _moveIgnoringWalls(entity, dx, dy) {
    entity.x = clamp(entity.x + dx, 24, WORLD.width - 24 - entity.w)
    entity.y = clamp(entity.y + dy, 24, WORLD.height - 24 - entity.h)
  }

  _updateChaserRespawns(dt) {
    if (this.chaserRespawnQueue.length === 0) return
    this.chaserRespawnQueue = this.chaserRespawnQueue.filter((entry) => {
      entry.timer -= dt
      if (entry.timer > 0) return true

      const chaser = entry.chaser
      chaser.x = chaser.spawn?.x ?? chaser.x
      chaser.y = chaser.spawn?.y ?? chaser.y
      chaser.stunnedUntil = 0
      chaser.joinRamp = CHASER_JOIN_RAMP_START
      this.chasers.push(chaser)
      return false
    })
  }

  _triggerCaught(caughtBy = null) {
    this.phase = 'caught'
    this.phaseTimer = 2.6
    this.zoom = 1
    this._caughtChaser = caughtBy
    this.captureLine = CAPTURE_LINES[Math.floor(Math.random() * CAPTURE_LINES.length)]

    this._preCaughtRunnerFace = this.runner.face
    this._caughtFaceStage = 'impact'
    if (!this.runner.isCustom && this.runner.gettingCapturedFace) {
      this.runner.face = this.runner.gettingCapturedFace
    }

    this.deaths += 1
    if (this.deaths >= 50) {
      this.onBadgeEarned('glutton-for-punishment')
    }
    const skreemsLost = Math.round(this.skreems * DEATH_SKREEM_PENALTY)
    const baseSheebsLost = DEATH_SHEEBS_PENALTY
    let sheebsLost = 0
    if (this.highestLevel > 3) {
      sheebsLost = baseSheebsLost
      this.sheebs = this.sheebs - sheebsLost
      this.chaserLine = HARD_CHASER_LINES[Math.floor(Math.random() * HARD_CHASER_LINES.length)]
      this.chaserLineTimer = 3
    } else {
      sheebsLost = Math.min(this.sheebs, baseSheebsLost)
      this.sheebs = Math.max(0, this.sheebs - sheebsLost)
    }
    
    this.skreems = Math.max(0, this.skreems - skreemsLost)
    this.levelSkreems = Math.max(0, this.levelSkreems - skreemsLost)
    this.pipeworksSkreems = Math.max(0, (this.pipeworksSkreems || 0) - skreemsLost)
    this.onSheebsChange(this.sheebs)
    if (this.level.name === 'Pipeworks') {
      this.pipeworksFourSkibSeconds = 0
      this.pipeworksTransitionReady = false
    }
    this.onLevelClear()
    
    if (this.levelIndex === 3 && this.runner.gun && !this.gunFiredThisLevel) {
      this.onBadgeEarned('pacifist-warzone')
    }

    this.levelIndex++
    this.chaserSpeedMod = clamp(
      this.chaserSpeedMod + CHASER_SPEED_MOD_DEATH_STEP,
      CHASER_SPEED_MOD_MIN,
      CHASER_SPEED_MOD_MAX,
    )

    this.onDeath({
      deaths: this.deaths,
      level: this.levelIndex + 1,
      levelName: this.level.name,
      chaserId: caughtBy?.faceId ?? null,
    })
    this.onSkreem(Math.floor(this.skreems))
    this.onCaught({
      captureLine: this.captureLine,
      chaserId: caughtBy?.faceId ?? null,
      chaserName: caughtBy?.faceId ? getChaserProfile(caughtBy.faceId).name : null,
      chaserFaceSrc: caughtBy?.face?.src ?? null,
      level: this.levelIndex + 1,
      levelName: this.level.name,
    })
  }

  _updateCaught(dt) {
    this.phaseTimer -= dt
    this.zoom = clamp(this.zoom + dt * 5, 1, 3)

    if (
      this._caughtFaceStage === 'impact' &&
      this.zoom >= 3 &&
      !this.runner.isCustom &&
      this.runner.capturedFace
    ) {
      this._caughtFaceStage = 'held'
      this.runner.face = this.runner.capturedFace
    }

    if (this.phaseTimer <= 0) {
      this.runner.x = this.level.runnerSpawn.x
      this.runner.y = this.level.runnerSpawn.y
      this.chaser.x = this.level.chaserSpawn.x
      this.chaser.y = this.level.chaserSpawn.y
      this.chaser.stunnedUntil = 0
      this.chasers = [this.chaser]
      this.chaserRespawnQueue = []
      this.gawdParticleActive = false
      this.gawdParticleTimer = 0
      this.schleimyPotionActive = false
      this.schleimyPotionTimer = 0
      this.extraChaserTimer = EXTRA_CHASER_INTERVAL
      this.zoom = 1
      this.stamina = this.maxStamina
      this.phaseTimer = 0
      this.chaserLineTimer = 0
      this.runnerLineTimer = 0
      this.staminaExhaustedFired = false
      if (this._preCaughtRunnerFace) this.runner.face = this._preCaughtRunnerFace
      this._preCaughtRunnerFace = null
      this._caughtFaceStage = null
      this.phase = 'caught-profile'
      this.onCaughtProfileReady({
        chaserId: this._caughtChaser?.faceId ?? null,
        chaserName: this._caughtChaser?.faceId ? getChaserProfile(this._caughtChaser.faceId).name : null,
        chaserFaceSrc: this._caughtChaser?.face?.src ?? null,
        level: this.levelIndex + 1,
        levelName: this.level.name,
        captureLine: this.captureLine,
      })
    }
  }

  beginResumeCountdown() {
    if (this.phase !== 'caught-profile') return
    this.phase = 'resume-countdown'
    this.countdownTimer = 3.0
    this._clearHeldInput()
  }

  _updateResumeCountdown(dt) {
    this.countdownTimer -= dt
    if (this.countdownTimer <= 0) {
      this.phase = 'chase'
      this.phaseTimer = 0
    }
  }

  _triggerNearCapture() {
    this.phase = 'near-capture'
    this.phaseTimer = 2.5
    this.zoom = 1
    this.nearCaptureLine = NEAR_CAPTURE_LINES[Math.floor(Math.random() * NEAR_CAPTURE_LINES.length)]
    this.nearCaptureCooldown = 15
    this.runnerLine = COOLNESS_LINES[Math.floor(Math.random() * COOLNESS_LINES.length)]
    this.runnerLineTimer = 2
  }

  _updateNearCapture(dt) {
    this.phaseTimer -= dt
    if (this.phaseTimer <= 0) {
      this.phase = 'close-call-freeze'
      this.phaseTimer = 1.0
    }
  }

  _updateCloseCallFreeze(dt) {
    this.phaseTimer -= dt
    if (this.phaseTimer <= 0) {
      this.phase = 'chase'
      this.phaseTimer = 0
      
      this.sheebs += 50
      this.onSheebsChange(this.sheebs)
      
      if (!this.slipperyBadgeEarned) {
        this.slipperyBadgeEarned = true
        this.newBadges.push('slippery-when-wet')
      }
    }
  }

  draw() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, VIEW_W, VIEW_H)

    ctx.save()
    this._applyCamera(ctx)
    this._drawMap(ctx)
    ctx.fillStyle = "rgba(150, 200, 255, 0.4)"
    this.soggyTrails.forEach(t => {
       ctx.beginPath()
       ctx.arc(t.x + t.w/2, t.y + t.h/2, t.w/2, 0, Math.PI * 2)
       ctx.fill()
    })
    this._drawPickups(ctx)
    if (this.plungerSwingTimer > 0) {
       ctx.save()
       ctx.strokeStyle = "rgba(139, 69, 19, 0.7)"
       ctx.lineWidth = 6
       ctx.beginPath()
       ctx.arc(this.runner.x + this.runner.w/2, this.runner.y + this.runner.h/2, 80, 0, Math.PI * 2)
       ctx.stroke()
       ctx.restore()
    }
    this.chasers.forEach((chaser) => {
      this._drawEntity(ctx, chaser)
      if (chaser.stunnedUntil > 0) this._drawStunEffect(ctx, chaser)
    })
    if (this.gawdParticleActive) this._drawGawdParticleGlow(ctx)
    this._drawEntity(ctx, this.runner)
    this._drawBullets(ctx)
    ctx.restore()

    this._drawHud(ctx)

    if (this.phase === 'intro') this._drawBanner(ctx, 'RUN LIKE HELL')
    if (this.phase === 'level-up') this._drawBanner(ctx, this.bannerText)
    if (this.phase === 'caught') this._drawJumpscare(ctx)
    if (this.phase === 'resume-countdown') this._drawResumeCountdown(ctx)
    if (this.phase === 'near-capture') this._drawNearCapture(ctx)
    if (this.phase === 'chase' || this.phase === 'close-call-freeze') this._drawControls(ctx)
    if (this.chaserLineTimer > 0 && (this.phase === 'chase' || this.phase === 'close-call-freeze')) {
      this._drawSpeechBubble(ctx, this.chaserLine)
    }
    if (this.runnerLineTimer > 0 && (this.phase === 'chase' || this.phase === 'close-call-freeze')) {
      this._drawSpeechBubble(ctx, this.runnerLine, 74)
    }
  }

  _drawResumeCountdown(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
    ctx.fillRect(0, 0, VIEW_W, VIEW_H)

    const num = Math.ceil(this.countdownTimer)
    if (num > 0) {
      ctx.save()
      ctx.translate(VIEW_W / 2, VIEW_H / 2)
      const frac = this.countdownTimer - Math.floor(this.countdownTimer)
      const scale = 1.0 + 0.5 * frac
      ctx.scale(scale, scale)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 120px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(num.toString(), 0, 0)
      ctx.restore()
    }
  }

  _applyCamera(ctx) {
    const focus = this.runner
    const zoom = this.phase === 'caught' ? this.zoom : 1.35
    const cx = focus.x + focus.w / 2
    const cy = focus.y + focus.h / 2

    ctx.translate(VIEW_W / 2, VIEW_H / 2)
    ctx.scale(zoom, zoom)
    ctx.translate(-cx, -cy)
  }

  _drawMap(ctx) {
    const { background, wallFill, wallStroke, puddleFill } = this.map.theme
    ctx.fillStyle = background
    ctx.fillRect(0, 0, WORLD.width, WORLD.height)

    ctx.fillStyle = puddleFill
    this.map.puddles.forEach((p) => {
      ctx.beginPath()
      ctx.ellipse(p.x, p.y, p.r, p.r * 0.6, 0, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.fillStyle = wallFill
    ctx.strokeStyle = wallStroke
    ctx.lineWidth = 3
    this.map.walls.forEach((w) => {
      ctx.fillRect(w.x, w.y, w.w, w.h)
      ctx.strokeRect(w.x, w.y, w.w, w.h)
    })
  }

  _pickupStyle(pickup) {
    if (pickup.type === 'badge') {
      return { bg: '#2c1a3a', border: '#c48bff', emoji: BADGES[pickup.badgeId]?.emoji || '⭐' }
    }
    if (pickup.type === 'humor-badge') {
      return { bg: '#1a3a2c', border: '#7dffb3', emoji: BADGES[pickup.badgeId]?.emoji || '❓' }
    }
    if (pickup.type === 'quest-badge') {
      return { bg: '#3a2f1a', border: '#ffb84d', emoji: BADGES[pickup.badgeId]?.emoji || '🏆' }
    }
    if (pickup.type === 'gawd-particle') {
      return { bg: '#3a2f0a', border: '#ffe066', emoji: '✨' }
    }
    if (pickup.type === 'schleimy-potion') {
      return { bg: '#2b5c19', border: '#5cff33', emoji: '🧪' }
    }
    return { bg: '#3a3a3a', border: '#ffd27a', emoji: '🔫' }
  }

  _drawPickups(ctx) {
    this.pickups.forEach((pickup) => {
      ctx.save()
      if (pickup.sprite) {
        ctx.font = '24px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(pickup.sprite, pickup.x + pickup.w / 2, pickup.y + pickup.h / 2)
      } else {
        const style = this._pickupStyle(pickup)
        ctx.fillStyle = style.bg
        ctx.fillRect(pickup.x, pickup.y, pickup.w, pickup.h)
        ctx.strokeStyle = style.border
        ctx.lineWidth = 2
        ctx.strokeRect(pickup.x, pickup.y, pickup.w, pickup.h)
        ctx.fillStyle = style.border
        ctx.font = 'bold 16px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(style.emoji, pickup.x + pickup.w / 2, pickup.y + pickup.h / 2)
      }
      ctx.restore()
    })

    this.rollingPickups.forEach(pickup => {
      ctx.save()
      ctx.fillStyle = pickup.isGood ? '#195c2b' : '#5c1919'
      ctx.fillRect(pickup.x, pickup.y, pickup.w, pickup.h)
      ctx.strokeStyle = pickup.isGood ? '#33ff5c' : '#ff3333'
      ctx.lineWidth = 2
      ctx.strokeRect(pickup.x, pickup.y, pickup.w, pickup.h)
      ctx.fillStyle = pickup.isGood ? '#33ff5c' : '#ff3333'
      ctx.font = 'bold 16px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const emoji = pickup.isGood ? '🍄' : '💣'
      ctx.fillText(emoji, pickup.x + pickup.w / 2, pickup.y + pickup.h / 2)
      ctx.restore()
    })
  }

  _drawBullets(ctx) {
    ctx.save()
    ctx.fillStyle = '#ffd27a'
    this.bullets.forEach((bullet) => {
      ctx.beginPath()
      ctx.arc(bullet.x + bullet.w / 2, bullet.y + bullet.h / 2, bullet.w / 2, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.restore()
  }

  _drawStunEffect(ctx, chaser) {
    ctx.save()
    ctx.fillStyle = 'rgba(255, 220, 80, 0.35)'
    ctx.fillRect(chaser.x, chaser.y, chaser.w, chaser.h)
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('💫', chaser.x + chaser.w / 2, chaser.y - 10)
    ctx.restore()
  }

  _drawGawdParticleGlow(ctx) {
    ctx.save()
    ctx.shadowColor = '#ffe066'
    ctx.shadowBlur = 20
    ctx.strokeStyle = '#ffe066'
    ctx.lineWidth = 3
    ctx.strokeRect(
      this.runner.x - 4,
      this.runner.y - 4,
      this.runner.w + 8,
      this.runner.h + 8,
    )
    ctx.restore()
  }

  _drawEntity(ctx, entity) {
    if (entity.face) {
      ctx.save()
      ctx.beginPath()
      ctx.rect(entity.x, entity.y, entity.w, entity.h)
      ctx.clip()
      ctx.drawImage(entity.face, entity.x, entity.y, entity.w, entity.h)
      ctx.restore()
      ctx.strokeStyle = entity.color
      ctx.lineWidth = 3
      ctx.strokeRect(entity.x, entity.y, entity.w, entity.h)
      return
    }

    ctx.fillStyle = entity.color
    ctx.fillRect(entity.x, entity.y, entity.w, entity.h)
  }

  _drawHud(ctx) {
    ctx.save()
    ctx.fillStyle = 'rgba(0,0,0,0.48)'
    ctx.fillRect(0, 0, VIEW_W, 34)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 13px sans-serif'
    ctx.textBaseline = 'middle'

    ctx.textAlign = 'left'
    ctx.fillText(`SKREEMS: ${Math.floor(this.skreems)}`, 10, 17)

    ctx.textAlign = 'center'
    if (this.sheebs < 0) {
      ctx.save()
      ctx.fillStyle = '#ff2e2e'
      ctx.fillText(`DEBT: ${this.sheebs}`, VIEW_W / 2, 17)
      ctx.restore()
    } else {
      ctx.fillText(`SHEEBS: ${this.sheebs}`, VIEW_W / 2, 17)
    }

    ctx.textAlign = 'right'
    ctx.fillText(`LEVEL ${this.levelIndex + 1}/${LEVELS.length}`, VIEW_W - 10, 17)
    ctx.restore()

    ctx.save()
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.fillRect(0, 34, VIEW_W, 20)
    ctx.fillStyle = '#ffb3b3'
    ctx.font = 'bold 11px sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(`DEATHS: ${this.deaths}`, 10, 44)
    if (this.chasers.length > 1) {
      ctx.textAlign = 'right'
      ctx.fillStyle = '#ffd27a'
      ctx.fillText(`TOILETS ON YOU: ${this.chasers.length}`, VIEW_W - 10, 44)
    }
    ctx.restore()

    if (this.runner.gun) {
      ctx.save()
      ctx.fillStyle = 'rgba(0,0,0,0.4)'
      ctx.fillRect(0, 54, 110, 20)
      ctx.fillStyle = '#ffd27a'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(`🔫 AMMO: ${this.runner.gun.ammo}`, 10, 64)
      ctx.restore()
    }

    if (this.runner.plunger) {
      ctx.save()
      ctx.fillStyle = 'rgba(0,0,0,0.4)'
      ctx.fillRect(0, 54, 110, 20)
      ctx.fillStyle = '#8b6ad1'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(`🪠 SWINGS: ${this.runner.plunger.swings}`, 10, 64)
      ctx.restore()
    }

    if (this.gawdParticleActive || this.tacoBellActive || this.decoyActive || this.soggyTpActive) {
      ctx.save()
      ctx.fillStyle = 'rgba(0,0,0,0.4)'
      ctx.fillRect(VIEW_W - 140, 54, 130, 80)
      ctx.fillStyle = '#ffe066'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      if (this.gawdParticleActive) {
        ctx.fillStyle = '#ffdf00'
        ctx.fillText(`✨ WALLHACK: ${this.gawdParticleTimer.toFixed(1)}s`, VIEW_W - 10, 64)
      }
      if (this.tacoBellActive) {
        ctx.fillStyle = '#ff4444'
        ctx.fillText(`🌮 SPICY: ${this.tacoBellTimer.toFixed(1)}s`, VIEW_W - 10, 84)
      }
      if (this.decoyActive) {
        ctx.fillStyle = '#44ffff'
        ctx.fillText(`🧍 DECOY: ${this.decoyTimer.toFixed(1)}s`, VIEW_W - 10, 104)
      }
      if (this.soggyTpActive) {
        ctx.fillStyle = '#96c8ff'
        ctx.fillText(`🧻 SOGGY: ${this.soggyTpTimer.toFixed(1)}s`, VIEW_W - 10, 124)
      }
      ctx.restore()
    }

    ctx.save()
    ctx.fillStyle = 'rgba(255,255,255,0.32)'
    ctx.font = 'bold 9px sans-serif'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    ctx.fillText(GAME_ITERATION, VIEW_W - 10, 60)
    ctx.restore()

    ctx.save()
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.fillRect(VIEW_W / 2 - 60, 6, 120, 8)
    ctx.fillStyle = this.stamina > 25 ? '#3ddc55' : '#e0403f'
    ctx.fillRect(VIEW_W / 2 - 60, 6, 120 * (this.stamina / this.maxStamina), 8)
    ctx.restore()

    if (this.schleimyPotionActive) {
      ctx.save()
      ctx.fillStyle = 'rgba(0,0,0,0.4)'
      ctx.fillRect(VIEW_W / 2 + 64, 6, 60, 8)
      ctx.fillStyle = '#5cff33'
      ctx.fillRect(VIEW_W / 2 + 64, 6, 60 * (this.schleimyPotionTimer / 4), 8)
      ctx.restore()
    }
  }

  _drawControls(ctx) {
    const j = this._joystickOrigin()
    ctx.save()
    ctx.globalAlpha = 0.35
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(j.x, j.y, 50, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 0.7
    const kx = j.x + this.joystick.dx * 40
    const ky = j.y + this.joystick.dy * 40
    ctx.beginPath()
    ctx.arc(kx, ky, 22, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    const s = this._sprintOrigin()
    ctx.save()
    ctx.globalAlpha = this.sprintBtn.active || this.keys.sprint ? 0.95 : 0.5
    ctx.fillStyle = '#ff5a3c'
    ctx.beginPath()
    ctx.arc(s.x, s.y, 40, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 13px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('SPRINT', s.x, s.y)
    ctx.font = 'bold 10px sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.fillText('SPACE', s.x, s.y + 16)
    ctx.restore()

    if (this.runner.gun || this.runner.plunger) {
      const f = this._fireOrigin()
      ctx.save()
      ctx.globalAlpha = this.fireBtn.active ? 0.95 : 0.6
      ctx.fillStyle = this.runner.plunger ? '#8b6ad1' : '#ffd27a'
      ctx.beginPath()
      ctx.arc(f.x, f.y, 34, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.fillStyle = '#1c1f2b'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(this.runner.plunger ? 'SWING' : 'FIRE', f.x, f.y)
      ctx.font = 'bold 9px sans-serif'
      ctx.fillText('F', f.x, f.y + 14)
      ctx.restore()
    }

    ctx.save()
    ctx.fillStyle = 'rgba(255,255,255,0.68)'
    ctx.font = 'bold 11px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('ARROWS / WASD + SPACE', VIEW_W / 2, VIEW_H - 18)
    ctx.restore()
  }

  _drawBanner(ctx, text) {
    ctx.save()
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(0, 0, VIEW_W, VIEW_H)
    ctx.fillStyle = '#ff2e2e'
    ctx.font = 'bold 28px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.save()
    ctx.translate(VIEW_W / 2, VIEW_H / 2)
    ctx.rotate(-0.05)
    ctx.fillText(text, 0, 0)
    ctx.restore()

    if (this.earnedBadges && this.earnedBadges.length > 0) {
      ctx.font = '30px sans-serif'
      const badgeStr = this.earnedBadges
        .map((badgeId) => BADGES[badgeId]?.emoji)
        .filter(Boolean)
        .join(' ')
      ctx.fillStyle = 'white'
      ctx.fillText(badgeStr, VIEW_W / 2, VIEW_H / 2 + 60)
    }
    ctx.restore()
  }

  _drawSpeechBubble(ctx, text, y = 40) {
    ctx.save()
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fillRect(20, y, VIEW_W - 40, 28)
    ctx.fillStyle = '#000'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, VIEW_W / 2, y + 14)
    ctx.restore()
  }

  _drawJumpscare(ctx) {
    const flash = Math.sin(performance.now() / 60) > 0
    ctx.save()
    ctx.fillStyle = flash ? 'rgba(255,0,0,0.45)' : 'rgba(120,0,0,0.35)'
    ctx.fillRect(0, 0, VIEW_W, VIEW_H)

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = 'bold 26px sans-serif'
    ctx.fillStyle = '#fff'
    for (let i = 0; i < 3; i++) {
      const jitter = (Math.random() - 0.5) * 6
      ctx.fillStyle = ['#ff0040', '#00fff0', '#ffffff'][i]
      ctx.globalAlpha = i === 2 ? 1 : 0.5
      ctx.fillText(this.captureLine, VIEW_W / 2 + jitter, VIEW_H / 2 + jitter)
    }
    ctx.restore()
  }

  _drawNearCapture(ctx) {
    ctx.save()
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, VIEW_W, VIEW_H)

    if (this.runner.gettingCapturedFace) {
      const img = this.runner.gettingCapturedFace
      const scale = Math.max(VIEW_W / img.width, VIEW_H / img.height)
      const w = img.width * scale
      const h = img.height * scale
      const x = (VIEW_W - w) / 2
      const y = (VIEW_H - h) / 2
      ctx.drawImage(img, x, y, w, h)
    }

    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(0, VIEW_H - 120, VIEW_W, 120)

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillStyle = '#fff'
    
    this._wrapText(ctx, this.nearCaptureLine, VIEW_W / 2, VIEW_H - 60, VIEW_W - 40, 26)

    ctx.restore()
  }

  _wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ')
    let line = ''
    let lines = []
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' '
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line)
        line = words[n] + ' '
      } else {
        line = testLine
      }
    }
    lines.push(line)

    const startY = y - ((lines.length - 1) * lineHeight) / 2
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, startY + (i * lineHeight))
    }
  }
}
