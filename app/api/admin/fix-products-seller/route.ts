import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get token and verify admin access
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

    // Verify user is admin
    const user = await User.findById(userId);
    if (!user || user.role !== 2) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    // Find products without seller field
    const productsWithoutSeller = await Product.find({ 
      $or: [
        { seller: { $exists: false } },
        { seller: null }
      ]
    });
    
    console.log(`Found ${productsWithoutSeller.length} products without seller field`);
    
    if (productsWithoutSeller.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All products already have seller field",
        updated: 0
      });
    }
    
    // Use current admin as default seller for products without seller
    const result = await Product.updateMany(
      { 
        $or: [
          { seller: { $exists: false } },
          { seller: null }
        ]
      },
      { 
        $set: { seller: userId } 
      }
    );
    
    console.log(`Updated ${result.modifiedCount} products with seller field`);

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} products with seller field`,
      updated: result.modifiedCount
    });

  } catch (error: any) {
    console.error("Fix products seller error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fix products seller field",
        error: error.message 
      },
      { status: 500 }
    );
  }
}