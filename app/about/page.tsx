"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Users, Target, Award, Heart, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface CompanyData {
  name: string;
  description: string;
  mission: string;
  vision: string;
  values: string[];
  stats: {
    farmers: number;
    products: number;
    cities: number;
    experience: number;
  };
  team: {
    name: string;
    role: string;
    bio: string;
  }[];
}

export default function AboutPage() {
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: process.env.NEXT_PUBLIC_COMPANY_NAME || "KisanTech",
    description:
      process.env.NEXT_PUBLIC_COMPANY_DESCRIPTION ||
      "Empowering farmers through technology and connecting them directly with consumers for a sustainable agricultural future.",
    mission:
      process.env.NEXT_PUBLIC_MISSION ||
      "To revolutionize agriculture by providing farmers with modern tools, direct market access, and sustainable farming solutions while ensuring fresh, quality produce reaches consumers efficiently.",
    vision:
      process.env.NEXT_PUBLIC_VISION ||
      "A world where technology bridges the gap between farmers and consumers, creating a sustainable, profitable, and transparent agricultural ecosystem.",
    values: [
      "Sustainability",
      "Innovation",
      "Transparency",
      "Community",
      "Quality",
      "Empowerment",
    ],
    stats: {
      farmers: parseInt(process.env.NEXT_PUBLIC_FARMERS_COUNT || "150"),
      products: parseInt(process.env.NEXT_PUBLIC_PRODUCTS_COUNT || "500"),
      cities: parseInt(process.env.NEXT_PUBLIC_CITIES_COUNT || "12"),
      experience: parseInt(process.env.NEXT_PUBLIC_EXPERIENCE_YEARS || "3"),
    },
    team: [
      {
        name: "Mayur Bijarniya",
        role: "Founder & CEO",
        bio: "Passionate about connecting technology with agriculture to create sustainable solutions for farmers and consumers.",
      },
      {
        name: "Development Team",
        role: "Technical Team",
        bio: "Dedicated developers working to build the best agricultural platform for farmers and buyers.",
      },
    ],
  });

  // Fetch real stats from database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        if (data.success) {
          setCompanyData(prev => ({
            ...prev,
            stats: data.stats
          }));
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      title: "Sustainable Farming",
      description:
        "Promoting eco-friendly farming practices and organic produce",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Direct Connection",
      description:
        "Connecting farmers directly with consumers, eliminating middlemen",
    },
    {
      icon: <Target className="h-8 w-8 text-purple-600" />,
      title: "Quality Assurance",
      description: "Ensuring the highest quality products reach your doorstep",
    },
    {
      icon: <Globe className="h-8 w-8 text-orange-600" />,
      title: "Wide Reach",
      description: "Serving customers across multiple cities and regions",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold mb-6">
                About {companyData.name}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {companyData.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {companyData.stats.farmers.toLocaleString()}+
                </div>
                <div className="text-gray-600">Happy Farmers</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {companyData.stats.products.toLocaleString()}+
                </div>
                <div className="text-gray-600">Products Listed</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {companyData.stats.cities}+
                </div>
                <div className="text-gray-600">Cities Served</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {companyData.stats.experience}+
                </div>
                <div className="text-gray-600">Years Experience</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Target className="h-6 w-6 text-green-600" />
                      Our Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {companyData.mission}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Award className="h-6 w-6 text-blue-600" />
                      Our Vision
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {companyData.vision}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What We Offer
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Comprehensive solutions for modern agriculture and sustainable
                farming
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="text-center h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="mb-4 flex justify-center">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-gray-600">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4">
              {companyData.values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Badge variant="secondary" className="px-4 py-2 text-sm">
                    <Heart className="h-4 w-4 mr-2" />
                    {value}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Team
              </h2>
              <p className="text-gray-600">
                Meet the people behind {companyData.name}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {companyData.team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {member.name}
                      </h3>
                      <p className="text-green-600 font-medium mb-3">
                        {member.role}
                      </p>
                      <p className="text-gray-600">{member.bio}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
