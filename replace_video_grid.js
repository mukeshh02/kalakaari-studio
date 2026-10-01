import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

const newGridHTML = `
<div class="elementor-element elementor-element-96d4604 e-grid e-con-full e-con e-child" data-id="96d4604" data-element_type="container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; width: 100%; margin-top: 30px;">

  <!-- Video 1 -->
  <div class="yt-video-card" style="position: relative; border-radius: 16px; overflow: hidden; background: #12141a; border: 1px solid #232733; aspect-ratio: 16/9; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <div class="yt-thumb-wrapper" onclick="playYtVideo(this, '5I0uO5CRDqU')" style="position: relative; width: 100%; height: 100%; cursor: pointer; background: #000;">
      <img src="https://img.youtube.com/vi/5I0uO5CRDqU/hqdefault.jpg" alt="Ankit & Navjeet Wedding Highlight" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9; transition: transform 0.3s ease;">
      <div class="play-btn" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 68px; height: 48px; background: rgba(255, 0, 0, 0.9); border-radius: 14px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(255, 0, 0, 0.4); transition: transform 0.2s ease;">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#FFF"><path d="M8 5v14l11-7z"/></svg>
      </div>
      <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: linear-gradient(0deg, rgba(0,0,0,0.95), transparent); color: #fff; font-size: 0.95rem; font-weight: 600;">Ankit & Navjeet | Wedding Highlight</div>
    </div>
  </div>

  <!-- Video 2 -->
  <div class="yt-video-card" style="position: relative; border-radius: 16px; overflow: hidden; background: #12141a; border: 1px solid #232733; aspect-ratio: 16/9; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <div class="yt-thumb-wrapper" onclick="playYtVideo(this, 'GtryHGmrr6I')" style="position: relative; width: 100%; height: 100%; cursor: pointer; background: #000;">
      <img src="https://img.youtube.com/vi/GtryHGmrr6I/hqdefault.jpg" alt="Neha & Ashish Wedding Highlight" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9; transition: transform 0.3s ease;">
      <div class="play-btn" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 68px; height: 48px; background: rgba(255, 0, 0, 0.9); border-radius: 14px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(255, 0, 0, 0.4); transition: transform 0.2s ease;">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#FFF"><path d="M8 5v14l11-7z"/></svg>
      </div>
      <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: linear-gradient(0deg, rgba(0,0,0,0.95), transparent); color: #fff; font-size: 0.95rem; font-weight: 600;">Neha & Ashish | Wedding Highlight</div>
    </div>
  </div>

  <!-- Video 3 -->
  <div class="yt-video-card" style="position: relative; border-radius: 16px; overflow: hidden; background: #12141a; border: 1px solid #232733; aspect-ratio: 16/9; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <div class="yt-thumb-wrapper" onclick="playYtVideo(this, '6WzFW9ZD71w')" style="position: relative; width: 100%; height: 100%; cursor: pointer; background: #000;">
      <img src="https://img.youtube.com/vi/6WzFW9ZD71w/hqdefault.jpg" alt="Satyaprakash & Shristhi Wedding Highlight" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9; transition: transform 0.3s ease;">
      <div class="play-btn" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 68px; height: 48px; background: rgba(255, 0, 0, 0.9); border-radius: 14px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(255, 0, 0, 0.4); transition: transform 0.2s ease;">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#FFF"><path d="M8 5v14l11-7z"/></svg>
      </div>
      <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: linear-gradient(0deg, rgba(0,0,0,0.95), transparent); color: #fff; font-size: 0.95rem; font-weight: 600;">Satyaprakash & Shristhi | Wedding Highlight</div>
    </div>
  </div>

  <!-- Video 4 -->
  <div class="yt-video-card" style="position: relative; border-radius: 16px; overflow: hidden; background: #12141a; border: 1px solid #232733; aspect-ratio: 16/9; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <div class="yt-thumb-wrapper" onclick="playYtVideo(this, 'AQOCRrJ_rAo')" style="position: relative; width: 100%; height: 100%; cursor: pointer; background: #000;">
      <img src="https://img.youtube.com/vi/AQOCRrJ_rAo/hqdefault.jpg" alt="Divyansh & Anjali Pre Wedding (Goa)" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9; transition: transform 0.3s ease;">
      <div class="play-btn" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 68px; height: 48px; background: rgba(255, 0, 0, 0.9); border-radius: 14px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(255, 0, 0, 0.4); transition: transform 0.2s ease;">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#FFF"><path d="M8 5v14l11-7z"/></svg>
      </div>
      <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: linear-gradient(0deg, rgba(0,0,0,0.95), transparent); color: #fff; font-size: 0.95rem; font-weight: 600;">Divyansh & Anjali | Pre-Wedding (Goa)</div>
    </div>
  </div>

  <!-- Video 5 -->
  <div class="yt-video-card" style="position: relative; border-radius: 16px; overflow: hidden; background: #12141a; border: 1px solid #232733; aspect-ratio: 16/9; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <div class="yt-thumb-wrapper" onclick="playYtVideo(this, '-KwF59qW_oU')" style="position: relative; width: 100%; height: 100%; cursor: pointer; background: #000;">
      <img src="https://img.youtube.com/vi/-KwF59qW_oU/hqdefault.jpg" alt="Shubham & Archi Prewedding Highlight" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9; transition: transform 0.3s ease;">
      <div class="play-btn" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 68px; height: 48px; background: rgba(255, 0, 0, 0.9); border-radius: 14px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(255, 0, 0, 0.4); transition: transform 0.2s ease;">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#FFF"><path d="M8 5v14l11-7z"/></svg>
      </div>
      <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: linear-gradient(0deg, rgba(0,0,0,0.95), transparent); color: #fff; font-size: 0.95rem; font-weight: 600;">Shubham & Archi | Pre-Wedding Highlight</div>
    </div>
  </div>

  <!-- Video 6 -->
  <div class="yt-video-card" style="position: relative; border-radius: 16px; overflow: hidden; background: #12141a; border: 1px solid #232733; aspect-ratio: 16/9; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <div class="yt-thumb-wrapper" onclick="playYtVideo(this, 'mqjFRM0GYww')" style="position: relative; width: 100%; height: 100%; cursor: pointer; background: #000;">
      <img src="https://img.youtube.com/vi/mqjFRM0GYww/hqdefault.jpg" alt="Narad-Vanita Pre-Wedding Story" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9; transition: transform 0.3s ease;">
      <div class="play-btn" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 68px; height: 48px; background: rgba(255, 0, 0, 0.9); border-radius: 14px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(255, 0, 0, 0.4); transition: transform 0.2s ease;">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#FFF"><path d="M8 5v14l11-7z"/></svg>
      </div>
      <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: linear-gradient(0deg, rgba(0,0,0,0.95), transparent); color: #fff; font-size: 0.95rem; font-weight: 600;">Narad & Vanita | A Love Story Unfolded</div>
    </div>
  </div>

  <script>
  function playYtVideo(wrapper, videoId) {
    const card = wrapper.parentElement;
    card.innerHTML = '<iframe src="https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width: 100%; height: 100%; border: none; border-radius: 16px;"></iframe>';
  }
  </script>
</div>
`;

$('[data-id="96d4604"]').replaceWith(newGridHTML);

fs.writeFileSync(htmlPath, $.html());
console.log("SUCCESS: Replaced video grid with 6 playlist videos and in-page responsive player!");
