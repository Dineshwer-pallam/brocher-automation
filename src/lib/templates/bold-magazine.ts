import { BrochureTemplate } from '../../types';

export const boldMagazineTemplate: BrochureTemplate = {
  id: 'bold-magazine',
  name: 'Bold Magazine',
  mood: 'Vibrant, editorial, striking',
  pages: [
    {
      pageNumber: 1,
      background: '#e9e9e9',
      objects: [
        { type: 'image', dataBinding: '{{hero_image}}', left: 20, top: 20, width: 555, height: 750 },
        { type: 'rect', left: 20, top: 400, width: 400, height: 370, fill: '#ff4d4d' },
        
        { type: 'textbox', dataBinding: 'NEW LISTING', left: 40, top: 430, fill: '#ffffff', fontSize: 14, fontFamily: 'Oswald', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: '{{title}}', left: 40, top: 460, width: 350, fill: '#ffffff', fontSize: 42, fontFamily: 'Oswald', fontWeight: 'bold', lineHeight: 1.1 },
        { type: 'textbox', dataBinding: '{{price}}', left: 40, top: 580, fill: '#000000', fontSize: 32, fontFamily: 'Oswald', fontWeight: 'bold' },
        
        { type: 'textbox', dataBinding: '{{bedrooms}} BD  |  {{bathrooms}} BA  |  {{area}}', left: 40, top: 640, fill: '#ffffff', fontSize: 16, fontFamily: 'Inter', fontWeight: 'bold' },
        
        { type: 'rect', left: 420, top: 620, width: 135, height: 130, fill: '#ffffff' },
        { type: 'image', dataBinding: '/images/company_logo.png', left: 430, top: 640, width: 110, height: 60 },
        { type: 'textbox', dataBinding: '{{company_name}}', left: 430, top: 710, width: 110, fill: '#000000', fontSize: 10, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center' }
      ]
    },
    {
      pageNumber: 2,
      background: '#ffffff',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 595, height: 100, fill: '#ff4d4d' },
        { type: 'textbox', dataBinding: 'PROPERTY DETAILS', left: 40, top: 35, fill: '#ffffff', fontSize: 24, fontFamily: 'Oswald', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: '{{address}}', left: 40, top: 70, fill: '#ffffff', fontSize: 11, fontFamily: 'Inter' },
        
        { type: 'textbox', dataBinding: '{{description}}', left: 40, top: 130, width: 300, fill: '#333333', fontSize: 12, fontFamily: 'Inter', lineHeight: 1.8 },
        
        { type: 'image', dataBinding: '{{gallery_1}}', left: 360, top: 130, width: 195, height: 195 },
        { type: 'image', dataBinding: '{{gallery_2}}', left: 40, top: 350, width: 300, height: 200 },
        { type: 'image', dataBinding: '{{gallery_3}}', left: 360, top: 350, width: 195, height: 200 },
        
        { type: 'textbox', dataBinding: 'AMENITIES', left: 40, top: 580, fill: '#ff4d4d', fontSize: 20, fontFamily: 'Oswald', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: '{{highlights}}', left: 40, top: 610, width: 300, fill: '#333333', fontSize: 12, fontFamily: 'Inter', lineHeight: 2.2 },
        
        { type: 'circle', dataBinding: '{{agent_photo}}', left: 380, top: 580, radius: 45, isClipPath: true },
        { type: 'image', dataBinding: '{{agent_photo}}', left: 380, top: 580, width: 90, height: 90 },
        { type: 'textbox', dataBinding: '{{agent_name}}', left: 360, top: 685, width: 130, fill: '#000000', fontSize: 16, fontFamily: 'Oswald', fontWeight: 'bold', textAlign: 'center' },
        { type: 'textbox', dataBinding: '{{agent_phone}}', left: 360, top: 710, width: 130, fill: '#666666', fontSize: 11, fontFamily: 'Inter', textAlign: 'center' },
        { type: 'textbox', dataBinding: '{{agent_email}}', left: 360, top: 730, width: 130, fill: '#666666', fontSize: 11, fontFamily: 'Inter', textAlign: 'center' },
      ]
    }
  ]
};
