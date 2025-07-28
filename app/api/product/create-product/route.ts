import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import slugify from "slugify";

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

    const { verifyToken } = await import("@/lib/auth");
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
    
    const formData = await request.formData();
    
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const type = JSON.parse(formData.get("type") as string || "[]");
    const salePrice = formData.get("salePrice") as string;
    const rentalPrice = formData.get("rentalPrice") as string;
    const rentalUnit = formData.get("rentalUnit") as string;
    const rentalFrom = formData.get("rentalFrom") as string;
    const rentalTo = formData.get("rentalTo") as string;
    const category = formData.get("category") as string;
    const quantity = formData.get("quantity") as string;
    const shipping = formData.get("shipping") as string;
    const photo = formData.get("photo") as File;

    console.log("Product creation data:", { name, description, type, salePrice, rentalPrice, category, quantity, shipping, photoSize: photo?.size });

    // Validation
    if (!name) {
      return NextResponse.json({ error: "Name is Required" }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ error: "Description is Required" }, { status: 400 });
    }
    if (!type || type.length === 0) {
      return NextResponse.json({ error: "Product type (sell/rent) is Required" }, { status: 400 });
    }
    if (type.includes('sell') && !salePrice) {
      return NextResponse.json({ error: "Sale price is Required when product is for sale" }, { status: 400 });
    }
    if (type.includes('rent') && (!rentalPrice || !rentalFrom || !rentalTo)) {
      return NextResponse.json({ error: "Rental price and dates are Required when product is for rent" }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ error: "Category is Required" }, { status: 400 });
    }
    if (!quantity) {
      return NextResponse.json({ error: "Quantity is Required" }, { status: 400 });
    }
    if (photo && photo.size > 5000000) {
      return NextResponse.json({ 
        error: "Photo should be less than 5mb" 
      }, { status: 400 });
    }

    const userId = (decoded as any)._id || (decoded as any).userId;
    console.log("Creating product for user:", userId);

    // Create product data
    const productData: any = {
      name,
      slug: slugify(name),
      description,
      type,
      category,
      seller: userId,
      quantity: parseInt(quantity),
      shipping: shipping === "1" || shipping === "true",
      availabilityStatus: 'available'
    };

    // Add sale price if product is for sale
    if (type.includes('sell') && salePrice) {
      productData.salePrice = parseInt(salePrice);
    }

    // Add rental data if product is for rent
    if (type.includes('rent')) {
      productData.rentalPrice = parseInt(rentalPrice);
      productData.rentalUnit = rentalUnit;
      productData.rentalAvailability = {
        from: new Date(rentalFrom),
        to: new Date(rentalTo)
      };
    }

    const product = new Product(productData);

    if (photo && photo.size > 0) {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      product.photo = {
        data: buffer,
        contentType: photo.type
      };
    }

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product Created Successfully",
      product: {
        _id: product._id,
        name: product.name,
        description: product.description,
        type: product.type,
        salePrice: product.salePrice,
        rentalPrice: product.rentalPrice,
        rentalUnit: product.rentalUnit,
        category: product.category,
        quantity: product.quantity,
        shipping: product.shipping,
        slug: product.slug,
        availabilityStatus: product.availabilityStatus
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Error in creating product",
    }, { status: 500 });
  }
}