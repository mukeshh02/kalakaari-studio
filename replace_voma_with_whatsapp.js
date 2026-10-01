import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

// 1. Update Main Heading & Subtitle
$('h2:contains("Submit orders in VOMA")').each((_, el) => {
  $(el).text('Simple 3-Step Process on WhatsApp');
});

$('p:contains("Our custom-built platform makes it easy")').each((_, el) => {
  $(el).text('No complex software or portals needed. Connect directly with our Kalakaari Studios team on WhatsApp, send your raw footage, and get your final cinematic video delivered!');
});

// 2. Update Step 1 (Log In -> Connect & Send Details)
$('h3:contains("Log In")').each((_, el) => {
  $(el).text('Connect & Send Details');
  const parent = $(el).closest('.elementor-widget-container, div');
  const siblingP = parent.find('p, span').first();
});

$('*:contains("to VOMA, our custom-tailored")').each((_, el) => {
  if ($(el).children().length === 0) {
    $(el).text('Click \'Start on WhatsApp\', tell us your project requirements, or share your raw footage link (Google Drive, WeTransfer, or Dropbox).');
  }
});

// 3. Update Step 2 (Place Your Order -> Expert Editing & Draft)
$('h3:contains("Place Your Order")').each((_, el) => {
  $(el).text('Expert Editing & Draft');
});

$('*:contains("for horizontal video editing, vertical video editing")').each((_, el) => {
  if ($(el).children().length === 0) {
    $(el).text('Our dedicated editors transform your footage with cinematic color grading, sound design, and custom captions within 24–48 hours.');
  }
});

// 4. Update Step 3 (Review -> Review & Final HD Delivery)
$('h3:contains("Review")').each((_, el) => {
  if ($(el).text().trim() === 'Review') {
    $(el).text('Review & Final HD Delivery');
  }
});

$('*:contains("your deliverables and leave revision notes")').each((_, el) => {
  if ($(el).children().length === 0) {
    $(el).text('Review your draft directly on WhatsApp. We provide free revisions until you\'re 100% satisfied, then deliver your final HD master file!');
  }
});

// 5. Replace Left Lottie Box with interactive WhatsApp Direct Chat Card
const whatsappCardHTML = `
<div class="whatsapp-workflow-card" style="background: #12141a; border: 1px solid #25D366; border-radius: 24px; padding: 28px 24px; width: 100%; max-width: 440px; margin: 0 auto; box-shadow: 0 15px 40px rgba(37, 211, 102, 0.15); font-family: 'Poppins', sans-serif;">
  <!-- Header -->
  <div style="display: flex; align-items: center; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid #232733; margin-bottom: 20px;">
    <div style="width: 46px; height: 46px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; color: #fff;">
      <svg width="26" height="26" fill="#fff" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
    </div>
    <div>
      <div style="color: #fff; font-weight: 700; font-size: 1.05rem;">Kalakaari Studios</div>
      <div style="color: #25D366; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 5px;">
        <span style="width: 8px; height: 8px; background: #25D366; border-radius: 50%; display: inline-block;"></span> Active Online on WhatsApp
      </div>
    </div>
  </div>

  <!-- Chat Bubbles -->
  <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
    <div style="align-self: flex-start; background: #1c202b; color: #e5e7eb; padding: 12px 16px; border-radius: 16px 16px 16px 4px; max-width: 85%; font-size: 0.9rem; line-height: 1.4; border: 1px solid #2b2f3d;">
      Hi! I have raw wedding footage for editing 🎥
    </div>
    <div style="align-self: flex-end; background: #075E54; color: #fff; padding: 12px 16px; border-radius: 16px 16px 4px 16px; max-width: 85%; font-size: 0.9rem; line-height: 1.4;">
      Welcome to Kalakaari Studios! Share your Google Drive link here & we'll start right away ⚡
    </div>
    <div style="align-self: flex-start; background: #1c202b; color: #25D366; padding: 12px 16px; border-radius: 16px 16px 16px 4px; max-width: 85%; font-size: 0.9rem; font-weight: 600; border: 1px solid #25D366;">
      🎬 First Draft Ready! Check your HD Preview Link
    </div>
  </div>

  <!-- Big WhatsApp CTA -->
  <a href="https://wa.me/?text=Hi%20Kalakaari%20Studios%2C%20I%20want%20to%20start%20a%20video%20editing%20project" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 16px; background: #25D366; color: #ffffff; font-weight: 700; border-radius: 14px; text-decoration: none; font-size: 1.05rem; box-shadow: 0 8px 20px rgba(37, 211, 102, 0.3); transition: transform 0.2s;">
    START ON WHATSAPP 💬
  </a>
</div>
`;

// Replace the left column container containing lottie widget
$('[class*="switching-layouts-main"], .elementor-element-284f8f94').each((_, el) => {
  const leftCol = $(el).find('.elementor-element-17906365, .e-child').first();
  if (leftCol.length > 0) {
    leftCol.html(whatsappCardHTML);
  }
});

fs.writeFileSync(htmlPath, $.html());
console.log("SUCCESS: Transformed section into 100% Direct WhatsApp Workflow!");
