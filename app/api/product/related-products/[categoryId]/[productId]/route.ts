import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string; productId: string }> }
) {
  try {
    await connectDB();
    
    const { categoryId, productId } = await params;
    const products = await Product
      .find({
        category: categoryId,
        _id: { $ne: productId }
      })
      .populate("category")
      .select("-photo")
      .limit(4)
      .sort({ createdAt: -1 });
      
    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get related products error:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching related products",
      error: error instanceof Error ? error.message : error,
    }, { status: 500 });
  }
}