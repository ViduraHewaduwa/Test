# Backend Connection Issue - Quick Fix Guide

## Current Error
```
Network Error: Unable to connect to server at https://test-production-f7c7.up.railway.app/api
```

## The Problem
Your app is trying to connect to Railway but getting a network error. This happens when:
1. ❌ Railway backend is not deployed
2. ❌ Railway backend is sleeping (on free tier)
3. ❌ Railway URL has changed
4. ❌ CORS is not configured

---

## 🔴 IMMEDIATE ACTION REQUIRED

### Step 1: Check if Railway Backend is Running

Open this URL in your browser:
```
https://test-production-f7c7.up.railway.app/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-17T...",
  "uptime": 123.45
}
```

**If you get an error or can't connect:**
- Your Railway backend is NOT running
- You need to deploy it first

---

## 🚀 SOLUTION 1: Deploy Backend to Railway

### Option A: Using Railway Dashboard

1. Go to https://railway.app/dashboard
2. Login to your account
3. Click on your project (or create new)
4. Click "New" → "GitHub Repo"
5. Select your repository: `ViduraHewaduwa/Test`
6. Set **Root Directory** to: `Server`
7. Railway will auto-detect Node.js and deploy

### Option B: Using Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
cd Server
railway link

# Deploy
railway up
```

### Option C: Manual Deploy via Git

```bash
# From your Server directory
cd Server

# Commit changes
git add .
git commit -m "Deploy backend"
git push origin main

# Railway will auto-deploy if connected to GitHub
```

---

## 🔧 SOLUTION 2: Configure Environment Variables on Railway

After deploying, set these variables in Railway Dashboard:

### Required Variables:
```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_connection_string
PORT=3000
NODE_ENV=production
```

### To Add Variables:
1. Go to Railway Dashboard
2. Select your project
3. Click on your service
4. Go to **Variables** tab
5. Click **+ New Variable**
6. Add each variable

---

## 🔧 SOLUTION 3: Use Local Backend (Temporary)

If Railway is not working, use localhost temporarily:

### Start Local Backend:
```bash
cd Server
npm install
npm start
```

### Update Client to Use Localhost:

Edit `Client/config/api.ts`:
```typescript
// Change from:
const API_URL = PRODUCTION_API_URL;

// To:
const API_URL = DEVELOPMENT_API_URL;
```

---

## 🔧 SOLUTION 4: Fix CORS (If Backend is Running)

If Railway backend IS running but still getting errors:

### Add CORS to Server

Edit `Server/index.js`:
```javascript
const cors = require('cors');

// Allow all origins (for development)
app.use(cors());

// OR allow specific origins (for production)
app.use(cors({
  origin: [
    'http://localhost:8081',
    'http://localhost:19006',
    'exp://192.168.1.100:8081',
    '*' // Allow all (not recommended for production)
  ],
  credentials: true
}));
```

Install CORS if not installed:
```bash
cd Server
npm install cors
```

---

## 🔍 Diagnostic Steps

### Test 1: Check Railway Deployment Status
```bash
# Visit Railway Dashboard
https://railway.app/dashboard

# Check:
- Is service "Active" (green)?
- Are there any deployment errors?
- What's the latest deployment date?
```

### Test 2: Test Health Endpoint
Open browser and visit:
```
https://test-production-f7c7.up.railway.app/health
```

### Test 3: Test Document Endpoint
Use this curl command:
```bash
curl https://test-production-f7c7.up.railway.app/api/documents/explain
```

Expected: 
- Should get "Document file is required" error
- This means endpoint exists

### Test 4: Check Railway Logs
1. Go to Railway Dashboard
2. Click your service
3. View **Logs** tab
4. Look for startup errors

---

## 📋 Checklist: Why Backend Might Be Down

- [ ] Not deployed to Railway yet
- [ ] Railway free tier sleeping (inactive for 5+ minutes)
- [ ] Deployment failed (check Railway logs)
- [ ] Wrong Railway URL (check dashboard for correct URL)
- [ ] Missing environment variables (MONGODB_URI, etc.)
- [ ] Port configuration issue
- [ ] MongoDB connection failing
- [ ] Railway credit/billing issue

---

## 🎯 Recommended Actions (In Order)

### 1. Verify Railway URL is Correct
Check Railway Dashboard for actual URL - it might have changed

### 2. Wake Up Railway Service
Visit the health endpoint to wake it up:
```
https://test-production-f7c7.up.railway.app/health
```

### 3. Check Railway Dashboard
- Service status (should be green/active)
- Recent deployments
- Error logs

### 4. Redeploy if Needed
```bash
cd Server
git add .
git commit -m "Redeploy"
git push origin main
```

### 5. Set Environment Variables
Make sure all required variables are set in Railway

---

## 🆘 If All Else Fails: Use Local Development

```bash
# Terminal 1 - Start Backend
cd Server
npm install
npm start
# Backend runs on http://localhost:3000

# Terminal 2 - Start Client  
cd Client
# Update config/api.ts to use localhost
npm start
```

---

## 🔗 Useful Links

- Railway Dashboard: https://railway.app/dashboard
- Railway Docs: https://docs.railway.app/
- Get Gemini API Key: https://aistudio.google.com/app/apikey
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas

---

## Next Steps

1. ✅ Check if `https://test-production-f7c7.up.railway.app/health` works
2. ✅ If not, deploy backend to Railway
3. ✅ Set environment variables on Railway
4. ✅ Test document analysis again

**Most likely issue:** Backend is not deployed or Railway service is sleeping. Visit the health endpoint to wake it up!
