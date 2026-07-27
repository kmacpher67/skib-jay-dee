import { test, expect } from '@playwright/test';

test.describe('Rod of Poopdom', () => {
  test('second teleport works after cooldown', async ({ page }) => {
    await page.goto('/');

    // Start a game and skip intro
    await page.getByRole('button', { name: 'QUICK PLAY' }).click();
    await expect(page.locator('canvas')).toBeVisible();
    await page.waitForFunction(() => window.__skibEngine && window.__skibEngine.phase === 'chase');
    
    // Give runner the rod
    await page.evaluate(() => {
      window.__skibEngine.runner.rod = true;
      // move runner to center to ensure safe warp distance
      window.__skibEngine.runner.facing = { x: 0, y: 1 };
      window.__skibEngine.runner.x = 400;
      window.__skibEngine.runner.y = 400;
    });

    const getRunnerPos = async () => {
      return await page.evaluate(() => {
        return {
          x: window.__skibEngine.runner.x,
          y: window.__skibEngine.runner.y
        };
      });
    };

    const initialPos = await getRunnerPos();

    // First warp
    await page.evaluate(() => window.__skibEngine._tryFire());
    
    // Give engine a tick to process
    await page.waitForTimeout(100);

    const posAfterFirstWarp = await getRunnerPos();
    // Distance should be ~300 (ROD_OF_POOPDOM_RANGE)
    const dist1 = Math.hypot(posAfterFirstWarp.x - initialPos.x, posAfterFirstWarp.y - initialPos.y);
    expect(dist1).toBeGreaterThan(250);
    expect(dist1).toBeLessThan(350);

    // Button should now show cooldown, but since it's on canvas, we'll check engine state
    const stinkyTimer1 = await page.evaluate(() => window.__skibEngine.stinkyTimer);
    expect(stinkyTimer1).toBeGreaterThan(0);

    // Attempting to warp during cooldown should fail
    await page.evaluate(() => window.__skibEngine._tryFire());
    await page.waitForTimeout(100);
    const posDuringCooldown = await getRunnerPos();
    expect(posDuringCooldown.x).toBeCloseTo(posAfterFirstWarp.x, -1); // might drift slightly due to speed/chase, but no warp
    expect(posDuringCooldown.y).toBeCloseTo(posAfterFirstWarp.y, -1);

    // Wait for cooldown to expire (> 3s in game time)
    // To speed up test, manipulate engine timer directly
    await page.evaluate(() => {
      window.__skibEngine.stinkyTimer = 0;
      // realign facing so we don't warp into a wall
      window.__skibEngine.runner.facing = { x: 0, y: 1 };
      window.__skibEngine.runner.x = 400;
      window.__skibEngine.runner.y = 400;
    });

    // We might need to wait for a tick/render
    await page.waitForTimeout(100);

    const posBeforeSecondWarp = await getRunnerPos();

    // Second warp
    await page.evaluate(() => window.__skibEngine._tryFire());
    await page.waitForTimeout(100);

    const posAfterSecondWarp = await getRunnerPos();
    const dist2 = Math.hypot(posAfterSecondWarp.x - posBeforeSecondWarp.x, posAfterSecondWarp.y - posBeforeSecondWarp.y);
    expect(dist2).toBeGreaterThan(250);
    expect(dist2).toBeLessThan(350);
  });
});
