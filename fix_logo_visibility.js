import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

// Ultra High-Visibility & Sharp Option 2 Logo Component
const sharpLogoHTML = `
<div class="kalakaari-brand-logo" style="display: inline-flex; align-items: center; gap: 12px; text-decoration: none; user-select: none; vertical-align: middle;">
  <span style="font-family: 'Yatra One', cursive; font-size: 2.6rem; font-weight: 700; line-height: 1; color: #FF9B5D; text-shadow: 0 0 14px rgba(255, 155, 93, 0.5), 0 2px 4px rgba(0, 0, 0, 0.9); -webkit-font-smoothing: antialiased;">कलाकारी</span>
  <span style="color: #FB686A; font-size: 1.3rem; font-weight: bold; margin-top: -3px;">•</span>
  <span style="font-family: 'Cinzel Decorative', cursive; font-size: 1.1rem; font-weight: 700; letter-spacing: 5px; color: #FFFFFF; text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8); text-transform: uppercase;">STUDIOS</span>
</div>
`;

// Replace all instances of logo containers
$('.kalakaari-brand-logo').replaceWith(sharpLogoHTML);

// Save updated index.html
fs.writeFileSync(htmlPath, $.html());
console.log("SUCCESS: Logo visibility enhanced with high contrast & text-shadow!");
