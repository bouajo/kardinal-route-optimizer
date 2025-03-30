'use client';

import { useState, useEffect } from 'react';

export default function FlatfileTest() {
  const [status, setStatus] = useState<string>('Initializing...');
  
  useEffect(() => {
    const testFlatfile = async () => {
      try {
        setStatus('Loading Flatfile module...');
        
        // Dynamic import to ensure client-side only execution
        const module = await import('@flatfile/adapter');
        setStatus(`Module loaded successfully: ${typeof module.default}`);
        
        // Check if we can access the key
        const key = process.env.NEXT_PUBLIC_FLATFILE_SECRET_KEY;
        setStatus(prev => `${prev}\nKey available: ${!!key ? 'Yes' : 'No'}`);
        
        // Try to create an instance
        if (module.default) {
          setStatus(prev => `${prev}\nCreating test instance...`);
          const FlatfileImporter = module.default;
          
          const importer = new FlatfileImporter(
            process.env.NEXT_PUBLIC_FLATFILE_SECRET_KEY || 'test-key',
            {
              type: 'Test Import',
              fields: [
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' }
              ]
            }
          );
          
          setStatus(prev => `${prev}\nInstance created successfully!`);
        }
      } catch (error: any) {
        setStatus(`Error: ${error.message || 'Unknown error'}`);
        console.error('Flatfile test error:', error);
      }
    };
    
    testFlatfile();
  }, []);
  
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Flatfile Test Component</h2>
      <pre className="p-3 bg-gray-100 rounded-md text-sm whitespace-pre-wrap">
        {status}
      </pre>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          This component tests if Flatfile adapter can be loaded and initialized correctly.
        </p>
      </div>
    </div>
  );
} 