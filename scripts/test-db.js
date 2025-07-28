const mongoose = require('mongoose');
const colors = require('colors');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kishantech';

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...'.yellow);
    console.log(`📍 Connection URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`.cyan);
    
    // Connect to MongoDB
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ Connected To MongoDB Database: ${conn.connection.host}`.bgGreen.white);
    console.log(`📊 Database Name: ${conn.connection.name}`.green);
    console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`.green);
    
    // Test basic operations
    console.log('\n🧪 Testing basic database operations...'.yellow);
    
    // List collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📁 Available Collections: ${collections.length > 0 ? collections.map(c => c.name).join(', ') : 'None'}`.blue);
    
    // Test write operation
    const testCollection = conn.connection.db.collection('connection_test');
    const testDoc = {
      message: 'Database connection test successful',
      timestamp: new Date(),
      status: 'connected'
    };
    
    await testCollection.insertOne(testDoc);
    console.log('✅ Write operation successful'.green);
    
    // Test read operation
    const retrievedDoc = await testCollection.findOne({ message: 'Database connection test successful' });
    if (retrievedDoc) {
      console.log('✅ Read operation successful'.green);
    }
    
    // Clean up test document
    await testCollection.deleteOne({ _id: retrievedDoc._id });
    console.log('🧹 Test document cleaned up'.gray);
    
    console.log('\n🎉 All database tests passed successfully!'.bgGreen.white);
    
  } catch (error) {
    console.log(`❌ Error connecting to MongoDB: ${error.message}`.bgRed.white);
    
    if (error.message.includes('authentication failed')) {
      console.log('💡 Tip: Check your username and password in the connection string'.yellow);
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('💡 Tip: Check your cluster URL and network connection'.yellow);
    } else if (error.message.includes('IP')) {
      console.log('💡 Tip: Make sure your IP address is whitelisted in MongoDB Atlas'.yellow);
    }
    
    console.log('\n🔧 Troubleshooting steps:'.cyan);
    console.log('1. Verify your MongoDB Atlas connection string');
    console.log('2. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('3. Ensure your username and password are correct');
    console.log('4. Make sure your cluster is running');
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed'.gray);
    process.exit(0);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n⚠️  Process interrupted, closing database connection...'.yellow);
  await mongoose.connection.close();
  process.exit(0);
});

// Run the test
testConnection();