import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

console.log("=== PRICING TABS ===");
$('*:contains("Horizontal Videos"), *:contains("Vertical Videos"), *:contains("YouTube Channel Management")').each((i, el) => {
  const text = $(el).clone().children().remove().end().text().trim();
  if (text.length > 2 && text.length < 50) {
    console.log(`${i+1}: <${el.name} class="${$(el).attr('class')}" id="${$(el).attr('id')}"> data-tab="${$(el).attr('data-tab')}": "${text}"`);
  }
});

console.log("\n=== PRICING PACKAGES ===");
$('*:contains("Explore Package"), *:contains("Trending Package"), *:contains("Viral Package")').each((i, el) => {
  const text = $(el).clone().children().remove().end().text().trim();
  if (text.length > 2 && text.length < 50) {
    console.log(`${i+1}: <${el.name} class="${$(el).attr('class')}">: "${text}"`);
  }
});
