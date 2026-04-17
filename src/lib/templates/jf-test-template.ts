import { BrochureTemplate } from '../../types';

export const jfTestTemplate: BrochureTemplate = {
  id: 'jf-test-template',
  name: 'JF Test Template',
  mood: 'Classic JF Layout - Landscape',
  width: 842,
  height: 595,
  pages: [
    // Page 1: Hero Cover (Landscape)
    {
      pageNumber: 1,
      background: '#ffffff',
      objects: [
        { type: 'image', dataBinding: '{{hero_image}}', left: 0, top: 0, width: 842, height: 500 },
        { type: 'rect', left: 0, top: 495, width: 842, height: 100, fill: '#003882' },
        { type: 'image', dataBinding: '/images/company_logo.png', left: 680, top: 510, width: 120, height: 75 }
      ]
    },
    // Page 2: Text Specs with White Panel on Red (Landscape)
    {
      pageNumber: 2,
      background: '#BA1C21',
      objects: [
        { type: 'rect', left: 20, top: 20, width: 802, height: 555, fill: '#ffffff' },
        { type: 'image', dataBinding: '/images/company_logo.png', left: 40, top: 40, width: 100, height: 60 },
        { type: 'textbox', dataBinding: '{{address}}', left: 160, top: 40, width: 622, fontSize: 24, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'right', fill: '#003882' },
        { type: 'textbox', dataBinding: 'Asking Price {{price}}', left: 160, top: 80, width: 622, fontSize: 18, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'right', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{description}}', left: 40, top: 130, width: 750, fontSize: 13, fontFamily: 'Inter', lineHeight: 1.4, fill: '#000000' },
        
        // Spec Columns - 3 Column Layout for Landscape
        { type: 'textbox', dataBinding: 'The Building', left: 40, top: 260, width: 230, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{building_info}}', left: 40, top: 280, width: 230, fontSize: 11, lineheight: 1.3, fill: '#333333' },
        
        { type: 'textbox', dataBinding: 'Entrance Hall', left: 290, top: 260, width: 230, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{entrance_hall}}', left: 290, top: 280, width: 230, fontSize: 11, lineheight: 1.3, fill: '#333333' },
        
        { type: 'textbox', dataBinding: 'Kitchen / Lounge', left: 540, top: 260, width: 230, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{kitchen_lounge}}', left: 540, top: 280, width: 230, fontSize: 11, lineheight: 1.3, fill: '#333333' },

        { type: 'textbox', dataBinding: 'Bedroom One', left: 40, top: 400, width: 230, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{bedroom_one}}', left: 40, top: 420, width: 230, fontSize: 11, lineheight: 1.3, fill: '#333333' },
        
        { type: 'textbox', dataBinding: 'En-Suite', left: 290, top: 400, width: 230, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{en_suite}}', left: 290, top: 420, width: 230, fontSize: 11, lineheight: 1.3, fill: '#333333' },
        
        { type: 'textbox', dataBinding: 'Bedroom Two', left: 540, top: 400, width: 230, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{bedroom_two}}', left: 540, top: 420, width: 230, fontSize: 11, lineheight: 1.3, fill: '#333333' }
      ]
    },
    // Page 3: Continued specs
    {
      pageNumber: 3,
      background: '#BA1C21',
      objects: [
        { type: 'rect', left: 20, top: 20, width: 802, height: 555, fill: '#ffffff' },

        { type: 'textbox', dataBinding: 'Bathroom', left: 40, top: 60, width: 230, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{bathroom_details}}', left: 40, top: 80, width: 230, fontSize: 11, lineheight: 1.3, fill: '#333333' },
        
        { type: 'textbox', dataBinding: 'Externals', left: 290, top: 60, width: 230, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{externally}}', left: 290, top: 80, width: 230, fontSize: 11, lineheight: 1.3, fill: '#333333' },
        
        { type: 'textbox', dataBinding: 'Additional Info', left: 540, top: 60, width: 230, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{additional_info}}', left: 540, top: 80, width: 230, fontSize: 11, lineheight: 1.3, fill: '#333333' },

        { type: 'textbox', dataBinding: 'Agents Notes', left: 40, top: 200, width: 230, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{agents_notes}}', left: 40, top: 220, width: 230, fontSize: 11, lineheight: 1.3, fill: '#333333' },

        { type: 'textbox', dataBinding: 'Disclaimer', left: 290, top: 200, width: 230, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{disclaimer}}', left: 290, top: 220, width: 230, fontSize: 11, lineheight: 1.3, fill: '#333333' },

        // EPC Graph Bounds
        { type: 'textbox', dataBinding: 'Energy Performance', left: 40, top: 350, width: 750, fontSize: 14, fontWeight: 'bold', fill: '#BA1C21', textAlign: 'center' },
        { type: 'image', dataBinding: '{{epc_1}}', left: 290, top: 380, width: 120, height: 160 },
        { type: 'image', dataBinding: '{{epc_2}}', left: 430, top: 380, width: 120, height: 160 }
      ]
    },
    // Page 4: Photo Grid 1 (Landscape fit)
    {
      pageNumber: 4,
      background: '#BA1C21',
      objects: [
        { type: 'rect', left: 20, top: 20, width: 802, height: 555, fill: '#ffffff' },
        { type: 'image', dataBinding: '{{gallery_1}}', left: 40, top: 40, width: 370, height: 240 },
        { type: 'image', dataBinding: '{{gallery_2}}', left: 430, top: 40, width: 370, height: 240 },
        { type: 'image', dataBinding: '{{gallery_3}}', left: 40, top: 300, width: 370, height: 240 },
        { type: 'image', dataBinding: '{{gallery_4}}', left: 430, top: 300, width: 370, height: 240 }
      ]
    },
    // Page 5: Floorplan (Centered Landscape)
    {
      pageNumber: 5,
      background: '#ffffff',
      objects: [
        { type: 'textbox', dataBinding: 'Floorplan', left: 40, top: 30, width: 760, fontSize: 24, fontFamily: 'Inter', fontWeight: 'bold', fill: '#003882', textAlign: 'center' },
        { type: 'image', dataBinding: '{{floorplan}}', left: 121, top: 80, width: 600, height: 480 }
      ]
    },
    // Page 6: Photo Grid 2 + Footer Branding
    {
      pageNumber: 6,
      background: '#003882',
      objects: [
        { type: 'image', dataBinding: '{{gallery_5}}', left: 0, top: 0, width: 421, height: 260 },
        { type: 'image', dataBinding: '{{gallery_6}}', left: 421, top: 0, width: 421, height: 260 },
        
        { type: 'image', dataBinding: '/images/company_logo.png', left: 341, top: 320, width: 160, height: 100 },
        { type: 'textbox', dataBinding: '{{viewing_arrangements}}', left: 40, top: 460, width: 760, fontSize: 14, fill: '#ffffff', textAlign: 'center', fontWeight: 'bold' },
        { type: 'textbox', dataBinding: 'Contact {{agent_name}}: {{agent_phone}} | {{agent_email}}', left: 40, top: 490, width: 760, fontSize: 13, fill: '#dddddd', textAlign: 'center' },
        { type: 'textbox', dataBinding: '{{company_website}}', left: 40, top: 520, width: 760, fontSize: 13, fill: '#BA1C21', textAlign: 'center', fontWeight: 'bold' }
      ]
    }
  ]
};
