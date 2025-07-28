import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 Testing basic order creation...");
    await connectDB();
    console.log("✅ Database connected");

    // Create a minimal test order with dummy data
    const testOrder = {
      products: [
        {
          product: new mongoose.Types.ObjectId(),
          quantity: 1,
          price: 100
        }
      ],
      buyer: new mongoose.Types.ObjectId(),
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

    console.log("📝 Creating test order...");
    const order = await Order.create(testOrder);
    console.log("✅ Test order created:", order._id);

    return NextResponse.json({
      success: true,
      message: "Basic order test successful",
      orderId: order._id
    });

  } catch (error: any) {
    console.error("❌ Basic order test failed:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      errorName: error.name,
      stack: error.stack
    }, { status: 500 });
  }
}