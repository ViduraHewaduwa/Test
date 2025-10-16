# 🚀 Railway Deployment Guide - Legal Bridge App

This guide will help you deploy your Legal Bridge backend to Railway and make it accessible from your mobile phone.

## 📋 Prerequisites

Before you begin, make sure you have:

1. ✅ A GitHub account
2. ✅ A Railway account (sign up at [railway.app](https://railway.app))
3. ✅ A MongoDB Atlas account (for cloud database)
4. ✅ A Google AI Studio account (for Gemini API key)
5. ✅ A Cloudinary account (for file uploads - optional but recommended)

---

## 🎯 Step 1: Prepare Your MongoDB Database

### Option A: MongoDB Atlas (Recommended)

1. **Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**

2. **Create a new cluster** (Free tier is sufficient)

3. **Create a database user:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Save the username and password (you'll need this for Railway)

4. **Whitelist Railway's IP addresses:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access From Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get your connection string:**
   - Go to "Database" → "Connect"
   - Select "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/databasename`
   - Replace `<password>` with your actual password
   - Replace `<databasename>` with your database name (e.g., `legalbridge`)

---

## 🎯 Step 2: Get Your API Keys

### Gemini AI API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key (you'll need this for Railway)

### Cloudinary Configuration (Optional - for file uploads)

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up or log in
3. From your dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret

---

## 🎯 Step 3: Push Your Code to GitHub

1. **Initialize Git repository (if not already done):**
   ```bash
   cd Server
   git init
   git add .
   git commit -m "Initial commit for Railway deployment"
   ```

2. **Create a new repository on GitHub**
   - Go to [GitHub](https://github.com/new)
   - Create a new repository (e.g., "legalbridge-backend")
   - **DO NOT** initialize with README, .gitignore, or license

3. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

---

## 🎯 Step 4: Deploy to Railway

### 1. Create a New Project on Railway

1. Go to [railway.app](https://railway.app)
2. Click "Login" and sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository (legalbridge-backend)

### 2. Configure Your Service

1. After selecting your repo, Railway will automatically detect Node.js
2. Click on your service to open the settings

### 3. Set Root Directory (Important!)

1. In the service settings, click "Settings"
2. Find "Root Directory"
3. Set it to: `Server`
4. Click "Save"

### 4. Add Environment Variables

1. Click on the "Variables" tab
2. Add each of the following variables by clicking "New Variable":

   ```
   DB_URL=mongodb+srv://username:password@cluster.mongodb.net/legalbridge?retryWrites=true&w=majority
   ```
   *(Replace with your actual MongoDB connection string)*

   ```
   PORT=3000
   ```

   ```
   NODE_ENV=production
   ```

   ```
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_to_random_string
   ```
   *(Generate a random secure string - at least 32 characters)*

   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Your Google AI Studio API key)*

   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   *(Optional - if you're using Cloudinary)*

3. Click "Deploy" after adding all variables

### 5. Generate a Public URL

1. In your service settings, go to "Settings" tab
2. Scroll down to "Networking"
3. Click "Generate Domain"
4. Railway will provide you with a URL like: `https://your-app-name.up.railway.app`
5. **SAVE THIS URL** - you'll need it for your mobile app!

---

## 🎯 Step 5: Test Your Deployment

1. **Check deployment status:**
   - Look at the "Deployments" tab in Railway
   - Wait for the status to show "Success" (green checkmark)
   - If it fails, check the logs for errors

2. **Test your API endpoints:**
   
   Open your browser and visit:
   
   ```
   https://your-app-name.up.railway.app/health
   ```
   
   You should see:
   ```json
   {
     "status": "OK",
     "timestamp": "2025-10-17T...",
     "uptime": 123.456,
     "mongodb": "connected",
     "geminiApiKey": "configured"
   }
   ```

3. **Test the main endpoint:**
   ```
   https://your-app-name.up.railway.app/
   ```
   
   You should see the API documentation with all available endpoints.

---

## 📱 Step 6: Configure Your Mobile App

Now you need to connect your React Native/Expo mobile app to the Railway-hosted backend.

### Method 1: Using Environment Variables (Recommended)

1. **Create a config file for your API URL:**

   Create `Client/config/api.ts`:
   ```typescript
   const API_URL = __DEV__ 
     ? 'http://localhost:3000'  // Local development
     : 'https://your-app-name.up.railway.app';  // Production (Railway)

   export default API_URL;
   ```

2. **Update your service files to use this config:**

   In all your service files (e.g., `Client/services/documentService.ts`), replace hardcoded URLs:

   ```typescript
   // Before:
   // const response = await axios.get('http://localhost:3000/api/documents');

   // After:
   import API_URL from '../config/api';
   const response = await axios.get(`${API_URL}/api/documents`);
   ```

### Method 2: Using Environment Variables with Expo

1. **Create `Client/.env` file:**
   ```env
   EXPO_PUBLIC_API_URL=https://your-app-name.up.railway.app
   ```

2. **Install dotenv:**
   ```bash
   cd Client
   npm install react-native-dotenv
   ```

3. **Update `Client/babel.config.js`:**
   ```javascript
   module.exports = function(api) {
     api.cache(true);
     return {
       presets: ['babel-preset-expo'],
       plugins: [
         ['module:react-native-dotenv', {
           moduleName: '@env',
           path: '.env',
         }]
       ]
     };
   };
   ```

4. **Create `Client/@types/env.d.ts`:**
   ```typescript
   declare module '@env' {
     export const EXPO_PUBLIC_API_URL: string;
   }
   ```

5. **Use in your services:**
   ```typescript
   import { EXPO_PUBLIC_API_URL } from '@env';
   const API_URL = EXPO_PUBLIC_API_URL || 'http://localhost:3000';
   ```

---

## 📱 Step 7: Test on Your Mobile Phone

### Option A: Using Expo Go App (Easiest)

1. **Install Expo Go on your phone:**
   - iOS: Download from App Store
   - Android: Download from Play Store

2. **Start your development server:**
   ```bash
   cd Client
   npm start
   ```

3. **Scan the QR code:**
   - On your phone, open Expo Go
   - Scan the QR code from the terminal
   - Make sure your phone and computer are on the same WiFi network

4. **Your app should now load and connect to Railway backend!**

### Option B: Building a Standalone App

For a production-ready mobile app:

1. **For Android (APK):**
   ```bash
   cd Client
   npx expo build:android
   ```

2. **For iOS (requires Apple Developer account):**
   ```bash
   cd Client
   npx expo build:ios
   ```

3. **Or use EAS Build (recommended by Expo):**
   ```bash
   npm install -g eas-cli
   eas build --platform android
   eas build --platform ios
   ```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. **MongoDB Connection Failed**
   - ✅ Check your connection string in Railway variables
   - ✅ Ensure you whitelisted `0.0.0.0/0` in MongoDB Atlas Network Access
   - ✅ Verify your database user credentials are correct

#### 2. **API Returns 404 Not Found**
   - ✅ Ensure Root Directory is set to `Server` in Railway settings
   - ✅ Check deployment logs for errors
   - ✅ Verify your Railway URL is correct (with https://)

#### 3. **CORS Errors from Mobile App**
   - ✅ The server already has CORS configured
   - ✅ Make sure you're using the exact Railway URL (including https://)
   - ✅ Check that the URL doesn't have a trailing slash

#### 4. **File Uploads Not Working**
   - ✅ Configure Cloudinary properly (recommended for Railway)
   - ✅ Check that environment variables are set correctly
   - ✅ Railway ephemeral filesystem means local uploads won't persist - use Cloudinary!

#### 5. **Mobile App Can't Connect to Backend**
   - ✅ Verify the API_URL in your app matches your Railway URL
   - ✅ Check your phone has internet connection
   - ✅ Test the Railway endpoint in a browser first
   - ✅ Make sure you rebuilt/restarted the Expo app after changing the URL

#### 6. **Railway Deployment Keeps Failing**
   - ✅ Check the deployment logs in Railway
   - ✅ Ensure all dependencies are in package.json
   - ✅ Verify Node.js version compatibility
   - ✅ Check that environment variables are set correctly

---

## 📊 Monitoring Your App

### View Logs in Railway

1. Go to your Railway project
2. Click on your service
3. Click "Deployments" tab
4. Click "View Logs" to see real-time logs
5. Monitor for errors or issues

### Check App Metrics

1. In Railway, go to "Metrics" tab
2. Monitor:
   - CPU usage
   - Memory usage
   - Network traffic
   - Response times

---

## 💰 Railway Pricing

- **Free Tier:** $5 of usage per month (should be enough for development/testing)
- **Hobby Plan:** $5/month + usage
- **Pro Plan:** $20/month + usage

**Tip:** The free tier includes $5 credit which auto-renews monthly. Perfect for small apps!

---

## 🎉 Next Steps

After successful deployment:

1. ✅ Test all API endpoints from your mobile app
2. ✅ Set up proper error monitoring (consider services like Sentry)
3. ✅ Configure custom domain (optional)
4. ✅ Set up staging and production environments
5. ✅ Implement CI/CD pipeline for automatic deployments
6. ✅ Add API rate limiting for production
7. ✅ Set up backup strategy for MongoDB

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Expo Documentation](https://docs.expo.dev/)
- [Google AI Studio](https://makersuite.google.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

## 🆘 Need Help?

If you encounter any issues:

1. Check Railway logs for server errors
2. Check mobile app console for client errors
3. Verify all environment variables are set correctly
4. Test endpoints with Postman or similar tools
5. Check that MongoDB is accessible and credentials are correct

---

## 🔒 Security Best Practices

1. ✅ Never commit `.env` files to Git
2. ✅ Use strong JWT secrets (32+ characters)
3. ✅ Regularly rotate API keys
4. ✅ Use environment-specific configurations
5. ✅ Implement rate limiting in production
6. ✅ Keep dependencies updated
7. ✅ Use HTTPS only in production
8. ✅ Validate all user inputs
9. ✅ Implement proper authentication and authorization
10. ✅ Monitor for security vulnerabilities

---

## ✨ Success!

Your Legal Bridge app is now:
- ✅ Deployed to Railway
- ✅ Accessible from anywhere with internet
- ✅ Ready to use on mobile phones
- ✅ Connected to cloud MongoDB
- ✅ Using Gemini AI for chatbot features

**Your Backend URL:** `https://your-app-name.up.railway.app`

**Enjoy your deployed app!** 🎊
