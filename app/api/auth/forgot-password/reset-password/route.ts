import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { hashPassword, comparePassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, newPassword, answer } = body;

    if (!email || !newPassword || !answer) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, new password, and security answer are required",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Verify security answer one more time for security
    const isAnswerCorrect = await comparePassword(answer, user.answer);
    if (!isAnswerCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Security verification failed",
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update user's password
    await User.findByIdAndUpdate(user._id, {
      password: hashedNewPassword,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}