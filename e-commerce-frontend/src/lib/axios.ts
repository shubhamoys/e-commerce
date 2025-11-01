import axios from 'axios';

// Product Service API Client
export const productServiceApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer Service API Client
export const customerServiceApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CUSTOMER_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
const addAuthInterceptor = (apiClient: typeof axios) => {
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// Response interceptor for error handling
const addResponseInterceptor = (apiClient: typeof axios) => {
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Only redirect if not on login or register page
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
        if (currentPath !== '/login' && currentPath !== '/register') {
          // Clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
};

// Add interceptors to both API clients
addAuthInterceptor(productServiceApi);
addAuthInterceptor(customerServiceApi);
addResponseInterceptor(productServiceApi);
addResponseInterceptor(customerServiceApi);
