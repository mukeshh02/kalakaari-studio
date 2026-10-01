import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

$('.elementor-heading-title').slice(0, 15).each((i, el) => {
  console.log(`${i+1}: <${el.name}> -> "${$(el).html().trim()}"`);
});
