import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    await Category.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: "Category Deleted Successfully",
    });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Error while deleting category",
      error,
    }, { status: 500 });
  }
}