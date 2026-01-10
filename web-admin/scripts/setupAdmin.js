/**
 * Setup Admin User Script
 * Creates initial admin user with temporary password
 * Following ADMIN_PASSWORD.md specification
 * 
 * Usage: node scripts/setupAdmin.js
 */
import mongoose from 'mongoose';
import { hashPassword } from '../lib/utils/password.js';
import User from '../lib/models/User.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const setupAdmin = async () => {
  try {
    const mongoUri = process.env.MONGOURI || process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ Error: MONGOURI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: '706359@gmail.com' });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists!');
      console.log('   Email:', existingAdmin.email);
      console.log('   Name:', existingAdmin.name);
      console.log('   Role:', existingAdmin.role);
      if (existingAdmin.isTemporaryPassword) {
        console.log('   ⚠️  Temporary password is still active - user needs to change password');
      }
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create temporary password
    const tempPassword = 'TempPass@123'; // User will change this on first login
    const hashedPassword = await hashPassword(tempPassword);

    // Create admin user
    const admin = new User({
      email: '706359@gmail.com',
      phone: '8958111112',
      mobile: '8958111112',
      password: hashedPassword,
      name: 'Admin',
      role: 'Admin',
      isTemporaryPassword: true, // Forces password change on first login
      isActive: true,
      loginAttempts: 0,
      createdAt: new Date(),
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('   Email:', admin.email);
    console.log('   Phone:', admin.phone);
    console.log('   Temporary Password:', tempPassword);
    console.log('   ⚠️  IMPORTANT: You MUST change this password on first login!');

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
};

setupAdmin();
