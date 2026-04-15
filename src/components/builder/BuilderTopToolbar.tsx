"use client";

import { useAppStore } from '@/lib/store';
import { ArrowLeft, Undo2, Redo2, Type, ImagePlus, Square, Circle as CircleIcon, Minus, Download, Braces } from 'lucide-react';
import { fabric } from 'fabric';
import { CanvasHistory } from '@/lib/fabric/history';
import { useState } from 'react';
import Link from 'next/link';
import { getPlaceholderDataURL } from './utils';

type BuilderTopToolbarProps = {
  canvas: fabric.Canvas | null;
  history: CanvasHistory | null;
  onPreview: () => void;
  onExportConfig: () => void;
};

export default function BuilderTopToolbar({ canvas, history, onPreview, onExportConfig }: BuilderTopToolbarProps) {
  const store = useAppStore();
  const [showShapePopover, setShowShapePopover] = useState(false);
  const [showVarPopover, setShowVarPopover] = useState(false);
  const [showImgPopover, setShowImgPopover] = useState(false);

  const textVariables = [
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

  const imageVariables = [
    { label: 'Hero Image', tag: '{{hero_image}}' },
    { label: 'Gallery 1', tag: '{{gallery_1}}' },
    { label: 'Gallery 2', tag: '{{gallery_2}}' },
    { label: 'Gallery 3', tag: '{{gallery_3}}' },
    { label: 'Gallery 4', tag: '{{gallery_4}}' },
    { label: 'Gallery 5', tag: '{{gallery_5}}' },
    { label: 'Gallery 6', tag: '{{gallery_6}}' },
    { label: 'Gallery 7', tag: '{{gallery_7}}' },
    { label: 'Gallery 8', tag: '{{gallery_8}}' },
    { label: 'Floorplan', tag: '{{floorplan}}' },
    { label: 'EPC graph 1', tag: '{{epc_1}}' },
    { label: 'EPC graph 2', tag: '{{epc_2}}' },
    { label: 'Agent Photo', tag: '{{agent_photo}}' },
    { label: 'Company Logo', tag: '{{company_logo}}' }
  ];

  const addVariableText = (tag: string) => {
    if (!canvas) return;
    const text = new fabric.Textbox(tag, { 
       left: 247.5, top: 400, width: 200, fontSize: 14, fontFamily: 'Inter', fill: '#ba1c21' 
    });
    (text as any).dataBinding = tag;
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    setShowVarPopover(false);
  };

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.Textbox('Placeholder Text', { left: 247.5, top: 400, width: 200, fontSize: 16, fontFamily: 'Inter', fill: '#000000' });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addImagePlaceholder = (tag?: string) => {
    if (!canvas) return;
    
    const w = 200;
    const h = tag?.includes('logo') ? 100 : 150;
    const dataUrl = getPlaceholderDataURL(w, h, tag || 'Image Placeholder');
    
    fabric.Image.fromURL(dataUrl, (img) => {
      img.set({ left: 247.5, top: 371 });
      (img as any).isImagePlaceholder = true; 
      if (tag) (img as any).dataBinding = tag;
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
        
        {/* Image Placeholders Popover */}
        <div className="relative">
          <button 
            onClick={() => setShowImgPopover(!showImgPopover)} 
            className="p-1.5 text-gray-700 hover:bg-white hover:shadow-sm rounded flex items-center justify-center w-9 h-9 transition-all" 
            title="Add Image Placeholder"
          >
            <ImagePlus size={18} />
          </button>
          {showImgPopover && (
            <div className="absolute top-12 left-0 bg-white border shadow-lg rounded-md py-1 min-w-48 max-h-64 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2">
              <button onClick={() => addImagePlaceholder()} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-semibold border-b">
                Generic Image Box
              </button>
              {imageVariables.map(v => (
                <button key={v.tag} onClick={() => addImagePlaceholder(v.tag)} className="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-sm flex items-center justify-between group">
                  <span className="text-gray-700">{v.label}</span>
                  <span className="text-gray-400 text-xs font-mono group-hover:text-blue-500">{v.tag}</span>
                </button>
              ))}
            </div>
          )}
        </div>

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

        {/* Dynamic Text Variables Popover */}
        <div className="relative">
          <button 
            onClick={() => setShowVarPopover(!showVarPopover)} 
            className="p-1.5 text-gray-700 hover:bg-white hover:shadow-sm rounded flex items-center justify-center w-9 h-9 transition-all" 
            title="Add Text Variable"
          >
            <Braces size={18} />
          </button>
          {showVarPopover && (
            <div className="absolute top-12 left-0 bg-white border shadow-lg rounded-md py-1 min-w-48 max-h-64 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0 bg-white/95 backdrop-blur border-b">Dynamic Data</p>
              {textVariables.map(v => (
                <button key={v.tag} onClick={() => addVariableText(v.tag)} className="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-sm flex items-center justify-between group">
                  <span className="text-gray-700">{v.label}</span>
                  <span className="text-gray-400 text-xs font-mono group-hover:text-blue-500">{v.tag}</span>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      <div className="flex items-center gap-2">
        <button onClick={onPreview} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-sm">
          <span>👀</span> Live Preview
        </button>
        <button onClick={onExportConfig} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-sm">
          <Download size={16} /> Export JSON
        </button>
      </div>
    </div>
  );
}
