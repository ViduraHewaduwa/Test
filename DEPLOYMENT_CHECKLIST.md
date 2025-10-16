# ✅ Railway Deployment Checklist

Use this checklist to ensure a smooth deployment process.

---

## 📋 Pre-Deployment Checklist

### Account Setup
- [ ] Railway account created (signed up via GitHub)
- [ ] MongoDB Atlas account created
- [ ] Google AI Studio account created (for Gemini API)
- [ ] Cloudinary account created (optional, for file uploads)
- [ ] GitHub repository created

### Local Testing
- [ ] Server runs successfully locally (`npm start`)
- [ ] Client app runs successfully locally (`npm start`)
- [ ] Database connection works locally
- [ ] All API endpoints tested with Postman/similar
- [ ] Environment variables documented in `.env.example`

---

## 🗄️ MongoDB Atlas Setup

- [ ] Free cluster created
- [ ] Database user created with strong password
- [ ] Network access configured (0.0.0.0/0 for Railway)
- [ ] Database name chosen (e.g., `legalbridge`)
- [ ] Connection string copied and tested
- [ ] Connection string password URL-encoded if needed

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

---

## 🔑 API Keys Collected

- [ ] Gemini API Key obtained from Google AI Studio
- [ ] JWT Secret generated (32+ random characters)
- [ ] Cloudinary credentials collected (optional):
  - [ ] Cloud Name
  - [ ] API Key
  - [ ] API Secret

**Security Note:** Never commit these keys to Git!

---

## 📁 Code Preparation

### Server Files
- [ ] `Server/railway.json` exists
- [ ] `Server/Procfile` exists
- [ ] `Server/.railwayignore` exists
- [ ] `Server/.env.example` exists (template for others)
- [ ] `Server/.env` is in `.gitignore` (not committed)
- [ ] `Server/package.json` has `"start": "node index.js"`
- [ ] Server listens on `process.env.PORT || 3000`
- [ ] CORS configured to accept Railway origins

### Client Files
- [ ] `Client/config/api.ts` created
- [ ] API configuration uses `__DEV__` to switch environments
- [ ] Production API URL placeholder ready for Railway URL

---

## 🚂 Railway Deployment

### Initial Setup
- [ ] New project created on Railway
- [ ] GitHub repository connected
- [ ] Service created from repository
- [ ] Root directory set to `Server`

### Environment Variables Set
- [ ] `DB_URL` - MongoDB connection string
- [ ] `PORT` - Set to `3000`
- [ ] `NODE_ENV` - Set to `production`
- [ ] `JWT_SECRET` - Your random secret key
- [ ] `GEMINI_API_KEY` - Your Gemini API key
- [ ] `CLOUDINARY_CLOUD_NAME` - (if using Cloudinary)
- [ ] `CLOUDINARY_API_KEY` - (if using Cloudinary)
- [ ] `CLOUDINARY_API_SECRET` - (if using Cloudinary)
- [ ] `ALLOWED_ORIGINS` - Will add Railway URL after domain generation

### Deployment
- [ ] Domain generated under Networking settings
- [ ] Railway URL copied (e.g., `https://app-name.up.railway.app`)
- [ ] Deployment successful (green checkmark)
- [ ] No errors in deployment logs
- [ ] Service shows as "Active"

### Add Railway URL to Environment
- [ ] `ALLOWED_ORIGINS` updated with Railway URL

---

## 🧪 Backend Testing

### Health Check
- [ ] `/health` endpoint returns 200 OK
- [ ] MongoDB status shows "connected"
- [ ] Gemini API key shows "configured"

**Test URL:**
```
https://your-app-name.up.railway.app/health
```

### API Endpoints
- [ ] Root endpoint (`/`) returns API documentation
- [ ] Auth endpoints accessible:
  - [ ] `/api/auth/login`
  - [ ] `/api/auth/register`
- [ ] Documents endpoints accessible:
  - [ ] `/api/documents`
  - [ ] `/api/documents/upload`
- [ ] Chat endpoint working:
  - [ ] `/api/chat`
- [ ] Other endpoints responding correctly

### Test with Postman/Curl
- [ ] POST request to `/api/auth/register` works
- [ ] POST request to `/api/auth/login` returns token
- [ ] Protected endpoints accept Bearer token
- [ ] File uploads work (if configured)
- [ ] Chat responds with AI-generated content

---

## 📱 Mobile App Configuration

### API Configuration
- [ ] `Client/config/api.ts` updated with Railway URL
- [ ] `PRODUCTION_API_URL` points to Railway domain
- [ ] `DEVELOPMENT_API_URL` points to localhost
- [ ] API endpoints exported correctly

### Service Files Updated
- [ ] `Client/services/documentService.ts` imports API_URL
- [ ] `Client/services/lawyerService.tsx` imports API_URL
- [ ] `Client/services/adminService.ts` imports API_URL
- [ ] `Client/services/notificationService.ts` imports API_URL
- [ ] All other service files updated

### Dependencies
- [ ] All npm packages installed (`npm install`)
- [ ] No dependency conflicts
- [ ] Expo SDK compatible versions

---

## 📲 Mobile App Testing

### Development Testing
- [ ] Expo dev server starts without errors
- [ ] QR code generated successfully
- [ ] App loads on Expo Go

### Connection Testing
- [ ] API health check works from app
- [ ] Login/Register functions work
- [ ] Data loads from Railway backend
- [ ] Images/documents display correctly

### Feature Testing
- [ ] User authentication works
- [ ] Document upload successful
- [ ] Document analysis works
- [ ] Lawyer listing displays
- [ ] Appointment booking works
- [ ] Chat/AI assistant responds
- [ ] NGO matching works
- [ ] Posts/polls display
- [ ] Notifications work

### Device Testing
- [ ] Tested on Android phone
- [ ] Tested on iOS phone (if available)
- [ ] Tested with poor internet connection
- [ ] Tested offline behavior (if applicable)

---

## 🔒 Security Checklist

- [ ] `.env` file not committed to Git
- [ ] `.env` added to `.gitignore`
- [ ] Strong JWT secret used (32+ characters)
- [ ] MongoDB user has strong password
- [ ] API keys kept secret
- [ ] No hardcoded credentials in code
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Authentication middleware working
- [ ] File upload size limits configured

---

## 📊 Monitoring Setup

- [ ] Railway logs accessible
- [ ] Error monitoring configured (optional - Sentry)
- [ ] Analytics configured (optional)
- [ ] Uptime monitoring set up (optional)
- [ ] Resource usage monitored in Railway dashboard

---

## 📝 Documentation

- [ ] README.md updated with Railway URL
- [ ] API documentation complete
- [ ] Mobile app setup guide created
- [ ] Deployment guide reviewed
- [ ] Environment variables documented
- [ ] Known issues documented

---

## 🚀 Post-Deployment

### Immediate Tasks
- [ ] Share Railway URL with team
- [ ] Update API documentation with live URL
- [ ] Test all features end-to-end
- [ ] Monitor Railway logs for errors
- [ ] Check MongoDB Atlas metrics

### Optional Enhancements
- [ ] Configure custom domain
- [ ] Set up CI/CD pipeline
- [ ] Add staging environment
- [ ] Set up automated backups
- [ ] Configure monitoring alerts
- [ ] Add rate limiting
- [ ] Implement caching (Redis)

### Mobile App Distribution
- [ ] Build APK for Android
- [ ] Build IPA for iOS (requires Apple Developer account)
- [ ] Test built apps (not just Expo Go)
- [ ] Prepare for app store submission
- [ ] Create app store listings
- [ ] Submit to Google Play Store
- [ ] Submit to Apple App Store

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ Railway backend is running and accessible
✅ MongoDB connection is stable
✅ All API endpoints return expected responses
✅ Mobile app connects to Railway backend
✅ Users can register and login
✅ Core features work (documents, lawyers, chat, etc.)
✅ App works on physical mobile devices
✅ No critical errors in Railway logs
✅ Response times are acceptable (< 2 seconds)
✅ File uploads work correctly

---

## 🆘 Rollback Plan

If deployment fails:

1. **Check Railway logs** for specific errors
2. **Revert to last working deployment** (if available)
3. **Test locally** to identify the issue
4. **Check environment variables** are correct
5. **Verify MongoDB connection** is working
6. **Review recent code changes** that might have caused issues
7. **Restore from backup** if database issues occur

---

## 📞 Support Resources

- [Railway Documentation](https://docs.railway.app/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- Your deployment guides:
  - `RAILWAY_DEPLOYMENT_GUIDE.md`
  - `MOBILE_CONFIGURATION_GUIDE.md`
  - `QUICK_START_RAILWAY.md`

---

## 🎉 Deployment Complete!

Once all items are checked:

**Backend:** ✅ Deployed on Railway
**Database:** ✅ Running on MongoDB Atlas
**Mobile App:** ✅ Connected and working
**Status:** 🚀 LIVE IN PRODUCTION

**Railway URL:** `https://your-app-name.up.railway.app`

**Congratulations!** Your Legal Bridge app is now accessible worldwide! 🌍📱

---

**Last Updated:** October 17, 2025
**Deployment Status:** [ ] Not Started | [ ] In Progress | [ ] Complete
