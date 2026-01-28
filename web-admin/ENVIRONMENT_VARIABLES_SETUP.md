# 🔐 Environment Variables Setup Guide

**Important:** These variables are CRITICAL for production security.

---

## Required Variables for Production

### 1. JWT_SECRET (CRITICAL)

**Purpose:** Signs authentication tokens

**How to Generate:**

```bash
# Option 1: Using Node.js (Recommended)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Option 3: Using Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

**Example Output:**

```
a3f8e9d2c1b4f7a6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3
```

**Setting in Vercel:**

1. Go to: Project Settings → Environment Variables
2. Add:
   - **Name:** `JWT_SECRET`
   - **Value:** (paste generated string)
   - **Environments:** Production, Preview, Development
3. Click "Save"

### 2. REQUEST_SIGNING_SECRET (CRITICAL)

**Purpose:** Signs sensitive API requests

**How to Generate:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Setting in Vercel:**

1. Go to: Project Settings → Environment Variables
2. Add:
   - **Name:** `REQUEST_SIGNING_SECRET`
   - **Value:** (paste generated string)
   - **Environments:** Production, Preview, Development
3. Click "Save"

---

## Optional but Recommended Variables

### 3. ALLOWED_ORIGINS

**Purpose:** Restrict API calls to approved domains (CORS)

```
https://homiebites.com,https://www.homiebites.com
```

### 4. ADMIN_EMAIL

**Purpose:** Admin account email

```
admin@homiebites.com
```

### 5. ADMIN_ID

**Purpose:** Admin identification for password reset verification

```
<unique-admin-identifier>
```

### 6. ADMIN_PAN_CARD

**Purpose:** PAN card for admin verification

```
XXXXX1234A
```

### 7. FRONTEND_URL

**Purpose:** URL for password reset email links

```
https://homiebites.com
```

---

## Environment Variable Checklist

### Before Deployment

- [ ] Generate `JWT_SECRET` (32+ characters, random)
- [ ] Generate `REQUEST_SIGNING_SECRET` (32+ characters, random)
- [ ] Add both to Vercel Environment Variables
- [ ] Set for Production environment
- [ ] Verify no typos
- [ ] Do NOT share these values in chat/email/git

### After Deployment

- [ ] Verify no errors in Vercel deployment logs
- [ ] Test login functionality
- [ ] Check browser console for JWT errors
- [ ] Verify secure cookies set (DevTools → Application → Cookies)

---

## Security Best Practices

✅ **DO:**

- Store in environment variables only (never in code)
- Use unique, randomly generated secrets
- Keep secrets in .env.local (never in git)
- Rotate secrets every 90 days
- Document where secrets are stored

❌ **DON'T:**

- Share secrets in Slack/email/chat
- Commit .env files to Git
- Use weak/predictable secrets
- Use same secret for multiple services
- Expose secrets in browser console

---

## Local Development Setup

### Create .env.local

```bash
# In project root
touch .env.local
```

### Add Variables

```env
# Authentication
JWT_SECRET=<generated-secret-from-above>
REQUEST_SIGNING_SECRET=<generated-secret-from-above>

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5050
API_URL=http://localhost:5050

# Database (if needed)
MONGODB_URI=mongodb://localhost:27017/homiebites

# Email (optional)
ADMIN_EMAIL=admin@homiebites.com

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5050
```

### Load Variables

Next.js automatically loads `.env.local` when running:

```bash
npm run dev
```

---

## Troubleshooting

### Error: "JWT_SECRET not configured"

**Cause:** Environment variable not set in production

**Solution:**

1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Add `JWT_SECRET` with generated value
4. Redeploy project

### Error: "Invalid or expired token"

**Cause:**

- Token signature mismatch (different JWT_SECRET)
- Token actually expired (24 hour limit)

**Solution:**

1. Clear browser cookies
2. Log in again
3. Check JWT_SECRET matches in all environments

### Cookies Not Appearing in Browser

**Cause:**

- Development environment (HTTP not HTTPS)
- Cookies blocked by browser settings

**Solution:**

1. Use production domain (HTTPS)
2. Check browser → Settings → Cookies
3. Allow third-party cookies from homiebites.com

---

## Vercel Environment Variables UI

### Step-by-Step Guide

1. **Go to Project:**

   ```
   https://vercel.com/dashboard/projects
   ```

2. **Select HomieBites Project**

3. **Open Settings:**
   - Click: Settings → Environment Variables

4. **Add JWT_SECRET:**
   - Name: `JWT_SECRET`
   - Value: (paste generated string)
   - Environments: All (Production, Preview, Development)
   - Click "Save"

5. **Add REQUEST_SIGNING_SECRET:**
   - Name: `REQUEST_SIGNING_SECRET`
   - Value: (paste generated string)
   - Environments: All
   - Click "Save"

6. **Redeploy Project:**
   - Go to Deployments
   - Click "Redeploy" on latest deployment
   - Wait for build to complete

---

## Checking Variables in Deployed App

### From Browser Console

```javascript
// Check if secrets are loaded (should NOT show values)
console.log(process.env.JWT_SECRET); // Should be undefined (not exposed to client)
```

### From Vercel Logs

1. Go to Vercel Dashboard
2. Select project
3. Click "Deployments"
4. Click latest deployment
5. Click "View Build Logs"
6. Search for error messages

---

## Secret Rotation Schedule

**Every 90 days:**

1. Generate new `JWT_SECRET`
2. Update in Vercel Environment Variables
3. Existing sessions will be invalidated (24h expiry)
4. Users will need to log in again
5. Previous secret can be removed after 48 hours

---

## Emergency: Exposed Secret

**If a secret is exposed:**

1. **IMMEDIATELY:**
   - Go to Vercel
   - Update environment variable with new random string
   - Trigger redeploy

2. **Within 1 Hour:**
   - Force logout all users
   - Notify admin users to log in again
   - Monitor for suspicious activity

3. **Document:**
   - Log incident date/time
   - Record which secret was exposed
   - Keep for audit trail

---

## Testing Variables Are Loaded

```bash
# Add to app/api/test/env/route.js (remove after testing)

export async function GET(request) {
  return Response.json({
    hasJWTSecret: !!process.env.JWT_SECRET,
    hasRequestSigningSecret: !!process.env.REQUEST_SIGNING_SECRET,
    environment: process.env.NODE_ENV,
    // NEVER return actual values
  });
}
```

Then test: `curl https://homiebites.com/api/test/env`

---

## Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Node.js Crypto Module](https://nodejs.org/api/crypto.html)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**⚠️ IMPORTANT:** Without proper environment variables set, the admin dashboard security will NOT be fully effective. Ensure all steps are completed before going live.

Generated: January 28, 2026
