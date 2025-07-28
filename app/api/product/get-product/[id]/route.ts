import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const product = await Product
      .findById(id)
      .populate("category")
      .select("-__v");
      
    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found"
      }, { status: 404 });
    }
      
    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching product",
      error: error instanceof Error ? error.message : error,
    }, { status: 500 });
  }
}