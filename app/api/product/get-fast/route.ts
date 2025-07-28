import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    
    // Ultra-fast query with minimal data
    const products = await Product
      .find({}, {
        name: 1,
        description: 1,
        type: 1,
        salePrice: 1,
        rentalPrice: 1,
        rentalUnit: 1,
        quantity: 1,
        availabilityStatus: 1,
        createdAt: 1,
        _id: 1
      })
      .limit(12)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
      
    console.log(`Fast API: Found ${products.length} products in minimal time`);
      
    return NextResponse.json({
      success: true,
      message: "Products fetched successfully (fast)",
      products,
    });
  } catch (error) {
    console.error("Get fast products error:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching products",
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}