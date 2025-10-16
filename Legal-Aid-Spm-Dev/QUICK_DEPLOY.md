# ⚡ Railway Quick Deploy - Cheat Sheet

## 🚀 5-Minute Deploy

### 1. Push to GitHub
```powershell
git add .
git commit -m "Railway deploy"
git push
```

### 2. Railway Setup
1. Go to [railway.app](https://railway.app)
2. Login with GitHub
3. New Project → Deploy from GitHub
4. Select `test` repo → `Dev` branch
5. Settings → Root Directory → `Server`

### 3. Add Variables
Go to Variables tab → Raw Editor → Paste:

```env
PORT=3000
NODE_ENV=production
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/legal-aid
GEMINI_API_KEY=your_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
JWT_SECRET=random_string_32_chars
```

### 4. Get Domain
Settings → Networking → Generate Domain → Copy URL

### 5. Update Mobile App
Edit `Client/config/api.config.ts`:
```typescript
const PRODUCTION_URL = 'https://your-app.railway.app';
```

### 6. Test
Open: `https://your-app.railway.app/health`

---

## 🔑 Where to Get Keys

| Service | URL | What You Need |
|---------|-----|---------------|
| **MongoDB** | [mongodb.com/atlas](https://mongodb.com/cloud/atlas) | Connection string |
| **Gemini AI** | [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey) | API Key |
| **Cloudinary** | [cloudinary.com/console](https://cloudinary.com/console) | Cloud Name, API Key, Secret |

---

## 🗄️ MongoDB Atlas Quick Setup

1. Create free account
2. Create cluster (M0 Free)
3. Database Access → Add user
4. Network Access → Allow 0.0.0.0/0
5. Connect → Copy connection string

---

## ✅ Testing Checklist

```powershell
# Test health endpoint
curl https://your-app.railway.app/health

# Test API
curl https://your-app.railway.app/

# Test from mobile app
cd Client
npm start
# Press 'a' for Android or 'i' for iOS
```

---

## 🔥 Important Files

| File | Purpose |
|------|---------|
| `Server/railway.json` | Railway config |
| `Server/Procfile` | Start command |
| `Server/.gitignore` | Don't upload secrets |
| `Server/.env.example` | Env template |
| `Client/config/api.config.ts` | API URL config |

---

## 🐛 Quick Fixes

**Can't connect?**
- Check Railway logs
- Verify env variables

**CORS error?**
- URL in `api.config.ts` correct?

**MongoDB fails?**
- Network access = 0.0.0.0/0?
- Connection string correct?

**File upload fails?**
- Cloudinary keys correct?

---

## 💰 Costs

- **Railway Free**: $5 credit/month (enough for testing)
- **MongoDB**: Free forever (512MB)
- **Cloudinary**: Free (25GB storage)
- **Gemini AI**: Free tier available

**Total for small app: $0-5/month** 🎉

---

## 📞 Support

**Railway:** [docs.railway.app](https://docs.railway.app)
**Logs:** Railway Dashboard → Deployments → View Logs

---

## ⚡ One-Line Deploy

After initial setup, future deploys:
```powershell
git add . ; git commit -m "update" ; git push
```
Railway auto-deploys! 🚀
