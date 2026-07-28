import { test, expect } from '@playwright/test'

test.describe('Chaser Beta Mode', () => {
  test('Slice A: Profile callback isolation and zero loadout', async ({ page, context }) => {
    // 1. Seed a profile with stats and a loadout
    await context.addCookies([
      {
        name: 'skib-profile-v1',
        value: encodeURIComponent(JSON.stringify({
          userId: 'test-user',
          label: 'Test User',
          sheebs: 1000,
          highestLevel: 2,
          deaths: 5,
          ownedItems: ['speed-boost-1', 'stamina-boost-1', 'luck-charm'],
          earnedBadges: ['lucky'],
          deathsHistory: [],
          rewardsHistory: []
        })),
        domain: 'localhost',
        path: '/'
      }
    ])

    await page.goto('/')
    
    // Switch to Chaser Beta
    await page.click('button:has-text("PLAY AS CHASER")')
    await page.waitForFunction(() => window.__skibEngine)

    // Force engine into a state where it has a gun pickup and chaser tags runner
    const engineDump = await page.evaluate(() => {
      const engine = window.__skibEngine
      
      // Check loadout is zeroed out
      const loadoutBefore = { ...engine.loadout }
      
      // Trigger callbacks
      engine.onSheebsChange(9999)
      engine.onBadgeEarned('flaming-ass')
      engine.onPickupConsumed('heavy-plunger', 'good')
      engine.onLevelClear({ index: 3 })
      engine.onDeath({ deaths: 10, level: 1 })
      
      return { loadout: loadoutBefore }
    })
    
    expect(engineDump.loadout.speedBonus).toBe(0)
    expect(engineDump.loadout.staminaBonus).toBe(0)
    expect(engineDump.loadout.luckBonus).toBe(0)
    
    // Check cookies hasn't changed
    const cookies = await context.cookies()
    const profileCookie = cookies.find(c => c.name === 'skib-profile-v1')
    const savedProfile = JSON.parse(decodeURIComponent(profileCookie.value))
    
    expect(savedProfile.sheebs).toBe(1000)
    expect(savedProfile.highestLevel).toBe(2)
    expect(savedProfile.deaths).toBe(5)
    expect(savedProfile.earnedBadges).not.toContain('flaming-ass')
  })
  
  test('Slice B: AI Runner Panic Fire, Seek Gun, and Real Win Line', async ({ page }) => {
    await page.goto('/')
    await page.click('button:has-text("PLAY AS CHASER")')
    await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

    const result = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const engine = window.__skibEngine
        
        // 1. Far branch gun seek
        engine.runner.x = engine.level.runnerSpawn.x
        engine.runner.y = engine.level.runnerSpawn.y
        engine.chasers[0].x = engine.runner.x - 300
        engine.chasers[0].y = engine.runner.y
        engine.pickups = [{ type: 'gun', x: engine.runner.x + 200, y: engine.runner.y, size: 28 }]
        
        // Disable wander for test predictability
        engine.runner.aiWanderX = 0
        engine.runner.aiWanderY = 0
        engine.runner.aiWanderTimer = 10
        
        const moveVec = engine._getRunnerEvadeVector(1/60)
        const movesToGun = moveVec.x > 0.5 // Should move strongly rightwards towards gun

        // 2. Panic fire & hit stun
        engine.pickups = []
        engine.runner.gun = { ammo: 1, chambers: 1 }
        engine.fireCooldown = 0
        engine.chasers[0].x = engine.runner.x + 100
        engine.chasers[0].y = engine.runner.y
        
        engine.update(1/60)
        const shotFired = engine.bullets.length > 0
        const tauntUsed = engine.runnerLine !== ''
        
        // Let bullets fly to hit chaser
        let frames = 0
        while (engine.chasers[0].stunnedUntil <= 0 && frames < 60) {
          engine.update(1/60)
          frames++
        }
        const isStunned = engine.chasers[0].stunnedUntil > 0

        // 3. Real capture
        engine.chasers[0].stunnedUntil = 0
        engine.chasers[0].x = engine.runner.x
        engine.chasers[0].y = engine.runner.y
        
        // Allow the collision frame to run
        engine.update(1/60)
        
        resolve({
          movesToGun,
          shotFired,
          isStunned,
          tauntUsed,
          captureLine: engine.captureLine
        })
      })
    })
    
    expect(result.movesToGun).toBe(true)
    expect(result.shotFired).toBe(true)
    expect(result.tauntUsed).toBe(true)
    expect(result.isStunned).toBe(true)
    
    const CHASER_BETA_WIN_LINES = [
      "TAGGED! THE BOWL TAKES IT!",
      "FLUSHED! HUNT COMPLETE!",
      "CAUGHT IN 4K: PORCELAIN VICTORY!",
      "DOWN THE DRAIN! CHASER WINS!",
      "Caught. Sit still and learn something.",
      "Game over. The runner loses, physics wins.",
      "Efficient. Maybe next time, try a harder path."
    ]
    expect(CHASER_BETA_WIN_LINES).toContain(result.captureLine)
    
    // Fast forward phase timer
    await page.evaluate(() => {
      window.__skibEngine.phaseTimer = 0
      window.__skibEngine.update(1/60)
    })
    
    // Verify custom Chaser capture line shows in modal
    await page.waitForSelector('.profile-quote')
    const quoteText = await page.textContent('.profile-quote')
    expect(quoteText).toContain(result.captureLine)
  })
})
