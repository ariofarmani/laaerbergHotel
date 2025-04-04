import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaFilter, FaEdit, FaTrash, FaEye, FaBed, FaBath, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../utils/AuthContext';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';
import { formatCurrency } from '../../utils/helpers';
import { Apartment } from '../../utils/types';

// Mock data for apartments
const mockApartments: Apartment[] = [
  {
    id: 1,
    name: 'One Bedroom Apartment',
    description: 'Spacious apartment with a separate bedroom, living area and fully equipped kitchen.',
    price: 120,
    size: 45,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    available: true,
    amenities: ['wifi', 'kitchen', 'tv', 'ac', 'workspace', 'parking'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'],
    rating: 4.7,
    reviewCount: 23,
    mainImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  },
  {
    id: 2,
    name: 'Studio Apartment',
    description: 'Cozy studio with modern furnishings and all essential amenities for a comfortable stay.',
    price: 85,
    size: 30,
    maxGuests: 2,
    bedrooms: 0,
    bathrooms: 1,
    available: true,
    amenities: ['wifi', 'kitchen', 'tv', 'washer'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'],
    rating: 4.5,
    reviewCount: 15,
    mainImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  },
  {
    id: 3,
    name: 'Deluxe Studio',
    description: 'Premium studio with high-end furnishings, spacious layout and stunning city views.',
    price: 110,
    size: 40,
    maxGuests: 2,
    bedrooms: 0,
    bathrooms: 1,
    available: true,
    amenities: ['wifi', 'kitchen', 'tv', 'ac', 'workspace', 'view'],
    images: ['https://images.unsplash.com/photo-1630699144867-37acbe72f7f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'],
    rating: 4.8,
    reviewCount: 19,
    mainImage: 'https://images.unsplash.com/photo-1630699144867-37acbe72f7f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  },
  {
    id: 4,
    name: 'Family Apartment',
    description: 'Spacious two-bedroom apartment perfect for families, with a large living room and balcony.',
    price: 180,
    size: 75,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    available: true,
    amenities: ['wifi', 'kitchen', 'tv', 'ac', 'washer', 'balcony', 'parking'],
    images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'],
    rating: 4.9,
    reviewCount: 31,
    mainImage: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  },
  {
    id: 5,
    name: 'Luxury Suite',
    description: 'Our most luxurious option with premium amenities, dedicated workspace and stunning views.',
    price: 220,
    size: 65,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    available: true,
    amenities: ['wifi', 'kitchen', 'tv', 'ac', 'workspace', 'balcony', 'view', 'parking'],
    images: ['https://images.unsplash.com/photo-1631679706909-1844bbd07221?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'],
    rating: 5.0,
    reviewCount: 27,
    mainImage: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  },
  {
    id: 6,
    name: 'Penthouse Suite',
    description: 'Exclusive top-floor suite with panoramic city views, luxury furnishings and a private terrace.',
    price: 350,
    size: 100,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    available: false,
    amenities: ['wifi', 'kitchen', 'tv', 'ac', 'workspace', 'balcony', 'view', 'parking', 'gym'],
    images: ['https://images.unsplash.com/photo-1512918580421-b2feee3b85a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'],
    rating: 4.9,
    reviewCount: 12,
    mainImage: 'https://images.unsplash.com/photo-1512918580421-b2feee3b85a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  },
];

const Apartments: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // State for apartments
  const [apartments, setApartments] = useState<Apartment[]>(mockApartments);
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>(mockApartments);
  const [loading, setLoading] = useState(true);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [bedroomsFilter, setBedroomsFilter] = useState<string>('all');
  
  // State for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [apartmentToDelete, setApartmentToDelete] = useState<number | null>(null);
  
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
  
  // Apply filters when search or filters change
  useEffect(() => {
    let results = [...apartments];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (apartment) =>
          apartment.name.toLowerCase().includes(query) ||
          apartment.description.toLowerCase().includes(query) ||
          apartment.id.toString().includes(query)
      );
    }
    
    // Apply availability filter
    if (availabilityFilter !== 'all') {
      results = results.filter((apartment) => 
        availabilityFilter === 'available' ? apartment.available : !apartment.available
      );
    }
    
    // Apply price range filter
    results = results.filter(
      (apartment) => apartment.price >= priceRange[0] && apartment.price <= priceRange[1]
    );
    
    // Apply bedrooms filter
    if (bedroomsFilter !== 'all') {
      const bedrooms = parseInt(bedroomsFilter, 10);
      results = results.filter((apartment) => apartment.bedrooms === bedrooms);
    }
    
    setFilteredApartments(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, availabilityFilter, priceRange, bedroomsFilter, apartments]);
  
  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApartments.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // Handle delete confirmation
  const handleDeleteClick = (id: number) => {
    setApartmentToDelete(id);
    setShowDeleteModal(true);
  };
  
  // Handle actual deletion
  const handleDeleteConfirm = () => {
    if (apartmentToDelete) {
      // Delete apartment
      const updatedApartments = apartments.filter(
        (apartment) => apartment.id !== apartmentToDelete
      );
      setApartments(updatedApartments);
      
      // Show success alert
      setAlert({
        type: 'success',
        message: t('admin.apartments.deleteSuccess', 'Apartment deleted successfully'),
      });
      
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    }
    
    setShowDeleteModal(false);
    setApartmentToDelete(null);
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setAvailabilityFilter('all');
    setPriceRange([0, 500]);
    setBedroomsFilter('all');
    setShowFilters(false);
  };

  // Toggle apartment availability
  const toggleAvailability = (id: number) => {
    const updatedApartments = apartments.map(apartment => 
      apartment.id === id 
        ? { ...apartment, available: !apartment.available } 
        : apartment
    );
    setApartments(updatedApartments);
    
    // Show success alert
    setAlert({
      type: 'success',
      message: t('admin.apartments.availabilityUpdated', 'Apartment availability updated'),
    });
    
    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.apartments.title')}</h1>
          <p className="text-gray-500">{t('admin.apartments.subtitle')}</p>
        </div>
        
        <Button
          variant="primary"
          size="md"
          className="mt-3 sm:mt-0"
          onClick={() => navigate('/admin/apartments/create')}
        >
          {t('admin.apartments.createNew')}
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
                placeholder={t('admin.apartments.search')}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.apartments.filters.availability')}
                  </label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value as 'all' | 'available' | 'unavailable')}
                  >
                    <option value="all">{t('admin.apartments.filters.allAvailability')}</option>
                    <option value="available">{t('admin.apartments.filters.availableOnly')}</option>
                    <option value="unavailable">{t('admin.apartments.filters.unavailableOnly')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.apartments.filters.bedrooms')}
                  </label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    value={bedroomsFilter}
                    onChange={(e) => setBedroomsFilter(e.target.value)}
                  >
                    <option value="all">{t('admin.apartments.filters.allBedrooms')}</option>
                    <option value="0">{t('admin.apartments.filters.studio')}</option>
                    <option value="1">1 {t('common.bedroom')}</option>
                    <option value="2">2 {t('common.bedrooms')}</option>
                    <option value="3">3+ {t('common.bedrooms')}</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.apartments.filters.priceRange')} 
                    ({formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])})
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={0}
                      max={500}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value, 10), priceRange[1]])}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min={0}
                      max={500}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value, 10)])}
                      className="w-full"
                    />
                  </div>
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
      </Card>
      
      {/* Apartments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {currentItems.length > 0 ? (
          currentItems.map((apartment) => (
            <Card key={apartment.id} className="overflow-hidden">
              {/* Apartment Image */}
              <div className="relative h-48">
                <img
                  src={apartment.mainImage || apartment.images[0]}
                  alt={apartment.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-white font-semibold text-lg">{apartment.name}</h3>
                </div>
                <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded ${apartment.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {apartment.available ? t('admin.apartments.available') : t('admin.apartments.unavailable')}
                </div>
              </div>
              
              {/* Apartment Details */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-primary text-xl font-bold">
                    {formatCurrency(apartment.price)}
                    <span className="text-gray-500 text-sm font-normal">/{t('common.night')}</span>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <span className="text-sm font-medium mr-1">{apartment.rating}</span>
                    <span className="text-xs text-gray-500">({apartment.reviewCount})</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <FaUsers className="mr-1" size={14} />
                    <span>{apartment.maxGuests}</span>
                  </div>
                  <div className="flex items-center">
                    <FaBed className="mr-1" size={14} />
                    <span>{apartment.bedrooms === 0 ? t('common.studio') : apartment.bedrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <FaBath className="mr-1" size={14} />
                    <span>{apartment.bathrooms}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {apartment.description}
                </p>
                
                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/admin/apartments/${apartment.id}`)}
                  >
                    <FaEye className="mr-1" />
                    {t('common.view')}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/admin/apartments/${apartment.id}/edit`)}
                  >
                    <FaEdit className="mr-1" />
                    {t('common.edit')}
                  </Button>
                </div>
                
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={apartment.available ? 'outline' : 'secondary'}
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleAvailability(apartment.id)}
                  >
                    {apartment.available ? t('admin.apartments.markUnavailable') : t('admin.apartments.markAvailable')}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDeleteClick(apartment.id)}
                  >
                    <FaTrash className="mr-1" />
                    {t('common.delete')}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-3 p-8 text-center text-gray-500">
            {t('admin.apartments.noApartments')}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredApartments.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredApartments.length / itemsPerPage)}
          onPageChange={handlePageChange}
          className="my-6"
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('admin.apartments.deleteModalTitle')}
      >
        <div className="p-4">
          <p className="mb-4">
            {t('admin.apartments.deleteConfirmation')}
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

export default Apartments;