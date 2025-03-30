import { NextResponse } from 'next/server';

// This API endpoint can be used to initialize a Flatfile session from the server-side
// This is useful if you need to handle Flatfile initialization with server-side logic

export async function POST(request: Request) {
  try {
    const FLATFILE_SECRET_KEY = process.env.FLATFILE_SECRET_KEY || 'sk_2bf550be40f2415b84bd069afbdd7b13';
    
    // You would typically make API calls to Flatfile here using their API
    // For example, creating a new import session

    // Mock response for demonstration
    return NextResponse.json({
      success: true,
      message: 'Flatfile session initialized',
      keyUsed: FLATFILE_SECRET_KEY.substring(0, 5) + '...' // Don't expose full key
    });
  } catch (error: any) {
    console.error('Error initializing Flatfile:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to initialize Flatfile',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 