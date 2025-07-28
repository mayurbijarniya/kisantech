import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        console.log("🔍 Starting debug order process...");

        // Step 1: Test database connection
        await connectDB();
        console.log("✅ Database connected");

        // Step 2: Test token verification
        const token = request.cookies.get("token")?.value ||
            request.headers.get("authorization")?.replace("Bearer ", "");

        if (!token) {
            return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
        }

        console.log("🔑 Token found:", token.substring(0, 20) + "...");

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
        }

        console.log("✅ Token decoded:", decoded);

        const userId = (decoded as any)._id || (decoded as any).userId;
        console.log("👤 User ID extracted:", userId);

        // Step 3: Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        console.log("✅ User found:", user.name);

        // Step 4: Get request body
        const body = await request.json();
        console.log("📦 Request body:", JSON.stringify(body, null, 2));

        // Step 5: Test basic order creation with minimal data
        const testOrderData = {
            products: [
                {
                    product: "507f1f77bcf86cd799439011", // dummy ObjectId for testing
                    quantity: 1,
                    price: 100
                }
            ],
            buyer: userId,
            shippingInfo: {
                fullName: "Test User",
                email: "test@example.com",
                phone: "1234567890",
                address: "Test Address",
                city: "Test City",
                state: "Test State",
                pincode: "123456"
            },
            paymentMethod: "cod",
            paymentInfo: {},
            totalAmount: 100,
            status: "Processing",
            payment: {
                method: "cod",
                status: "pending",
                amount: 100
            }
        };

        console.log("🔄 Creating test order with data:", JSON.stringify(testOrderData, null, 2));

        // Step 6: Try to create order
        const order = await Order.create(testOrderData);
        console.log("✅ Order created successfully:", order._id);

        return NextResponse.json({
            success: true,
            message: "Debug order creation successful",
            orderId: order._id,
            userId: userId,
            userName: user.name
        });

    } catch (error: any) {
        console.error("❌ Debug order error:", error);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);

        return NextResponse.json({
            success: false,
            message: "Debug order failed",
            error: error.message,
            errorName: error.name,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}