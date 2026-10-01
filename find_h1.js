import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

console.log("=== H1 ELEMENTS ===");
$('h1').each((i, el) => console.log(i, $(el).text(), $(el).html()));

console.log("=== ELEMENTOR HERO CONTAINER ===");
$('[class*="hero"]').each((i, el) => {
  console.log("HERO CLASS:", $(el).attr('class'));
  console.log("HERO HTML:", $(el).html().substring(0, 300));
});
