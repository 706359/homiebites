# Vercel Deployment Troubleshooting

## Common Issues & Solutions

### Issue: DEPLOYMENT_NOT_FOUND (404 Error)

**Possible Causes:**
1. Build failed during deployment
2. Wrong project configuration
3. PWA plugin conflicts
4. Missing dependencies

**Solutions:**

#### 1. Check Build Logs
- Go to Vercel Dashboard → Your Project → Deployments
- Click on the failed deployment
- Check "Build Logs" tab
- Look for specific error messages

#### 2. Test Build Locally First
```bash
cd admin
npm run build
```
If local build fails, fix errors before deploying.

#### 3. Simplify Configuration
- Temporarily disable PWA (already done in next.config.js)
- Remove complex vercel.json settings
- Use Vercel's auto-detection

#### 4. Check Environment Variables
- Ensure `NEXT_PUBLIC_API_URL` is set
- Check Vercel Dashboard → Settings → Environment Variables
- Verify all required vars are present

#### 5. Clear Vercel Cache
```bash
vercel --force
```

#### 6. Try Fresh Deployment
```bash
# Remove .vercel folder if exists
rm -rf .vercel

# Deploy fresh
vercel
```

### Issue: Build Succeeds but 404 on Pages

**Solution:**
- Check `next.config.js` output mode
- Ensure routes are properly configured
- Verify `app/` directory structure

### Issue: PWA Not Working

**Solution:**
- PWA is currently disabled for initial deployment
- Can be enabled after successful deployment
- Change `disable: true` to `disable: false` in next.config.js

## Quick Fix Checklist

- [ ] Local build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] All dependencies in package.json
- [ ] Environment variables set in Vercel
- [ ] vercel.json is minimal (or removed)
- [ ] PWA temporarily disabled
- [ ] No import.meta.env usage (Next.js doesn't support)

## Alternative: Deploy Without PWA First

1. Keep PWA disabled (`disable: true`)
2. Deploy successfully
3. Test all functionality
4. Enable PWA later if needed

## Still Having Issues?

1. Check Vercel Dashboard logs
2. Compare with working Next.js examples
3. Try deploying minimal version first
4. Contact Vercel support with deployment logs

