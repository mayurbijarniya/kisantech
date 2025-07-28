import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
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

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Find the product
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Check if user is admin or the seller of the product
    const isAdmin = user.role === 2;
    const isSeller = product.seller && product.seller.toString() === userId;

    if (!isAdmin && !isSeller) {
      return NextResponse.json(
        { success: false, message: "Not authorized to delete this product" },
        { status: 403 }
      );
    }

    // Delete the product
    await Product.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error: any) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to delete product",
        error: error.message 
      },
      { status: 500 }
    );
  }
}