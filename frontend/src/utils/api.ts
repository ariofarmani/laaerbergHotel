import axios from 'axios';
import { shouldUseMockData } from './mockData';
import { 
  mockApartmentsApi,
  mockReservationsApi,
  mockAuthApi,
  mockContactApi,
  mockAdminApi
} from './mockApi';

// Create an axios instance with default configs
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://laaerberg-hotel-api.onrender.com/api'  // Replace with your actual backend URL
      : 'http://localhost:5000/api'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error status codes
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear local auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    
    return Promise.reject(error);
  }
);

// API function for apartments
export const apartmentsApi = shouldUseMockData() 
  ? mockApartmentsApi 
  : {
    getAll: () => api.get('/apartments'),
    getById: (id: number) => api.get(`/apartments/${id}`),
    checkAvailability: (apartmentId: number, checkIn: string, checkOut: string) => 
      api.get(`/apartments/${apartmentId}/availability`, {
        params: { checkIn, checkOut }
      }),
  };

// API function for reservations
export const reservationsApi = shouldUseMockData()
  ? mockReservationsApi
  : {
    create: (reservationData: any) => api.post('/reservations', reservationData),
    getById: (id: number) => api.get(`/reservations/${id}`),
    updatePaymentStatus: (id: number, paymentData: any) => 
      api.patch(`/reservations/${id}/payment`, paymentData),
    getUserReservations: () => api.get('/user/reservations'),
  };

// API function for authentication
export const authApi = shouldUseMockData()
  ? mockAuthApi
  : {
    login: (credentials: { email: string; password: string }) => 
      api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    register: (userData: any) => api.post('/auth/register', userData),
  };

// API function for contact form
export const contactApi = shouldUseMockData()
  ? mockContactApi
  : {
    submitContactForm: (formData: any) => api.post('/contact', formData),
  };

// API function for admin operations
export const adminApi = shouldUseMockData()
  ? mockAdminApi
  : {
    getReservations: (params: any) => api.get('/admin/reservations', { params }),
    updateReservation: (id: number, data: any) => api.patch(`/admin/reservations/${id}`, data),
    getApartments: () => api.get('/admin/apartments'),
    updateApartment: (id: number, data: any) => api.patch(`/admin/apartments/${id}`, data),
    createApartment: (data: any) => api.post('/admin/apartments', data),
    getStatistics: () => api.get('/admin/statistics'),
  };

export default api;