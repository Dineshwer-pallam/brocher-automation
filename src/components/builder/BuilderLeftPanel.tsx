"use client";

import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { Type, Image as ImageIcon, Square, CircleIcon, Minus, Eye, EyeOff, Lock, Unlock, Layers, ArrowUp, ArrowDown } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function BuilderLeftPanel({ canvas }: { canvas: fabric.Canvas | null }) {
  const [layers, setLayers] = useState<fabric.Object[]>([]);

  useEffect(() => {
    if (!canvas) return;

    const updateLayers = () => {
      setLayers([...canvas.getObjects()]);
    };

    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);

    updateLayers(); 

    return () => {
      canvas.off('object:added', updateLayers);
      canvas.off('object:removed', updateLayers);
      canvas.off('object:modified', updateLayers);
    };
  }, [canvas]);

  // We need to re-render when selection changes just to highlight the right layer.
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!canvas) return;
    const trig = () => setTick(t=>t+1);
    canvas.on('selection:created', trig);
    canvas.on('selection:cleared', trig);
    canvas.on('selection:updated', trig);
    return () => {
      canvas.off('selection:created', trig);
      canvas.off('selection:cleared', trig);
      canvas.off('selection:updated', trig);
    };
  }, [canvas]);

  return (
    <div className="w-64 bg-gray-50 border-r flex flex-col h-full overflow-hidden">
      <div className="h-12 border-b bg-white flex items-center px-4 font-semibold text-gray-700 text-sm gap-2">
         <Layers size={16} className="text-gray-400" /> Layer Stack
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {[...layers].reverse().map((layer, i) => {
          if ((layer as any).isGuide) return null; 

          const isSelected = canvas?.getActiveObject() === layer;
          const type = layer.type;

          let label = type;
          let Icon = Square;
          if (type === 'textbox') { label = (layer as fabric.Textbox).text?.substring(0, 15) || 'Text'; Icon = Type; }
          if ((layer as any).isImagePlaceholder) { label = 'Image Placeholder'; Icon = ImageIcon; }
          else if (type === 'rect') { label = 'Rectangle'; Icon = Square; }
          if (type === 'line') { label = 'Line'; Icon = Minus; }
          if (type === 'circle') { label = 'Circle'; Icon = CircleIcon; }

          return (
            <div
              key={i}
              onClick={() => { canvas?.setActiveObject(layer); canvas?.renderAll(); }}
              className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer border ${isSelected ? 'bg-indigo-50 border-indigo-200 text-indigo-800 font-medium' : 'bg-white border-transparent hover:border-gray-200'}`}
            >
              <Icon size={14} className="text-gray-500 flex-shrink-0" />
              <span className="flex-1 truncate">{label}</span>
              
              <button 
                 onClick={(e) => { e.stopPropagation(); layer.set('visible', !layer.visible); canvas?.renderAll(); setTick(t=>t+1); }} 
                 className="p-1 hover:bg-gray-200 rounded shrink-0"
              >
                {layer.visible !== false ? <Eye size={14} /> : <EyeOff size={14} className="text-gray-400" />}
              </button>
              
              <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   layer.set('selectable', !layer.selectable);
                   layer.set('evented', !layer.evented);
                   canvas?.renderAll();
                   setTick(t=>t+1);
                 }} 
                 className="p-1 hover:bg-gray-200 rounded shrink-0"
              >
                {layer.selectable ? <Unlock size={14} className="text-gray-400" /> : <Lock size={14} />}
              </button>
              <div className="flex items-center ml-1 border-l pl-1 border-gray-200">
                <button 
                   onClick={(e) => { e.stopPropagation(); canvas?.bringForward(layer); canvas?.renderAll(); setTick(t=>t+1); }} 
                   className="p-1 hover:bg-gray-200 rounded shrink-0"
                   title="Bring Forward"
                >
                  <ArrowUp size={14} className="text-gray-400" />
                </button>
                <button 
                   onClick={(e) => { e.stopPropagation(); canvas?.sendBackwards(layer); canvas?.renderAll(); setTick(t=>t+1); }} 
                   className="p-1 hover:bg-gray-200 rounded shrink-0"
                   title="Send Backwards"
                >
                  <ArrowDown size={14} className="text-gray-400" />
                </button>
              </div>
            </div>
          );
        })}
        {layers.length === 0 && <p className="text-xs text-gray-400 text-center mt-4 border border-dashed border-gray-200 rounded-lg p-6">No objects on canvas</p>}
      </div>
    </div>
  );
}
