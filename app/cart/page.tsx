"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart";
import { useAuth } from "@/context/auth";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!auth.user) {
      toast.error("Please login to checkout");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      // Here you would implement payment processing
      toast.success("Order placed successfully!");
      clearCart();
    } catch (error) {
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild>
              <Link href="/store">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item._id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 relative">
                      {item.photo ? (
                        <Image
                          src={`data:${item.photo.contentType};base64,${Buffer.from(item.photo.data).toString('base64')}`}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-green-600 font-bold">₹{item.price}</p>
                        {item.isRental && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Rental {item.rentalUnit}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 1)}
                        className="w-16 text-center"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Total Price */}
                    <div className="text-right">
                      <p className="font-bold">₹{item.price * item.quantity}</p>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{getCartTotal()}</span>
                  </div>
                </div>
                
                {auth.user ? (
                  <Button 
                    className="w-full" 
                    onClick={() => window.location.href = '/checkout'}
                    disabled={loading}
                  >
                    Proceed to Checkout
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/login">Login to Checkout</Link>
                    </Button>
                    <p className="text-sm text-center text-gray-600">
                      Don't have an account?{" "}
                      <Link href="/register" className="text-green-600 hover:underline">
                        Sign up
                      </Link>
                    </p>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}