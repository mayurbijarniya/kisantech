"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth";
import axios from "axios";
import toast from "react-hot-toast";

export default function DebugOrderPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { auth } = useAuth();

  const testDebugOrder = async () => {
    if (!auth.user) {
      toast.error("Please login first");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/debug/order", {
        test: "debug order creation"
      });
      
      setResult(data);
      if (data.success) {
        toast.success("Debug order test successful!");
      } else {
        toast.error("Debug order test failed");
      }
    } catch (error: any) {
      console.error("Debug order error:", error);
      setResult(error.response?.data || { error: error.message });
      toast.error("Debug order test failed");
    } finally {
      setLoading(false);
    }
  };

  const testRealOrder = async () => {
    if (!auth.user) {
      toast.error("Please login first");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        products: [
          {
            product: "507f1f77bcf86cd799439011", // dummy product ID
            quantity: 1,
            price: 100
          }
        ],
        shippingInfo: {
          fullName: auth.user.name,
          email: auth.user.email,
          phone: "1234567890",
          address: "Test Address",
          city: "Test City",
          state: "Test State",
          pincode: "123456"
        },
        paymentMethod: "cod",
        paymentInfo: {},
        totalAmount: 100
      };

      const { data } = await axios.post("/api/orders/place-order", orderData);
      
      setResult(data);
      if (data.success) {
        toast.success("Real order test successful!");
      } else {
        toast.error("Real order test failed");
      }
    } catch (error: any) {
      console.error("Real order error:", error);
      setResult(error.response?.data || { error: error.message });
      toast.error("Real order test failed");
    } finally {
      setLoading(false);
    }
  };

  const testSimpleOrder = async () => {
    if (!auth.user) {
      toast.error("Please login first");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        products: [
          {
            product: "507f1f77bcf86cd799439011", // dummy product ID
            quantity: 1,
            price: 100
          }
        ],
        shippingInfo: {
          fullName: auth.user.name,
          email: auth.user.email,
          phone: "1234567890",
          address: "Test Address",
          city: "Test City",
          state: "Test State",
          pincode: "123456"
        },
        paymentMethod: "cod",
        paymentInfo: {},
        totalAmount: 100
      };

      const { data } = await axios.post("/api/orders/place-order-simple", orderData);
      
      setResult(data);
      if (data.success) {
        toast.success("Simple order test successful!");
      } else {
        toast.error("Simple order test failed");
      }
    } catch (error: any) {
      console.error("Simple order error:", error);
      setResult(error.response?.data || { error: error.message });
      toast.error("Simple order test failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Order Debug Page</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
            </CardHeader>
            <CardContent>
              {auth.user ? (
                <div className="space-y-2">
                  <p><strong>User:</strong> {auth.user.name}</p>
                  <p><strong>Email:</strong> {auth.user.email}</p>
                  <p><strong>Role:</strong> {auth.user.role}</p>
                  <p><strong>Token:</strong> {auth.token ? "Present" : "Missing"}</p>
                </div>
              ) : (
                <p className="text-red-600">Not authenticated</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Debug Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testDebugOrder}
                disabled={loading || !auth.user}
                className="w-full"
              >
                {loading ? "Testing..." : "Test Debug Order Creation"}
              </Button>
              
              <Button 
                onClick={testRealOrder}
                disabled={loading || !auth.user}
                variant="outline"
                className="w-full"
              >
                {loading ? "Testing..." : "Test Real Order API"}
              </Button>
              
              <Button 
                onClick={testSimpleOrder}
                disabled={loading || !auth.user}
                variant="secondary"
                className="w-full"
              >
                {loading ? "Testing..." : "Test Simple Order API"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {result && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Test Result</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}