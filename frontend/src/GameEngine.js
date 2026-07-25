// GameEngine.js
// Vanilla JS / HTML5 Canvas engine for Skib-Jay-Dee-Toilet, Phase 1.
// Runs update()/draw() on a fixed internal 9:16 resolution, scaled to fill
// whatever CSS size the <canvas> is given (see index.css .portrait-frame).

export const WORLD = {
  width: 900,
  height: 1500,
}

// Internal render resolution - kept at a classic 9:16 arcade ratio.
const VIEW_W = 360
const VIEW_H = 640

const CAPTURE_LINES = [
  'JAYDEN CAPTURED!',
  'YOU JUST GOT PLUNGED!',
  "LOOKS LIKE YOU'RE COMPLETELY OUT OF PAPER!",
  'TOOT-AL-OO! DOWN THE DRAIN YOU GO!',
  "THAT'S A TOTAL WIPEOUT!",
]

const CHASER_LINES = [
  'SKIBIDI SKIBIDI!',
  "I SEE YOU! YOU CAN RUN, BUT YOU CAN'T WIPE!",
  "YOU'RE COMPLETELY STALLED!",
]

function rectsIntersect(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

// "The Porcelain Palace" - a brightly lit, sterile public restroom.
// Walls are simple AABB rects the runner collides with; stalls double as
// hiding spots / dead ends per the design doc.
function buildPorcelainPalace() {
  const walls = []
  const t = 24 // wall thickness
  // Outer boundary
  walls.push({ x: 0, y: 0, w: WORLD.width, h: t }) // top
  walls.push({ x: 0, y: WORLD.height - t, w: WORLD.width, h: t }) // bottom
  walls.push({ x: 0, y: 0, w: t, h: WORLD.height }) // left
  walls.push({ x: WORLD.width - t, y: 0, w: t, h: WORLD.height }) // right

  // Rows of bathroom stalls creating corridors + dead ends.
  const stallW = 110
  const stallH = 160
  const gap = 90
  for (let row = 0; row < 4; row++) {
    const y = 220 + row * 300
    for (let col = 0; col < 3; col++) {
      const x = 120 + col * (stallW + gap)
      walls.push({ x, y, w: stallW, h: stallH })
    }
  }

  // A couple of "slippery wet-floor zones" - visual only in Phase 1, no
  // collision, drawn as puddles.
  const puddles = [
    { x: 300, y: 500, r: 60 },
    { x: 650, y: 900, r: 70 },
    { x: 200, y: 1200, r: 55 },
  ]

  return { walls, puddles }
}

export class GameEngine {
  constructor(canvas, { onCaught, onSkreem } = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.canvas.width = VIEW_W
    this.canvas.height = VIEW_H

    this.onCaught = onCaught || (() => {})
    this.onSkreem = onSkreem || (() => {})

    this.map = buildPorcelainPalace()

    this.runner = {
      x: WORLD.width / 2 - 20,
      y: WORLD.height - 200,
      w: 40,
      h: 40,
      baseSpeed: 180, // px/sec
      color: '#3ddc55',
      face: null,
    }
    this.chaser = {
      x: WORLD.width / 2 - 20,
      y: 150,
      w: 44,
      h: 44,
      baseSpeed: 130, // slower than a sprinting runner, faster than walking
      color: '#8a5a34',
      face: null,
    }

    this.stamina = 100
    this.skreems = 0
    this.phase = 'intro' // intro -> chase -> caught
    this.phaseTimer = 1.6 // seconds "RUN LIKE HELL" banner shows
    this.zoom = 1
    this.captureLine = CAPTURE_LINES[0]
    this.chaserLine = ''
    this.chaserLineTimer = 0

    this.joystick = { active: false, id: null, cx: 0, cy: 0, dx: 0, dy: 0 }
    this.sprintBtn = { active: false, id: null }

    this._bindInput()
    this._raf = null
    this._lastTime = null
  }

  setFaces({ runnerFace, chaserFace }) {
    if (runnerFace) this.runner.face = runnerFace
    if (chaserFace) this.chaser.face = chaserFace
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

  // ---- input -------------------------------------------------------------

  _bindInput() {
    this._onPointerDown = (e) => this._handlePointerDown(e)
    this._onPointerMove = (e) => this._handlePointerMove(e)
    this._onPointerUp = (e) => this._handlePointerUp(e)

    this.canvas.addEventListener('pointerdown', this._onPointerDown)
    window.addEventListener('pointermove', this._onPointerMove)
    window.addEventListener('pointerup', this._onPointerUp)
    window.addEventListener('pointercancel', this._onPointerUp)
  }

  _unbindInput() {
    this.canvas.removeEventListener('pointerdown', this._onPointerDown)
    window.removeEventListener('pointermove', this._onPointerMove)
    window.removeEventListener('pointerup', this._onPointerUp)
    window.removeEventListener('pointercancel', this._onPointerUp)
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
      return
    }
    if (distJoy < 70 || (x < VIEW_W / 2 && y > VIEW_H - 180)) {
      this.joystick.active = true
      this.joystick.id = e.pointerId
      this.joystick.cx = j.x
      this.joystick.cy = j.y
      this._updateJoystickVector(x, y)
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

  // ---- update --------------------------------------------------------------

  update(dt) {
    if (this.phase === 'intro') {
      this.phaseTimer -= dt
      if (this.phaseTimer <= 0) this.phase = 'chase'
      return
    }

    if (this.phase === 'caught') {
      this._updateCaught(dt)
      return
    }

    // --- Runner movement ---
    const sprinting = this.sprintBtn.active && this.stamina > 0
    if (sprinting) {
      this.stamina = clamp(this.stamina - dt * 35, 0, 100)
    } else {
      this.stamina = clamp(this.stamina + dt * 20, 0, 100)
    }
    const speed = this.runner.baseSpeed * (sprinting ? 1.8 : 1)

    const moveX = this.joystick.dx * speed * dt
    const moveY = this.joystick.dy * speed * dt
    this._moveWithCollision(this.runner, moveX, moveY)

    // --- Chaser AI: seek the runner directly ---
    const dx = this.runner.x - this.chaser.x
    const dy = this.runner.y - this.chaser.y
    const dist = Math.hypot(dx, dy) || 1
    const chaserSpeed = this.chaser.baseSpeed
    this.chaser.x += (dx / dist) * chaserSpeed * dt
    this.chaser.y += (dy / dist) * chaserSpeed * dt
    this.chaser.x = clamp(this.chaser.x, 24, WORLD.width - 24 - this.chaser.w)
    this.chaser.y = clamp(this.chaser.y, 24, WORLD.height - 24 - this.chaser.h)

    // Skreem counter ticks up the closer the toilet gets (per design doc).
    if (dist < 260) {
      this.skreems += dt * (260 - dist) * 0.05
      this.onSkreem(Math.floor(this.skreems))
    }

    if (dist < 180 && this.chaserLineTimer <= 0) {
      this.chaserLine = CHASER_LINES[Math.floor(Math.random() * CHASER_LINES.length)]
      this.chaserLineTimer = 2.5
    }
    this.chaserLineTimer = Math.max(0, this.chaserLineTimer - dt)

    // --- Collision -> Caught event ---
    if (rectsIntersect(this.runner, this.chaser)) {
      this._triggerCaught()
    }
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
    this.onCaught(this.captureLine)
  }

  _updateCaught(dt) {
    this.phaseTimer -= dt
    // Zoom aggressively toward the victim over the first ~0.6s, then hold.
    this.zoom = clamp(this.zoom + dt * 5, 1, 3)

    if (this.phaseTimer <= 0) {
      // Respawn both players and resume the chase.
      this.runner.x = WORLD.width / 2 - 20
      this.runner.y = WORLD.height - 200
      this.chaser.x = WORLD.width / 2 - 20
      this.chaser.y = 150
      this.zoom = 1
      this.phase = 'chase'
    }
  }

  // ---- draw ---------------------------------------------------------------

  draw() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, VIEW_W, VIEW_H)

    ctx.save()
    this._applyCamera(ctx)
    this._drawMap(ctx)
    this._drawEntity(ctx, this.chaser)
    this._drawEntity(ctx, this.runner)
    ctx.restore()

    this._drawHud(ctx)

    if (this.phase === 'intro') this._drawBanner(ctx, 'RUN LIKE HELL')
    if (this.phase === 'caught') this._drawJumpscare(ctx)
    if (this.phase === 'chase') this._drawControls(ctx)
    if (this.chaserLineTimer > 0 && this.phase === 'chase') {
      this._drawSpeechBubble(ctx, this.chaserLine)
    }
  }

  _applyCamera(ctx) {
    const focus = this.phase === 'caught' ? this.runner : this.runner
    const zoom = this.phase === 'caught' ? this.zoom : 1.4
    const cx = focus.x + focus.w / 2
    const cy = focus.y + focus.h / 2

    ctx.translate(VIEW_W / 2, VIEW_H / 2)
    ctx.scale(zoom, zoom)
    ctx.translate(-cx, -cy)
  }

  _drawMap(ctx) {
    ctx.fillStyle = '#e8f4f8'
    ctx.fillRect(0, 0, WORLD.width, WORLD.height)

    ctx.fillStyle = 'rgba(120, 190, 255, 0.35)'
    this.map.puddles.forEach((p) => {
      ctx.beginPath()
      ctx.ellipse(p.x, p.y, p.r, p.r * 0.6, 0, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.fillStyle = '#c9c9d1'
    ctx.strokeStyle = '#8f8f9a'
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
    } else {
      ctx.fillStyle = entity.color
      ctx.fillRect(entity.x, entity.y, entity.w, entity.h)
    }
  }

  _drawHud(ctx) {
    ctx.save()
    ctx.fillStyle = 'rgba(0,0,0,0.45)'
    ctx.fillRect(0, 0, VIEW_W, 34)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 14px sans-serif'
    ctx.textBaseline = 'middle'
    ctx.fillText(`SKREEMS: ${Math.floor(this.skreems)}`, 10, 17)
    ctx.textAlign = 'right'
    ctx.fillText(this.phase === 'caught' ? 'CAUGHT!' : 'RUN!', VIEW_W - 10, 17)
    ctx.restore()

    // Stamina bar
    ctx.save()
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.fillRect(VIEW_W / 2 - 60, 6, 120, 8)
    ctx.fillStyle = this.stamina > 25 ? '#3ddc55' : '#e0403f'
    ctx.fillRect(VIEW_W / 2 - 60, 6, 120 * (this.stamina / 100), 8)
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
    ctx.globalAlpha = this.sprintBtn.active ? 0.9 : 0.5
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
    ctx.restore()
  }

  _drawBanner(ctx, text) {
    ctx.save()
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(0, 0, VIEW_W, VIEW_H)
    ctx.fillStyle = '#ff2e2e'
    ctx.font = 'bold 32px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.save()
    ctx.translate(VIEW_W / 2, VIEW_H / 2)
    ctx.rotate(-0.05)
    ctx.fillText(text, 0, 0)
    ctx.restore()
    ctx.restore()
  }

  _drawSpeechBubble(ctx, text) {
    ctx.save()
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fillRect(20, 40, VIEW_W - 40, 28)
    ctx.fillStyle = '#000'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, VIEW_W / 2, 54)
    ctx.restore()
  }

  _drawJumpscare(ctx) {
    // Flashing red overlay + glitch-ish derp text, per the design doc's
    // "Instant Camera Snap-to-Face -> Zoom 300% -> Apply Glitch/Derp Filter".
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
}
