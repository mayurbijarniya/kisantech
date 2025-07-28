import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { comparePassword } from "@/lib/auth";
import JWT from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 404 }
      );
    }

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is not registerd",
        },
        { status: 404 }
      );
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Password",
        },
        { status: 200 }
      );
    }

    // Generate token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "login successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
        token,
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in login",
        error,
      },
      { status: 500 }
    );
  }
}