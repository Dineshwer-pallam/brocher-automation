"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/lib/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical, ImagePlus } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  propertyType: z.enum(['villa', 'apartment', 'penthouse', 'townhouse', 'commercial']),
  price: z.number().min(1, 'Price must be greater than 0'),
  currency: z.string(),
  bedrooms: z.number().min(1, 'Required'),
  bathrooms: z.number().min(1, 'Required'),
  area: z.number().min(1, 'Required'),
  areaUnit: z.enum(['sqft', 'sqm']),
  address: z.string().min(1, 'Address is required'),
  description: z.string().min(10, 'Description needs to be at least 10 characters'),
  agentName: z.string().min(1, 'Agent Name is required'),
  agentPhone: z.string().optional(),
  agentEmail: z.string().email('Invalid email').or(z.literal('')),
  companyName: z.string().optional(),
  companyWebsite: z.string().optional(),
  buildingInfo: z.string().optional(),
  entranceHall: z.string().optional(),
  kitchenLounge: z.string().optional(),
  bedroomOne: z.string().optional(),
  enSuite: z.string().optional(),
  bedroomTwo: z.string().optional(),
  bathroomDetails: z.string().optional(),
  externally: z.string().optional(),
  additionalInfo: z.string().optional(),
  agentsNotes: z.string().optional(),
  disclaimer: z.string().optional(),
  viewingArrangements: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function SortableImageItem({ id, url, onRemove, index }: { id: string; url: string; onRemove: (id: string) => void; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="relative group rounded-lg overflow-hidden border bg-white aspect-video flex-shrink-0 w-32 h-24">
      <img src={url} alt={`Property upload ${id}`} className="object-cover w-full h-full" />
      {index === 0 && (
        <span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shadow">
          Hero
        </span>
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button type="button" {...attributes} {...listeners} className="p-1.5 bg-white rounded-md text-gray-700 hover:text-blue-600 cursor-grab">
          <GripVertical size={16} />
        </button>
        <button type="button" onClick={() => onRemove(id)} className="p-1.5 bg-white rounded-md text-red-500 hover:bg-red-50">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default function CreatePropertyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';
  const store = useAppStore();
  const [highlights, setHighlights] = useState<string[]>(store.propertyData.highlights || []);
  const [highlightInput, setHighlightInput] = useState('');

  const { register, handleSubmit, control, formState: { errors, isValid }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      title: store.propertyData.title,
      propertyType: store.propertyData.propertyType,
      price: store.propertyData.price || undefined,
      currency: store.propertyData.currency,
      bedrooms: store.propertyData.bedrooms || undefined,
      bathrooms: store.propertyData.bathrooms || undefined,
      area: store.propertyData.area || undefined,
      areaUnit: store.propertyData.areaUnit,
      address: store.propertyData.address,
      description: store.propertyData.description,
      agentName: store.propertyData.agent.name,
      agentPhone: store.propertyData.agent.phone,
      agentEmail: store.propertyData.agent.email,
      companyName: store.propertyData.company.name,
      companyWebsite: store.propertyData.company.website,
      buildingInfo: store.propertyData.buildingInfo,
      entranceHall: store.propertyData.entranceHall,
      kitchenLounge: store.propertyData.kitchenLounge,
      bedroomOne: store.propertyData.bedroomOne,
      enSuite: store.propertyData.enSuite,
      bedroomTwo: store.propertyData.bedroomTwo,
      bathroomDetails: store.propertyData.bathroomDetails,
      externally: store.propertyData.externally,
      additionalInfo: store.propertyData.additionalInfo,
      agentsNotes: store.propertyData.agentsNotes,
      disclaimer: store.propertyData.disclaimer,
      viewingArrangements: store.propertyData.viewingArrangements,
    }
  });

  useEffect(() => {
    if (isDemo && !store.propertyData.title) {
      // Pre-fill demo data
      const demoData = {
        title: 'Majestic Oceanfront Villa',
        propertyType: 'villa' as const,
        price: 8500000,
        currency: 'USD',
        bedrooms: 6,
        bathrooms: 8,
        area: 12500,
        areaUnit: 'sqft' as const,
        address: '123 Palm Beach Drive, FL 33480',
        description: 'Experience unparalleled luxury in this modern oceanfront masterpiece. Featuring panoramic water views, a private beach, infinity pool, and state-of-the-art smart home integration. Meticulously designed with imported Italian marble and custom European cabinetry.',
        agentName: 'Sarah Jenkins',
        agentPhone: '+1 (555) 123-4567',
        agentEmail: 'sarah@luxuryestates.com',
        companyName: 'Luxury Estates International',
        companyWebsite: 'www.luxuryestates.com',
        buildingInfo: 'A stunning modern development situated in the heart of the city.',
        entranceHall: 'Grand entrance foyer with double-height ceilings and marble flooring.',
        kitchenLounge: 'Open-concept luxury kitchen with integrated appliances and panoramic views.',
        bedroomOne: 'Spacious master suite featuring floor-to-ceiling windows and custom closets.',
        enSuite: 'Luxurious spa-like en-suite bathroom with dual vanities and soaking tub.',
        bedroomTwo: 'Generous second bedroom with ample natural light and built-in storage.',
        bathroomDetails: 'Modern family bathroom with high-end fixtures and rain shower.',
        externally: 'Private landscaped gardens with an infinity edge pool and dining terrace.',
        additionalInfo: 'Property features smart home integration and central air conditioning.',
        agentsNotes: 'A rare opportunity to acquire a property of this caliber in this location.',
        disclaimer: 'All measurements are approximate and for display purposes only.',
        viewingArrangements: 'Viewing strictly by appointment through Luxury Estates International.'
      };
      
      Object.entries(demoData).forEach(([k, v]) => setValue(k as any, v, { shouldValidate: true }));
      setHighlights(['Infinity Pool', 'Private Beach', 'Smart Home', 'Wine Cellar']);
      
      // We can't automatically add File objects from URLs safely in browser without fetching,
      // so for demo images, the generic components will handle placeholders perfectly if arrays are empty,
      // or we can manually add mock blobs:
      const mockImagesAsync = async () => {
        try {
          // Fetch placehold.co images and create Files
          const urls = [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', // hero
            'https://images.unsplash.com/photo-1600607687930-cef5694d11cf?w=800&q=80', // gal 1
            'https://images.unsplash.com/photo-1600566753086-00f18efc2291?w=800&q=80', // gal 2
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', // gal 3
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', // gal 4
            'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80', // gal 5
            'https://images.unsplash.com/photo-1600563438938-a9a27216b3f5?w=800&q=80', // gal 6
            'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', // gal 7
            'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80', // gal 8
            'https://images.unsplash.com/photo-1541888048600-50d4fbb11ad9?w=800&q=80', // epc_2
            'https://images.unsplash.com/photo-1555529733-0e670560f4e1?w=800&q=80', // epc_1
            'https://images.unsplash.com/photo-1600607688969-a5bfcd20fa77?w=800&q=80'  // floorplan
          ];
          for (let i = 0; i < urls.length; i++) {
             const res = await fetch(urls[i]);
             const blob = await res.blob();
             const file = new File([blob], `demo-img-${i}.jpg`, { type: 'image/jpeg' });
             store.addImage(file);
          }
        } catch (e) {
          console.error("Failed to load demo images", e);
        }
      };
      
      if (store.propertyData.images.length === 0) mockImagesAsync();
      
      if (!store.propertyData.agent.photoUrl) {
        store.setNestedProperty('agent', 'photoUrl', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80');
      }
      if (!store.propertyData.company.logoUrl) {
        store.setNestedProperty('company', 'logoUrl', 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png');
      }
    }
  }, [isDemo, setValue, store]);

  const onSubmit = (data: FormData) => {
    store.setProperty('title', data.title);
    store.setProperty('propertyType', data.propertyType);
    store.setProperty('price', data.price);
    store.setProperty('currency', data.currency);
    store.setProperty('bedrooms', data.bedrooms);
    store.setProperty('bathrooms', data.bathrooms);
    store.setProperty('area', data.area);
    store.setProperty('areaUnit', data.areaUnit);
    store.setProperty('address', data.address);
    store.setProperty('description', data.description);
    store.setProperty('highlights', highlights);
    store.setProperty('buildingInfo', data.buildingInfo || '');
    store.setProperty('entranceHall', data.entranceHall || '');
    store.setProperty('kitchenLounge', data.kitchenLounge || '');
    store.setProperty('bedroomOne', data.bedroomOne || '');
    store.setProperty('enSuite', data.enSuite || '');
    store.setProperty('bedroomTwo', data.bedroomTwo || '');
    store.setProperty('bathroomDetails', data.bathroomDetails || '');
    store.setProperty('externally', data.externally || '');
    store.setProperty('additionalInfo', data.additionalInfo || '');
    store.setProperty('agentsNotes', data.agentsNotes || '');
    store.setProperty('disclaimer', data.disclaimer || '');
    store.setProperty('viewingArrangements', data.viewingArrangements || '');
    
    store.setNestedProperty('agent', 'name', data.agentName);
    store.setNestedProperty('agent', 'phone', data.agentPhone || '');
    store.setNestedProperty('agent', 'email', data.agentEmail || '');
    
    store.setNestedProperty('company', 'name', data.companyName || '');
    store.setNestedProperty('company', 'website', data.companyWebsite || '');

    router.push('/templates');
  };

  const handleHighlightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightInput.trim() && highlights.length < 6) {
        setHighlights([...highlights, highlightInput.trim()]);
        setHighlightInput('');
      }
    }
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  // Image Dropzone
  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      if (store.propertyData.images.length < 12) {
        store.addImage(file);
      }
    });
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    maxSize: 5242880,
    maxFiles: 12
  });

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = store.propertyData.images.findIndex((i) => i.id === active.id);
      const newIndex = store.propertyData.images.findIndex((i) => i.id === over.id);
      store.reorderImages(oldIndex, newIndex);
    }
  };

  const currentDesc = watch('description') || '';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">Property Details</h1>
          <p className="mt-2 text-sm text-gray-500">Enter the core information for your property brochure.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="bg-white px-6 py-8 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">1. Core Information</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label className="block text-sm font-medium text-gray-700">Property Title</label>
                <div className="mt-2">
                  <input {...register('title')} className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Property Type</label>
                <div className="mt-2">
                  <select {...register('propertyType')} className="block w-full rounded-md border-0 py-2 sm:py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm">
                    <option value="villa">Villa</option>
                    <option value="apartment">Apartment</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <select {...register('currency')} className="rounded-l-md border-r-0 ring-1 ring-inset ring-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm focus:ring-2 focus:ring-inset focus:ring-blue-600 outline-none">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="AED">AED</option>
                  </select>
                  <input type="number" {...register('price', { valueAsNumber: true })} className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="0" />
                </div>
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <div className="mt-2">
                  <input {...register('address')} className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                <div className="mt-2">
                  <input type="number" {...register('bedrooms', { valueAsNumber: true })} min={1} max={20} className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                  {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                <div className="mt-2">
                  <input type="number" {...register('bathrooms', { valueAsNumber: true })} min={1} max={20} className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                  {errors.bathrooms && <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Total Area</label>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <input type="number" {...register('area', { valueAsNumber: true })} className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                  <select {...register('areaUnit')} className="rounded-r-md border-l-0 ring-1 ring-inset ring-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm focus:ring-2 focus:ring-inset focus:ring-blue-600 outline-none">
                    <option value="sqft">sq ft</option>
                    <option value="sqm">sq m</option>
                  </select>
                </div>
                {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white px-6 py-8 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">2. Description</h2>
            <div>
              <textarea {...register('description')} rows={6} placeholder="Describe the property..." className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"></textarea>
              <div className="mt-1 flex justify-between">
                <div>{errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}</div>
                <p className="text-xs text-gray-500">{currentDesc.length} characters</p>
              </div>
            </div>
          </div>

          <div className="bg-white px-6 py-8 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">3. Key Highlights</h2>
            <div>
              <p className="text-sm text-gray-500 mb-2">Press Enter to add up to 6 key highlights.</p>
              <input
                type="text"
                disabled={highlights.length >= 6}
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                onKeyDown={handleHighlightKeyDown}
                placeholder={highlights.length >= 6 ? "Max 6 highlights reached" : "e.g., Infinity Pool (Press enter)"}
                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {highlights.map((h, i) => (
                  <span key={i} className="inline-flex items-center gap-x-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {h}
                    <button type="button" onClick={() => removeHighlight(i)} className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-blue-600/20">
                      <span className="sr-only">Remove</span>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white px-6 py-8 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">4. Detailed Rooms & Info</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              {[
                { key: 'buildingInfo', label: 'Building Info', type: 'text' },
                { key: 'entranceHall', label: 'Entrance Hall', type: 'text' },
                { key: 'kitchenLounge', label: 'Kitchen / Lounge', type: 'text' },
                { key: 'bedroomOne', label: 'Bedroom One', type: 'text' },
                { key: 'enSuite', label: 'En-Suite', type: 'text' },
                { key: 'bedroomTwo', label: 'Bedroom Two', type: 'text' },
                { key: 'bathroomDetails', label: 'Bathroom', type: 'text' },
                { key: 'externally', label: 'Externally', type: 'text' },
                { key: 'viewingArrangements', label: 'Viewing Arrangements', type: 'text' }
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                  <div className="mt-2">
                    <input {...register(field.key as any)} className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                  </div>
                </div>
              ))}
              {[
                { key: 'additionalInfo', label: 'Additional Info' },
                { key: 'agentsNotes', label: 'Agents Notes' },
                { key: 'disclaimer', label: 'Disclaimer' }
              ].map(field => (
                <div key={field.key} className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                  <div className="mt-2">
                    <textarea {...register(field.key as any)} rows={3} className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"></textarea>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white px-6 py-8 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">5. Property Images</h2>
            
            <div {...getRootProps()} className={`mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 transition-colors cursor-pointer hover:bg-blue-50 ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-900/25'}`}>
              <div className="text-center">
                <ImagePlus className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                  <input {...getInputProps()} />
                  <p className="pl-1">Drag and drop images, or click to upload</p>
                </div>
                <p className="text-xs leading-5 text-gray-500">JPG/PNG up to 5MB (Max 12)</p>
              </div>
            </div>

            {store.propertyData.images.length > 0 && (
              <div className="mt-6">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={store.propertyData.images.map(i => i.id)} strategy={rectSortingStrategy}>
                    <div className="flex flex-wrap gap-4 overflow-x-auto pb-2 p-2">
                      {store.propertyData.images.map((img, i) => (
                        <SortableImageItem key={img.id} id={img.id} url={img.url} onRemove={store.removeImage} index={i} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>

          <div className="bg-white px-6 py-8 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">6. Agent Information</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Agent Name</label>
                <div className="mt-2">
                  <input {...register('agentName')} className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                  {errors.agentName && <p className="mt-1 text-sm text-red-600">{errors.agentName.message}</p>}
                </div>
              </div>
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <div className="mt-2">
                  <input {...register('agentPhone')} className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                  {errors.agentPhone && <p className="mt-1 text-sm text-red-600">{errors.agentPhone.message}</p>}
                </div>
              </div>
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-2">
                  <input type="email" {...register('agentEmail')} className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                  {errors.agentEmail && <p className="mt-1 text-sm text-red-600">{errors.agentEmail.message}</p>}
                </div>
              </div>
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Agent Photo</label>
                <input type="file" accept="image/*" onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const u = URL.createObjectURL(e.target.files[0]);
                    store.setNestedProperty('agent', 'photoUrl', u);
                    store.setNestedProperty('agent', 'photoFile', e.target.files[0]);
                  }
                }} />
                {store.propertyData.agent.photoUrl && (
                  <img src={store.propertyData.agent.photoUrl} alt="Agent" className="mt-4 w-20 h-20 rounded-full object-cover shadow-sm bg-gray-100" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white px-6 py-8 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">7. Company</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <div className="mt-2">
                    <input {...register('companyName')} className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                    {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Website</label>
                  <div className="mt-2">
                    <input {...register('companyWebsite')} className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="e.g. www.jordanfishwick.co.uk" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                <input type="file" accept="image/*" onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const u = URL.createObjectURL(e.target.files[0]);
                    store.setNestedProperty('company', 'logoUrl', u);
                    store.setNestedProperty('company', 'logoFile', e.target.files[0]);
                  }
                }} />
                {store.propertyData.company.logoUrl && (
                  <div className="mt-4 h-16 w-32 border rounded flex items-center justify-center p-2 bg-gray-50">
                    <img src={store.propertyData.company.logoUrl} alt="Logo" className="max-h-full object-contain" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 pb-12">
            <button
              type="submit"
              disabled={!isValid || store.propertyData.images.length === 0}
              className="rounded-md bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next: Choose Template &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
