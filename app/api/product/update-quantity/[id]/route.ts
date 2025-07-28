import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const { quantity } = await request.json();

    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found"
      }, { status: 404 });
    }

    // Decrease quantity
    product.quantity = Math.max(0, product.quantity - quantity);
    
    // Update availability status
    if (product.quantity === 0) {
      product.availabilityStatus = 'out_of_stock';
    }

    await product.save();
      
    return NextResponse.json({
      success: true,
      message: "Product quantity updated",
      product
    });
  } catch (error) {
    console.error("Update quantity error:", error);
    return NextResponse.json({
      success: false,
      message: "Error updating product quantity",
      error: error instanceof Error ? error.message : error,
    }, { status: 500 });
  }
}