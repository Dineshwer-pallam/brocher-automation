"use client";

import { useAppStore } from '@/lib/store';
import { Minus, Plus, Maximize2, Grid3X3, Magnet, PlusCircle, Trash2 } from 'lucide-react';

type BuilderBottomBarProps = {
  totalPages: number;
  onAddPage: () => void;
  onDeletePage: () => void;
};

export default function BuilderBottomBar({ totalPages, onAddPage, onDeletePage }: BuilderBottomBarProps) {
  const store = useAppStore();

  const handleZoom = (delta: number) => {
    let z = store.zoom + delta;
    if (z < 0.25) z = 0.25;
    if (z > 2.0) z = 2.0;
    store.setZoom(z); 
  };

  return (
    <div className="h-12 bg-white border-t flex items-center justify-between px-4 shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] z-20">
      {/* Zoom */}
      <div className="flex items-center gap-2">
        <button onClick={() => handleZoom(-0.1)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Minus size={14}/></button>
        <span className="text-xs font-mono w-12 text-center text-gray-700">{Math.round(store.zoom * 100)}%</span>
        <button onClick={() => handleZoom(0.1)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Plus size={14}/></button>
        <div className="w-px h-4 bg-gray-200 mx-1"></div>
        <button onClick={() => store.setZoom(1)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="100% Zoom">
          <Maximize2 size={14}/>
        </button>
      </div>

      {/* Pages */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md overflow-x-auto max-w-[40vw]">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button 
              key={i}
              onClick={() => store.setPage(i + 1)}
              className={`px-3 py-1 text-sm rounded shadow-sm transition-colors whitespace-nowrap ${store.currentPage === i + 1 ? 'bg-white text-indigo-700 font-bold border border-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Page {i + 1}
            </button>
          ))}
        </div>
        
        <button 
           onClick={onAddPage}
           className="ml-2 flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md text-sm font-medium transition-colors"
        >
           <PlusCircle size={16} /> Add Page
        </button>

        {totalPages > 1 && (
           <button 
             onClick={onDeletePage}
             className="ml-1 p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
             title="Delete Current Page"
           >
             <Trash2 size={16} />
           </button>
        )}
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => store.toggleGrid()}
          className={`p-1.5 rounded transition-colors ${store.showGrid ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Toggle Grid"
        >
          <Grid3X3 size={16}/>
        </button>
        <button 
          onClick={() => store.toggleSnap()}
          className={`p-1.5 rounded transition-colors ${store.snapToGrid ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Smart Guides"
        >
          <Magnet size={16}/>
        </button>
      </div>
    </div>
  );
}
