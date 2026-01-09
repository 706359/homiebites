# 🚀 Deploy Admin Dashboard to Vercel - Quick Guide

## Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

## Step 2: Login
```bash
vercel login
```
(Opens browser for authentication)

## Step 3: Navigate to Admin Folder
```bash
cd admin
```

## Step 4: Deploy
```bash
vercel
```

**Follow the prompts:**
- ✅ Set up and deploy? → **Yes**
- ✅ Which scope? → **Your account**
- ✅ Link to existing project? → **No** (first time)
- ✅ Project name → **homiebites-admin** (or your choice)
- ✅ Directory → **./** (current directory)
- ✅ Override settings? → **No**

## Step 5: Set Environment Variables

After first deployment, set your backend API URL:

```bash
# Set production environment variable
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://your-backend-api.com

vercel env add API_URL production
# Enter: https://your-backend-api.com
```

## Step 6: Deploy to Production

```bash
vercel --prod
```

## ✅ Success!

Your admin dashboard will be live at:
**https://homiebites-admin.vercel.app**

(Or your custom domain if configured)

## 📱 Mobile Access

1. Open mobile browser
2. Go to: `https://homiebites-admin.vercel.app`
3. Login
4. Add to Home Screen (iOS: Share → Add to Home Screen | Android: Menu → Install app)

## 🔧 Troubleshooting

### Build Fails?
- Check Vercel dashboard → Deployments → View logs
- Ensure all dependencies are in `package.json`
- Verify `next.config.js` is correct

### API Not Connecting?
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend CORS settings
- Ensure backend is accessible from internet

### Need Help?
- Vercel Dashboard: https://vercel.com/dashboard
- Check deployment logs in Vercel dashboard
- See `VERCEL_DEPLOYMENT.md` for detailed guide

