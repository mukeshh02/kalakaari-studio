import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

console.log("=== VIDEO WIDGETS & CONTAINERS ===");
$('.elementor-widget-video, [data-widget_type="video.default"], .elementor-fit-aspect-ratio').each((i, el) => {
  console.log(`${i+1}: CLASS: "${$(el).attr('class')}" | DATA-ID: "${$(el).attr('data-id')}"`);
  console.log("HTML:", $(el).html().substring(0, 300));
});

console.log("\n=== LOOP GRID OR GALLERY WIDGETS ===");
$('[class*="loop-grid"], [class*="gallery"], [class*="grid"]').each((i, el) => {
  const c = $(el).attr('class');
  if (c.includes('grid') || c.includes('gallery') || c.includes('video')) {
    console.log(`CLASS: "${c}" | DATA-ID: "${$(el).attr('data-id')}"`);
  }
});
