import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import User from '../lib/models/User.js';
import { hashPassword } from '../lib/utils/password.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const resetAdminPassword = async () => {
  try {
    const mongoUri = process.env.MONGOURI || process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ Error: MONGOURI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    const email = '706359@gmail.com';
    const tempPassword = 'TempPass@123';

    // Find admin user
    let admin = await User.findOne({ email: email.toLowerCase() });

    if (!admin) {
      console.log('❌ Admin user NOT FOUND!');
      console.log('💡 Creating new admin user...\n');

      const hashedPassword = await hashPassword(tempPassword);
      admin = new User({
        email: email.toLowerCase(),
        phone: '8958111112',
        mobile: '8958111112',
        password: hashedPassword,
        name: 'Admin',
        role: 'Admin',
        isTemporaryPassword: true,
        isActive: true,
        loginAttempts: 0,
        createdAt: new Date(),
      });

      await admin.save();
      console.log('✅ Admin user created successfully!');
    } else {
      console.log('✅ Admin user found!');
      console.log('   Email:', admin.email);
      console.log('   Resetting password...\n');

      // Reset password and role
      const hashedPassword = await hashPassword(tempPassword);
      admin.password = hashedPassword;
      admin.role = 'Admin'; // Ensure role is set to Admin
      admin.isTemporaryPassword = true;
      admin.isActive = true;
      admin.loginAttempts = 0;
      admin.lockUntil = null;

      await admin.save();
      console.log('✅ Password and role reset successfully!');
    }

    console.log('\n📋 Admin Credentials:');
    console.log('   Email:', admin.email);
    console.log('   Password:', tempPassword);
    console.log('   ⚠️  IMPORTANT: You MUST change this password on first login!');
    console.log('\n✅ Admin account is ready to use!\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting admin password:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
};

resetAdminPassword();
