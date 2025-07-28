import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const { status } = await request.json();

    // Get token and verify user
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

    // Find the order
    const order = await Order.findById(id).populate('products.product');
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Check if user is seller of any product in this order
    const userProducts = await Product.find({ seller: userId }).select('_id');
    const userProductIds = userProducts.map(p => p._id.toString());
    
    const hasSellerProduct = order.products.some((item: any) => 
      userProductIds.includes(item.product._id.toString())
    );

    if (!hasSellerProduct && order.buyer.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to update this order" },
        { status: 403 }
      );
    }

    // Validate status
    const validStatuses = ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    // Update order status
    order.status = status;
    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      order
    });

  } catch (error: any) {
    console.error("Update order status error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order status" },
      { status: 500 }
    );
  }
}