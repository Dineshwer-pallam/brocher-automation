import jsPDF from 'jspdf';
import { fabric } from 'fabric';

export async function exportToPDF(canvases: fabric.Canvas[], fileName?: string) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
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

    // A4 dimensions in pt: 595.28 x 841.89
    // Our canvas base is exactly 595x842
    pdf.addImage(dataUrl, 'PNG', 0, 0, 595, 842);
  }

  pdf.save(fileName || 'property-brochure.pdf');
}
