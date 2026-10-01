import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

const pricingHTML = `
<div class="kalakaari-pricing-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(310px, 1fr)); gap: 28px; width: 100%; max-width: 1150px; margin: 40px auto 20px auto; font-family: 'Poppins', sans-serif;">

  <!-- CARD 1: STARTER -->
  <div class="pricing-card" style="background: #12141a; border: 1px solid #232733; border-radius: 20px; padding: 36px 28px; display: flex; flex-direction: column; justify-content: space-between; position: relative; transition: all 0.3s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <div>
      <div style="color: #FB686A; font-size: 0.8rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">FOR CREATORS</div>
      <h3 style="font-size: 2.2rem; font-weight: 800; color: #ffffff; margin-bottom: 15px;">Starter</h3>
      <div style="display: flex; align-items: baseline; margin-bottom: 16px;">
        <span style="font-size: 2.5rem; font-weight: 800; color: #FB686A;">₹2,999</span>
        <span style="color: #9ca3af; font-size: 0.95rem; margin-left: 8px;">/ project</span>
      </div>
      <p style="color: #9ca3af; font-size: 0.95rem; line-height: 1.5; margin-bottom: 25px; min-height: 45px;">Best for short-form content creators posting reels, shorts, and stories.</p>
      
      <div style="border-top: 1px solid #232733; padding-top: 20px; margin-bottom: 30px;">
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px;">
          <li style="display: flex; align-items: center; color: #e5e7eb; font-size: 0.95rem;"><span style="color: #FB686A; font-weight: bold; margin-right: 10px;">✓</span> 1 Reel / Short edit (up to 90 sec)</li>
          <li style="display: flex; align-items: center; color: #e5e7eb; font-size: 0.95rem;"><span style="color: #FB686A; font-weight: bold; margin-right: 10px;">✓</span> Basic colour grading</li>
          <li style="display: flex; align-items: center; color: #e5e7eb; font-size: 0.95rem;"><span style="color: #FB686A; font-weight: bold; margin-right: 10px;">✓</span> Captions & text overlays</li>
          <li style="display: flex; align-items: center; color: #e5e7eb; font-size: 0.95rem;"><span style="color: #FB686A; font-weight: bold; margin-right: 10px;">✓</span> 2 revisions included</li>
          <li style="display: flex; align-items: center; color: #e5e7eb; font-size: 0.95rem;"><span style="color: #FB686A; font-weight: bold; margin-right: 10px;">✓</span> 48-hour delivery</li>
        </ul>
      </div>
    </div>
    <a href="https://wa.me/?text=Hi%20Kalakaari%20Studios%2C%20I%20want%20to%20discuss%20the%20Starter%20Package%20(Rs.2999)" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 15px; background: #25D366; color: #ffffff; font-weight: 700; border-radius: 12px; text-decoration: none; font-size: 1rem; transition: opacity 0.2s;">
      <svg width="22" height="22" fill="#fff" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
      WHATSAPP TO DISCUSS
    </a>
  </div>

  <!-- CARD 2: PRO (MOST POPULAR) -->
  <div class="pricing-card" style="background: #161922; border: 2px solid #FF9B5D; border-radius: 20px; padding: 40px 28px 36px 28px; display: flex; flex-direction: column; justify-content: space-between; position: relative; transition: all 0.3s ease; box-shadow: 0 15px 40px rgba(255, 155, 93, 0.22); transform: scale(1.02);">
    <div style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: linear-gradient(90deg, #FB686A, #FF9B5D); color: #0c0d10; padding: 5px 18px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">MOST POPULAR</div>
    <div>
      <div style="color: #FF9B5D; font-size: 0.8rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; margin-top: 5px;">FOR YOUTUBERS</div>
      <h3 style="font-size: 2.4rem; font-weight: 800; color: #ffffff; margin-bottom: 15px;">Pro</h3>
      <div style="display: flex; align-items: baseline; margin-bottom: 16px;">
        <span style="font-size: 2.7rem; font-weight: 800; color: #FF9B5D;">₹6,999</span>
        <span style="color: #9ca3af; font-size: 0.95rem; margin-left: 8px;">/ project</span>
      </div>
      <p style="color: #9ca3af; font-size: 0.95rem; line-height: 1.5; margin-bottom: 25px; min-height: 45px;">Everything a YouTuber needs — cinematic long-form video that keeps viewers watching.</p>
      
      <div style="border-top: 1px solid #2b2f3d; padding-top: 20px; margin-bottom: 30px;">
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px;">
          <li style="display: flex; align-items: center; color: #e5e7eb; font-size: 0.95rem;"><span style="color: #FF9B5D; font-weight: bold; margin-right: 10px;">✓</span> 1 long-form video (up to 30 min)</li>
          <li style="display: flex; align-items: center; color: #e5e7eb; font-size: 0.95rem;"><span style="color: #FF9B5D; font-weight: bold; margin-right: 10px;">✓</span> Full colour grading & sound design</li>
          <li style="display: flex; align-items: center; color: #e5e7eb; font-size: 0.95rem;"><span style="color: #FF9B5D; font-weight: bold; margin-right: 10px;">✓</span> Thumbnail design included</li>
          <li style="display: flex; align-items: center; color: #e5e7eb; font-size: 0.95rem;"><span style="color: #FF9B5D; font-weight: bold; margin-right: 10px;">✓</span> Intro / Outro sequence</li>
          <li style="display: flex; align-items: center; color: #e5e7eb; font-size: 0.95rem;"><span style="color: #FF9B5D; font-weight: bold; margin-right: 10px;">✓</span> 2 revisions included</li>
          <li style="display: flex; align-items: center; color: #e5e7eb; font-size: 0.95rem;"><span style="color: #FF9B5D; font-weight: bold; margin-right: 10px;">✓</span> 48-hour first draft</li>
        </ul>
      </div>
    </div>
    <a href="https://wa.me/?text=Hi%20Kalakaari%20Studios%2C%20I%20want%20to%20discuss%20the%20Pro%20Package%20(Rs.6999)" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 15px; background: #25D366; color: #ffffff; font-weight: 700; border-radius: 12px; text-decoration: none; font-size: 1rem; transition: opacity 0.2s;">
      <svg width="22" height="22" fill="#fff" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
      WHATSAPP TO DISCUSS
    </a>
  </div>

  <!-- CARD 3: STUDIO -->
  <div class="pricing-card" style="background: #12141a; border: 1px solid #232733; border-radius: 20px; padding: 36px 28px; display: flex; flex-direction: column; justify-content: space-between; position: relative; transition: all 0.3s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <div>
      <div style="color: #FB686A; font-size: 0.8rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">FOR BRANDS</div>
      <h3 style="font-size: 2.2rem; font-weight: 800; color: #ffffff; margin-bottom: 15px;">Studio</h3>
      <div style="display: flex; align-items: baseline; margin-bottom: 16px;">
        <span style="font-size: 2.5rem; font-weight: 800; color: #FB686A;">₹12,999</span>
        <span style="color: #9ca3af; font-size: 0.95rem; margin-left: 8px;">/ project</span>
      </div>
      <p style="color: #9ca3af; font-size: 0.95rem; line-height: 1.5; margin-bottom: 25px; min-height: 45px;">Full cinematic treatment for brands that demand standout visual content.</p>
      
      <div style="border-top: 1px solid #232733; padding-top: 20px; margin-bottom: 30px;">
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px;">
          <li style="display: flex; align-items: center; color: #e5e7eb; font-size: 0.95rem;"><span style="color: #FB686A; font-weight: bold; margin-right: 10px;">✓</span> 2 long-form videos OR 5 reels</li>
          <li style="display: flex; align-items: center; color: #e5e7eb; font-size: 0.95rem;"><span style="color: #FB686A; font-weight: bold; margin-right: 10px;">✓</span> Full cinematic colour treatment</li>
          <li style="display: flex; align-items: center; color: #e5e7eb; font-size: 0.95rem;"><span style="color: #FB686A; font-weight: bold; margin-right: 10px;">✓</span> Custom motion graphics</li>
          <li style="display: flex; align-items: center; color: #e5e7eb; font-size: 0.95rem;"><span style="color: #FB686A; font-weight: bold; margin-right: 10px;">✓</span> Dedicated editor assigned</li>
          <li style="display: flex; align-items: center; color: #e5e7eb; font-size: 0.95rem;"><span style="color: #FB686A; font-weight: bold; margin-right: 10px;">✓</span> Priority 24-hour delivery</li>
          <li style="display: flex; align-items: center; color: #e5e7eb; font-size: 0.95rem;"><span style="color: #FB686A; font-weight: bold; margin-right: 10px;">✓</span> 2 revisions included</li>
        </ul>
      </div>
    </div>
    <a href="https://wa.me/?text=Hi%20Kalakaari%20Studios%2C%20I%20want%20to%20discuss%20the%20Studio%20Package%20(Rs.12999)" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 15px; background: #25D366; color: #ffffff; font-weight: 700; border-radius: 12px; text-decoration: none; font-size: 1rem; transition: opacity 0.2s;">
      <svg width="22" height="22" fill="#fff" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
      WHATSAPP TO DISCUSS
    </a>
  </div>

</div>
`;

// Replace tab content with the new 3-card pricing grid
$('#e-n-tab-content-978171711').html(pricingHTML);

fs.writeFileSync(htmlPath, $.html());
console.log("SUCCESS: Replaced pricing packages with Starter, Pro, and Studio Indian Rupees packages!");
