'use client';

import { useState } from 'react';

interface DataMappingSimpleProps {
  data: any[];
  onDataMapped: (mappedData: any) => void;
}

export default function DataMappingSimple({ data, onDataMapped }: DataMappingSimpleProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string>('Ready to start mapping.');

  const startMapping = async () => {
    try {
      setLoading(true);
      setError(null);
      setLog('Loading Flatfile...');

      // Import Flatfile adapter dynamically
      const { default: FlatfileImporter } = await import('@flatfile/adapter');
      setLog(prev => `${prev}\nFlatfile adapter loaded.`);

      // Define a simple field configuration
      const fields = [
        { key: 'location', label: 'Location Name' },
        { key: 'address', label: 'Address' },
        { key: 'latitude', label: 'Latitude' },
        { key: 'longitude', label: 'Longitude' }
      ];

      // Create Flatfile importer
      const importer = new FlatfileImporter(
        'sk_2bf550be40f2415b84bd069afbdd7b13', // Hardcoded for simplicity
        {
          type: 'Route Data',
          fields
        }
      );
      setLog(prev => `${prev}\nFlatfile importer created.`);

      // Request data from user
      setLog(prev => `${prev}\nOpening Flatfile importer...`);
      const results = await importer.requestDataFromUser();
      setLog(prev => `${prev}\nReceived data from Flatfile.`);

      // Process results
      if (results && results.data && results.data.length > 0) {
        setLog(prev => `${prev}\nProcessing ${results.data.length} records.`);
        onDataMapped(results.data);
        importer.displaySuccess('Data mapped successfully!');
      } else {
        setError('No data was returned from the mapping tool.');
      }
    } catch (err: any) {
      console.error('Flatfile error:', err);
      setError(`Error: ${err.message || 'Unknown error'}`);
      setLog(prev => `${prev}\nError: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-4">Simple Data Mapping</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="flex justify-center mb-4">
        <button
          onClick={startMapping}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {loading ? 'Opening Mapping Tool...' : 'Start Mapping'}
        </button>
      </div>
      
      {loading && (
        <div className="flex justify-center my-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className="mt-4 p-2 bg-gray-100 rounded text-xs font-mono">
        <div className="font-semibold mb-1">Log:</div>
        <pre className="whitespace-pre-wrap">{log}</pre>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Data count: {data ? data.length : 0} records</p>
      </div>
    </div>
  );
} 