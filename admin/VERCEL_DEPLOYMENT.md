# Vercel Deployment Guide - Admin Dashboard

## 🚀 Quick Deploy

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd admin
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No** (first time)
   - Project name: **homiebites-admin** (or your choice)
   - Directory: **./** (current directory)
   - Override settings? **No**

5. **Set Environment Variables:**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   # Enter your backend API URL (e.g., https://your-backend.railway.app)
   
   vercel env add API_URL
   # Enter same backend API URL
   ```

6. **Redeploy with env vars:**
   ```bash
   vercel --prod
   ```

### Option 2: GitHub Integration (Best for CI/CD)

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select `admin` folder as root directory

3. **Configure:**
   - Framework Preset: **Next.js**
   - Root Directory: **admin**
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables:**
   - `NEXT_PUBLIC_API_URL` = Your backend API URL
   - `API_URL` = Your backend API URL
   - `NODE_ENV` = `production`

5. **Deploy:**
   - Click "Deploy"
   - Vercel will auto-deploy on every push to main branch

## 📋 Environment Variables

Required environment variables:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-api.com
API_URL=https://your-backend-api.com
NODE_ENV=production
```

**Important:** Replace `https://your-backend-api.com` with your actual backend API URL.

## 🔧 Configuration Files

- `vercel.json` - Vercel configuration
- `.vercelignore` - Files to exclude from deployment
- `next.config.js` - Next.js configuration (already configured)

## 🌐 Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `admin.homiebites.com`)
3. Follow DNS configuration instructions
4. Vercel will automatically provision SSL certificate

## 🔄 Auto-Deployment

Once connected to GitHub:
- Every push to `main` branch = Production deployment
- Every push to other branches = Preview deployment
- Automatic HTTPS
- Automatic rollback on errors

## 📊 Monitoring

- Vercel Dashboard shows:
  - Deployment status
  - Build logs
  - Analytics
  - Function logs
  - Performance metrics

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Check `next.config.js` for errors

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS settings on backend
- Ensure backend is accessible from internet

### PWA Not Working
- Service worker only works in production
- Ensure HTTPS is enabled (automatic on Vercel)
- Check browser console for service worker errors

## 🔐 Security Notes

- Admin dashboard requires authentication
- Never commit `.env` files
- Use Vercel environment variables for secrets
- Enable Vercel's DDoS protection (automatic)

## 📝 Next Steps

1. Deploy backend API (Railway/Render/Heroku)
2. Get backend URL
3. Set environment variables in Vercel
4. Deploy admin dashboard
5. Test authentication and API connections

## 🎯 Production Checklist

- [ ] Backend API deployed and accessible
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (optional)
- [ ] Authentication working
- [ ] API connections tested
- [ ] PWA install prompt tested
- [ ] Mobile responsiveness verified

