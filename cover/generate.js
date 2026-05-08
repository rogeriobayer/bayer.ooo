const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1584, height: 396 },
    deviceScaleFactor: 2, // retina for crisp output
  });

  const htmlPath = path.resolve(__dirname, 'index.html');
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });

  // Wait a tick for fonts to settle
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.resolve(__dirname, 'linkedin-cover.png'),
    fullPage: false,
    type: 'png',
  });

  await browser.close();
  console.log('Cover generated: linkedin-cover.png (1584x396 @2x)');
})();
