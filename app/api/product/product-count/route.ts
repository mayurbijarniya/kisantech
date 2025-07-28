import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    
    const total = await Product.find({}).estimatedDocumentCount();
    return NextResponse.json({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Error in product count",
      error,
      success: false,
    }, { status: 400 });
  }
}