import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get all products with basic info
    const products = await Product.find({})
      .select('_id name salePrice rentalPrice quantity type availabilityStatus')
      .limit(10);
    
    const productCount = await Product.countDocuments();
    
    return NextResponse.json({
      success: true,
      totalProducts: productCount,
      sampleProducts: products,
      message: "Products retrieved successfully"
    });
    
  } catch (error: any) {
    console.error("Products debug error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}