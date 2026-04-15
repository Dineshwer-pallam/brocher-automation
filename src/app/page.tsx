import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 text-center">
      <h1 className="text-5xl font-bold mb-4 font-[family-name:var(--font-outfit)] text-gray-900">
        Property Brochure Builder
      </h1>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl font-[family-name:var(--font-inter)]">
        Create stunning property brochures in minutes. No design skills required.
      </p>
      
      <div className="flex flex-col gap-4 items-center">
        <div className="flex gap-4">
          <Link 
            href="/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors border border-transparent shadow-sm"
          >
            Create New Brochure
          </Link>
          
          <Link 
            href="/create?demo=true"
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors border border-gray-200 shadow-sm"
          >
            Try Demo
          </Link>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 w-full">
          <Link 
            href="/builder"
            className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors border border-transparent shadow-sm inline-block"
          >
            Design Custom Template
          </Link>
        </div>
      </div>
    </main>
  );
}
