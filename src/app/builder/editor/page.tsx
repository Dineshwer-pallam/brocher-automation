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
import { serializeCanvasToBrochureTemplate, downloadJsonConfig } from '@/lib/export/jsonExport';
import { getPlaceholderDataURL } from '@/components/builder/utils';

// Global clipboard for cross-page copy-paste in this session
let clipboardData: fabric.Object | null = null;

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
          
          if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
              const active = c.getActiveObject();
              if (active) {
                 active.clone((cloned: fabric.Object) => {
                    clipboardData = cloned;
                 });
              }
          }
          
          if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
              if (clipboardData) {
                  clipboardData.clone((clonedObj: fabric.Object) => {
                      c.discardActiveObject();
                      clonedObj.set({
                          left: clonedObj.left! + 10,
                          top: clonedObj.top! + 10,
                          evented: true,
                      });
                      
                      if (clonedObj.type === 'activeSelection') {
                          // Multiple objects not perfectly handled here yet, stick to single obj for now
                          clonedObj.canvas = c;
                          clonedObj.forEachObject((obj) => {
                              c.add(obj);
                          });
                          clonedObj.setCoords();
                      } else {
                          // Need to preserve Custom Properties like dataBinding manually
                          if ((clipboardData as any).dataBinding) (clonedObj as any).dataBinding = (clipboardData as any).dataBinding;
                          if ((clipboardData as any).isImagePlaceholder) (clonedObj as any).isImagePlaceholder = (clipboardData as any).isImagePlaceholder;
                          
                          c.add(clonedObj);
                      }
                      
                      clipboardData.top! += 10;
                      clipboardData.left! += 10;
                      c.setActiveObject(clonedObj);
                      c.requestRenderAll();
                  });
              }
          }
        };
        window.addEventListener('keydown', handleKeyDown);
        return { c, hist };
      };

      if (jsonStr) {
        try {
          const template = JSON.parse(jsonStr);
          const promises = template.pages.map(async (page: any) => {
            const { c, hist } = createBlankCanvas();
            c.backgroundColor = page.background || '#ffffff';
            
            const objPromises = page.objects.map((obj: any) => {
              return new Promise<void>((resolve) => {
                 if (obj.type === 'rect') {
                    const rect = new fabric.Rect({
                       left: obj.left, top: obj.top, width: obj.width, height: obj.height, fill: obj.fill,
                       rx: obj.rx, ry: obj.ry, stroke: obj.stroke, strokeWidth: obj.strokeWidth, opacity: obj.opacity
                    });
                    if (obj.dataBinding) (rect as any).dataBinding = obj.dataBinding;
                    c.add(rect);
                    resolve();
                 } else if (obj.type === 'circle') {
                    const circle = new fabric.Circle({
                       left: obj.left, top: obj.top, radius: obj.radius, fill: obj.fill,
                       stroke: obj.stroke, strokeWidth: obj.strokeWidth, opacity: obj.opacity
                    });
                    if (obj.dataBinding) (circle as any).dataBinding = obj.dataBinding;
                    c.add(circle);
                    resolve();
                 } else if (obj.type === 'line') {
                    const line = new fabric.Line([obj.x1 || 0, obj.y1 || 0, obj.x2 || 100, obj.y2 || 0], {
                       left: obj.left, top: obj.top, stroke: obj.stroke, strokeWidth: obj.strokeWidth || 1, opacity: obj.opacity
                    });
                    if (obj.dataBinding) (line as any).dataBinding = obj.dataBinding;
                    c.add(line);
                    resolve();
                 } else if (obj.type === 'textbox') {
                    const text = new fabric.Textbox(obj.dataBinding || 'Text', {
                       left: obj.left, top: obj.top, width: obj.width, fill: obj.fill,
                       fontSize: obj.fontSize, fontFamily: obj.fontFamily, fontWeight: obj.fontWeight, textAlign: obj.textAlign, lineHeight: obj.lineHeight, opacity: obj.opacity
                    });
                    if (obj.dataBinding) (text as any).dataBinding = obj.dataBinding;
                    c.add(text);
                    resolve();
                 } else if (obj.type === 'image') {
                    const dataUrl = getPlaceholderDataURL(obj.width || 200, obj.height || 150, obj.dataBinding || 'Image Placeholder');
                    fabric.Image.fromURL(dataUrl, (img) => {
                       img.set({ left: obj.left, top: obj.top, opacity: obj.opacity });
                       (img as any).isImagePlaceholder = true;
                       if (obj.dataBinding) (img as any).dataBinding = obj.dataBinding;
                       c.add(img);
                       resolve();
                    });
                 } else {
                    resolve();
                 }
              });
            });
            
            await Promise.all(objPromises);
            c.renderAll();
            return { c, hist };
          });
          
          const loadedPages = await Promise.all(promises);
          if (loadedPages.length > 0) {
              loadedPages.forEach(p => {
                 newCanvases.push(p.c);
                 newHistories.push(p.hist);
              });
          }
        } catch (err) {
            console.error("Failed to parse imported template JSON", err);
        }
      }

      // If no valid json parsed or it was empty, default to 1 blank page
      if (newCanvases.length === 0) {
          const { c, hist } = createBlankCanvas();
          newCanvases.push(c);
          newHistories.push(hist);
      }

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
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
          const active = c.getActiveObject();
          if (active) {
             active.clone((cloned: fabric.Object) => { clipboardData = cloned; });
          }
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
          if (clipboardData) {
              clipboardData.clone((clonedObj: fabric.Object) => {
                  c.discardActiveObject();
                  clonedObj.set({ left: clonedObj.left! + 10, top: clonedObj.top! + 10, evented: true });
                  if ((clipboardData as any).dataBinding) (clonedObj as any).dataBinding = (clipboardData as any).dataBinding;
                  if ((clipboardData as any).isImagePlaceholder) (clonedObj as any).isImagePlaceholder = (clipboardData as any).isImagePlaceholder;
                  c.add(clonedObj);
                  clipboardData.top! += 10; clipboardData.left! += 10;
                  c.setActiveObject(clonedObj);
                  c.requestRenderAll();
              });
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

  const handleExportConfig = async () => {
    const templateName = prompt("Enter a name for this Custom Template:", "My Custom Template");
    if (!templateName) return;

    const template = serializeCanvasToBrochureTemplate(canvases, 'custom-' + Date.now(), templateName);
    const configStr = JSON.stringify(template);

    try {
      const res = await fetch('/api/templates', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            name: templateName,
            description: "Custom template built with visual layout editor",
            configJson: configStr
         })
      });

      if (res.ok) {
         if (confirm("Template saved successfully to the database! Would you also like to download the raw JSON file as backup?")) {
             downloadJsonConfig(template);
         }
      } else {
         alert("Failed to save template to database.");
      }
    } catch(e) {
      console.error(e);
      alert("Error saving template.");
    }
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
             className="relative transition-transform duration-200 origin-center shadow-xl will-change-transform bg-white"
             style={{ transform: `scale(${store.zoom})`, width, height }}
          >
             <div ref={mountRootRef} className="absolute inset-0"></div>
             {store.showGrid && (
                <div 
                   className="absolute inset-0 pointer-events-none z-[100]" 
                   style={{ 
                      backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 1px, transparent 1px)', 
                      backgroundSize: '20px 20px' 
                   }}
                ></div>
             )}
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
