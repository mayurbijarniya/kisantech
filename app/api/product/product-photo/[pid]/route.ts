import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pid: string }> }
) {
  try {
    await connectDB();
    
    const { pid } = await params;
    const product = await Product.findById(pid).select("photo");
    if (product?.photo?.data) {
      const response = new NextResponse(product.photo.data);
      response.headers.set("Content-Type", product.photo.contentType);
      return response;
    }
    
    return NextResponse.json({
      success: false,
      message: "Photo not found",
    }, { status: 404 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Erorr while getting photo",
      error,
    }, { status: 500 });
  }
}