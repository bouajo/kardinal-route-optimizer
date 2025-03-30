import axios from 'axios';

/**
 * Kardinal API utility functions
 * This file contains utility functions for interacting with the Kardinal API
 */

// Get the Kardinal API key from environment variables
const KARDINAL_API_URL = 'https://app.kardinal.ai/api/v2';
const KARDINAL_API_KEY = process.env.KARDINAL_API_KEY || 'eyJhbGciOiJFUzM4NCJ9.eyJhdWQiOlsiYXBpIl0sImV4cCI6MTc1ODg4OTA2NywiaWF0IjoxNzQzMDc3ODY3LCJpc3MiOiJrYXJkaW5hbC5qd3QiLCJsZXZlbCI6ImFkbWluIiwibG9uZ1Rlcm0iOnRydWUsIm5iZiI6MTc0MzA3Nzg2Niwicm9sZSI6ImV4cGVydCIsInNjb3BlIjoiYWNjZXNzIiwic3ViIjoiam9uYXRoYW5fdG9rZW4ifQ.Rvwus1ueTYRCJdfKf4sdDoAZIzdfy-pZYd_2_bQDmQVwexw0cxDJUkK_TuGRKWMndDX81BiRbnJfqRhp0O876OQ4gIZqS_jPl2-BrQ6FMZ2x9enUBoiP6XNKpk73nWVD';

// Cache the JWT token to avoid requesting a new one for every API call
let jwtToken: string | null = null;
let tokenExpiryTime: number = 0;

/**
 * Get a valid JWT token for Kardinal API authentication
 * @returns {Promise<string>} A valid JWT token
 */
export async function getJwtToken(): Promise<string> {
  const currentTime = Date.now();
  
  // If the token exists and is not expired, return it
  if (jwtToken && tokenExpiryTime > currentTime) {
    return jwtToken;
  }
  
  try {
    // Set the token expiry time (assuming 24 hours validity)
    tokenExpiryTime = currentTime + 24 * 60 * 60 * 1000;
    jwtToken = KARDINAL_API_KEY;
    
    return jwtToken;
  } catch (error) {
    console.error('Error obtaining JWT token:', error);
    throw new Error('Failed to authenticate with Kardinal API');
  }
}

/**
 * Get authorization headers for Kardinal API requests
 * @returns {Promise<Object>} Headers object with Authorization and Content-Type
 */
export async function getAuthHeaders(): Promise<{ Authorization: string; 'Content-Type': string }> {
  const token = await getJwtToken();
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

/**
 * Make a GET request to the Kardinal API
 * @param {string} endpoint - API endpoint to call (without the base URL)
 * @returns {Promise<any>} API response data
 */
export async function kardinalGet(endpoint: string): Promise<any> {
  const headers = await getAuthHeaders();
  
  const response = await axios.get(
    `${KARDINAL_API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`,
    { headers }
  );
  
  return response.data;
}

/**
 * Make a POST request to the Kardinal API
 * @param {string} endpoint - API endpoint to call (without the base URL)
 * @param {any} data - Request payload
 * @returns {Promise<any>} API response data
 */
export async function kardinalPost(endpoint: string, data: any): Promise<any> {
  const headers = await getAuthHeaders();
  
  const response = await axios.post(
    `${KARDINAL_API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`,
    data,
    { headers }
  );
  
  return response.data;
}

/**
 * Make a PUT request to the Kardinal API
 * @param {string} endpoint - API endpoint to call (without the base URL)
 * @param {any} data - Request payload
 * @returns {Promise<any>} API response data
 */
export async function kardinalPut(endpoint: string, data: any): Promise<any> {
  const headers = await getAuthHeaders();
  
  const response = await axios.put(
    `${KARDINAL_API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`,
    data,
    { headers }
  );
  
  return response.data;
}

/**
 * Format route data from Kardinal API to our application format
 * @param {any} routeData - Raw route data from Kardinal API
 * @returns {Object} Formatted route data
 */
export function formatRouteData(routeData: any) {
  return {
    id: routeData.id,
    vehicle: routeData.vehicle,
    stops: routeData.stops.map((stop: any) => ({
      id: stop.id,
      location: stop.location || 'Stop',
      address: stop.address,
      estimatedTime: stop.estimated_arrival_time,
      sequence: stop.sequence,
      notes: stop.notes || '',
      coordinates: stop.coordinates || {},
      timeWindow: stop.time_window || {}
    })),
    statistics: {
      totalDistance: routeData.total_distance,
      totalDuration: routeData.total_duration,
      startTime: routeData.start_time,
      endTime: routeData.end_time
    },
    routePolyline: routeData.route_polyline || null,
    territory: routeData.territory || {}
  };
} 