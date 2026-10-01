import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

console.log("=== FIRST 20 TEXT NODES IN BODY ===");
$('body *').each((i, el) => {
  const text = $(el).clone().children().remove().end().text().trim();
  if (text.length > 15) {
    console.log(`<${el.name} class="${$(el).attr('class') || ''}"> -> "${text.replace(/\s+/g, ' ')}"`);
  }
});
