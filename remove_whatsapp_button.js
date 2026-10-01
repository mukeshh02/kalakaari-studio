import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

// Remove the button container under the 3 steps
$('a:contains("START YOUR PROJECT ON WHATSAPP")').parent().remove();

fs.writeFileSync(htmlPath, $.html());
console.log("SUCCESS: Removed START YOUR PROJECT ON WHATSAPP button!");
