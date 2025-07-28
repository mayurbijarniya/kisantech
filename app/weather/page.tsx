"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow, 
  Wind, 
  Droplets, 
  Thermometer, 
  Eye,
  MapPin,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface WeatherData {
  location: string;
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    uvIndex: number;
    pressure: number;
    feelsLike: number;
  };
  forecast: {
    date: string;
    high: number;
    low: number;
    condition: string;
    precipitation: number;
    humidity: number;
  }[];
  alerts: {
    type: string;
    message: string;
    severity: "low" | "medium" | "high";
  }[];
}

// Sample weather data
const sampleWeatherData: WeatherData = {
  location: "Pune, Maharashtra",
  current: {
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    uvIndex: 6,
    pressure: 1013,
    feelsLike: 31
  },
  forecast: [
    {
      date: "Today",
      high: 32,
      low: 22,
      condition: "Sunny",
      precipitation: 0,
      humidity: 60
    },
    {
      date: "Tomorrow",
      high: 29,
      low: 20,
      condition: "Partly Cloudy",
      precipitation: 10,
      humidity: 70
    },
    {
      date: "Day 3",
      high: 26,
      low: 18,
      condition: "Rainy",
      precipitation: 80,
      humidity: 85
    },
    {
      date: "Day 4",
      high: 30,
      low: 21,
      condition: "Cloudy",
      precipitation: 20,
      humidity: 75
    },
    {
      date: "Day 5",
      high: 33,
      low: 24,
      condition: "Sunny",
      precipitation: 0,
      humidity: 55
    }
  ],
  alerts: [
    {
      type: "Heavy Rain Warning",
      message: "Heavy rainfall expected in the next 48 hours. Consider postponing outdoor farming activities.",
      severity: "high"
    },
    {
      type: "High UV Index",
      message: "UV index is high today. Protect yourself and crops from direct sunlight.",
      severity: "medium"
    }
  ]
};

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "sunny":
      return <Sun className="h-8 w-8 text-yellow-500" />;
    case "partly cloudy":
      return <Cloud className="h-8 w-8 text-gray-500" />;
    case "cloudy":
      return <Cloud className="h-8 w-8 text-gray-600" />;
    case "rainy":
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    case "snowy":
      return <CloudSnow className="h-8 w-8 text-blue-300" />;
    default:
      return <Sun className="h-8 w-8 text-yellow-500" />;
  }
};

const getAlertColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData>(sampleWeatherData);
  const [searchLocation, setSearchLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLocation.trim()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In real implementation, fetch weather data for the searched location
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Weather Forecast</h1>
          <p className="text-muted-foreground">
            Get accurate weather predictions to plan your farming activities
          </p>
        </div>

        {/* Location Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleLocationSearch} className="flex gap-4">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for a location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Weather Alerts */}
        {weatherData.alerts.length > 0 && (
          <div className="mb-8 space-y-4">
            <h2 className="text-xl font-semibold">Weather Alerts</h2>
            {weatherData.alerts.map((alert, index) => (
              <Card key={index} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Badge className={getAlertColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <div>
                      <h3 className="font-semibold">{alert.type}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Weather */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Current Weather - {weatherData.location}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Main Weather Info */}
                  <div className="flex items-center gap-4">
                    {getWeatherIcon(weatherData.current.condition)}
                    <div>
                      <div className="text-4xl font-bold">
                        {weatherData.current.temperature}°C
                      </div>
                      <div className="text-muted-foreground">
                        {weatherData.current.condition}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Feels like {weatherData.current.feelsLike}°C
                      </div>
                    </div>
                  </div>

                  {/* Weather Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">Humidity</div>
                        <div className="font-semibold">{weatherData.current.humidity}%</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">Wind</div>
                        <div className="font-semibold">{weatherData.current.windSpeed} km/h</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">Visibility</div>
                        <div className="font-semibold">{weatherData.current.visibility} km</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">Pressure</div>
                        <div className="font-semibold">{weatherData.current.pressure} hPa</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* UV Index & Farming Tips */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>UV Index</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {weatherData.current.uvIndex}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {weatherData.current.uvIndex <= 2 ? "Low" :
                     weatherData.current.uvIndex <= 5 ? "Moderate" :
                     weatherData.current.uvIndex <= 7 ? "High" : "Very High"}
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(weatherData.current.uvIndex / 11) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Farming Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <p>Good conditions for outdoor farming activities</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                    <p>Monitor humidity levels for pest management</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <p>Consider irrigation based on upcoming rainfall</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              5-Day Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {weatherData.forecast.map((day, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-muted/30">
                  <div className="font-semibold mb-2">{day.date}</div>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {day.condition}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="font-semibold">{day.high}°</span>
                    <span className="text-muted-foreground">{day.low}°</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <Droplets className="h-3 w-3" />
                    <span>{day.precipitation}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}