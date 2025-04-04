import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';
import { useLocalStorage } from './hooks';
import { shouldUseMockData } from './mockData';

// User interface
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  checkAuth: async () => false,
});

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('laaerberg_user', null);
  const [token, setToken] = useLocalStorage<string | null>('laaerberg_token', null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if the user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Call login API
      const response = await api.post('/auth/login', { email, password });
      
      // Set user and token in state and local storage
      const { user: userData, token: authToken } = response.data;
      setUser(userData);
      setToken(authToken);
      
      // Set auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear user and token
    setUser(null);
    setToken(null);
    
    // Remove auth header
    delete api.defaults.headers.common['Authorization'];
    
    // Redirect to home page
    navigate('/');
  };

  // Check auth function
  const checkAuth = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // If using mock data, check local storage
      if (shouldUseMockData()) {
        setIsLoading(false);
        return !!user;
      }
      
      // If no token, not authenticated
      if (!token) {
        setIsLoading(false);
        return false;
      }
      
      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Call verify token API
      const response = await api.get('/auth/verify');
      const { user: userData } = response.data;
      
      // Update user data if needed
      if (JSON.stringify(userData) !== JSON.stringify(user)) {
        setUser(userData);
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      // Token verification failed, logout
      console.error('Auth verification failed:', error);
      setUser(null);
      setToken(null);
      delete api.defaults.headers.common['Authorization'];
      setIsLoading(false);
      return false;
    }
  };

  // Check if user is admin
  const isAdmin = !!user && user.role === 'admin';
  
  // Check if user is authenticated
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        isAdmin, 
        isLoading, 
        login, 
        logout, 
        checkAuth 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Protect admin routes
export const AdminRoute: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return isAuthenticated && isAdmin ? <>{children}</> : null;
};

// Protect authenticated routes
export const ProtectedRoute: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AuthContext;