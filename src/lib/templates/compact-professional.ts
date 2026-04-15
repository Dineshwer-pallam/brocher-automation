import { BrochureTemplate } from '../../types';

export const compactProfessionalTemplate: BrochureTemplate = {
  id: 'compact-professional',
  name: 'Compact Professional',
  mood: 'Corporate, structured, reliable',
  pages: [
    {
      pageNumber: 1,
      background: '#ffffff',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 595, height: 120, fill: '#0a2540' },
        { type: 'image', dataBinding: '{{company_logo}}', left: 40, top: 35, width: 120, height: 50 },
        { type: 'textbox', dataBinding: '{{company_name}}', left: 430, top: 50, fill: '#ffffff', fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold', width: 125, textAlign: 'right' },
        
        { type: 'image', dataBinding: '{{hero_image}}', left: 40, top: 150, width: 515, height: 280 },
        
        { type: 'textbox', dataBinding: 'PROPERTY HIGHLIGHTS', left: 40, top: 460, fill: '#0a2540', fontSize: 16, fontFamily: 'Roboto', fontWeight: 'bold' },
        { type: 'line', x1: 40, y1: 485, x2: 250, y2: 485, stroke: '#e5e7eb', strokeWidth: 2 },
        { type: 'textbox', dataBinding: '{{title}}', left: 40, top: 500, width: 250, fill: '#111827', fontSize: 24, fontFamily: 'Roboto', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: '{{price}}', left: 40, top: 570, fill: '#2563eb', fontSize: 20, fontFamily: 'Roboto', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: '{{address}}', left: 40, top: 605, width: 250, fill: '#6b7280', fontSize: 12, fontFamily: 'Roboto' },
        
        { type: 'rect', left: 320, top: 460, width: 235, height: 160, fill: '#f8fafc', stroke: '#e2e8f0', strokeWidth: 1 },
        { type: 'textbox', dataBinding: 'PROPERTY DETAILS', left: 340, top: 480, fill: '#0a2540', fontSize: 12, fontFamily: 'Roboto', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: 'Bedrooms:', left: 340, top: 520, fill: '#64748b', fontSize: 11, fontFamily: 'Roboto' },
        { type: 'textbox', dataBinding: '{{bedrooms}}', left: 430, top: 520, fill: '#0f172a', fontSize: 11, fontFamily: 'Roboto', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: 'Bathrooms:', left: 340, top: 545, fill: '#64748b', fontSize: 11, fontFamily: 'Roboto' },
        { type: 'textbox', dataBinding: '{{bathrooms}}', left: 430, top: 545, fill: '#0f172a', fontSize: 11, fontFamily: 'Roboto', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: 'Total Area:', left: 340, top: 570, fill: '#64748b', fontSize: 11, fontFamily: 'Roboto' },
        { type: 'textbox', dataBinding: '{{area}}', left: 430, top: 570, fill: '#0f172a', fontSize: 11, fontFamily: 'Roboto', fontWeight: 'bold' },
        
        { type: 'textbox', dataBinding: 'DESCRIPTION', left: 40, top: 660, fill: '#0a2540', fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: '{{description}}', left: 40, top: 685, width: 515, fill: '#475569', fontSize: 11, fontFamily: 'Roboto', lineHeight: 1.5 },
      ]
    },
    {
      pageNumber: 2,
      background: '#ffffff',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 595, height: 40, fill: '#0a2540' },
        
        { type: 'image', dataBinding: '{{gallery_1}}', left: 40, top: 80, width: 250, height: 180 },
        { type: 'image', dataBinding: '{{gallery_2}}', left: 305, top: 80, width: 250, height: 180 },
        { type: 'image', dataBinding: '{{gallery_3}}', left: 40, top: 280, width: 250, height: 180 },
        
        { type: 'rect', left: 305, top: 280, width: 250, height: 180, fill: '#f8fafc', stroke: '#e2e8f0', strokeWidth: 1 },
        { type: 'textbox', dataBinding: 'KEY AMENITIES', left: 325, top: 300, fill: '#0a2540', fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: '{{highlights}}', left: 325, top: 330, width: 210, fill: '#475569', fontSize: 11, fontFamily: 'Roboto', lineHeight: 1.8 },
        
        { type: 'rect', left: 0, top: 550, width: 595, height: 300, fill: '#f1f5f9' },
        { type: 'textbox', dataBinding: 'CONTACT INFORMATION', left: 40, top: 580, fill: '#0a2540', fontSize: 16, fontFamily: 'Roboto', fontWeight: 'bold' },
        { type: 'line', x1: 40, y1: 610, x2: 555, y2: 610, stroke: '#cbd5e1', strokeWidth: 1 },
        
        { type: 'circle', dataBinding: '{{agent_photo}}', left: 40, top: 640, radius: 45, isClipPath: true },
        { type: 'image', dataBinding: '{{agent_photo}}', left: 40, top: 640, width: 90, height: 90 },
        
        { type: 'textbox', dataBinding: '{{agent_name}}', left: 150, top: 650, fill: '#0f172a', fontSize: 18, fontFamily: 'Roboto', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: 'Licensed Real Estate Agent', left: 150, top: 675, fill: '#64748b', fontSize: 11, fontFamily: 'Roboto' },
        { type: 'textbox', dataBinding: 'Phone: {{agent_phone}}', left: 150, top: 700, fill: '#334155', fontSize: 12, fontFamily: 'Roboto' },
        { type: 'textbox', dataBinding: 'Email: {{agent_email}}', left: 150, top: 720, fill: '#334155', fontSize: 12, fontFamily: 'Roboto' },
        
        { type: 'textbox', dataBinding: '{{company_name}}', left: 400, top: 650, fill: '#0f172a', fontSize: 12, fontFamily: 'Roboto', fontWeight: 'bold' },
        { type: 'image', dataBinding: '{{company_logo}}', left: 400, top: 675, width: 120, height: 60 },
      ]
    }
  ]
};
