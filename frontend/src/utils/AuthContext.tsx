import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './types';
import { api } from './api';
import { mockLogin, mockLogout } from './mockApi';
import { shouldUseMockData } from './mockData';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isAuthenticated = !!user;
  
  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        if (shouldUseMockData()) {
          // Mock authentication for development
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } else {
          // Real API authentication
          const response = await api.get('/auth/me');
          setUser(response.data.user);
        }
      } catch (err) {
        // Clear invalid auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        console.error('Authentication check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      let userData: User;
      let token: string;
      
      if (shouldUseMockData()) {
        // Mock login for development
        const mockResponse = await mockLogin(email, password);
        
        if (!mockResponse.success) {
          setError(mockResponse.message || 'Invalid email or password');
          setIsLoading(false);
          return false;
        }
        
        userData = mockResponse.user;
        token = mockResponse.token;
      } else {
        // Real API login
        const response = await api.post('/auth/login', { email, password });
        userData = response.data.user;
        token = response.data.token;
      }
      
      // Save auth data
      localStorage.setItem('authToken', token);
      
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      setUser(userData);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };
  
  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      if (shouldUseMockData()) {
        // Mock logout for development
        await mockLogout();
      } else {
        // Real API logout
        await api.post('/auth/logout');
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsLoading(false);
    }
  };
  
  // Clear error
  const clearError = () => {
    setError(null);
  };
  
  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    logout,
    clearError,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Higher-order component for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requireAdmin = false
): React.FC<P> => {
  const WithAuth: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    
    if (isLoading) {
      return <div className="flex justify-center items-center h-64">Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return (
        <div className="text-center p-4">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="mb-4">You need to be logged in to view this page.</p>
          <a href="/admin/login" className="text-primary hover:underline">
            Login
          </a>
        </div>
      );
    }
    
    if (requireAdmin && user?.role !== 'admin') {
      return (
        <div className="text-center p-4">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="mb-4">You don't have permission to access this page.</p>
          <a href="/" className="text-primary hover:underline">
            Return to Home
          </a>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
  
  return WithAuth;
};

export default AuthContext;