const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function cleanupDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Found collections:', collections.map(c => c.name));

    // Collections to clean
    const collectionsToClean = [
      'users',
      'products', 
      'orders',
      'categories'
    ];

    console.log('\n🗑️  Cleaning up collections...');
    
    for (const collectionName of collectionsToClean) {
      try {
        const collection = mongoose.connection.db.collection(collectionName);
        const count = await collection.countDocuments();
        
        if (count > 0) {
          await collection.deleteMany({});
          console.log(`✅ Cleaned ${collectionName}: ${count} documents removed`);
        } else {
          console.log(`ℹ️  ${collectionName}: Already empty`);
        }
      } catch (error) {
        console.log(`⚠️  ${collectionName}: Collection doesn't exist or error occurred`);
      }
    }

    console.log('\n🎯 Database cleanup completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Run: node scripts/init-admin.js');
    console.log('2. Create some categories');
    console.log('3. Register as seller and create products');
    console.log('4. Register as buyer and place orders');

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

cleanupDatabase();