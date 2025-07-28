import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get token and verify admin
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
    const user = await User.findById(userId);
    
    if (!user || user.role !== 2) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    // Get comprehensive statistics
    const [
      totalUsers,
      totalBuyers,
      totalSellers,
      totalProducts,
      saleProducts,
      rentalProducts,
      totalOrders,
      orders
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: 0 }),
      User.countDocuments({ role: 1 }),
      Product.countDocuments({}),
      Product.countDocuments({ type: 'sell' }),
      Product.countDocuments({ type: 'rent' }),
      Order.countDocuments({}),
      Order.find({}).select('totalAmount status createdAt')
    ]);

    // Calculate revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const completedOrders = orders.filter(order => order.status === 'Delivered');
    const completedRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Order status breakdown
    const ordersByStatus = {
      Processing: orders.filter(o => o.status === 'Processing').length,
      Confirmed: orders.filter(o => o.status === 'Confirmed').length,
      Shipped: orders.filter(o => o.status === 'Shipped').length,
      Delivered: orders.filter(o => o.status === 'Delivered').length,
      Cancelled: orders.filter(o => o.status === 'Cancelled').length,
    };

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = orders.filter(order => 
      new Date(order.createdAt) >= thirtyDaysAgo
    ).length;

    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const recentProducts = await Product.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    return NextResponse.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          buyers: totalBuyers,
          sellers: totalSellers,
          admins: totalUsers - totalBuyers - totalSellers,
          recent: recentUsers
        },
        products: {
          total: totalProducts,
          sale: saleProducts,
          rental: rentalProducts,
          recent: recentProducts
        },
        orders: {
          total: totalOrders,
          recent: recentOrders,
          byStatus: ordersByStatus
        },
        revenue: {
          total: totalRevenue,
          completed: completedRevenue,
          pending: totalRevenue - completedRevenue
        },
        growth: {
          ordersThisMonth: recentOrders,
          usersThisMonth: recentUsers,
          productsThisMonth: recentProducts
        }
      }
    });

  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch admin statistics" },
      { status: 500 }
    );
  }
}