import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHome, FaCalendarAlt, FaBuilding, FaUsers, FaMoneyBill, FaCog, FaBell, FaSignOutAlt } from 'react-icons/fa';

// Import mock data (in real app this would come from API)
import { mockApartments } from './ApartmentDetail';

// Admin Dashboard Pages
const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  
  // Mock statistics
  const stats = {
    totalReservations: 24,
    occupancyRate: 68,
    pendingReservations: 5,
    revenue: 8650
  };
  
  // Mock recent reservations
  const recentReservations = [
    { id: 1, name: 'John Doe', apartment: 'Studio Apartment 1', checkIn: '2023-08-15', checkOut: '2023-08-20', status: 'confirmed' },
    { id: 2, name: 'Jane Smith', apartment: 'Studio Apartment 3', checkIn: '2023-08-18', checkOut: '2023-08-25', status: 'pending' },
    { id: 3, name: 'Bob Johnson', apartment: 'Studio Apartment 2', checkIn: '2023-08-22', checkOut: '2023-08-24', status: 'confirmed' },
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('admin.dashboardTitle', 'Dashboard')}</h1>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 mb-2">{t('admin.totalReservations', 'Total Reservations')}</h3>
          <p className="text-3xl font-bold">{stats.totalReservations}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 mb-2">{t('admin.occupancyRate', 'Occupancy Rate')}</h3>
          <p className="text-3xl font-bold">{stats.occupancyRate}%</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 mb-2">{t('admin.pendingReservations', 'Pending Reservations')}</h3>
          <p className="text-3xl font-bold">{stats.pendingReservations}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 mb-2">{t('admin.revenue', 'Revenue (€)')}</h3>
          <p className="text-3xl font-bold">{stats.revenue}</p>
        </div>
      </div>
      
      {/* Recent Reservations */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('admin.recentReservations', 'Recent Reservations')}</h2>
          <NavLink to="/admin/dashboard/reservations" className="text-primary hover:text-primary-dark">
            {t('admin.viewAll', 'View All')}
          </NavLink>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-3">{t('admin.guest', 'Guest')}</th>
                <th className="pb-3">{t('admin.apartment', 'Apartment')}</th>
                <th className="pb-3">{t('admin.checkIn', 'Check-in')}</th>
                <th className="pb-3">{t('admin.checkOut', 'Check-out')}</th>
                <th className="pb-3">{t('admin.status', 'Status')}</th>
              </tr>
            </thead>
            <tbody>
              {recentReservations.map(reservation => (
                <tr key={reservation.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{reservation.name}</td>
                  <td className="py-3">{reservation.apartment}</td>
                  <td className="py-3">{reservation.checkIn}</td>
                  <td className="py-3">{reservation.checkOut}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      reservation.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservation.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Reservations: React.FC = () => {
  const { t } = useTranslation();
  
  // Mock reservations data
  const [reservations, setReservations] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', apartment: 'Studio Apartment 1', checkIn: '2023-08-15', checkOut: '2023-08-20', status: 'confirmed', payment: 'paid' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', apartment: 'Studio Apartment 3', checkIn: '2023-08-18', checkOut: '2023-08-25', status: 'pending', payment: 'pending' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', apartment: 'Studio Apartment 2', checkIn: '2023-08-22', checkOut: '2023-08-24', status: 'confirmed', payment: 'paid' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', apartment: 'Studio Apartment 5', checkIn: '2023-08-25', checkOut: '2023-08-30', status: 'confirmed', payment: 'paid' },
    { id: 5, name: 'Michael Brown', email: 'michael@example.com', apartment: 'Studio Apartment 4', checkIn: '2023-09-01', checkOut: '2023-09-05', status: 'pending', payment: 'pending' },
  ]);
  
  const [filter, setFilter] = useState('all');
  
  const filteredReservations = filter === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filter);
  
  const updateReservationStatus = (id: number, status: string) => {
    setReservations(reservations.map(r => {
      if (r.id === id) {
        return { ...r, status };
      }
      return r;
    }));
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('admin.reservationsTitle', 'Reservations')}</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            {t('admin.all', 'All')}
          </button>
          <button 
            onClick={() => setFilter('pending')} 
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            {t('admin.pending', 'Pending')}
          </button>
          <button 
            onClick={() => setFilter('confirmed')} 
            className={`px-4 py-2 rounded ${filter === 'confirmed' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            {t('admin.confirmed', 'Confirmed')}
          </button>
          <button 
            onClick={() => setFilter('cancelled')} 
            className={`px-4 py-2 rounded ${filter === 'cancelled' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            {t('admin.cancelled', 'Cancelled')}
          </button>
        </div>
      </div>
      
      {/* Reservations List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3">{t('admin.guest', 'Guest')}</th>
                <th className="px-6 py-3">{t('admin.email', 'Email')}</th>
                <th className="px-6 py-3">{t('admin.apartment', 'Apartment')}</th>
                <th className="px-6 py-3">{t('admin.dates', 'Dates')}</th>
                <th className="px-6 py-3">{t('admin.status', 'Status')}</th>
                <th className="px-6 py-3">{t('admin.payment', 'Payment')}</th>
                <th className="px-6 py-3">{t('admin.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map(reservation => (
                <tr key={reservation.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{reservation.name}</td>
                  <td className="px-6 py-4">{reservation.email}</td>
                  <td className="px-6 py-4">{reservation.apartment}</td>
                  <td className="px-6 py-4">
                    {reservation.checkIn} to {reservation.checkOut}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      reservation.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : reservation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      reservation.payment === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservation.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {reservation.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          {t('admin.confirm', 'Confirm')}
                        </button>
                        <button 
                          onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          {t('admin.cancel', 'Cancel')}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredReservations.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {t('admin.noReservations', 'No reservations found.')}
          </div>
        )}
      </div>
    </div>
  );
};

const Apartments: React.FC = () => {
  const { t } = useTranslation();
  
  // Using mock apartments data
  const [apartments, setApartments] = useState(mockApartments || []);
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('admin.apartmentsTitle', 'Apartments')}</h1>
      
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3">{t('admin.name', 'Name')}</th>
                <th className="px-6 py-3">{t('admin.type', 'Type')}</th>
                <th className="px-6 py-3">{t('admin.price', 'Price (€/night)')}</th>
                <th className="px-6 py-3">{t('admin.maxGuests', 'Max Guests')}</th>
                <th className="px-6 py-3">{t('admin.status', 'Status')}</th>
                <th className="px-6 py-3">{t('admin.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {apartments.map(apartment => (
                <tr key={apartment.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{apartment.name}</td>
                  <td className="px-6 py-4">{apartment.type}</td>
                  <td className="px-6 py-4">€{apartment.price}</td>
                  <td className="px-6 py-4">{apartment.maxGuests}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      apartment.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {apartment.available ? t('admin.available', 'Available') : t('admin.unavailable', 'Unavailable')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      {t('admin.edit', 'Edit')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {apartments.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {t('admin.noApartments', 'No apartments found.')}
          </div>
        )}
      </div>
    </div>
  );
};

// Main AdminDashboard layout
const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
              <h2 className="text-xl font-bold mb-6">{t('admin.adminPanel', 'Admin Panel')}</h2>
              
              <nav className="space-y-1">
                <NavLink 
                  to="/admin/dashboard" 
                  end
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-md transition-colors ${
                      isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`
                  }
                >
                  <FaHome className="mr-3" />
                  {t('admin.dashboard', 'Dashboard')}
                </NavLink>
                
                <NavLink 
                  to="/admin/dashboard/reservations" 
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-md transition-colors ${
                      isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`
                  }
                >
                  <FaCalendarAlt className="mr-3" />
                  {t('admin.reservations', 'Reservations')}
                </NavLink>
                
                <NavLink 
                  to="/admin/dashboard/apartments" 
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-md transition-colors ${
                      isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`
                  }
                >
                  <FaBuilding className="mr-3" />
                  {t('admin.apartments', 'Apartments')}
                </NavLink>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FaSignOutAlt className="mr-3" />
                  {t('admin.logout', 'Logout')}
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/apartments" element={<Apartments />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;