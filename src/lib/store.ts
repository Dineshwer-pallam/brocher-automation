import { create } from 'zustand';
import { PropertyData } from '../types';

interface AppState {
  // Property State
  propertyData: PropertyData;
  setProperty: (field: keyof PropertyData, value: any) => void;
  setNestedProperty: (parent: 'agent' | 'company', field: keyof PropertyData['agent'] | keyof PropertyData['company'], value: any) => void;
  addImage: (file: File) => void;
  removeImage: (id: string) => void;
  reorderImages: (fromIndex: number, toIndex: number) => void;

  // Template State
  selectedTemplateId: string | null;
  selectTemplate: (id: string) => void;

  // Editor State
  currentPage: number;
  zoom: number;
  showGrid: boolean;
  snapToGrid: boolean;
  setPage: (page: number) => void;
  setZoom: (zoom: number) => void;
  toggleGrid: () => void;
  toggleSnap: () => void;
}

const defaultPropertyData: PropertyData = {
  title: '',
  propertyType: 'villa',
  price: 0,
  currency: 'USD',
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  areaUnit: 'sqft',
  address: '',
  description: '',
  highlights: [],
  buildingInfo: '',
  entranceHall: '',
  kitchenLounge: '',
  bedroomOne: '',
  enSuite: '',
  bedroomTwo: '',
  bathroomDetails: '',
  externally: '',
  additionalInfo: '',
  agentsNotes: '',
  disclaimer: '',
  viewingArrangements: '',
  images: [],
  agent: { name: '', phone: '', email: '', photoUrl: '' },
  company: { name: '', logoUrl: '', website: '' },
};

export const useAppStore = create<AppState>((set) => ({
  // Property State
  propertyData: defaultPropertyData,
  setProperty: (field, value) => 
    set((state) => ({ propertyData: { ...state.propertyData, [field]: value } })),
  setNestedProperty: (parent, field, value) => 
    set((state) => ({
      propertyData: {
        ...state.propertyData,
        [parent]: { ...state.propertyData[parent], [field]: value }
      }
    })),
  addImage: (file) => 
    set((state) => {
      const url = URL.createObjectURL(file);
      const newImage = {
        id: Math.random().toString(36).substring(7),
        url,
        file,
        displayOrder: state.propertyData.images.length,
      };
      return { propertyData: { ...state.propertyData, images: [...state.propertyData.images, newImage] } };
    }),
  removeImage: (id) => 
    set((state) => {
      const imageToRevoke = state.propertyData.images.find(img => img.id === id);
      if (imageToRevoke?.url) URL.revokeObjectURL(imageToRevoke.url);
      
      const filtered = state.propertyData.images.filter(img => img.id !== id);
      const reordered = filtered.map((img, idx) => ({ ...img, displayOrder: idx }));
      
      return { propertyData: { ...state.propertyData, images: reordered } };
    }),
  reorderImages: (fromIndex, toIndex) => 
    set((state) => {
      const images = [...state.propertyData.images];
      const [movedItem] = images.splice(fromIndex, 1);
      images.splice(toIndex, 0, movedItem);
      const reordered = images.map((img, idx) => ({ ...img, displayOrder: idx }));
      return { propertyData: { ...state.propertyData, images: reordered } };
    }),

  // Template State
  selectedTemplateId: null,
  selectTemplate: (id) => set({ selectedTemplateId: id }),

  // Editor State
  currentPage: 1,
  zoom: 1,
  showGrid: false,
  snapToGrid: false,
  setPage: (page) => set({ currentPage: page }),
  setZoom: (zoom) => set({ zoom }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleSnap: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
}));
