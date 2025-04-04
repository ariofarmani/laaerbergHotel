// Mock data for api endpoints
import { mockApartments } from '../pages/ApartmentDetail';

// Helper function to simulate async API calls
const simulateResponse = <T>(data: T, delay = 500): Promise<{ data: T }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });
};

// Mock reservations data
const mockReservations = [
  {
    id: 1, 
    apartmentId: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+43 123 456 7890',
    checkIn: '2023-10-15',
    checkOut: '2023-10-18',
    guests: 2,
    status: 'confirmed',
    payment: 'paid',
    totalPrice: 225
  },
  {
    id: 2, 
    apartmentId: 3,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+43 098 765 4321',
    checkIn: '2023-10-20',
    checkOut: '2023-10-25',
    guests: 3,
    status: 'pending',
    payment: 'pending',
    totalPrice: 475
  }
];

// Mock apartments API
export const mockApartmentsApi = {
  getAll: () => simulateResponse(mockApartments),
  getById: (id: number) => {
    const apartment = mockApartments.find(a => a.id === id);
    if (apartment) {
      return simulateResponse(apartment);
    } else {
      return Promise.reject({ response: { status: 404, data: { message: 'Apartment not found' } } });
    }
  },
  checkAvailability: (apartmentId: number, checkIn: string, checkOut: string) => {
    // Simple mock implementation - actual would check reservations database
    // Let's assume odd IDs are available for simplicity
    const isAvailable = apartmentId % 2 === 1;
    return simulateResponse({ available: isAvailable });
  }
};

// Mock reservations API
export const mockReservationsApi = {
  create: (reservationData: any) => {
    const newReservation = {
      id: mockReservations.length + 1,
      ...reservationData,
      status: 'pending',
      payment: 'pending',
      createdAt: new Date().toISOString()
    };
    mockReservations.push(newReservation);
    return simulateResponse(newReservation);
  },
  getById: (id: number) => {
    const reservation = mockReservations.find(r => r.id === id);
    if (reservation) {
      return simulateResponse(reservation);
    } else {
      return Promise.reject({ response: { status: 404, data: { message: 'Reservation not found' } } });
    }
  },
  updatePaymentStatus: (id: number, paymentData: any) => {
    const index = mockReservations.findIndex(r => r.id === id);
    if (index !== -1) {
      mockReservations[index] = {
        ...mockReservations[index],
        payment: paymentData.status,
        updatedAt: new Date().toISOString()
      };
      return simulateResponse(mockReservations[index]);
    } else {
      return Promise.reject({ response: { status: 404, data: { message: 'Reservation not found' } } });
    }
  },
  getUserReservations: () => {
    // In a real app, this would filter by the authenticated user
    return simulateResponse(mockReservations);
  }
};

// Mock auth API
export const mockAuthApi = {
  login: (credentials: { email: string; password: string }) => {
    // Mock admin login
    if (credentials.email === 'admin@laaerberghotel.com' && credentials.password === 'admin123') {
      return simulateResponse({
        token: 'mock-jwt-token',
        user: {
          id: 1,
          email: credentials.email,
          name: 'Admin User',
          role: 'admin'
        }
      });
    } else {
      return Promise.reject({ 
        response: { 
          status: 401, 
          data: { message: 'Invalid credentials' } 
        } 
      });
    }
  },
  logout: () => {
    return simulateResponse({ success: true });
  },
  register: (userData: any) => {
    return simulateResponse({
      token: 'mock-jwt-token',
      user: {
        id: 2,
        ...userData,
        role: 'user'
      }
    });
  }
};

// Mock contact form API
export const mockContactApi = {
  submitContactForm: (formData: any) => {
    return simulateResponse({
      success: true,
      message: 'Your message has been sent. We will contact you shortly.',
      id: Math.floor(Math.random() * 10000)
    });
  }
};

// Mock admin API
export const mockAdminApi = {
  getReservations: (params: any) => {
    let filtered = [...mockReservations];
    
    // Filter by status if provided
    if (params.status) {
      filtered = filtered.filter(r => r.status === params.status);
    }
    
    return simulateResponse({
      reservations: filtered,
      total: filtered.length
    });
  },
  updateReservation: (id: number, data: any) => {
    const index = mockReservations.findIndex(r => r.id === id);
    if (index !== -1) {
      mockReservations[index] = {
        ...mockReservations[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return simulateResponse(mockReservations[index]);
    } else {
      return Promise.reject({ response: { status: 404, data: { message: 'Reservation not found' } } });
    }
  },
  getApartments: () => {
    return simulateResponse(mockApartments);
  },
  updateApartment: (id: number, data: any) => {
    const apartment = mockApartments.find(a => a.id === id);
    if (apartment) {
      Object.assign(apartment, data);
      return simulateResponse(apartment);
    } else {
      return Promise.reject({ response: { status: 404, data: { message: 'Apartment not found' } } });
    }
  },
  createApartment: (data: any) => {
    const newApartment = {
      id: mockApartments.length + 1,
      ...data
    };
    mockApartments.push(newApartment);
    return simulateResponse(newApartment);
  },
  getStatistics: () => {
    return simulateResponse({
      totalReservations: mockReservations.length,
      pendingReservations: mockReservations.filter(r => r.status === 'pending').length,
      confirmedReservations: mockReservations.filter(r => r.status === 'confirmed').length,
      revenue: mockReservations
        .filter(r => r.payment === 'paid')
        .reduce((total, r) => total + r.totalPrice, 0),
      occupancyRate: 68 // Mock value
    });
  }
};