import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

$('p:contains("About Us")').each((i, el) => {
  const container = $(el).closest('.e-con');
  console.log(`=== ABOUT US CONTAINER ${i+1} ===`);
  console.log(container.html());
});
