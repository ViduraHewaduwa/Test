# 📱 Mobile App Configuration Guide

This guide explains how to configure your React Native/Expo mobile app to connect to your Railway-hosted backend.

---

## 🎯 Quick Setup (Recommended Method)

### Step 1: Create API Configuration File

Create a new file `Client/config/api.ts`:

```typescript
// API Configuration for different environments
const isDevelopment = __DEV__;

// Replace with your actual Railway URL after deployment
const PRODUCTION_API_URL = 'https://your-app-name.up.railway.app';
const DEVELOPMENT_API_URL = 'http://localhost:3000';

// Automatically switch between dev and production
const API_URL = isDevelopment ? DEVELOPMENT_API_URL : PRODUCTION_API_URL;

export default API_URL;

// Export individual endpoints for easier use
export const API_ENDPOINTS = {
  // Auth
  login: `${API_URL}/api/auth/login`,
  register: `${API_URL}/api/auth/register`,
  
  // Documents
  documents: `${API_URL}/api/documents`,
  uploadDocument: `${API_URL}/api/documents/upload`,
  
  // Lawyers
  lawyers: `${API_URL}/api/lawyers`,
  appointments: `${API_URL}/api/appointments`,
  
  // Chat
  chat: `${API_URL}/api/chat`,
  
  // NGO
  ngo: `${API_URL}/api/ngo`,
  
  // Posts & Polls
  posts: `${API_URL}/api/posts`,
  polls: `${API_URL}/api/polls`,
  
  // Notifications
  notifications: `${API_URL}/api/notifications`,
  
  // Admin
  admin: `${API_URL}/api/admin`,
};

// Export for debugging
export const getApiConfig = () => ({
  isDevelopment,
  currentUrl: API_URL,
  environment: isDevelopment ? 'development' : 'production',
});
```

### Step 2: Update Your Service Files

Update all service files to use the centralized configuration.

#### Example: `Client/services/documentService.ts`

```typescript
import axios from 'axios';
import API_URL from '../config/api';

export const documentService = {
  // Get all documents
  async getAllDocuments(userId: string) {
    try {
      const response = await axios.get(`${API_URL}/api/documents`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  // Upload document
  async uploadDocument(formData: FormData) {
    try {
      const response = await axios.post(
        `${API_URL}/api/documents/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  // Analyze document
  async analyzeDocument(documentId: string) {
    try {
      const response = await axios.post(
        `${API_URL}/api/documents/${documentId}/analyze`
      );
      return response.data;
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw error;
    }
  },
};
```

#### Example: `Client/services/lawyerService.tsx`

```typescript
import axios from 'axios';
import API_URL from '../config/api';

export const lawyerService = {
  // Get all lawyers
  async getAllLawyers() {
    try {
      const response = await axios.get(`${API_URL}/api/lawyers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lawyers:', error);
      throw error;
    }
  },

  // Get lawyer by ID
  async getLawyerById(id: string) {
    try {
      const response = await axios.get(`${API_URL}/api/lawyers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lawyer:', error);
      throw error;
    }
  },

  // Book appointment
  async bookAppointment(appointmentData: any) {
    try {
      const response = await axios.post(
        `${API_URL}/api/appointments`,
        appointmentData
      );
      return response.data;
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  },
};
```

### Step 3: Update After Railway Deployment

After deploying to Railway:

1. Copy your Railway URL (e.g., `https://legalbridge-production.up.railway.app`)
2. Open `Client/config/api.ts`
3. Replace `'https://your-app-name.up.railway.app'` with your actual Railway URL
4. Save the file

**That's it!** Your app will now use Railway in production and localhost in development.

---

## 🔄 Alternative Method: Environment Variables

If you prefer using environment variables with Expo:

### Step 1: Install Dependencies

```bash
cd Client
npm install react-native-dotenv
```

### Step 2: Create Environment Files

Create `Client/.env`:
```env
EXPO_PUBLIC_API_URL=https://your-app-name.up.railway.app
```

Create `Client/.env.development`:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Create `Client/.env.production`:
```env
EXPO_PUBLIC_API_URL=https://your-app-name.up.railway.app
```

### Step 3: Configure Babel

Update `Client/babel.config.js`:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
```

### Step 4: Create Type Definitions

Create `Client/@types/env.d.ts`:

```typescript
declare module '@env' {
  export const EXPO_PUBLIC_API_URL: string;
}
```

### Step 5: Use in Your Code

```typescript
import { EXPO_PUBLIC_API_URL } from '@env';

const API_URL = EXPO_PUBLIC_API_URL || 'http://localhost:3000';

console.log('Using API URL:', API_URL);
```

---

## 🧪 Testing Your Connection

### Create a Test Component

Create `Client/components/ApiTest.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import API_URL from '../config/api';

const ApiTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      
      if (data.status === 'OK') {
        setStatus('✅ Connected to Railway!');
        console.log('API Response:', data);
      } else {
        setStatus('❌ Connection failed');
      }
    } catch (error) {
      setStatus('❌ Error: ' + error.message);
      console.error('Connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>
      <Text style={styles.url}>{API_URL}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Text style={styles.status}>{status}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  url: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    marginTop: 20,
  },
});

export default ApiTest;
```

Add this component to your app to verify the connection is working.

---

## 📝 Update Checklist

When switching from localhost to Railway, update these files:

- [ ] `Client/config/api.ts` - Update PRODUCTION_API_URL
- [ ] `Client/services/adminService.ts` - Import and use API_URL
- [ ] `Client/services/documentService.ts` - Import and use API_URL
- [ ] `Client/services/lawyerService.tsx` - Import and use API_URL
- [ ] `Client/services/notificationService.ts` - Import and use API_URL
- [ ] `Client/service/appointmentSercive.js` - Import and use API_URL
- [ ] `Client/service/adminService.js` - Import and use API_URL
- [ ] `Client/service/lawyerService.js` - Import and use API_URL
- [ ] Any other files making API calls

---

## 🔍 Common Issues & Solutions

### Issue 1: "Network Request Failed"

**Cause:** App can't reach the server

**Solutions:**
- ✅ Check your Railway URL is correct (with https://)
- ✅ Verify Railway app is deployed and running
- ✅ Test the URL in a browser first
- ✅ Check your phone has internet connection
- ✅ Restart the Expo development server

### Issue 2: CORS Errors

**Cause:** Backend blocking requests from your app

**Solutions:**
- ✅ Server is already configured to accept all origins
- ✅ Make sure you're using the exact Railway URL
- ✅ Don't add trailing slashes to URLs

### Issue 3: "Unauthorized" or 401 Errors

**Cause:** Authentication token issues

**Solutions:**
- ✅ Check JWT_SECRET is set in Railway environment variables
- ✅ Ensure token is being sent in Authorization header
- ✅ Verify token is stored correctly in AsyncStorage

### Issue 4: File Upload Fails

**Cause:** Railway's ephemeral filesystem

**Solutions:**
- ✅ Configure Cloudinary in Railway environment variables
- ✅ Update upload endpoints to use Cloudinary
- ✅ Don't rely on local file storage on Railway

### Issue 5: Changes Not Reflecting

**Cause:** Cache or old build

**Solutions:**
```bash
# Clear Expo cache
expo start -c

# Or
npx expo start --clear

# Rebuild the app
rm -rf node_modules
npm install
npm start
```

---

## 🚀 Testing on Physical Device

### Android Device

1. **Connect to same WiFi as development computer**

2. **Open Expo Go app**

3. **Scan QR code from terminal**

4. **If connection fails:**
   ```bash
   # Use tunnel mode
   expo start --tunnel
   ```

### iOS Device

1. **Connect to same WiFi as development computer**

2. **Open Camera app**

3. **Scan QR code**

4. **Opens in Expo Go automatically**

---

## 📦 Building for Production

### Build APK for Android

```bash
cd Client

# Using EAS Build (recommended)
npm install -g eas-cli
eas build --platform android

# Or using classic build
expo build:android
```

### Build for iOS

```bash
cd Client

# Using EAS Build (requires Apple Developer account)
eas build --platform ios

# Or using classic build
expo build:ios
```

---

## 🎯 Best Practices

1. **Always use the centralized API config file**
   - Don't hardcode URLs in components
   - Import from `config/api.ts`

2. **Handle errors gracefully**
   ```typescript
   try {
     const response = await axios.get(`${API_URL}/api/data`);
     return response.data;
   } catch (error) {
     if (error.response) {
       // Server responded with error
       console.error('Server error:', error.response.data);
     } else if (error.request) {
       // No response received
       console.error('Network error:', error.request);
     } else {
       // Other errors
       console.error('Error:', error.message);
     }
     throw error;
   }
   ```

3. **Add loading states**
   - Show spinners during API calls
   - Provide feedback to users

4. **Implement retry logic**
   ```typescript
   const fetchWithRetry = async (url, retries = 3) => {
     for (let i = 0; i < retries; i++) {
       try {
         return await fetch(url);
       } catch (error) {
         if (i === retries - 1) throw error;
         await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
       }
     }
   };
   ```

5. **Use interceptors for common headers**
   ```typescript
   import axios from 'axios';
   import AsyncStorage from '@react-native-async-storage/async-storage';
   
   axios.interceptors.request.use(async (config) => {
     const token = await AsyncStorage.getItem('token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

---

## ✅ Deployment Checklist

Before deploying your mobile app:

- [ ] Railway backend is deployed and working
- [ ] Railway URL is updated in `Client/config/api.ts`
- [ ] All API endpoints tested and working
- [ ] MongoDB is accessible from Railway
- [ ] Environment variables are set correctly
- [ ] File uploads configured (Cloudinary recommended)
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Authentication working correctly
- [ ] Push notifications configured (if applicable)
- [ ] Analytics configured (if applicable)
- [ ] App tested on physical device
- [ ] Build succeeds without errors

---

## 🎉 Success!

Your mobile app is now configured to:
- ✅ Connect to Railway-hosted backend
- ✅ Switch between development and production automatically
- ✅ Handle network errors gracefully
- ✅ Work on physical mobile devices

**Enjoy your fully deployed mobile app!** 📱✨
