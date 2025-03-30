import { NextResponse } from 'next/server';
import { kardinalGet, formatRouteData } from '../../../utils/kardinalApi';

// GET /api/routes/[route_id] - Retrieve details for a specific route
export async function GET(
  request: Request,
  { params }: { params: { route_id: string } }
) {
  try {
    const { route_id } = params;
    
    if (!route_id) {
      return NextResponse.json(
        { error: 'Route ID is required' },
        { status: 400 }
      );
    }
    
    const routeData = await kardinalGet(`/routes/${route_id}`);
    const processedResponse = formatRouteData(routeData);
    
    return NextResponse.json(processedResponse);
  } catch (error: any) {
    console.error('Error retrieving route details:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve route details',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 