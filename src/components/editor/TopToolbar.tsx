"use client";

import { useAppStore } from '@/lib/store';
import { ArrowLeft, Undo2, Redo2, Type, ImagePlus, Square, Circle as CircleIcon, Minus, Eye, Download, Braces } from 'lucide-react';
import { fabric } from 'fabric';
import { CanvasHistory } from '@/lib/fabric/history';
import { useState } from 'react';

type TopToolbarProps = {
  canvas: fabric.Canvas | null;
  history: CanvasHistory | null;
  onPreview: () => void;
  onDownload: () => void;
};

export default function TopToolbar({ canvas, history, onPreview, onDownload }: TopToolbarProps) {
  const store = useAppStore();
  const [showImgPopover, setShowImgPopover] = useState(false);
  const [showShapePopover, setShowShapePopover] = useState(false);
  const [showVarPopover, setShowVarPopover] = useState(false);

  const variablesList = [
    { label: 'Address', tag: '{{address}}' },
    { label: 'Price', tag: '{{price}}' },
    { label: 'Description', tag: '{{description}}' },
    { label: 'Building Info', tag: '{{building_info}}' },
    { label: 'Entrance Hall', tag: '{{entrance_hall}}' },
    { label: 'Kitchen/Lounge', tag: '{{kitchen_lounge}}' },
    { label: 'Bedroom One', tag: '{{bedroom_one}}' },
    { label: 'En-Suite', tag: '{{en_suite}}' },
    { label: 'Bedroom Two', tag: '{{bedroom_two}}' },
    { label: 'Bathroom Details', tag: '{{bathroom_details}}' },
    { label: 'Externally', tag: '{{externally}}' },
    { label: 'Additional Info', tag: '{{additional_info}}' },
    { label: 'Agents Notes', tag: '{{agents_notes}}' },
    { label: 'Disclaimer', tag: '{{disclaimer}}' },
    { label: 'Viewing Arrangements', tag: '{{viewing_arrangements}}' },
    { label: 'Agent Name', tag: '{{agent_name}}' },
    { label: 'Agent Phone', tag: '{{agent_phone}}' },
    { label: 'Agent Email', tag: '{{agent_email}}' },
    { label: 'Company Name', tag: '{{company_name}}' },
    { label: 'Company Website', tag: '{{company_website}}' }
  ];

  const addVariable = (tag: string) => {
    if (!canvas) return;
    const text = new (fabric as any).Textbox(tag, { 
       left: 247.5, top: 400, width: 200, fontSize: 14, fontFamily: 'Inter', fill: '#ba1c21', dataBinding: tag 
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    setShowVarPopover(false);
  };


  const addText = () => {
    if (!canvas) return;
    const text = new fabric.Textbox('Type here', { left: 247.5, top: 400, width: 200, fontSize: 16, fontFamily: 'Inter', fill: '#000000' });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addImageFromStore = (url: string) => {
    if (!canvas) return;
    fabric.Image.fromURL(url, (img) => {
      if (!img || img.isError) return;
      img.set({ left: 247.5, top: 371 }); // Roughly center of A4
      
      // Auto-scale down reasonably if too large
      if (img.width && img.width > 300) {
        img.scaleToWidth(300);
      }
      
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      setShowImgPopover(false);
    });
  };

  const addShape = (type: 'rect' | 'circle' | 'line') => {
    if (!canvas) return;
    let shape;
    if (type === 'rect') {
      shape = new fabric.Rect({ left: 247.5, top: 371, width: 100, height: 100, fill: '#cccccc', stroke: '#333333' });
    } else if (type === 'circle') {
      shape = new fabric.Circle({ left: 247.5, top: 371, radius: 50, fill: '#cccccc', stroke: '#333333' });
    } else {
      shape = new fabric.Line([0, 0, 100, 0], { left: 247.5, top: 400, stroke: '#333', strokeWidth: 2 });
    }
    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
    setShowShapePopover(false);
  };

  return (
    <div className="h-12 bg-white border-b flex items-center justify-between px-4">
      <div className="flex items-center gap-1">
        <button onClick={() => window.location.href = '/templates'} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Back to Templates">
          <ArrowLeft size={18} />
        </button>
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

      <div className="flex items-center gap-1 relative">
        <button onClick={addText} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded flex items-center justify-center w-9 h-9" title="Add Text">
          <Type size={18} />
        </button>
        
        {/* Image Button & Popover */}
        <div className="relative">
          <button 
            onClick={() => setShowImgPopover(!showImgPopover)} 
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded flex items-center justify-center w-9 h-9" 
            title="Add Image"
          >
            <ImagePlus size={18} />
          </button>
          {showImgPopover && (
            <div className="absolute top-10 left-0 bg-white border shadow-lg rounded-md p-2 w-64 z-50">
              <p className="text-xs font-semibold mb-2 text-gray-500 uppercase tracking-wider">Property Images</p>
              <div className="grid grid-cols-3 gap-2">
                {store.propertyData.images.map(img => (
                  <button key={img.id} onClick={() => addImageFromStore(img.url)} className="aspect-square bg-gray-100 rounded overflow-hidden hover:ring-2 hover:ring-blue-500">
                    <img src={img.url} className="object-cover w-full h-full" alt="Prop" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Shape Button & Popover */}
        <div className="relative">
          <button 
            onClick={() => setShowShapePopover(!showShapePopover)} 
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded flex items-center justify-center w-9 h-9" 
            title="Add Shape"
          >
            <Square size={18} />
          </button>
          {showShapePopover && (
            <div className="absolute top-10 left-0 bg-white border shadow-lg rounded-md py-1 min-w-32 z-50">
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

        {/* Variables Button & Popover */}
        <div className="relative">
          <button 
            onClick={() => setShowVarPopover(!showVarPopover)} 
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded flex items-center justify-center w-9 h-9" 
            title="Add Variable"
          >
            <Braces size={18} />
          </button>
          {showVarPopover && (
            <div className="absolute top-10 left-0 bg-white border shadow-lg rounded-md py-1 min-w-48 max-h-64 overflow-y-auto z-50">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0 bg-white/95 backdrop-blur">Dynamic Data</p>
              {variablesList.map(v => (
                <button key={v.tag} onClick={() => addVariable(v.tag)} className="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-sm flex items-center justify-between group">
                  <span className="text-gray-700">{v.label}</span>
                  <span className="text-gray-400 text-xs font-mono group-hover:text-blue-500">{v.tag}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="w-px h-6 bg-gray-200 mx-1"></div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onPreview} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded flex items-center justify-center" title="Preview">
          <Eye size={18} />
        </button>
        <button onClick={onDownload} className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-3 py-1.5 rounded flex items-center gap-2 transition-colors">
          <Download size={16} /> Download PDF
        </button>
      </div>
    </div>
  );
}
