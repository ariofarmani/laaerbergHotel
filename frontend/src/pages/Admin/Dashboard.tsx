import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUsers, FaBed, FaEuroSign, FaCalendarCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../utils/AuthContext';
import StatsCard from '../../components/StatsCard';
import Loading from '../../components/Loading';
import Card from '../../components/Card';
import Tabs from '../../components/Tabs';

// Mock data for the dashboard
const mockStatistics = {
  reservations: {
    total: 156,
    change: { value: 12, type: 'increase' as const }
  },
  revenue: {
    total: 12568,
    change: { value: 8, type: 'increase' as const }
  },
  occupancy: {
    total: 85,
    change: { value: 5, type: 'increase' as const }
  },
  customers: {
    total: 98,
    change: { value: 3, type: 'decrease' as const }
  }
};

// Mock data for recent reservations
const mockRecentReservations = [
  { id: 1, customer: 'John Doe', apartment: 'Deluxe Studio', checkIn: '2023-05-15', checkOut: '2023-05-20', status: 'confirmed', total: 750 },
  { id: 2, customer: 'Jane Smith', apartment: 'One Bedroom Apartment', checkIn: '2023-05-18', checkOut: '2023-05-25', status: 'pending', total: 980 },
  { id: 3, customer: 'Robert Johnson', apartment: 'Luxury Suite', checkIn: '2023-05-20', checkOut: '2023-05-23', status: 'confirmed', total: 650 },
  { id: 4, customer: 'Emily Brown', apartment: 'Studio', checkIn: '2023-05-22', checkOut: '2023-05-29', status: 'cancelled', total: 840 },
];

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(mockStatistics);
  const [recentReservations, setRecentReservations] = useState(mockRecentReservations);

  useEffect(() => {
    // Check authentication and admin status
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return <Loading />;
  }

  // Status badge styles
  const getStatusBadgeStyle = (status: string) => {
    switch(status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Tabs content
  const dashboardTabs = [
    {
      id: 'overview',
      label: t('admin.dashboard.tabs.overview'),
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>,
      content: (
        <div className="space-y-6">
          {/* Welcome message */}
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-2">{t('admin.dashboard.welcome.title', { name: user?.name })}</h2>
            <p>{t('admin.dashboard.welcome.message')}</p>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              title={t('admin.dashboard.stats.reservations')}
              value={statistics.reservations.total}
              icon={<FaCalendarCheck className="h-6 w-6" />}
              change={statistics.reservations.change}
              color="primary"
              onClick={() => navigate('/admin/reservations')}
            />
            <StatsCard 
              title={t('admin.dashboard.stats.revenue')}
              value={`€${statistics.revenue.total.toLocaleString()}`}
              icon={<FaEuroSign className="h-6 w-6" />}
              change={statistics.revenue.change}
              color="success"
            />
            <StatsCard 
              title={t('admin.dashboard.stats.occupancy')}
              value={`${statistics.occupancy.total}%`}
              icon={<FaBed className="h-6 w-6" />}
              change={statistics.occupancy.change}
              color="warning"
            />
            <StatsCard 
              title={t('admin.dashboard.stats.customers')}
              value={statistics.customers.total}
              icon={<FaUsers className="h-6 w-6" />}
              change={statistics.customers.change}
              color="info"
              onClick={() => navigate('/admin/customers')}
            />
          </div>
          
          {/* Recent reservations */}
          <Card className="overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{t('admin.dashboard.recentReservations.title')}</h3>
              <button 
                className="text-primary text-sm font-medium hover:underline"
                onClick={() => navigate('/admin/reservations')}
              >
                {t('admin.dashboard.recentReservations.viewAll')}
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.dashboard.recentReservations.customer')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.dashboard.recentReservations.apartment')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.dashboard.recentReservations.dates')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.dashboard.recentReservations.status')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.dashboard.recentReservations.total')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/reservations/${reservation.id}`)}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{reservation.customer}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{reservation.apartment}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeStyle(reservation.status)}`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        €{reservation.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'quickActions',
      label: t('admin.dashboard.tabs.quickActions'),
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm11 14a1 1 0 001-1V6a1 1 0 00-1-1H4a1 1 0 00-1 1v9a1 1 0 001 1h12z" clipRule="evenodd"></path></svg>,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate('/admin/apartments/create')}>
            <div className="p-2">
              <h3 className="text-lg font-medium mb-2">{t('admin.dashboard.quickActions.addApartment')}</h3>
              <p className="text-gray-500 text-sm">{t('admin.dashboard.quickActions.addApartmentDesc')}</p>
            </div>
          </Card>
          <Card className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate('/admin/reservations/create')}>
            <div className="p-2">
              <h3 className="text-lg font-medium mb-2">{t('admin.dashboard.quickActions.createReservation')}</h3>
              <p className="text-gray-500 text-sm">{t('admin.dashboard.quickActions.createReservationDesc')}</p>
            </div>
          </Card>
          <Card className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate('/admin/special-offers/create')}>
            <div className="p-2">
              <h3 className="text-lg font-medium mb-2">{t('admin.dashboard.quickActions.addSpecialOffer')}</h3>
              <p className="text-gray-500 text-sm">{t('admin.dashboard.quickActions.addSpecialOfferDesc')}</p>
            </div>
          </Card>
          <Card className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate('/admin/users/create')}>
            <div className="p-2">
              <h3 className="text-lg font-medium mb-2">{t('admin.dashboard.quickActions.createUser')}</h3>
              <p className="text-gray-500 text-sm">{t('admin.dashboard.quickActions.createUserDesc')}</p>
            </div>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.dashboard.title')}</h1>
        <p className="text-gray-500">{t('admin.dashboard.subtitle')}</p>
      </div>

      <Tabs 
        tabs={dashboardTabs} 
        variant="pills" 
        className="mb-6"
      />
    </div>
  );
};

export default Dashboard;