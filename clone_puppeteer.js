import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');

const dirs = {
  css: path.join(distDir, 'css'),
  js: path.join(distDir, 'js'),
  img: path.join(distDir, 'img'),
  fonts: path.join(distDir, 'fonts')
};

// Clean dist folder
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
Object.values(dirs).forEach(dir => fs.mkdirSync(dir, { recursive: true }));

function getCategory(url, contentType) {
  if (contentType?.includes('css') || url.includes('.css')) return 'css';
  if (contentType?.includes('javascript') || url.includes('.js')) return 'js';
  if (contentType?.includes('font') || url.match(/\.(woff2?|ttf|eot|otf)(\?.*)?$/i)) return 'fonts';
  if (contentType?.includes('image') || url.match(/\.(png|jpe?g|gif|svg|webp|ico)(\?.*)?$/i)) return 'img';
  return null;
}

function getSanitizedFilename(urlStr, category) {
  try {
    const u = new URL(urlStr);
    let base = path.basename(u.pathname);
    base = base.split('?')[0].split('#')[0];
    if (!base || !base.includes('.')) {
      const ext = category === 'css' ? '.css' : category === 'js' ? '.js' : category === 'img' ? '.png' : '';
      base = `${category}_${Math.random().toString(36).substr(2, 8)}${ext}`;
    }
    return base.replace(/[^a-zA-Z0-9_.-]/g, '_');
  } catch (e) {
    return `${category}_${Math.random().toString(36).substr(2, 8)}`;
  }
}

async function cloneSite() {
  console.log("Launching stealth browser session...");
  const browser = await puppeteer.launch({
    headless: false, // Runs visible window briefly if needed or headless with stealth flags
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1920,1080',
      '--lang=en-US,en'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const assetMap = new Map(); // originalUrl -> relativePath

  page.on('response', async (response) => {
    const url = response.url();
    const status = response.status();
    if (status >= 200 && status < 300) {
      const contentType = response.headers()['content-type'] || '';
      const category = getCategory(url, contentType);
      if (category && !assetMap.has(url)) {
        try {
          const buffer = await response.buffer();
          const fileName = getSanitizedFilename(url, category);
          const savePath = path.join(dirs[category], fileName);
          fs.writeFileSync(savePath, buffer);
          const relPath = `./${category}/${fileName}`;
          assetMap.set(url, relPath);
          console.log(`[Saved ${category.toUpperCase()}] ${fileName}`);
        } catch (e) {}
      }
    }
  });

  console.log("Navigating to https://www.tastyedits.com/ ...");
  await page.goto('https://www.tastyedits.com/', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  // Check if captcha bypass wait is needed
  await new Promise(r => setTimeout(r, 4000));

  console.log("Scrolling page to trigger all lazy-loaded images & scripts...");
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 150);
    });
  });

  await new Promise(r => setTimeout(r, 3000));

  console.log("Extracting full HTML DOM...");
  let html = await page.content();
  await browser.close();

  const $ = cheerio.load(html);

  // Update CSS links
  $('link[rel="stylesheet"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && assetMap.has(href)) {
      $(el).attr('href', assetMap.get(href));
    }
  });

  // Update scripts
  $('script[src]').each((_, el) => {
    const src = $(el).attr('src');
    if (src && assetMap.has(src)) {
      $(el).attr('src', assetMap.get(src));
    }
  });

  // Update images
  $('img').each((_, el) => {
    const src = $(el).attr('src');
    if (src && assetMap.has(src)) {
      $(el).attr('src', assetMap.get(src));
    }
    if ($(el).attr('srcset')) $(el).removeAttr('srcset');
  });

  // Save final index.html
  fs.writeFileSync(path.join(distDir, 'index.html'), $.html());
  console.log(`\n🎉 SUCCESS! TastyEdits cloned completely into: ${distDir}`);
  console.log(`Downloaded ${assetMap.size} asset files (CSS, JS, Images, Fonts).`);
}

cloneSite().catch(err => {
  console.error("Cloning Error:", err);
});
