import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@admin.com" });
    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: "Admin already exists",
        admin: {
          email: existingAdmin.email,
          name: existingAdmin.name,
          role: existingAdmin.role
        }
      });
    }

    // Create admin account
    const hashedPassword = await hashPassword("Admin@123");
    const hashedAnswer = await hashPassword("admin");

    const admin = await User.create({
      name: "System Administrator",
      email: "admin@admin.com",
      password: hashedPassword,
      phone: "9999999999",
      address: "System Address",
      securityQuestion: "What is your role?",
      answer: hashedAnswer,
      role: 2 // Admin role
    });

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error: any) {
    console.error("Create admin error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to create admin account",
      error: error.message
    }, { status: 500 });
  }
}