import { fabric } from 'fabric';
import { BrochureTemplate, PropertyData, TemplatePage, TemplateObject } from '../../types';

export interface RenderedPage {
  pageNumber: number;
  background: string;
  objects: fabric.Object[];
}

function formatPrice(price: number, currency: string): string {
  if (!price) return '';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);
}

function formatArea(area: number, unit: string): string {
  if (!area) return '';
  const formatted = new Intl.NumberFormat('en-US').format(area);
  return `${formatted} ${unit === 'sqft' ? 'sq ft' : 'sq m'}`;
}

async function loadImage(url: string, placeholderDims?: { w: number, h: number }): Promise<fabric.Image | fabric.Rect> {
  return new Promise((resolve) => {
    if (!url) {
      // Return placeholder
      const p = new fabric.Rect({
        width: placeholderDims?.w || 200,
        height: placeholderDims?.h || 200,
        fill: '#cccccc',
      });
      resolve(p);
      return;
    }
    
    fabric.Image.fromURL(url, (img: fabric.Image) => {
      if (img && !img.isError) {
        resolve(img);
      } else {
        const p = new fabric.Rect({
          width: placeholderDims?.w || 200,
          height: placeholderDims?.h || 200,
          fill: '#cccccc',
        });
        resolve(p);
      }
    }, { crossOrigin: 'anonymous' });
  });
}

// Navigation logic for data replacement extracted to dataInjector.ts

export default async function renderTemplate(template: BrochureTemplate, property: PropertyData): Promise<RenderedPage[]> {
  const renderedPages: RenderedPage[] = [];

  for (const page of template.pages) {
    const renderedObjects: fabric.Object[] = [];

    for (const obj of page.objects) {
      let resolvedText = '';
      let urlToLoad = '';

      if (obj.type === 'textbox') {
        resolvedText = (obj.dataBinding as string) || 'Sample Text';
      } else if (obj.type === 'image' || obj.type === 'circle') {
        if (typeof obj.dataBinding === 'string' && obj.dataBinding.startsWith('{{')) {
           urlToLoad = ''; // Load the grey placeholder frame
        } else {
           urlToLoad = (obj.dataBinding as string) || '';
        }
      }

      // Fabric instantiation handles
      if (obj.type === 'textbox') {
        const textObj = new fabric.Textbox(resolvedText, {
          left: obj.left,
          top: obj.top,
          width: obj.width || undefined,
          fontSize: obj.fontSize || 16,
          fontFamily: obj.fontFamily || 'Inter',
          fontWeight: obj.fontWeight || 'normal',
          fill: obj.fill || '#000000',
          textAlign: obj.textAlign || 'left',
          lineHeight: obj.lineHeight || 1.16,
          opacity: obj.opacity !== undefined ? obj.opacity : 1,
          dataKey: obj.dataBinding,
        } as any);
        renderedObjects.push(textObj);
      } 
      else if (obj.type === 'image') {
        const imgObj = await loadImage(urlToLoad, { w: obj.width || 100, h: obj.height || 100 });
        
        // Scale to fit defined bounds appropriately
        if (imgObj.type === 'image' && obj.width && obj.height) {
           const scaleX = obj.width / (imgObj.width || 1);
           const scaleY = obj.height / (imgObj.height || 1);
           
           // If we want cover, we'd scale max and crop. For simplicity, just stretch or fit.
           // Usually template implies exact bounds, so we just scale x & y
           imgObj.set({
             scaleX,
             scaleY
           });
        }
        
        imgObj.set({
          left: obj.left,
          top: obj.top,
          dataKey: obj.dataBinding,
        } as any);

        // Add rx ry if specified (border radius). We handle this by setting clipPath in fabric v6 if it's an image
        if (obj.rx && obj.ry && imgObj.type === 'image') {
            const rectClip = new fabric.Rect({
                originX: 'center', originY: 'center',
                width: imgObj.width, height: imgObj.height,
                rx: obj.rx / (imgObj.scaleX || 1), ry: obj.ry / (imgObj.scaleY || 1)
            });
            imgObj.set({ clipPath: rectClip });
        }

        renderedObjects.push(imgObj);
      }
      else if (obj.type === 'circle' && obj.isClipPath) {
         // Some templates might have clipPaths separately, but we also can draw a shape
         const circleObj = new fabric.Circle({
             left: obj.left, top: obj.top, radius: obj.radius || 50, fill: obj.fill || 'transparent',
             dataKey: obj.dataBinding,
         } as any);
         renderedObjects.push(circleObj);
      }
      else if (obj.type === 'rect') {
        const rectObj = new fabric.Rect({
          left: obj.left,
          top: obj.top,
          width: obj.width || 100,
          height: obj.height || 100,
          fill: obj.fill || '#transparent',
          stroke: obj.stroke || undefined,
          strokeWidth: obj.strokeWidth || 0,
          rx: obj.rx || 0,
          ry: obj.ry || 0,
          opacity: obj.opacity !== undefined ? obj.opacity : 1,
        });
        renderedObjects.push(rectObj);
      }
      else if (obj.type === 'line') {
        const lineObj = new fabric.Line(
          [obj.x1 || obj.left, obj.y1 || obj.top, obj.x2 || (obj.left + 100), obj.y2 || obj.top], 
          {
            stroke: obj.stroke || '#000000',
            strokeWidth: obj.strokeWidth || 1,
            opacity: obj.opacity !== undefined ? obj.opacity : 1,
          }
        );
        renderedObjects.push(lineObj);
      }
    }

    renderedPages.push({
      pageNumber: page.pageNumber,
      background: page.background,
      objects: renderedObjects
    });
  }

  return renderedPages;
}
