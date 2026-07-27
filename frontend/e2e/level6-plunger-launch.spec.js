import { test, expect } from '@playwright/test';

test.describe('Level 6: Jaydens Nightmare House', () => {
  test('Plunger Launch pulls the runner toward Skib-Daddy', async ({ page }) => {
    await page.goto('/');
    await page.locator('.play-btn').click();
    await expect(page.locator('canvas')).toBeVisible();

    await page.evaluate(() => {
      return new Promise((resolve) => {
        const check = setInterval(() => {
          if (window.__skibEngine) {
            clearInterval(check)
            resolve()
          }
        }, 10)
      })
    })

    // Evaluate setup to spawn Level 6 and Skib-Daddy
    await page.evaluate(() => {
      const engine = window.__skibEngine;
      engine.levelIndex = 5; // Level 6
      engine._syncLevelState({ resetPositions: true });
      engine.phase = 'chase';
      engine.introTimer = 0;
      
      // Force Skib-Daddy
      engine.chaser.faceId = 'dad-case';
      engine.chaser.chaserType = 'skib-daddy';
      
      // Position them for a clear shot
      engine.runner.x = 100;
      engine.runner.y = 800;
      engine.chaser.x = 100;
      engine.chaser.y = 600;
      
      // Force projectile spawn by making plungerCooldown <= 0
      engine.chaser.plungerCooldown = 0;
    });
    
    // Run update to spawn the projectile
    await page.evaluate(() => {
      window.__skibEngine.update(0.1); // spawns projectile
    });
    
    const projectiles = await page.evaluate(() => window.__skibEngine.chaserProjectiles.length);
    expect(projectiles).toBe(1);
    
    const runnerStart = await page.evaluate(() => ({ x: window.__skibEngine.runner.x, y: window.__skibEngine.runner.y }));
    
    // Teleport projectile to hit the runner
    await page.evaluate(() => {
      const proj = window.__skibEngine.chaserProjectiles[0];
      proj.x = window.__skibEngine.runner.x;
      proj.y = window.__skibEngine.runner.y;
      
      // Clear movement input so they don't walk
      window.__skibEngine.joystick.active = false;
      window.__skibEngine.keys.up = false;
      window.__skibEngine.keys.down = false;
      window.__skibEngine.keys.left = false;
      window.__skibEngine.keys.right = false;
      
      // Process hit
      window.__skibEngine.update(0.1);
    });
    
    // Expect runner to have been pulled towards the chaser (y should decrease since chaser is at y=200)
    const runnerEnd = await page.evaluate(() => ({ x: window.__skibEngine.runner.x, y: window.__skibEngine.runner.y }));
    
    expect(runnerEnd.y).toBeLessThan(runnerStart.y);
  });
});
