# Admin Password Recovery Guide

## Current Admin Credentials

### Fallback Credentials (Hardcoded)

- **Username**: `adminHomieBites`
- **Password**: `Bless@@##12$$`

These credentials work as a fallback if the API is unavailable.

### API-Based Admin Account

If you've created an admin account through the backend API, use those credentials instead.

## If You Forget Your Password

### Option 1: Use Fallback Credentials (Quick Access)

1. Go to `/admin` login page
2. Use fallback credentials:
   - Username: `adminHomieBites`
   - Password: `Bless@@##12$$`
3. Once logged in, you can change your password through the backend

### Option 2: Reset via Backend (Recommended for Production)

#### Step 1: Access MongoDB Database

Connect to your MongoDB database:

```
MongoDB Server: sql.infodatixhosting.com:27017
Database: HomieBites
Collection: users
```

#### Step 2: Find Admin User

Query the users collection to find admin account:

```javascript
db.users.find({ role: 'admin' });
```

#### Step 3: Reset Password

Update the admin user's password (password will be hashed automatically on next login):

```javascript
// Option A: Update existing admin user
db.users.updateOne({ role: 'admin' }, { $set: { password: 'YourNewPassword123!' } });

// Option B: Create new admin user if none exists
db.users.insertOne({
  name: 'Admin',
  email: 'admin@homiebites.com',
  phone: '9999999999',
  password: 'YourNewPassword123!',
  role: 'admin',
  addresses: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

**Note**: The password will be automatically hashed by bcrypt when you log in next time.

#### Step 4: Login with New Password

1. Go to `/admin` login page
2. Use the email and new password you just set

### Option 3: Create Admin Account via Backend API

If you have backend access, create a new admin account:

```bash
POST /api/auth/register
{
  "name": "Admin",
  "email": "admin@homiebites.com",
  "phone": "9999999999",
  "password": "YourSecurePassword123!"
}
```

Then update the role to admin in MongoDB:

```javascript
db.users.updateOne({ email: 'admin@homiebites.com' }, { $set: { role: 'admin' } });
```

### Option 4: Direct Database Script (For Developers)

Create a script to reset admin password:

```javascript
// reset-admin-password.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI);

    const newPassword = 'YourNewPassword123!';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update or create admin user
    const admin = await User.findOneAndUpdate(
      { role: 'admin' },
      {
        password: hashedPassword,
        email: 'admin@homiebites.com',
        name: 'Admin',
        phone: '9999999999',
      },
      { upsert: true, new: true }
    );

    console.log('Admin password reset successfully!');
    console.log('Email:', admin.email);
    console.log('New Password:', newPassword);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error resetting password:', error);
  }
};

resetAdminPassword();
```

Run the script:

```bash
node reset-admin-password.js
```

## Security Recommendations

1. **Change Default Password**: After first login, change the fallback password
2. **Use Strong Passwords**: Minimum 12 characters with mix of letters, numbers, symbols
3. **Store Credentials Securely**: Keep admin credentials in a password manager
4. **Enable 2FA** (Future): Consider adding two-factor authentication
5. **Regular Updates**: Change password every 90 days

## Emergency Access

If all else fails, you can:

1. Use the fallback credentials: `adminHomieBites` / `Bless@@##12$$`
2. Access the admin dashboard
3. Note: This is a temporary solution - reset via backend for production

## Contact Support

If you need help resetting your admin password, contact your development team with:

- Your admin email
- Proof of ownership (domain access, hosting access, etc.)
