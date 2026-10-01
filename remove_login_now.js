import fs from 'fs';

let html = fs.readFileSync('dist/index.html', 'utf8');

// 1. Remove all Login button widgets and links
const loginPatterns = [
  /<div[^>]*class="[^"]*elementor-widget-button[^"]*"[^>]*>[\s\S]*?<span[^>]*class="elementor-button-text"[^>]*>\s*Login\s*<\/span>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi,
  /<a[^>]*href="[^"]*authentication\?v=login[^"]*"[^>]*>[\s\S]*?<\/a>/gi,
  /<a[^>]*href="[^"]*voma\.tastyedits\.com\/authentication[^"]*"[^>]*>[\s\S]*?<\/a>/gi
];

let totalRemoved = 0;
loginPatterns.forEach(pattern => {
  html = html.replace(pattern, () => {
    totalRemoved++;
    return '';
  });
});

console.log(`Total Login button elements removed: ${totalRemoved}`);

// 2. Also ensure all remaining "Get started", "Start My Edit", "Book a Call", Pricing buttons point to WhatsApp
html = html.replace(/href="https:\/\/voma\.tastyedits\.com\/[^\"]*"/gi, 'href="https://wa.me/919876543210?text=Hello%20Kalakaari%20Studios!%20I%20want%20to%20inquire%20about%20editing%20services." target="_blank"');
html = html.replace(/href="https:\/\/www\.tastyedits\.com\/contact\/"/gi, 'href="https://wa.me/919876543210?text=Hello%20Kalakaari%20Studios!%20I%20want%20to%20book%20a%20call." target="_blank"');

fs.writeFileSync('dist/index.html', html, 'utf8');
console.log('Successfully updated dist/index.html!');
