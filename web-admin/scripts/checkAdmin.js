import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import User from '../lib/models/User.js';
import { verifyPassword } from '../lib/utils/password.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const checkAdmin = async () => {
  try {
    const mongoUri = process.env.MONGOURI || process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ Error: MONGOURI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    const email = '706359@gmail.com';
    const testPassword = 'TempPass@123';

    // Find admin user
    const admin = await User.findOne({ email: email.toLowerCase() });

    if (!admin) {
      console.log('❌ Admin user NOT FOUND!');
      console.log(`   Email: ${email}`);
      console.log('\n💡 Solution: Run "node scripts/setupAdmin.js" to create the admin user.\n');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log('✅ Admin user found!');
    console.log('   Email:', admin.email);
    console.log('   Name:', admin.name);
    console.log('   Role:', admin.role);
    console.log('   ID:', admin._id.toString());
    console.log('   Is Active:', admin.isActive);
    console.log('   Has Password:', !!admin.password);
    console.log('   Is Temporary Password:', admin.isTemporaryPassword);
    console.log('   Login Attempts:', admin.loginAttempts || 0);

    if (admin.lockUntil) {
      const isLocked = admin.lockUntil > Date.now();
      console.log(
        '   Lock Status:',
        isLocked ? `🔒 LOCKED until ${admin.lockUntil.toISOString()}` : '✅ Not locked'
      );
      if (isLocked) {
        const minutesLeft = Math.ceil((admin.lockUntil.getTime() - Date.now()) / 60000);
        console.log('   Minutes Left:', minutesLeft);
      }
    } else {
      console.log('   Lock Status: ✅ Not locked');
    }

    // Test password
    if (admin.password) {
      console.log('\n🔐 Testing password...');
      try {
        const isMatch = await verifyPassword(testPassword, admin.password);
        if (isMatch) {
          console.log('✅ Password "TempPass@123" is CORRECT!');
        } else {
          console.log('❌ Password "TempPass@123" is INCORRECT!');
          console.log('   The password in the database does not match "TempPass@123"');
          console.log('\n💡 Solution: Reset the admin password by running:');
          console.log('   node scripts/resetAdminPassword.js\n');
        }
      } catch (verifyError) {
        console.error('❌ Error verifying password:', verifyError.message);
      }
    } else {
      console.log('\n❌ WARNING: Admin user has NO PASSWORD set!');
      console.log('💡 Solution: Run "node scripts/setupAdmin.js" to set the password.\n');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking admin:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
};

checkAdmin();
