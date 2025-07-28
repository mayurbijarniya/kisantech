"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    title: "Organic Farmer",
    location: "Punjab, India",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "KisanTech has revolutionized how I sell my organic produce. The platform is easy to use and I've increased my income by 40% in just 6 months.",
    rating: 5,
  },
  {
    id: 2,
    name: "Priya Sharma",
    title: "Equipment Rental Business",
    location: "Haryana, India",
    image: "https://images.unsplash.com/photo-1494790108755-2616b9c5e8e1?w=100&h=100&fit=crop&crop=face",
    content: "The rental portal has helped me monetize my idle equipment effectively. The booking system is seamless and payments are always on time.",
    rating: 5,
  },
  {
    id: 3,
    name: "Amit Patel",
    title: "Dairy Farmer",
    location: "Gujarat, India",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    content: "The weather forecasting feature has saved my crops multiple times. Accurate predictions help me plan irrigation and harvesting perfectly.",
    rating: 5,
  },
  {
    id: 4,
    name: "Sunita Devi",
    title: "Vegetable Grower",
    location: "Uttar Pradesh, India",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "Direct connection with buyers has eliminated middlemen. I now get fair prices for my vegetables and have built lasting relationships with customers.",
    rating: 5,
  },
  {
    id: 5,
    name: "Vikram Singh",
    title: "Wheat Farmer",
    location: "Rajasthan, India",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    content: "KisanTech's support team is incredible. They helped me set up my store and provided training on digital marketing. Highly recommended!",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1;
      }
    });
  };

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
          <div className="flex justify-center mb-4">
            <Quote className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">
            What farmers like you are saying about KisanTech
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied farmers who have transformed their agricultural 
            business with our platform.
          </p>
        </motion.div>

        {/* Testimonial Slider */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative h-96 overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Card className="w-full max-w-2xl mx-auto border-0 shadow-xl">
                  <CardContent className="p-8 text-center space-y-6">
                    {/* Rating */}
                    <div className="flex justify-center gap-1">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Content */}
                    <blockquote className="text-lg leading-relaxed text-muted-foreground italic">
                      "{testimonials[currentIndex].content}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center justify-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Image
                          src={testimonials[currentIndex].image}
                          alt={testimonials[currentIndex].name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-foreground">
                          {testimonials[currentIndex].name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {testimonials[currentIndex].title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {testimonials[currentIndex].location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(-1)}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(1)}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border/50"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">10,000+</div>
            <div className="text-sm text-muted-foreground">Happy Farmers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">₹50Cr+</div>
            <div className="text-sm text-muted-foreground">Revenue Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">99%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}