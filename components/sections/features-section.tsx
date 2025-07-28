"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Wrench, CloudRain, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  {
    icon: ShoppingBag,
    title: "E-commerce for Farmers",
    description: "Showcase your products on our modern e-commerce platform and transform your harvest into profits. Connect directly with buyers seeking fresh, locally sourced produce.",
    href: "/store",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  {
    icon: Wrench,
    title: "Equipment Rental Portal",
    description: "List your surplus equipment and turn idle assets into income streams. Connect with fellow agriculturalists in need of specialized tools and machinery.",
    href: "/rentals",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    icon: CloudRain,
    title: "Weather Forecasting",
    description: "Stay informed about weather conditions crucial for your crops' health. Make informed decisions to optimize your farming practices and yields.",
    href: "/weather",
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">Our Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We are the first and only comprehensive platform enabling you to help finance 
            and support our farmers with modern technology solutions.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                <CardHeader className="space-y-4">
                  <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <Button 
                    variant="ghost" 
                    className="group/btn p-0 h-auto font-medium text-primary hover:text-primary/80"
                    asChild
                  >
                    <Link href={feature.href}>
                      Explore
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button size="lg" variant="outline" asChild>
            <Link href="/about">
              Learn More About KisanTech
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}