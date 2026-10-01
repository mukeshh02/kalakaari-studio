import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

// 1. Update Title
$('title').text('Kalakaari Studios | You Shoot, We Edit');

// 2. Update Hero H1 Headline
const h1Widget = $('.elementor-widget-animated-headline .elementor-widget-container');
if (h1Widget.length > 0) {
  h1Widget.html(`
    <h1 class="elementor-headline elementor-headline-animation-type-clip" style="font-size: 3.8rem; font-weight: 800; line-height: 1.15; margin-bottom: 20px;">
      <span style="background: linear-gradient(90deg, #FB686A, #FF9B5D, #FB686A); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">You Shoot, We Edit</span>
    </h1>
  `);
}

// 3. Update Subtitle Paragraph
const subtitleWidget = $('.elementor-element-43d820f .elementor-widget-container');
if (subtitleWidget.length > 0) {
  subtitleWidget.html(`
    <p class="elementor-heading-title elementor-size-default" style="font-size: 1.25rem; line-height: 1.6; color: #d1d5db; max-width: 680px;">
      Kalakaari Studios is the cutting room behind the camera. We take your raw footage and photographs and shape them into cinematic films, reels, teasers, and designer albums — so the story always lands.
    </p>
  `);
}

fs.writeFileSync(htmlPath, $.html());
console.log("SUCCESS: Hero section updated with Kalakaari Studios branding and headline!");
