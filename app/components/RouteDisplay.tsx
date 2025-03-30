'use client';

import { useState } from 'react';
import axios from 'axios';

interface Stop {
  id: string;
  location: string;
  address: string;
  estimatedTime?: string;
  sequence: number;
  notes?: string;
  coordinates?: { lat: number; lng: number };
  timeWindow?: { start: string; end: string };
}

interface RouteStatistics {
  totalDistance: number;
  totalDuration: number;
  startTime: string;
  endTime: string;
}

interface Route {
  id: string;
  vehicle: string;
  stops: Stop[];
  statistics: RouteStatistics;
  routePolyline?: string;
}

interface OptimizedRoutes {
  routes: Route[];
  summary: {
    totalRoutes: number;
    totalStops: number;
    optimizationDate: string;
  };
}

interface RouteDisplayProps {
  routes: OptimizedRoutes;
}

export default function RouteDisplay({ routes }: RouteDisplayProps) {
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageStatus, setMessageStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  // Select the first route by default if available
  useState(() => {
    if (routes?.routes?.length > 0 && !selectedRouteId) {
      setSelectedRouteId(routes.routes[0].id);
    }
  });

  // Get the currently selected route
  const selectedRoute = selectedRouteId 
    ? routes?.routes?.find(route => route.id === selectedRouteId) 
    : routes?.routes?.[0];

  // Mock function to send SMS
  const sendSMS = async () => {
    if (!phoneNumber.trim()) {
      setMessageStatus({
        success: false,
        message: 'Please enter a valid phone number'
      });
      return;
    }

    setSendingMessage(true);
    setMessageStatus(null);

    try {
      // This would be replaced with an actual API call to your SMS service
      // For example, using Twilio API
      const response = await axios.post('/api/send-sms', {
        to: phoneNumber,
        routes: selectedRoute
      });

      setMessageStatus({
        success: true,
        message: 'Route information sent successfully!'
      });
    } catch (error) {
      setMessageStatus({
        success: false,
        message: 'Failed to send message. Please try again.'
      });
    } finally {
      setSendingMessage(false);
    }
  };

  // Mock function to send WhatsApp message
  const sendWhatsApp = async () => {
    if (!phoneNumber.trim()) {
      setMessageStatus({
        success: false,
        message: 'Please enter a valid phone number'
      });
      return;
    }

    setSendingMessage(true);
    setMessageStatus(null);

    try {
      // This would be replaced with an actual API call to your WhatsApp service
      // For example, using Twilio WhatsApp API
      const response = await axios.post('/api/send-whatsapp', {
        to: phoneNumber,
        routes: selectedRoute
      });

      setMessageStatus({
        success: true,
        message: 'Route information sent successfully via WhatsApp!'
      });
    } catch (error) {
      setMessageStatus({
        success: false,
        message: 'Failed to send WhatsApp message. Please try again.'
      });
    } finally {
      setSendingMessage(false);
    }
  };

  // Helper function to format route data for display
  const formatRouteData = () => {
    if (!selectedRoute || !selectedRoute.stops || selectedRoute.stops.length === 0) {
      return <p>No route data available</p>;
    }

    return (
      <div className="overflow-x-auto">
        <div className="mb-4 p-4 bg-blue-50 rounded-md border border-blue-200">
          <h3 className="text-lg font-medium text-blue-800">Route Summary</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-gray-600">Vehicle:</p>
              <p className="font-medium">{selectedRoute.vehicle}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Stops:</p>
              <p className="font-medium">{selectedRoute.stops.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Distance:</p>
              <p className="font-medium">{selectedRoute.statistics.totalDistance} km</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Duration:</p>
              <p className="font-medium">{formatDuration(selectedRoute.statistics.totalDuration)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Start Time:</p>
              <p className="font-medium">{formatTime(selectedRoute.statistics.startTime)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">End Time:</p>
              <p className="font-medium">{formatTime(selectedRoute.statistics.endTime)}</p>
            </div>
          </div>
        </div>

        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Stop Order</th>
              <th className="py-2 px-4 border">Location</th>
              <th className="py-2 px-4 border">Address</th>
              <th className="py-2 px-4 border">Estimated Time</th>
              {/* Show time window if available */}
              <th className="py-2 px-4 border">Time Window</th>
              <th className="py-2 px-4 border">Notes</th>
            </tr>
          </thead>
          <tbody>
            {selectedRoute.stops.map((stop: Stop) => (
              <tr key={stop.id} className={stop.sequence % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-2 px-4 border text-center">{stop.sequence}</td>
                <td className="py-2 px-4 border">{stop.location || 'N/A'}</td>
                <td className="py-2 px-4 border">{stop.address || 'N/A'}</td>
                <td className="py-2 px-4 border">{formatTime(stop.estimatedTime) || 'N/A'}</td>
                <td className="py-2 px-4 border">
                  {stop.timeWindow 
                    ? `${formatTime(stop.timeWindow.start)} - ${formatTime(stop.timeWindow.end)}`
                    : 'N/A'
                  }
                </td>
                <td className="py-2 px-4 border">{stop.notes || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Helper to format time
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeString;
    }
  };

  // Helper to format duration (assuming seconds)
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // If we have multiple routes, show a selector
  const renderRouteSelector = () => {
    if (!routes?.routes || routes.routes.length <= 1) return null;

    return (
      <div className="mb-6">
        <label htmlFor="route-selector" className="block text-sm font-medium text-gray-700 mb-1">
          Select Route:
        </label>
        <select
          id="route-selector"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={selectedRouteId || ''}
          onChange={(e) => setSelectedRouteId(e.target.value)}
        >
          {routes.routes.map(route => (
            <option key={route.id} value={route.id}>
              {`Route ${route.id} - Vehicle: ${route.vehicle} (${route.stops.length} stops)`}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6 text-center">Optimized Route</h2>
      
      {renderRouteSelector()}
      
      <div className="mb-8">
        {formatRouteData()}
      </div>
      
      <div className="mt-8 p-6 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium mb-4">Send Route Information</h3>
        
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="+1234567890"
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={sendSMS}
            disabled={sendingMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {sendingMessage ? 'Sending...' : 'Send via SMS'}
          </button>
          
          <button
            onClick={sendWhatsApp}
            disabled={sendingMessage}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {sendingMessage ? 'Sending...' : 'Send via WhatsApp'}
          </button>
        </div>
        
        {messageStatus && (
          <div className={`mt-4 p-3 rounded-md ${messageStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <p>{messageStatus.message}</p>
          </div>
        )}
      </div>
    </div>
  );
} 