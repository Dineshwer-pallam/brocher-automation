export interface PropertyImage {
  id: string;
  url: string;
  file?: File;
  displayOrder: number;
}

export interface PropertyData {
  title: string;
  propertyType: 'villa' | 'apartment' | 'penthouse' | 'townhouse' | 'commercial';
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: 'sqft' | 'sqm';
  address: string;
  description: string;
  highlights: string[];
  images: PropertyImage[];
  agent: {
    name: string;
    phone: string;
    email: string;
    photoUrl: string;
    photoFile?: File;
  };
  company: {
    name: string;
    logoUrl: string;
    logoFile?: File;
  };
}

export interface TemplateObject {
  type: string;
  dataBinding?: string | string[] | Record<string, string>;
  left: number;
  top: number;
  width?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  textAlign?: string;
  lineHeight?: number;
  rx?: number;
  ry?: number;
  radius?: number;
  scaleX?: number;
  scaleY?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  [key: string]: any;
}

export interface TemplatePage {
  pageNumber: number;
  background: string;
  objects: TemplateObject[];
}

export interface BrochureTemplate {
  id: string;
  name: string;
  mood: string;
  pages: TemplatePage[];
}
