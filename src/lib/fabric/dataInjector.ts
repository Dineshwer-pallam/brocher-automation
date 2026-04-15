import { fabric } from 'fabric';
import { PropertyData } from '../../types';

function formatPrice(price: number, currency: string): string {
  if (!price) return '';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);
}

function formatArea(area: number, unit: string): string {
  if (!area) return '';
  const formatted = new Intl.NumberFormat('en-US').format(area);
  return `${formatted} ${unit === 'sqft' ? 'sq ft' : 'sq m'}`;
}

export function replaceBindings(text: string, property: PropertyData): string {
  if (typeof text !== 'string') return text;
  
  let resolved = text;
  resolved = resolved.replace(/\{\{\s*title\s*\}\}/g, property.title || 'Property Title Placeholder');
  resolved = resolved.replace(/\{\{\s*price\s*\}\}/g, property.price ? formatPrice(property.price, property.currency) : '$0');
  resolved = resolved.replace(/\{\{\s*bedrooms\s*\}\}/g, String(property.bedrooms || '0'));
  resolved = resolved.replace(/\{\{\s*bathrooms\s*\}\}/g, String(property.bathrooms || '0'));
  resolved = resolved.replace(/\{\{\s*area\s*\}\}/g, formatArea(property.area || 0, property.areaUnit));
  resolved = resolved.replace(/\{\{\s*description\s*\}\}/g, property.description || 'Property description here...');
  resolved = resolved.replace(/\{\{\s*highlights\s*\}\}/g, property.highlights?.join(" • ") || 'Key Feature 1 • Key Feature 2');
  
  resolved = resolved.replace(/\{\{\s*agent_name\s*\}\}/g, property.agent.name || 'Agent Name');
  resolved = resolved.replace(/\{\{\s*agent_phone\s*\}\}/g, property.agent.phone || 'Agent Phone');
  resolved = resolved.replace(/\{\{\s*agent_email\s*\}\}/g, property.agent.email || 'Agent Email');
  
  resolved = resolved.replace(/\{\{\s*company_name\s*\}\}/g, property.company.name || 'Company Name');
  resolved = resolved.replace(/\{\{\s*address\s*\}\}/g, property.address || '123 Property Address');

  return resolved;
}

export async function processWithLiveData(
  canvases: fabric.Canvas[], 
  propertyData: PropertyData,
  callback: () => Promise<void>
) {
  // 1. Store previous state and inject live data
  const restoreMap = new Map<fabric.Object, { text?: string, src?: string }>();
  
  const imgPromises: Promise<void>[] = [];

  for (const canvas of canvases) {
    const objects = canvas.getObjects();
    for (const obj of objects) {
      if (obj instanceof fabric.Textbox || obj instanceof fabric.Text) {
        const originalText = obj.text || '';
        if (/\{\{.*?\}\}/.test(originalText)) {
          restoreMap.set(obj, { text: originalText });
          obj.set({ text: replaceBindings(originalText, propertyData) });
        }
      } 
      else if (obj instanceof fabric.Image) {
        const dataKey = (obj as any).dataKey;
        if (dataKey) {
          // Store original image URL
          restoreMap.set(obj, { src: obj.getSrc() });
          
          // Determine new URL
          let urlToLoad = '';
          if (dataKey === '{{hero_image}}') urlToLoad = propertyData.images[0]?.url || '';
          else if (dataKey === '{{gallery_1}}') urlToLoad = propertyData.images[1]?.url || '';
          else if (dataKey === '{{gallery_2}}') urlToLoad = propertyData.images[2]?.url || '';
          else if (dataKey === '{{gallery_3}}') urlToLoad = propertyData.images[3]?.url || '';
          else if (dataKey === '{{agent_photo}}') urlToLoad = propertyData.agent.photoUrl || '';
          else if (dataKey === '{{company_logo}}') urlToLoad = propertyData.company.logoUrl || '';
          
          if (urlToLoad) {
            imgPromises.push(new Promise<void>((resolve) => {
              const currentObj = obj as fabric.Image;
              let imgEl = new Image();
              imgEl.crossOrigin = 'anonymous';
              imgEl.onload = () => {
                currentObj.setElement(imgEl);
                resolve();
              };
              imgEl.onerror = () => resolve();
              imgEl.src = urlToLoad;
            }));
          }
        }
      }
    }
  }

  // Wait for all images to legally load before capturing
  await Promise.all(imgPromises);

  // Render all active canvases
  for (const c of canvases) c.renderAll();

  // 2. Execute callback (generates images/pdf)
  await callback();

  // 3. Restore placeholders
  for (const canvas of canvases) {
    const objects = canvas.getObjects();
    for (const obj of objects) {
      if (restoreMap.has(obj)) {
        const restored = restoreMap.get(obj)!;
        if (restored.text !== undefined && (obj instanceof fabric.Textbox || obj instanceof fabric.Text)) {
          obj.set({ text: restored.text });
        }
        if (restored.src !== undefined && obj instanceof fabric.Image) {
          obj.setSrc(restored.src, () => {});
        }
      }
    }
    canvas.renderAll();
  }
}
