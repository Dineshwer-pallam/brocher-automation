import { BrochureTemplate } from '../../types';

export const luxuryDarkTemplate: BrochureTemplate = {
  id: 'luxury-dark',
  name: 'Luxury Dark',
  mood: 'High-end, exclusive',
  pages: [
    {
      pageNumber: 1,
      background: '#1a1a2e',
      objects: [
        { type: 'image', dataBinding: '{{hero_image}}', left: 0, top: 0, width: 595, height: 450 },
        { type: 'rect', left: 0, top: 380, width: 595, height: 462, fill: '#1a1a2e' },
        { type: 'rect', left: 40, top: 350, width: 515, height: 180, fill: '#24243e', stroke: '#d4af37', strokeWidth: 1 },
        { type: 'textbox', dataBinding: 'EXCLUSIVE LISTING', left: 60, top: 370, fill: '#d4af37', fontSize: 11, fontFamily: 'Montserrat', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: '{{title}}', left: 60, top: 390, width: 475, fill: '#ffffff', fontSize: 32, fontFamily: 'Playfair Display', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: '{{address}}', left: 60, top: 435, width: 475, fill: '#aaaaaa', fontSize: 12, fontFamily: 'Inter' },
        { type: 'textbox', dataBinding: '{{price}}', left: 60, top: 460, fill: '#d4af37', fontSize: 28, fontFamily: 'Montserrat', fontWeight: 'bold' },
        
        { type: 'line', x1: 60, y1: 505, x2: 535, y2: 505, stroke: '#33334d', strokeWidth: 1 },
        { type: 'textbox', dataBinding: '{{bedrooms}} Beds  •  {{bathrooms}} Baths  •  {{area}}', left: 60, top: 515, fill: '#ffffff', fontSize: 14, fontFamily: 'Montserrat', textAlign: 'center', width: 475 },
        
        { type: 'textbox', dataBinding: 'ABOUT THE PROPERTY', left: 40, top: 560, fill: '#d4af37', fontSize: 16, fontFamily: 'Playfair Display', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: '{{description}}', left: 40, top: 590, width: 515, fill: '#cccccc', fontSize: 11, fontFamily: 'Inter', lineHeight: 1.6 },
        
        { type: 'rect', left: 0, top: 730, width: 595, height: 112, fill: '#0f0f1a' },
        { type: 'circle', dataBinding: '{{agent_photo}}', left: 40, top: 745, radius: 40, isClipPath: true },
        { type: 'image', dataBinding: '{{agent_photo}}', left: 40, top: 745, width: 80, height: 80 },
        { type: 'textbox', dataBinding: 'PRESENTED BY', left: 140, top: 750, fill: '#666680', fontSize: 10, fontFamily: 'Montserrat', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: '{{agent_name}}', left: 140, top: 765, fill: '#ffffff', fontSize: 16, fontFamily: 'Playfair Display', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: '{{agent_phone}} | {{agent_email}}', left: 140, top: 790, fill: '#aaaaaa', fontSize: 11, fontFamily: 'Inter' },
        { type: 'textbox', dataBinding: '{{company_name}}', left: 435, top: 745, fill: '#666680', fontSize: 9, fontFamily: 'Montserrat', fontWeight: 'bold', width: 120, textAlign: 'right' },
        { type: 'image', dataBinding: '/images/company_logo.png', left: 435, top: 760, width: 120, height: 50 }
      ]
    },
    {
      pageNumber: 2,
      background: '#1a1a2e',
      objects: [
        { type: 'textbox', dataBinding: 'PROPERTY GALLERY', left: 40, top: 40, fill: '#d4af37', fontSize: 24, fontFamily: 'Playfair Display', fontWeight: 'bold' },
        { type: 'line', x1: 40, y1: 75, x2: 555, y2: 75, stroke: '#33334d', strokeWidth: 1 },
        { type: 'image', dataBinding: '{{gallery_1}}', left: 40, top: 100, width: 335, height: 260 },
        { type: 'image', dataBinding: '{{gallery_2}}', left: 395, top: 100, width: 160, height: 120 },
        { type: 'image', dataBinding: '{{gallery_3}}', left: 395, top: 240, width: 160, height: 120 },
        
        { type: 'textbox', dataBinding: 'KEY FEATURES & AMENITIES', left: 40, top: 400, fill: '#d4af37', fontSize: 18, fontFamily: 'Playfair Display', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: '{{highlights}}', left: 40, top: 435, width: 515, fill: '#ffffff', fontSize: 14, fontFamily: 'Inter', lineHeight: 2.0 },
        
        { type: 'rect', left: 40, top: 600, width: 515, height: 150, fill: '#24243e', stroke: '#d4af37', strokeWidth: 1 },
        { type: 'textbox', dataBinding: 'SCHEDULE A PRIVATE SHOWING', left: 60, top: 630, fill: '#d4af37', fontSize: 16, fontFamily: 'Playfair Display', fontWeight: 'bold', width: 475, textAlign: 'center' },
        { type: 'textbox', dataBinding: 'Contact {{agent_name}} today to arrange a tour of {{title}}.', left: 60, top: 660, fill: '#aaaaaa', fontSize: 12, fontFamily: 'Inter', width: 475, textAlign: 'center' },
        { type: 'textbox', dataBinding: '{{agent_phone}}', left: 60, top: 690, fill: '#ffffff', fontSize: 18, fontFamily: 'Montserrat', fontWeight: 'bold', width: 475, textAlign: 'center' },
      ]
    }
  ]
};
