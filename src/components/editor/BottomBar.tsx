"use client";

import { useAppStore } from '@/lib/store';
import { templates } from '@/lib/templates';
import { Minus, Plus, Maximize2, Grid3X3, Magnet } from 'lucide-react';

export default function BottomBar() {
  const store = useAppStore();
  const template = templates.find(t => t.id === store.selectedTemplateId);
  const totalPages = template ? template.pages.length : 1;

  const handleZoom = (delta: number) => {
    let z = store.zoom + delta;
    if (z < 0.25) z = 0.25;
    if (z > 2.0) z = 2.0;
    store.setZoom(z); // Store accepts directly scale
  };

  return (
    <div className="h-10 bg-white border-t flex items-center justify-between px-4">
      {/* Zoom */}
      <div className="flex items-center gap-2">
        <button onClick={() => handleZoom(-0.1)} className="p-1 hover:bg-gray-100 rounded text-gray-600"><Minus size={14}/></button>
        <span className="text-xs font-medium w-12 text-center text-gray-700">{Math.round(store.zoom * 100)}%</span>
        <button onClick={() => handleZoom(0.1)} className="p-1 hover:bg-gray-100 rounded text-gray-600"><Plus size={14}/></button>
        <div className="w-px h-4 bg-gray-200 mx-1"></div>
        <button onClick={() => store.setZoom(1)} className="p-1 hover:bg-gray-100 rounded text-gray-600" title="100% Zoom">
          <Maximize2 size={12}/>
        </button>
      </div>

      {/* Pages */}
      <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-md overflow-x-auto max-w-[50vw]">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button 
            key={i}
            onClick={() => store.setPage(i + 1)}
            className={`px-3 py-1 text-xs rounded-sm font-medium transition-colors whitespace-nowrap ${store.currentPage === i + 1 ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Page {i + 1}
          </button>
        ))}
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => store.toggleGrid()}
          className={`p-1.5 rounded transition-colors ${store.showGrid ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Toggle Grid"
        >
          <Grid3X3 size={14}/>
        </button>
        <button 
          onClick={() => store.toggleSnap()}
          className={`p-1.5 rounded transition-colors ${store.snapToGrid ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Smart Guides"
        >
          <Magnet size={14}/>
        </button>
      </div>
    </div>
  );
}
