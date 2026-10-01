import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

// 1. Add Lottie Web player library to <head> if not present
const lottieScriptTag = `<script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"></script>`;
if (!$('head').html().includes('bodymovin')) {
  $('head').append(lottieScriptTag);
}

// 2. Update data-settings in HTML to point to local ./js/ JSON files
$('.elementor-widget-lottie').each((_, el) => {
  let settings = $(el).attr('data-settings');
  if (settings) {
    settings = settings
      .replace(/https:\\\/\\\/www\.tastyedits\.com\\\/wp-content\\\/uploads\\\/2026\\\/04\\\/1\.-log-in\.json/g, './js/1.-log-in.json')
      .replace(/https:\\\/\\\/www\.tastyedits\.com\\\/wp-content\\\/uploads\\\/2026\\\/04\\\/Place-Your-Order\.json/g, './js/Place-Your-Order.json')
      .replace(/https:\\\/\\\/www\.tastyedits\.com\\\/wp-content\\\/uploads\\\/2026\\\/04\\\/Review\.json/g, './js/Review.json')
      .replace(/https:\\\/\\\/www\.tastyedits\.com\\\/wp-content\\\/uploads\\\/2026\\\/04\\\/2\.json/g, './js/2.json');
    $(el).attr('data-settings', settings);
  }
});

// 3. Inject Lottie initialization script into body
const lottieInitJS = `
<script>
document.addEventListener("DOMContentLoaded", function() {
  function initLottieAnimations() {
    if (typeof lottie === 'undefined') {
      setTimeout(initLottieAnimations, 200);
      return;
    }
    const lottieWidgets = document.querySelectorAll('.elementor-widget-lottie');
    lottieWidgets.forEach(widget => {
      const settingsAttr = widget.getAttribute('data-settings');
      if (!settingsAttr) return;
      try {
        const settings = JSON.parse(settingsAttr);
        let jsonUrl = settings.source_json ? settings.source_json.url : null;
        if (jsonUrl) {
          if (jsonUrl.includes('1.-log-in')) jsonUrl = './js/1.-log-in.json';
          else if (jsonUrl.includes('Place-Your-Order')) jsonUrl = './js/Place-Your-Order.json';
          else if (jsonUrl.includes('Review')) jsonUrl = './js/Review.json';
          else if (jsonUrl.includes('2.json')) jsonUrl = './js/2.json';

          const container = widget.querySelector('.e-lottie__animation') || widget.querySelector('.e-lottie__container') || widget;
          if (container && !container.getAttribute('data-lottie-loaded')) {
            container.setAttribute('data-lottie-loaded', 'true');
            container.innerHTML = '';
            lottie.loadAnimation({
              container: container,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              path: jsonUrl
            });
          }
        }
      } catch(e) {
        console.error("Lottie load error:", e);
      }
    });
  }

  initLottieAnimations();
  setTimeout(initLottieAnimations, 1000);
  setTimeout(initLottieAnimations, 3000);
});
</script>
`;

if (!$.html().includes('initLottieAnimations')) {
  $('body').append(lottieInitJS);
}

fs.writeFileSync(htmlPath, $.html());
console.log("SUCCESS: Fixed Lottie animations to play local JSON files seamlessly!");
