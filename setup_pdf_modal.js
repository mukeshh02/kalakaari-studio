import fs from 'fs';

let html = fs.readFileSync('dist/index.html', 'utf8');

// Rich In-Page Album Spreads Viewer Modal
const modalHTML = `
<!-- IN-PAGE PHOTO ALBUM LIGHTBOX MODAL -->
<div id="pdf-modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999999; background: rgba(8, 9, 11, 0.94); backdrop-filter: blur(12px); align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;">
  <div style="width: 100%; max-width: 1100px; height: 90vh; background: #12141a; border: 1px solid #2d3242; border-radius: 20px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.9); position: relative; animation: modalScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);">
    
    <!-- Modal Header -->
    <div style="padding: 16px 24px; background: #181b24; border-bottom: 1px solid #282c3a; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 12px; overflow: hidden;">
        <span style="background: rgba(255,155,93,0.15); color: #FF9B5D; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(255,155,93,0.3); flex-shrink: 0;">📖 IN-PAGE ALBUM VIEWER</span>
        <h3 id="pdf-modal-title" style="color: #ffffff; font-size: 1.15rem; font-weight: 700; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Album Title</h3>
      </div>
      
      <div style="display: flex; align-items: center; gap: 12px;">
        <a id="pdf-modal-download-btn" href="#" target="_blank" style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,155,93,0.12); color: #FF9B5D; border: 1px solid rgba(255,155,93,0.3); padding: 6px 14px; border-radius: 10px; font-size: 0.8rem; font-weight: 600; text-decoration: none; transition: all 0.2s ease;">
          <span>Open Direct PDF</span> ↗
        </a>
        <button onclick="closePdfModal()" style="background: #232733; border: 1px solid #374151; color: #ffffff; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.2rem; font-weight: bold; transition: all 0.2s ease;" onmouseover="this.style.background='#FB686A'; this.style.borderColor='#FB686A';" onmouseout="this.style.background='#232733'; this.style.borderColor='#374151';">✕</button>
      </div>
    </div>
    
    <!-- Modal Content: Dual Mode (Interactive Spreads Gallery + PDF fallback) -->
    <div style="flex: 1; width: 100%; background: #08090b; position: relative; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 20px;" id="pdf-modal-gallery">
      <!-- High-res spreads rendered dynamically -->
    </div>

  </div>
</div>

<style>
@keyframes modalScaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
#pdf-modal-gallery::-webkit-scrollbar {
  width: 8px;
}
#pdf-modal-gallery::-webkit-scrollbar-track {
  background: #0d0e12;
}
#pdf-modal-gallery::-webkit-scrollbar-thumb {
  background: #2d3242;
  border-radius: 4px;
}
</style>

<script>
const albumPagesMap = {
  'navdeep-asmeet-wedding-album': [
    './img/pdf_renders/navdeep-asmeet-wedding-album_page_1.jpg',
    './img/pdf_renders/navdeep-asmeet-wedding-album_page_2.jpg',
    './img/pdf_renders/navdeep-asmeet-wedding-album_page_3.jpg'
  ],
  'neha-ashish-pre-wedding-album': [
    './img/pdf_renders/neha-ashish-pre-wedding-album_page_1.jpg',
    './img/pdf_renders/neha-ashish-pre-wedding-album_page_2.jpg',
    './img/pdf_renders/neha-ashish-pre-wedding-album_page_3.jpg',
    './img/pdf_renders/neha-ashish-pre-wedding-album_page_4.jpg'
  ],
  'wedding-demo-album-2024': [
    './img/pdf_renders/wedding-demo-album-2024_page_1.jpg',
    './img/pdf_renders/wedding-demo-album-2024_page_2.jpg',
    './img/pdf_renders/wedding-demo-album-2024_page_3.jpg'
  ],
  'maternity-demo-album-2025': [
    './img/pdf_renders/maternity-demo-album-2025_page_1.jpg',
    './img/pdf_renders/maternity-demo-album-2025_page_2.jpg',
    './img/pdf_renders/maternity-demo-album-2025_page_3.jpg'
  ],
  'varjoot-milandeep-family-album': [
    './img/pdf_renders/varjoot-milandeep-family-album_page_1.jpg',
    './img/pdf_renders/varjoot-milandeep-family-album_page_2.jpg',
    './img/pdf_renders/varjoot-milandeep-family-album_page_3.jpg'
  ]
};

function openPdfModal(pdfUrl, title, albumKey) {
  const modal = document.getElementById('pdf-modal-overlay');
  const titleElem = document.getElementById('pdf-modal-title');
  const downloadBtn = document.getElementById('pdf-modal-download-btn');
  const gallery = document.getElementById('pdf-modal-gallery');
  
  if (modal && titleElem && gallery) {
    titleElem.innerText = title;
    if (downloadBtn) downloadBtn.href = pdfUrl;
    
    // Clear previous images
    gallery.innerHTML = '';
    
    const pages = albumPagesMap[albumKey] || [];
    if (pages.length > 0) {
      pages.forEach((imgUrl, idx) => {
        const imgDiv = document.createElement('div');
        imgDiv.style.cssText = 'width: 100%; max-width: 950px; background: #12141a; border-radius: 12px; overflow: hidden; border: 1px solid #232733; box-shadow: 0 10px 30px rgba(0,0,0,0.6);';
        imgDiv.innerHTML = \`<img src="\${imgUrl}" alt="Spread \${idx+1}" style="width: 100%; height: auto; display: block;">\`;
        gallery.appendChild(imgDiv);
      });
    } else {
      gallery.innerHTML = \`<iframe src="\${pdfUrl}#toolbar=1" style="width: 100%; height: 100%; border: none;"></iframe>\`;
    }
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closePdfModal() {
  const modal = document.getElementById('pdf-modal-overlay');
  const gallery = document.getElementById('pdf-modal-gallery');
  if (modal) {
    modal.style.display = 'none';
    if (gallery) gallery.innerHTML = '';
    document.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('pdf-modal-overlay');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closePdfModal();
    });
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePdfModal();
});
</script>
`;

// Replace existing modal
if (html.includes('id="pdf-modal-overlay"')) {
  const oldStart = html.indexOf('<!-- IN-PAGE');
  const oldEnd = html.indexOf('</script>', oldStart) + 9;
  html = html.substring(0, oldStart) + html.substring(oldEnd);
}

html = html.replace('</body>', `${modalHTML}\n</body>`);

// Re-generate grid cards with albumKey
const gridStartMarker = '<div class="elementor-element elementor-element-d150a99';
const gridStartIdx = html.indexOf(gridStartMarker);
const gridEndMarker = '<div class="elementor-element elementor-element-57d213e';
const gridEndIdx = html.indexOf(gridEndMarker, gridStartIdx);

if (gridStartIdx !== -1 && gridEndIdx !== -1) {
  const photoCards8 = [
    {
      title: "Royal Wedding Storybook",
      category: "Wedding Album",
      img: "./img/pdf_renders/navdeep-asmeet-wedding-album_page_1.jpg",
      pdf: "./pdf/navdeep-asmeet-wedding-album.pdf",
      key: "navdeep-asmeet-wedding-album"
    },
    {
      title: "Destination Pre-Wedding",
      category: "Pre-Wedding Shoot",
      img: "./img/pdf_renders/neha-ashish-pre-wedding-album_page_3.jpg",
      pdf: "./pdf/neha-ashish-pre-wedding-album.pdf",
      key: "neha-ashish-pre-wedding-album"
    },
    {
      title: "Cinematic Wedding Spreads",
      category: "Designer Spreads",
      img: "./img/pdf_renders/wedding-demo-album-2024_page_2.jpg",
      pdf: "./pdf/wedding-demo-album-2024.pdf",
      key: "wedding-demo-album-2024"
    },
    {
      title: "Maternity & Portrait Shoot",
      category: "Portrait Album",
      img: "./img/pdf_renders/maternity-demo-album-2025_page_2.jpg",
      pdf: "./pdf/maternity-demo-album-2025.pdf",
      key: "maternity-demo-album-2025"
    },
    {
      title: "Traditional Reception Album",
      category: "Family Celebration",
      img: "./img/pdf_renders/varjoot-milandeep-family-album_page_2.jpg",
      pdf: "./pdf/varjoot-milandeep-family-album.pdf",
      key: "varjoot-milandeep-family-album"
    },
    {
      title: "Bride & Groom Highlights",
      category: "Wedding Portfolio",
      img: "./img/pdf_renders/navdeep-asmeet-wedding-album_page_2.jpg",
      pdf: "./pdf/navdeep-asmeet-wedding-album.pdf",
      key: "navdeep-asmeet-wedding-album"
    },
    {
      title: "Romantic Moments Shoot",
      category: "Pre-Wedding Album",
      img: "./img/pdf_renders/neha-ashish-pre-wedding-album_page_4.jpg",
      pdf: "./pdf/neha-ashish-pre-wedding-album.pdf",
      key: "neha-ashish-pre-wedding-album"
    },
    {
      title: "Luxury Storybook Spreads",
      category: "Designer Album",
      img: "./img/pdf_renders/wedding-demo-album-2024_page_3.jpg",
      pdf: "./pdf/wedding-demo-album-2024.pdf",
      key: "wedding-demo-album-2024"
    }
  ];

  let newGridHTML = `<div class="elementor-element elementor-element-d150a99 e-grid e-con-full e-con e-child" data-id="d150a99" data-element_type="container" data-e-type="container">`;

  photoCards8.forEach(card => {
    newGridHTML += `
    <div class="elementor-element e-con-full e-flex e-con e-child" style="background: #12141a; border-radius: 20px; overflow: hidden; border: 1px solid #232733; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5); cursor: pointer; transition: transform 0.3s ease, border-color 0.3s ease;" onclick="openPdfModal('${card.pdf}', '${card.title.replace(/'/g, "\\'")}', '${card.key}')">
      <div style="display: block; width: 100%; height: 100%;">
        <div style="position: relative; width: 100%; height: 380px; overflow: hidden;">
          <img src="${card.img}" alt="${card.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1) 40%, rgba(12,14,20,0.92) 100%);"></div>
          
          <div style="position: absolute; top: 14px; left: 14px; background: rgba(255, 155, 93, 0.9); color: #0c0d10; padding: 4px 12px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
            ${card.category}
          </div>

          <div style="position: absolute; bottom: 16px; left: 16px; right: 16px;">
            <h3 style="color: #ffffff; font-size: 1.15rem; font-weight: 700; margin-bottom: 6px; line-height: 1.3;">${card.title}</h3>
            <div style="display: flex; align-items: center; gap: 6px; color: #FF9B5D; font-size: 0.85rem; font-weight: 600;">
              <span>📖 Open Spreads In-Page</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  });

  newGridHTML += `</div>`;

  html = html.substring(0, gridStartIdx) + newGridHTML + html.substring(gridEndIdx);
  console.log('Successfully updated photo cards with in-page album viewer lightbox.');
}

fs.writeFileSync('dist/index.html', html, 'utf8');
console.log('Successfully updated dist/index.html!');
