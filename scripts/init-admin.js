const axios = require('axios');

async function initializeAdmin() {
  try {
    console.log('🔧 Initializing admin account...');
    
    const response = await axios.post('http://localhost:3000/api/admin/create-admin');
    
    if (response.data.success) {
      console.log('✅ Admin account ready!');
      console.log('📧 Email: admin@admin.com');
      console.log('🔑 Password: Admin@123');
      console.log('👤 Role: Administrator');
    } else {
      console.log('ℹ️ Admin account already exists');
    }
  } catch (error) {
    console.error('❌ Failed to initialize admin:', error.response?.data || error.message);
  }
}

initializeAdmin();