import fs from 'fs';

let html = fs.readFileSync('dist/index.html', 'utf8');

// 1. Remove all Login and VOMA Login buttons/elements
console.log('--- Removing Login Buttons ---');
// Match <a ...>Login</a> or <a ...>VOMA Login</a> or container parent widgets for login
const loginRegex = /<a[^>]*class="[^"]*elementor-button[^"]*"[^>]*href="[^"]*login[^"]*"[^>]*>[\s\S]*?Login[\s\S]*?<\/a>/gi;
let loginMatches = html.match(loginRegex) || [];
console.log(`Found ${loginMatches.length} login buttons.`);

html = html.replace(loginRegex, '');

// Also remove any standalone Login text links
const loginTextRegex = /<a[^>]*href="[^"]*authentication[^"]*"[^>]*>[\s\S]*?Login[\s\S]*?<\/a>/gi;
html = html.replace(loginTextRegex, '');

// 2. Add global smooth scroll CSS and WhatsApp booking modal trigger helper
if (!html.includes('/* SMOOTH SCROLL & BUTTON FIXES */')) {
  const smoothCss = `
<style>
/* SMOOTH SCROLL & BUTTON FIXES */
html {
  scroll-behavior: smooth !important;
}
.elementor-button, button, a.elementor-button {
  cursor: pointer !important;
}
</style>
<script>
function openWhatsAppChat(customMsg) {
  const msg = customMsg || "Hello Kalakaari Studios! I would like to inquire about your video and photo album editing packages.";
  window.open("https://wa.me/919876543210?text=" + encodeURIComponent(msg), "_blank");
}
function openBookingModal() {
  const modal = document.getElementById('booking-modal-overlay');
  if (modal) {
    modal.style.display = 'flex';
  } else {
    openWhatsAppChat();
  }
}
</script>
`;
  html = html.replace('</head>', `${smoothCss}\n</head>`);
}

// 3. Fix Top Navbar Links
console.log('--- Fixing Navbar Links ---');
// Replace external tastyedits links in navigation
html = html.replace(/href="https:\/\/www\.tastyedits\.com\/pricing\/"/g, 'href="#pricing"');
html = html.replace(/href="https:\/\/www\.tastyedits\.com\/examples\/"/g, 'href="#short-form-video-editing"');
html = html.replace(/href="https:\/\/www\.tastyedits\.com\/examples\/#horizontal"/g, 'href="#youtube-highlights"');
html = html.replace(/href="https:\/\/www\.tastyedits\.com\/examples\/#vertical"/g, 'href="#short-form-video-editing"');
html = html.replace(/href="https:\/\/www\.tastyedits\.com"/g, 'href="#"');

// Fix "Get started" button in Header to open WhatsApp / Booking
const headerGetStartedRegex = /(<a[^>]*class="[^"]*elementor-button[^"]*"[^>]*>[\s\S]*?Get started[\s\S]*?<\/a>)/gi;
html = html.replace(headerGetStartedRegex, (match) => {
  return match.replace(/href="[^"]*"/, 'href="https://wa.me/919876543210?text=Hello%20Kalakaari%20Studios!%20I%20want%20to%20get%20started%20with%20editing%20services." target="_blank"');
});

// 4. Fix ALL CTA Buttons across the page ("Start My Edit", "Get Started", "Book a Call", "See More Examples", etc.)
console.log('--- Fixing All CTA Buttons Across Page ---');

// Replace any leftover tastyedits.com hrefs on buttons
html = html.replace(/href="https:\/\/www\.tastyedits\.com\/[^\"]*"/gi, (fullMatch) => {
  if (fullMatch.includes('horizontal') || fullMatch.includes('vertical') || fullMatch.includes('examples')) {
    return 'href="#short-form-video-editing"';
  }
  if (fullMatch.includes('pricing')) {
    return 'href="#pricing"';
  }
  return 'href="https://wa.me/919876543210?text=Hello%20Kalakaari%20Studios!%20I%20am%20interested%20in%20your%20services." target="_blank"';
});

// Replace any voma.tastyedits.com hrefs on buttons with WhatsApp direct link
html = html.replace(/href="https:\/\/voma\.tastyedits\.com[^\"]*"/gi, 'href="https://wa.me/919876543210?text=Hello%20Kalakaari%20Studios!%20I%20want%20to%20place%20an%20order%20for%20editing." target="_blank"');

// Ensure all "See More Examples" buttons point to #short-form-video-editing
html = html.replace(/href="[^"]*"([^>]*>[\s\S]*?See More Examples[\s\S]*?<\/a>)/gi, 'href="#short-form-video-editing"$1');

fs.writeFileSync('dist/index.html', html, 'utf8');
console.log('Successfully updated all buttons and removed login button in dist/index.html!');
