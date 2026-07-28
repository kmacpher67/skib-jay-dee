const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err));
  await page.goto('http://127.0.0.1:4173/');
  await page.locator('.play-btn').first().click();
  await page.waitForTimeout(2000);
  await browser.close();
})();
