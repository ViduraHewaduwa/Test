# 🚀 Complete Railway Deployment Guide

## ✅ What Has Been Done

I've prepared your project for Railway deployment with the following changes:

### 1. **Server Configuration Files** ✅
- **`Server/railway.json`** - Railway build configuration
- **`Server/Procfile`** - Process file for deployment
- **`Server/.gitignore`** - Prevents uploading sensitive files
- **`Server/.env.example`** - Template for environment variables

### 2. **CORS Configuration** ✅
- Updated `Server/index.js` to accept Railway domains (*.railway.app)
- Allows mobile app to connect from anywhere

### 3. **Mobile App Configuration** ✅
- **`Client/config/api.config.ts`** - Centralized API configuration
- Updated services to use centralized config:
  - `Client/services/notificationService.ts`
  - `Client/services/documentService.ts`
  - `Client/services/lawyerService.tsx`

---

## 📋 Step-by-Step Deployment

### **Step 1: Commit Your Changes**

```powershell
cd c:\Users\User\Documents\GitHub\test\Legal-Aid-Spm-Dev
git add .
git commit -m "Prepare for Railway deployment"
git push origin Dev
```

### **Step 2: Deploy Backend to Railway**

1. **Go to Railway**
   - Visit [railway.app](https://railway.app)
   - Click "Login" → Sign in with GitHub
   - Authorize Railway

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `test` repository
   - Select the `Dev` branch

3. **Configure Root Directory**
   - Click on your service
   - Go to Settings
   - Set **Root Directory** to: `Server`
   - Railway will auto-detect Node.js

4. **Add Environment Variables**
   - Go to Variables tab
   - Click "Raw Editor" and paste:

```env
PORT=3000
NODE_ENV=production

# MongoDB - Get from MongoDB Atlas
DB_URL=mongodb+srv://your-username:your-password@cluster.mongodb.net/legal-aid?retryWrites=true&w=majority

# Gemini AI - Get from https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Cloudinary - Get from https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# JWT Secret - Generate random string
JWT_SECRET=your_super_secret_jwt_key_here
```

5. **Generate Domain**
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://legal-aid-production.up.railway.app`)

6. **Wait for Deployment**
   - Check the Deployments tab
   - Wait for "✓ SUCCESS"
   - View logs if there are errors

### **Step 3: Update Mobile App with Railway URL**

1. **Update API Config**
   - Open `Client/config/api.config.ts`
   - Change line 7:

```typescript
const PRODUCTION_URL = 'https://your-railway-url.up.railway.app'; // 👈 Paste your Railway URL here
```

   Example:
```typescript
const PRODUCTION_URL = 'https://legal-aid-production.up.railway.app';
```

2. **Test the Connection**
   - The app will automatically use Railway URL when not in dev mode
   - For testing with production URL in dev mode, temporarily change `isProduction()` to return `true`

### **Step 4: Test Your Deployment**

1. **Test Health Endpoint**
   - Open browser: `https://your-railway-url.up.railway.app/health`
   - Should see: `{"status":"OK","timestamp":"..."}`

2. **Test API Root**
   - Open: `https://your-railway-url.up.railway.app/`
   - Should see list of endpoints

3. **Test from Mobile App**
   ```powershell
   cd Client
   npm start
   ```
   - Press `a` for Android or `i` for iOS
   - Try uploading a document or any API call

---

## 🗄️ MongoDB Atlas Setup

If you don't have MongoDB Atlas set up:

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up (free tier available)

2. **Create Cluster**
   - Click "Create" → "Shared" (Free M0)
   - Choose region closest to you
   - Click "Create Cluster"

3. **Create Database User**
   - Security → Database Access
   - Add New Database User
   - Choose password authentication
   - Save username and password

4. **Configure Network Access**
   - Security → Network Access
   - Add IP Address
   - **Choose "Allow Access from Anywhere" (0.0.0.0/0)**
   - This is needed for Railway to connect

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `legal-aid`

---

## ☁️ Cloudinary Setup

Your app already uses Cloudinary for file uploads:

1. **Create Account**
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up (free tier: 25GB storage, 25GB bandwidth)

2. **Get Credentials**
   - Go to Dashboard
   - Copy:
     - Cloud Name
     - API Key
     - API Secret

3. **Add to Railway**
   - Add these to Railway environment variables

---

## 🔧 Troubleshooting

### Problem: "Cannot connect to server"
**Solution:**
- Check Railway deployment logs
- Verify environment variables are set
- Make sure MongoDB allows connections from 0.0.0.0/0

### Problem: "CORS error"
**Solution:**
- The CORS is already configured to accept Railway domains
- If you get CORS errors, check the Railway URL is correct in mobile app

### Problem: "File upload fails"
**Solution:**
- Verify Cloudinary credentials in Railway
- Check server logs for Cloudinary errors

### Problem: "MongoDB connection failed"
**Solution:**
- Verify `DB_URL` is correct in Railway
- Check MongoDB Atlas network access (must allow 0.0.0.0/0)
- Test connection string locally first

---

## 📱 Building Mobile App for Production

### For Android:

```powershell
cd Client

# Create release build
npx expo build:android --release-channel production

# Or for local APK
npx expo export:android
```

### For iOS:

```powershell
cd Client

# Create release build
npx expo build:ios --release-channel production
```

---

## 💰 Railway Pricing

**Free Tier:**
- $5 credit per month
- Perfect for testing
- Sleeps after inactivity

**Hobby Plan: $5/month**
- $5 credit + $0.20/GB additional
- No sleep
- Better for production

**Estimate for your app:**
- Small usage: Free tier is enough
- Medium usage (100-1000 users): $5-10/month

---

## 🎯 Post-Deployment Checklist

- [ ] Backend deployed to Railway ✅
- [ ] Railway domain generated
- [ ] Environment variables added (MongoDB, Gemini, Cloudinary)
- [ ] MongoDB Atlas network access configured (0.0.0.0/0)
- [ ] Health endpoint tested: `/health`
- [ ] API root tested: `/`
- [ ] Mobile app `api.config.ts` updated with Railway URL
- [ ] Mobile app tested with Railway backend
- [ ] File upload tested (Cloudinary)
- [ ] AI document explanation tested (Gemini)
- [ ] Notifications working

---

## 🔒 Security Considerations

### For Production:

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong JWT secret (32+ characters)
   - Rotate API keys regularly

2. **CORS**
   - For strict security, update CORS to only allow your mobile app domains
   - Change `callback(null, true)` to `callback(new Error('Not allowed'), false)` for unknown origins

3. **MongoDB**
   - Use separate databases for dev/production
   - Enable MongoDB Atlas backup
   - Consider IP whitelist instead of 0.0.0.0/0 (requires Railway static IP)

4. **Rate Limiting**
   - Consider adding rate limiting to prevent abuse
   - Railway has built-in DDoS protection

---

## 📚 Additional Resources

- **Railway Docs:** [docs.railway.app](https://docs.railway.app)
- **MongoDB Atlas Docs:** [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Expo Deployment:** [docs.expo.dev/distribution](https://docs.expo.dev/distribution)
- **Cloudinary Docs:** [cloudinary.com/documentation](https://cloudinary.com/documentation)

---

## 🆘 Need Help?

### Check Railway Logs:
```
Railway Dashboard → Your Service → Deployments → Latest → View Logs
```

### Common Log Errors:

**"Cannot find module"**
- Make sure all dependencies are in `package.json`
- Railway runs `npm install` automatically

**"Port already in use"**
- Railway assigns port automatically via `process.env.PORT`
- Your code already handles this ✅

**"MongoDB connection timeout"**
- Check MongoDB Atlas is running
- Verify network access settings
- Test connection string locally

---

## 🎉 Success!

Once deployed:
- Your backend is live 24/7 on Railway
- Mobile app connects automatically
- File uploads go to Cloudinary
- AI features use Gemini
- No manual server management needed!

**Your Railway URL will be:**
```
https://legal-aid-production.up.railway.app
```

Update this in `Client/config/api.config.ts` and you're done! 🚀
