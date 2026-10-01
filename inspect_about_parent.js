import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

const el = $('[data-id="5bd07eb"]').parent();
console.log("=== ABOUT SECTION PARENT CONTAINER HTML ===");
console.log(el.html());
