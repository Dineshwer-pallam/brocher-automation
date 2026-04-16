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
  
  resolved = resolved.replace(/\{\{\s*building_info\s*\}\}/g, property.buildingInfo || 'Building details here...');
  resolved = resolved.replace(/\{\{\s*entrance_hall\s*\}\}/g, property.entranceHall || 'Entrance hall description...');
  resolved = resolved.replace(/\{\{\s*kitchen_lounge\s*\}\}/g, property.kitchenLounge || 'Kitchen/lounge details here...');
  resolved = resolved.replace(/\{\{\s*bedroom_one\s*\}\}/g, property.bedroomOne || 'Bedroom one description...');
  resolved = resolved.replace(/\{\{\s*en_suite\s*\}\}/g, property.enSuite || 'En-suite details here...');
  resolved = resolved.replace(/\{\{\s*bedroom_two\s*\}\}/g, property.bedroomTwo || 'Bedroom two description...');
  resolved = resolved.replace(/\{\{\s*bathroom_details\s*\}\}/g, property.bathroomDetails || 'Bathroom details here...');
  resolved = resolved.replace(/\{\{\s*externally\s*\}\}/g, property.externally || 'External details here...');
  resolved = resolved.replace(/\{\{\s*additional_info\s*\}\}/g, property.additionalInfo || 'Additional information here...');
  resolved = resolved.replace(/\{\{\s*agents_notes\s*\}\}/g, property.agentsNotes || 'Agents notes here...');
  resolved = resolved.replace(/\{\{\s*disclaimer\s*\}\}/g, property.disclaimer || 'Disclaimer here...');
  resolved = resolved.replace(/\{\{\s*viewing_arrangements\s*\}\}/g, property.viewingArrangements || 'Viewing strictly by appointment...');
  
  resolved = resolved.replace(/\{\{\s*agent_name\s*\}\}/g, property.agent.name || 'Agent Name');
  resolved = resolved.replace(/\{\{\s*agent_phone\s*\}\}/g, property.agent.phone || 'Agent Phone');
  resolved = resolved.replace(/\{\{\s*agent_email\s*\}\}/g, property.agent.email || 'Agent Email');
  
  resolved = resolved.replace(/\{\{\s*company_name\s*\}\}/g, property.company.name || 'Company Name');
  resolved = resolved.replace(/\{\{\s*company_website\s*\}\}/g, property.company.website || 'www.company.com');
  resolved = resolved.replace(/\{\{\s*address\s*\}\}/g, property.address || '123 Property Address');

  // Convert markdown lists (- point or * point) to typography bullets
  resolved = resolved.replace(/(^|\n)[\-\*]\s+/g, '$1• ');

  return resolved;
}

export async function processWithLiveData(
  canvases: fabric.Canvas[], 
  propertyData: PropertyData,
  callback: () => Promise<void>
) {
  // 1. Store previous state and inject live data
  const restoreMap = new Map<fabric.Object, { text?: string, src?: string, width?: number, height?: number, scaleX?: number, scaleY?: number }>();
  
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
        const dataKey = (obj as any).dataKey || (obj as any).dataBinding;
        if (dataKey) {
          // Store original image URL and scale state
          restoreMap.set(obj, { 
            src: obj.getSrc(),
            width: obj.width,
            height: obj.height,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY
          });
          
          // Determine new URL
          let urlToLoad = '';
          const len = propertyData.images.length;
          
          if (dataKey === '{{hero_image}}') urlToLoad = propertyData.images[0]?.url || '';
          else if (dataKey === '{{gallery_1}}') urlToLoad = propertyData.images[1]?.url || '';
          else if (dataKey === '{{gallery_2}}') urlToLoad = propertyData.images[2]?.url || '';
          else if (dataKey === '{{gallery_3}}') urlToLoad = propertyData.images[3]?.url || '';
          else if (dataKey === '{{gallery_4}}') urlToLoad = propertyData.images[4]?.url || '';
          else if (dataKey === '{{gallery_5}}') urlToLoad = propertyData.images[5]?.url || '';
          else if (dataKey === '{{gallery_6}}') urlToLoad = propertyData.images[6]?.url || '';
          else if (dataKey === '{{gallery_7}}') urlToLoad = propertyData.images[7]?.url || '';
          else if (dataKey === '{{gallery_8}}') urlToLoad = propertyData.images[8]?.url || '';
          else if (dataKey === '{{floorplan}}') urlToLoad = propertyData.images[Math.max(0, len - 1)]?.url || '';
          else if (dataKey === '{{epc_1}}') urlToLoad = propertyData.images[Math.max(0, len - 2)]?.url || '';
          else if (dataKey === '{{epc_2}}') urlToLoad = propertyData.images[Math.max(0, len - 3)]?.url || '';
          else if (dataKey === '{{agent_photo}}') urlToLoad = propertyData.agent.photoUrl || '';
          else if (dataKey === '{{company_logo}}') urlToLoad = propertyData.company.logoUrl || '';
          
          if (urlToLoad) {
            imgPromises.push(new Promise<void>((resolve) => {
              const currentObj = obj as fabric.Image;
              const targetW = (currentObj.width || 1) * (currentObj.scaleX || 1);
              const targetH = (currentObj.height || 1) * (currentObj.scaleY || 1);

              let imgEl = new Image();
              imgEl.crossOrigin = 'anonymous';
              imgEl.onload = () => {
                currentObj.setElement(imgEl);
                currentObj.set({
                  width: imgEl.naturalWidth || imgEl.width,
                  height: imgEl.naturalHeight || imgEl.height,
                  scaleX: targetW / (imgEl.naturalWidth || imgEl.width || 1),
                  scaleY: targetH / (imgEl.naturalHeight || imgEl.height || 1)
                });
                currentObj.setCoords();
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
          obj.setSrc(restored.src, () => {
            obj.set({
              width: restored.width,
              height: restored.height,
              scaleX: restored.scaleX,
              scaleY: restored.scaleY
            });
            obj.setCoords();
          });
        }
      }
    }
    canvas.renderAll();
  }
}
