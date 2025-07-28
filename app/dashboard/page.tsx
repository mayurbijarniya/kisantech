"use client";

import { useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  Calendar,
  Star,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { auth, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;
    
    if (!auth.user) {
      toast.error("Please login to access dashboard");
      router.push("/login");
      return;
    }

    // Redirect based on role
    if (auth.user.role === 2) {
      router.push("/dashboard/admin");
      return;
    } else if (auth.user.role === 1) {
      router.push("/dashboard/seller");
      return;
    }
    // Buyers stay on this page
  }, [auth.user, router, isHydrated]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!auth.user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h1>
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Buyer dashboard content
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950/20 dark:via-background dark:to-teal-950/20">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {auth.user.name}!</h1>
            <p className="text-gray-600">
              Here's your shopping overview and recent activity.
            </p>
          </div>

          {/* Quick Actions for Buyers */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Browse Products</p>
                    <p className="text-2xl font-bold">Shop Now</p>
                  </div>
                  <ShoppingBag className="h-8 w-8 text-blue-600" />
                </div>
                <Button asChild className="w-full mt-4">
                  <Link href="/buy">Start Shopping</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">My Orders</p>
                    <p className="text-2xl font-bold">Track Orders</p>
                  </div>
                  <Package className="h-8 w-8 text-green-600" />
                </div>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href="/dashboard/orders">View Orders</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rent Equipment</p>
                    <p className="text-2xl font-bold">Explore</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href="/rent">Browse Rentals</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest shopping activity and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Welcome to KisanTech!</p>
                    <p className="text-sm text-gray-600">Start exploring our agricultural products and equipment.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Account Created</p>
                    <p className="text-sm text-gray-600">Your buyer account is ready to use.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}