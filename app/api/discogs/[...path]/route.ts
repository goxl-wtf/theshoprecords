import { NextRequest, NextResponse } from 'next/server';

const DISCOGS_BACKEND_URL = process.env.DISCOGS_BACKEND_URL || 'http://localhost:4000';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Extract path and query parameters
    const pathSegments = params.path || [];
    const { searchParams } = new URL(request.url);
    
    // Build the target URL with path and query parameters
    let targetUrl = `${DISCOGS_BACKEND_URL}/${pathSegments.join('/')}`;
    if (searchParams.toString()) {
      targetUrl += `?${searchParams.toString()}`;
    }
    
    // Make the request to the Discogs backend
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary auth headers here if required
      },
    });

    // Get the response data
    const data = await response.json();

    // Return the data with the appropriate status code
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Error proxying to Discogs backend:', error);
    return NextResponse.json(
      { message: 'Error connecting to Discogs service' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Extract path and request body
    const pathSegments = params.path || [];
    const body = await request.json();
    
    // Build the target URL
    const targetUrl = `${DISCOGS_BACKEND_URL}/${pathSegments.join('/')}`;
    
    // Make the request to the Discogs backend
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary auth headers here if required
      },
      body: JSON.stringify(body),
    });

    // Get the response data
    const data = await response.json();

    // Return the data with the appropriate status code
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Error proxying to Discogs backend:', error);
    return NextResponse.json(
      { message: 'Error connecting to Discogs service' },
      { status: 500 }
    );
  }
} 