import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

const fixed3StepsHTML = `
<div class="elementor-element elementor-element-284f8f94 e-con-full switching-layouts-main e-flex e-con e-child" data-id="284f8f94" data-element_type="container" style="width: 100%; max-width: 1150px; margin: 40px auto; font-family: 'Poppins', sans-serif;">

  <!-- 3 Steps Grid (Fixed 3 Columns Side-by-Side) -->
  <div class="steps-3-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; width: 100%; margin-bottom: 45px;">
    
    <!-- Step 1 -->
    <div class="step-card" style="background: #12141a; border: 1px solid #232733; border-radius: 20px; padding: 36px 24px; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <div style="width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #FB686A, #FF9B5D); color: #0c0d10; font-size: 1.4rem; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; box-shadow: 0 8px 20px rgba(251, 104, 106, 0.35);">1</div>
      <h3 style="font-size: 1.2rem; font-weight: 700; color: #ffffff; margin-bottom: 12px;">Connect & Send Details</h3>
      <p style="color: #9ca3af; font-size: 0.9rem; line-height: 1.55;">Click 'Start on WhatsApp', tell us your project requirements, or share your raw footage link (Google Drive, WeTransfer, or Dropbox).</p>
    </div>

    <!-- Step 2 -->
    <div class="step-card" style="background: #12141a; border: 1px solid #232733; border-radius: 20px; padding: 36px 24px; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <div style="width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #FB686A, #FF9B5D); color: #0c0d10; font-size: 1.4rem; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; box-shadow: 0 8px 20px rgba(251, 104, 106, 0.35);">2</div>
      <h3 style="font-size: 1.2rem; font-weight: 700; color: #ffffff; margin-bottom: 12px;">Expert Editing & Draft</h3>
      <p style="color: #9ca3af; font-size: 0.9rem; line-height: 1.55;">Our dedicated editors transform your footage with cinematic color grading, sound design, and custom captions within 24–48 hours.</p>
    </div>

    <!-- Step 3 -->
    <div class="step-card" style="background: #12141a; border: 1px solid #232733; border-radius: 20px; padding: 36px 24px; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <div style="width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #FB686A, #FF9B5D); color: #0c0d10; font-size: 1.4rem; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; box-shadow: 0 8px 20px rgba(251, 104, 106, 0.35);">3</div>
      <h3 style="font-size: 1.2rem; font-weight: 700; color: #ffffff; margin-bottom: 12px;">Review & Final HD Delivery</h3>
      <p style="color: #9ca3af; font-size: 0.9rem; line-height: 1.55;">Review your draft directly on WhatsApp. We provide free revisions until you're 100% satisfied, then deliver your final HD master file!</p>
    </div>

  </div>

  <!-- Big Centered WhatsApp Button below all 3 steps -->
  <div style="text-align: center; width: 100%; clear: both;">
    <a href="https://wa.me/?text=Hi%20Kalakaari%20Studios%2C%20I%20want%20to%20start%20a%20video%20editing%20project" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; gap: 12px; padding: 18px 44px; background: #25D366; color: #ffffff; font-weight: 800; border-radius: 50px; text-decoration: none; font-size: 1.15rem; box-shadow: 0 10px 30px rgba(37, 211, 102, 0.35); transition: transform 0.2s ease;">
      <svg width="26" height="26" fill="#fff" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
      START YOUR PROJECT ON WHATSAPP 💬
    </a>
  </div>

</div>
<style>
@media (max-width: 992px) {
  .steps-3-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
`;

$('[data-id="284f8f94"]').replaceWith(fixed3StepsHTML);

fs.writeFileSync(htmlPath, $.html());
console.log("SUCCESS: Fixed 3 steps layout into 1 single horizontal row (Step 1 | Step 2 | Step 3)!");
