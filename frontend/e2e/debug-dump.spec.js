import { test, expect } from '@playwright/test'

test.describe('Debug State Dump', () => {
  test('pressing Q three times copies debug dump', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/')

    // Wait for the menu and start Quick Play (or PLAY AS RUNNER)
    await page.getByRole('button', { name: /PLAY AS RUNNER|QUICK PLAY/i }).first().click()
    
    // Wait for canvas to be visible and game to start
    await page.locator('canvas').waitFor({ state: 'visible' })
    await page.waitForFunction(() => window.__skibEngine && window.__skibEngine.phase !== 'intro')

    // Press Q three times quickly
    await page.keyboard.press('q')
    await page.keyboard.press('q')
    await page.keyboard.press('q')

    // Wait a brief moment for the clipboard to be written
    await page.waitForTimeout(100)

    // Evaluate the same function to ensure it exists
    const dumpFromEngine = await page.evaluate(() => window.__skibEngine.buildDebugDump())
    expect(dumpFromEngine).toBeDefined()
    expect(dumpFromEngine.version).toContain('v0.4.')
    expect(dumpFromEngine.phase).toBeDefined()
    expect(dumpFromEngine.levelName).toBeDefined()
    expect(dumpFromEngine.runner).toBeDefined()
    expect(dumpFromEngine.runner.tile).toBeDefined()

    // Read clipboard content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    const dump = JSON.parse(clipboardText)
    
    expect(dump).toBeDefined()
    expect(dump.version).toBe(dumpFromEngine.version)
    expect(dump.phase).toBe(dumpFromEngine.phase)
    expect(dump.levelName).toBe(dumpFromEngine.levelName)
  })
})
