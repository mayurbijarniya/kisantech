import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get token from cookie or header
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

    // Extract user ID from token (could be _id or userId depending on how token was created)
    const userId = (decoded as any)._id || (decoded as any).userId;
    console.log("🔑 Decoded token:", decoded);
    console.log("👤 User ID:", userId);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID in token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Received order data:", JSON.stringify(body, null, 2));
    
    const {
      products,
      shippingInfo,
      paymentMethod,
      paymentInfo,
      totalAmount
    } = body;

    // Validate required fields
    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, message: "Products are required" },
        { status: 400 }
      );
    }

    // Validate product structure
    for (const item of products) {
      if (!item.product || !item.quantity || !item.price) {
        return NextResponse.json(
          { success: false, message: "Invalid product structure. Each product must have product, quantity, and price" },
          { status: 400 }
        );
      }
    }

    if (!shippingInfo || !paymentMethod || !totalAmount) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate shipping info
    const requiredShippingFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of requiredShippingFields) {
      if (!shippingInfo[field]) {
        return NextResponse.json(
          { success: false, message: `Missing shipping field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check product availability and update quantities
    console.log("🔍 Checking products:", products);
    
    for (const item of products) {
      console.log(`🔍 Processing product: ${item.product}`);
      
      // Validate ObjectId format
      if (!require('mongoose').Types.ObjectId.isValid(item.product)) {
        console.error(`❌ Invalid ObjectId: ${item.product}`);
        return NextResponse.json(
          { success: false, message: `Invalid product ID format: ${item.product}` },
          { status: 400 }
        );
      }
      
      const product = await Product.findById(item.product);
      console.log(`📦 Product found:`, product ? `${product.name} (${product._id})` : 'NOT FOUND');
      
      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product ${item.product} not found` },
          { status: 404 }
        );
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json(
          { success: false, message: `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}` },
          { status: 400 }
        );
      }

      // Update product quantity
      console.log(`📉 Updating quantity for ${product.name}: ${product.quantity} - ${item.quantity} = ${product.quantity - item.quantity}`);
      product.quantity -= item.quantity;
      if (product.quantity === 0) {
        product.availabilityStatus = 'out_of_stock';
      }
      await product.save();
      console.log(`✅ Product ${product.name} quantity updated`);
    }

    // Create order
    console.log("🔄 Creating order...");
    const orderCreateData = {
      products: products.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      buyer: userId,
      shippingInfo,
      paymentMethod,
      paymentInfo: paymentMethod === 'cod' ? {} : paymentInfo,
      totalAmount,
      status: "Processing",
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'completed',
        amount: totalAmount
      }
    };
    
    console.log("📝 Order create data:", JSON.stringify(orderCreateData, null, 2));
    
    const order = await Order.create(orderCreateData);
    console.log("✅ Order created successfully:", order._id);

    const populatedOrder = await Order.findById(order._id)
      .populate("products.product", "name price")
      .populate("buyer", "name email");

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        order: populatedOrder,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Place order error:", error);
    console.error("Error stack:", error.stack);
    console.error("Error message:", error.message);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}