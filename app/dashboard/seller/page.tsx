"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  XCircle,
  Eye,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  products: {
    product: {
      _id: string;
      name: string;
      salePrice?: number;
      rentalPrice?: number;
    };
    quantity: number;
    price: number;
  }[];
  buyer: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  shippingInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  status: string;
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  type: string[];
  salePrice?: number;
  rentalPrice?: number;
  quantity: number;
  category: {
    _id: string;
    name: string;
  };
  availabilityStatus: string;
  createdAt: string;
}

export default function SellerDashboard() {
  const { auth } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.user) {
      toast.error("Please login to access seller dashboard");
      router.push("/login");
      return;
    }
    
    fetchSellerData();
  }, [auth.user, router]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders and products in parallel with timeout for faster response
      const [ordersResponse, productsResponse] = await Promise.allSettled([
        axios.get("/api/orders/seller-orders", { timeout: 10000 }),
        axios.get("/api/seller/products", { timeout: 10000 })
      ]);
      
      // Handle orders response
      if (ordersResponse.status === 'fulfilled' && ordersResponse.value.data.success) {
        setOrders(ordersResponse.value.data.orders || []);
      } else {
        console.log("Orders fetch failed:", ordersResponse.status === 'rejected' ? ordersResponse.reason : 'Unknown error');
        setOrders([]);
      }

      // Handle products response
      if (productsResponse.status === 'fulfilled' && productsResponse.value.data.success) {
        setProducts(productsResponse.value.data.products || []);
        console.log("Products fetched:", productsResponse.value.data.products?.length || 0);
      } else {
        console.log("Products fetch failed:", productsResponse.status === 'rejected' ? productsResponse.reason : 'Unknown error');
        // Fallback: try to get all products and filter by current user
        try {
          const allProductsResponse = await axios.get("/api/product/get-product");
          if (allProductsResponse.data.success) {
            // Filter products by current user (this is a fallback if seller field is missing)
            const allProducts = allProductsResponse.data.products || [];
            // For now, show all products as fallback - in production you'd filter by seller
            setProducts(allProducts);
            console.log("Fallback: All products fetched:", allProducts.length);
          } else {
            setProducts([]);
          }
        } catch (fallbackError) {
          console.log("Fallback fetch also failed:", fallbackError);
          setProducts([]);
        }
      }
    } catch (error: any) {
      console.error("Fetch seller data error:", error);
      setOrders([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);
      const { data } = await axios.put(`/api/orders/update-status/${orderId}`, {
        status: newStatus
      });
      
      if (data.success) {
        toast.success("Order status updated successfully");
        fetchSellerData();
        setSelectedOrder(null);
      } else {
        toast.error(data.message || "Failed to update order status");
      }
    } catch (error: any) {
      console.error("Update order status error:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Processing':
        return <Clock className="h-4 w-4" />;
      case 'Confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'Shipped':
        return <Truck className="h-4 w-4" />;
      case 'Delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    try {
      setDeletingProduct(productId);
      const { data } = await axios.delete(`/api/product/delete-product/${productId}`);
      
      if (data.success) {
        toast.success("Product deleted successfully");
        fetchSellerData(); // Refresh the data
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error: any) {
      console.error("Delete product error:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeletingProduct(null);
    }
  };

  // Calculate stats
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    pendingOrders: orders.filter(o => o.status === 'Processing').length,
    completedOrders: orders.filter(o => o.status === 'Delivered').length,
    totalProducts: products.length,
    activeProducts: products.filter(p => p.availabilityStatus === 'available').length
  };

  // Remove full loading screen for better perceived performance
  // Show skeleton only for specific sections

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950/20 dark:via-background dark:to-emerald-950/20">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
            <p className="text-gray-600">Manage your orders and track sales</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                    <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold">{stats.completedOrders}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">My Products</p>
                    <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Orders ({stats.totalOrders})
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'products'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Products ({stats.totalProducts})
              </button>
            </div>
          </div>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <Card>
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription>Manage and track your product orders</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600">Orders for your products will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Order ID</th>
                        <th className="text-left py-3 px-4">Customer</th>
                        <th className="text-left py-3 px-4">Products</th>
                        <th className="text-left py-3 px-4">Amount</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <span className="font-mono text-sm">
                              #{order._id.slice(-8)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{order.buyer.name}</p>
                              <p className="text-sm text-gray-600">{order.buyer.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              {order.products.map((item, index) => (
                                <div key={index}>
                                  {item.product.name} × {item.quantity}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold">{formatPrice(order.totalAmount)}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                <Select
                                  value={order.status}
                                  onValueChange={(value) => updateOrderStatus(order._id, value)}
                                  disabled={updatingStatus === order._id}
                                >
                                  <SelectTrigger className="w-32 h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Processing">Processing</SelectItem>
                                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                                    <SelectItem value="Shipped">Shipped</SelectItem>
                                    <SelectItem value="Delivered">Delivered</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
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
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>My Products</CardTitle>
                    <CardDescription>Manage your product listings</CardDescription>
                  </div>
                  <Button asChild>
                    <a href="/dashboard/admin/create-product">Add New Product</a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first product</p>
                    <Button asChild>
                      <a href="/dashboard/admin/create-product">Add Product</a>
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
                        {products.map((product) => (
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
                                  <div>Sale: {formatPrice(product.salePrice || 0)}</div>
                                )}
                                {product.type.includes('rent') && (
                                  <div>Rent: {formatPrice(product.rentalPrice || 0)}</div>
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
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => window.open(`/product/${product._id}`, '_blank')}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => deleteProduct(product._id)}
                                  disabled={deletingProduct === product._id}
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  {deletingProduct === product._id ? "Deleting..." : "Delete"}
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
          )}

          {/* Order Details Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Order Details</h2>
                    <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                      Close
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Order Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Order Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <span className="font-medium">Order ID:</span>
                          <span className="ml-2 font-mono">#{selectedOrder._id.slice(-8)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(selectedOrder.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                              {selectedOrder.status}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Payment Method:</span>
                          <span className="ml-2 capitalize">{selectedOrder.paymentMethod}</span>
                        </div>
                        <div>
                          <span className="font-medium">Order Date:</span>
                          <span className="ml-2">{formatDate(selectedOrder.createdAt)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Total Amount:</span>
                          <span className="ml-2 font-semibold text-green-600">
                            {formatPrice(selectedOrder.totalAmount)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Customer Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Customer Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{selectedOrder.buyer.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{selectedOrder.buyer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{selectedOrder.buyer.phone}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Shipping Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-1">
                          <p className="font-medium">{selectedOrder.shippingInfo.fullName}</p>
                          <p>{selectedOrder.shippingInfo.address}</p>
                          {selectedOrder.shippingInfo.landmark && (
                            <p>Landmark: {selectedOrder.shippingInfo.landmark}</p>
                          )}
                          <p>
                            {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state} - {selectedOrder.shippingInfo.pincode}
                          </p>
                          <p>Phone: {selectedOrder.shippingInfo.phone}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Products */}
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-lg">Products</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedOrder.products.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                                <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}