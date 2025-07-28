import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    
    const category = await Category.find({});
    return NextResponse.json({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      error,
      message: "Error while getting all categories",
    }, { status: 500 });
  }
}