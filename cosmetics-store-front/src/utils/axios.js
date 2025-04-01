import axios from 'axios';

  // Create an Axios instance with a base URL to the backend
  const instance = axios.create({
    baseURL: 'http://localhost:5000/api',  // Ensure this is pointing to your backend's /api routes
  });

  // Add an interceptor to include the token in all requests
  instance.interceptors.request.use(
    (config) => {
      // Retrieve token from local storage
      const token = localStorage.getItem('token');

      if (token) {
        // Attach token to the request header if available
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;  // Return the modified config
    },
    (error) => {
      // Handle request errors (e.g., network issues)
      return Promise.reject(error);
    }
  );

  // Add a response interceptor to handle unauthorized errors
  instance.interceptors.response.use(
    (response) => {
      return response;  // If the request is successful, return the response
    },
    (error) => {
      // Check if the error is due to unauthorized access (status code 401)
      if (error.response && error.response.status === 401) {
        // If a 401 (Unauthorized) error occurs
        console.error('Unauthorized request, redirecting to login...');
        
        // Clear the token from localStorage
        localStorage.removeItem('authToken');
        
        // Redirect the user to the login page
        window.location.href = '/login';  // Adjust the URL if necessary
      }

      // Handle other types of errors if necessary
      if (error.response && error.response.status === 500) {
        console.error('Internal server error. Please try again later.');
      }

      // Return the error so that it can be handled later in the calling component
      return Promise.reject(error);
    }
  );

  export default instance;  // Export the configured axios instance
