import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

const grandparent = $('[data-id="5bd07eb"]').closest('.e-con-full, .e-parent, section');
console.log("=== ABOUT SECTION GRANDPARENT HTML ===");
console.log(grandparent.html());
