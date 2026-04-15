'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fabric } from 'fabric';
import { useAppStore } from '@/lib/store';
import { CanvasHistory } from '@/lib/fabric/history';
import { initSmartGuides } from '@/lib/fabric/smartGuides';
import BuilderTopToolbar from '@/components/builder/BuilderTopToolbar';
import BuilderLeftPanel from '@/components/builder/BuilderLeftPanel';
import BuilderRightPanel from '@/components/builder/BuilderRightPanel';
import BuilderBottomBar from '@/components/builder/BuilderBottomBar';

function BuilderCanvasInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useAppStore();

  const [loading, setLoading] = useState(true);
  const [canvases, setCanvases] = useState<fabric.Canvas[]>([]);
  const [histories, setHistories] = useState<CanvasHistory[]>([]);
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const mountRootRef = useRef<HTMLDivElement>(null);

  // Dimensions
  const [width, setWidth] = useState(595);
  const [height, setHeight] = useState(842);

  useEffect(() => {
    let w = parseInt(searchParams.get('w') || '595', 10);
    let h = parseInt(searchParams.get('h') || '842', 10);
    setWidth(w);
    setHeight(h);

    const initBuilder = async () => {
      setLoading(true);

      const jsonStr = sessionStorage.getItem('importedTemplate');
      
      const newCanvases: fabric.Canvas[] = [];
      const newHistories: CanvasHistory[] = [];

      const createBlankCanvas = () => {
        const el = document.createElement('canvas');
        el.width = w; el.height = h;
        const c = new fabric.Canvas(el, {
           width: w, height: h, selection: true, preserveObjectStacking: true, backgroundColor: '#ffffff'
        });
        initSmartGuides(c);
        const hist = new CanvasHistory(c);

        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.target !== document.body && (e.target as HTMLElement).tagName !== 'CANVAS') return; 
          if (e.key === 'Delete' || e.key === 'Backspace') {
              const activeObjects = c.getActiveObjects();
              if (activeObjects.length) {
                  activeObjects.forEach(obj => c.remove(obj));
                  c.discardActiveObject();
                  c.renderAll();
              }
          }
        };
        window.addEventListener('keydown', handleKeyDown);
        return { c, hist };
      };

      if (jsonStr) {
        // Will implement JSON parsing in Phase 3
        console.log("Found imported template in SessionStorage!");
      }

      // Default to 1 blank page for now
      const { c, hist } = createBlankCanvas();
      newCanvases.push(c);
      newHistories.push(hist);

      setCanvases(newCanvases);
      setHistories(newHistories);
      store.setPage(1);
      
      if (canvasContainerRef.current) {
         const containerH = canvasContainerRef.current.clientHeight;
         const fitZoom = (containerH - 80) / h;
         store.setZoom(Math.min(1.5, Math.max(0.25, fitZoom)));
      }

      setLoading(false);
    };

    initBuilder();

    return () => {
      histories.forEach(h => h.dispose());
      canvases.forEach(c => c.dispose());
    };
  }, [searchParams]);

  useEffect(() => {
    if (!mountRootRef.current || canvases.length === 0) return;
    mountRootRef.current.innerHTML = '';
    const curIdx = store.currentPage - 1;
    const c = canvases[curIdx];
    if (c) {
       const wrapperEl = (c as any).wrapperEl || c.getElement().parentNode || c.getElement();
       mountRootRef.current.appendChild(wrapperEl);
    }
  }, [store.currentPage, canvases]);

  const curIdx = store.currentPage - 1;
  const activeCanvas = canvases[curIdx] || null;
  const activeHistory = histories[curIdx] || null;

  const handleAddPage = () => {
    const el = document.createElement('canvas');
    el.width = width; el.height = height;
    const c = new fabric.Canvas(el, { width, height, selection: true, preserveObjectStacking: true, backgroundColor: '#ffffff' });
    initSmartGuides(c);
    const hist = new CanvasHistory(c);
    
    // Quick key bind for newly added canvas
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body && (e.target as HTMLElement).tagName !== 'CANVAS') return; 
      if (e.key === 'Delete' || e.key === 'Backspace') {
          const activeObjects = c.getActiveObjects();
          if (activeObjects.length) {
              activeObjects.forEach(obj => c.remove(obj));
              c.discardActiveObject();
              c.renderAll();
          }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    setCanvases(prev => [...prev, c]);
    setHistories(prev => [...prev, hist]);
    store.setPage(canvases.length + 1); // Jump to new page
  };

  const handleDeletePage = () => {
    if (canvases.length <= 1) return;
    const idx = store.currentPage - 1;
    
    // cleanup
    canvases[idx].dispose();
    histories[idx].dispose();

    const newC = [...canvases];
    const newH = [...histories];
    newC.splice(idx, 1);
    newH.splice(idx, 1);

    setCanvases(newC);
    setHistories(newH);
    
    // adjust page
    if (store.currentPage > newC.length) {
      store.setPage(newC.length);
    }
  };

  const handleExportConfig = () => {
    alert("JSON Export will be fully implemented in Phase 3!");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 text-gray-900">
      
      <BuilderTopToolbar canvas={activeCanvas} history={activeHistory} onExportConfig={handleExportConfig} />

      <div className="flex-1 flex overflow-hidden">
        
        <BuilderLeftPanel canvas={activeCanvas} />
        
        {/* Canvas Area */}
        <div ref={canvasContainerRef} className="flex-1 overflow-auto bg-[#e5e5e5] relative flex items-center justify-center p-10">
          {loading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#e5e5e5]/80 backdrop-blur-sm">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <div 
             ref={mountRootRef}
             className="relative transition-transform duration-200 origin-center shadow-xl will-change-transform"
             style={{ 
               transform: `scale(${store.zoom})`, 
               width, height,
               backgroundImage: store.showGrid ? 'linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)' : 'none',
               backgroundSize: '20px 20px',
               backgroundColor: 'white'
             }}
          >
          </div>
        </div>

        <BuilderRightPanel canvas={activeCanvas} width={width} height={height} />
      </div>

      <BuilderBottomBar 
        totalPages={canvases.length} 
        onAddPage={handleAddPage} 
        onDeletePage={handleDeletePage} 
      />

    </div>
  );
}

export default function BuilderEditorPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-gray-50">Loading builder...</div>}>
      <BuilderCanvasInner />
    </Suspense>
  );
}
