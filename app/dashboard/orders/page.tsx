"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, MapPin, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  products: {
    _id: string;
    name: string;
    price: number;
  }[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  shippingInfo: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
}

export default function OrdersPage() {
  const { auth } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.user) {
      toast.error("Please login to view orders");
      router.push("/login");
      return;
    }
    
    fetchOrders();
  }, [auth.user, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/orders/user-orders");
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            <p className="text-gray-600">Track your order history and status</p>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <Button asChild>
                  <Link href="/buy">Start Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4" />
                          Placed on {formatDate(order.createdAt)}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Products */}
                    <div>
                      <h4 className="font-medium mb-2">Items Ordered</h4>
                      <div className="space-y-2">
                        {order.products.map((product, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                            <span className="font-medium">{product.name}</span>
                            <span className="text-gray-600">₹{product.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Shipping Address
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p>{order.shippingInfo.fullName}</p>
                          <p>{order.shippingInfo.address}</p>
                          <p>{order.shippingInfo.city}, {order.shippingInfo.state}</p>
                          <p>{order.shippingInfo.pincode}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Payment Details
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p>Method: {order.paymentMethod.toUpperCase()}</p>
                          <p className="font-bold text-lg text-gray-900 mt-2">
                            Total: ₹{order.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/orders/track/${order._id}`}>
                          Track Order
                        </Link>
                      </Button>
                      {order.status.toLowerCase() === 'delivered' && (
                        <Button variant="outline" size="sm">
                          Rate & Review
                        </Button>
                      )}
                      {['processing', 'confirmed'].includes(order.status.toLowerCase()) && (
                        <Button variant="destructive" size="sm">
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}