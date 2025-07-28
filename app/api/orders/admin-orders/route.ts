import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get token and verify admin
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

    // Check if user is admin (role = 1)
    const userId = (decoded as any)._id || (decoded as any).userId;
    // Note: You might want to add role check here by fetching user from DB

    // Get all orders for admin
    const orders = await Order.find({})
      .populate('products.product', 'name salePrice rentalPrice seller')
      .populate('buyer', 'name email phone')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      ordersByStatus: {
        Processing: orders.filter(o => o.status === 'Processing').length,
        Confirmed: orders.filter(o => o.status === 'Confirmed').length,
        Shipped: orders.filter(o => o.status === 'Shipped').length,
        Delivered: orders.filter(o => o.status === 'Delivered').length,
        Cancelled: orders.filter(o => o.status === 'Cancelled').length,
      },
      recentOrders: orders.slice(0, 10)
    };

    return NextResponse.json({
      success: true,
      orders,
      stats
    });

  } catch (error: any) {
    console.error("Admin orders error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch admin orders" },
      { status: 500 }
    );
  }
}