import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const units = searchParams.get('units') || 'metric';

    if (!location) {
      return NextResponse.json(
        { error: 'Location parameter is required' },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'Weather API key not configured' },
        { status: 500 }
      );
    }

    // Fetch current weather
    const currentWeatherResponse = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=${units}`
    );

    if (!currentWeatherResponse.ok) {
      throw new Error('Failed to fetch current weather data');
    }

    const currentWeather = await currentWeatherResponse.json();

    // Debug logging for timezone
    console.log('Location:', currentWeather.name);
    console.log('Timezone offset (seconds):', currentWeather.timezone);
    console.log('Sunrise UTC timestamp:', currentWeather.sys.sunrise);
    console.log('Sunset UTC timestamp:', currentWeather.sys.sunset);

    // Fetch 5-day forecast
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=${units}`
    );

    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const forecast = await forecastResponse.json();

    // Process and format the data
    const weatherData = {
      location: `${currentWeather.name}, ${currentWeather.sys.country}`,
      coordinates: {
        lat: currentWeather.coord.lat,
        lon: currentWeather.coord.lon
      },
      current: {
        temperature: Math.round(currentWeather.main.temp),
        condition: currentWeather.weather[0].main,
        description: currentWeather.weather[0].description,
        humidity: currentWeather.main.humidity,
        windSpeed: Math.round(currentWeather.wind.speed * (units === 'metric' ? 3.6 : 2.237)), // Convert m/s to km/h or mph
        windDirection: currentWeather.wind.deg,
        visibility: Math.round((currentWeather.visibility || 10000) / (units === 'metric' ? 1000 : 1609.34)), // Convert to km or miles
        uvIndex: 0, // UV index requires separate API call - will be 0 if not available
        pressure: currentWeather.main.pressure,
        feelsLike: Math.round(currentWeather.main.feels_like),
        dewPoint: calculateDewPoint(currentWeather.main.temp, currentWeather.main.humidity),
        cloudCover: currentWeather.clouds.all,
        sunrise: formatLocalTime(currentWeather.sys.sunrise, currentWeather.timezone || 0),
        sunset: formatLocalTime(currentWeather.sys.sunset, currentWeather.timezone || 0),
        icon: currentWeather.weather[0].icon
      },
      forecast: forecast.list.slice(0, 40).filter((_: any, index: number) => index % 8 === 0).map((item: any) => ({
        date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min),
        condition: item.weather[0].main,
        description: item.weather[0].description,
        precipitation: Math.round((item.pop || 0) * 100),
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * (units === 'metric' ? 3.6 : 2.237)),
        icon: item.weather[0].icon
      })),
      alerts: generateFarmingAlerts(currentWeather, forecast.list[0], units)
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

// Helper function to calculate dew point
function calculateDewPoint(temp: number, humidity: number): number {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
  return Math.round((b * alpha) / (a - alpha));
}

// Helper function to format time with correct timezone
function formatLocalTime(utcTimestamp: number, timezoneOffsetSeconds: number): string {
  // Convert UTC timestamp to milliseconds and add timezone offset
  const localTimeMs = (utcTimestamp + timezoneOffsetSeconds) * 1000;
  const localDate = new Date(localTimeMs);
  
  // Get hours and minutes in UTC (since we already applied the offset)
  const hours = localDate.getUTCHours();
  const minutes = localDate.getUTCMinutes();
  
  // Convert to 12-hour format
  let displayHour = hours;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  if (displayHour === 0) {
    displayHour = 12; // Midnight
  } else if (displayHour > 12) {
    displayHour = displayHour - 12; // Afternoon/evening
  }
  
  const minutesStr = minutes.toString().padStart(2, '0');
  
  return `${displayHour}:${minutesStr} ${ampm}`;
}

// Generate farming-specific alerts
function generateFarmingAlerts(current: any, forecast: any, units: string = 'metric') {
  const alerts = [];
  
  // Temperature alerts - adjust thresholds based on units
  const highTempThreshold = units === 'metric' ? 35 : 95; // 35°C = 95°F
  const lowTempThreshold = units === 'metric' ? 5 : 41;   // 5°C = 41°F
  
  if (current.main.temp > highTempThreshold) {
    alerts.push({
      type: 'Heat Stress Warning',
      message: 'Extremely high temperatures detected. Ensure adequate irrigation and consider shade protection for sensitive crops.',
      severity: 'high' as const
    });
  } else if (current.main.temp < lowTempThreshold) {
    alerts.push({
      type: 'Frost Warning',
      message: 'Low temperatures may cause frost damage. Protect sensitive plants and consider covering crops.',
      severity: 'high' as const
    });
  }

  // Humidity alerts
  if (current.main.humidity > 85) {
    alerts.push({
      type: 'High Humidity Alert',
      message: 'High humidity levels increase risk of fungal diseases. Monitor crops closely and ensure good ventilation.',
      severity: 'medium' as const
    });
  } else if (current.main.humidity < 30) {
    alerts.push({
      type: 'Low Humidity Alert',
      message: 'Low humidity may stress plants. Consider increasing irrigation frequency.',
      severity: 'medium' as const
    });
  }

  // Wind alerts
  if (current.wind.speed > 10) {
    alerts.push({
      type: 'Strong Wind Warning',
      message: 'Strong winds detected. Secure loose structures and check for crop damage.',
      severity: 'medium' as const
    });
  }

  // Precipitation forecast
  if (forecast.pop > 0.7) {
    alerts.push({
      type: 'Heavy Rain Expected',
      message: 'Heavy rainfall expected in the next few hours. Consider postponing field operations and ensure proper drainage.',
      severity: 'high' as const
    });
  }

  return alerts;
}