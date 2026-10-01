import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

// 1. Add Google Fonts for Option 2 (Yatra One & Cinzel Decorative) to <head>
const fontLink = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Yatra+One&display=swap" rel="stylesheet">`;
if (!$('head').html().includes('Cinzel+Decorative')) {
  $('head').append(fontLink);
}

// 2. Define Option 2 Logo Component matching website dark/sunset-orange theme
const logoComponentHTML = `
<div class="kalakaari-brand-logo" style="display: inline-flex; align-items: center; gap: 10px; text-decoration: none; user-select: none;">
  <span style="font-family: 'Yatra One', cursive; font-size: 2.1rem; line-height: 1; background: linear-gradient(90deg, #FB686A, #FF9B5D); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 2px 8px rgba(251, 104, 106, 0.35));">कलाकारी</span>
  <span style="color: #FF9B5D; font-size: 1.1rem;">•</span>
  <span style="font-family: 'Cinzel Decorative', cursive; font-size: 0.95rem; font-weight: 700; letter-spacing: 4px; color: #f3f4f6; text-transform: uppercase;">STUDIOS</span>
</div>
`;

// 3. Replace all site logo images with the new logo component
$('img[src*="kalakaari_logo"], img[src*="Logo_01_White"], img[alt*="tasty edits logo"], img[alt*="Tasty Edits"]').each((_, el) => {
  $(el).replaceWith(logoComponentHTML);
});

// 4. Update website Title & Meta tags
$('title').text('Kalakaari Studios | You Shoot, We Edit');

// Save updated index.html
fs.writeFileSync(htmlPath, $.html());
console.log("SUCCESS: Applied Option 2 (Yatra One + Cinzel Decorative) theme-matched logo across website!");
