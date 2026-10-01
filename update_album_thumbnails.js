import fs from 'fs';

let html = fs.readFileSync('dist/index.html', 'utf8');

// Replace the placeholder visual containers in the 5 album cards with real PDF render image previews

const albumImages = {
  'wedding-demo-album-2024.pdf': './img/pdf_renders/wedding-demo-album-2024_page_2.jpg',
  'navdeep-asmeet-wedding-album.pdf': './img/pdf_renders/navdeep-asmeet-wedding-album_page_2.jpg',
  'neha-ashish-pre-wedding-album.pdf': './img/pdf_renders/neha-ashish-pre-wedding-album_page_3.jpg',
  'maternity-demo-album-2025.pdf': './img/pdf_renders/maternity-demo-album-2025_page_2.jpg',
  'varjoot-milandeep-family-album.pdf': './img/pdf_renders/varjoot-milandeep-family-album_page_2.jpg'
};

// Target each album card placeholder pattern and replace with image preview
for (const [pdfFile, imgPath] of Object.entries(albumImages)) {
  const targetHref = `./pdf/${pdfFile}`;
  
  // Find where this card is in HTML
  const cardIndex = html.indexOf(targetHref);
  if (cardIndex !== -1) {
    // Find the placeholder SVG container preceding this link
    const searchBack = html.lastIndexOf('<!-- Visual Book Icon Placeholder -->', cardIndex);
    if (searchBack !== -1) {
      const placeholderEnd = html.indexOf('</div>', html.indexOf('Click to View Album Spreads', searchBack)) + 6;
      
      const oldPlaceholder = html.substring(searchBack, placeholderEnd);
      const newPreview = `<!-- Album Image Preview -->
      <div style="height: 190px; border-radius: 14px; overflow: hidden; margin-bottom: 20px; border: 1px solid #2d3242; position: relative; box-shadow: 0 4px 15px rgba(0,0,0,0.4);">
        <img src="${imgPath}" alt="Album Preview Spread" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'">
        <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(12, 13, 16, 0.85); backdrop-filter: blur(4px); color: #FF9B5D; padding: 4px 10px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; border: 1px solid rgba(255,155,93,0.3);">
          📖 View Spreads
        </div>
      </div>`;
      
      html = html.replace(oldPlaceholder, newPreview);
      console.log(`Updated preview for ${pdfFile}`);
    }
  }
}

fs.writeFileSync('dist/index.html', html, 'utf8');
console.log('Successfully updated album card previews in dist/index.html!');
