import fitz # PyMuPDF
import sys

def convert_pdf_to_png(pdf_path, output_prefix):
    try:
        doc = fitz.open(pdf_path)
        for i in range(len(doc)):
            page = doc.load_page(i)
            pix = page.get_pixmap(dpi=150)
            img_path = f"{output_prefix}_{i}.png"
            pix.save(img_path)
            print(f"Saved: {img_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    pdf_path = sys.argv[1]
    output_prefix = sys.argv[2]
    convert_pdf_to_png(pdf_path, output_prefix)
