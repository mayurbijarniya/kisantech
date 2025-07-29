# KisanTech - Smart Agricultural Platform

Agricultural e-commerce platform with intelligent weather analysis for data-driven farming decisions.

## Features

- **E-commerce**: Buy/sell agricultural products and equipment rentals
- **Weather Intelligence**: Real-time weather data with crop-specific recommendations  
- **Multi-user System**: Farmers, buyers, and admin dashboards
- **Global Support**: Celsius/Fahrenheit units, worldwide locations
- **Responsive Design**: Dark/light mode, mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, JWT Authentication  
- **APIs**: OpenWeatherMap for weather data
- **Deployment**: Vercel

## Quick Start

```bash
git clone https://github.com/mayurbijarniya/kisantech
cd kisantech-unified
npm install
```

Create `.env.local`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
```

```bash
npm run dev
```

Get your free OpenWeatherMap API key at [openweathermap.org](https://openweathermap.org/api)

## Project Structure

```
kisantech-unified/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── weather/           # Weather intelligence
│   ├── dashboard/         # User dashboards  
│   ├── login/             # Authentication
│   ├── products/          # Product pages
│   └── cart/              # Shopping cart
├── components/            # UI components
├── lib/                   # Utilities
├── context/               # React contexts
├── models/                # MongoDB schemas
└── public/                # Static assets
```

## Deployment

Deploy to Vercel with these environment variables:
```env
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
OPENWEATHERMAP_API_KEY=your_api_key
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Code linting
```

## Weather Features

- **45+ crops** with optimal growing conditions analysis
- **Global locations** with real-time weather data
- **Temperature units**: Celsius & Fahrenheit support
- **Smart recommendations** for farming activities
- **5-day forecast** with agricultural insights

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built for farmers and agricultural communities worldwide.