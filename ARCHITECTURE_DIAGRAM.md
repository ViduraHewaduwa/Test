# 📊 Architecture & Deployment Flow

Visual representation of your Legal Bridge application architecture and deployment.

---

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      MOBILE APP (Client)                     │
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐     │
│  │   Expo Go   │  │ React Native │  │   TypeScript   │     │
│  │  iOS/Android│  │   Components │  │    Services    │     │
│  └─────────────┘  └──────────────┘  └────────────────┘     │
│                                                               │
│              config/api.ts (API Configuration)               │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTPS Requests
                            │ (JSON/Multipart)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    RAILWAY.APP (Hosting)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Express.js Backend Server                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │  │
│  │  │  Routes  │  │Controllers│  │    Middleware     │  │  │
│  │  │ /api/... │  │  Logic    │  │  Auth, Upload     │  │  │
│  │  └──────────┘  └──────────┘  └────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────┬──────────────────────┬────────────────────────┘
              │                      │
              │                      │
    ┌─────────▼──────────┐  ┌───────▼──────────┐
    │  MongoDB Atlas     │  │  Google Gemini   │
    │  (Database)        │  │  AI (Chatbot)    │
    │                    │  │                  │
    │  - Users           │  │  - AI Responses  │
    │  - Documents       │  │  - Legal Help    │
    │  - Lawyers         │  │  - Analysis      │
    │  - Appointments    │  └──────────────────┘
    │  - Posts/Polls     │
    └────────────────────┘
              │
    ┌─────────▼──────────┐
    │   Cloudinary       │
    │  (File Storage)    │
    │                    │
    │  - Documents       │
    │  - Images          │
    │  - Profile Pics    │
    └────────────────────┘
```

---

## 🔄 Deployment Flow

```
┌──────────────────────────────────────────────────────────────┐
│  STEP 1: LOCAL DEVELOPMENT                                   │
└──────────────────────────────────────────────────────────────┘
    │
    │  Developer writes code
    │  Tests locally
    │
    ▼
┌──────────────────────────────────────────────────────────────┐
│  STEP 2: PUSH TO GITHUB                                      │
│                                                               │
│  git init                                                     │
│  git add .                                                    │
│  git commit -m "Ready for deployment"                        │
│  git push origin main                                         │
└──────────────────────────────────────────────────────────────┘
    │
    │  GitHub receives code
    │
    ▼
┌──────────────────────────────────────────────────────────────┐
│  STEP 3: RAILWAY DETECTS CHANGES                             │
│                                                               │
│  Railway pulls from GitHub                                   │
│  Reads railway.json & Procfile                               │
│  Installs dependencies (npm install)                         │
└──────────────────────────────────────────────────────────────┘
    │
    │  Builds application
    │
    ▼
┌──────────────────────────────────────────────────────────────┐
│  STEP 4: RAILWAY DEPLOYS                                     │
│                                                               │
│  Starts server: node index.js                                │
│  Assigns public URL                                          │
│  Server connects to MongoDB Atlas                            │
│  Server ready to accept requests                             │
└──────────────────────────────────────────────────────────────┘
    │
    │  Public URL available
    │
    ▼
┌──────────────────────────────────────────────────────────────┐
│  STEP 5: MOBILE APP CONNECTS                                 │
│                                                               │
│  Update Client/config/api.ts with Railway URL                │
│  npm start (Expo dev server)                                 │
│  Scan QR code with Expo Go                                   │
│  App makes API calls to Railway backend                      │
└──────────────────────────────────────────────────────────────┘
    │
    │  Users can access app
    │
    ▼
┌──────────────────────────────────────────────────────────────┐
│  STEP 6: LIVE IN PRODUCTION! 🎉                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📱 Mobile App Request Flow

```
User opens app on phone
        │
        ▼
┌─────────────────────┐
│   Expo Go App       │
│   (on your phone)   │
└──────────┬──────────┘
           │
           │ 1. App loads
           │    Reads config/api.ts
           │
           ▼
┌─────────────────────────────────────┐
│  Check Environment                  │
│                                     │
│  __DEV__ = false (Production)      │
│  Use: PRODUCTION_API_URL           │
│  = https://yourapp.up.railway.app  │
└──────────┬──────────────────────────┘
           │
           │ 2. User taps "Login"
           │
           ▼
┌─────────────────────────────────────┐
│  Service Layer                      │
│  (e.g., authService.ts)            │
│                                     │
│  axios.post(                       │
│    `${API_URL}/api/auth/login`,   │
│    credentials                     │
│  )                                  │
└──────────┬──────────────────────────┘
           │
           │ 3. HTTP POST Request
           │    (JSON with credentials)
           │
           ▼
┌─────────────────────────────────────────────┐
│         Railway Backend Server              │
│  https://yourapp.up.railway.app            │
│                                             │
│  1. CORS check ✓                           │
│  2. Route: POST /api/auth/login            │
│  3. Controller: userController.login()     │
│  4. Query MongoDB for user                 │
│  5. Verify password (bcrypt)               │
│  6. Generate JWT token                     │
└──────────┬──────────────────────────────────┘
           │
           │ 4. Response
           │    { success: true, token: "..." }
           │
           ▼
┌─────────────────────────────────────┐
│  Mobile App                         │
│                                     │
│  - Receives token                   │
│  - Saves to AsyncStorage           │
│  - Updates UI (show home screen)   │
│  - User is logged in! ✓            │
└─────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
Mobile App                Railway Backend           MongoDB Atlas
    │                           │                         │
    │  POST /api/auth/register  │                         │
    ├──────────────────────────►│                         │
    │  { email, password, ... } │                         │
    │                           │  Check if user exists   │
    │                           ├────────────────────────►│
    │                           │                         │
    │                           │◄────────────────────────┤
    │                           │  User not found         │
    │                           │                         │
    │                           │  Hash password (bcrypt) │
    │                           │                         │
    │                           │  Create new user        │
    │                           ├────────────────────────►│
    │                           │                         │
    │                           │◄────────────────────────┤
    │                           │  User created           │
    │                           │                         │
    │                           │  Generate JWT token     │
    │                           │                         │
    │◄──────────────────────────┤                         │
    │  { success: true,         │                         │
    │    token: "jwt...",       │                         │
    │    user: {...} }          │                         │
    │                           │                         │
    │  Store token in           │                         │
    │  AsyncStorage             │                         │
    │                           │                         │
    │  All future requests      │                         │
    │  include:                 │                         │
    │  Authorization:           │                         │
    │  Bearer <token>           │                         │
    │                           │                         │
```

---

## 📄 Document Upload Flow

```
User selects document
        │
        ▼
┌────────────────────────────────────────┐
│  expo-document-picker                  │
│  Selects PDF/DOC file from device     │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│  Create FormData                       │
│  - Add file                            │
│  - Add metadata (userId, title, etc)   │
└──────────┬─────────────────────────────┘
           │
           │ POST request
           │ Content-Type: multipart/form-data
           ▼
┌──────────────────────────────────────────────┐
│  Railway: POST /api/documents/upload         │
│                                              │
│  1. Multer middleware processes file        │
│  2. Upload to Cloudinary (if configured)    │
│  3. Create document record in MongoDB       │
│  4. Return document info                    │
└──────────┬───────────────────────────────────┘
           │
           │ Response
           │ { success: true, document: {...} }
           ▼
┌────────────────────────────────────────┐
│  Mobile App                            │
│  - Show success message                │
│  - Update document list                │
│  - Display uploaded document           │
└────────────────────────────────────────┘
```

---

## 🤖 AI Chat Flow

```
User types message
        │
        ▼
┌─────────────────────────────────────┐
│  Chat Component                     │
│  - User input: "What is bail?"      │
└──────────┬──────────────────────────┘
           │
           │ POST request
           ▼
┌──────────────────────────────────────────────┐
│  Railway: POST /api/chat                     │
│                                              │
│  Body: {                                     │
│    message: "What is bail?",                │
│    conversationHistory: [...]               │
│  }                                           │
└──────────┬───────────────────────────────────┘
           │
           │ Forward to Google AI
           ▼
┌──────────────────────────────────────────────┐
│  Google Gemini AI                            │
│  https://generativelanguage.googleapis.com  │
│                                              │
│  1. Receive prompt with legal context       │
│  2. Generate AI response                    │
│  3. Return generated text                   │
└──────────┬───────────────────────────────────┘
           │
           │ AI Response
           ▼
┌──────────────────────────────────────────────┐
│  Railway Backend                             │
│  - Format response                           │
│  - Add metadata                              │
│  - Return to mobile app                      │
└──────────┬───────────────────────────────────┘
           │
           │ Response
           │ { success: true, message: "..." }
           ▼
┌─────────────────────────────────────┐
│  Mobile App                         │
│  - Display AI response              │
│  - Add to chat history              │
│  - Ready for next question          │
└─────────────────────────────────────┘
```

---

## 🌐 Environment Configuration

```
┌────────────────────────────────────────────────────────────┐
│                      DEVELOPMENT                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Client (Mobile App)                                 │  │
│  │  __DEV__ = true                                      │  │
│  │  API_URL = "http://localhost:3000"                   │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                       │
│                     │ Local network                         │
│                     │ (Same WiFi)                           │
│                     ▼                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Server (Local)                                      │  │
│  │  Running on: http://localhost:3000                   │  │
│  │  MongoDB: Local or Atlas                             │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘

                              VS

┌────────────────────────────────────────────────────────────┐
│                       PRODUCTION                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Client (Mobile App)                                 │  │
│  │  __DEV__ = false                                     │  │
│  │  API_URL = "https://yourapp.up.railway.app"         │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                       │
│                     │ Internet                              │
│                     │ (HTTPS)                               │
│                     ▼                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Server (Railway)                                    │  │
│  │  Running on: https://yourapp.up.railway.app         │  │
│  │  MongoDB: Atlas (Cloud)                              │  │
│  │  Cloudinary: Cloud storage                           │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## 🔄 Continuous Deployment Flow

```
Developer makes changes
        │
        ▼
git commit & push to GitHub
        │
        ▼
┌─────────────────────────────┐
│  GitHub Repository          │
│  (code updated)             │
└──────────┬──────────────────┘
           │
           │ Webhook notification
           ▼
┌─────────────────────────────┐
│  Railway detects change     │
│  - Pulls latest code        │
│  - Starts new build         │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Build Process              │
│  - npm install              │
│  - Run tests (if any)       │
│  - Create deployment        │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Deploy to Production       │
│  - Stop old instance        │
│  - Start new instance       │
│  - Health check             │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Live! ✓                    │
│  Users see updated version  │
└─────────────────────────────┘
```

---

## 🎯 Key Components

### Backend (Server)
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: MongoDB ORM
- **JWT**: Authentication
- **Multer**: File uploads
- **Cloudinary**: Cloud storage
- **Gemini AI**: Chatbot

### Frontend (Mobile)
- **React Native**: Mobile framework
- **Expo**: Development platform
- **TypeScript**: Type safety
- **Axios**: HTTP requests
- **AsyncStorage**: Local storage
- **React Navigation**: Routing

### Infrastructure
- **Railway**: Backend hosting
- **MongoDB Atlas**: Database hosting
- **Cloudinary**: File storage
- **Google AI**: AI services
- **GitHub**: Version control

---

## 📊 Data Flow Summary

```
User Action → Mobile App → API Request → Railway Server
                                              │
                                              ├─→ MongoDB (Data)
                                              ├─→ Cloudinary (Files)
                                              └─→ Gemini AI (Chat)
                                              │
                                         API Response
                                              │
Mobile App ← JSON Data ← Railway Server ←─────┘
     │
     └─→ Update UI
```

---

## 🎉 Result

After deployment:
- ✅ Mobile app on your phone
- ✅ Backend hosted on Railway
- ✅ Database on MongoDB Atlas
- ✅ Files stored on Cloudinary
- ✅ AI powered by Google Gemini
- ✅ Accessible from anywhere
- ✅ Scales automatically

**Your Legal Bridge app is now a fully cloud-native, production-ready application!** 🚀

---

This architecture provides:
- 📱 **Scalability**: Handle thousands of users
- 🔒 **Security**: JWT auth, HTTPS, encrypted data
- 🌍 **Global Access**: Available worldwide
- ⚡ **Performance**: Fast CDN delivery
- 💰 **Cost Effective**: Free tier available
- 🔧 **Maintainable**: Clear separation of concerns
