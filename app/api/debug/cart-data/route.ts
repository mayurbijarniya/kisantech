import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        console.log("🔍 Debugging cart data...");

        // Get token and verify user
        const token = request.cookies.get("token")?.value ||
            request.headers.get("authorization")?.replace("Bearer ", "");

        if (!token) {
            return NextResponse.json({ success: false, message: "No token" }, { status: 401 });
        }

        const decoded = verifyToken(token);
        const userId = (decoded as any)?._id || (decoded as any)?.userId;

        // Get user info
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Get request body (cart data)
        const body = await request.json();
        const { cartItems } = body;

        console.log("📦 Cart items received:", JSON.stringify(cartItems, null, 2));

        // Check each cart item in database
        const productChecks = [];
        for (const item of cartItems || []) {
            try {
                const product = await Product.findById(item._id);
                productChecks.push({
                    cartItem: item,
                    productExists: !!product,
                    productData: product ? {
                        _id: product._id,
                        name: product.name,
                        salePrice: product.salePrice,
                        rentalPrice: product.rentalPrice,
                        quantity: product.quantity,
                        type: product.type
                    } : null,
                    isValidObjectId: require('mongoose').Types.ObjectId.isValid(item._id)
                });
            } catch (error: any) {
                productChecks.push({
                    cartItem: item,
                    error: error.message,
                    isValidObjectId: require('mongoose').Types.ObjectId.isValid(item._id)
                });
            }
        }

        return NextResponse.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            cartItems: cartItems || [],
            productChecks,
            totalProducts: await Product.countDocuments(),
            message: "Cart data analysis complete"
        });

    } catch (error: any) {
        console.error("❌ Cart debug error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}