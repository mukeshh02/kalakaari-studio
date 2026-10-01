import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');

const dirs = {
  css: path.join(distDir, 'css'),
  js: path.join(distDir, 'js'),
  img: path.join(distDir, 'img'),
  fonts: path.join(distDir, 'fonts')
};

// Ensure directories exist
Object.values(dirs).forEach(dir => fs.mkdirSync(dir, { recursive: true }));

const BASE_URL = 'https://www.tastyedits.com';
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
};

async function downloadFile(url, destPath) {
  try {
    const response = await axios({
      method: 'get',
      url,
      responseType: 'arraybuffer',
      headers: { 'User-Agent': headers['User-Agent'] },
      timeout: 15000
    });
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, response.data);
    console.log(`[Downloaded] ${url} -> ${path.relative(distDir, destPath)}`);
    return true;
  } catch (err) {
    console.warn(`[Failed] ${url} (${err.message})`);
    return false;
  }
}

function resolveUrl(urlStr) {
  if (!urlStr || urlStr.startsWith('data:')) return null;
  try {
    return new URL(urlStr, BASE_URL).href;
  } catch (e) {
    return null;
  }
}

function getFilename(urlStr, prefix = '') {
  try {
    const u = new URL(urlStr);
    let pathname = u.pathname;
    let base = path.basename(pathname);
    if (!base || base.indexOf('.') === -1) {
      base = (prefix || 'file') + '_' + Math.random().toString(36).substring(2, 8);
    }
    // Clean query parameters from base name
    base = base.split('?')[0].split('#')[0];
    return base;
  } catch (e) {
    return (prefix || 'file') + '_' + Math.random().toString(36).substring(2, 8);
  }
}

async function startCloning() {
  console.log(`Fetching HTML from ${BASE_URL}...`);
  const response = await axios.get(BASE_URL, { headers });
  let html = response.data;
  const $ = cheerio.load(html);

  const downloadQueue = [];
  const urlMap = new Map(); // originalUrl -> localRelativePath

  // 1. Process Stylesheets
  const styleLinks = $('link[rel="stylesheet"]').toArray();
  for (const el of styleLinks) {
    const href = $(el).attr('href');
    const fullUrl = resolveUrl(href);
    if (fullUrl) {
      const fileName = getFilename(fullUrl, 'style');
      const localPath = path.join(dirs.css, fileName);
      const relPath = `./css/${fileName}`;
      $(el).attr('href', relPath);
      if (!urlMap.has(fullUrl)) {
        urlMap.set(fullUrl, localPath);
        downloadQueue.push(downloadFile(fullUrl, localPath));
      }
    }
  }

  // 2. Process JS Scripts
  const scripts = $('script[src]').toArray();
  for (const el of scripts) {
    const src = $(el).attr('src');
    const fullUrl = resolveUrl(src);
    if (fullUrl) {
      const fileName = getFilename(fullUrl, 'script');
      const localPath = path.join(dirs.js, fileName);
      const relPath = `./js/${fileName}`;
      $(el).attr('src', relPath);
      if (!urlMap.has(fullUrl)) {
        urlMap.set(fullUrl, localPath);
        downloadQueue.push(downloadFile(fullUrl, localPath));
      }
    }
  }

  // 3. Process Images (img src, data-src, srcset)
  const imgs = $('img').toArray();
  for (const el of imgs) {
    const src = $(el).attr('src');
    const fullUrl = resolveUrl(src);
    if (fullUrl) {
      const fileName = getFilename(fullUrl, 'img');
      const localPath = path.join(dirs.img, fileName);
      const relPath = `./img/${fileName}`;
      $(el).attr('src', relPath);
      if ($(el).attr('srcset')) $(el).removeAttr('srcset'); // Remove responsive srcset for clean local load
      if ($(el).attr('data-src')) $(el).attr('data-src', relPath);
      if (!urlMap.has(fullUrl)) {
        urlMap.set(fullUrl, localPath);
        downloadQueue.push(downloadFile(fullUrl, localPath));
      }
    }
  }

  // 4. Process Favicon & Preload Fonts / Images
  const preloads = $('link[rel="preload"], link[rel="icon"], link[rel="apple-touch-icon"]').toArray();
  for (const el of preloads) {
    const href = $(el).attr('href');
    const fullUrl = resolveUrl(href);
    if (fullUrl) {
      const as = $(el).attr('as');
      let targetDir = dirs.img;
      let relPrefix = './img/';
      if (as === 'font' || fullUrl.endsWith('.woff2') || fullUrl.endsWith('.woff')) {
        targetDir = dirs.fonts;
        relPrefix = './fonts/';
      } else if (as === 'style' || fullUrl.endsWith('.css')) {
        targetDir = dirs.css;
        relPrefix = './css/';
      }

      const fileName = getFilename(fullUrl, 'asset');
      const localPath = path.join(targetDir, fileName);
      const relPath = `${relPrefix}${fileName}`;
      $(el).attr('href', relPath);
      if (!urlMap.has(fullUrl)) {
        urlMap.set(fullUrl, localPath);
        downloadQueue.push(downloadFile(fullUrl, localPath));
      }
    }
  }

  console.log(`Downloading ${downloadQueue.length} total assets...`);
  await Promise.all(downloadQueue);

  // Write updated index.html
  const finalHtml = $.html();
  fs.writeFileSync(path.join(distDir, 'index.html'), finalHtml);
  console.log(`SUCCESS! TastyEdits cloned completely into ${distDir}`);
}

startCloning().catch(err => {
  console.error("Cloning failed:", err);
});
