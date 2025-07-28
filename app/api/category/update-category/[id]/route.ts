import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import slugify from "slugify";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const { name } = await request.json();
    
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    
    return NextResponse.json({
      success: true,
      message: "Category Updated Successfully",
      category,
    });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      error,
      message: "Error while updating category",
    }, { status: 500 });
  }
}