import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });

  await page.setRequestInterception(true);
  page.on('request', req => {
    const url = req.url();
    if (url.includes('facebook') || url.includes('google-analytics') || url.includes('vimeo')) {
      req.abort();
    } else {
      req.continue();
    }
  });

  try {
    await page.goto('http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded' });
  } catch (e) {
    console.log('Navigation info:', e.message);
  }

  await new Promise(r => setTimeout(r, 1000));

  // Click on the first card
  console.log('Clicking on the first photo card...');
  await page.evaluate(() => {
    const card = document.querySelector('.elementor-element-d150a99 .elementor-element');
    if (card) card.click();
  });

  // Wait 1.5 seconds for modal animation
  await new Promise(r => setTimeout(r, 1500));

  // Check if modal is visible
  const isModalVisible = await page.evaluate(() => {
    const modal = document.getElementById('pdf-modal-overlay');
    return modal && window.getComputedStyle(modal).display !== 'none';
  });

  console.log('Is PDF Modal visible on the same page?', isModalVisible);

  if (isModalVisible) {
    await page.screenshot({ path: path.join(__dirname, 'dist', 'pdf_modal_screenshot.png') });
    console.log('Modal screenshot captured successfully!');
  }

  await browser.close();
})();
