import axios from 'axios';

// Configure Axios instance with environment-aware settings
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://69.62.73.88',
  timeout: 15000, // 15-second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// ======================
// Request Interceptor
// ======================
instance.interceptors.request.use(
  (config) => {
    // Attach auth token if available
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// ======================
// Response Interceptor
// ======================
instance.interceptors.response.use(
  (response) => {
    // Log request duration
    if (response.config.metadata?.startTime) {
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;
      console.debug(`API call to ${response.config.url} took ${duration}ms`);
    }
    
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.response) {
      switch (error.response.status) {
        case 401: // Unauthorized
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          window.location.href = '/login?session_expired=true';
          break;

        case 403: // Forbidden
          window.location.href = '/unauthorized';
          break;

        case 429: // Rate limited
          console.warn('Rate limited:', error.response.data);
          break;

        case 500: // Server error
          console.error('Server error:', error.response.data);
          break;

        default:
          console.error('API Error:', error.response.status, error.response.data);
      }
    } else if (error.request) {
      console.error('Network Error:', 'No response received');
    } else {
      console.error('Request Setup Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// ======================
// Custom Methods
// ======================
/**
 * Helper method for making authenticated requests
 */
instance.authenticatedRequest = async (config) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token available');
  
  return instance({
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`
    }
  });
};

export default instance;
