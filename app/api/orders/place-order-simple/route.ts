import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Starting simple order placement...");
    await connectDB();
    console.log("✅ Database connected");

    // Get token from cookie or header
    const token = request.cookies.get("token")?.value || 
                 request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = (decoded as any)._id || (decoded as any).userId;
    console.log("👤 User ID:", userId);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID in token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("📦 Order data received:", JSON.stringify(body, null, 2));
    
    const {
      products,
      shippingInfo,
      paymentMethod,
      paymentInfo,
      totalAmount
    } = body;

    // Basic validation
    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, message: "Products are required" },
        { status: 400 }
      );
    }

    if (!shippingInfo || !paymentMethod || !totalAmount) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("🔄 Creating order without product validation...");

    // Create order without product lookup/validation
    const orderData = {
      products: products.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      buyer: userId,
      shippingInfo,
      paymentMethod,
      paymentInfo: paymentMethod === 'cod' ? {} : paymentInfo,
      totalAmount,
      status: "Processing",
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'completed',
        amount: totalAmount
      }
    };

    console.log("📝 Final order data:", JSON.stringify(orderData, null, 2));

    const order = await Order.create(orderData);
    console.log("✅ Order created with ID:", order._id);

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully (simple version)",
        orderId: order._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Simple order error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      console.error("Validation errors:", error.errors);
      return NextResponse.json(
        { 
          success: false, 
          message: "Validation error",
          validationErrors: error.errors,
          error: error.message
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        error: error.message,
        errorName: error.name,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}