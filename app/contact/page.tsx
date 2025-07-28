"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  hours: string;
  supportEmail: string;
  salesEmail: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  // Dynamic contact information from environment variables
  const contactInfo: ContactInfo = {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@kisantech.com",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+91 9876543210",
    address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "123 Agriculture Hub, Green Valley, Mumbai, Maharashtra 400001",
    hours: process.env.NEXT_PUBLIC_BUSINESS_HOURS || "Monday - Saturday: 9:00 AM - 6:00 PM",
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@kisantech.com",
    salesEmail: process.env.NEXT_PUBLIC_SALES_EMAIL || "sales@kisantech.com"
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Here you would typically send the form data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-green-600" />,
      title: "Email Us",
      description: "Send us an email anytime",
      value: contactInfo.email,
      action: `mailto:${contactInfo.email}`
    },
    {
      icon: <Phone className="h-6 w-6 text-blue-600" />,
      title: "Call Us",
      description: "Speak with our team",
      value: contactInfo.phone,
      action: `tel:${contactInfo.phone}`
    },
    {
      icon: <MapPin className="h-6 w-6 text-purple-600" />,
      title: "Visit Us",
      description: "Come to our office",
      value: contactInfo.address,
      action: `https://maps.google.com/?q=${encodeURIComponent(contactInfo.address)}`
    },
    {
      icon: <Clock className="h-6 w-6 text-orange-600" />,
      title: "Business Hours",
      description: "When we're available",
      value: contactInfo.hours,
      action: null
    }
  ];

  const departments = [
    {
      title: "General Support",
      email: contactInfo.supportEmail,
      description: "For technical support and general inquiries"
    },
    {
      title: "Sales & Partnerships",
      email: contactInfo.salesEmail,
      description: "For business partnerships and sales inquiries"
    },
    {
      title: "Farmer Support",
      email: contactInfo.email,
      description: "For farmers needing assistance with the platform"
    }
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
                Get in Touch
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="text-center h-full hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => method.action && window.open(method.action, '_blank')}>
                    <CardContent className="p-6">
                      <div className="mb-4 flex justify-center">
                        {method.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {method.description}
                      </p>
                      <p className="text-gray-800 font-medium text-sm">
                        {method.value}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Departments */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      Send us a Message
                    </CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="What is this about?"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us more about your inquiry..."
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          required
                        />
                      </div>
                      
                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Departments */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Contact Departments
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Reach out to the right team for faster assistance
                  </p>
                </div>

                {departments.map((dept, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {dept.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {dept.description}
                        </p>
                        <a
                          href={`mailto:${dept.email}`}
                          className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          {dept.email}
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* FAQ Link */}
                <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Need Quick Answers?
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Check out our database test page to verify system status
                    </p>
                    <Button variant="outline" asChild>
                      <a href="/test-db">
                        Test System Status
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}