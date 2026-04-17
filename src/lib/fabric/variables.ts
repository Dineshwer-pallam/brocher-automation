export type VariableCategory = 'Property Details' | 'Room Details' | 'Agent Details' | 'Company Details' | 'Other';

export interface TextVariable {
  id: string;
  label: string;
  category: VariableCategory;
}

export const textVariables: TextVariable[] = [
  // Property Details
  { id: 'title', label: 'Property Title', category: 'Property Details' },
  { id: 'address', label: 'Address', category: 'Property Details' },
  { id: 'price', label: 'Price', category: 'Property Details' },
  { id: 'bedrooms', label: 'Bedrooms', category: 'Property Details' },
  { id: 'bathrooms', label: 'Bathrooms', category: 'Property Details' },
  { id: 'area', label: 'Area', category: 'Property Details' },
  { id: 'description', label: 'Description', category: 'Property Details' },
  { id: 'highlights', label: 'Highlights', category: 'Property Details' },
  { id: 'building_info', label: 'Building Info', category: 'Property Details' },
  
  // Room Details
  { id: 'entrance_hall', label: 'Entrance Hall', category: 'Room Details' },
  { id: 'kitchen_lounge', label: 'Kitchen/Lounge', category: 'Room Details' },
  { id: 'bedroom_one', label: 'Bedroom One', category: 'Room Details' },
  { id: 'en_suite', label: 'En-Suite', category: 'Room Details' },
  { id: 'bedroom_two', label: 'Bedroom Two', category: 'Room Details' },
  { id: 'bathroom_details', label: 'Bathroom Details', category: 'Room Details' },
  { id: 'externally', label: 'Externally', category: 'Room Details' },
  
  // Agent Details
  { id: 'agent_name', label: 'Agent Name', category: 'Agent Details' },
  { id: 'agent_phone', label: 'Agent Phone', category: 'Agent Details' },
  { id: 'agent_email', label: 'Agent Email', category: 'Agent Details' },
  
  // Company Details
  { id: 'company_name', label: 'Company Name', category: 'Company Details' },
  { id: 'company_website', label: 'Company Website', category: 'Company Details' },
  
  // Other
  { id: 'additional_info', label: 'Additional Info', category: 'Other' },
  { id: 'agents_notes', label: 'Agents Notes', category: 'Other' },
  { id: 'disclaimer', label: 'Disclaimer', category: 'Other' },
  { id: 'viewing_arrangements', label: 'Viewing Arrangements', category: 'Other' },
];
