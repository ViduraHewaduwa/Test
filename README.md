# Legal Bridge - Legal Aid Application

A comprehensive legal aid mobile application built with React Native (Expo) and Node.js, featuring AI-powered legal assistance, document management, lawyer appointments, and NGO matching.

---

## 🚀 Quick Deploy to Railway

**Want to get your app online fast?** Follow our quick start guide:

👉 **[QUICK START GUIDE - Deploy in 30 minutes](./QUICK_START_RAILWAY.md)** 👈

---

## 📚 Complete Documentation

- 📖 **[Complete Railway Deployment Guide](./RAILWAY_DEPLOYMENT_GUIDE.md)** - Detailed step-by-step deployment instructions
- 📱 **[Mobile App Configuration Guide](./MOBILE_CONFIGURATION_GUIDE.md)** - Configure your mobile app to connect to Railway

---

## 🛠️ Local Development Setup

### Server Side Setup

1. **Install dependencies:**
   ```bash
   cd Server
   npm install
   ```

2. **Create `.env` file:**
   ```env
   DB_URL=mongodb://localhost:27017/legalbridge
   PORT=3000
   JWT_SECRET=your_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Run the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

### Client Side Setup

1. **Install dependencies:**
   ```bash
   cd Client
   npm install
   ```

2. **Update API configuration:**
   - Open `Client/config/api.ts`
   - Ensure `DEVELOPMENT_API_URL` points to your local server

3. **Start the app:**
   ```bash
   npm start
   ```

4. **Run on device:**
   - Scan QR code with Expo Go app (iOS/Android)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator

---

## 🌟 Features

- 🤖 **AI Legal Assistant** - Powered by Google Gemini
- 📄 **Document Management** - Upload, analyze, and generate legal documents
- 👨‍⚖️ **Lawyer Directory** - Find and book appointments with lawyers
- 🏛️ **NGO Matching** - Connect with relevant NGOs
- 💬 **Community Forum** - Posts, polls, and discussions
- 🔔 **Notifications** - Real-time updates
- 🌐 **Multilingual** - Support for English, Sinhala, and Tamil
- 🔐 **Secure Authentication** - JWT-based auth system

---

## 📦 Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Google Gemini AI
- Cloudinary (file uploads)
- JWT Authentication
- Multer (file handling)

### Frontend
- React Native (Expo)
- TypeScript
- React Navigation
- Axios
- React Native Paper
- i18next (internationalization)
- Expo modules (Camera, Document Picker, etc.)

---

## 🔧 Environment Variables

### Required for Railway Deployment

```env
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname
PORT=3000
NODE_ENV=production
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ALLOWED_ORIGINS=https://your-railway-app.up.railway.app
```

See `.env.example` for a complete template.

---

## 📱 Mobile App Usage

### After Railway Deployment

1. Update `Client/config/api.ts` with your Railway URL
2. Rebuild the app or clear cache
3. Install Expo Go on your phone
4. Scan QR code from terminal
5. App connects to Railway backend automatically!

---

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl https://your-railway-url.up.railway.app/health

# List available endpoints
curl https://your-railway-url.up.railway.app/
```

### Test on Mobile

1. Open app in Expo Go
2. Check API connection indicator
3. Try login/register
4. Test document upload
5. Try chatbot feature

---

## 📄 API Documentation

### Main Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/lawyers` - Get all lawyers
- `POST /api/appointments` - Book appointment
- `POST /api/documents/upload` - Upload document
- `POST /api/documents/:id/analyze` - Analyze document with AI
- `POST /api/chat` - Chat with AI assistant
- `GET /api/posts` - Get community posts
- `GET /api/ngo` - Get NGO listings

Full API documentation available at root endpoint (`/`) when server is running.

---

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MongoDB connection string
- Verify all environment variables are set
- Ensure PORT is not already in use

**Mobile app can't connect:**
- Verify API URL in `Client/config/api.ts`
- Check Railway deployment is successful
- Test backend URL in browser first
- Restart Expo with cache clear: `npm start -- --clear`

**File uploads fail:**
- Configure Cloudinary properly
- Check Cloudinary credentials in Railway
- Verify file size limits

See full troubleshooting guide in [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📜 License

[Add your license here]

---

## 🆘 Support

For deployment help:
- 📖 Read [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md)
- 📱 Check [MOBILE_CONFIGURATION_GUIDE.md](./MOBILE_CONFIGURATION_GUIDE.md)
- ⚡ Try [QUICK_START_RAILWAY.md](./QUICK_START_RAILWAY.md) for quick setup

---

## 🎉 Ready to Deploy?

Get your app online in 30 minutes:

👉 **[Start with Quick Deploy Guide](./QUICK_START_RAILWAY.md)** 👈

---

**Built with ❤️ for legal aid accessibility**

