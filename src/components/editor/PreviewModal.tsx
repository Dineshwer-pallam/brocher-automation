import { X, Download } from 'lucide-react';

interface PreviewModalProps {
  onClose: () => void;
  onDownload: () => void;
  dataUrls: string[]; 
}

export default function PreviewModal({ onClose, onDownload, dataUrls }: PreviewModalProps) {
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-12 flex flex-col items-center justify-start gap-12 pb-32">
        {dataUrls.map((url, i) => (
          <div key={i} className="flex flex-col items-center gap-4 shrink-0">
            <span className="text-gray-400 font-mono text-sm tracking-widest uppercase">Page {i + 1}</span>
            <div className="bg-white rounded shadow-2xl overflow-hidden aspect-[595/842] h-[50vh] md:h-[70vh] pointer-events-none">
              <img src={url} alt={`Page ${i+1}`} className="w-full h-full object-contain bg-white" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
