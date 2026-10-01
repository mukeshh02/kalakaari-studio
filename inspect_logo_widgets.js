import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

console.log("=== HEADER LOGO ELEMENTS ===");
$('[class*="site-logo"], [class*="custom-logo"], [class*="header"] a, .elementor-widget-theme-site-logo').each((i, el) => {
  console.log(`${i+1}: <${el.name} class="${$(el).attr('class')}"> -> ${$(el).html()}`);
});
