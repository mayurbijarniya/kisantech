"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  Calendar,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { SimpleChart } from "@/components/charts/simple-chart";

interface Product {
  _id: string;
  name: string;
  type: string[];
  salePrice?: number;
  rentalPrice?: number;
  rentalUnit?: string;
  quantity: number;
  category: {
    _id: string;
    name: string;
  };
  availabilityStatus: string;
  createdAt: string;
}

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  saleProducts: number;
  rentalProducts: number;
}

export default function AdminDashboard() {
  const { auth } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    saleProducts: 0,
    rentalProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.user || auth.user.role !== 2) {
      // Silently redirect non-admin users without showing error
      router.push("/");
      return;
    }
    
    fetchDashboardData();
  }, [auth.user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel with timeout for faster response
      const [productsResponse, adminStatsResponse] = await Promise.allSettled([
        axios.get("/api/product/get-product", { timeout: 5000 }),
        axios.get("/api/admin/stats", { timeout: 5000 })
      ]);

      // Handle products data
      if (productsResponse.status === 'fulfilled' && productsResponse.value.data?.success) {
        const productsData = productsResponse.value.data.products;
        setProducts(productsData);
        
        // Calculate stats
        const saleProducts = productsData.filter((p: Product) => p.type.includes('sell')).length;
        const rentalProducts = productsData.filter((p: Product) => p.type.includes('rent')).length;
        
        setStats(prev => ({
          ...prev,
          totalProducts: productsData.length,
          saleProducts,
          rentalProducts
        }));
      } else {
        setProducts([]); // Fallback to empty array
      }

      // Handle admin stats data
      if (adminStatsResponse.status === 'fulfilled' && adminStatsResponse.value.data?.success) {
        const adminStats = adminStatsResponse.value.data.stats;
        setStats(prev => ({
          ...prev,
          totalUsers: adminStats.users.total || 0,
          totalOrders: adminStats.orders.total || 0,
          totalRevenue: adminStats.revenue.total || 0
        }));
      } else {
        // Quick fallback without additional API call
        setStats(prev => ({
          ...prev,
          totalUsers: 0,
          totalOrders: 0,
          totalRevenue: 0
        }));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Don't show error toast for better UX
      setProducts([]);
      setStats(prev => ({ ...prev, totalUsers: 0, totalOrders: 0, totalRevenue: 0 }));
    } finally {
      setLoading(false);
    }
  };

  // Delete functionality temporarily disabled - will be implemented later
  const handleDeleteProduct = async (productId: string) => {
    toast("Delete functionality will be available soon", {
      icon: "ℹ️",
      style: {
        background: '#3b82f6',
        color: '#fff',
      },
    });
  };

  const formatPrice = (price: number | undefined) => {
    return price ? `₹${price.toLocaleString()}` : "N/A";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Remove full loading screen for better perceived performance
  // Show skeleton only for specific sections

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/20 dark:via-background dark:to-indigo-950/20">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your agricultural marketplace</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-100">Total Products</p>
                    <p className="text-3xl font-bold">{stats.totalProducts}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <Package className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-100">Sale Products</p>
                    <p className="text-3xl font-bold">{stats.saleProducts}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-100">Rental Products</p>
                    <p className="text-3xl font-bold">{stats.rentalProducts}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <Calendar className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-100">Total Users</p>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats Row */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-100">Total Orders</p>
                    <p className="text-3xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-100">Total Revenue</p>
                    <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <SimpleChart
              title="Product Distribution"
              description="Products by type"
              data={[
                { label: "Sale Products", value: stats.saleProducts, color: "#10b981" },
                { label: "Rental Products", value: stats.rentalProducts, color: "#f59e0b" }
              ]}
              type="pie"
            />
            <SimpleChart
              title="Platform Overview"
              description="Key metrics"
              data={[
                { label: "Total Products", value: stats.totalProducts, color: "#3b82f6" },
                { label: "Total Users", value: stats.totalUsers, color: "#8b5cf6" },
                { label: "Total Orders", value: stats.totalOrders, color: "#06b6d4" },
                { label: "Revenue (₹000s)", value: Math.round(stats.totalRevenue / 1000), color: "#10b981" }
              ]}
            />
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your marketplace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/dashboard/admin/create-product">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/admin/create-category">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Category
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={async () => {
                    try {
                      const response = await axios.post("/api/admin/fix-products-seller");
                      if (response.data.success) {
                        toast.success(response.data.message);
                        fetchDashboardData(); // Refresh data
                      } else {
                        toast.error(response.data.message);
                      }
                    } catch (error) {
                      toast.error("Failed to fix products seller field");
                    }
                  }}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Fix Products Seller Field
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">System is running smoothly</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">{stats.totalProducts} products listed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">{stats.totalUsers} registered users</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>Manage your product listings</CardDescription>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                  <p className="text-gray-600 mb-4">Start by adding your first product</p>
                  <Button asChild>
                    <Link href="/dashboard/admin/create-product">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Product</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Price</th>
                        <th className="text-left py-3 px-4">Stock</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Created</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.slice(0, 10).map((product) => (
                        <tr key={product._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.category?.name}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              {product.type.includes('sell') && (
                                <Badge variant="default">Sale</Badge>
                              )}
                              {product.type.includes('rent') && (
                                <Badge variant="secondary">Rent</Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              {product.type.includes('sell') && (
                                <div>Sale: {formatPrice(product.salePrice)}</div>
                              )}
                              {product.type.includes('rent') && (
                                <div>Rent: {formatPrice(product.rentalPrice)} {product.rentalUnit}</div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              product.quantity > 10 
                                ? 'bg-green-100 text-green-800' 
                                : product.quantity > 0 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.quantity} units
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={product.availabilityStatus === 'available' ? 'default' : 'destructive'}
                            >
                              {product.availabilityStatus}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatDate(product.createdAt)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/product/${product._id}`}>
                                  <Eye className="h-3 w-3" />
                                </Link>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDeleteProduct(product._id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}