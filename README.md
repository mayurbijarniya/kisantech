# KisanTech - Agricultural E-commerce Platform

A modern agricultural e-commerce platform built with Next.js, connecting farmers directly with consumers for fresh produce and equipment rentals.

## 🌱 Features

- **Product Management**: Buy and rent agricultural products
- **User Roles**: Buyers, Sellers, and Admin dashboards
- **Real-time Weather**: Weather forecasting for farming activities
- **Dark/Light Mode**: Complete theme support
- **Responsive Design**: Works on all devices
- **Secure Authentication**: JWT-based authentication
- **Image Upload**: Product photo management
- **Cart System**: Shopping cart with localStorage
- **Order Management**: Complete order tracking system

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: JWT, bcryptjs
- **UI Components**: Radix UI, Lucide React
- **Database**: MongoDB with Mongoose
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd kisantech-unified
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌍 Environment Variables

### Required Variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens

### Optional Variables:
- `NEXT_PUBLIC_COMPANY_NAME`: Company name
- `NEXT_PUBLIC_COMPANY_DESCRIPTION`: Company description
- `WEATHER_API_KEY`: For real-time weather data

## 🏗️ Project Structure

```
kisantech-unified/
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API routes
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── layout/           # Layout components
│   └── sections/         # Page sections
├── context/              # React contexts
├── lib/                  # Utility functions
├── models/               # MongoDB models
└── public/               # Static assets
```

## 🚀 Deployment

### Deploy to Vercel:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
npm run deploy
```

### Environment Variables for Vercel:
- `MONGODB_URI`
- `JWT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm run clean` - Clean build files
- `npm run deploy` - Deploy to Vercel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with Next.js and React
- UI components from Radix UI
- Icons from Lucide React
- Styling with Tailwind CSS

---

Made with ❤️ for farmers and agricultural communities.