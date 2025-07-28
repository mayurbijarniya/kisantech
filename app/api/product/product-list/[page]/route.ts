import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    await connectDB();
    
    const { page: pageParam } = await params;
    const perPage = 6;
    const page = parseInt(pageParam) || 1;
    const products = await Product
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
      
    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "error in per page ctrl",
      error,
    }, { status: 400 });
  }
}