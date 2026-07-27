import re

with open('frontend/src/GameEngine.js', 'r') as f:
    content = f.read()

# 1. Constants
content = content.replace(
'''const HEAVY_PLUNGER_KNOCKBACK = 80''',
'''const HEAVY_PLUNGER_KNOCKBACK = 80

const ROD_OF_POOPDOM_SPAWN_CHANCE = 0.05
const ROD_OF_POOPDOM_PICKUP_SIZE = 24
const ROD_OF_POOPDOM_COOLDOWN = 3
const ROD_OF_POOPDOM_RANGE = 300'''
)

# 2. Runner State
content = content.replace(
'''      facing: { x: 0, y: 1 },
      gun: null,''',
'''      facing: { x: 0, y: 1 },
      gun: null,
      rod: false,'''
)

# 3. Engine State
content = content.replace(
'''    this.tacoBellActive = false
    this.tacoBellTimer = 0''',
'''    this.tacoBellActive = false
    this.tacoBellTimer = 0
    this.stinkyTimer = 0
    this.smokeEffects = []
    this.pointerPos = { x: 0, y: 0 }'''
)

# 3b. Reset state (around line 517)
content = content.replace(
'''    this.runner.plunger = null''',
'''    this.runner.plunger = null
    this.runner.rod = false'''
)

# 4. _handleKey
content = content.replace(
'''      case 'KeyF':
        this.keys.fire = isDown
        break''',
'''      case 'KeyF':
      case 'KeyT':
        this.keys.fire = isDown
        break'''
)

# 5. _handlePointerMove
content = content.replace(
'''  _handlePointerMove(e) {
    if (this.joystick.active && e.pointerId === this.joystick.id && !this.tacoBellActive) {
      const { x, y } = this._toViewCoords(e)
      this._updateJoystickVector(x, y)
    }
  }''',
'''  _handlePointerMove(e) {
    this.pointerPos = this._toViewCoords(e)
    if (this.joystick.active && e.pointerId === this.joystick.id && !this.tacoBellActive) {
      const { x, y } = this.pointerPos
      this._updateJoystickVector(x, y)
    }
  }'''
)

# 6. _handlePointerDown
content = content.replace(
'''    const distFire = Math.hypot(x - f.x, y - f.y)

    if ((this.runner.gun || this.runner.plunger) && distFire < 34) {''',
'''    const distFire = Math.hypot(x - f.x, y - f.y)

    this.pointerPos = { x, y }

    if ((this.runner.gun || this.runner.plunger || this.runner.rod) && distFire < 34) {'''
)

# 7. update dt
content = content.replace(
'''    if (this.decoyActive) {
      this.decoyTimer -= dt
      if (this.decoyTimer <= 0) this.decoyActive = false
    }''',
'''    if (this.decoyActive) {
      this.decoyTimer -= dt
      if (this.decoyTimer <= 0) this.decoyActive = false
    }

    if (this.stinkyTimer > 0) {
      this.stinkyTimer -= dt
    }

    if (this.smokeEffects) {
      this.smokeEffects = this.smokeEffects.filter(s => {
        s.age += dt
        return s.age < s.life
      })
    }'''
)

# 8. draw smoke effects
content = content.replace(
'''    this.chasers.forEach((chaser) => {''',
'''    if (this.smokeEffects) {
      for (const s of this.smokeEffects) {
        ctx.fillStyle = `rgba(139, 69, 19, ${1 - s.age / s.life})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * (1 + s.age / s.life), 0, Math.PI * 2)
        ctx.fill()
      }
    }
    this.chasers.forEach((chaser) => {'''
)

# 9. Pick up logic
content = content.replace(
'''      } else if (pickup.type === 'heavy-plunger') {
        this.runner.plunger = { swings: HEAVY_PLUNGER_SWINGS }
        this.runnerLine = 'Got a plunger. Time to swing.'
        this.runnerLineTimer = 1.5
      }''',
'''      } else if (pickup.type === 'heavy-plunger') {
        this.runner.plunger = { swings: HEAVY_PLUNGER_SWINGS }
        this.runner.gun = null
        this.runner.rod = false
        this.runnerLine = 'Got a plunger. Time to swing.'
        this.runnerLineTimer = 1.5
      } else if (pickup.type === 'rod-of-poopdom') {
        this.runner.rod = true
        this.runner.plunger = null
        this.runner.gun = null
        this.runnerLine = 'The Rod of Poopdom!'
        this.runnerLineTimer = 1.5
      }'''
)

# Pick up logic also replaces previous items
content = content.replace(
'''        this.runner.gun = {
          ammo: chambers,
          chambers: chambers,
        }
        this.runnerLine = `Found ${chambers} shot${chambers > 1 ? 's' : ''}.`''',
'''        this.runner.gun = {
          ammo: chambers,
          chambers: chambers,
        }
        this.runner.plunger = null
        this.runner.rod = false
        this.runnerLine = `Found ${chambers} shot${chambers > 1 ? 's' : ''}.`'''
)

# 10. spawn logic
content = content.replace(
'''    this._maybeSpawnHumorBadge()
    this._maybeSpawnGawdParticle()''',
'''    this._maybeSpawnHumorBadge()
    this._maybeSpawnGawdParticle()
    this._maybeSpawnRodOfPoopdom()'''
)

content = content.replace(
'''  _maybeSpawnHeavyPlunger() {
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
  }''',
'''  _maybeSpawnHeavyPlunger() {
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

  _maybeSpawnRodOfPoopdom() {
    if (Math.random() > ROD_OF_POOPDOM_SPAWN_CHANCE) return
    const spawn = this._findRandomWalkableSpawn()
    if (!spawn) return
    this.pickups.push({
      type: 'rod-of-poopdom',
      x: spawn.x,
      y: spawn.y,
      w: ROD_OF_POOPDOM_PICKUP_SIZE,
      h: ROD_OF_POOPDOM_PICKUP_SIZE,
      sprite: '🪄',
    })
  }'''
)

# 11. tryFire routing
content = content.replace(
'''  _tryFire() {
    if (this.runner.plunger) {''',
'''  _tryFire() {
    if (this.runner.rod) {
      this._tryTeleport()
      return
    }

    if (this.runner.plunger) {'''
)

# 12. _tryTeleport implementation
content = content.replace(
'''  _tryShartKnocker() {''',
'''  _tryTeleport() {
    if (this.stinkyTimer > 0) return

    let targetX = this.pointerPos.x
    let targetY = this.pointerPos.y
    const dx = targetX - (this.runner.x + this.runner.w / 2)
    const dy = targetY - (this.runner.y + this.runner.h / 2)
    const dist = Math.hypot(dx, dy)

    let finalDx = dx
    let finalDy = dy
    
    // Default fallback if pointer is not set (e.g. mobile joystick initial)
    if (targetX === 0 && targetY === 0) {
      finalDx = this.runner.facing.x * ROD_OF_POOPDOM_RANGE
      finalDy = this.runner.facing.y * ROD_OF_POOPDOM_RANGE
    } else if (dist > ROD_OF_POOPDOM_RANGE) {
      finalDx = (dx / dist) * ROD_OF_POOPDOM_RANGE
      finalDy = (dy / dist) * ROD_OF_POOPDOM_RANGE
    }

    let finalX = this.runner.x + this.runner.w / 2 + finalDx
    let finalY = this.runner.y + this.runner.h / 2 + finalDy

    // Collision check
    const testRect = { x: finalX - this.runner.w / 2, y: finalY - this.runner.h / 2, w: this.runner.w, h: this.runner.h }
    if (this._hitsWall(testRect) || finalX < 0 || finalY < 0 || finalX > WORLD.width || finalY > WORLD.height) {
      this.runnerLine = 'Cannot teleport there!'
      this.runnerLineTimer = 1.0
      return
    }

    // Departure smoke effect
    this.smokeEffects = this.smokeEffects || []
    for (let i = 0; i < 8; i++) {
      this.smokeEffects.push({
        x: this.runner.x + this.runner.w / 2 + (Math.random() - 0.5) * 30,
        y: this.runner.y + this.runner.h / 2 + (Math.random() - 0.5) * 30,
        age: 0,
        life: 0.5 + Math.random() * 0.5,
        r: 10 + Math.random() * 15
      })
    }

    // Do teleport
    this.runner.x = testRect.x
    this.runner.y = testRect.y
    this.stinkyTimer = ROD_OF_POOPDOM_COOLDOWN
  }

  _tryShartKnocker() {'''
)

# 13. HUD updates
content = content.replace(
'''    if (this.runner.gun || this.runner.plunger || this.shartCharge > 0) {''',
'''    if (this.runner.gun || this.runner.plunger || this.runner.rod || this.shartCharge > 0) {'''
)
content = content.replace(
'''      ctx.fillStyle = this.runner.plunger ? '#8b6ad1' : (this.shartCharge > 0 ? '#ff5500' : '#ffd27a')''',
'''      ctx.fillStyle = this.runner.rod ? (this.stinkyTimer > 0 ? '#555555' : '#8b5a2b') : (this.runner.plunger ? '#8b6ad1' : (this.shartCharge > 0 ? '#ff5500' : '#ffd27a'))'''
)
content = content.replace(
'''      ctx.fillText(this.runner.plunger ? 'SWING' : (this.shartCharge > 0 ? 'FART' : 'FIRE'), f.x, f.y)''',
'''      ctx.fillText(this.runner.rod ? (this.stinkyTimer > 0 ? Math.ceil(this.stinkyTimer) + 's' : 'WARP') : (this.runner.plunger ? 'SWING' : (this.shartCharge > 0 ? 'FART' : 'FIRE')), f.x, f.y)'''
)

# Stinky debuff effect indicator
content = content.replace(
'''    if (this.runner.plunger) {
      ctx.fillStyle = '#8b6ad1'
      ctx.font = 'bold 20px sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillText(`🪠 SWINGS: ${this.runner.plunger.swings}`, 10, 64)
    }''',
'''    if (this.runner.plunger) {
      ctx.fillStyle = '#8b6ad1'
      ctx.font = 'bold 20px sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillText(`🪠 SWINGS: ${this.runner.plunger.swings}`, 10, 64)
    } else if (this.runner.rod) {
      ctx.fillStyle = this.stinkyTimer > 0 ? '#999999' : '#8b5a2b'
      ctx.font = 'bold 20px sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      const status = this.stinkyTimer > 0 ? `STINKY: ${Math.ceil(this.stinkyTimer)}s` : 'READY'
      ctx.fillText(`🪄 WARP: ${status}`, 10, 64)
    }'''
)


with open('frontend/src/GameEngine.js', 'w') as f:
    f.write(content)

