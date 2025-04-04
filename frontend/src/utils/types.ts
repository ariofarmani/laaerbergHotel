// Define TypeScript interfaces for the application

// User related types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Apartment related types
export interface Apartment {
  id: string;
  name: string;
  description: string;
  price: number;
  size: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities: string[];
  available: boolean;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApartmentSearchParams {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  query?: string;
}

// Reservation related types
export interface Reservation {
  id: string;
  apartmentId: string;
  userId?: string;
  guestDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: 'credit_card' | 'paypal' | 'bank_transfer';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationRequest {
  apartmentId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  paymentDetails?: any;
}

// Contact form type
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error response type
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Dashboard statistics type
export interface DashboardStats {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
  totalApartments: number;
  occupiedApartments: number;
  availableApartments: number;
  maintenanceApartments: number;
  recentReservations: Reservation[];
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

// Availability check types
export interface AvailabilityCheckRequest {
  apartmentId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface AvailabilityCheckResponse {
  available: boolean;
  price: number;
  totalPrice: number;
  nights: number;
  message?: string;
}