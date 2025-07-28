"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-earth-400/5" />
      <div className="absolute inset-0 hero-pattern opacity-30" />
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float" />
      <div className="absolute top-20 right-20 w-16 h-16 bg-earth-400/20 rounded-full animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-400/20 rounded-full animate-float" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
          >
            <Sparkles className="h-4 w-4" />
            Join the Revolution
          </motion.div>

          {/* Heading */}
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              The future of{" "}
              <span className="text-gradient">Agriculture</span>{" "}
              is KisanTech
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of farmers who have already transformed their agricultural 
              business with our comprehensive platform. Start your journey today.
            </p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="xl" className="group animate-glow" asChild>
              <Link href="/register">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Trusted by 10,000+ farmers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>99.9% uptime guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>24/7 customer support</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}