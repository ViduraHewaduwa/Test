# Document Analysis Troubleshooting Guide

## Issue: "Server Error" when clicking "Analyze Document"

### Common Causes and Solutions

---

## 1. ✅ Backend Server Not Running

**Symptoms:**
- Network error
- Connection refused
- Timeout

**Solution:**
```bash
cd Server
npm start
# OR if deployed on Railway, check Railway dashboard
```

**Check if backend is running:**
```bash
# Test health endpoint
curl https://test-production-f7c7.up.railway.app/health
```

---

## 2. 🔑 Missing Gemini API Key (Most Common)

**Symptoms:**
- "AI service is not configured"
- HTTP 503 Service Unavailable

**Solution:**

### For Railway (Production):
1. Go to Railway Dashboard
2. Select your project
3. Go to **Variables** tab
4. Add environment variable:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Your Google AI Studio API key

### For Local Development:
1. Create `.env` file in `Server/` directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   ```

### Get Gemini API Key:
1. Visit: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Add to Railway or `.env` file

---

## 3. 📄 PDF Processing Error

**Symptoms:**
- "Failed to extract text from PDF"
- "No text could be extracted"

**Possible Causes:**
- Scanned PDF (image-based, not text-based)
- Encrypted/password-protected PDF
- Corrupted PDF file
- Very large PDF file

**Solution:**
- Use text-based PDFs (not scanned images)
- Remove password protection
- Keep file size under 10MB
- Try a different PDF file

---

## 4. 🌐 CORS or Network Issues

**Symptoms:**
- CORS error in browser console
- Network request blocked

**Solution (Server-side):**

Check `Server/index.js` has CORS enabled:
```javascript
const cors = require('cors');
app.use(cors());
```

---

## 5. 📝 File Upload Configuration

**Symptoms:**
- "Document file is required"
- "File upload incomplete"

**Check Multer Configuration:**

File: `Server/config/multer.js`
```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

module.exports = upload;
```

---

## 6. 🔍 Debugging Steps

### Check Client Console:
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for errors when clicking "Analyze"
4. Note the error message

### Check Server Logs:

**Railway:**
1. Go to Railway Dashboard
2. Click on your deployment
3. View **Logs** tab
4. Look for errors when document is uploaded

**Local:**
```bash
cd Server
npm start
# Watch the terminal for error messages
```

### Test API Endpoint Manually:

Using Postman or curl:
```bash
curl -X POST https://test-production-f7c7.up.railway.app/api/documents/explain \
  -H "Content-Type: multipart/form-data" \
  -F "document=@/path/to/your/test.pdf" \
  -F "language=english"
```

---

## 7. 📊 Verify Backend Endpoints

Check `Server/Routes/documentRoutes.js`:
```javascript
router.post('/explain', 
  upload.single('document'),
  uploadLimiter,
  documentController.explainDocument
);
```

Check route is registered in `Server/index.js`:
```javascript
app.use('/api/documents', documentRoutes);
```

---

## 8. 🗄️ Database Connection

**Symptoms:**
- Cannot save document
- Database connection error

**Solution:**
Check MongoDB connection in Railway variables:
- `MONGODB_URI` should be set correctly

---

## Quick Diagnostic Checklist

- [ ] Backend server is running
- [ ] `GEMINI_API_KEY` is set in Railway/environment variables
- [ ] PDF file is text-based (not scanned image)
- [ ] File size is under 10MB
- [ ] `/uploads` directory exists in Server folder
- [ ] CORS is enabled on backend
- [ ] MongoDB connection is working
- [ ] Can access: `https://test-production-f7c7.up.railway.app/health`

---

## Expected API Response Format

### Success Response:
```json
{
  "success": true,
  "message": "Document explained successfully",
  "data": {
    "documentId": "...",
    "explanation": "...",
    "language": "english",
    "confidence": 0.95,
    "wordCount": 1234,
    "characterCount": 6789
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error message here",
  "errorType": "service_overloaded" // or other error type
}
```

---

## Most Likely Issue: Missing Gemini API Key

**90% of "server error" issues are due to missing Gemini API Key!**

### Fix Now:
1. Get API key from: https://aistudio.google.com/app/apikey
2. Add to Railway Variables: `GEMINI_API_KEY=your_key_here`
3. Redeploy or restart server
4. Test again

---

## Still Having Issues?

1. **Check Railway Logs** for specific error messages
2. **Test with Postman** to isolate frontend vs backend issue
3. **Verify Gemini API quota** hasn't been exceeded
4. **Check file permissions** on uploads directory
5. **Try a simple test PDF** (not scanned)

## Contact Support

If issue persists, provide:
1. Error message from browser console
2. Error message from server logs
3. Sample PDF that's failing (if possible)
4. Screenshot of Railway environment variables (hide sensitive values)
