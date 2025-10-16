# 🚀 Quick Start - Railway Deployment

Get your Legal Bridge app deployed to Railway and running on mobile in under 30 minutes!

---

## ⚡ Prerequisites (5 minutes)

Sign up for these free accounts:

1. **Railway** → [railway.app](https://railway.app) (sign up with GitHub)
2. **MongoDB Atlas** → [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
3. **Google AI Studio** → [makersuite.google.com](https://makersuite.google.com/app/apikey)
4. **GitHub** (if you don't have an account already)

---

## 📦 Step 1: Prepare MongoDB (5 minutes)

1. **Create a free cluster on MongoDB Atlas**
2. **Create database user:**
   - Username: `legalbridge`
   - Password: `[generate a strong password]`
3. **Whitelist all IPs:**
   - Go to Network Access → Add IP → Allow Access From Anywhere (0.0.0.0/0)
4. **Get connection string:**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `myFirstDatabase` with `legalbridge`

---

## 🔑 Step 2: Get API Keys (3 minutes)

1. **Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Click "Create API Key"
   - Copy the key

2. **JWT Secret:**
   - Generate a random string (32+ characters)
   - You can use: [passwordsgenerator.net](https://passwordsgenerator.net/)

---

## 🚂 Step 3: Deploy to Railway (10 minutes)

### Push to GitHub

```powershell
cd Server
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/legalbridge-backend.git
git push -u origin main
```

### Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Click on the service → "Settings"
5. Set **Root Directory** to: `Server`
6. Go to "Variables" tab and add:

```
DB_URL=mongodb+srv://legalbridge:YOUR_PASSWORD@cluster.mongodb.net/legalbridge?retryWrites=true&w=majority
PORT=3000
NODE_ENV=production
JWT_SECRET=your_random_32_character_string_here
GEMINI_API_KEY=your_gemini_api_key_here
```

7. Go to "Settings" → "Networking" → "Generate Domain"
8. **Copy your Railway URL!** (e.g., `https://legalbridge-production.up.railway.app`)

---

## 📱 Step 4: Configure Mobile App (5 minutes)

### Update API Configuration

1. Open `Client/config/api.ts`

2. Replace the PRODUCTION_API_URL:

```typescript
const PRODUCTION_API_URL = 'https://your-actual-railway-url.up.railway.app';
```

3. Save the file

### Test on Your Phone

```powershell
cd Client
npm install
npm start
```

- Scan the QR code with Expo Go app
- Your app should now work with Railway backend!

---

## ✅ Verification (2 minutes)

### Test Backend

Open in browser:
```
https://your-railway-url.up.railway.app/health
```

Should return:
```json
{
  "status": "OK",
  "mongodb": "connected",
  "geminiApiKey": "configured"
}
```

### Test Mobile App

1. Open app in Expo Go
2. Try logging in
3. Check if data loads correctly
4. Test document upload
5. Try the chatbot feature

---

## 🎉 Done!

Your app is now:
- ✅ Deployed to Railway
- ✅ Connected to cloud MongoDB
- ✅ Accessible from your mobile phone
- ✅ Using Gemini AI

---

## 🆘 Troubleshooting

### Backend won't deploy?
- Check Railway logs for errors
- Verify all environment variables are set
- Make sure Root Directory is set to `Server`

### Can't connect from mobile?
- Verify Railway URL in `Client/config/api.ts`
- Test Railway URL in browser first
- Restart Expo dev server: `npm start -- --clear`

### MongoDB connection failed?
- Check connection string is correct
- Verify password has no special characters (or URL-encode them)
- Ensure IP 0.0.0.0/0 is whitelisted

---

## 📚 Full Documentation

- **Complete Deployment Guide:** [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md)
- **Mobile Configuration:** [MOBILE_CONFIGURATION_GUIDE.md](./MOBILE_CONFIGURATION_GUIDE.md)

---

## 🎯 What's Next?

- [ ] Set up Cloudinary for permanent file storage
- [ ] Configure custom domain
- [ ] Set up CI/CD for automatic deployments
- [ ] Add error monitoring (e.g., Sentry)
- [ ] Build production APK/IPA
- [ ] Submit to app stores

---

**Total Time:** ~30 minutes
**Cost:** $0 (using free tiers) 💰

Happy deploying! 🚀
