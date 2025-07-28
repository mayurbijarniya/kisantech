import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

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

    // Verify user is a seller
    const user = await User.findById(userId);
    if (!user || user.role !== 1) {
      return NextResponse.json(
        { success: false, message: "Seller access required" },
        { status: 403 }
      );
    }

    // Get all products by this seller
    const sellerProducts = await Product.find({ seller: userId }).select('_id');
    const productIds = sellerProducts.map(p => p._id);

    // Find orders containing seller's products
    const orders = await Order.find({
      'products.product': { $in: productIds }
    })
    .populate('products.product', 'name salePrice rentalPrice seller')
    .populate('buyer', 'name email phone')
    .sort({ createdAt: -1 });

    // Filter orders to only include seller's products
    const sellerOrders = orders.map(order => {
      const sellerProducts = order.products.filter((item: any) => 
        productIds.some(id => id.toString() === item.product._id.toString())
      );
      
      return {
        ...order.toObject(),
        products: sellerProducts,
        totalAmount: sellerProducts.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
      };
    }).filter(order => order.products.length > 0);

    return NextResponse.json({
      success: true,
      orders: sellerOrders,
      totalOrders: sellerOrders.length
    });

  } catch (error: any) {
    console.error("Seller orders error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch seller orders" },
      { status: 500 }
    );
  }
}