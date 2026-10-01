import fitz  # PyMuPDF
import os

pdf_dir = r"d:\SHIKHAR_PROJECTS\2026\09 SEPT\kalakaari_Studio\Porfolio_Website\Clone_TastyEdits\dist\pdf"
out_dir = r"d:\SHIKHAR_PROJECTS\2026\09 SEPT\kalakaari_Studio\Porfolio_Website\Clone_TastyEdits\dist\img\pdf_renders"

os.makedirs(out_dir, exist_ok=True)

pdf_files = [f for f in os.listdir(pdf_dir) if f.endswith(".pdf")]

for pdf_name in pdf_files:
    pdf_path = os.path.join(pdf_dir, pdf_name)
    doc = fitz.open(pdf_path)
    base_name = os.path.splitext(pdf_name)[0]
    print(f"Processing {pdf_name}, total pages: {len(doc)}")
    
    # Extract first 6 pages as crisp JPEG images
    for page_idx in range(min(6, len(doc))):
        page = doc[page_idx]
        pix = page.get_pixmap(dpi=150)
        out_filename = f"{base_name}_page_{page_idx+1}.jpg"
        out_path = os.path.join(out_dir, out_filename)
        pix.save(out_path)
        print(f"  Saved {out_filename}")

print("Done extracting more PDF pages!")
