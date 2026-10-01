import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

console.log("=== HEADINGS FOUND ===");
$('h1, h2, h3, .elementor-heading-title').each((i, el) => {
  console.log(`${i+1}: <${el.name} class="${$(el).attr('class')}"> -> "${$(el).text().trim().replace(/\s+/g, ' ')}"`);
});

console.log("\n=== HERO SECTION CONTAINERS ===");
$('.hero-section, [class*="hero"]').each((i, el) => {
  console.log(`${i+1}: <${el.name} class="${$(el).attr('class')}"> -> ${$(el).text().substring(0, 150).trim().replace(/\s+/g, ' ')}...`);
});
