import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

console.log("=== VOMA / HOW IT WORKS SECTION ===");
$('*:contains("Submit orders in VOMA"), *:contains("custom-built platform"), *:contains("Log In")').each((i, el) => {
  const t = $(el).clone().children().remove().end().text().trim();
  if (t.length > 5 && t.length < 200) {
    console.log(`${i+1}: <${el.name} class="${$(el).attr('class')}" data-id="${$(el).attr('data-id')}">: "${t}"`);
  }
});
