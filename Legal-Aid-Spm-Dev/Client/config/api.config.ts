/**
 * API Configuration
 * Update this file when deploying to production
 */

// Change this to your Railway/Render URL after deployment
const PRODUCTION_URL = 'https://your-app.railway.app'; // 👈 UPDATE THIS AFTER DEPLOYING

// Development URLs for local testing
const DEVELOPMENT_URLS = {
  android: [
    'http://10.0.2.2:3000',      // Android Emulator
    'http://10.4.2.1:3000',      // Your local network
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ],
  ios: [
    'http://localhost:3000',     // iOS Simulator
    'http://127.0.0.1:3000',
  ],
  default: [
    'http://localhost:3000',
  ]
};

/**
 * Determines if the app is running in production mode
 */
export const isProduction = (): boolean => {
  // You can customize this logic based on your needs
  return !__DEV__; // Returns true when not in development mode
};

/**
 * Get API URLs based on environment and platform
 */
export const getApiUrls = (platform: 'android' | 'ios' | 'default' = 'default'): string[] => {
  if (isProduction()) {
    // In production, use only the production URL
    return [PRODUCTION_URL];
  }
  
  // In development, use local URLs
  return DEVELOPMENT_URLS[platform] || DEVELOPMENT_URLS.default;
};

/**
 * Get the primary API base URL
 */
export const getApiBaseUrl = (platform: 'android' | 'ios' | 'default' = 'default'): string => {
  const urls = getApiUrls(platform);
  return urls[0];
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  POSTS: '/api/posts',
  POLLS: '/api/polls',
  LAWYERS: '/api/lawyers',
  APPOINTMENTS: '/api/appointments',
  DOCUMENTS: '/api/documents',
  NOTIFICATIONS: '/api/notifications',
  NGO: '/api/ngo',
  ADMIN: '/api/admin',
  CHAT: '/api/chat',
};

export default {
  getApiUrls,
  getApiBaseUrl,
  isProduction,
  API_ENDPOINTS,
};
