import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Authentication context
import { AuthProvider, useAuth, withAuth } from './utils/AuthContext';

// Layout components
import Loading from './components/Loading';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './pages/Admin/Layout';

// Public pages
import Home from './pages/Home';
import Apartments from './pages/Apartments';
import ApartmentDetail from './pages/ApartmentDetail';
import Contact from './pages/Contact';
import Reservation from './pages/Reservation';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';

// Admin pages
import Dashboard from './pages/Admin/Dashboard';
import AdminApartments from './pages/Admin/Apartments';
import AdminReservations from './pages/Admin/Reservations';

// Booking pages
import BookingConfirmation from './pages/Booking/BookingConfirmation';

// Protected admin components
const ProtectedDashboard = withAuth(Dashboard, true);
const ProtectedApartments = withAuth(AdminApartments, true);
const ProtectedReservations = withAuth(AdminReservations, true);

// Auth guard component
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<Loading fullPage />}>
          <ToastContainer position="top-right" autoClose={5000} />
          
          <Routes>
            {/* Admin routes */}
            <Route path="/admin" element={<AuthGuard><AdminLayout /></AuthGuard>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<ProtectedDashboard />} />
              <Route path="apartments" element={<ProtectedApartments />} />
              <Route path="reservations" element={<ProtectedReservations />} />
              
              {/* Add other admin routes as needed */}
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Admin login page (outside admin layout) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Public routes with shared layout */}
            <Route
              path="/*"
              element={
                <>
                  <Header />
                  <main className="min-h-[calc(100vh-120px)]">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/apartments" element={<Apartments />} />
                      <Route path="/apartments/:id" element={<ApartmentDetail />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/reservation/:apartmentId?" element={<Reservation />} />
                      <Route path="/booking/confirmation/:reservationId?" element={<BookingConfirmation />} />
                      
                      {/* 404 page */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;