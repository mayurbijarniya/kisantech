"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cropDatabase, getCropRecommendations } from "@/lib/crop-database";
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
  Sunrise,
  Sunset,
  Gauge,
  CloudDrizzle,
  Zap,
  Leaf,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Globe,
  Wheat,
  Shield,
  TrendingUp,
  Activity,
  Target
} from "lucide-react";

interface WeatherData {
  location: string;
  current: {
    temperature: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    visibility: number;
    uvIndex: number;
    pressure: number;
    feelsLike: number;
    sunrise: string;
    sunset: string;
    icon: string;
  };
  forecast: {
    date: string;
    high: number;
    low: number;
    condition: string;
    description: string;
    precipitation: number;
    humidity: number;
    windSpeed: number;
    icon: string;
  }[];
  alerts: {
    type: string;
    message: string;
    severity: "low" | "medium" | "high";
  }[];
}

// Location suggestions for popular agricultural regions
const locationSuggestions = [
  // India
  "Pune, Maharashtra, India",
  "Delhi, India",
  "Mumbai, Maharashtra, India",
  "Bangalore, Karnataka, India",
  "Chennai, Tamil Nadu, India",
  "Hyderabad, Telangana, India",
  "Kolkata, West Bengal, India",
  "Ahmedabad, Gujarat, India",
  "Jaipur, Rajasthan, India",
  "Lucknow, Uttar Pradesh, India",
  "Chandigarh, India",
  "Bhopal, Madhya Pradesh, India",
  "Patna, Bihar, India",
  "Thiruvananthapuram, Kerala, India",
  "Guwahati, Assam, India",
  // USA
  "Iowa City, Iowa, USA",
  "Des Moines, Iowa, USA",
  "Lincoln, Nebraska, USA",
  "Topeka, Kansas, USA",
  "Springfield, Illinois, USA",
  "Sacramento, California, USA",
  "Phoenix, Arizona, USA",
  "Austin, Texas, USA",
  "Atlanta, Georgia, USA",
  "Raleigh, North Carolina, USA",
  // Other countries
  "São Paulo, Brazil",
  "Buenos Aires, Argentina",
  "Sydney, Australia",
  "Melbourne, Australia",
  "Toronto, Canada",
  "Vancouver, Canada",
  "London, UK",
  "Paris, France",
  "Berlin, Germany",
  "Rome, Italy",
  "Madrid, Spain",
  "Amsterdam, Netherlands",
  "Bangkok, Thailand",
  "Jakarta, Indonesia",
  "Manila, Philippines",
  "Dhaka, Bangladesh",
  "Karachi, Pakistan",
  "Lagos, Nigeria",
  "Cairo, Egypt",
  "Nairobi, Kenya"
];

const getWeatherIcon = (condition: string, size: string = "h-8 w-8") => {
  switch (condition.toLowerCase()) {
    case "clear":
    case "sunny":
      return <Sun className={`${size} text-yellow-500`} />;
    case "clouds":
    case "partly cloudy":
      return <Cloud className={`${size} text-gray-500`} />;
    case "cloudy":
    case "overcast":
      return <Cloud className={`${size} text-gray-600`} />;
    case "rain":
    case "rainy":
      return <CloudRain className={`${size} text-blue-500`} />;
    case "drizzle":
      return <CloudDrizzle className={`${size} text-blue-400`} />;
    case "snow":
    case "snowy":
      return <CloudSnow className={`${size} text-blue-300`} />;
    case "thunderstorm":
      return <Zap className={`${size} text-purple-500`} />;
    default:
      return <Sun className={`${size} text-yellow-500`} />;
  }
};

const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(degrees / 22.5) % 16];
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
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [temperatureUnit, setTemperatureUnit] = useState<'metric' | 'imperial'>('metric'); // Celsius by default
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [cropSuggestions, setCropSuggestions] = useState<string[]>([]);
  const [showCropDropdown, setShowCropDropdown] = useState(false);
  const [locationSuggestionsFiltered, setLocationSuggestionsFiltered] = useState<string[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const fetchWeatherData = async (location: string) => {
    try {
      setIsLoading(true);
      setError("");
      
      const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}&units=${temperatureUnit}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch weather data');
      }
      
      const data = await response.json();
      setWeatherData(data);
      setHasAnalyzed(true);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data. Please check your API key configuration.');
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSearch = async (value: string) => {
    setSearchLocation(value);
    if (value.length > 2) {
      try {
        const response = await fetch(`/api/weather/locations?q=${encodeURIComponent(value)}`);
        if (response.ok) {
          const data = await response.json();
          setLocationSuggestionsFiltered(data.locations.map((loc: any) => loc.displayName));
          setShowLocationDropdown(true);
        } else {
          // Fallback to static suggestions
          const filtered = locationSuggestions
            .filter(location => location.toLowerCase().includes(value.toLowerCase()))
            .slice(0, 8);
          setLocationSuggestionsFiltered(filtered);
          setShowLocationDropdown(true);
        }
      } catch (error) {
        // Fallback to static suggestions
        const filtered = locationSuggestions
          .filter(location => location.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 8);
        setLocationSuggestionsFiltered(filtered);
        setShowLocationDropdown(true);
      }
    } else {
      setShowLocationDropdown(false);
    }
  };

  const selectLocation = (location: string) => {
    setSearchLocation(location);
    setShowLocationDropdown(false);
  };

  const handleCropSearch = (value: string) => {
    setSelectedCrop(value);
    if (value.length > 0) {
      const suggestions = Object.keys(cropDatabase)
        .filter(crop => crop.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8);
      setCropSuggestions(suggestions);
      setShowCropDropdown(true);
    } else {
      setShowCropDropdown(false);
    }
  };

  const selectCrop = (crop: string) => {
    setSelectedCrop(crop);
    setShowCropDropdown(false);
  };

  const handleAnalyze = async () => {
    if (!searchLocation.trim()) {
      setError("Please enter a location to analyze");
      return;
    }
    await fetchWeatherData(searchLocation);
  };

  const getCropAnalysis = () => {
    if (!selectedCrop || !weatherData) return null;
    return getCropRecommendations(selectedCrop, weatherData.current, temperatureUnit);
  };

  // Helper functions for temperature display and thresholds
  const getTemperatureUnit = () => temperatureUnit === 'metric' ? '°C' : '°F';
  const getWindSpeedUnit = () => temperatureUnit === 'metric' ? 'km/h' : 'mph';
  const getVisibilityUnit = () => temperatureUnit === 'metric' ? 'km' : 'miles';
  
  // Temperature thresholds based on unit
  const getHeatStressThreshold = () => temperatureUnit === 'metric' ? 35 : 95;   // 35°C = 95°F
  const getFrostThreshold = () => temperatureUnit === 'metric' ? 5 : 41;        // 5°C = 41°F
  const getOptimalTempMin = () => temperatureUnit === 'metric' ? 15 : 59;       // 15°C = 59°F
  const getOptimalTempMax = () => temperatureUnit === 'metric' ? 30 : 86;       // 30°C = 86°F
  const getWindThreshold = () => temperatureUnit === 'metric' ? 25 : 16;        // 25 km/h = ~16 mph

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 dark:text-white flex items-center justify-center gap-3">
            <CloudRain className="h-10 w-10 text-blue-500" />
            Agricultural Weather Intelligence
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get real-time weather analysis and crop-specific recommendations for smart farming decisions
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              Global Coverage
            </span>
            <span className="flex items-center gap-1">
              <Thermometer className="h-4 w-4" />
              Celsius & Fahrenheit
            </span>
            <span className="flex items-center gap-1">
              <Wheat className="h-4 w-4" />
              45+ Crops
            </span>
          </div>
        </div>

        {/* Search Interface */}
        <Card className="mb-8 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center dark:text-white">Analyze Weather for Your Farm</CardTitle>
            <CardDescription className="text-center">
              Enter your location and select a crop to get personalized agricultural insights
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Location Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-white flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter city, state, or country..."
                    value={searchLocation}
                    onChange={(e) => handleLocationSearch(e.target.value)}
                    className="pl-10"
                  />
                  {showLocationDropdown && locationSuggestionsFiltered.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg z-20 max-h-48 overflow-y-auto">
                      {locationSuggestionsFiltered.map((location, index) => (
                        <div
                          key={index}
                          className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                          onClick={() => selectLocation(location)}
                        >
                          <div className="font-medium">{location}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Crop Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-white flex items-center gap-1">
                  <Wheat className="h-4 w-4" />
                  Crop (Optional)
                </label>
                <div className="relative">
                  <Leaf className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Select crop for specific analysis..."
                    value={selectedCrop}
                    onChange={(e) => handleCropSearch(e.target.value)}
                    className="pl-10"
                  />
                  {showCropDropdown && cropSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg z-20 max-h-48 overflow-y-auto">
                      {cropSuggestions.map((crop) => (
                        <div
                          key={crop}
                          className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                          onClick={() => selectCrop(crop)}
                        >
                          <div className="font-medium capitalize">{crop}</div>
                          <div className="text-sm text-muted-foreground">
                            {cropDatabase[crop]?.category}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Temperature Unit Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-white flex items-center gap-1">
                  <Thermometer className="h-4 w-4" />
                  Temperature Unit
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={temperatureUnit === 'metric' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTemperatureUnit('metric')}
                    className="h-10"
                  >
                    <Thermometer className="h-4 w-4 mr-1" />
                    °C
                  </Button>
                  <Button
                    variant={temperatureUnit === 'imperial' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTemperatureUnit('imperial')}
                    className="h-10"
                  >
                    <Thermometer className="h-4 w-4 mr-1" />
                    °F
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {temperatureUnit === 'metric' ? 'Celsius, km/h, km' : 'Fahrenheit, mph, miles'}
                </p>
              </div>
            </div>

            {/* Analyze Button */}
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading || !searchLocation.trim()} 
              className="w-full h-12 text-lg"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing Weather...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Analyze Weather & Get Recommendations
                </>
              )}
            </Button>

            {/* Popular Locations */}
            {!hasAnalyzed && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-3 text-center">Popular agricultural regions:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Pune, India", "Iowa, USA", "São Paulo, Brazil", "Punjab, India", "California, USA", "Queensland, Australia"].map((location) => (
                    <Button
                      key={location}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchLocation(location);
                        setShowLocationDropdown(false);
                      }}
                    >
                      {location}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-red-500 max-w-4xl mx-auto">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section - Only show after analysis */}
        {hasAnalyzed && weatherData && (
          <div className="space-y-8">{/* Weather results will go here */}

            {/* Weather Alerts */}
            {weatherData.alerts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 dark:text-white flex items-center gap-2">
                  <Shield className="h-6 w-6 text-red-500" />
                  Agricultural Alerts
                </h2>
                <div className="space-y-4">
                  {weatherData.alerts.map((alert, index) => (
                    <Card key={index} className={`border-l-4 ${
                      alert.severity === 'high' ? 'border-l-red-500' :
                      alert.severity === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Badge className={getAlertColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <div className="flex-1">
                            <h3 className="font-semibold dark:text-white">{alert.type}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {alert.message}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Crop Analysis */}
            {selectedCrop && getCropAnalysis() && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 dark:text-white">
                    <Leaf className="h-5 w-5 text-green-500" />
                    Crop Analysis: {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)}
                  </CardTitle>
                  <CardDescription>
                    Weather conditions analysis for {selectedCrop} cultivation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const analysis = getCropAnalysis()!;
                    return (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                          {analysis.status === 'optimal' && <CheckCircle className="h-6 w-6 text-green-500" />}
                          {analysis.status === 'acceptable' && <AlertTriangle className="h-6 w-6 text-yellow-500" />}
                          {analysis.status === 'poor' && <XCircle className="h-6 w-6 text-red-500" />}
                          <div>
                            <span className={`text-lg font-semibold ${
                              analysis.status === 'optimal' ? 'text-green-600' :
                              analysis.status === 'acceptable' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {analysis.status === 'optimal' ? (
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="h-4 w-4" />
                                  Optimal Conditions
                                </span>
                              ) : analysis.status === 'acceptable' ? (
                                <span className="flex items-center gap-1">
                                  <AlertTriangle className="h-4 w-4" />
                                  Acceptable Conditions
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <XCircle className="h-4 w-4" />
                                  Poor Conditions
                                </span>
                              )}
                            </span>
                            <p className="text-sm text-muted-foreground">
                              Current weather is {analysis.status} for {selectedCrop} cultivation
                            </p>
                          </div>
                        </div>
                        
                        {analysis.warnings.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-semibold text-red-600 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Weather Warnings
                            </h4>
                            {analysis.warnings.map((warning, idx) => (
                              <div key={idx} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-700 dark:text-red-300">{warning}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="space-y-3">
                          <h4 className="font-semibold text-green-600 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Farming Recommendations
                          </h4>
                          {analysis.recommendations.map((rec, idx) => (
                            <div key={idx} className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                              <p className="text-sm text-green-700 dark:text-green-300">{rec}</p>
                            </div>
                          ))}
                        </div>

                        {cropDatabase[selectedCrop] && (
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-semibold mb-3 dark:text-white flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Crop Requirements vs Current Conditions
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div className="flex justify-between items-center p-2 bg-background rounded">
                                  <span className="text-sm text-muted-foreground">Optimal Temperature:</span>
                                  <span className="font-medium">
                                    {temperatureUnit === 'metric' 
                                      ? `${cropDatabase[selectedCrop].optimalTemp[0]}°C - ${cropDatabase[selectedCrop].optimalTemp[1]}°C`
                                      : `${Math.round((cropDatabase[selectedCrop].optimalTemp[0] * 9/5) + 32)}°F - ${Math.round((cropDatabase[selectedCrop].optimalTemp[1] * 9/5) + 32)}°F`
                                    }
                                  </span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-background rounded">
                                  <span className="text-sm text-muted-foreground">Current Temperature:</span>
                                  <span className={`font-medium ${
                                    weatherData.current.temperature >= cropDatabase[selectedCrop].optimalTemp[0] && 
                                    weatherData.current.temperature <= cropDatabase[selectedCrop].optimalTemp[1] 
                                    ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {weatherData.current.temperature}{getTemperatureUnit()}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center p-2 bg-background rounded">
                                  <span className="text-sm text-muted-foreground">Optimal Humidity:</span>
                                  <span className="font-medium">{cropDatabase[selectedCrop].optimalHumidity[0]}% - {cropDatabase[selectedCrop].optimalHumidity[1]}%</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-background rounded">
                                  <span className="text-sm text-muted-foreground">Current Humidity:</span>
                                  <span className={`font-medium ${
                                    weatherData.current.humidity >= cropDatabase[selectedCrop].optimalHumidity[0] && 
                                    weatherData.current.humidity <= cropDatabase[selectedCrop].optimalHumidity[1] 
                                    ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {weatherData.current.humidity}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Current Weather */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <MapPin className="h-5 w-5" />
                      Current Weather - {weatherData.location}
                    </CardTitle>
                    <CardDescription>
                      Real-time weather conditions for your farm
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Main Weather Info */}
                      <div className="flex items-center gap-4">
                        {getWeatherIcon(weatherData.current.condition, "h-16 w-16")}
                        <div>
                          <div className="text-4xl font-bold dark:text-white">
                            {weatherData.current.temperature}{getTemperatureUnit()}
                          </div>
                          <div className="text-muted-foreground capitalize">
                            {weatherData.current.description}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Feels like {weatherData.current.feelsLike}{getTemperatureUnit()}
                          </div>
                        </div>
                      </div>

                      {/* Weather Details Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="text-sm text-muted-foreground">Humidity</div>
                            <div className="font-semibold dark:text-white">{weatherData.current.humidity}%</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Wind className="h-4 w-4 text-gray-500" />
                          <div>
                            <div className="text-sm text-muted-foreground">Wind</div>
                            <div className="font-semibold dark:text-white">
                              {weatherData.current.windSpeed} {getWindSpeedUnit()} {getWindDirection(weatherData.current.windDirection)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-green-500" />
                          <div>
                            <div className="text-sm text-muted-foreground">Visibility</div>
                            <div className="font-semibold dark:text-white">{weatherData.current.visibility} {getVisibilityUnit()}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-red-500" />
                          <div>
                            <div className="text-sm text-muted-foreground">Pressure</div>
                            <div className="font-semibold dark:text-white">{weatherData.current.pressure} hPa</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sunrise & Sunset - Farmer Relevant */}
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <Sunrise className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                          <div className="text-sm text-muted-foreground">Sunrise</div>
                          <div className="font-semibold dark:text-white text-lg">{weatherData.current.sunrise}</div>
                        </div>
                        
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <Sunset className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                          <div className="text-sm text-muted-foreground">Sunset</div>
                          <div className="font-semibold dark:text-white text-lg">{weatherData.current.sunset}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Agricultural Insights */}
              <div className="space-y-6">
                {/* UV Index - Only show if we have real data */}
                {weatherData.current.uvIndex > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="dark:text-white flex items-center gap-2">
                        <Sun className="h-5 w-5 text-yellow-500" />
                        Sun Protection
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-500 mb-2">
                          {weatherData.current.uvIndex}
                        </div>
                        <div className="text-sm text-muted-foreground mb-4">
                          {weatherData.current.uvIndex <= 2 ? "Low - Safe for outdoor work" :
                           weatherData.current.uvIndex <= 5 ? "Moderate - Use sun protection" :
                           weatherData.current.uvIndex <= 7 ? "High - Limit midday exposure" : "Very High - Avoid midday sun"}
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
                )}

                {/* Agricultural Conditions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="dark:text-white flex items-center gap-2">
                      <Wheat className="h-5 w-5 text-green-500" />
                      Agricultural Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Temperature Status */}
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium">Temperature ({weatherData.current.temperature}{getTemperatureUnit()})</span>
                        </div>
                        <Badge variant={
                          weatherData.current.temperature > getHeatStressThreshold() ? "destructive" :
                          weatherData.current.temperature >= getOptimalTempMin() && weatherData.current.temperature <= getOptimalTempMax() ? "default" : "secondary"
                        }>
                          {weatherData.current.temperature > getHeatStressThreshold() ? "Too Hot" :
                           weatherData.current.temperature < getFrostThreshold() ? "Too Cold" :
                           weatherData.current.temperature >= getOptimalTempMin() && weatherData.current.temperature <= getOptimalTempMax() ? "Good" : "Cool"}
                        </Badge>
                      </div>

                      {/* Humidity Status */}
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Humidity ({weatherData.current.humidity}%)</span>
                        </div>
                        <Badge variant={
                          weatherData.current.humidity > 85 ? "destructive" :
                          weatherData.current.humidity >= 40 && weatherData.current.humidity <= 70 ? "default" : "secondary"
                        }>
                          {weatherData.current.humidity > 85 ? "Too High" :
                           weatherData.current.humidity < 30 ? "Too Low" :
                           weatherData.current.humidity >= 40 && weatherData.current.humidity <= 70 ? "Good" : "Moderate"}
                        </Badge>
                      </div>

                      {/* Wind Status */}
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Wind className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Wind ({weatherData.current.windSpeed} {getWindSpeedUnit()})</span>
                        </div>
                        <Badge variant={
                          weatherData.current.windSpeed > getWindThreshold() ? "destructive" :
                          weatherData.current.windSpeed <= (temperatureUnit === 'metric' ? 15 : 9) ? "default" : "secondary"
                        }>
                          {weatherData.current.windSpeed > getWindThreshold() ? "Strong" :
                           weatherData.current.windSpeed <= (temperatureUnit === 'metric' ? 15 : 9) ? "Calm" : "Moderate"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Smart Farming Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="dark:text-white flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      Real-Time Farming Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      {/* Temperature-based recommendations */}
                      {weatherData.current.temperature > getHeatStressThreshold() && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                          <p className="text-red-700 dark:text-red-300">
                            <strong>Heat Stress Alert:</strong> Temperature is {weatherData.current.temperature}{getTemperatureUnit()}. Increase irrigation, provide shade, and avoid midday field work.
                          </p>
                        </div>
                      )}
                      
                      {weatherData.current.temperature < getFrostThreshold() && (
                        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <AlertTriangle className="h-4 w-4 text-blue-500 mt-0.5" />
                          <p className="text-blue-700 dark:text-blue-300">
                            <strong>Frost Risk:</strong> Temperature is {weatherData.current.temperature}{getTemperatureUnit()}. Protect sensitive crops and consider covering plants.
                          </p>
                        </div>
                      )}
                      
                      {/* Humidity-based recommendations */}
                      {weatherData.current.humidity > 85 && (
                        <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <Droplets className="h-4 w-4 text-yellow-500 mt-0.5" />
                          <p className="text-yellow-700 dark:text-yellow-300">
                            <strong>Disease Risk:</strong> Humidity is {weatherData.current.humidity}%. Monitor for fungal diseases and ensure good air circulation.
                          </p>
                        </div>
                      )}
                      
                      {weatherData.current.humidity < 30 && (
                        <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                          <Droplets className="h-4 w-4 text-orange-500 mt-0.5" />
                          <p className="text-orange-700 dark:text-orange-300">
                            <strong>Low Humidity:</strong> Only {weatherData.current.humidity}% humidity. Plants may need extra watering.
                          </p>
                        </div>
                      )}
                      
                      {/* Wind-based recommendations */}
                      {weatherData.current.windSpeed > getWindThreshold() && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                          <Wind className="h-4 w-4 text-red-500 mt-0.5" />
                          <p className="text-red-700 dark:text-red-300">
                            <strong>Strong Winds:</strong> {weatherData.current.windSpeed} {getWindSpeedUnit()} winds. Secure equipment and check for crop damage.
                          </p>
                        </div>
                      )}
                      
                      {/* Rain forecast */}
                      {weatherData.forecast[0]?.precipitation > 70 && (
                        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <CloudRain className="h-4 w-4 text-blue-500 mt-0.5" />
                          <p className="text-blue-700 dark:text-blue-300">
                            <strong>Heavy Rain Expected:</strong> {weatherData.forecast[0].precipitation}% chance of rain. Ensure drainage and postpone field operations.
                          </p>
                        </div>
                      )}
                      
                      {/* Ideal conditions */}
                      {weatherData.current.temperature >= getOptimalTempMin() && weatherData.current.temperature <= getOptimalTempMax() && 
                       weatherData.current.humidity >= 40 && weatherData.current.humidity <= 70 && 
                       weatherData.current.windSpeed <= (temperatureUnit === 'metric' ? 15 : 9) && (
                        <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <p className="text-green-700 dark:text-green-300">
                            <strong>Perfect Farming Weather:</strong> Temperature {weatherData.current.temperature}{getTemperatureUnit()}, humidity {weatherData.current.humidity}%, calm winds. Ideal for all field activities.
                          </p>
                        </div>
                      )}
                      
                      {/* Always show general tip */}
                      <div className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
                        <Leaf className="h-4 w-4 text-green-500 mt-0.5" />
                        <p className="text-gray-700 dark:text-gray-300">
                          <strong>General Tip:</strong> Monitor soil moisture and adjust irrigation based on current conditions and upcoming weather.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 5-Day Agricultural Forecast */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Calendar className="h-5 w-5" />
                  5-Day Agricultural Forecast
                </CardTitle>
                <CardDescription>
                  Plan your farming activities based on upcoming weather conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="text-center p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border">
                      <div className="font-semibold mb-2 dark:text-white">{day.date}</div>
                      <div className="flex justify-center mb-2">
                        {getWeatherIcon(day.condition)}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2 capitalize">
                        {day.description}
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="font-semibold text-red-500">{day.high}{getTemperatureUnit()}</span>
                        <span className="text-muted-foreground">{day.low}{getTemperatureUnit()}</span>
                      </div>
                      
                      {/* Agricultural indicators */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-1 text-xs">
                          <Droplets className="h-3 w-3 text-blue-500" />
                          <span className="text-muted-foreground">{day.precipitation}% rain</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-xs">
                          <Wind className="h-3 w-3 text-gray-500" />
                          <span className="text-muted-foreground">{day.windSpeed} {getWindSpeedUnit()}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-xs">
                          <Droplets className="h-3 w-3 text-cyan-500" />
                          <span className="text-muted-foreground">{day.humidity}% humidity</span>
                        </div>
                      </div>

                      {/* Farming activity indicator */}
                      <div className="mt-3 pt-2 border-t border-border">
                        {day.precipitation > 70 ? (
                          <Badge variant="destructive" className="text-xs">
                            Indoor Work Only
                          </Badge>
                        ) : day.precipitation > 30 ? (
                          <Badge variant="secondary" className="text-xs">
                            Limited Field Work
                          </Badge>
                        ) : day.high > getHeatStressThreshold() ? (
                          <Badge variant="destructive" className="text-xs">
                            Heat Stress Risk
                          </Badge>
                        ) : (
                          <Badge variant="default" className="text-xs">
                            Good for Field Work
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* New Analysis Button */}
            <Card className="mt-8">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Need Analysis for Different Location?</h3>
                <p className="text-muted-foreground mb-4">
                  Analyze weather conditions for another location or crop
                </p>
                <Button 
                  onClick={() => {
                    setWeatherData(null);
                    setHasAnalyzed(false);
                    setSearchLocation("");
                    setSelectedCrop("");
                    setError("");
                  }}
                  variant="outline"
                  className="w-full md:w-auto"
                >
                  <Search className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Initial State - No Analysis Yet */}
        {!hasAnalyzed && !isLoading && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <Wheat className="h-16 w-16 text-green-500 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Ready to Analyze</h3>
              <p className="text-muted-foreground">
                Enter a location above and click "Analyze Weather" to get real-time agricultural insights and crop-specific recommendations.
              </p>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}