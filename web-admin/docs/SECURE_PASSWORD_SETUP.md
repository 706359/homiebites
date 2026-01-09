# Secure Admin Password Setup Guide

## 🔒 Security Best Practices

This guide explains how to securely configure admin passwords using bcrypt hashing.

## Why Use Password Hashing?

- **Security**: Passwords are never stored in plain text
- **One-way encryption**: Even if someone accesses your environment variables, they cannot recover the original password
- **Industry standard**: bcrypt is the industry standard for password hashing

## Setup Instructions

### Step 1: Generate Password Hash

Run the hash generation script:

```bash
node scripts/generate-admin-hash.js
```

Or specify a custom password:

```bash
node scripts/generate-admin-hash.js "YourPasswordHere"
```

### Step 2: Update Environment Variables

Add the generated hash to your `.env` file:

```env
ADMIN_PASSWORD_HASH=$2a$12$...your_generated_hash_here...
```

### Step 3: Remove Plain Text Password (Recommended)

After setting `ADMIN_PASSWORD_HASH`, remove or comment out the plain text password:

```env
# Remove this line after setting ADMIN_PASSWORD_HASH
# ADMIN_PASSWORD=Bless@@!!##12
```

## Environment Variables

### Secure Method (Recommended)

```env
ADMIN_PASSWORD_HASH=$2a$12$...bcrypt_hash_here...
```

### Legacy Method (Not Recommended)

```env
ADMIN_PASSWORD=plain_text_password
```

**Note**: The system supports both methods for migration purposes, but using `ADMIN_PASSWORD_HASH` is strongly recommended for production.

## Login Credentials

After setup, you can login with:

- **Username/Email**: `706359@gmail.com` OR `8958111112` OR `adminHomieBites`
- **Password**: `Bless@@!!##12` (or your custom password)

The system will automatically:
- Use bcrypt comparison if `ADMIN_PASSWORD_HASH` is set
- Fall back to plain text comparison if only `ADMIN_PASSWORD` is set

## Security Checklist

- [ ] Generate password hash using the script
- [ ] Set `ADMIN_PASSWORD_HASH` in `.env` file
- [ ] Remove or comment out `ADMIN_PASSWORD` from `.env`
- [ ] Ensure `.env` is in `.gitignore` (never commit it)
- [ ] Use strong, unique passwords
- [ ] Rotate passwords periodically
- [ ] Keep `.env` file secure and backed up

## Troubleshooting

### Password Not Working?

1. **Check hash format**: Ensure `ADMIN_PASSWORD_HASH` starts with `$2a$`, `$2b$`, or `$2y$`
2. **Verify password**: Make sure you're using the same password that was hashed
3. **Check environment**: Ensure your `.env` file is loaded correctly
4. **Development mode**: Check console logs for debug information

### Migration from Plain Text

If you're currently using `ADMIN_PASSWORD`:

1. Generate hash: `node scripts/generate-admin-hash.js`
2. Add `ADMIN_PASSWORD_HASH` to `.env`
3. Test login
4. Remove `ADMIN_PASSWORD` from `.env`

## Technical Details

- **Algorithm**: bcrypt
- **Salt Rounds**: 12 (good balance of security and performance)
- **Hash Format**: `$2a$12$...` (60 characters)
- **Comparison**: Uses `bcrypt.compare()` for secure constant-time comparison

## Additional Security Recommendations

1. **Use Environment-Specific Files**:
   - `.env.development` for development
   - `.env.production` for production
   - Never share production credentials

2. **Secret Management**:
   - Consider using secret management services (AWS Secrets Manager, HashiCorp Vault, etc.) for production
   - Use different passwords for different environments

3. **Regular Updates**:
   - Rotate passwords every 90 days
   - Update immediately if compromised
   - Use password managers to generate strong passwords

4. **Access Control**:
   - Limit who has access to `.env` files
   - Use file permissions (chmod 600) on production servers
   - Monitor access logs
