import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1200 });
  
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle2' });

  // Screenshot Photo Showcase section
  const photoElem = await page.$('#short-form-video-editing');
  if (photoElem) {
    await photoElem.screenshot({ path: path.join(__dirname, 'dist', 'photos_grid_screenshot.png') });
  }

  await browser.close();
  console.log('Photo grid screenshot captured!');
})();
