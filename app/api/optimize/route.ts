import { NextResponse } from 'next/server';
import { kardinalPost, formatRouteData } from '../../utils/kardinalApi';

// Get the Kardinal API key from environment variables
const KARDINAL_API_URL = 'https://app.kardinal.ai/api/v2';
const KARDINAL_API_KEY = process.env.KARDINAL_API_KEY || 'eyJhbGciOiJFUzM4NCJ9.eyJhdWQiOlsiYXBpIl0sImV4cCI6MTc1ODg4OTA2NywiaWF0IjoxNzQzMDc3ODY3LCJpc3MiOiJrYXJkaW5hbC5qd3QiLCJsZXZlbCI6ImFkbWluIiwibG9uZ1Rlcm0iOnRydWUsIm5iZiI6MTc0MzA3Nzg2Niwicm9sZSI6ImV4cGVydCIsInNjb3BlIjoiYWNjZXNzIiwic3ViIjoiam9uYXRoYW5fdG9rZW4ifQ.Rvwus1ueTYRCJdfKf4sdDoAZIzdfy-pZYd_2_bQDmQVwexw0cxDJUkK_TuGRKWMndDX81BiRbnJfqRhp0O876OQ4gIZqS_jPl2-BrQ6FMZ2x9enUBoiP6XNKpk73nWVD';

// Cache the JWT token to avoid requesting a new one for every API call
let jwtToken: string | null = null;
let tokenExpiryTime: number = 0;

// Function to get a valid JWT token
async function getJwtToken() {
  const currentTime = Date.now();
  
  // If the token exists and is not expired, return it
  if (jwtToken && tokenExpiryTime > currentTime) {
    return jwtToken;
  }
  
  try {
    // Request a new token
    // Note: In the actual implementation, this should use the correct authentication endpoint
    // For now, we'll just use the JWT token directly since we have it in the .env file
    
    // Set the token expiry time (assuming 24 hours validity)
    tokenExpiryTime = currentTime + 24 * 60 * 60 * 1000;
    jwtToken = KARDINAL_API_KEY;
    
    return jwtToken;
  } catch (error) {
    console.error('Error obtaining JWT token:', error);
    throw new Error('Failed to authenticate with Kardinal API');
  }
}

export async function POST(request: Request) {
  try {
    const requestData = await request.json();

    // Validate input data
    if (!requestData || !Array.isArray(requestData.stops) || requestData.stops.length === 0) {
      return NextResponse.json(
        { error: 'Invalid input data. Expected an array of stops.' },
        { status: 400 }
      );
    }

    // Format the date (assuming current date if not provided)
    const optimizationDate = requestData.date || new Date().toISOString().split('T')[0];
    
    // Format data for Kardinal API based on the documentation
    const kardinalData = {
      territory_id: requestData.territory_id || "default_territory",
      date: optimizationDate,
      constraints: {
        vehicle_capacity: requestData.vehicleCapacity || 15,
        time_windows: requestData.timeWindows || true
      },
      stops: requestData.stops.map((stop: any) => ({
        id: stop.id || `stop-${Math.random().toString(36).substring(2, 10)}`,
        address: stop.address,
        location: stop.location || 'Stop',
        // Convert latitude/longitude if provided
        coordinates: stop.latitude && stop.longitude ? {
          lat: parseFloat(stop.latitude),
          lng: parseFloat(stop.longitude)
        } : undefined,
        // Add time windows if provided
        time_window: stop.timeWindowStart && stop.timeWindowEnd ? {
          start: stop.timeWindowStart,
          end: stop.timeWindowEnd
        } : undefined,
        // Add service duration if provided
        service_duration: stop.duration ? parseInt(stop.duration) : 5,
        // Additional data as needed
        notes: stop.notes || ''
      }))
    };

    // Call Kardinal API for route optimization using our utility function
    const optimizationResponse = await kardinalPost('/routes/optimize', kardinalData);

    // Process the response to match our application's expected format
    const processedResponse = {
      routes: optimizationResponse.routes.map((route: any) => formatRouteData(route)),
      summary: {
        totalRoutes: optimizationResponse.routes.length,
        totalStops: optimizationResponse.total_stops,
        optimizationDate: optimizationDate
      }
    };

    // Return the processed optimized routes
    return NextResponse.json(processedResponse);
  } catch (error: any) {
    console.error('Error optimizing route:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to optimize route',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 