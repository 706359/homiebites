# Admin Account Verification Setup Guide

This guide explains how to set up admin accounts with verification details (Admin ID, PAN Card, Mobile, Email) for secure password recovery.

## Overview

Admin accounts require additional verification information for password recovery:

- **Admin ID**: Unique identifier for the admin account
- **PAN Card**: Hashed and stored securely (never stored in plain text)
- **Mobile Number**: Already stored in user profile
- **Email**: Already stored in user profile

## Security Features

1. **PAN Card Hashing**: PAN card numbers are hashed using bcrypt (same as passwords) before storage
2. **Multi-Step Verification**: Password recovery requires:
   - Email verification
   - Mobile OTP verification
   - Admin ID + PAN card verification
   - New password reset
3. **Token-Based Recovery**: Time-limited tokens for each verification step
4. **Rate Limiting**: OTP attempts limited to prevent brute force attacks

## Setting Up Admin Account with Verification

### Option 1: Via MongoDB (Recommended for Initial Setup)

1. **Connect to MongoDB**:

   ```bash
   MongoDB Server: sql.infodatixhosting.com:27017
   Database: HomieBites
   Collection: users
   ```

2. **Create/Update Admin Account**:

   ```javascript
   // Create new admin account with verification details
   db.users.insertOne({
     name: 'Admin',
     email: 'admin@homiebites.com',
     phone: '9999999999',
     password: 'YourSecurePassword123!',
     role: 'admin',
     adminId: 'ADMIN001', // Unique admin identifier
     panCardHash: 'ABCDE1234F', // Will be auto-hashed on save
     addresses: [],
     createdAt: new Date(),
     updatedAt: new Date(),
   });
   ```

   **Note**: The `panCardHash` field will be automatically hashed by the User model's pre-save hook. However, for initial setup, you can set it directly and it will be hashed.

3. **Update Existing Admin Account**:
   ```javascript
   db.users.updateOne(
     { email: 'admin@homiebites.com', role: 'admin' },
     {
       $set: {
         adminId: 'ADMIN001',
         panCardHash: 'ABCDE1234F', // Will be hashed on next save
       },
     }
   );
   ```

### Option 2: Via Backend API (After Initial Setup)

Create a script or use Postman/curl to register an admin:

```bash
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "name": "Admin",
  "email": "admin@homiebites.com",
  "phone": "9999999999",
  "password": "YourSecurePassword123!"
}
```

Then update the role and verification details in MongoDB:

```javascript
db.users.updateOne(
  { email: 'admin@homiebites.com' },
  {
    $set: {
      role: 'admin',
      adminId: 'ADMIN001',
      panCardHash: 'ABCDE1234F',
    },
  }
);
```

### Option 3: Using Setup Script

Create a setup script `backend/Raavito/HomieBites/scripts/setup-admin.js`:

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../../.env') });

async function setupAdmin() {
  try {
    await mongoose.connect(process.env.MONGOURI);

    const adminEmail = 'admin@homiebites.com';
    const adminPassword = 'YourSecurePassword123!';
    const adminId = 'ADMIN001';
    const panCard = 'ABCDE1234F'; // Will be hashed automatically

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Hash PAN card
    const hashedPan = await bcrypt.hash(panCard.toUpperCase(), 10);

    // Create or update admin
    const admin = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: 'Admin',
        email: adminEmail,
        phone: '9999999999',
        password: hashedPassword,
        role: 'admin',
        adminId: adminId,
        panCardHash: hashedPan,
      },
      { upsert: true, new: true }
    );

    console.log('✅ Admin account setup successfully!');
    console.log('Email:', admin.email);
    console.log('Admin ID:', admin.adminId);
    console.log('Password:', adminPassword);
    console.log('PAN Card:', panCard);
    console.log('\n⚠️  Save these credentials securely!');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error setting up admin:', error);
    process.exit(1);
  }
}

setupAdmin();
```

Run the script:

```bash
node backend/Raavito/HomieBites/scripts/setup-admin.js
```

## Password Recovery Flow

### Step 1: Request Password Reset

- Admin enters their email address
- System sends OTP to registered mobile number
- In development mode, OTP is also displayed in console/alert

### Step 2: Verify OTP

- Admin enters the 6-digit OTP received via SMS
- OTP expires after 10 minutes
- Maximum 3 attempts allowed

### Step 3: Verify Identity

- Admin enters:
  - **Admin ID**: The unique identifier set during account creation
  - **PAN Card**: The PAN card number (format: ABCDE1234F)
- System verifies both against stored hashed values

### Step 4: Reset Password

- Admin enters new password (minimum 6 characters)
- Confirms new password
- Password is reset and admin can login

## Important Notes

### PAN Card Format

- Must be exactly 10 characters
- Format: `ABCDE1234F` (5 letters + 4 digits + 1 letter)
- Stored in uppercase
- Automatically validated on input

### Admin ID

- Can be any string (alphanumeric recommended)
- Should be unique per admin account
- Used for verification purposes only
- Examples: `ADMIN001`, `ADMIN-JOHN`, `HB-ADMIN-001`

### Security Best Practices

1. **Never Store Plain Text PAN Cards**: Always use the hashed version
2. **Use Strong Admin IDs**: Don't use easily guessable values
3. **Keep Verification Details Secure**: Store Admin ID and PAN card securely (password manager)
4. **Regular Updates**: Update PAN card hash if PAN card changes
5. **Monitor Access**: Log all password recovery attempts

### Updating Verification Details

To update Admin ID or PAN card for an existing admin:

```javascript
// Update Admin ID
db.users.updateOne(
  { email: 'admin@homiebites.com', role: 'admin' },
  { $set: { adminId: 'NEW_ADMIN_ID' } }
);

// Update PAN Card (will be auto-hashed)
db.users.updateOne(
  { email: 'admin@homiebites.com', role: 'admin' },
  { $set: { panCardHash: 'NEWPAN1234F' } }
);
```

**Note**: When updating `panCardHash`, the User model will automatically hash it if it's not already hashed (doesn't start with `$2`).

## Troubleshooting

### OTP Not Received

- Check mobile number in database matches current number
- In development, check console for OTP
- Verify OTP hasn't expired (10-minute window)
- Check OTP attempts haven't exceeded limit (3 attempts)

### PAN Card Verification Fails

- Ensure PAN card is entered in correct format: `ABCDE1234F`
- Check PAN card is stored correctly in database (should be hashed)
- Verify Admin ID matches exactly (case-sensitive)

### Password Reset Token Expired

- Reset tokens expire after 1 hour
- Start recovery process again from Step 1

## Production Considerations

### SMS/Email Integration

Currently, OTP is displayed in development mode. For production:

1. **Integrate SMS Service** (e.g., Twilio, AWS SNS):
   - Update `/api/auth/forgot-password` route
   - Send OTP via SMS to user's mobile number
   - Remove development OTP display

2. **Email Notifications**:
   - Send email confirmation when password is reset
   - Notify admin of password recovery attempts

### Rate Limiting

Consider adding:

- IP-based rate limiting for password recovery requests
- Account lockout after multiple failed attempts
- CAPTCHA for additional security

### Monitoring

- Log all password recovery attempts
- Alert on suspicious activity (multiple failed attempts)
- Track successful password resets

## Support

For issues or questions:

1. Check this documentation
2. Review `docs/ADMIN_PASSWORD_RECOVERY.md` for recovery options
3. Contact development team with:
   - Admin email
   - Issue description
   - Error messages (if any)
