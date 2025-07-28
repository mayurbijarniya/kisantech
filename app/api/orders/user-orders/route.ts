import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

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
    console.log("Fetching orders for user:", userId);

    // Fetch user's orders
    const orders = await Order.find({ buyer: userId })
      .populate("products.product", "name salePrice rentalPrice")
      .sort({ createdAt: -1 })
      .lean();

    console.log("Found orders:", orders.length);

    return NextResponse.json(
      {
        success: true,
        orders,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get user orders error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}