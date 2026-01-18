# Deployment Guide: admin.homiebites.com

## ✅ Yes, you can deploy to admin.homiebites.com!

This Next.js admin dashboard can be deployed to the `admin.homiebites.com` subdomain.

## Deployment Options

### Option 1: Vercel (Recommended - Easiest for Next.js)

**Steps:**

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   Follow the prompts to link your project.

4. **Add Custom Domain:**
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add `admin.homiebites.com`
   - Vercel will provide DNS instructions

5. **Configure DNS:**
   - Add CNAME record: `admin` → `cname.vercel-dns.com`
   - Or use A record if provided by Vercel

6. **Environment Variables:**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add all variables from `.env` file:
     - `NEXT_PUBLIC_API_URL` (your backend API URL)
     - `API_URL` (if needed)
     - Any other required variables

**Advantages:**
- ✅ Automatic HTTPS/SSL
- ✅ Global CDN
- ✅ Automatic deployments from Git
- ✅ Zero configuration needed
- ✅ Free tier available

---

### Option 2: Custom Server (VPS/Dedicated Server)

**Steps:**

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the server:**
   ```bash
   npm start
   ```
   (Runs on port 5050 by default)

3. **Configure Nginx (Reverse Proxy):**

   Create `/etc/nginx/sites-available/admin.homiebites.com`:
   ```nginx
   server {
       listen 80;
       server_name admin.homiebites.com;

       location / {
           proxy_pass http://localhost:5050;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable the site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/admin.homiebites.com /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **Setup SSL with Let's Encrypt:**
   ```bash
   sudo certbot --nginx -d admin.homiebites.com
   ```

6. **Configure DNS:**
   - Add A record: `admin` → Your server IP address

7. **Setup PM2 (Process Manager):**
   ```bash
   npm install -g pm2
   pm2 start npm --name "admin-dashboard" -- start
   pm2 save
   pm2 startup
   ```

---

### Option 3: Docker Deployment

**Create Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 5050
ENV PORT 5050

CMD ["node", "server.js"]
```

**Deploy:**
```bash
docker build -t admin-dashboard .
docker run -d -p 5050:5050 --name admin-dashboard admin-dashboard
```

---

## Environment Variables Required

Make sure these are set in your deployment environment:

```env
NEXT_PUBLIC_API_URL=https://api.homiebites.com
# or
NEXT_PUBLIC_API_URL=https://homiebites.com/api
```

Update `lib/api-admin.js` if your API is on a different domain.

---

## Current Configuration

- **Framework:** Next.js 16.1.1
- **Port:** 5050
- **Build:** `npm run build`
- **Start:** `npm start`
- **Output:** Standalone (ready for deployment)

---

## Quick Start (Vercel)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Add domain in Vercel dashboard
# 4. Configure DNS
# 5. Done! 🎉
```

---

## Notes

- The app is already configured for production builds
- All routes under `/admin/*` are protected
- Make sure your backend API is accessible from the deployment domain
- Update API URLs in environment variables if needed
