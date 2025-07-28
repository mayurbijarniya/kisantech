"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart";
import { useAuth } from "@/context/auth";
import { CreditCard, Truck, Shield, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { auth, isHydrated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: ""
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    upiId: "",
    paypalEmail: ""
  });

  // Update shipping info when user data is available
  useEffect(() => {
    if (auth.user && isHydrated) {
      setShippingInfo(prev => ({
        ...prev,
        fullName: auth.user?.name || prev.fullName,
        email: auth.user?.email || prev.email,
      }));
    }
  }, [auth.user, isHydrated]);

  // Check authentication only after hydration
  useEffect(() => {
    if (!isHydrated) return;

    if (!auth.user) {
      toast.error("Please login to checkout");
      router.push("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    setAuthChecked(true);
  }, [auth.user, cart, router, isHydrated]);

  // Show loading until hydration and auth check is complete
  if (!isHydrated || !authChecked) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading checkout...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const requiredShippingFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    
    for (const field of requiredShippingFields) {
      if (!shippingInfo[field as keyof typeof shippingInfo]) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }

    if (paymentMethod === 'card') {
      const requiredPaymentFields = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
      for (const field of requiredPaymentFields) {
        if (!paymentInfo[field as keyof typeof paymentInfo]) {
          toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
          return false;
        }
      }
    }

    if (paymentMethod === 'paypal' && !paymentInfo.paypalEmail) {
      toast.error("PayPal email is required");
      return false;
    }

    if (paymentMethod === 'upi' && !paymentInfo.upiId) {
      toast.error("UPI ID is required");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Debug: Log cart data
      console.log("🛒 Cart data:", cart);
      console.log("👤 User data:", auth.user);
      
      const orderData = {
        products: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingInfo,
        paymentMethod,
        paymentInfo: paymentMethod === 'cod' ? {} : paymentInfo,
        totalAmount: getCartTotal(),
        buyer: auth.user?._id
      };

      console.log("📦 Order data being sent:", JSON.stringify(orderData, null, 2));

      // First, let's debug the cart data
      try {
        const debugResponse = await axios.post("/api/debug/cart-data", { cartItems: cart });
        console.log("🔍 Cart debug response:", debugResponse.data);
      } catch (debugError) {
        console.error("Debug cart error:", debugError);
      }

      // Try the direct API first for debugging
      const { data } = await axios.post("/api/orders/place-order-direct", orderData);
      
      if (data.success) {
        setOrderPlaced(true);
        clearCart();
        toast.success("Order placed successfully!");
        
        setTimeout(() => {
          router.push("/dashboard/orders");
        }, 3000);
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="text-center">
              <CardContent className="p-12">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
                <p className="text-gray-600 mb-6">
                  Thank you for your order. You will receive a confirmation email shortly.
                </p>
                <div className="space-y-4">
                  <Button asChild className="w-full">
                    <Link href="/dashboard/orders">View My Orders</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/buy">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <Link href="/cart">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-gray-600">Complete your purchase</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Forms */}
            <div className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                  <CardDescription>
                    Enter your delivery address details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={shippingInfo.pincode}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="landmark">Landmark (Optional)</Label>
                    <Input
                      id="landmark"
                      name="landmark"
                      value={shippingInfo.landmark}
                      onChange={handleShippingChange}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                  <CardDescription>
                    Choose your payment method
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="cod">Cash on Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentInfo.cardNumber}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={paymentInfo.expiryDate}
                            onChange={handlePaymentChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={paymentInfo.cvv}
                            onChange={handlePaymentChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardholderName">Cardholder Name *</Label>
                        <Input
                          id="cardholderName"
                          name="cardholderName"
                          value={paymentInfo.cardholderName}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-sm">P</span>
                          </div>
                          <span className="font-semibold text-blue-900">PayPal</span>
                        </div>
                        <p className="text-sm text-blue-800 mb-4">
                          Pay securely with your PayPal account or credit card through PayPal.
                        </p>
                        <div className="space-y-2">
                          <Label htmlFor="paypalEmail">PayPal Email *</Label>
                          <Input
                            id="paypalEmail"
                            name="paypalEmail"
                            type="email"
                            placeholder="your-email@example.com"
                            value={paymentInfo.paypalEmail}
                            onChange={handlePaymentChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">
                          You'll be redirected to PayPal to complete your payment securely.
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-sm">₹</span>
                          </div>
                          <span className="font-semibold text-green-900">UPI Payment</span>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="upiId">UPI ID *</Label>
                          <Input
                            id="upiId"
                            name="upiId"
                            placeholder="yourname@paytm / yourname@gpay"
                            value={paymentInfo.upiId}
                            onChange={handlePaymentChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-yellow-600 rounded flex items-center justify-center">
                          <span className="text-white font-bold text-sm">₹</span>
                        </div>
                        <span className="font-semibold text-yellow-900">Cash on Delivery</span>
                      </div>
                      <p className="text-sm text-yellow-800">
                        You will pay ₹{total.toLocaleString()} when the order is delivered to your address.
                      </p>
                      <p className="text-xs text-yellow-700 mt-2">
                        Please keep exact change ready for faster delivery.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item._id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                          <span className="text-xs font-medium">{item.quantity}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-sm text-gray-600">₹{item.price} each</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (GST 18%)</span>
                      <span>₹{tax.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      Your payment information is secure and encrypted
                    </span>
                  </div>

                  {/* Place Order Button */}
                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? "Placing Order..." : `Place Order - ₹${total.toLocaleString()}`}
                  </Button>
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