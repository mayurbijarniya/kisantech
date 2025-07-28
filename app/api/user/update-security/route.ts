import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken, hashPassword } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    // Get token and verify user
    const token = request.cookies.get("token")?.value || 
                 request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = (decoded as any)._id || (decoded as any).userId;
    const body = await request.json();
    const { securityQuestion, answer } = body;

    // Validate required fields
    if (!securityQuestion || !answer) {
      return NextResponse.json(
        { success: false, message: "Security question and answer are required" },
        { status: 400 }
      );
    }

    // Hash the answer
    const hashedAnswer = await hashPassword(answer.toLowerCase().trim());

    // Update security settings
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        securityQuestion,
        answer: hashedAnswer
      },
      { new: true, select: '-password -answer' }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Security settings updated successfully"
    });

  } catch (error: any) {
    console.error("Update security error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update security settings" },
      { status: 500 }
    );
  }
}