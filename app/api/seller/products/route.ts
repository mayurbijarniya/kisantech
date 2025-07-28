import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
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

    // Get seller's products
    const products = await Product.find({ seller: userId })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    console.log(`Found ${products.length} products for seller ${userId}`);

    return NextResponse.json({
      success: true,
      products,
      totalProducts: products.length
    });

  } catch (error: any) {
    console.error("Seller products error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch seller products",
        error: error.message 
      },
      { status: 500 }
    );
  }
}