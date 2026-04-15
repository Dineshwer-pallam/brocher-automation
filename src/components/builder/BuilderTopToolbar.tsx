"use client";

import { useAppStore } from '@/lib/store';
import { ArrowLeft, Undo2, Redo2, Type, ImagePlus, Square, Circle as CircleIcon, Minus, Download } from 'lucide-react';
import { fabric } from 'fabric';
import { CanvasHistory } from '@/lib/fabric/history';
import { useState } from 'react';
import Link from 'next/link';

type BuilderTopToolbarProps = {
  canvas: fabric.Canvas | null;
  history: CanvasHistory | null;
  onExportConfig: () => void;
};

export default function BuilderTopToolbar({ canvas, history, onExportConfig }: BuilderTopToolbarProps) {
  const store = useAppStore();
  const [showShapePopover, setShowShapePopover] = useState(false);

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.Textbox('Placeholder Text', { left: 247.5, top: 400, width: 200, fontSize: 16, fontFamily: 'Inter', fill: '#000000' });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addImagePlaceholder = () => {
    if (!canvas) return;
    const rect = new fabric.Rect({ left: 247.5, top: 371, width: 200, height: 150, fill: '#cccccc' });
    // Add custom property to identify it as an image during export
    (rect as any).isImagePlaceholder = true; 
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  const addShape = (type: 'rect' | 'circle' | 'line') => {
    if (!canvas) return;
    let shape;
    if (type === 'rect') {
      shape = new fabric.Rect({ left: 247.5, top: 371, width: 100, height: 100, fill: '#ba1c21' });
    } else if (type === 'circle') {
      shape = new fabric.Circle({ left: 247.5, top: 371, radius: 50, fill: '#ba1c21' });
    } else {
      shape = new fabric.Line([0, 0, 100, 0], { left: 247.5, top: 400, stroke: '#333', strokeWidth: 2 });
    }
    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
    setShowShapePopover(false);
  };

  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Link href="/builder" className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Back to Setup">
            <ArrowLeft size={18} />
          </Link>
          <div className="w-px h-6 bg-gray-200 mx-1"></div>
          <button 
            onClick={history ? () => history.undo() : undefined} 
            disabled={!history || !history.canUndo()}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed" 
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={18} />
          </button>
          <button 
            onClick={history ? () => history.redo() : undefined} 
            disabled={!history || !history.canRedo()}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed" 
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={18} />
          </button>
        </div>
        
        <div className="w-px h-6 bg-gray-200 mx-1"></div>
        <span className="font-semibold px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs select-none tracking-wide">TEMPLATE BUILDER</span>
      </div>

      <div className="flex items-center gap-1 relative bg-gray-50 border rounded-lg p-1">
        <button onClick={addText} className="p-1.5 text-gray-700 hover:bg-white hover:shadow-sm rounded flex items-center justify-center w-9 h-9 transition-all" title="Add Text">
          <Type size={18} />
        </button>
        
        <button onClick={addImagePlaceholder} className="p-1.5 text-gray-700 hover:bg-white hover:shadow-sm rounded flex items-center justify-center w-9 h-9 transition-all" title="Add Image Placeholder">
          <ImagePlus size={18} />
        </button>

        {/* Shape Button & Popover */}
        <div className="relative">
          <button 
            onClick={() => setShowShapePopover(!showShapePopover)} 
            className="p-1.5 text-gray-700 hover:bg-white hover:shadow-sm rounded flex items-center justify-center w-9 h-9 transition-all" 
            title="Add Shape"
          >
            <Square size={18} />
          </button>
          {showShapePopover && (
            <div className="absolute top-12 left-0 bg-white border shadow-lg rounded-md py-1 min-w-32 z-50 animate-in fade-in slide-in-from-top-2">
              <button onClick={() => addShape('rect')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2">
                <Square size={14}/> Rectangle
              </button>
              <button onClick={() => addShape('circle')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2">
                <CircleIcon size={14}/> Circle
              </button>
              <button onClick={() => addShape('line')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2">
                <Minus size={14}/> Line
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onExportConfig} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-sm">
          <Download size={16} /> Export JSON
        </button>
      </div>
    </div>
  );
}
