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
import PreviewModal from '@/components/editor/PreviewModal';
import { serializeCanvasToBrochureTemplate, downloadJsonConfig } from '@/lib/export/jsonExport';
import { processWithLiveData } from '@/lib/fabric/dataInjector';
import { getPlaceholderDataURL } from '@/components/builder/utils';
import renderTemplate from '@/lib/fabric/templateRenderer';
import { exportToPDF } from '@/lib/export/pdfExport';
import { templates } from '@/lib/templates';

// Global clipboard for cross-page copy-paste in this session
let clipboardData: fabric.Object | null = null;

// Globally enhance selection UI to be highly visible and modern
fabric.Object.prototype.set({
  transparentCorners: false,
  borderColor: '#2563eb', // Blue-600
  cornerColor: '#ffffff',
  cornerStrokeColor: '#2563eb',
  cornerSize: 8,
  cornerStyle: 'circle',
  borderScaleFactor: 1.5, // Crisp, thin border
  padding: 0 // Tight bounding box without spacing
});

function BuilderCanvasInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useAppStore();

  const [loading, setLoading] = useState(true);
  const [canvases, setCanvases] = useState<fabric.Canvas[]>([]);
  const [histories, setHistories] = useState<CanvasHistory[]>([]);
  
  // Preview Modal State
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [dbProperties, setDbProperties] = useState<any[]>([]);
  const [selectedPreviewPropertyId, setSelectedPreviewPropertyId] = useState<string>('');
  
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
      let presetTemplate = null;

      // If came from property selection workflow
      if (store.selectedTemplateId && store.propertyData.title) {
         // Attempt to fetch from DB templates first, or fallback to static templates
         try {
            const res = await fetch('/api/templates');
            if (res.ok) {
               const dbTemplates = await res.json();
               const tpl = dbTemplates.find((t: any) => t.id === store.selectedTemplateId);
               if (tpl) {
                  presetTemplate = JSON.parse(tpl.configJson);
                  presetTemplate.id = tpl.id;
               }
            }
         } catch (e) {}
         
         if (!presetTemplate) {
            presetTemplate = templates.find(t => t.id === store.selectedTemplateId) || null;
         }
      }
      
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

      if (presetTemplate) {
        try {
          if (presetTemplate.width) w = presetTemplate.width;
          if (presetTemplate.height) h = presetTemplate.height;
          setWidth(w);
          setHeight(h);

          const renderedPages = await renderTemplate(presetTemplate, store.propertyData);
          
          for (let i = 0; i < renderedPages.length; i++) {
             const rp = renderedPages[i];
             const { c, hist } = createBlankCanvas();
             c.backgroundColor = rp.background || '#ffffff';
             
             for (const obj of rp.objects) {
                 c.add(obj);
             }
             c.renderAll();
             newCanvases.push(c);
             newHistories.push(hist);
          }
        } catch (err) {
           console.error("Failed to render preset template", err);
        }
      } else if (jsonStr) {
        try {
          const template = JSON.parse(jsonStr);
          if (template.width) w = template.width;
          if (template.height) h = template.height;
          setWidth(w);
          setHeight(h);

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
      
      // Do not intercept if typing in a browser input or editing text on canvas
      const targetTag = (e.target as HTMLElement)?.tagName?.toUpperCase();
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT') return;
      if (c.getActiveObject()?.isEditing) return;

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
             active.clone((cloned: fabric.Object) => { clipboardData = cloned; }, ['dataBinding', 'isImagePlaceholder', 'dataKey']);
          }
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
          if (clipboardData) {
              clipboardData.clone((clonedObj: fabric.Object) => {
                  c.discardActiveObject();
                  clonedObj.set({ left: clonedObj.left! + 10, top: clonedObj.top! + 10, evented: true });
                  if ((clipboardData as any).dataBinding) (clonedObj as any).dataBinding = (clipboardData as any).dataBinding;
                  if ((clipboardData as any).dataKey) (clonedObj as any).dataKey = (clipboardData as any).dataKey;
                  if ((clipboardData as any).isImagePlaceholder) (clonedObj as any).isImagePlaceholder = (clipboardData as any).isImagePlaceholder;
                  c.add(clonedObj);
                  clipboardData.set({ top: clipboardData.top! + 10, left: clipboardData.left! + 10 });
                  c.setActiveObject(clonedObj);
                  c.requestRenderAll();
              });
          }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
             hist.redo();
          } else {
             hist.undo();
          }
          // Force active component updates
          setHistories(hists => [...hists]); 
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
          e.preventDefault();
          hist.redo();
          setHistories(hists => [...hists]);
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
         alert("Template saved successfully to the database!");
      } else {
         alert("Failed to save template to database.");
      }
    } catch(e) {
      console.error(e);
      alert("Error saving template.");
    }
  };

  const handleExportJSON = () => {
    const templateName = prompt("Enter a filename for your JSON backup:", "My Custom Template");
    if (!templateName) return;
    const template = serializeCanvasToBrochureTemplate(canvases, 'custom-' + Date.now(), templateName);
    downloadJsonConfig(template);
  };

  const fetchDbPropertiesIfEmpty = async () => {
    if (dbProperties.length > 0) return dbProperties;
    try {
      const res = await fetch('/api/properties');
      if (res.ok) {
        const props = await res.json();
        setDbProperties(props);
        return props;
      }
    } catch (err) {}
    return [];
  };

  const constructPropertyDataFromDb = (dbProp: any) => {
      const images = JSON.parse(dbProp.images || "[]").map((url: string, i: number) => ({ id: `img_${i}`, url, file: null as unknown as File }));
      return {
          title: dbProp.title,
          propertyType: dbProp.type.toLowerCase() as any,
          price: dbProp.price,
          currency: 'USD',
          bedrooms: dbProp.bedrooms,
          bathrooms: dbProp.bathrooms,
          area: dbProp.area || 0,
          areaUnit: 'sqft' as const,
          address: dbProp.address,
          description: dbProp.description,
          highlights: [],
          buildingInfo: '', entranceHall: '', kitchenLounge: '', bedroomOne: '', enSuite: '', bedroomTwo: '', bathroomDetails: '', externally: '', additionalInfo: '', agentsNotes: '', disclaimer: '', viewingArrangements: '',
          agent: { name: dbProp.agentName || '', phone: dbProp.agentPhone || '', email: dbProp.agentEmail || '', photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', photoFile: null },
          company: { name: '', website: '', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png', logoFile: null },
          images: images
      };
  };

  const runExport = async () => {
    setExporting(true);
    let propertyToUse = store.propertyData;
    
    // If no property data exists in global state (they are purely building a template), use a dummy
    if (!propertyToUse.title) {
       const props = await fetchDbPropertiesIfEmpty();
       if (props && props.length > 0) {
           propertyToUse = constructPropertyDataFromDb(props[0]);
       } else {
           alert("You need to select a property first to generate a PDF.");
           setExporting(false);
           return;
       }
    }
    
    try {
      await processWithLiveData(canvases, propertyToUse, async () => {
        await exportToPDF(canvases, `${propertyToUse.title?.replace(/\s+/g, '-') || 'brochure'}.pdf`, { width, height });
      });
      alert('PDF Downloaded successfully!');
    } catch(e) {
      alert('PDF export failed. Check console.');
      console.error(e);
    }
    setExporting(false);
  };

  const handleGeneratePreview = async (propObj: any) => {
     setIsGenerating(true);
     await processWithLiveData(canvases, constructPropertyDataFromDb(propObj), async () => {
       const urls = canvases.map(c => {
         c.discardActiveObject();
         c.renderAll();
         return c.toDataURL({ format: 'png', quality: 1, multiplier: 1.5 });
       });
       setPreviewUrls(urls);
     });
     setIsGenerating(false);
  };

  const runPreview = async () => {
    setShowPreview(true);
    setIsGenerating(true);
    
    // Fetch if needed
    const props = await fetchDbPropertiesIfEmpty();
    let propToUse = props && props.length > 0 ? props[0] : null;
    
    if (propToUse) {
       setSelectedPreviewPropertyId(propToUse.id);
       await handleGeneratePreview(propToUse);
    } else {
       setIsGenerating(false);
       alert("No properties found in database to preview");
    }
  };

  const changePreviewProperty = async (propId: string) => {
    setSelectedPreviewPropertyId(propId);
    const propToUse = dbProperties.find(p => p.id === propId);
    if (propToUse) {
      await handleGeneratePreview(propToUse);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 text-gray-900">
      
      <BuilderTopToolbar 
        canvas={activeCanvas} 
        history={activeHistory} 
        onPreview={runPreview} 
        onExportConfig={handleExportConfig} 
        onDownloadJSON={handleExportJSON}
        onDownloadPDF={runExport} 
      />

      <div className="flex-1 flex overflow-hidden">
        
        <BuilderLeftPanel canvas={activeCanvas} />
        
        {/* Canvas Area */}
        <div ref={canvasContainerRef} className="flex-1 overflow-auto bg-[#e5e5e5] relative flex items-center justify-center p-10">
          {loading && (
             <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#e5e5e5]/80 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-medium text-gray-700">Loading builder...</p>
              </div>
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

      {showPreview && (
        <PreviewModal 
          dataUrls={previewUrls} 
          properties={dbProperties}
          selectedPropertyId={selectedPreviewPropertyId}
          onSelectProperty={changePreviewProperty}
          isGenerating={isGenerating}
          width={width}
          height={height}
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

export default function BuilderEditorPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-gray-50">Loading builder...</div>}>
      <BuilderCanvasInner />
    </Suspense>
  );
}
