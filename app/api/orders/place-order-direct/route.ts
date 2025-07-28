import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Direct order placement starting...");
    await connectDB();
    console.log("✅ Database connected");

    // Get token
    const token = request.cookies.get("token")?.value || 
                 request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("❌ No token found");
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.log("❌ Invalid token");
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = (decoded as any)._id || (decoded as any).userId;
    console.log("👤 User ID:", userId);

    const body = await request.json();
    console.log("📦 Request body:", JSON.stringify(body, null, 2));

    const { products, shippingInfo, paymentMethod, totalAmount } = body;

    // Create order directly without validation
    const orderData = {
      products: products.map((item: any) => ({
        product: item.product,
        quantity: item.quantity || 1,
        price: item.price || 0
      })),
      buyer: userId,
      shippingInfo: {
        fullName: shippingInfo.fullName || "Unknown",
        email: shippingInfo.email || "unknown@example.com",
        phone: shippingInfo.phone || "0000000000",
        address: shippingInfo.address || "Unknown Address",
        city: shippingInfo.city || "Unknown City",
        state: shippingInfo.state || "Unknown State",
        pincode: shippingInfo.pincode || "000000",
        landmark: shippingInfo.landmark || ""
      },
      paymentMethod: paymentMethod || "cod",
      paymentInfo: {},
      totalAmount: totalAmount || 0,
      status: "Processing",
      payment: {
        method: paymentMethod || "cod",
        status: "pending",
        amount: totalAmount || 0
      }
    };

    console.log("📝 Creating order with data:", JSON.stringify(orderData, null, 2));

    const order = await Order.create(orderData);
    console.log("✅ Order created successfully:", order._id);

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        orderId: order._id,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("❌ Direct order error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // Return detailed error for debugging
    return NextResponse.json(
      {
        success: false,
        message: "Order placement failed",
        error: error.message,
        errorName: error.name,
        errorDetails: {
          code: error.code,
          codeName: error.codeName,
          keyPattern: error.keyPattern,
          keyValue: error.keyValue
        }
      },
      { status: 500 }
    );
  }
}