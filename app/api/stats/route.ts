import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    
    // Get real counts from database
    const [productCount, userCount] = await Promise.all([
      Product.countDocuments({}),
      User.countDocuments({ role: { $ne: "admin" } }) // Count non-admin users as farmers/buyers
    ]);

    // Calculate cities served (you can make this dynamic based on user locations)
    const citiesCount = Math.max(5, Math.floor(userCount / 10)); // Estimate cities based on users
    
    return NextResponse.json({
      success: true,
      stats: {
        farmers: userCount,
        products: productCount,
        cities: citiesCount,
        experience: 3 // Years in business
      }
    });

  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch stats"
    }, { status: 500 });
  }
}