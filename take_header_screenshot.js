import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 800 });

  await page.goto('http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded', timeout: 5000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(__dirname, 'dist', 'header_verify_screenshot.png') });
  console.log('Header verification screenshot captured!');

  await browser.close();
})();
