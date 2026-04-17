import { BrochureTemplate } from '../../types';

export const modernMinimalTemplate: BrochureTemplate = {
  id: 'modern-minimal',
  name: 'Modern Minimal',
  mood: 'Clean, spacious, contemporary',
  pages: [
    {
      pageNumber: 1,
      background: '#ffffff',
      objects: [
        { type: 'image', dataBinding: '{{hero_image}}', left: 40, top: 40, width: 515, height: 400 },
        
        { type: 'textbox', dataBinding: '{{title}}', left: 40, top: 480, width: 515, fill: '#1f2937', fontSize: 36, fontFamily: 'Inter', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: '{{address}}', left: 40, top: 525, width: 515, fill: '#6b7280', fontSize: 14, fontFamily: 'Inter' },
        { type: 'textbox', dataBinding: '{{price}}', left: 40, top: 560, fill: '#3b82f6', fontSize: 24, fontFamily: 'Inter', fontWeight: 'bold' },
        
        { type: 'rect', left: 40, top: 610, width: 515, height: 60, fill: '#f3f4f6' },
        { type: 'textbox', dataBinding: '{{bedrooms}} Beds       |       {{bathrooms}} Baths       |       {{area}}', left: 40, top: 630, fill: '#374151', fontSize: 14, fontFamily: 'Inter', textAlign: 'center', width: 515, fontWeight: 'bold' },
        
        { type: 'textbox', dataBinding: 'OVERVIEW', left: 40, top: 700, fill: '#9ca3af', fontSize: 10, fontFamily: 'Inter', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: '{{description}}', left: 40, top: 720, width: 515, fill: '#4b5563', fontSize: 11, fontFamily: 'Inter', lineHeight: 1.5 },
      ]
    },
    {
      pageNumber: 2,
      background: '#ffffff',
      objects: [
        { type: 'image', dataBinding: '{{gallery_1}}', left: 40, top: 40, width: 250, height: 250 },
        { type: 'image', dataBinding: '{{gallery_2}}', left: 305, top: 40, width: 250, height: 120 },
        { type: 'image', dataBinding: '{{gallery_3}}', left: 305, top: 170, width: 250, height: 120 },
        
        { type: 'textbox', dataBinding: 'FEATURES', left: 40, top: 330, fill: '#9ca3af', fontSize: 10, fontFamily: 'Inter', fontWeight: 'bold' },
        { type: 'line', x1: 40, y1: 350, x2: 555, y2: 350, stroke: '#e5e7eb', strokeWidth: 2 },
        { type: 'textbox', dataBinding: '{{highlights}}', left: 40, top: 370, width: 515, fill: '#4b5563', fontSize: 14, fontFamily: 'Inter', lineHeight: 2 },
        
        { type: 'textbox', dataBinding: 'CONTACT AGENT', left: 40, top: 600, fill: '#9ca3af', fontSize: 10, fontFamily: 'Inter', fontWeight: 'bold' },
        { type: 'line', x1: 40, y1: 620, x2: 555, y2: 620, stroke: '#e5e7eb', strokeWidth: 2 },
        
        { type: 'circle', dataBinding: '{{agent_photo}}', left: 40, top: 640, radius: 45, isClipPath: true },
        { type: 'image', dataBinding: '{{agent_photo}}', left: 40, top: 640, width: 90, height: 90 },
        
        { type: 'textbox', dataBinding: '{{agent_name}}', left: 150, top: 650, fill: '#1f2937', fontSize: 18, fontFamily: 'Inter', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: '{{agent_phone}}', left: 150, top: 680, fill: '#4b5563', fontSize: 14, fontFamily: 'Inter' },
        { type: 'textbox', dataBinding: '{{agent_email}}', left: 150, top: 700, fill: '#4b5563', fontSize: 14, fontFamily: 'Inter' },
        
        { type: 'image', dataBinding: '/images/company_logo.png', left: 450, top: 650, width: 100, height: 50 },
        { type: 'textbox', dataBinding: '{{company_name}}', left: 450, top: 710, fill: '#9ca3af', fontSize: 10, fontFamily: 'Inter', width: 100, textAlign: 'center' }
      ]
    }
  ]
};
