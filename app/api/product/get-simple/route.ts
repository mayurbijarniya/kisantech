import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    
    // Use lean() for faster queries and add index hints
    const products = await Product
      .find({})
      .select("name description type salePrice rentalPrice rentalUnit quantity availabilityStatus createdAt category")
      .limit(12)
      .sort({ createdAt: -1 })
      .lean(); // This makes queries much faster
      
    console.log(`Simple API: Found ${products.length} products`);
      
    return NextResponse.json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Get simple products error:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching products",
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}