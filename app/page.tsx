'use client';

import { useState } from 'react';
import FileUploader from './components/FileUploader';
import DataMapping from './components/DataMapping';
import DataMappingSimple from './components/DataMappingSimple';
import RouteDisplay from './components/RouteDisplay';
import ErrorBoundary from './components/ErrorBoundary';
import FlatfileTest from './components/FlatfileTest';

enum AppState {
  UPLOAD,
  MAPPING,
  RESULTS
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [mappedData, setMappedData] = useState<any>(null);
  const [optimizedRoutes, setOptimizedRoutes] = useState<any>(null);
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [useSimpleMapping, setUseSimpleMapping] = useState<boolean>(true);

  const handleFileUploaded = (data: any) => {
    setUploadedData(data);
    setAppState(AppState.MAPPING);
  };

  const handleDataMapped = (data: any) => {
    setMappedData(data);
    // Call the API to optimize routes with the mapped data
    fetchOptimizedRoutes(data);
  };

  const fetchOptimizedRoutes = async (data: any) => {
    try {
      // Prepare the data for the Kardinal API
      const requestData = {
        stops: data.map((item: any) => ({
          // Convert necessary fields for API request
          id: item.id || `stop-${Math.random().toString(36).substr(2, 9)}`,
          location: item.location || 'Stop',
          address: item.address,
          latitude: item.latitude,
          longitude: item.longitude,
          timeWindowStart: item.timeWindowStart,
          timeWindowEnd: item.timeWindowEnd,
          duration: item.duration
        })),
        // Additional parameters for the API
        returnToStart: true,
        timeWindows: true
      };

      // Call the optimize API
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to optimize routes');
      }

      const optimizationResult = await response.json();
      setOptimizedRoutes(optimizationResult);
      setAppState(AppState.RESULTS);
    } catch (error) {
      console.error('Error optimizing routes:', error);
      // Show error state (you could add error handling UI here)
      alert('Failed to optimize routes. Please try again.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Kardinal Route Optimizer</h1>
        
        {/* Debug toggle button */}
        <div className="flex justify-between mb-4">
          <button 
            onClick={() => setUseSimpleMapping(!useSimpleMapping)}
            className="px-3 py-1 bg-blue-200 hover:bg-blue-300 rounded text-xs"
          >
            {useSimpleMapping ? 'Use Advanced Mapping' : 'Use Simple Mapping'}
          </button>
        
          <button 
            onClick={() => setShowDebug(!showDebug)}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
          >
            {showDebug ? 'Hide Debug' : 'Show Debug'}
          </button>
        </div>
        
        {/* Debug panel */}
        {showDebug && (
          <div className="mb-8">
            <FlatfileTest />
          </div>
        )}
        
        <ErrorBoundary>
          {appState === AppState.UPLOAD && (
            <FileUploader onFileUploaded={handleFileUploaded} />
          )}
          
          {appState === AppState.MAPPING && uploadedData && (
            useSimpleMapping ? (
              <DataMappingSimple data={uploadedData} onDataMapped={handleDataMapped} />
            ) : (
              <DataMapping data={uploadedData} onDataMapped={handleDataMapped} />
            )
          )}
          
          {appState === AppState.RESULTS && optimizedRoutes && (
            <RouteDisplay routes={optimizedRoutes} />
          )}
        </ErrorBoundary>
      </div>
    </main>
  );
} 