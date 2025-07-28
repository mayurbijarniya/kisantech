import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET() {
  try {
    console.log("Fetching products...");
    await connectDB();
    console.log("Database connected");
    
    // Ensure models are registered
    if (!mongoose.models.Category) {
      require("@/models/Category");
    }
    if (!mongoose.models.Products) {
      require("@/models/Product");
    }
    
    try {
      // Try with populate first
      const products = await Product
        .find({})
        .populate("category", "name")
        .select("-photo")
        .limit(12)
        .sort({ createdAt: -1 });
        
      console.log(`Found ${products.length} products with populate`);
        
      return NextResponse.json({
        success: true,
        counTotal: products.length,
        message: "All products fetched successfully",
        products,
      });
    } catch (populateError) {
      console.log("Populate failed, trying without populate:", populateError);
      
      // Fallback: get products without populate
      const products = await Product
        .find({})
        .select("-photo")
        .limit(12)
        .sort({ createdAt: -1 });
        
      // Get all unique category IDs
      const categoryIds = [...new Set(products.map(p => p.category).filter(Boolean))];
      
      // Fetch categories separately
      const categories = await Category.find({ _id: { $in: categoryIds } }).select("name");
      const categoryMap = categories.reduce((acc, cat) => {
        acc[cat._id.toString()] = cat;
        return acc;
      }, {} as any);
      
      // Manually populate categories
      const productsWithCategories = products.map(product => ({
        ...product.toObject(),
        category: categoryMap[product.category?.toString()] || null
      }));
        
      console.log(`Found ${products.length} products without populate`);
        
      return NextResponse.json({
        success: true,
        counTotal: products.length,
        message: "All products fetched successfully (fallback)",
        products: productsWithCategories,
      });
    }
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json({
      success: false,
      message: "Error in getting products",
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}