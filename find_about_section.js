import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

console.log("=== ABOUT US SECTIONS ===");
$('*:contains("About Us")').each((i, el) => {
  const text = $(el).clone().children().remove().end().text().trim();
  if (text.length > 5 && text.length < 200) {
    console.log(`${i+1}: <${el.name} class="${$(el).attr('class')}"> -> "${text}"`);
  }
});
