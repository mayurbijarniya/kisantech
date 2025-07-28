// Script to update existing products with seller field
// This should be run once to fix existing products

const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kisantech');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Product schema (simplified)
const ProductSchema = new mongoose.Schema({
  name: String,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // ... other fields
}, { timestamps: true });

const Product = mongoose.models.Products || mongoose.model('Products', ProductSchema);

// User schema (simplified)
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: Number, // 1 = seller, 2 = admin
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const updateProductsSeller = async () => {
  try {
    await connectDB();
    
    // Find products without seller field
    const productsWithoutSeller = await Product.find({ 
      $or: [
        { seller: { $exists: false } },
        { seller: null }
      ]
    });
    
    console.log(`Found ${productsWithoutSeller.length} products without seller field`);
    
    if (productsWithoutSeller.length === 0) {
      console.log('All products already have seller field');
      return;
    }
    
    // Find a default seller (first admin or seller user)
    const defaultSeller = await User.findOne({ 
      role: { $in: [1, 2] } 
    });
    
    if (!defaultSeller) {
      console.log('No seller or admin user found to assign as default seller');
      return;
    }
    
    console.log(`Using ${defaultSeller.name} (${defaultSeller.email}) as default seller`);
    
    // Update products
    const result = await Product.updateMany(
      { 
        $or: [
          { seller: { $exists: false } },
          { seller: null }
        ]
      },
      { 
        $set: { seller: defaultSeller._id } 
      }
    );
    
    console.log(`Updated ${result.modifiedCount} products with seller field`);
    
  } catch (error) {
    console.error('Error updating products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
updateProductsSeller();