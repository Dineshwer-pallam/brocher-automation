"use client";

import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { AlignLeft, AlignCenter, AlignRight, Bold, Type, Database } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const ALL_BINDINGS = [
  '{{title}}', '{{price}}', '{{bedrooms}}', '{{bathrooms}}', '{{area}}',
  '{{address}}', '{{description}}', '{{highlights}}',
  '{{building_info}}', '{{entrance_hall}}', '{{kitchen_lounge}}',
  '{{bedroom_one}}', '{{en_suite}}', '{{bedroom_two}}', '{{bathroom_details}}',
  '{{externally}}', '{{additional_info}}', '{{agents_notes}}', '{{disclaimer}}',
  '{{viewing_arrangements}}',
  '{{hero_image}}', '{{gallery_1}}', '{{gallery_2}}', '{{gallery_3}}', '{{gallery_4}}',
  '{{gallery_5}}', '{{gallery_6}}', '{{gallery_7}}', '{{gallery_8}}',
  '{{floorplan}}', '{{epc_1}}', '{{epc_2}}',
  '{{agent_name}}', '{{agent_phone}}', '{{agent_email}}', '{{agent_photo}}',
  '{{company_name}}', '{{company_website}}', '{{company_logo}}'
];

export default function BuilderRightPanel({ canvas, width, height }: { canvas: fabric.Canvas | null, width: number, height: number }) {
  const store = useAppStore();
  const [activeObj, setActiveObj] = useState<fabric.Object | null>(null);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [tick, setTick] = useState(0); 

  useEffect(() => {
    if (!canvas) return;

    const updateSelection = () => {
      const sel = canvas.getActiveObjects();
      setActiveObj(sel.length === 1 ? sel[0] : null);
      if (typeof canvas.backgroundColor === 'string') {
        setBgColor(canvas.backgroundColor);
      }
      setTick(t => t + 1);
    };

    canvas.on('selection:created', updateSelection);
    canvas.on('selection:cleared', updateSelection);
    canvas.on('selection:updated', updateSelection);
    canvas.on('object:modified', updateSelection);

    updateSelection();

    return () => {
      canvas.off('selection:created', updateSelection);
      canvas.off('selection:cleared', updateSelection);
      canvas.off('selection:updated', updateSelection);
      canvas.off('object:modified', updateSelection);
    };
  }, [canvas]);

  const updateProp = (key: string, value: any) => {
    if (activeObj && canvas) {
      activeObj.set(key, value);
      canvas.requestRenderAll();
      setTick(t => t + 1);
    }
  };

  const updateCanvasBg = (val: string) => {
    if (canvas) {
      canvas.backgroundColor = val;
      canvas.requestRenderAll();
      setBgColor(val);
    }
  };

  if (!canvas) return <div className="w-72 bg-white border-l h-full" />;

  // PAGE PROPERTIES
  if (!activeObj) {
    return (
      <div className="w-72 bg-white border-l h-full p-4 overflow-y-auto">
        <h3 className="text-xs font-bold uppercase text-gray-500 mb-4 tracking-wider">Page Properties</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Canvas Size</label>
            <div className="bg-gray-50 px-3 py-2 text-sm text-gray-500 rounded border cursor-not-allowed font-mono">
              {width} × {height}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">Background Color</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={bgColor} onChange={(e) => updateCanvasBg(e.target.value)} className="w-8 h-8 rounded shrink-0" />
              <input type="text" value={bgColor} onChange={(e) => updateCanvasBg(e.target.value)} className="border rounded text-sm px-2 py-1 flex-1 uppercase" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // OBJECT PROPERTIES
  const isText = activeObj.type === 'textbox';
  const isImage = (activeObj as any).isImagePlaceholder === true;
  const isShape = activeObj.type === 'rect' || activeObj.type === 'circle' || activeObj.type === 'line';

  return (
    <div className="w-72 bg-white border-l h-full p-4 overflow-y-auto hidden-scrollbar flex flex-col gap-6">
      
      {/* DATA BINDING SECTION (Crucial for Builder) */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
        <h3 className="text-xs font-bold uppercase text-indigo-800 mb-2 tracking-wider flex items-center gap-2">
           <Database size={14} /> Data Binding
        </h3>
        <p className="text-[10px] text-indigo-600 mb-2 leading-tight">
           Select a variable to dynamically inject real estate data into this placeholder.
        </p>
        <select
           value={(activeObj as any).dataBinding || ''}
           onChange={(e) => updateProp('dataBinding', e.target.value)}
           className="w-full border-indigo-200 text-indigo-900 rounded text-xs px-2 py-1.5 outline-none bg-white font-mono"
        >
           <option value="">-- No Data Binding --</option>
           {ALL_BINDINGS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        {isText && (activeObj as any).dataBinding && (
          <p className="text-[9px] text-indigo-500 mt-1">Hint: Textboxes can also type bindings inline like "Asking {{price}}".</p>
        )}
      </div>


      {/* STANDARD STYLING */}
      <div>
         <h3 className="text-xs font-bold uppercase text-gray-500 mb-4 tracking-wider">
           {isText ? 'Text Properties' : isImage ? 'Image Placeholder Spec' : 'Shape Properties'}
         </h3>

        <div className="space-y-6">
          {/* COMMON PROPERTIES (Position) */}
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block">Layout</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex bg-gray-50 border rounded items-center overflow-hidden">
                <span className="text-[10px] text-gray-400 px-2 font-mono font-bold bg-gray-100 border-r self-stretch flex items-center">X</span>
                <input type="number" value={Math.round(activeObj.left || 0)} onChange={(e) => updateProp('left', parseFloat(e.target.value))} className="w-full text-xs px-2 py-1 outline-none bg-transparent" />
              </div>
              <div className="flex bg-gray-50 border rounded items-center overflow-hidden">
                <span className="text-[10px] text-gray-400 px-2 font-mono font-bold bg-gray-100 border-r self-stretch flex items-center">Y</span>
                <input type="number" value={Math.round(activeObj.top || 0)} onChange={(e) => updateProp('top', parseFloat(e.target.value))} className="w-full text-xs px-2 py-1 outline-none bg-transparent" />
              </div>
              <div className="flex bg-gray-50 border rounded items-center overflow-hidden">
                <span className="text-[10px] text-gray-400 px-2 font-mono font-bold bg-gray-100 border-r self-stretch flex items-center">W</span>
                <input type="number" value={Math.round(activeObj.width ? activeObj.width * (activeObj.scaleX||1) : 0)} onChange={(e) => updateProp('width', parseFloat(e.target.value)/(activeObj.scaleX||1))} disabled={isImage} className="w-full text-xs px-2 py-1 outline-none bg-transparent disabled:opacity-50" />
              </div>
              <div className="flex bg-gray-50 border rounded items-center overflow-hidden">
                <span className="text-[10px] text-gray-400 px-2 font-mono font-bold bg-gray-100 border-r self-stretch flex items-center">H</span>
                <input type="number" value={Math.round(activeObj.height ? activeObj.height * (activeObj.scaleY||1) : 0)} onChange={(e) => updateProp('height', parseFloat(e.target.value)/(activeObj.scaleY||1))} disabled={isImage || isText} className="w-full text-xs px-2 py-1 outline-none bg-transparent disabled:opacity-50" />
              </div>
            </div>
          </div>

          {/* OPACITY */}
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block flex justify-between">
              Opacity <span>{Math.round((activeObj.opacity || 1) * 100)}%</span>
            </label>
            <input type="range" min="0" max="1" step="0.05" value={activeObj.opacity || 1} onChange={(e) => updateProp('opacity', parseFloat(e.target.value))} className="w-full" />
          </div>

          {/* TEXT SPECIFIC */}
          {isText && (
            <>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block">Typography</label>
                
                <select 
                  value={(activeObj as fabric.Textbox).fontFamily} 
                  onChange={(e) => updateProp('fontFamily', e.target.value)}
                  className="w-full border rounded text-xs px-2 py-1.5 mb-2 outline-none"
                >
                  {['Inter', 'Playfair Display', 'Montserrat', 'Bebas Neue', 'Cormorant Garamond', 'Work Sans', 'Outfit', 'DM Sans', 'Lora', 'Poppins'].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>

                <div className="flex gap-2 mb-2">
                  <input 
                    type="number" value={(activeObj as fabric.Textbox).fontSize || 16} 
                    onChange={(e) => updateProp('fontSize', parseFloat(e.target.value))}
                    className="w-16 border rounded text-xs px-2 py-1 text-center outline-none"
                  />
                  <button 
                    onClick={() => updateProp('fontWeight', (activeObj as fabric.Textbox).fontWeight === 'bold' ? 'normal' : 'bold')}
                    className={`flex-1 border rounded flex items-center justify-center transition-colors ${(activeObj as fabric.Textbox).fontWeight === 'bold' ? 'bg-gray-200 border-gray-300 shadow-inner' : 'hover:bg-gray-50'}`}
                  >
                    <Bold size={14} />
                  </button>
                  <div className="flex border rounded overflow-hidden">
                    {['left', 'center', 'right'].map((align) => {
                      const Icons: any = { left: AlignLeft, center: AlignCenter, right: AlignRight };
                      const Icon = Icons[align];
                      return (
                        <button 
                          key={align}
                          onClick={() => updateProp('textAlign', align)}
                          className={`w-8 h-8 flex items-center justify-center transition-colors ${((activeObj as fabric.Textbox).textAlign || 'left') === align ? 'bg-gray-200 shadow-inner' : 'hover:bg-gray-50'}`}
                        >
                          <Icon size={14} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] block text-gray-500 mb-1">Color</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={(activeObj as fabric.Textbox).fill as string} onChange={(e) => updateProp('fill', e.target.value)} className="w-8 h-8 rounded shrink-0 p-0 border-0" />
                    <input type="text" value={(activeObj as fabric.Textbox).fill as string} onChange={(e) => updateProp('fill', e.target.value)} className="border rounded text-xs px-2 py-1 flex-1 uppercase outline-none" />
                  </div>
                </div>

                <div className="mt-2">
                  <label className="text-[10px] block text-gray-500 mb-1">Line Height</label>
                  <input type="range" min="0.5" max="3" step="0.1" value={(activeObj as fabric.Textbox).lineHeight || 1} onChange={(e) => updateProp('lineHeight', parseFloat(e.target.value))} className="w-full" />
                </div>
              </div>
            </>
          )}

          {/* SHAPE SPECIFIC */}
          {(isShape || isImage) && (
            <>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block">Fill / Stroke</label>
                
                <div className="mb-2">
                  <label className="text-[10px] block text-gray-500 mb-1">Fill</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={(activeObj.fill as string) || '#000000'} onChange={(e) => updateProp('fill', e.target.value)} disabled={activeObj.fill === 'transparent'} className="w-8 h-8 rounded shrink-0 p-0 border-0 disabled:opacity-50" />
                    <input type="text" value={(activeObj.fill as string)} onChange={(e) => updateProp('fill', e.target.value)} className="border rounded text-xs px-2 py-1 flex-1 uppercase outline-none" />
                  </div>
                </div>

                {!isImage && (
                  <div>
                    <label className="text-[10px] block text-gray-500 mb-1">Stroke</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={(activeObj.stroke as string) || '#000000'} onChange={(e) => updateProp('stroke', e.target.value)} className="w-8 h-8 rounded shrink-0 p-0 border-0" />
                      <input type="text" value={(activeObj.stroke as string)} onChange={(e) => updateProp('stroke', e.target.value)} className="border rounded text-xs px-2 py-1 flex-1 uppercase outline-none" />
                    </div>
                  </div>
                )}

                <div className="mt-2">
                  <label className="text-[10px] block text-gray-500 mb-1">Stroke Width</label>
                  <input type="range" min="0" max="20" step="1" value={activeObj.strokeWidth || 0} onChange={(e) => updateProp('strokeWidth', parseFloat(e.target.value))} className="w-full" />
                </div>

                {(activeObj.type === 'rect' || isImage) && (
                   <div className="mt-2">
                   <label className="text-[10px] block text-gray-500 mb-1">Corner Radius</label>
                   <input type="range" min="0" max="100" step="1" value={activeObj.rx || 0} onChange={(e) => {updateProp('rx', parseFloat(e.target.value)); updateProp('ry', parseFloat(e.target.value));}} className="w-full" />
                 </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
