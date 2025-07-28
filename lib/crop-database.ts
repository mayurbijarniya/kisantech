export interface CropData {
  name: string;
  category: string;
  optimalTemp: [number, number]; // [min, max] in Celsius
  optimalHumidity: [number, number]; // [min, max] percentage
  waterRequirement: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  sensitivity: 'low' | 'moderate' | 'high';
  growthStages: {
    stage: string;
    duration: string;
    requirements: string;
  }[];
  commonDiseases: string[];
  harvestSeason: string[];
}

export const cropDatabase: Record<string, CropData> = {
  // Cereals
  wheat: {
    name: 'Wheat',
    category: 'Cereals',
    optimalTemp: [15, 25],
    optimalHumidity: [50, 70],
    waterRequirement: 'moderate',
    sensitivity: 'moderate',
    growthStages: [
      { stage: 'Germination', duration: '7-10 days', requirements: 'Consistent moisture, 15-20°C' },
      { stage: 'Tillering', duration: '30-40 days', requirements: 'Cool weather, adequate nitrogen' },
      { stage: 'Stem Extension', duration: '30-35 days', requirements: 'Moderate temperatures, regular water' },
      { stage: 'Grain Filling', duration: '30-40 days', requirements: 'Warm days, cool nights' }
    ],
    commonDiseases: ['Rust', 'Powdery Mildew', 'Septoria Leaf Blotch'],
    harvestSeason: ['April', 'May', 'June']
  },
  rice: {
    name: 'Rice',
    category: 'Cereals',
    optimalTemp: [20, 35],
    optimalHumidity: [70, 85],
    waterRequirement: 'very_high',
    sensitivity: 'high',
    growthStages: [
      { stage: 'Seedling', duration: '20-25 days', requirements: 'Flooded fields, 25-30°C' },
      { stage: 'Tillering', duration: '25-35 days', requirements: 'Standing water, warm weather' },
      { stage: 'Panicle Initiation', duration: '35-40 days', requirements: 'Consistent water level' },
      { stage: 'Grain Filling', duration: '30-35 days', requirements: 'Reduced water, sunny weather' }
    ],
    commonDiseases: ['Blast', 'Bacterial Blight', 'Sheath Blight'],
    harvestSeason: ['October', 'November', 'December']
  },
  maize: {
    name: 'Maize/Corn',
    category: 'Cereals',
    optimalTemp: [18, 27],
    optimalHumidity: [60, 75],
    waterRequirement: 'moderate',
    sensitivity: 'moderate',
    growthStages: [
      { stage: 'Germination', duration: '5-10 days', requirements: 'Soil temp >10°C, adequate moisture' },
      { stage: 'Vegetative', duration: '45-65 days', requirements: 'Warm weather, regular rainfall' },
      { stage: 'Reproductive', duration: '50-60 days', requirements: 'Consistent water, warm temperatures' },
      { stage: 'Maturity', duration: '20-30 days', requirements: 'Dry weather for harvest' }
    ],
    commonDiseases: ['Corn Borer', 'Gray Leaf Spot', 'Northern Corn Leaf Blight'],
    harvestSeason: ['September', 'October', 'November']
  },

  // Vegetables
  tomatoes: {
    name: 'Tomatoes',
    category: 'Vegetables',
    optimalTemp: [18, 26],
    optimalHumidity: [60, 70],
    waterRequirement: 'moderate',
    sensitivity: 'high',
    growthStages: [
      { stage: 'Seedling', duration: '14-21 days', requirements: 'Warm, humid conditions' },
      { stage: 'Vegetative', duration: '30-45 days', requirements: 'Consistent moisture, 20-25°C' },
      { stage: 'Flowering', duration: '45-60 days', requirements: 'Stable temperatures, good pollination' },
      { stage: 'Fruit Development', duration: '45-85 days', requirements: 'Regular watering, warm weather' }
    ],
    commonDiseases: ['Blight', 'Fusarium Wilt', 'Mosaic Virus'],
    harvestSeason: ['June', 'July', 'August', 'September']
  },
  potatoes: {
    name: 'Potatoes',
    category: 'Vegetables',
    optimalTemp: [15, 20],
    optimalHumidity: [80, 90],
    waterRequirement: 'moderate',
    sensitivity: 'moderate',
    growthStages: [
      { stage: 'Sprouting', duration: '14-28 days', requirements: 'Cool, moist soil' },
      { stage: 'Vegetative', duration: '30-45 days', requirements: 'Cool weather, regular water' },
      { stage: 'Tuber Initiation', duration: '15-20 days', requirements: 'Short days, cool nights' },
      { stage: 'Tuber Bulking', duration: '45-60 days', requirements: 'Consistent moisture, cool weather' }
    ],
    commonDiseases: ['Late Blight', 'Early Blight', 'Potato Scab'],
    harvestSeason: ['September', 'October', 'November']
  },
  onions: {
    name: 'Onions',
    category: 'Vegetables',
    optimalTemp: [15, 25],
    optimalHumidity: [50, 70],
    waterRequirement: 'moderate',
    sensitivity: 'low',
    growthStages: [
      { stage: 'Germination', duration: '7-14 days', requirements: 'Cool, moist conditions' },
      { stage: 'Vegetative', duration: '90-120 days', requirements: 'Cool weather, consistent moisture' },
      { stage: 'Bulb Formation', duration: '30-45 days', requirements: 'Long days, warm weather' },
      { stage: 'Maturity', duration: '14-21 days', requirements: 'Dry conditions for curing' }
    ],
    commonDiseases: ['Downy Mildew', 'Purple Blotch', 'White Rot'],
    harvestSeason: ['May', 'June', 'July']
  },

  // Legumes
  soybeans: {
    name: 'Soybeans',
    category: 'Legumes',
    optimalTemp: [20, 30],
    optimalHumidity: [60, 80],
    waterRequirement: 'moderate',
    sensitivity: 'moderate',
    growthStages: [
      { stage: 'Germination', duration: '5-10 days', requirements: 'Warm soil, adequate moisture' },
      { stage: 'Vegetative', duration: '35-60 days', requirements: 'Warm weather, regular rainfall' },
      { stage: 'Reproductive', duration: '45-65 days', requirements: 'Consistent water, warm temperatures' },
      { stage: 'Maturity', duration: '15-30 days', requirements: 'Dry weather for harvest' }
    ],
    commonDiseases: ['Soybean Rust', 'Sudden Death Syndrome', 'White Mold'],
    harvestSeason: ['September', 'October', 'November']
  },

  // Cash Crops
  cotton: {
    name: 'Cotton',
    category: 'Cash Crops',
    optimalTemp: [21, 30],
    optimalHumidity: [50, 80],
    waterRequirement: 'moderate',
    sensitivity: 'moderate',
    growthStages: [
      { stage: 'Germination', duration: '5-10 days', requirements: 'Warm soil >15°C' },
      { stage: 'Squaring', duration: '35-45 days', requirements: 'Warm weather, adequate water' },
      { stage: 'Flowering', duration: '45-65 days', requirements: 'Hot weather, consistent moisture' },
      { stage: 'Boll Development', duration: '45-60 days', requirements: 'Hot, sunny weather' }
    ],
    commonDiseases: ['Bollworm', 'Fusarium Wilt', 'Verticillium Wilt'],
    harvestSeason: ['October', 'November', 'December']
  },
  sugarcane: {
    name: 'Sugarcane',
    category: 'Cash Crops',
    optimalTemp: [20, 30],
    optimalHumidity: [75, 85],
    waterRequirement: 'very_high',
    sensitivity: 'moderate',
    growthStages: [
      { stage: 'Germination', duration: '20-30 days', requirements: 'Warm, moist conditions' },
      { stage: 'Tillering', duration: '60-90 days', requirements: 'High humidity, warm weather' },
      { stage: 'Grand Growth', duration: '120-180 days', requirements: 'Abundant water, hot weather' },
      { stage: 'Maturation', duration: '60-90 days', requirements: 'Reduced water, cool nights' }
    ],
    commonDiseases: ['Red Rot', 'Smut', 'Mosaic Virus'],
    harvestSeason: ['December', 'January', 'February', 'March']
  },

  // Fruits
  apples: {
    name: 'Apples',
    category: 'Fruits',
    optimalTemp: [15, 25],
    optimalHumidity: [60, 70],
    waterRequirement: 'moderate',
    sensitivity: 'moderate',
    growthStages: [
      { stage: 'Dormancy', duration: '90-120 days', requirements: 'Cold weather <7°C' },
      { stage: 'Bud Break', duration: '14-21 days', requirements: 'Warming temperatures' },
      { stage: 'Flowering', duration: '7-14 days', requirements: 'Mild weather, no frost' },
      { stage: 'Fruit Development', duration: '120-180 days', requirements: 'Consistent moisture, warm days' }
    ],
    commonDiseases: ['Apple Scab', 'Fire Blight', 'Powdery Mildew'],
    harvestSeason: ['August', 'September', 'October']
  },

  // Oil Seeds
  sunflower: {
    name: 'Sunflower',
    category: 'Oil Seeds',
    optimalTemp: [20, 25],
    optimalHumidity: [50, 70],
    waterRequirement: 'moderate',
    sensitivity: 'low',
    growthStages: [
      { stage: 'Germination', duration: '4-10 days', requirements: 'Warm soil, adequate moisture' },
      { stage: 'Vegetative', duration: '35-45 days', requirements: 'Warm weather, regular water' },
      { stage: 'Reproductive', duration: '30-45 days', requirements: 'Full sun, consistent moisture' },
      { stage: 'Maturity', duration: '25-35 days', requirements: 'Dry weather for harvest' }
    ],
    commonDiseases: ['Downy Mildew', 'Rust', 'Sclerotinia'],
    harvestSeason: ['September', 'October']
  }
};

export function getCropRecommendations(cropName: string, currentWeather: any, temperatureUnit: 'metric' | 'imperial' = 'metric'): {
  status: 'optimal' | 'acceptable' | 'poor';
  recommendations: string[];
  warnings: string[];
} {
  const crop = cropDatabase[cropName.toLowerCase()];
  if (!crop) {
    return {
      status: 'acceptable',
      recommendations: ['Crop data not available. Monitor general weather conditions.'],
      warnings: []
    };
  }

  const recommendations: string[] = [];
  const warnings: string[] = [];
  let status: 'optimal' | 'acceptable' | 'poor' = 'optimal';

  // Temperature analysis - convert crop optimal temps to current unit if needed
  const temp = currentWeather.temperature;
  const tempUnit = temperatureUnit === 'metric' ? '°C' : '°F';
  
  // Convert crop optimal temperatures to current unit
  let optimalTempMin = crop.optimalTemp[0];
  let optimalTempMax = crop.optimalTemp[1];
  
  if (temperatureUnit === 'imperial') {
    // Convert Celsius to Fahrenheit
    optimalTempMin = Math.round((optimalTempMin * 9/5) + 32);
    optimalTempMax = Math.round((optimalTempMax * 9/5) + 32);
  }
  
  if (temp < optimalTempMin || temp > optimalTempMax) {
    const tolerance = temperatureUnit === 'metric' ? 5 : 9; // 5°C = ~9°F
    status = temp < optimalTempMin - tolerance || temp > optimalTempMax + tolerance ? 'poor' : 'acceptable';
    if (temp < optimalTempMin) {
      warnings.push(`Temperature (${temp}${tempUnit}) is below optimal range for ${crop.name}`);
      recommendations.push('Consider protective measures against cold stress');
    } else {
      warnings.push(`Temperature (${temp}${tempUnit}) is above optimal range for ${crop.name}`);
      recommendations.push('Provide shade or increase irrigation to combat heat stress');
    }
  }

  // Humidity analysis
  const humidity = currentWeather.humidity;
  if (humidity < crop.optimalHumidity[0] || humidity > crop.optimalHumidity[1]) {
    if (status === 'optimal') status = 'acceptable';
    if (humidity < crop.optimalHumidity[0]) {
      recommendations.push('Consider increasing irrigation frequency due to low humidity');
    } else {
      warnings.push('High humidity increases disease risk');
      recommendations.push('Ensure good air circulation and monitor for fungal diseases');
    }
  }

  // Water requirement analysis
  if (crop.waterRequirement === 'very_high' && currentWeather.humidity < 70) {
    recommendations.push('This crop requires high water availability - monitor soil moisture closely');
  }

  // General recommendations based on current conditions
  if (currentWeather.windSpeed > 15) {
    recommendations.push('Strong winds detected - check for physical damage to plants');
  }

  if (recommendations.length === 0) {
    recommendations.push('Current weather conditions are favorable for this crop');
  }

  return { status, recommendations, warnings };
}