// GameEngine.js
// Vanilla JS / HTML5 Canvas engine for Skib-Jay-Dee-Toilet.
// Keeps the action in one place so React stays out of the hot path.

import { GAME_ITERATION } from './version.js'
import { CAPTURE_LINES, CHASER_LINES, TIRED_LINES, NEAR_CAPTURE_LINES } from './dialog.js'
import { CHASER_FACE_POOL, randomFrom } from './gameContent.js'

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

function addGrid(walls, {
  startX,
  startY,
  cols,
  rows,
  gapX,
  gapY,
  tileW,
  tileH,
  staggerEvery = 0,
  staggerOffset = 0,
}) {
  for (let row = 0; row < rows; row++) {
    const rowOffset = staggerEvery && row % staggerEvery === 1 ? staggerOffset : 0
    const y = startY + row * gapY
    for (let col = 0; col < cols; col++) {
      const x = startX + rowOffset + col * gapX
      walls.push({ x, y, w: tileW, h: tileH })
    }
  }
}

function buildPorcelainPalace() {
  const walls = []
  const puddles = []
  makeBoundaryWalls(walls)
  addGrid(walls, {
    startX: 120,
    startY: 220,
    cols: 3,
    rows: 4,
    gapX: 200,
    gapY: 300,
    tileW: 110,
    tileH: 160,
  })
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

  // Narrower lanes, more turns.
  walls.push({ x: 140, y: 170, w: 90, h: 280 })
  walls.push({ x: 350, y: 250, w: 150, h: 120 })
  walls.push({ x: 610, y: 160, w: 90, h: 340 })
  walls.push({ x: 180, y: 620, w: 180, h: 90 })
  walls.push({ x: 430, y: 760, w: 120, h: 210 })
  walls.push({ x: 610, y: 1020, w: 160, h: 110 })
  walls.push({ x: 120, y: 1120, w: 120, h: 240 })
  walls.push({ x: 340, y: 1230, w: 220, h: 120 })
  walls.push({ x: 640, y: 1280, w: 110, h: 110 })

  addGrid(walls, {
    startX: 90,
    startY: 420,
    cols: 3,
    rows: 2,
    gapX: 230,
    gapY: 300,
    tileW: 90,
    tileH: 150,
    staggerEvery: 2,
    staggerOffset: 60,
  })

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

  walls.push({ x: 120, y: 170, w: 660, h: 52 })
  walls.push({ x: 120, y: 330, w: 110, h: 420 })
  walls.push({ x: 310, y: 330, w: 110, h: 190 })
  walls.push({ x: 310, y: 610, w: 110, h: 140 })
  walls.push({ x: 500, y: 330, w: 110, h: 390 })
  walls.push({ x: 690, y: 330, w: 90, h: 190 })
  walls.push({ x: 690, y: 610, w: 90, h: 340 })
  walls.push({ x: 180, y: 860, w: 160, h: 120 })
  walls.push({ x: 400, y: 900, w: 150, h: 100 })
  walls.push({ x: 600, y: 980, w: 180, h: 180 })
  walls.push({ x: 130, y: 1160, w: 170, h: 160 })
  walls.push({ x: 360, y: 1180, w: 180, h: 130 })
  walls.push({ x: 610, y: 1320, w: 160, h: 100 })

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

  // Long, narrow vertical aisles blocked by knocked-over shopping carts.
  addGrid(walls, {
    startX: 100,
    startY: 160,
    cols: 4,
    rows: 6,
    gapX: 190,
    gapY: 220,
    tileW: 60,
    tileH: 170,
  })

  walls.push({ x: 40, y: 700, w: 140, h: 60 })
  walls.push({ x: 700, y: 500, w: 140, h: 60 })
  walls.push({ x: 380, y: 1300, w: 160, h: 60 })

  puddles.push(
    { x: 220, y: 340, r: 50 },
    { x: 560, y: 900, r: 60 },
    { x: 760, y: 1250, r: 45 },
  )

  return {
    walls,
    puddles,
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

  // Rows of parked "cars" with lanes between them.
  addGrid(walls, {
    startX: 90,
    startY: 200,
    cols: 3,
    rows: 5,
    gapX: 260,
    gapY: 240,
    tileW: 150,
    tileH: 90,
    staggerEvery: 2,
    staggerOffset: 90,
  })

  walls.push({ x: 60, y: 1300, w: 200, h: 70 })
  walls.push({ x: 620, y: 1320, w: 200, h: 70 })

  puddles.push(
    { x: 260, y: 1160, r: 60 },
    { x: 620, y: 780, r: 55 },
  )

  return {
    walls,
    puddles,
    theme: {
      background: '#1c1f2b',
      wallFill: '#3a3f52',
      wallStroke: '#0d0f16',
      puddleFill: 'rgba(255, 255, 255, 0.08)',
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
  },
  {
    name: 'World Star Parking Lot',
    banner: 'LEVEL 5: WORLD STAR PARKING LOT',
    reward: 160,
    advanceAt: null,
    chaserSpeed: 182,
    runnerSpawn: { x: 260, y: WORLD.height - 140 },
    chaserSpawn: { x: WORLD.width - 150, y: 230 },
    buildMap: buildWorldStarParkingLot,
  },
]

const MAX_CHASERS = 5
const EXTRA_CHASER_INTERVAL = 14 // seconds of uninterrupted chase before another toilet joins
const PIPEWORKS_MAX_PRESSURE_SKREEM_GOAL = 68
const PIPEWORKS_HALL_COVERAGE_GOAL = 0.8
const PIPEWORKS_GATE_REQUIRED_CHASERS = 4
const PIPEWORKS_GATE_REQUIRED_SECONDS = 15
const PIPEWORKS_HALL_GRID_SIZE = 30
const DEATH_SKREEM_PENALTY = 0.3 // fraction of skreems lost on capture
const DEATH_SHEEBS_PENALTY = 20

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
      initialSheebs,
      initialDeaths = 0,
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
    }
    this.chaser = {
      x: WORLD.width / 2 - 20,
      y: 150,
      w: 44,
      h: 44,
      baseSpeed: 130,
      color: '#8a5a34',
      face: null,
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
    this.sheebs = Math.max(0, Math.floor(initialSheebs))
    this.skreems = 0
    this.levelSkreems = 0
    this.deaths = Math.max(0, Math.floor(initialDeaths))
    this.phase = 'intro'
    this.phaseTimer = 1.6
    this.zoom = 1
    this.captureLine = CAPTURE_LINES[0]
    this._preCaughtRunnerFace = null
    this._caughtFaceStage = null
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

    this.loadout = { speedBonus: 0, staminaBonus: 0, rewardBonus: 0 }

    this.joystick = { active: false, id: null, cx: 0, cy: 0, dx: 0, dy: 0 }
    this.sprintBtn = { active: false, id: null }
    this.keys = { up: false, down: false, left: false, right: false, sprint: false }

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

  setFaces({ runnerFace, chaserFace, runnerIsCustom, runnerGettingCapturedFace, runnerCapturedFace }) {
    if (runnerFace) this.runner.face = runnerFace
    if (chaserFace) this.chasers.forEach((c) => { c.face = chaserFace })
    this.runner.isCustom = !!runnerIsCustom
    if (runnerGettingCapturedFace) this.runner.gettingCapturedFace = runnerGettingCapturedFace
    if (runnerCapturedFace) this.runner.capturedFace = runnerCapturedFace
  }

  setSheebs(sheebs) {
    this.sheebs = Math.max(0, Math.floor(sheebs))
  }

  setLoadout(loadout = {}) {
    this.loadout = {
      speedBonus: Number.isFinite(loadout.speedBonus) ? loadout.speedBonus : 0,
      staminaBonus: Number.isFinite(loadout.staminaBonus) ? loadout.staminaBonus : 0,
      rewardBonus: Number.isFinite(loadout.rewardBonus) ? loadout.rewardBonus : 0,
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
    this.keys.up = false
    this.keys.down = false
    this.keys.left = false
    this.keys.right = false
    this.keys.sprint = false
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

  _handlePointerDown(e) {
    const { x, y } = this._toViewCoords(e)
    const j = this._joystickOrigin()
    const s = this._sprintOrigin()
    const distJoy = Math.hypot(x - j.x, y - j.y)
    const distSprint = Math.hypot(x - s.x, y - s.y)

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
    if (this.joystick.active && e.pointerId === this.joystick.id) {
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
    this.pipeworksSkreems = 0
    this.chasers = [this.chaser]
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

    this.sheebs += reward
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

    if (this.phase === 'near-capture') {
      this._updateNearCapture(dt)
      return
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

    const speed = this.runner.baseSpeed * (sprinting ? 1.8 : 1)
    const move = this._getMoveVector()
    this._moveWithCollision(this.runner, move.x * speed * dt, move.y * speed * dt)

    this._maybeSpawnExtraChaser(dt)
    this._updatePipeworksGateProgress(dt)

    let closestDist = Infinity
    let caught = false
    let nearCapture = false

    for (const chaser of this.chasers) {
      const dx = this.runner.x - chaser.x
      const dy = this.runner.y - chaser.y
      const dist = Math.hypot(dx, dy) || 1
      chaser.joinRamp = Math.min(1, (chaser.joinRamp ?? 1) + dt / CHASER_JOIN_RAMP_SECONDS)
      const joinRampMod = lerp(CHASER_JOIN_RAMP_START, 1, chaser.joinRamp)
      const chaserSpeed = chaser.baseSpeed * this.chaserSpeedMod * joinRampMod
      chaser.x += (dx / dist) * chaserSpeed * dt
      chaser.y += (dy / dist) * chaserSpeed * dt
      chaser.x = clamp(chaser.x, 24, WORLD.width - 24 - chaser.w)
      chaser.y = clamp(chaser.y, 24, WORLD.height - 24 - chaser.h)

      if (dist < 300) {
        const gain = dt * (300 - dist) * 0.06
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
      if (dist < closestDist) closestDist = dist
      if (rectsIntersect(this.runner, chaser)) {
        caught = true
      } else if (dist < 100 && this.nearCaptureCooldown <= 0) {
        nearCapture = true
      }
    }

    if (this.chasers.length > 0) this.onSkreem(Math.floor(this.skreems))

    if (this.level.name === 'Pipeworks') {
      if (this.pipeworksSkreems >= PIPEWORKS_MAX_PRESSURE_SKREEM_GOAL) {
        this._startLevelAdvance()
        return
      }
    } else if (this.level.advanceAt && this.levelSkreems >= this.level.advanceAt) {
      this._startLevelAdvance()
      return
    }

    if (closestDist < 200 && this.chaserLineTimer <= 0) {
      this.chaserLine = CHASER_LINES[Math.floor(Math.random() * CHASER_LINES.length)]
      this.chaserLineTimer = 2
      this.onChaserBark(this.chaserLine)
    }
    this.chaserLineTimer = Math.max(0, this.chaserLineTimer - dt)

    if (caught) {
      this._triggerCaught()
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
      color: this.chaser.color,
      face: extraFace,
      faceId: extraFaceId,
    })
    this.onExtraChaserSpawn({
      count: this.chasers.length,
      index: this.chasers.length - 1,
      faceId: extraFaceId,
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

  _triggerCaught() {
    this.phase = 'caught'
    this.phaseTimer = 2.6
    this.zoom = 1
    this.captureLine = CAPTURE_LINES[Math.floor(Math.random() * CAPTURE_LINES.length)]

    // Swap to the poses shot for this exact beat, unless the player
    // uploaded their own custom runner face (never override that).
    this._preCaughtRunnerFace = this.runner.face
    this._caughtFaceStage = 'impact'
    if (!this.runner.isCustom && this.runner.gettingCapturedFace) {
      this.runner.face = this.runner.gettingCapturedFace
    }

    this.deaths += 1
    const skreemsLost = Math.round(this.skreems * DEATH_SKREEM_PENALTY)
    const sheebsLost = Math.min(this.sheebs, DEATH_SHEEBS_PENALTY)
    this.skreems = Math.max(0, this.skreems - skreemsLost)
    this.levelSkreems = Math.max(0, this.levelSkreems - skreemsLost)
    this.pipeworksSkreems = Math.max(0, (this.pipeworksSkreems || 0) - skreemsLost)
    this.sheebs = Math.max(0, this.sheebs - sheebsLost)
    if (this.level.name === 'Pipeworks') {
      this.pipeworksFourSkibSeconds = 0
      this.pipeworksTransitionReady = false
    }
    this.chaserSpeedMod = clamp(
      this.chaserSpeedMod + CHASER_SPEED_MOD_DEATH_STEP,
      CHASER_SPEED_MOD_MIN,
      CHASER_SPEED_MOD_MAX,
    )

    this.onDeath({ deaths: this.deaths, levelName: this.level.name })
    this.onSkreem(Math.floor(this.skreems))
    this.onCaught(this.captureLine)
  }

  _updateCaught(dt) {
    this.phaseTimer -= dt
    this.zoom = clamp(this.zoom + dt * 5, 1, 3)

    // Once the zoom-in finishes, hold on the "resigned" pose for the rest
    // of the beat instead of the initial impact pose.
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
      this.chasers = [this.chaser]
      this.extraChaserTimer = EXTRA_CHASER_INTERVAL
      this.zoom = 1
      this.stamina = this.maxStamina
      this.phase = 'chase'
      this.phaseTimer = 0
      this.chaserLineTimer = 0
      this.runnerLineTimer = 0
      this.staminaExhaustedFired = false
      if (this._preCaughtRunnerFace) this.runner.face = this._preCaughtRunnerFace
      this._preCaughtRunnerFace = null
      this._caughtFaceStage = null
    }
  }

  _triggerNearCapture() {
    this.phase = 'near-capture'
    this.phaseTimer = 2.5
    this.zoom = 1
    this.nearCaptureLine = NEAR_CAPTURE_LINES[Math.floor(Math.random() * NEAR_CAPTURE_LINES.length)]
    this.nearCaptureCooldown = 15
  }

  _updateNearCapture(dt) {
    this.phaseTimer -= dt
    if (this.phaseTimer <= 0) {
      this.phase = 'chase'
      this.phaseTimer = 0
    }
  }

  draw() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, VIEW_W, VIEW_H)

    ctx.save()
    this._applyCamera(ctx)
    this._drawMap(ctx)
    this.chasers.forEach((chaser) => this._drawEntity(ctx, chaser))
    this._drawEntity(ctx, this.runner)
    ctx.restore()

    this._drawHud(ctx)

    if (this.phase === 'intro') this._drawBanner(ctx, 'RUN LIKE HELL')
    if (this.phase === 'level-up') this._drawBanner(ctx, this.bannerText)
    if (this.phase === 'caught') this._drawJumpscare(ctx)
    if (this.phase === 'near-capture') this._drawNearCapture(ctx)
    if (this.phase === 'chase') this._drawControls(ctx)
    if (this.chaserLineTimer > 0 && this.phase === 'chase') {
      this._drawSpeechBubble(ctx, this.chaserLine)
    }
    if (this.runnerLineTimer > 0 && this.phase === 'chase') {
      this._drawSpeechBubble(ctx, this.runnerLine, 74)
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
    ctx.fillText(`SHEEBS: ${this.sheebs}`, VIEW_W / 2, 17)

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
