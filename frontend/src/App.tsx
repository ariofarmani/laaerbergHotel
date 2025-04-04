import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout components
import Header from './components/Header';
import Footer from './components/Footer';

// Regular pages - eagerly loaded
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Lazy loaded pages
const Apartments = lazy(() => import('./pages/Apartments'));
const ApartmentDetail = lazy(() => import('./pages/ApartmentDetail'));
const Reservation = lazy(() => import('./pages/Reservation'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/apartments" element={<Apartments />} />
              <Route path="/apartments/:id" element={<ApartmentDetail />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/reservation/:apartmentId" element={<Reservation />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Auth routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected admin routes */}
              <Route 
                path="/admin/dashboard/*" 
                element={
                  localStorage.getItem('authToken') ? (
                    <AdminDashboard />
                  ) : (
                    <AdminLogin />
                  )
                } 
              />
              
              {/* 404 - Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;