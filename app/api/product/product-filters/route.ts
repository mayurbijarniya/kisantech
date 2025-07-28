import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { checked, radio } = await request.json();
    let args: any = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    
    const products = await Product.find(args);
    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    }, { status: 400 });
  }
}