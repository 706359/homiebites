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

const seedData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Create test user with email 12345@test.com and password 12345
    let testUser = await User.findOne({ email: '12345@test.com' });
    
    let user;
    if (testUser) {
      console.log('⚠️  Test user already exists, updating...');
      testUser.name = 'Test User 12345';
      testUser.phone = '12345';
      testUser.password = '12345';
      await testUser.save();
      user = testUser;
    } else {
      user = await User.create({
        name: 'Test User 12345',
        email: '12345@test.com',
        phone: '12345',
        password: '12345',
        role: 'customer',
      });
      console.log('✅ Test user created:', user.email);
    }

    // Create dummy order
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = today.getMonth();
    const billingMonth = monthNames[monthIndex];
    const referenceMonth = `${String(monthIndex + 1).padStart(2, '0')} - ${monthNames[monthIndex].substring(0, 3)}'${year.toString().slice(-2)}`;

    const existingOrder = await Order.findOne({ 
      customerId: user._id,
      date: formattedDate,
      deliveryAddress: 'A1-407 Shriti'
    });

    if (existingOrder) {
      console.log('⚠️  Dummy order already exists for today');
    } else {
      const dummyOrder = await Order.create({
        sNo: '1',
        date: formattedDate,
        deliveryAddress: 'A1-407 Shriti',
        quantity: 1,
        unitPrice: 100,
        totalAmount: 100,
        status: 'Paid',
        paymentMode: 'Online',
        billingMonth: billingMonth,
        referenceMonth: referenceMonth,
        elapsedDays: 0,
        year: year.toString(),
        customerId: user._id,
        customerName: user.name,
        customerPhone: user.phone,
        items: [
          {
            name: 'Daily Tiffin',
            quantity: 1,
            price: 100,
          },
        ],
        // Backward compatibility
        customerAddress: 'A1-407 Shriti',
        total: 100,
        createdAt: today,
      });

      console.log('✅ Dummy order created:', dummyOrder._id);
      console.log('   Date:', dummyOrder.date);
      console.log('   Address:', dummyOrder.deliveryAddress);
      console.log('   Amount: ₹', dummyOrder.totalAmount);
    }

    console.log('\n✅ Seed data completed!');
    console.log('\n📋 Test User Credentials:');
    console.log('   Email: 12345@test.com');
    console.log('   Password: 12345');
    console.log('   Phone: 12345');
    console.log('   Name: Test User 12345');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

