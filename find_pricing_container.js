import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

console.log("=== PRICING SECTION CONTAINER ===");
$('[class*="pricing"], *:contains("Explore Package")').each((i, el) => {
  const container = $(el).closest('.e-con');
  console.log(`CLASS: "${container.attr('class')}" DATA-ID: "${container.attr('data-id')}"`);
});
