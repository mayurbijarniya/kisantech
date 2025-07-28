import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const isOrganic = searchParams.get("isOrganic");
    const location = searchParams.get("location");

    // Build query
    const query: any = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (isOrganic === "true") {
      query.isOrganic = true;
    }

    if (location) {
      query.$or = [
        { "location.city": { $regex: location, $options: "i" } },
        { "location.state": { $regex: location, $options: "i" } },
      ];
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder;

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("seller", "name email phone location")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error: any) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get token from cookie or header
    const token = request.cookies.get("token")?.value || 
                 request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      category,
      subcategory,
      images,
      stock,
      unit,
      specifications,
      location,
      isOrganic,
      harvestDate,
      expiryDate,
      tags,
    } = body;

    // Validation
    if (!name || !description || !price || !category || !images || !stock || !unit || !location) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      category,
      subcategory,
      images,
      seller: decoded.userId,
      stock,
      unit,
      specifications,
      location,
      isOrganic: isOrganic || false,
      harvestDate,
      expiryDate,
      tags: tags || [],
    });

    const populatedProduct = await Product.findById(product._id)
      .populate("seller", "name email phone location");

    return NextResponse.json(
      {
        message: "Product created successfully",
        product: populatedProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create product error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: messages.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}