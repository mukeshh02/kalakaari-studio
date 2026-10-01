import scrape from 'website-scraper';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

class HeaderPlugin {
  apply(registerAction) {
    registerAction('beforeRequest', ({ requestOptions }) => {
      requestOptions.headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      };
      return { requestOptions };
    });
  }
}

const options = {
  urls: ['https://www.tastyedits.com/'],
  directory: distDir,
  urlFilter: (url) => url.includes('tastyedits.com') || url.includes('gmpg.org'),
  subdirectories: [
    { directory: 'img', extensions: ['.jpg', '.jpeg', '.png', '.svg', '.webp', '.gif', '.ico'] },
    { directory: 'js', extensions: ['.js'] },
    { directory: 'css', extensions: ['.css'] },
    { directory: 'fonts', extensions: ['.woff', '.woff2', '.ttf', '.eot'] }
  ],
  plugins: [ new HeaderPlugin() ]
};

console.log("Starting full site download...");
scrape(options)
  .then((result) => {
    console.log(`SUCCESS: Cloned site with ${result.length} files into dist directory.`);
  })
  .catch((err) => {
    console.error("Scrape error:", err);
  });
