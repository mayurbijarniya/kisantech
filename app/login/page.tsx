"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Mail, Lock, LogIn } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/login", formData);
      
      if (data?.success) {
        toast.success(data.message);
        // Update auth context
        setAuth({
          user: data.user,
          token: data.token
        });
        localStorage.setItem("auth", JSON.stringify({
          user: data.user,
          token: data.token
        }));
        
        // Redirect based on user role
        if (data.user.role === 1) {
          router.push("/dashboard/admin"); // Seller dashboard
        } else {
          router.push("/"); // Buyer goes to homepage
        }
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
                  <LogIn className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Sign in to your KishanTech account
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link 
                      href="/forgot-password" 
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="text-right mb-4">
                    <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-full font-medium"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-primary hover:text-primary/80 font-medium">
                      Create Account
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

