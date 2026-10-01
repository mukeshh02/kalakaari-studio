import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

const h1 = $('h1').first();
const heroCol = h1.closest('.e-con');
console.log("=== HERO COLUMN CONTAINER HTML ===");
console.log(heroCol.html());
