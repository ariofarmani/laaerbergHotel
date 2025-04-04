import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUsers, FaBed, FaShower, FaSearch, FaArrowRight } from 'react-icons/fa';

// Import mock apartments data
import { mockApartments } from './ApartmentDetail';

const Apartments: React.FC = () => {
  const { t } = useTranslation();
  const [apartments, setApartments] = useState<any[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    search: '',
    guests: '',
    priceRange: ''
  });
  
  // Load apartments data
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setApartments(mockApartments);
      setFilteredApartments(mockApartments);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Apply filters whenever they change
  useEffect(() => {
    if (apartments.length === 0) return;
    
    let results = [...apartments];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(apartment => 
        apartment.name.toLowerCase().includes(searchLower) || 
        apartment.description.toLowerCase().includes(searchLower) ||
        apartment.type.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply guests filter
    if (filters.guests) {
      const guestsCount = parseInt(filters.guests);
      results = results.filter(apartment => apartment.maxGuests >= guestsCount);
    }
    
    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(p => parseInt(p));
      results = results.filter(apartment => {
        return apartment.price >= min && (max ? apartment.price <= max : true);
      });
    }
    
    setFilteredApartments(results);
  }, [filters, apartments]);
  
  // Handle filter input changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filters are already applied via the useEffect
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      search: '',
      guests: '',
      priceRange: ''
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">{t('apartments.title', 'Our Apartments')}</h1>
        <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
          {t('apartments.subtitle', 'Explore our comfortable and modern apartments in the heart of Vienna.')}
        </p>
        
        {/* Search & Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-10">
          <form onSubmit={handleSearchSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="search" className="block text-gray-700 mb-2">
                  {t('apartments.search', 'Search')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder={t('apartments.searchPlaceholder', 'Search by name or type...')}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary pl-10"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="guests" className="block text-gray-700 mb-2">
                  {t('apartments.guests', 'Guests')}
                </label>
                <select
                  id="guests"
                  name="guests"
                  value={filters.guests}
                  onChange={handleFilterChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">{t('apartments.anyGuests', 'Any')}</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="priceRange" className="block text-gray-700 mb-2">
                  {t('apartments.priceRange', 'Price Range')}
                </label>
                <select
                  id="priceRange"
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">{t('apartments.anyPrice', 'Any')}</option>
                  <option value="0-75">€0 - €75</option>
                  <option value="75-100">€75 - €100</option>
                  <option value="100-150">€100 - €150</option>
                  <option value="150">€150+</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={resetFilters}
                className="text-gray-600 hover:text-gray-800"
              >
                {t('apartments.resetFilters', 'Reset Filters')}
              </button>
              
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded transition-colors"
              >
                {t('apartments.search', 'Search')}
              </button>
            </div>
          </form>
        </div>
        
        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredApartments.length === 0 
              ? t('apartments.noResults', 'No apartments found matching your criteria.') 
              : t('apartments.resultsCount', '{{count}} apartments found', { count: filteredApartments.length })}
          </p>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Apartments grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredApartments.map(apartment => (
              <div key={apartment.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-transform hover:shadow-md">
                <Link to={`/apartments/${apartment.id}`}>
                  <img 
                    src={apartment.images[0]} 
                    alt={apartment.name}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold">
                      <Link to={`/apartments/${apartment.id}`} className="hover:text-primary transition-colors">
                        {apartment.name}
                      </Link>
                    </h2>
                    <span className="font-bold text-lg">€{apartment.price}</span>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <span className="inline-block bg-gray-100 rounded-full px-3 py-1 mr-2">
                      {apartment.type}
                    </span>
                    <span>{apartment.size} m²</span>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-2">{apartment.description}</p>
                  
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <FaUsers className="mr-1" />
                      <span>{apartment.maxGuests} {t('apartments.guests', 'Guests')}</span>
                    </div>
                    <div className="flex items-center">
                      <FaBed className="mr-1" />
                      <span>{apartment.beds} {t('apartments.beds', 'Beds')}</span>
                    </div>
                    <div className="flex items-center">
                      <FaShower className="mr-1" />
                      <span>{apartment.bathrooms} {t('apartments.baths', 'Baths')}</span>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/apartments/${apartment.id}`}
                    className="flex items-center justify-center w-full py-2 px-4 bg-primary-light text-primary rounded hover:bg-primary hover:text-white transition-colors"
                  >
                    {t('apartments.viewDetails', 'View Details')}
                    <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* No results message */}
        {!loading && filteredApartments.length === 0 && (
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">{t('apartments.noResults', 'No apartments found')}</h3>
            <p className="mt-1 text-gray-500">{t('apartments.tryDifferentFilters', 'Try different search criteria.')}</p>
            <div className="mt-6">
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none"
              >
                {t('apartments.resetFilters', 'Reset Filters')}
              </button>
            </div>
          </div>
        )}
        
        {/* Call to action */}
        <div className="text-center mt-12 mb-4">
          <p className="mb-4">{t('apartments.reservationHelp', 'Need help finding the perfect apartment?')}</p>
          <Link 
            to="/contact" 
            className="inline-block bg-gray-800 hover:bg-black text-white font-medium py-3 px-6 rounded transition-colors"
          >
            {t('apartments.contactUs', 'Contact Us')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Apartments;