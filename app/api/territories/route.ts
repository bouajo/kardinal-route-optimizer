import { NextResponse } from 'next/server';
import { kardinalGet, kardinalPost } from '../../utils/kardinalApi';

// GET /api/territories - Retrieve all territories
export async function GET() {
  try {
    const territories = await kardinalGet('/territories');
    return NextResponse.json(territories);
  } catch (error: any) {
    console.error('Error retrieving territories:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve territories',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/territories - Create a new territory
export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    
    // Validate input data
    if (!requestData || !requestData.name) {
      return NextResponse.json(
        { error: 'Invalid input data. Territory name is required.' },
        { status: 400 }
      );
    }
    
    const territoryData = {
      name: requestData.name,
      description: requestData.description || ''
    };
    
    const response = await kardinalPost('/territories', territoryData);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error creating territory:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create territory',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 