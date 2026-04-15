"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { ArrowLeft, Home, Bed, Bath, Square } from 'lucide-react';

export default function PropertiesListPage() {
  const router = useRouter();
  const store = useAppStore();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties');
        if (res.ok) {
          const data = await res.json();
          setProperties(data);
        }
      } catch (err) {
        console.error("Failed to fetch properties", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleSelectProperty = (prop: any) => {
    // Populate Zustand store
    store.setProperty('title', prop.title);
    store.setProperty('propertyType', prop.type.toLowerCase());
    store.setProperty('price', prop.price);
    store.setProperty('currency', 'USD');
    store.setProperty('bedrooms', prop.bedrooms);
    store.setProperty('bathrooms', prop.bathrooms);
    store.setProperty('area', prop.area || 0);
    store.setProperty('areaUnit', 'sqft');
    store.setProperty('address', prop.address);
    store.setProperty('description', prop.description);
    
    store.setNestedProperty('agent', 'name', prop.agentName || 'Agent');
    store.setNestedProperty('agent', 'phone', prop.agentPhone || '');
    store.setNestedProperty('agent', 'email', prop.agentEmail || '');
    // Provide a dummy photo for Agent
    store.setNestedProperty('agent', 'photoUrl', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80');

    // Parse images array and load them as placehold.co images if they are URLs so fabric handles them cleanly
    const imageUrls = JSON.parse(prop.images || "[]");
    
    const loadImages = async () => {
       // Clear existing
       
       const mockImagesAsync = async () => {
        try {
          for (let i = 0; i < imageUrls.length; i++) {
             const res = await fetch(imageUrls[i]);
             const blob = await res.blob();
             const file = new File([blob], `db-img-${i}.jpg`, { type: 'image/jpeg' });
             store.addImage(file);
          }
        } catch (e) {
          console.error("Failed to load DB images", e);
        }
      };
      
      // If store is empty of images or we want to overwrite, we must do it manually via store methods
      await mockImagesAsync();
      
      router.push('/templates');
    };
    
    loadImages();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
            <button onClick={() => router.push('/')} className="text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 text-sm font-medium">
              <ArrowLeft size={16} /> Back Home
            </button>
            <div className="h-6 w-px bg-gray-200 mx-4"></div>
            <div>
              <h1 className="text-xl font-bold font-[family-name:var(--font-outfit)] text-gray-900">Select dummy Property</h1>
              <p className="text-xs text-gray-500">Pick one of the 10 seeded database properties</p>
            </div>
        </div>
      </header>

      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full">
        {loading ? (
           <div className="text-center py-20 text-gray-500 animate-pulse">Loading database properties...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(p => {
              const images = JSON.parse(p.images || "[]");
              const heroImg = images.length > 0 ? images[0] : null;

              return (
                <div key={p.id} onClick={() => handleSelectProperty(p)} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col group">
                  <div className="aspect-video bg-gray-100 overflow-hidden relative">
                    {heroImg ? (
                      <img src={heroImg} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Home size={32} className="text-gray-300"/></div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-800">
                      ${p.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{p.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{p.address}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t flex items-center justify-between text-gray-500 text-sm">
                      <div className="flex items-center gap-1.5"><Bed size={16}/> {p.bedrooms}</div>
                      <div className="flex items-center gap-1.5"><Bath size={16}/> {p.bathrooms}</div>
                      <div className="flex items-center gap-1.5"><Square size={16}/> {p.area} sqft</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  );
}
