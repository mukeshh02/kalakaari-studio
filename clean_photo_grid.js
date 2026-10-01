import fs from 'fs';

let html = fs.readFileSync('dist/index.html', 'utf8');

// Find start of d150a99 grid
const gridStartMarker = '<div class="elementor-element elementor-element-d150a99';
const gridStartIdx = html.indexOf(gridStartMarker);

// Find end of d150a99 grid (which is right before elementor-element-57d213e)
const gridEndMarker = '<div class="elementor-element elementor-element-57d213e';
const gridEndIdx = html.indexOf(gridEndMarker, gridStartIdx);

if (gridStartIdx !== -1 && gridEndIdx !== -1) {
  const photoCards8 = [
    {
      title: "Royal Wedding Storybook",
      category: "Wedding Album",
      img: "./img/pdf_renders/navdeep-asmeet-wedding-album_page_1.jpg",
      pdf: "./pdf/navdeep-asmeet-wedding-album.pdf"
    },
    {
      title: "Destination Pre-Wedding",
      category: "Pre-Wedding Shoot",
      img: "./img/pdf_renders/neha-ashish-pre-wedding-album_page_3.jpg",
      pdf: "./pdf/neha-ashish-pre-wedding-album.pdf"
    },
    {
      title: "Cinematic Wedding Spreads",
      category: "Designer Spreads",
      img: "./img/pdf_renders/wedding-demo-album-2024_page_2.jpg",
      pdf: "./pdf/wedding-demo-album-2024.pdf"
    },
    {
      title: "Maternity & Portrait Shoot",
      category: "Portrait Album",
      img: "./img/pdf_renders/maternity-demo-album-2025_page_2.jpg",
      pdf: "./pdf/maternity-demo-album-2025.pdf"
    },
    {
      title: "Traditional Reception Album",
      category: "Family Celebration",
      img: "./img/pdf_renders/varjoot-milandeep-family-album_page_2.jpg",
      pdf: "./pdf/varjoot-milandeep-family-album.pdf"
    },
    {
      title: "Bride & Groom Highlights",
      category: "Wedding Portfolio",
      img: "./img/pdf_renders/navdeep-asmeet-wedding-album_page_2.jpg",
      pdf: "./pdf/navdeep-asmeet-wedding-album.pdf"
    },
    {
      title: "Romantic Moments Shoot",
      category: "Pre-Wedding Album",
      img: "./img/pdf_renders/neha-ashish-pre-wedding-album_page_4.jpg",
      pdf: "./pdf/neha-ashish-pre-wedding-album.pdf"
    },
    {
      title: "Luxury Storybook Spreads",
      category: "Designer Album",
      img: "./img/pdf_renders/wedding-demo-album-2024_page_3.jpg",
      pdf: "./pdf/wedding-demo-album-2024.pdf"
    }
  ];

  let newGridHTML = `<div class="elementor-element elementor-element-d150a99 e-grid e-con-full e-con e-child" data-id="d150a99" data-element_type="container" data-e-type="container">`;

  photoCards8.forEach(card => {
    newGridHTML += `
    <div class="elementor-element e-con-full e-flex e-con e-child" style="background: #12141a; border-radius: 20px; overflow: hidden; border: 1px solid #232733; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5); transition: transform 0.3s ease, border-color 0.3s ease;">
      <a href="${card.pdf}" target="_blank" style="display: block; width: 100%; height: 100%; text-decoration: none; color: inherit;">
        <div style="position: relative; width: 100%; height: 380px; overflow: hidden;">
          <img src="${card.img}" alt="${card.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1) 40%, rgba(12,14,20,0.92) 100%);"></div>
          
          <div style="position: absolute; top: 14px; left: 14px; background: rgba(255, 155, 93, 0.9); color: #0c0d10; padding: 4px 12px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
            ${card.category}
          </div>

          <div style="position: absolute; bottom: 16px; left: 16px; right: 16px;">
            <h3 style="color: #ffffff; font-size: 1.15rem; font-weight: 700; margin-bottom: 6px; line-height: 1.3;">${card.title}</h3>
            <div style="display: flex; align-items: center; gap: 6px; color: #FF9B5D; font-size: 0.85rem; font-weight: 600;">
              <span>Click to Open PDF Album</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
          </div>
        </div>
      </a>
    </div>`;
  });

  newGridHTML += `</div>`;

  html = html.substring(0, gridStartIdx) + newGridHTML + html.substring(gridEndIdx);
  console.log('Successfully replaced old video grid with clean 8 photo cards!');
} else {
  console.log('Error: grid markers not found.');
}

fs.writeFileSync('dist/index.html', html, 'utf8');
