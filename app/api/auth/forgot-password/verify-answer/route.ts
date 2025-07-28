import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { comparePassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, answer } = body;

    if (!email || !answer) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and answer are required",
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

    // Compare the provided answer with the stored hashed answer
    const isAnswerCorrect = await comparePassword(answer, user.answer);
    if (!isAnswerCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect security answer",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Security answer verified",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Security answer verification error:", error);
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