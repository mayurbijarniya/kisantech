"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    title: "Select your products and complete registration",
    description: "Browse through our extensive catalog of agricultural products and services. Create your account and complete the simple registration process to get started.",
    details: [
      "Browse products by category",
      "Compare prices and reviews",
      "Secure account creation",
      "Instant verification process"
    ]
  },
  {
    id: 2,
    title: "Connect with verified farmers and suppliers",
    description: "Get connected with our network of verified farmers and equipment suppliers. All our partners are thoroughly vetted for quality and reliability.",
    details: [
      "Verified supplier network",
      "Direct farmer connections",
      "Quality assurance guarantee",
      "24/7 customer support"
    ]
  },
  {
    id: 3,
    title: "Make secure payments and track orders",
    description: "Complete your transactions using our secure payment gateway. Track your orders in real-time and get updates on delivery status.",
    details: [
      "Multiple payment options",
      "Secure transaction processing",
      "Real-time order tracking",
      "Delivery notifications"
    ]
  },
  {
    id: 4,
    title: "Receive products and grow your business",
    description: "Get your products delivered safely and on time. Use our platform's analytics and insights to grow your agricultural business effectively.",
    details: [
      "Timely delivery guarantee",
      "Quality inspection on arrival",
      "Business growth analytics",
      "Ongoing support and guidance"
    ]
  }
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">How it Works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Take your pick from the supply chain and participate in agribusiness projects 
            that are backed up not only by KisanTech, but also by the best land, family heritage, 
            innovation and overall superior expertise.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Steps Navigation */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-auto p-6 text-left transition-all duration-300",
                    activeStep === step.id
                      ? "bg-primary/10 border-l-4 border-l-primary"
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => setActiveStep(step.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300",
                      activeStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {step.id}
                    </div>
                    <div className="space-y-1">
                      <h3 className={cn(
                        "font-semibold transition-colors duration-300",
                        activeStep === step.id ? "text-primary" : "text-foreground"
                      )}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Step Details */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-8"
          >
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-foreground">
                        {activeStep}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">
                      {steps[activeStep - 1].title}
                    </h3>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {steps[activeStep - 1].description}
                  </p>

                  <div className="space-y-3">
                    {steps[activeStep - 1].details.map((detail, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{detail}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button className="group" asChild>
                      <a href="#features">
                        Get Started Now
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}