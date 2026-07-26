const { chromium } = require('playwright');
const { spawn } = require('child_process');

(async () => {
  console.log('Starting preview server...');
  const server = spawn('npm', ['run', 'preview'], { cwd: __dirname });
  
  // Wait for server to start
  await new Promise(r => setTimeout(r, 2000));

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err));

  console.log('Navigating to app...');
  await page.goto('http://localhost:4173');
  
  console.log('Clicking play...');
  await page.click('.play-btn');
  
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
  server.kill();
  process.exit(0);
})();
