import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import slugify from "slugify";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 401 });
    }
    
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json({
        success: false,
        message: "Category Already Exists",
      }, { status: 200 });
    }
    
    const category = await new Category({
      name,
      slug: slugify(name),
    }).save();
    
    return NextResponse.json({
      success: true,
      message: "New category created",
      category,
    }, { status: 201 });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      error,
      message: "Error in Category",
    }, { status: 500 });
  }
}