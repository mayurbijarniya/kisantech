import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import JWT from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, password, phone, address, securityQuestion, answer, role = 0 } = body;

    // Validation
    if (!name) {
      return NextResponse.json({ error: "Name is Required" });
    }
    if (!email) {
      return NextResponse.json({ message: "Email is Required" });
    }
    if (!password) {
      return NextResponse.json({ message: "Password is Required" });
    }
    if (!phone) {
      return NextResponse.json({ message: "Phone no is Required" });
    }
    if (!address) {
      return NextResponse.json({ message: "Address is Required" });
    }
    if (!securityQuestion) {
      return NextResponse.json({ message: "Security Question is Required" });
    }
    if (!answer) {
      return NextResponse.json({ message: "Security Answer is Required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Already Register please login",
        },
        { status: 200 }
      );
    }

    // Hash password and answer
    const hashedPassword = await hashPassword(password);
    const hashedAnswer = await hashPassword(answer.toLowerCase().trim());

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      securityQuestion,
      answer: hashedAnswer,
      role,
    });

    // Generate token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "User Register Successfully",
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
      { status: 201 }
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
    console.error("Registration error:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Already Register please login",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Errro in Registeration",
        error,
      },
      { status: 500 }
    );
  }
}