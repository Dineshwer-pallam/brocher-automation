"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { templates } from '@/lib/templates';
import renderTemplate from '@/lib/fabric/templateRenderer';
import { fabric } from 'fabric';

import TopToolbar from '@/components/editor/TopToolbar';
import LeftPanel from '@/components/editor/LeftPanel';
import RightPanel from '@/components/editor/RightPanel';
import BottomBar from '@/components/editor/BottomBar';
import PreviewModal from '@/components/editor/PreviewModal';

import { CanvasHistory } from '@/lib/fabric/history';
import { initSmartGuides } from '@/lib/fabric/smartGuides';
import { exportToPDF } from '@/lib/export/pdfExport';
import { processWithLiveData } from '@/lib/fabric/dataInjector';

export default function EditorPage() {
  const router = useRouter();
  const store = useAppStore();
  
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // The actual Fabric instance referencing the current page
  const [canvases, setCanvases] = useState<fabric.Canvas[]>([]);
  const [histories, setHistories] = useState<CanvasHistory[]>([]);
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const mountRootRef = useRef<HTMLDivElement>(null);

  // Initialize
  useEffect(() => {
    if (!store.selectedTemplateId || !store.propertyData.title) {
      router.push('/templates');
      return;
    }

    const tpl = templates.find(t => t.id === store.selectedTemplateId);
    if (!tpl) return;

    const initEditor = async () => {
      setLoading(true);
      
      const renderedPages = await renderTemplate(tpl, store.propertyData);
      
      const newCanvases: fabric.Canvas[] = [];
      const newHistories: CanvasHistory[] = [];

      // Create off-screen canvases for each page (except first one which mounts to DOM directly below)
      for (let i = 0; i < renderedPages.length; i++) {
        const rp = renderedPages[i];
        
        const el = document.createElement('canvas');
        el.width = 595; el.height = 842;
        const c = new fabric.Canvas(el, {
           width: 595, height: 842, selection: true, preserveObjectStacking: true, backgroundColor: rp.background
        });

        // Add objects
        for (const obj of rp.objects) {
          c.add(obj);
        }
        c.renderAll();
        
        // Smart guides
        initSmartGuides(c);
        
        // History
        const hist = new CanvasHistory(c);
        
        // Keyboard Shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.target !== document.body && (e.target as HTMLElement).tagName !== 'CANVAS') return; // let inputs work
          
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
        
        // Basic copy-paste handling placeholder (prompt mentioned simple shortcuts)

        newCanvases.push(c);
        newHistories.push(hist);
      }

      setCanvases(newCanvases);
      setHistories(newHistories);
      store.setPage(1);
      
      // Auto-fit zoom based on screen
      if (canvasContainerRef.current) {
         const h = canvasContainerRef.current.clientHeight;
         // 842 is canvas height + 80 padding
         const fitZoom = (h - 80) / 842;
         store.setZoom(Math.min(1.5, Math.max(0.25, fitZoom)));
      }

      setLoading(false);
    };

    initEditor();

    return () => {
      // cleanup all
      histories.forEach(h => h.dispose());
      canvases.forEach(c => c.dispose());
    };
  }, []); // run once on mount

  // Tab switching logic (Page 1 -> Page 2)
  // Fabric doesn't easily unmount / remount canvas from DOM wrapper without wrapper re-init.
  // Instead of re-mounting the DOM element natively with fabric every time, 
  // since this is a prototype, easiest way is to let Fabric internally handle the single element,
  // OR we keep two separate DOM wrappers and hidden them via CSS.
  // We'll use CSS hiding for pages on the canvas container wrapping.

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

  const runExport = async () => {
    setExporting(true);
    try {
      await processWithLiveData(canvases, store.propertyData, async () => {
        await exportToPDF(canvases, `${store.propertyData.title.replace(/\s+/g, '-')}-brochure.pdf`);
      });
      // Simulating toast logic required by prompt 15
      alert('PDF Downloaded successfully!');
    } catch(e) {
      alert('PDF export failed. Check console.');
      console.error(e);
    }
    setExporting(false);
  };

  const runPreview = async () => {
    await processWithLiveData(canvases, store.propertyData, async () => {
      const urls = canvases.map(c => {
        c.discardActiveObject();
        c.renderAll();
        return c.toDataURL({ format: 'png', quality: 1, multiplier: 1.5 });
      });
      setPreviewUrls(urls);
    });
    setShowPreview(true);
  };

  const curIdx = store.currentPage - 1;
  const activeCanvas = canvases[curIdx] || null;
  const activeHistory = histories[curIdx] || null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 text-gray-900">
      <TopToolbar canvas={activeCanvas} history={activeHistory} onPreview={runPreview} onDownload={runExport} />
      
      <div className="flex-1 flex overflow-hidden">
        <LeftPanel canvas={activeCanvas} />
        
        {/* Canvas Area */}
        <div ref={canvasContainerRef} className="flex-1 overflow-auto bg-[#e5e5e5] relative flex items-center justify-center p-10">
          
          {loading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#e5e5e5]/80 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 font-medium text-gray-700">Loading editor...</p>
              </div>
            </div>
          )}

          {/* Grid Overlay Handle logic - if on, show grid using background pattern on the wrapper */}
          <div 
             ref={mountRootRef}
             className="relative transition-transform duration-200 origin-center shadow-xl will-change-transform"
             style={{ 
               transform: `scale(${store.zoom})`, 
               width: 595, height: 842,
               backgroundImage: store.showGrid ? 'linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)' : 'none',
               backgroundSize: '20px 20px',
               backgroundColor: 'white' // base fallback
             }}
          >
          </div>

        </div>

        <RightPanel canvas={activeCanvas} />
      </div>

      <BottomBar />

      {showPreview && (
        <PreviewModal 
          dataUrls={previewUrls} 
          onClose={() => setShowPreview(false)} 
          onDownload={() => {
            setShowPreview(false);
            runExport();
          }} 
        />
      )}

      {exporting && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center backdrop-blur-sm">
           <div className="bg-white px-8 py-6 rounded-lg shadow-2xl flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h3 className="font-bold text-gray-900 text-lg">Generating PDF</h3>
              <p className="text-gray-500 text-sm mt-1">Please wait, compiling high-resolution pages...</p>
           </div>
        </div>
      )}

    </div>
  );
}
