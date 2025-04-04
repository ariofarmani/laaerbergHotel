import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaFilter, FaCalendarAlt, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../utils/AuthContext';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';
import DateRangePicker from '../../components/DateRangePicker';
import { formatDate } from '../../utils/helpers';

// Mock data for reservations
const mockReservations = [
  { 
    id: 1, 
    customer: 'John Doe', 
    email: 'john@example.com',
    phone: '+43 123 456 789',
    apartment: 'Deluxe Studio',
    apartmentId: 3,
    checkIn: '2023-05-15', 
    checkOut: '2023-05-20', 
    status: 'confirmed', 
    total: 750,
    guests: 2,
    createdAt: '2023-04-20',
  },
  { 
    id: 2, 
    customer: 'Jane Smith', 
    email: 'jane@example.com',
    phone: '+43 987 654 321',
    apartment: 'One Bedroom Apartment',
    apartmentId: 1,
    checkIn: '2023-05-18', 
    checkOut: '2023-05-25', 
    status: 'pending', 
    total: 980,
    guests: 3,
    createdAt: '2023-04-25',
  },
  { 
    id: 3, 
    customer: 'Robert Johnson', 
    email: 'robert@example.com',
    phone: '+43 555 123 456',
    apartment: 'Luxury Suite',
    apartmentId: 5,
    checkIn: '2023-05-20', 
    checkOut: '2023-05-23', 
    status: 'confirmed', 
    total: 650,
    guests: 4,
    createdAt: '2023-04-27',
  },
  { 
    id: 4, 
    customer: 'Emily Brown', 
    email: 'emily@example.com',
    phone: '+43 333 222 111',
    apartment: 'Studio',
    apartmentId: 2,
    checkIn: '2023-05-22', 
    checkOut: '2023-05-29', 
    status: 'cancelled', 
    total: 840,
    guests: 1,
    createdAt: '2023-04-28',
  },
  { 
    id: 5, 
    customer: 'Michael Wilson', 
    email: 'michael@example.com',
    phone: '+43 444 555 666',
    apartment: 'Family Apartment',
    apartmentId: 4,
    checkIn: '2023-06-01', 
    checkOut: '2023-06-07', 
    status: 'confirmed', 
    total: 1200,
    guests: 5,
    createdAt: '2023-05-01',
  },
  { 
    id: 6, 
    customer: 'Sarah Davis', 
    email: 'sarah@example.com',
    phone: '+43 777 888 999',
    apartment: 'Penthouse Suite',
    apartmentId: 6,
    checkIn: '2023-06-10', 
    checkOut: '2023-06-15', 
    status: 'pending', 
    total: 1850,
    guests: 2,
    createdAt: '2023-05-05',
  },
];

// Status options
const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' },
];

const Reservations: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // State for reservations
  const [reservations, setReservations] = useState(mockReservations);
  const [filteredReservations, setFilteredReservations] = useState(mockReservations);
  const [loading, setLoading] = useState(true);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [showFilters, setShowFilters] = useState(false);
  
  // State for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(null);
  
  // State for alerts
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  
  useEffect(() => {
    // Check authentication and admin status
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [isAuthenticated, user, navigate]);
  
  // Apply filters when search, status or date range changes
  useEffect(() => {
    let results = [...reservations];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (reservation) =>
          reservation.customer.toLowerCase().includes(query) ||
          reservation.email.toLowerCase().includes(query) ||
          reservation.phone.includes(query) ||
          reservation.apartment.toLowerCase().includes(query) ||
          reservation.id.toString().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter((reservation) => reservation.status === statusFilter);
    }
    
    // Apply date range filter
    if (dateRange[0] && dateRange[1]) {
      const startDate = new Date(dateRange[0]);
      const endDate = new Date(dateRange[1]);
      
      results = results.filter((reservation) => {
        const checkIn = new Date(reservation.checkIn);
        const checkOut = new Date(reservation.checkOut);
        
        return (
          (checkIn >= startDate && checkIn <= endDate) ||
          (checkOut >= startDate && checkOut <= endDate) ||
          (checkIn <= startDate && checkOut >= endDate)
        );
      });
    }
    
    setFilteredReservations(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, statusFilter, dateRange, reservations]);
  
  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReservations.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // Handle delete confirmation
  const handleDeleteClick = (id: number) => {
    setReservationToDelete(id);
    setShowDeleteModal(true);
  };
  
  // Handle actual deletion
  const handleDeleteConfirm = () => {
    if (reservationToDelete) {
      // Delete reservation
      const updatedReservations = reservations.filter(
        (reservation) => reservation.id !== reservationToDelete
      );
      setReservations(updatedReservations);
      
      // Show success alert
      setAlert({
        type: 'success',
        message: t('admin.reservations.deleteSuccess', 'Reservation deleted successfully'),
      });
      
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    }
    
    setShowDeleteModal(false);
    setReservationToDelete(null);
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateRange([null, null]);
    setShowFilters(false);
  };
  
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
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.reservations.title')}</h1>
          <p className="text-gray-500">{t('admin.reservations.subtitle')}</p>
        </div>
        
        <Button
          variant="primary"
          size="md"
          className="mt-3 sm:mt-0"
          onClick={() => navigate('/admin/reservations/create')}
        >
          {t('admin.reservations.createNew')}
        </Button>
      </div>
      
      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="mb-4"
          dismissible
        />
      )}
      
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder={t('admin.reservations.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<FaSearch />}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="mr-2" />
                {t('common.filters')}
              </Button>
              
              <Button
                variant="primary"
                onClick={() => {
                  // Refresh data
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                  }, 500);
                }}
              >
                {t('common.refresh')}
              </Button>
            </div>
          </div>
          
          {/* Advanced filters */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-4 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.reservations.filters.status')}
                  </label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(`admin.reservations.status.${option.value}`, option.label)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.reservations.filters.dateRange')}
                  </label>
                  <DateRangePicker
                    startDate={dateRange[0]}
                    endDate={dateRange[1]}
                    onChange={setDateRange}
                    startLabel=""
                    endLabel=""
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="mr-2"
                >
                  {t('common.reset')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  {t('common.apply')}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Reservations table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.reservations.table.id')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.reservations.table.customer')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.reservations.table.apartment')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.reservations.table.dates')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.reservations.table.status')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.reservations.table.total')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{reservation.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{reservation.customer}</div>
                      <div className="text-sm text-gray-500">{reservation.email}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {reservation.apartment}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-1 text-gray-400" />
                        <span>
                          {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeStyle(reservation.status)}`}>
                        {t(`admin.reservations.status.${reservation.status}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      €{reservation.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => navigate(`/admin/reservations/${reservation.id}`)}
                          title={t('common.view')}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="text-primary hover:text-primary-dark"
                          onClick={() => navigate(`/admin/reservations/${reservation.id}/edit`)}
                          title={t('common.edit')}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteClick(reservation.id)}
                          title={t('common.delete')}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    {t('admin.reservations.noReservations')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Pagination */}
      {filteredReservations.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredReservations.length / itemsPerPage)}
          onPageChange={handlePageChange}
          className="my-6"
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('admin.reservations.deleteModalTitle')}
      >
        <div className="p-4">
          <p className="mb-4">
            {t('admin.reservations.deleteConfirmation')}
          </p>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
            >
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Reservations;