"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { templates } from '@/lib/templates';
import renderTemplate from '@/lib/fabric/templateRenderer';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { fabric } from 'fabric';

export default function TemplatesPage() {
  const router = useRouter();
  const store = useAppStore();
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Guard
    if (!store.propertyData.title) {
      router.push('/create');
      return;
    }

    const generatePreviews = async () => {
      setLoading(true);
      const newPreviews: Record<string, string> = {};
      
      // We need a dummy canvas element to instantiate fabric.Canvas
      const canvasEl = document.createElement('canvas');
      canvasEl.width = 595;
      canvasEl.height = 842;
      const fCanvas = new fabric.Canvas(canvasEl);

      for (const t of templates) {
        try {
          const renderedPages = await renderTemplate(t, store.propertyData);
          if (renderedPages.length > 0) {
            const page1 = renderedPages[0];
            fCanvas.clear();
            fCanvas.backgroundColor = page1.background;
            
            // Add all objects for page 1
            for (const obj of page1.objects) {
              fCanvas.add(obj);
            }
            
            fCanvas.renderAll();
            
            // generate image data
            newPreviews[t.id] = fCanvas.toDataURL({ format: 'png', quality: 0.8, multiplier: 0.5 });
          }
        } catch (err) {
          console.error(`Failed preview for ${t.id}`, err);
        }
      }
      
      fCanvas.dispose();
      setPreviews(newPreviews);
      setLoading(false);
    };

    generatePreviews();
  }, [store.propertyData.title]);

  const handleOpenEditor = () => {
    if (store.selectedTemplateId) {
      router.push('/editor');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/create')}
              className="text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft size={16} /> Back to Edit
            </button>
            <div className="h-6 w-px bg-gray-200"></div>
            <div>
              <h1 className="text-xl font-bold font-[family-name:var(--font-outfit)] text-gray-900">Choose a Template</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Pick a design style for your property brochure</p>
            </div>
          </div>
          <button
            onClick={handleOpenEditor}
            disabled={!store.selectedTemplateId}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Open in Editor &rarr;
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-xl aspect-[595/842] shadow-sm"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {templates.map((t) => {
              const isSelected = store.selectedTemplateId === t.id;
              return (
                <div 
                  key={t.id} 
                  onClick={() => store.selectTemplate(t.id)}
                  className={`
                    group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col
                    ${isSelected ? 'ring-2 ring-blue-500 transform scale-[1.02]' : 'hover:scale-[1.01] hover:ring-1 hover:ring-gray-300'}
                  `}
                >
                  <div className="aspect-[595/842] bg-gray-100 flex items-center justify-center overflow-hidden border-b pointer-events-none">
                     {previews[t.id] ? (
                       <img src={previews[t.id]} alt={t.name} className="w-full h-full object-contain bg-white" />
                     ) : (
                       <span className="text-xs text-gray-400">Preview Error</span>
                     )}
                  </div>
                  
                  <div className="p-4 bg-white flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{t.name}</h3>
                      <div className="mt-1 flex">
                        <span className="inline-block bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full border border-gray-200 uppercase tracking-wider">
                          {t.mood}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-1 shadow-md animate-in zoom-in-50 duration-200">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
