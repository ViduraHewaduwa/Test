// API Configuration for different environments
const isDevelopment = __DEV__;

// ✅ Your Railway Production URL
const PRODUCTION_API_URL = 'https://test-production-f7c7.up.railway.app';

// For local development (when server is running on your computer)
const DEVELOPMENT_API_URL = 'http://localhost:3000';

// 🚀 Currently using Railway URL for mobile app
const API_URL = PRODUCTION_API_URL;

// 📝 To use auto-switching (uncomment when testing locally):
// const API_URL = isDevelopment ? DEVELOPMENT_API_URL : PRODUCTION_API_URL;

export default API_URL;

// Export individual endpoints for easier use
export const API_ENDPOINTS = {
  // Auth
  login: `${API_URL}/api/auth/login`,
  register: `${API_URL}/api/auth/register`,
  
  // Documents
  documents: `${API_URL}/api/documents`,
  uploadDocument: `${API_URL}/api/documents/upload`,
  analyzeDocument: (id: string) => `${API_URL}/api/documents/${id}/analyze`,
  
  // Lawyers
  lawyers: `${API_URL}/api/lawyers`,
  lawyerById: (id: string) => `${API_URL}/api/lawyers/${id}`,
  lawyerProfile: `${API_URL}/api/lawyers/AddprofileDetails`,
  appointments: `${API_URL}/api/appointments`,
  
  // Chat
  chat: `${API_URL}/api/chat`,
  chatModels: `${API_URL}/api/chat/models`,
  
  // NGO
  ngo: `${API_URL}/api/ngo`,
  ngoMatching: `${API_URL}/api/ngo/matching`,
  
  // Posts & Polls
  posts: `${API_URL}/api/posts`,
  polls: `${API_URL}/api/polls`,
  
  // Notifications
  notifications: `${API_URL}/api/notifications`,
  
  // Admin
  admin: `${API_URL}/api/admin`,
  
  // Document Generator
  documentGenerator: `${API_URL}/api/documents/generate`,
  documentTemplates: `${API_URL}/api/documents/generate/templates`,
  documentPreview: `${API_URL}/api/documents/generate/preview`,
  
  // Health Check
  health: `${API_URL}/health`,
};

// Export for debugging
export const getApiConfig = () => ({
  isDevelopment,
  currentUrl: API_URL,
  environment: isDevelopment ? 'development' : 'production',
  timestamp: new Date().toISOString(),
});

// Helper function to log API configuration (for debugging)
export const logApiConfig = () => {
  const config = getApiConfig();
  console.log('='.repeat(60));
  console.log('📡 API Configuration');
  console.log('='.repeat(60));
  console.log(`Environment: ${config.environment}`);
  console.log(`API URL: ${config.currentUrl}`);
  console.log(`Is Development: ${config.isDevelopment}`);
  console.log(`Timestamp: ${config.timestamp}`);
  console.log('='.repeat(60));
};
