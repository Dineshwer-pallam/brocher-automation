import jsPDF from 'jspdf';
import { fabric } from 'fabric';

interface PDFExportOptions {
  width: number;
  height: number;
}

export async function exportToPDF(canvases: fabric.Canvas[], fileName?: string, options: PDFExportOptions = { width: 595, height: 842 }) {
  const orientation = options.width > options.height ? 'landscape' : 'portrait';
  
  const pdf = new jsPDF({
    orientation: orientation,
    unit: 'pt',
    format: [options.width, options.height]
  });

  for (let i = 0; i < canvases.length; i++) {
    const c = canvases[i];
    if (!c) continue;

    // Deselect rendering outline
    c.discardActiveObject();
    c.renderAll();

    // Export image format from canvas
    const dataUrl = c.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
    
    if (i > 0) {
      pdf.addPage();
    }

    // Apply the exact canvas dimensions to the PDF image render
    pdf.addImage(dataUrl, 'PNG', 0, 0, options.width, options.height);
  }

  pdf.save(fileName || 'property-brochure.pdf');
}
