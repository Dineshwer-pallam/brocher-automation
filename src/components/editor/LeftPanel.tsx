"use client";

import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { Type, Heading, Image as ImageIcon, BedDouble, ListChecks, User, Building2, Minus, Square, CircleIcon, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function LeftPanel({ canvas }: { canvas: fabric.Canvas | null }) {
  const store = useAppStore();
  const [tab, setTab] = useState<'blocks' | 'layers' | 'data'>('blocks');
  const [layers, setLayers] = useState<fabric.Object[]>([]);
  const [activeObjectId, setActiveObjectId] = useState<string | null>(null);

  useEffect(() => {
    if (!canvas) return;

    const updateLayers = () => {
      setLayers([...canvas.getObjects()]);
      const act = canvas.getActiveObject();
      setActiveObjectId(act ? (act as any).id || act.type : null);
    };

    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);
    canvas.on('selection:created', updateLayers);
    canvas.on('selection:cleared', updateLayers);
    canvas.on('selection:updated', updateLayers);

    updateLayers(); // initial

    return () => {
      canvas.off('object:added', updateLayers);
      canvas.off('object:removed', updateLayers);
      canvas.off('object:modified', updateLayers);
      canvas.off('selection:created', updateLayers);
      canvas.off('selection:cleared', updateLayers);
      canvas.off('selection:updated', updateLayers);
    };
  }, [canvas]);

  const addBlock = (blockType: string) => {
    if (!canvas) return;

    // Fallbacks
    const cx = 247.5;
    const cy = 400;

    let obj: fabric.Object | null = null;

    if (blockType === 'text') obj = new fabric.Textbox('Type here', { left: cx, top: cy, fontSize: 16, fontFamily: 'Inter' });
    if (blockType === 'headline') obj = new fabric.Textbox('Headline', { left: cx, top: cy, fontSize: 28, fontWeight: 'bold' });
    if (blockType === 'specs') {
      const p = store.propertyData;
      const t = `${p.bedrooms || 0} Beds • ${p.bathrooms || 0} Baths • ${p.area || 0} ${p.areaUnit}`;
      obj = new fabric.Textbox(t, { left: cx, top: cy, fontSize: 14 });
    }
    if (blockType === 'highlights') {
      const p = store.propertyData;
      const t = p.highlights.length ? p.highlights.join(' • ') : 'Key Feature 1 • Key Feature 2';
      obj = new fabric.Textbox(t, { left: cx, top: cy, fontSize: 12 });
    }
    if (blockType === 'rect') obj = new fabric.Rect({ left: cx, top: cy, width: 150, height: 100, fill: '#cccccc', stroke: '#333' });
    if (blockType === 'circle') obj = new fabric.Circle({ left: cx, top: cy, radius: 50, fill: '#cccccc', stroke: '#333' });
    if (blockType === 'divider') obj = new fabric.Line([0, 0, 200, 0], { left: cx, top: cy, stroke: '#666', strokeWidth: 1 });

    if (obj) {
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.renderAll();
    } else if (blockType === 'bg-color') {
      canvas.backgroundColor = '#f0f0f0';
      canvas.renderAll();
    }
  };

  const addDataField = (dataKey: string, type: 'text' | 'image' | 'circle' = 'text') => {
    if (!canvas) return;
    const cx = 247.5;
    const cy = 400;

    if (type === 'text') {
      const obj = new fabric.Textbox(dataKey, { left: cx, top: cy, fontSize: 16, fontFamily: 'Inter', dataKey } as any);
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.renderAll();
    } else if (type === 'image' || type === 'circle') {
      const placeholderImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23cccccc'/%3E%3C/svg%3E";
      fabric.Image.fromURL(placeholderImg, (img) => {
        if (!img) return;
        img.set({ left: cx, top: cy, dataKey } as any);
        if (type === 'circle') {
          const circ = new fabric.Circle({ radius: 50, originX: 'center', originY: 'center' });
          img.set({ clipPath: circ });
        }
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    }
  };

  return (
    <div className="w-60 bg-gray-50 border-r flex flex-col h-full overflow-hidden">
      <div className="flex p-2 gap-1 border-b bg-white overflow-x-auto">
        <button
          onClick={() => setTab('blocks')}
          className={`flex-1 min-w-[60px] py-1 text-xs font-medium rounded-full transition-colors ${tab === 'blocks' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          Blocks
        </button>
        <button
          onClick={() => setTab('data')}
          className={`flex-1 min-w-[60px] py-1 text-xs font-medium rounded-full transition-colors ${tab === 'data' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          Data
        </button>
        <button
          onClick={() => setTab('layers')}
          className={`flex-1 min-w-[60px] py-1 text-xs font-medium rounded-full transition-colors ${tab === 'layers' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          Layers
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'blocks' && (
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'text', label: 'Text', icon: Type },
              { id: 'headline', label: 'Headline', icon: Heading },
              { id: 'specs', label: 'Specs', icon: BedDouble },
              { id: 'highlights', label: 'Highlights', icon: ListChecks },
              { id: 'divider', label: 'Divider', icon: Minus },
              { id: 'rect', label: 'Rectangle', icon: Square },
              { id: 'circle', label: 'Circle', icon: CircleIcon },
            ].map(b => (
              <button
                key={b.id}
                onClick={() => addBlock(b.id)}
                className="flex flex-col items-center justify-center p-3 bg-white border rounded hover:border-blue-500 hover:text-blue-600 transition-colors gap-2"
              >
                <b.icon size={20} className="text-gray-500" />
                <span className="text-[10px] font-medium uppercase text-gray-500">{b.label}</span>
              </button>
            ))}
          </div>
        )}

        {tab === 'data' && (
          <div className="space-y-6">
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-wider">Property Text</div>
              <div className="flex flex-col gap-1">
                {[
                  { id: '{{title}}', label: 'Title' },
                  { id: '{{price}}', label: 'Price' },
                  { id: '{{bedrooms}}', label: 'Bedrooms' },
                  { id: '{{bathrooms}}', label: 'Bathrooms' },
                  { id: '{{area}}', label: 'Area' },
                  { id: '{{address}}', label: 'Address' },
                  { id: '{{description}}', label: 'Description' },
                  { id: '{{highlights}}', label: 'Highlights' },
                ].map(f => (
                  <button key={f.id} onClick={() => addDataField(f.id, 'text')} className="text-left px-3 py-2 text-xs bg-white border border-gray-200 rounded hover:border-blue-500 hover:text-blue-600 transition-colors">
                    {f.label} <span className="text-[9px] text-gray-400 block">{f.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-wider">Agent & Company Details</div>
              <div className="flex flex-col gap-1">
                {[
                  { id: '{{agent_name}}', label: 'Agent Name', type: 'text' },
                  { id: '{{agent_phone}}', label: 'Agent Phone', type: 'text' },
                  { id: '{{agent_email}}', label: 'Agent Email', type: 'text' },
                  { id: '{{company_name}}', label: 'Company Name', type: 'text' },
                  { id: '{{agent_photo}}', label: 'Agent Photo (Circle)', type: 'circle' },
                  { id: '{{company_logo}}', label: 'Company Logo', type: 'image' },
                ].map(f => (
                  <button key={f.id} onClick={() => addDataField(f.id, f.type as any)} className="text-left px-3 py-2 text-xs bg-white border border-gray-200 rounded hover:border-blue-500 hover:text-blue-600 transition-colors">
                    {f.label} <span className="text-[9px] text-gray-400 block">{f.id}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'layers' && (
          <div className="space-y-1">
            {[...layers].reverse().map((layer, i) => {
              if ((layer as any).isGuide) return null; // skip guides

              const isSelected = canvas?.getActiveObject() === layer;
              const type = layer.type;

              let label = type;
              let Icon = Square;
              if (type === 'textbox') { label = (layer as fabric.Textbox).text?.substring(0, 15) || 'Text'; Icon = Type; }
              if (type === 'image') { label = 'Image'; Icon = ImageIcon; }
              if (type === 'line') { label = 'Line'; Icon = Minus; }
              if (type === 'circle') { label = 'Circle'; Icon = CircleIcon; }

              return (
                <div
                  key={i}
                  onClick={() => { canvas?.setActiveObject(layer); canvas?.renderAll(); }}
                  className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer border ${isSelected ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-white border-transparent hover:border-gray-200'}`}
                >
                  <Icon size={14} className="text-gray-500 flex-shrink-0" />
                  <span className="flex-1 truncate">{label}</span>
                  <button onClick={(e) => { e.stopPropagation(); layer.set('visible', !layer.visible); canvas?.renderAll(); }} className="p-1 hover:bg-gray-200 rounded shrink-0">
                    {layer.visible !== false ? <Eye size={14} /> : <EyeOff size={14} className="text-gray-400" />}
                  </button>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    layer.set('selectable', !layer.selectable);
                    layer.set('evented', !layer.evented);
                    canvas?.renderAll();
                  }} className="p-1 hover:bg-gray-200 rounded shrink-0">
                    {layer.selectable ? <Unlock size={14} className="text-gray-400" /> : <Lock size={14} />}
                  </button>
                </div>
              );
            })}
            {layers.length === 0 && <p className="text-xs text-gray-500 text-center mt-4">No objects on canvas</p>}
          </div>
        )}
      </div>
    </div>
  );
}
