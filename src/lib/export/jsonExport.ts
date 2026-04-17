import { fabric } from 'fabric';
import { BrochureTemplate, TemplateObject, TemplatePage } from '../../types';

export function serializeCanvasToBrochureTemplate(
  canvases: fabric.Canvas[],
  id: string = 'custom-template',
  name: string = 'Custom Template'
): BrochureTemplate {
  
  const pages: TemplatePage[] = canvases.map((canvas, index) => {
    
    // Background color parsing
    let bg = '#ffffff';
    if (typeof canvas.backgroundColor === 'string') {
      bg = canvas.backgroundColor;
    }

    const objects: TemplateObject[] = [];

    // Parse each object
    canvas.getObjects().forEach((obj) => {
      // Exclude smart guides
      if ((obj as any).isGuide) return;

      const basePropStr = (obj as any).dataBinding;
      let type: 'text' | 'image' | 'rect' | 'circle' | 'line' | 'textbox' = 'rect';
      
      const to = {
        left: obj.left || 0,
        top: obj.top || 0,
        width: obj.width ? obj.width * (obj.scaleX || 1) : 0,
        height: obj.height ? obj.height * (obj.scaleY || 1) : 0,
        fill: obj.fill as string,
        stroke: obj.stroke as string,
        strokeWidth: obj.strokeWidth,
        opacity: obj.opacity !== 1 ? obj.opacity : undefined,
      } as any;

      // Handle Data Binding
      if (basePropStr) {
        to.dataBinding = basePropStr;
      }

      // Handle specifics
      if (obj.type === 'textbox' || obj.type === 'text') {
        type = 'textbox';
        const txt = obj as fabric.Textbox;
        to.fontSize = txt.fontSize;
        to.fontFamily = txt.fontFamily;
        to.fontWeight = txt.fontWeight;
        to.textAlign = txt.textAlign;
        to.lineHeight = txt.lineHeight;
        
        // If dataBinding isn't set but text has brackets, use that loosely
        if (!to.dataBinding && txt.text?.includes('{{')) {
          to.dataBinding = txt.text;
        } else if (!to.dataBinding) {
          to.dataBinding = txt.text; // Static text
        }
      } 
      else if ((obj as any).isImagePlaceholder) {
        type = 'image';
      } 
      else if (obj.type === 'rect') {
        type = 'rect';
        to.rx = (obj as fabric.Rect).rx;
        to.ry = (obj as fabric.Rect).ry;
      } 
      else if (obj.type === 'circle') {
        type = 'circle';
        to.radius = (obj as fabric.Circle).radius ? (obj as fabric.Circle).radius! * (obj.scaleX || 1) : 0;
      } 
      else if (obj.type === 'line') {
        type = 'line';
        const l = obj as fabric.Line;
        to.x1 = l.x1;
        to.y1 = l.y1;
        to.x2 = l.x2;
        to.y2 = l.y2;
      }

      to.type = type;
      objects.push(to as TemplateObject);
    });

    return {
      pageNumber: index + 1,
      background: bg,
      objects
    };
  });

  return {
    id,
    name,
    mood: 'Custom Created',
    width: canvases[0]?.width || 595,
    height: canvases[0]?.height || 842,
    pages
  };
}

export function downloadJsonConfig(template: BrochureTemplate) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(template, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", template.id + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
