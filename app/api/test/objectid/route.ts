import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Testing ObjectId validation:", body);
    
    const { productId, userId } = body;
    
    // Test ObjectId validation
    const tests = {
      productIdValid: mongoose.Types.ObjectId.isValid(productId),
      userIdValid: mongoose.Types.ObjectId.isValid(userId),
      productIdConverted: productId ? new mongoose.Types.ObjectId(productId) : null,
      userIdConverted: userId ? new mongoose.Types.ObjectId(userId) : null
    };
    
    console.log("ObjectId tests:", tests);
    
    return NextResponse.json({
      success: true,
      tests,
      message: "ObjectId validation complete"
    });
    
  } catch (error: any) {
    console.error("ObjectId test error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}