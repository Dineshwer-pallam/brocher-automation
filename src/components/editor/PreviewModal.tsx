import { X, Download } from 'lucide-react';

interface PreviewModalProps {
  onClose: () => void;
  onDownload: () => void;
  dataUrls: string[]; 
  properties?: any[];
  selectedPropertyId?: string;
  onSelectProperty?: (propId: string) => void;
  isGenerating?: boolean;
  width: number;
  height: number;
}

export default function PreviewModal({ onClose, onDownload, dataUrls, properties = [], selectedPropertyId, onSelectProperty, isGenerating, width, height }: PreviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <div>
          <h2 className="text-lg font-medium">Brochure Preview</h2>
          <p className="text-xs text-gray-400 mt-1">Check how your brochure looks before exporting.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onDownload}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition"
          >
            <Download size={16}/> Download PDF
          </button>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
            <X size={24} />
          </button>
        </div>
      </div>
      
      {/* Property Selector Bar */}
      {properties && properties.length > 0 && onSelectProperty && (
        <div className="bg-white/10 border-b border-white/10 px-4 py-3 flex items-center justify-center gap-4 text-white">
           <span className="text-sm text-gray-300">Previewing Data:</span>
           <select 
             value={selectedPropertyId || ''} 
             onChange={(e) => onSelectProperty(e.target.value)}
             className="bg-black/40 border border-white/20 text-white text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-blue-500 w-64"
             disabled={isGenerating}
           >
              <option value="" disabled>Select Database Property...</option>
              {properties.map(p => (
                 <option key={p.id} value={p.id}>{p.title} - ${p.price}</option>
              ))}
           </select>
           {isGenerating && <span className="text-xs text-blue-400 animate-pulse">Re-rendering...</span>}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-12 flex flex-col items-center justify-start gap-12 pb-32">
        {isGenerating ? (
           <div className="mt-20 flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-400 font-medium tracking-wide">Injecting live data...</p>
           </div>
        ) : (
          dataUrls.map((url, i) => (
            <div key={i} className="flex flex-col items-center gap-4 shrink-0 transition-opacity animate-in fade-in">
              <span className="text-gray-400 font-mono text-sm tracking-widest uppercase">Page {i + 1}</span>
              <div 
                 className="bg-white rounded shadow-2xl overflow-hidden h-[50vh] md:h-[70vh] pointer-events-none"
                 style={{ aspectRatio: `${width}/${height}` }}
              >
                <img src={url} alt={`Page ${i+1}`} className="w-full h-full object-contain bg-white" />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
