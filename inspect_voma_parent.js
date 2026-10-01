import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

const h2 = $('h2:contains("Submit orders in VOMA")').first();
const container = h2.closest('.e-con-parent, .e-con');
console.log("=== VOMA PARENT CONTAINER HTML ===");
console.log("CLASS:", container.attr('class'), "DATA-ID:", container.attr('data-id'));
console.log("HTML:", container.html().substring(0, 1000));
