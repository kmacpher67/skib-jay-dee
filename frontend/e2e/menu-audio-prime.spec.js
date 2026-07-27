import { test, expect } from '@playwright/test'

// Regression test for the "skreem loop" menu bug: the first pointerdown on
// the menu must silently prime the audio element for the browser's
// autoplay-gesture requirement, then immediately pause it. It must never
// leave the clip playing audibly and looping in the background.
test('menu audio priming stays silent, non-looping, and pauses itself', async ({ page }) => {
  await page.addInitScript(() => {
    window.__audioEvents = []
    window.__audioInstances = {}
    const NativeAudio = window.Audio
    window.Audio = function (src) {
      const instance = new NativeAudio(src)
      if (src) window.__audioInstances[src] = instance
      const origPlay = instance.play.bind(instance)
      const origPause = instance.pause.bind(instance)
      instance.play = (...args) => {
        window.__audioEvents.push({
          src,
          type: 'play',
          loop: instance.loop,
          volume: instance.volume,
        })
        return origPlay(...args).catch(() => {})
      }
      instance.pause = (...args) => {
        window.__audioEvents.push({ src, type: 'pause' })
        return origPause(...args)
      }
      return instance
    }
  })

  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await page.waitForTimeout(300)

  const events = await page.evaluate(() =>
    window.__audioEvents.filter((e) => e.src && e.src.includes('jayden-skreem-loop')),
  )

  const playEvent = events.find((e) => e.type === 'play')
  expect(playEvent, 'menu priming should call play() on the skreem clip').toBeTruthy()
  expect(playEvent.loop).toBe(false)
  expect(playEvent.volume).toBe(0)
  expect(events.some((e) => e.type === 'pause')).toBe(true)

  // The clip must actually be paused shortly after priming, not left
  // looping in the background for the rest of the menu session.
  const stillPlaying = await page.evaluate(() => {
    const src = Object.keys(window.__audioInstances).find((k) => k.includes('jayden-skreem-loop'))
    return src ? !window.__audioInstances[src].paused : false
  })
  expect(stillPlaying).toBe(false)
})
