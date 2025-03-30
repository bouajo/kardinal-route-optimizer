'use client';

import { useEffect, useState } from 'react';
// Import the flatfile blueprint configuration
import { flatfileBlueprint } from '../utils/flatfileConfig';

interface DataMappingProps {
  data: any[];
  onDataMapped: (mappedData: any) => void;
}

export default function DataMapping({ data, onDataMapped }: DataMappingProps) {
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debug, setDebug] = useState<string>('');

  // Use the environment variable for the Flatfile secret key
  const FLATFILE_SECRET_KEY = process.env.NEXT_PUBLIC_FLATFILE_SECRET_KEY || 'sk_2bf550be40f2415b84bd069afbdd7b13';

  // Initialize Flatfile SDK on client-side only
  useEffect(() => {
    // Add check to verify environment variable
    console.log('Flatfile key available:', !!FLATFILE_SECRET_KEY);
    console.log('Key beginning with:', FLATFILE_SECRET_KEY.substring(0, 5));
    setDebug(prev => prev + `\nKey check: ${!!FLATFILE_SECRET_KEY ? 'Yes' : 'No'}`);

    // Set loading to false after initial render
    setIsLoading(false);
  }, []);

  // This effect runs when data changes or loading state changes
  useEffect(() => {
    if (!data || data.length === 0 || isLoading) return;
    
    setDebug(prev => prev + `\nData loaded: ${data.length} records`);
    
    // Launch Flatfile importer automatically after a short delay
    const timer = setTimeout(() => {
      launchFlatfileImporter();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [data, isLoading]);

  const launchFlatfileImporter = async () => {
    try {
      setIsImporterOpen(true);
      setError(null);
      setDebug(prev => prev + '\nLaunching Flatfile...');
      
      // Dynamic import for client-side only execution
      const importModule = await import('@flatfile/adapter');
      const FlatfileImporter = importModule.default;
      
      setDebug(prev => prev + '\nImported FlatfileImporter module');
      
      // Create simplified fields from our blueprint
      const fields = flatfileBlueprint.fields.map(field => ({
        key: field.key,
        label: field.label,
        description: field.description
      }));
      
      // Create a new Flatfile importer instance with our configuration
      const importer = new FlatfileImporter(
        FLATFILE_SECRET_KEY,
        {
          type: 'Route Data',
          fields: fields,
          managed: true
        }
      );
      
      setDebug(prev => prev + '\nCreated importer instance');
      
      // Set customer info (optional)
      importer.setCustomer({
        userId: 'user-123',
        name: 'Kardinal User',
        email: 'user@example.com',
        companyName: 'Kardinal Routes',
      });
      
      setDebug(prev => prev + '\nSet customer info');

      // Request data from user
      setDebug(prev => prev + '\nRequesting data from user...');
      const results = await importer.requestDataFromUser();
      setDebug(prev => prev + '\nReceived results from Flatfile');
      
      // Handle successful import
      if (results && results.data && results.data.length > 0) {
        console.log('Import complete:', results);
        onDataMapped(results.data);
        setDebug(prev => prev + `\nData mapped successfully: ${results.data.length} records`);
        
        // Show success message
        importer.displaySuccess('Data successfully mapped!');
      } else {
        const errorMsg = 'No data was returned from the mapping tool';
        setError(errorMsg);
        setDebug(prev => prev + `\nError: ${errorMsg}`);
      }
      
      setIsImporterOpen(false);

    } catch (err: any) {
      console.error('Failed to launch Flatfile:', err);
      setError(err.message || 'Failed to launch the data mapping tool');
      setDebug(prev => prev + `\nError: ${err.message || 'Unknown error'}`);
      setIsImporterOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-lg">Loading data mapping tool...</p>
        <div className="mt-4 w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!isImporterOpen && (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Data Mapping</h2>
          
          {error ? (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              <p>{error}</p>
              <button 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={launchFlatfileImporter}
              >
                Try Again
              </button>
              
              <div className="mt-4 p-2 bg-gray-100 rounded text-left">
                <p className="font-semibold">Debug Information:</p>
                <pre className="text-xs whitespace-pre-wrap">{debug}</pre>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="mb-4">
                Your data is ready for mapping. Click the button below to start the mapping process.
              </p>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={launchFlatfileImporter}
              >
                Start Data Mapping
              </button>
              
              <div className="mt-8 p-2 bg-gray-100 rounded w-full text-left">
                <p className="font-semibold">Debug Information:</p>
                <pre className="text-xs whitespace-pre-wrap">{debug}</pre>
              </div>
            </div>
          )}
        </div>
      )}
      
      {isImporterOpen && (
        <div className="text-center p-8">
          <p className="text-lg">
            The data mapping tool is open. Please map your columns to continue.
          </p>
          <div className="mt-4 w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          
          <div className="mt-8 p-2 bg-gray-100 rounded text-left">
            <p className="font-semibold">Debug Information:</p>
            <pre className="text-xs whitespace-pre-wrap">{debug}</pre>
          </div>
        </div>
      )}
    </div>
  );
} 