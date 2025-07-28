import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    console.log("✅ Database connected");

    const body = await request.json();
    console.log("📦 Received test order data:", JSON.stringify(body, null, 2));

    // Create a simple test order
    const testOrder = {
      products: [
        {
          product: "507f1f77bcf86cd799439011", // dummy ObjectId
          quantity: 1,
          price: 100
        }
      ],
      buyer: "507f1f77bcf86cd799439012", // dummy ObjectId
      shippingInfo: {
        fullName: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        pincode: "123456"
      },
      paymentMethod: "cod",
      paymentInfo: {},
      totalAmount: 100,
      status: "Processing",
      payment: {
        method: "cod",
        status: "pending",
        amount: 100
      }
    };

    console.log("🔄 Creating test order...");
    const order = await Order.create(testOrder);
    console.log("✅ Test order created:", order._id);

    return NextResponse.json(
      {
        success: true,
        message: "Test order created successfully",
        orderId: order._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Test order error:", error);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Test order failed",
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}