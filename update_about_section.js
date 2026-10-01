import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

const targetText = 'Every frame holds a memory, and every shoot tells a story. Kalakaari Studios brings your vision to life through expert video editing, color grading, and creative album design — so your story always lands perfectly.';

// Find and update the About Us heading text
$('.elementor-heading-title').each((_, el) => {
  const text = $(el).text();
  if (text.includes('content creation sidekicks') || text.includes('We’re your content creation')) {
    $(el).text(targetText);
    console.log("Updated About Us section text successfully!");
  }
});

fs.writeFileSync(htmlPath, $.html());
console.log("Saved changes to dist/index.html!");
