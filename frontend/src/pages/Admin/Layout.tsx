import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaTachometerAlt, 
  FaBed, 
  FaCalendarAlt, 
  FaUsers, 
  FaMoneyBillWave, 
  FaCog, 
  FaBars, 
  FaSignOutAlt,
  FaTimes,
  FaCaretDown 
} from 'react-icons/fa';

import { useAuth } from '../../utils/AuthContext';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';
import { useMediaQuery } from '../../utils/hooks';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  submenu?: MenuItem[];
}

const AdminLayout: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // State
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);
  
  // Menu items
  const menuItems: MenuItem[] = [
    {
      label: t('admin.sidebar.dashboard'),
      path: '/admin/dashboard',
      icon: <FaTachometerAlt />,
    },
    {
      label: t('admin.sidebar.apartments'),
      path: '/admin/apartments',
      icon: <FaBed />,
      submenu: [
        {
          label: t('admin.sidebar.allApartments'),
          path: '/admin/apartments',
          icon: <FaBed />,
        },
        {
          label: t('admin.sidebar.createApartment'),
          path: '/admin/apartments/create',
          icon: <FaBed />,
        },
      ],
    },
    {
      label: t('admin.sidebar.reservations'),
      path: '/admin/reservations',
      icon: <FaCalendarAlt />,
      submenu: [
        {
          label: t('admin.sidebar.allReservations'),
          path: '/admin/reservations',
          icon: <FaCalendarAlt />,
        },
        {
          label: t('admin.sidebar.createReservation'),
          path: '/admin/reservations/create',
          icon: <FaCalendarAlt />,
        },
      ],
    },
    {
      label: t('admin.sidebar.customers'),
      path: '/admin/customers',
      icon: <FaUsers />,
    },
    {
      label: t('admin.sidebar.finances'),
      path: '/admin/finances',
      icon: <FaMoneyBillWave />,
    },
    {
      label: t('admin.sidebar.settings'),
      path: '/admin/settings',
      icon: <FaCog />,
    },
  ];
  
  // Check authentication on mount
  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    if (user?.role !== 'admin') {
      setAlert({
        type: 'error',
        message: t('admin.errors.notAdmin', 'You do not have permission to access this area'),
      });
      
      // Redirect after alert
      setTimeout(() => {
        navigate('/');
      }, 3000);
      return;
    }
    
    setLoading(false);
  }, [isAuthenticated, user, navigate, t]);
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  // Handle responsive sidebar
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      setAlert({
        type: 'error',
        message: t('admin.errors.logoutFailed', 'Failed to logout'),
      });
    }
  };
  
  // Toggle submenu
  const toggleSubmenu = (path: string) => {
    setExpandedSubmenu(expandedSubmenu === path ? null : path);
  };
  
  // Check if a menu item is active
  const isActive = (path: string) => {
    // Exact match for dashboard
    if (path === '/admin/dashboard') {
      return location.pathname === path;
    }
    
    // For other items, match the beginning of the path
    return location.pathname.startsWith(path);
  };
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`
          fixed z-30 inset-y-0 left-0 transition-all duration-300 transform
          bg-primary text-white w-64 min-h-screen overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-0
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-primary-dark">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold whitespace-nowrap">
              {t('admin.sidebar.title')}
            </span>
          </div>
          <button 
            className="p-1 rounded-md md:hidden hover:bg-primary-dark"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>
        
        {/* User info */}
        <div className="px-4 py-3 border-b border-primary-dark">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-white text-primary flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-300 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        
        {/* Menu items */}
        <nav className="px-3 py-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.path} className="space-y-1">
              {item.submenu ? (
                <>
                  <button
                    className={`
                      w-full flex items-center px-3 py-2 rounded-md text-sm font-medium
                      ${isActive(item.path) ? 'bg-primary-dark text-white' : 'text-gray-200 hover:bg-primary-dark hover:text-white'}
                      transition-colors duration-200
                    `}
                    onClick={() => toggleSubmenu(item.path)}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <FaCaretDown 
                      className={`transition-transform duration-200 ${expandedSubmenu === item.path ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  <div 
                    className={`
                      pl-3 transition-all duration-200 overflow-hidden
                      ${expandedSubmenu === item.path ? 'max-h-96' : 'max-h-0'}
                    `}
                  >
                    {item.submenu.map((subitem) => (
                      <NavLink
                        key={subitem.path}
                        to={subitem.path}
                        className={({ isActive }) => `
                          flex items-center px-3 py-2 rounded-md text-sm font-medium mt-1
                          ${isActive ? 'bg-primary-dark text-white' : 'text-gray-200 hover:bg-primary-dark hover:text-white'}
                          transition-colors duration-200
                        `}
                      >
                        <span className="mr-3 text-sm">{subitem.icon}</span>
                        <span>{subitem.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2 rounded-md text-sm font-medium
                    ${isActive ? 'bg-primary-dark text-white' : 'text-gray-200 hover:bg-primary-dark hover:text-white'}
                    transition-colors duration-200
                  `}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              )}
            </div>
          ))}
          
          {/* Logout */}
          <button
            className="flex w-full items-center px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-primary-dark hover:text-white transition-colors duration-200"
            onClick={handleLogout}
          >
            <span className="mr-3 text-lg"><FaSignOutAlt /></span>
            <span>{t('admin.sidebar.logout')}</span>
          </button>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              className="md:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  className="relative h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center"
                  onClick={() => navigate('/admin/settings')}
                >
                  <FaCog />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Alert */}
        {alert && (
          <div className="m-4">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
              dismissible
            />
          </div>
        )}
        
        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="bg-white shadow-sm border-t">
          <div className="px-4 py-3 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {t('admin.footer.copyright', 'Laaerberg Apart Hotel. All rights reserved.')}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;