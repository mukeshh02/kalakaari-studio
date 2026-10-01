import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

console.log("=== CONTACT & FORMS IN INDEX.HTML ===");
$('form, [id*="contact"], [class*="contact"], [id*="form"]').each((i, el) => {
  console.log(`${i+1}: <${el.name} id="${$(el).attr('id')}" class="${$(el).attr('class')}">`);
});
