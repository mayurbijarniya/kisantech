"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { User, Mail, Phone, MapPin, Lock, HelpCircle, UserPlus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    securityQuestion: "",
    answer: "",
    role: false // false = buyer (0), true = seller (1)
  });

  const securityQuestions = [
    "What is your favorite sport?",
    "What is your mother's maiden name?",
    "What was the name of your first pet?",
    "In which city were you born?",
    "What is your favorite food?",
    "What was your first car model?",
    "What is your favorite movie?",
    "What was the name of your elementary school?"
  ];
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const submitData = {
        ...formData,
        role: formData.role ? 1 : 0 // Convert boolean to number: seller = 1, buyer = 0
      };
      const { data } = await axios.post("/api/auth/register", submitData);
      
      if (data?.success) {
        toast.success(data.message);
        router.push("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-green-950/20 dark:via-background dark:to-green-950/20">
      <Header />
      
      <main className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold">
                  Join KishanTech
                </CardTitle>
                <CardDescription>
                  Create your account to start your agricultural journey
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground font-medium">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-foreground font-medium">
                      Address
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Textarea
                        id="address"
                        name="address"
                        placeholder="Enter your complete address"
                        value={formData.address}
                        onChange={handleChange}
                        className="pl-10 min-h-[80px]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="securityQuestion" className="text-foreground font-medium">
                      Security Question
                    </Label>
                    <Select 
                      value={formData.securityQuestion} 
                      onValueChange={(value) => setFormData({...formData, securityQuestion: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a security question" />
                      </SelectTrigger>
                      <SelectContent>
                        {securityQuestions.map((question, index) => (
                          <SelectItem key={index} value={question}>
                            {question}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="answer" className="text-foreground font-medium">
                      Security Answer
                    </Label>
                    <div className="relative">
                      <HelpCircle className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="answer"
                        name="answer"
                        type="text"
                        placeholder="Enter your answer"
                        value={formData.answer}
                        onChange={handleChange}
                        className="pl-10"
                        required
                        disabled={!formData.securityQuestion}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This will be used to reset your password if needed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Account Type</Label>
                    <div className="flex items-center justify-between p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                      <span className="text-foreground font-medium">
                        Register as Buyer
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                      <span className="text-foreground font-medium">
                        Register as Seller
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formData.role 
                        ? "As a seller, you can add products and manage your inventory" 
                        : "As a buyer, you can browse and purchase products"
                      }
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-full font-medium"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                      Sign In
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

