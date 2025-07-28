import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

export async function GET() {
  try {
    // Test database connection
    await connectDB();
    
    const connectionState = mongoose.connection.readyState;
    const dbName = mongoose.connection.name;
    const host = mongoose.connection.host;
    
    // Get connection states
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    // Test basic operations
    const testCollection = mongoose.connection.db?.collection('connection_test');
    const testDoc = {
      message: 'API database connection test',
      timestamp: new Date(),
      status: 'connected'
    };
    
    // Test write
    const insertResult = await testCollection?.insertOne(testDoc);
    
    // Test read
    const readResult = await testCollection?.findOne({ _id: insertResult?.insertedId });
    
    // Clean up
    await testCollection?.deleteOne({ _id: insertResult?.insertedId });
    
    // Get collections info
    const collections = await mongoose.connection.db?.listCollections().toArray();
    
    return NextResponse.json({
      success: true,
      message: "Database connection test successful",
      connection: {
        state: states[connectionState as keyof typeof states],
        database: dbName,
        host: host,
        readyState: connectionState
      },
      operations: {
        write: insertResult ? "✅ Success" : "❌ Failed",
        read: readResult ? "✅ Success" : "❌ Failed",
        cleanup: "✅ Success"
      },
      collections: collections?.map(c => c.name) || [],
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error("Database test error:", error);
    
    let errorType = "Unknown error";
    let troubleshooting: string[] = [];
    
    if (error.message?.includes('authentication failed')) {
      errorType = "Authentication Error";
      troubleshooting = [
        "Check your username and password in the connection string",
        "Verify database user permissions"
      ];
    } else if (error.message?.includes('ENOTFOUND')) {
      errorType = "Network Error";
      troubleshooting = [
        "Check your cluster URL",
        "Verify network connection",
        "Ensure cluster is running"
      ];
    } else if (error.message?.includes('IP')) {
      errorType = "IP Whitelist Error";
      troubleshooting = [
        "Add your IP address to MongoDB Atlas whitelist",
        "Use 0.0.0.0/0 for development (not recommended for production)"
      ];
    }
    
    return NextResponse.json({
      success: false,
      message: "Database connection failed",
      error: {
        type: errorType,
        message: error.message,
        troubleshooting
      },
      connection: {
        state: "disconnected",
        database: null,
        host: null,
        readyState: 0
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}