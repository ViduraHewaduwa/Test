# 🚨 URGENT: Backend Not Responding

## Your Error
```
Network Error: Unable to connect to server at https://test-production-f7c7.up.railway.app/api
```

## What This Means
Your Railway backend is either:
- ❌ Not deployed
- ❌ Sleeping (Railway free tier sleeps after inactivity)
- ❌ Has the wrong URL
- ❌ Is not responding

---

## ⚡ QUICK FIX (Do This First!)

### 1. Test if Backend is Running
**Open this URL in your browser:**
```
https://test-production-f7c7.up.railway.app/health
```

**What you should see:**
```json
{
  "status": "OK",
  "timestamp": "...",
  "uptime": 123.45
}
```

**If you see an error or "Cannot GET /health":**
Your backend is NOT running! Continue to Step 2.

---

### 2. Check Railway Dashboard

1. Go to: https://railway.app/dashboard
2. Login to your account
3. Look for your project
4. Check service status:
   - ✅ Green = Running
   - 🟡 Yellow = Building
   - 🔴 Red = Error
   - ⚫ Gray = Not deployed

**If service is not running, you need to deploy it!**

---

### 3. Deploy Your Backend

#### Option A: If Already Connected to GitHub

Railway auto-deploys when you push:
```bash
cd Server
git add .
git commit -m "Deploy backend"
git push origin main
```

Wait 2-3 minutes for Railway to deploy, then test again.

#### Option B: First Time Deployment

1. Go to Railway Dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repo: `ViduraHewaduwa/Test`
5. Set Root Directory: `Server`
6. Click "Deploy"

---

### 4. Set Environment Variables on Railway

**CRITICAL:** Your backend needs these variables:

1. In Railway Dashboard, click your service
2. Go to **Variables** tab
3. Add these variables:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
PORT=3000
```

**Get Gemini API Key:**
https://aistudio.google.com/app/apikey

**Get MongoDB URI:**
https://www.mongodb.com/cloud/atlas

---

## 🔄 Alternative: Use Local Backend

If Railway is not working, use your local backend:

### Terminal 1 - Start Backend:
```bash
cd Server
npm install
npm start
```
You should see: `Server running on port 3000`

### Terminal 2 - Update Client:

Edit `Client/config/api.ts`:
```typescript
// Line 11: Change this:
const API_URL = PRODUCTION_API_URL;

// To this:
const API_URL = DEVELOPMENT_API_URL;
```

Then restart your client:
```bash
cd Client
npm start
```

---

## ✅ Verification Steps

After deploying/starting backend:

### 1. Test Health Endpoint
```
https://test-production-f7c7.up.railway.app/health
```
Should return JSON with "status": "OK"

### 2. Test Document Endpoint
Open browser console and run:
```javascript
fetch('https://test-production-f7c7.up.railway.app/api/documents/explain', {
  method: 'POST'
}).then(r => r.json()).then(console.log)
```
Should get error about missing file (this is good! Means endpoint exists)

### 3. Try Document Analysis Again
Go back to your app and try analyzing a document.

---

## 📊 Common Issues

### Issue 1: Railway Sleeping (Free Tier)
**Solution:** Visit the health endpoint to wake it up, wait 30 seconds

### Issue 2: Wrong Railway URL
**Solution:** Check Railway Dashboard for the actual URL (it might have changed)

### Issue 3: Missing Environment Variables
**Solution:** Add GEMINI_API_KEY and MONGODB_URI in Railway Variables

### Issue 4: Deployment Failed
**Solution:** Check Railway logs for error messages

### Issue 5: CORS Error
**Solution:** Make sure Server/index.js has:
```javascript
const cors = require('cors');
app.use(cors());
```

---

## 🆘 Still Not Working?

### Check Railway Logs:
1. Railway Dashboard → Your Service
2. Click **Logs** tab
3. Look for errors

### Common Log Errors:

**"Cannot connect to MongoDB"**
- Fix: Check MONGODB_URI in Railway variables

**"GEMINI_API_KEY is not defined"**
- Fix: Add GEMINI_API_KEY in Railway variables

**"Port already in use"**
- Fix: Change PORT variable or restart service

---

## 📝 Summary

Your document analysis fails because **the backend is not responding**. 

**To fix:**
1. ✅ Check if Railway backend is deployed
2. ✅ Visit health endpoint to wake up service
3. ✅ Set environment variables on Railway
4. ✅ OR use local backend temporarily

**Most likely solution:** Your backend needs to be deployed to Railway first!

---

## 📞 Need Help?

Check these files for detailed troubleshooting:
- `CHECK_BACKEND_STATUS.md`
- `DOCUMENT_ANALYSIS_TROUBLESHOOTING.md`
- `RAILWAY_DEPLOYMENT_GUIDE.md`
