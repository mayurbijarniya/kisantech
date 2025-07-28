"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-pattern">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-background to-earth-50/30 dark:from-green-950/20 dark:via-background dark:to-earth-950/20" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full animate-float" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-earth-400/20 dark:bg-earth-400/30 rounded-full animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-green-400/20 dark:bg-green-400/30 rounded-full animate-float" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
            >
              <Sparkles className="h-4 w-4" />
              The Future of Agriculture
            </motion.div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                A New Way to{" "}
                <span className="text-gradient">Invest</span> in{" "}
                <span className="text-gradient">Agriculture</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                KisanTech provides farmers, ranchers, and agricultural producers with 
                modern e-commerce solutions, equipment rentals, and weather forecasting. 
                Join the digital agriculture revolution.
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="group" asChild>
                <Link href="/products">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="group" asChild>
                <Link href="/about">
                  <Play className="mr-2 h-4 w-4" />
                  How it Works
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50"
            >
              <div>
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Active Farmers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Products Listed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Cities Covered</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-green-100 to-earth-100 dark:from-green-900/30 dark:to-earth-900/30">
              <Image
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=600&fit=crop&crop=center"
                alt="Modern Agriculture"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent dark:from-black/40" />
            </div>
            
            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -top-4 -right-4 bg-card border rounded-lg p-4 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Live Weather Data</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-card border rounded-lg p-4 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">₹</span>
                </div>
                <div>
                  <div className="text-sm font-medium">₹2.5L+</div>
                  <div className="text-xs text-muted-foreground">Monthly Sales</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}