import { BrochureTemplate } from '../../types';

export const warmElegantTemplate: BrochureTemplate = {
  id: 'warm-elegant',
  name: 'Warm Elegant',
  mood: 'Inviting, sophisticated, classic',
  pages: [
    {
      pageNumber: 1,
      background: '#fdfbf7',
      objects: [
        { type: 'rect', left: 20, top: 20, width: 555, height: 802, fill: 'transparent', stroke: '#cda87c', strokeWidth: 2 },
        { type: 'image', dataBinding: '{{hero_image}}', left: 40, top: 40, width: 515, height: 380 },
        
        { type: 'textbox', dataBinding: 'EXCLUSIVE OFFERING', left: 40, top: 440, width: 515, fill: '#cda87c', fontSize: 11, fontFamily: 'Lora', fontWeight: 'bold', textAlign: 'center' },
        
        { type: 'textbox', dataBinding: '{{title}}', left: 40, top: 465, width: 515, fill: '#4a3b32', fontSize: 34, fontFamily: 'Lora', fontWeight: 'bold', textAlign: 'center' },
        { type: 'line', x1: 200, y1: 535, x2: 395, y2: 535, stroke: '#cda87c', strokeWidth: 1 },
        { type: 'textbox', dataBinding: '{{address}}', left: 40, top: 555, width: 515, fill: '#8b7a6d', fontSize: 13, fontFamily: 'Lora', textAlign: 'center', fontWeight: 'normal' },
        { type: 'textbox', dataBinding: '{{price}}', left: 40, top: 585, width: 515, fill: '#332720', fontSize: 26, fontFamily: 'Lora', textAlign: 'center', fontWeight: 'bold' },
        
        { type: 'textbox', dataBinding: '{{bedrooms}} Bedrooms    |    {{bathrooms}} Bathrooms    |    {{area}}', left: 40, top: 635, fill: '#8b7a6d', fontSize: 13, fontFamily: 'Lora', textAlign: 'center', width: 515, fontWeight: 'bold' },
        
        { type: 'textbox', dataBinding: 'Discover unparalleled elegance in this curated estate, where classic architecture meets modern sophistication.', left: 70, top: 675, width: 455, fill: '#8b7a6d', fontSize: 12, fontFamily: 'Lora', textAlign: 'center', fontStyle: 'italic', lineHeight: 1.6 },
        
        { type: 'image', dataBinding: '/images/company_logo.png', left: 247.5, top: 720, width: 100, height: 45 },
        { type: 'textbox', dataBinding: '{{company_name}}', left: 40, top: 775, width: 515, fill: '#cda87c', fontSize: 9, fontFamily: 'Lora', textAlign: 'center', fontWeight: 'bold' }
      ]
    },
    {
      pageNumber: 2,
      background: '#fdfbf7',
      objects: [
        { type: 'rect', left: 20, top: 20, width: 555, height: 802, fill: 'transparent', stroke: '#cda87c', strokeWidth: 2 },
        { type: 'image', dataBinding: '{{gallery_1}}', left: 40, top: 40, width: 250, height: 220 },
        { type: 'image', dataBinding: '{{gallery_2}}', left: 305, top: 40, width: 250, height: 220 },
        
        { type: 'textbox', dataBinding: 'PROPERTY DESCRIPTION', left: 40, top: 290, width: 515, fill: '#cda87c', fontSize: 13, fontFamily: 'Lora', fontWeight: 'bold', textAlign: 'center' },
        { type: 'textbox', dataBinding: '{{description}}', left: 50, top: 320, width: 495, fill: '#4a3b32', fontSize: 12, fontFamily: 'Lora', lineHeight: 1.8, textAlign: 'justify' },
        
        { type: 'line', x1: 150, y1: 440, x2: 445, y2: 440, stroke: '#e8ddcc', strokeWidth: 1 },
        
        { type: 'textbox', dataBinding: 'AMENITIES & FEATURES', left: 40, top: 460, width: 515, fill: '#4a3b32', fontSize: 16, fontFamily: 'Lora', fontWeight: 'bold', textAlign: 'center' },
        { type: 'textbox', dataBinding: '{{highlights}}', left: 50, top: 490, width: 495, fill: '#8b7a6d', fontSize: 13, fontFamily: 'Lora', lineHeight: 2.2, textAlign: 'center' },
        
        { type: 'rect', left: 40, top: 620, width: 515, height: 170, fill: '#f4ede4' },
        { type: 'circle', dataBinding: '{{agent_photo}}', left: 60, top: 645, radius: 60, isClipPath: true },
        { type: 'image', dataBinding: '{{agent_photo}}', left: 60, top: 645, width: 120, height: 120 },
        
        { type: 'textbox', dataBinding: 'TO SCHEDULE A PRIVATE TOUR', left: 210, top: 655, fill: '#cda87c', fontSize: 11, fontFamily: 'Lora', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: '{{agent_name}}', left: 210, top: 675, fill: '#4a3b32', fontSize: 20, fontFamily: 'Lora', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: 'Certified Luxury Property Specialist', left: 210, top: 700, fill: '#8b7a6d', fontSize: 11, fontFamily: 'Lora', fontStyle: 'italic' },
        { type: 'line', x1: 210, y1: 720, x2: 400, y2: 720, stroke: '#d8c8b2', strokeWidth: 1 },
        { type: 'textbox', dataBinding: 'Direct: {{agent_phone}}', left: 210, top: 735, fill: '#4a3b32', fontSize: 13, fontFamily: 'Lora' },
        { type: 'textbox', dataBinding: 'Email: {{agent_email}}', left: 210, top: 755, fill: '#4a3b32', fontSize: 13, fontFamily: 'Lora' }
      ]
    }
  ]
};
