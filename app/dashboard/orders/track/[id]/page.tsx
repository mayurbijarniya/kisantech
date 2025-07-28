"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import axios from "axios";
import toast from "react-hot-toast";

interface OrderDetails {
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
  updatedAt: string;
}

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { auth } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.user) {
      toast.error("Please login to track orders");
      router.push("/login");
      return;
    }
    
    if (params.id) {
      fetchOrderDetails(params.id as string);
    }
  }, [auth.user, params.id, router]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/orders/user-orders`);
      
      if (data.success) {
        const foundOrder = data.orders.find((o: OrderDetails) => o._id === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          toast.error("Order not found");
          router.push("/dashboard/orders");
        }
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Error loading order details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'Processing', label: 'Order Placed', icon: Package },
      { key: 'Confirmed', label: 'Order Confirmed', icon: CheckCircle },
      { key: 'Shipped', label: 'Shipped', icon: Truck },
      { key: 'Delivered', label: 'Delivered', icon: CheckCircle }
    ];

    const currentStatusIndex = steps.findIndex(step => step.key === order?.status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStatusIndex,
      active: index === currentStatusIndex
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
                <p className="text-gray-600 mb-6">
                  The order you're looking for doesn't exist or you don't have permission to view it.
                </p>
                <Button asChild>
                  <Link href="/dashboard/orders">Back to Orders</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statusSteps = getStatusSteps();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="mb-8">
            <Link href="/dashboard/orders">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Order #{order._id.slice(-8).toUpperCase()}
                </h1>
                <p className="text-gray-600">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <Badge 
                className={`px-3 py-1 text-sm ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'Confirmed' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {order.status}
              </Badge>
            </div>
          </div>

          {/* Order Status Timeline */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
              <CardDescription>Track your order progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="flex flex-col items-center flex-1">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center mb-2
                        ${step.completed 
                          ? 'bg-green-600 text-white' 
                          : step.active 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-400'
                        }
                      `}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className={`text-sm font-medium ${
                        step.completed || step.active ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </span>
                      {index < statusSteps.length - 1 && (
                        <div className={`
                          absolute h-0.5 w-full top-6 left-1/2 transform -translate-y-1/2
                          ${step.completed ? 'bg-green-600' : 'bg-gray-200'}
                        `} style={{ zIndex: -1 }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="space-y-6">
              {/* Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Items Ordered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.products.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                          <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total Amount</span>
                        <span className="text-green-600">{formatPrice(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium capitalize">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status</span>
                      <Badge variant="outline" className="text-green-600">
                        {order.paymentMethod === 'cod' ? 'Pending' : 'Paid'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shipping & Contact Info */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{order.shippingInfo.fullName}</p>
                    <p>{order.shippingInfo.address}</p>
                    {order.shippingInfo.landmark && (
                      <p>Landmark: {order.shippingInfo.landmark}</p>
                    )}
                    <p>
                      {order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.pincode}
                    </p>
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{order.shippingInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <Mail className="h-4 w-4" />
                        <span>{order.shippingInfo.email}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Order Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Order Placed</p>
                        <p className="text-xs text-gray-600">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    {order.status !== 'Processing' && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">Status Updated</p>
                          <p className="text-xs text-gray-600">{formatDate(order.updatedAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                  {order.status === 'Delivered' && (
                    <Button className="w-full">
                      Rate & Review
                    </Button>
                  )}
                  {['Processing', 'Confirmed'].includes(order.status) && (
                    <Button variant="destructive" className="w-full">
                      Cancel Order
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}