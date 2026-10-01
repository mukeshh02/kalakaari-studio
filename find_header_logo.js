import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

console.log("=== LOGO & HEADER IMAGES FOUND ===");
$('header img, .elementor-location-header img, [class*="logo"] img, a[href*="tastyedits.com"] img').each((i, el) => {
  console.log(i+1, "TAG:", el.name, "SRC:", $(el).attr('src'), "ALT:", $(el).attr('alt'), "PARENT CLASS:", $(el).parent().attr('class'));
});

console.log("\n=== LOGO LINKS ===");
$('a[href="https://www.tastyedits.com/"]').each((i, el) => {
  console.log(i+1, "LINK HTML:", $(el).html().substring(0, 200));
});
