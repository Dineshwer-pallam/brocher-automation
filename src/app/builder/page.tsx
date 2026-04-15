'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileJson, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';

export default function BuilderSetupPage() {
  const router = useRouter();
  
  const [size, setSize] = useState('A4');
  const [orientation, setOrientation] = useState('portrait');

  // Standard dimensions at 72 DPI
  const dimensions: Record<string, { w: number, h: number }> = {
    'A4': { w: 595, h: 842 },
    'A3': { w: 842, h: 1191 },
    'A2': { w: 1191, h: 1684 },
    'US Letter': { w: 612, h: 792 }
  };

  const handleStartBlank = () => {
    let w = dimensions[size].w;
    let h = dimensions[size].h;
    
    if (orientation === 'landscape') {
      const temp = w;
      w = h;
      h = temp;
    }
    
    // Clear any previous imports
    sessionStorage.removeItem('importedTemplate');
    
    router.push(`/builder/editor?w=${w}&h=${h}`);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        // Basic validation
        JSON.parse(json);
        sessionStorage.setItem('importedTemplate', json);
        router.push(`/builder/editor`);
      } catch (err) {
        alert("Invalid JSON file uploaded.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Template Builder</h1>
        <p className="text-gray-600 mb-8">Design your own high-fidelity brochure layout.</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Card 1: Start Blank */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
              <LayoutTemplate size={24} />
            </div>
            <h2 className="text-xl font-semibold mb-6">Start Blank</h2>
            
            <div className="space-y-4 mb-8 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Canvas Size</label>
                <select 
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full form-select rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="A4">A4 (595 x 842)</option>
                  <option value="A3">A3 (842 x 1191)</option>
                  <option value="A2">A2 (1191 x 1684)</option>
                  <option value="US Letter">US Letter (612 x 792)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orientation</label>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setOrientation('portrait')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${orientation === 'portrait' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Portrait
                  </button>
                  <button
                    onClick={() => setOrientation('landscape')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${orientation === 'landscape' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Landscape
                  </button>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleStartBlank}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Enter Builder
            </button>
          </div>

          {/* Card 2: Import JSON */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-6">
              <FileJson size={24} />
            </div>
            <h2 className="text-xl font-semibold mb-6">Import Template</h2>
            <p className="text-sm text-gray-500 mb-8 flex-1 leading-relaxed">
              Resuming a previous session or loading someone else's layout? Upload your exported <code>.json</code> template file here to continue editing safely.
            </p>
            
            <label className="w-full cursor-pointer bg-white border border-indigo-200 hover:border-indigo-600 hover:bg-indigo-50 text-indigo-600 font-semibold py-3 px-4 rounded-lg transition-all text-center flex items-center justify-center gap-2 group">
              <FileJson className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
              Upload .json File
              <input 
                type="file" 
                accept=".json,application/json" 
                className="hidden" 
                onChange={handleImportJson}
              />
            </label>
          </div>

        </div>
      </div>
    </div>
  );
}
