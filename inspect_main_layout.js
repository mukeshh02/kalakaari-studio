import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

const mainLayout = $('[data-id="284f8f94"], .switching-layouts-main').first();
console.log("=== MAIN LAYOUT CONTAINER ===");
console.log("CLASS:", mainLayout.attr('class'), "DATA-ID:", mainLayout.attr('data-id'));
console.log("HTML:", mainLayout.html().substring(0, 1000));
