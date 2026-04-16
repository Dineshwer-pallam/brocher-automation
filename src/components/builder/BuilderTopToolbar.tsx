"use client";

import { useAppStore } from '@/lib/store';
import { ArrowLeft, Undo2, Redo2, Type, ImagePlus, Square, Circle as CircleIcon, Minus, Download, Braces, Smile } from 'lucide-react';
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
  onDownloadJSON: () => void;
  onDownloadPDF?: () => void;
};

export default function BuilderTopToolbar({ canvas, history, onPreview, onExportConfig, onDownloadJSON, onDownloadPDF }: BuilderTopToolbarProps) {
  const store = useAppStore();
  const [showShapePopover, setShowShapePopover] = useState(false);
  const [showVarPopover, setShowVarPopover] = useState(false);
  const [showImgPopover, setShowImgPopover] = useState(false);
  const [showEmojiPopover, setShowEmojiPopover] = useState(false);
  const [historyTick, setHistoryTick] = useState(0);

  const handleUndo = () => {
     if (history) history.undo();
     setHistoryTick(t => t + 1);
  };
  
  const handleRedo = () => {
     if (history) history.redo();
     setHistoryTick(t => t + 1);
  };

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

  const SVG_ICONS = [
    { name: 'Bed', viewBox: '0 0 24 24', path: '<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'Bath', viewBox: '0 0 24 24', path: '<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M10 5V3M14 5V3M18 5V3M2 12h20M5 22l2-3M19 22l-2-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'Square Foot', viewBox: '0 0 24 24', path: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'Car', viewBox: '0 0 24 24', path: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2M7 17h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="5" cy="17" r="2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17" cy="17" r="2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'Map Pin', viewBox: '0 0 24 24', path: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'Phone', viewBox: '0 0 24 24', path: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'Mail', viewBox: '0 0 24 24', path: '<rect width="20" height="16" x="2" y="4" rx="2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'Check', viewBox: '0 0 24 24', path: '<polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'Globe', viewBox: '0 0 24 24', path: '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12h20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'Sofa', viewBox: '0 0 24 24', path: '<path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 18v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 18v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' }
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

  const addSvgIcon = (icon: any) => {
    if (!canvas) return;
    
    // Create a generic SVG wrapper around the raw path
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}">${icon.path}</svg>`;
    
    fabric.loadSVGFromString(svgStr, (objects, options) => {
      const obj = fabric.util.groupSVGElements(objects, options);
      obj.set({
        left: 247.5,
        top: 400,
        fill: '#ba1c21', 
        stroke: '#ba1c21',
        originX: 'center',
        originY: 'center',
      });
      obj.scaleToHeight(32); // Reasonable default SVG scale
      
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.renderAll();
      setShowEmojiPopover(false);
    });
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
            onClick={handleUndo} 
            disabled={!history || !history.canUndo()}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed" 
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={18} />
          </button>
          <button 
            onClick={handleRedo} 
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

        {/* Emojis Popover */}
        <div className="relative">
          <button 
            onClick={() => setShowEmojiPopover(!showEmojiPopover)} 
            className="p-1.5 text-gray-700 hover:bg-white hover:shadow-sm rounded flex items-center justify-center w-9 h-9 transition-all" 
            title="Add Emoji"
          >
            <Smile size={18} />
          </button>
          {showEmojiPopover && (
             <div className="absolute top-12 left-0 bg-white border shadow-lg rounded-md p-2 w-72 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-5 gap-2">
                   {SVG_ICONS.map(icon => (
                     <button 
                        key={icon.name} 
                        onClick={() => addSvgIcon(icon)} 
                        title={`Add ${icon.name} Icon`}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded transition group"
                     >
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox={icon.viewBox} className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" dangerouslySetInnerHTML={{ __html: icon.path }} />
                     </button>
                   ))}
                </div>
             </div>
          )}
        </div>

      </div>

      <div className="flex items-center gap-2">
        <button onClick={onPreview} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-sm">
          <span>👀</span> Live Preview
        </button>
        <button onClick={onExportConfig} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-sm" title="Save as reusable Template to Database">
          <Download size={16} /> Save Template
        </button>
        <button onClick={onDownloadJSON} className="bg-slate-700 hover:bg-slate-800 text-white font-medium text-sm px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-sm" title="Download property JSON config locally">
           <Braces size={16} /> Export JSON
        </button>
        {onDownloadPDF && (
          <button onClick={onDownloadPDF} className="bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-sm" title="Download Property Brochure as PDF">
             <Download size={16} /> Download PDF
          </button>
        )}
      </div>
    </div>
  );
}
