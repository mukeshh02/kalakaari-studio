import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

console.log("=== LOTTIE & ANIMATION WIDGETS ===");
$('[data-widget_type*="lottie"], [class*="lottie"], [data-settings*="json"]').each((i, el) => {
  console.log(`${i+1}: CLASS: "${$(el).attr('class')}" DATA-ID: "${$(el).attr('data-id')}"`);
  console.log("DATA-SETTINGS:", $(el).attr('data-settings'));
  console.log("HTML:", $(el).html().substring(0, 300));
});

console.log("\n=== HOW IT WORKS CONTAINER ===");
$('*:contains("How it works"), *:contains("Log In"), *:contains("Place Your Order")').each((i, el) => {
  const c = $(el).closest('.e-con');
  if (c.length > 0) {
    console.log(`CONTAINER CLASS: "${c.attr('class')}" DATA-ID: "${c.attr('data-id')}"`);
  }
});
