import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SimpleOrder from "@/models/SimpleOrder";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Simple model order placement starting...");
    await connectDB();
    console.log("✅ Database connected");

    // Get token
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

    const body = await request.json();
    console.log("📦 Request body:", JSON.stringify(body, null, 2));

    // Create order with simple model
    const orderData = {
      products: body.products || [],
      buyer: userId,
      shippingInfo: body.shippingInfo || {},
      paymentMethod: body.paymentMethod || "cod",
      totalAmount: body.totalAmount || 0,
      status: "Processing"
    };

    console.log("📝 Creating simple order...");
    const order = await SimpleOrder.create(orderData);
    console.log("✅ Simple order created:", order._id);

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully (simple model)",
        orderId: order._id,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("❌ Simple model order error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Order placement failed",
        error: error.message,
        errorName: error.name
      },
      { status: 500 }
    );
  }
}