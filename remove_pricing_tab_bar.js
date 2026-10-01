import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

// Remove the tab heading bar (.e-n-tabs-heading) containing Horizontal Videos / Vertical Videos / YouTube Channel Management
$('.e-n-tabs-heading').remove();

// Also remove any empty container or wrapper above the pricing cards if present
$('.e-n-tabs').removeClass('e-n-tabs');

fs.writeFileSync(htmlPath, $.html());
console.log("SUCCESS: Removed pricing tab bar!");
