import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };
    
    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };
  
  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mr-2">
              <span className="text-primary font-bold text-xl">L</span>
            </div>
            <div>
              <h1 className={`font-bold text-xl ${isScrolled || !isHomePage ? 'text-gray-800' : 'text-white'}`}>
                Laaerberg
              </h1>
              <p className={`text-xs ${isScrolled || !isHomePage ? 'text-gray-600' : 'text-white/80'}`}>
                Apart Hotel
              </p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => `
                ${isScrolled || !isHomePage ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-white/80'} 
                ${isActive ? 'font-semibold' : 'font-medium'}
              `}
            >
              {t('nav.home', 'Home')}
            </NavLink>
            <NavLink 
              to="/apartments" 
              className={({ isActive }) => `
                ${isScrolled || !isHomePage ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-white/80'} 
                ${isActive ? 'font-semibold' : 'font-medium'}
              `}
            >
              {t('nav.apartments', 'Apartments')}
            </NavLink>
            <NavLink 
              to="/reservation" 
              className={({ isActive }) => `
                ${isScrolled || !isHomePage ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-white/80'} 
                ${isActive ? 'font-semibold' : 'font-medium'}
              `}
            >
              {t('nav.reservation', 'Reservation')}
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => `
                ${isScrolled || !isHomePage ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-white/80'} 
                ${isActive ? 'font-semibold' : 'font-medium'}
              `}
            >
              {t('nav.contact', 'Contact')}
            </NavLink>
          </nav>
          
          {/* User Menu */}
          <div className="hidden md:flex items-center">
            {isLoggedIn ? (
              <div className="relative group">
                <button className={`flex items-center space-x-1 ${isScrolled || !isHomePage ? 'text-gray-600' : 'text-white'}`}>
                  <FaUser />
                  <span className="font-medium">Account</span>
                </button>
                
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                  {isLoggedIn && JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' && (
                    <Link 
                      to="/admin/dashboard" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      {t('nav.dashboard', 'Dashboard')}
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {t('nav.logout', 'Logout')}
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/admin/login" 
                className={`flex items-center ${isScrolled || !isHomePage ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-white/80'}`}
              >
                <FaUser className="mr-1" />
                <span className="font-medium">{t('nav.adminLogin', 'Admin Login')}</span>
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className={`md:hidden ${isScrolled || !isHomePage ? 'text-gray-800' : 'text-white'}`}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <nav className="container mx-auto px-4 py-4 flex flex-col">
            <NavLink 
              to="/" 
              className={({ isActive }) => `
                py-3 px-4 border-b border-gray-100 ${isActive ? 'text-primary font-semibold' : 'text-gray-600'}
              `}
            >
              {t('nav.home', 'Home')}
            </NavLink>
            <NavLink 
              to="/apartments" 
              className={({ isActive }) => `
                py-3 px-4 border-b border-gray-100 ${isActive ? 'text-primary font-semibold' : 'text-gray-600'}
              `}
            >
              {t('nav.apartments', 'Apartments')}
            </NavLink>
            <NavLink 
              to="/reservation" 
              className={({ isActive }) => `
                py-3 px-4 border-b border-gray-100 ${isActive ? 'text-primary font-semibold' : 'text-gray-600'}
              `}
            >
              {t('nav.reservation', 'Reservation')}
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => `
                py-3 px-4 border-b border-gray-100 ${isActive ? 'text-primary font-semibold' : 'text-gray-600'}
              `}
            >
              {t('nav.contact', 'Contact')}
            </NavLink>
            
            {isLoggedIn ? (
              <>
                {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    className="py-3 px-4 border-b border-gray-100 text-gray-600"
                  >
                    {t('nav.dashboard', 'Dashboard')}
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="py-3 px-4 text-left text-gray-600"
                >
                  {t('nav.logout', 'Logout')}
                </button>
              </>
            ) : (
              <Link 
                to="/admin/login" 
                className="py-3 px-4 text-gray-600"
              >
                {t('nav.adminLogin', 'Admin Login')}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;