const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function initializeSystem() {
  try {
    console.log('🚀 Initializing KisanTech System...\n');

    // 1. Create Admin Account
    console.log('1️⃣ Creating admin account...');
    try {
      const adminResponse = await axios.post(`${BASE_URL}/api/admin/create-admin`);
      if (adminResponse.data.success) {
        console.log('✅ Admin account created');
        console.log('   📧 Email: admin@admin.com');
        console.log('   🔑 Password: Admin@123\n');
      }
    } catch (error) {
      console.log('ℹ️  Admin account already exists\n');
    }

    // 2. Create Categories
    console.log('2️⃣ Creating sample categories...');
    const categories = [
      { name: 'Seeds & Plants', slug: 'seeds-plants' },
      { name: 'Fertilizers', slug: 'fertilizers' },
      { name: 'Farm Equipment', slug: 'farm-equipment' },
      { name: 'Irrigation', slug: 'irrigation' },
      { name: 'Pesticides', slug: 'pesticides' }
    ];

    // Login as admin to create categories
    const adminLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@admin.com',
      password: 'Admin@123'
    });

    if (adminLogin.data.success) {
      const adminToken = adminLogin.data.token;
      
      for (const category of categories) {
        try {
          await axios.post(`${BASE_URL}/api/category/create-category`, category, {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          console.log(`   ✅ Created category: ${category.name}`);
        } catch (error) {
          console.log(`   ⚠️  Category ${category.name} might already exist`);
        }
      }
    }

    console.log('\n🎉 System initialization completed!');
    console.log('\n📋 What you can do now:');
    console.log('1. Login as admin: admin@admin.com / Admin@123');
    console.log('2. Register as seller and create products');
    console.log('3. Register as buyer and place orders');
    console.log('4. Test the complete order workflow');

  } catch (error) {
    console.error('❌ System initialization failed:', error.response?.data || error.message);
  }
}

initializeSystem();