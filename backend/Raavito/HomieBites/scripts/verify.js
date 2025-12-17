import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend root (three levels up: scripts -> HomieBites -> Raavito -> backend)
dotenv.config({ path: join(__dirname, '../../../.env') });

const verifyData = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Check users
    const users = await User.find({});
    console.log(`📊 Total Users: ${users.length}`);
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Check orders
    const orders = await Order.find({});
    console.log(`\n📦 Total Orders: ${orders.length}`);
    orders.forEach(order => {
      console.log(`   - Order #${order.sNo || order._id}`);
      console.log(`     Date: ${order.date}`);
      console.log(`     Address: ${order.deliveryAddress}`);
      console.log(`     Amount: ₹${order.totalAmount}`);
      console.log(`     Status: ${order.status}`);
      console.log(`     Customer: ${order.customerName || 'N/A'}`);
      console.log('');
    });

    // Check test user specifically
    const testUser = await User.findOne({ email: '12345@test.com' });
    if (testUser) {
      console.log('✅ Test User Found:');
      console.log(`   Email: ${testUser.email}`);
      console.log(`   Name: ${testUser.name}`);
      console.log(`   Phone: ${testUser.phone}`);
      console.log(`   ID: ${testUser._id}`);
      
      // Check orders for this user
      const userOrders = await Order.find({ customerId: testUser._id });
      console.log(`\n📦 Orders for Test User: ${userOrders.length}`);
      userOrders.forEach(order => {
        console.log(`   - ${order.date} | ₹${order.totalAmount} | ${order.status}`);
      });
    } else {
      console.log('❌ Test user not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

verifyData();

