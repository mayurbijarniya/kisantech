import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ locations: [] });
    }

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'Weather API key not configured' },
        { status: 500 }
      );
    }

    // Use OpenWeatherMap Geocoding API to get location suggestions
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=8&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch location suggestions');
    }

    const locations = await response.json();

    // Format the locations for display
    const formattedLocations = locations.map((location: any) => ({
      name: location.name,
      country: location.country,
      state: location.state || '',
      displayName: `${location.name}${location.state ? `, ${location.state}` : ''}, ${location.country}`,
      lat: location.lat,
      lon: location.lon
    }));

    return NextResponse.json({ locations: formattedLocations });
  } catch (error) {
    console.error('Location suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch location suggestions' },
      { status: 500 }
    );
  }
}