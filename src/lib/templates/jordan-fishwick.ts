import { BrochureTemplate, TemplatePage } from '../../types';

export const jordanFishwickTemplate: BrochureTemplate = {
  id: 'jordan-fishwick',
  name: 'Classic Red & Blue',
  mood: 'Classic, Professional, Real Estate',
  pages: [
    // Page 1: Hero Image + Logo Banner
    {
      pageNumber: 1,
      background: '#ffffff',
      objects: [
        {
          type: 'image',
          dataBinding: '{{hero_image}}',
          left: 0,
          top: 0,
          width: 595,
          height: 730
        },
        {
          type: 'rect',
          left: 0,
          top: 730,
          width: 595,
          height: 112,
          fill: '#BA1C21'
        },
        {
          type: 'image',
          dataBinding: '/images/company_logo.png',
          left: 450,
          top: 740,
          width: 120,
          height: 90
        }
      ]
    },
    // Page 2: Text detail page with red borders
    {
      pageNumber: 2,
      background: '#BA1C21',
      objects: [
        {
          type: 'rect', // The White inner canvas
          left: 20,
          top: 50,
          width: 555,
          height: 742,
          fill: '#ffffff'
        },
        {
          type: 'textbox',
          dataBinding: '{{address}}',
          left: 40,
          top: 80,
          width: 515,
          fontSize: 22,
          fontFamily: 'Inter',
          fontWeight: 'bold',
          textAlign: 'center',
          fill: '#000000'
        },
        {
          type: 'textbox',
          dataBinding: '{{description}}',
          left: 40,
          top: 130,
          width: 515,
          fontSize: 12,
          fontFamily: 'Inter',
          lineHeight: 1.4,
          fill: '#000000'
        },
        {
          type: 'textbox',
          dataBinding: 'Asking Price {{price}}',
          left: 40,
          top: 250,
          width: 515,
          fontSize: 28,
          fontFamily: 'Inter',
          fontWeight: 'bold',
          textAlign: 'center',
          fill: '#000000'
        },
        {
          type: 'textbox',
          dataBinding: '{{viewing_arrangements}}',
          left: 40,
          top: 300,
          width: 515,
          fontSize: 12,
          fontFamily: 'Inter',
          fontWeight: 'bold',
          textAlign: 'center',
          fill: '#003882'
        },
        // Columns Left
        { type: 'textbox', dataBinding: 'The Building', left: 40, top: 380, width: 250, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{building_info}}', left: 40, top: 400, width: 250, fontSize: 11, fill: '#000000' },
        
        { type: 'textbox', dataBinding: 'Entrance Hall', left: 40, top: 480, width: 250, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{entrance_hall}}', left: 40, top: 500, width: 250, fontSize: 11, fill: '#000000' },

        { type: 'textbox', dataBinding: 'Kitchen / Lounge', left: 40, top: 560, width: 250, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{kitchen_lounge}}', left: 40, top: 580, width: 250, fontSize: 11, fill: '#000000' },

        // Columns Right
        { type: 'textbox', dataBinding: 'Bedroom One', left: 305, top: 380, width: 250, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{bedroom_one}}', left: 305, top: 400, width: 250, fontSize: 11, fill: '#000000' },

        { type: 'textbox', dataBinding: 'En-Suite', left: 305, top: 450, width: 250, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{en_suite}}', left: 305, top: 470, width: 250, fontSize: 11, fill: '#000000' },

        { type: 'textbox', dataBinding: 'Bedroom Two', left: 305, top: 530, width: 250, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{bedroom_two}}', left: 305, top: 550, width: 250, fontSize: 11, fill: '#000000' },

        { type: 'textbox', dataBinding: 'Bathroom', left: 305, top: 610, width: 250, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{bathroom_details}}', left: 305, top: 630, width: 250, fontSize: 11, fill: '#000000' },

        { type: 'textbox', dataBinding: 'Externally', left: 305, top: 690, width: 250, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{externally}}', left: 305, top: 710, width: 250, fontSize: 11, fill: '#000000' },

        // Footer
        { type: 'textbox', dataBinding: '{{company_website}}', left: 0, top: 805, width: 595, fontSize: 14, textAlign: 'center', fill: '#ffffff' }
      ]
    },
    // Page 3: Additional details & EPC
    {
      pageNumber: 3,
      background: '#BA1C21',
      objects: [
        { type: 'rect', left: 0, top: 80, width: 595, height: 682, fill: '#ffffff' },

        { type: 'textbox', dataBinding: 'Additional Information', left: 40, top: 120, width: 280, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{additional_info}}', left: 40, top: 140, width: 280, fontSize: 11, fill: '#000000' },

        { type: 'textbox', dataBinding: 'Agents Notes', left: 40, top: 300, width: 280, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{agents_notes}}', left: 40, top: 320, width: 280, fontSize: 11, fill: '#000000' },

        { type: 'textbox', dataBinding: 'Disclaimer', left: 40, top: 400, width: 280, fontSize: 12, fontWeight: 'bold', fill: '#BA1C21' },
        { type: 'textbox', dataBinding: '{{disclaimer}}', left: 40, top: 420, width: 280, fontSize: 11, fill: '#000000' },

        // EPC Graphs (dummy layout based on standard graphs usually spanning width)
        { type: 'image', dataBinding: '{{epc_1}}', left: 350, top: 550, width: 100, height: 100 },
        { type: 'image', dataBinding: '{{epc_2}}', left: 460, top: 550, width: 100, height: 100 },

        // Footer
        { type: 'textbox', dataBinding: 'Email: {{agent_email}}', left: 0, top: 780, width: 595, fontSize: 14, textAlign: 'center', fill: '#ffffff' }
      ]
    },
    // Page 4: Photo Grid 1
    {
      pageNumber: 4,
      background: '#BA1C21',
      objects: [
        { type: 'rect', left: 20, top: 50, width: 555, height: 742, fill: '#ffffff' },
        { type: 'image', dataBinding: '{{gallery_1}}', left: 30, top: 60, width: 260, height: 350 },
        { type: 'image', dataBinding: '{{gallery_2}}', left: 305, top: 60, width: 260, height: 350 },
        { type: 'image', dataBinding: '{{gallery_3}}', left: 30, top: 420, width: 260, height: 350 },
        { type: 'image', dataBinding: '{{gallery_4}}', left: 305, top: 420, width: 260, height: 350 }
      ]
    },
    // Page 5: Floorplan
    {
      pageNumber: 5,
      background: '#BA1C21',
      objects: [
        { type: 'rect', left: 20, top: 50, width: 555, height: 680, fill: '#ffffff' },
        { type: 'image', dataBinding: '{{floorplan}}', left: 77.5, top: 100, width: 440, height: 440 },
        { type: 'rect', left: 0, top: 730, width: 595, height: 112, fill: '#003882' },
        { type: 'image', dataBinding: '/images/company_logo.png', left: 30, top: 740, width: 100, height: 80 },
        { type: 'textbox', dataBinding: '{{company_name}}', left: 340, top: 750, width: 230, fontSize: 12, fill: '#ffffff', textAlign: 'right' },
        { type: 'textbox', dataBinding: 'T: {{agent_phone}}', left: 340, top: 770, width: 230, fontSize: 16, fontWeight: 'bold', fill: '#ffffff', textAlign: 'right' },
        { type: 'textbox', dataBinding: '{{company_website}}', left: 340, top: 790, width: 230, fontSize: 12, fill: '#ffffff', textAlign: 'right' }
      ]
    },
    // Page 6: Photo Grid 2
    {
      pageNumber: 6,
      background: '#BA1C21',
      objects: [
        { type: 'rect', left: 20, top: 50, width: 555, height: 742, fill: '#ffffff' },
        { type: 'image', dataBinding: '{{gallery_5}}', left: 30, top: 60, width: 260, height: 350 },
        { type: 'image', dataBinding: '{{gallery_6}}', left: 305, top: 60, width: 260, height: 350 },
        { type: 'image', dataBinding: '{{gallery_7}}', left: 30, top: 420, width: 260, height: 350 },
        { type: 'image', dataBinding: '{{gallery_8}}', left: 305, top: 420, width: 260, height: 350 }
      ]
    }
  ]
};
