import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    console.log("Testing product API...");
    
    await connectDB();
    console.log("Database connected successfully");
    
    const productCount = await Product.countDocuments();
    console.log("Product count:", productCount);
    
    const products = await Product
      .find({})
      .limit(3)
      .select("name description type salePrice rentalPrice quantity availabilityStatus createdAt")
      .lean();
      
    console.log("Sample products:", products);
      
    return NextResponse.json({
      success: true,
      message: "Test successful",
      productCount,
      sampleProducts: products,
    });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json({
      success: false,
      message: "Test failed",
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}