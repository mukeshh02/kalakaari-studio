import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

$('*').each((i, el) => {
  const t = $(el).clone().children().remove().end().text().trim();
  if (t.includes('content creation') || t.includes('thumbnail design') || t.includes('sidekicks')) {
    console.log(`${i}: <${el.name} class="${$(el).attr('class')}"> data-id="${$(el).attr('data-id')}":`);
    console.log(t);
  }
});
