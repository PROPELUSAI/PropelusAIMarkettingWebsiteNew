import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/api/v1/testimonials/approved`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Fetch testimonials error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}
