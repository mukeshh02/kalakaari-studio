import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

const v1 = $('[data-id="0578f3c"]');
const gridContainer = v1.closest('.e-con');
console.log("=== VIDEO GRID PARENT CONTAINER ===");
console.log("CLASS:", gridContainer.attr('class'), "DATA-ID:", gridContainer.attr('data-id'));
console.log("HTML:", gridContainer.html().substring(0, 500));
