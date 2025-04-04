import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaBed, FaUsers, FaWifi, FaSnowflake, FaUtensils, FaTv, FaParking, FaShower, FaCalendarAlt } from 'react-icons/fa';

// Mock apartments data - in a real app this would come from API
export const mockApartments = [
  {
    id: 1,
    name: 'Studio Apartment 1',
    type: 'Studio',
    description: 'A comfortable studio apartment with a beautiful view of the city. Perfect for solo travelers or couples.',
    price: 75,
    size: 35, // in sq meters
    maxGuests: 2,
    bedrooms: 0, // studio
    beds: 1,
    bathrooms: 1,
    available: true,
    amenities: ['wifi', 'ac', 'kitchen', 'tv', 'parking', 'shower'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80'
    ],
    rating: 4.7,
    reviewCount: 24
  },
  {
    id: 2,
    name: 'Studio Apartment 2',
    type: 'Studio',
    description: 'A modern studio apartment with all necessary amenities for a comfortable stay in Vienna.',
    price: 85,
    size: 40,
    maxGuests: 2,
    bedrooms: 0,
    beds: 1,
    bathrooms: 1,
    available: true,
    amenities: ['wifi', 'ac', 'kitchen', 'tv', 'parking', 'shower'],
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2344&q=80'
    ],
    rating: 4.5,
    reviewCount: 18
  },
  {
    id: 3,
    name: 'One Bedroom Apartment',
    type: 'One Bedroom',
    description: 'A spacious one-bedroom apartment with a separate living area, perfect for extended stays.',
    price: 95,
    size: 55,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    available: true,
    amenities: ['wifi', 'ac', 'kitchen', 'tv', 'parking', 'shower'],
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      'https://images.unsplash.com/photo-1491955478222-69ae25414368?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2158&q=80'
    ],
    rating: 4.8,
    reviewCount: 32
  }
];

// Get icon component based on amenity type
const getAmenityIcon = (amenity: string) => {
  switch (amenity) {
    case 'wifi':
      return <FaWifi />;
    case 'ac':
      return <FaSnowflake />;
    case 'kitchen':
      return <FaUtensils />;
    case 'tv':
      return <FaTv />;
    case 'parking':
      return <FaParking />;
    case 'shower':
      return <FaShower />;
    default:
      return null;
  }
};

// Helper to get amenity label
const getAmenityLabel = (amenity: string, t: any) => {
  switch (amenity) {
    case 'wifi':
      return t('apartment.wifi', 'Free WiFi');
    case 'ac':
      return t('apartment.ac', 'Air Conditioning');
    case 'kitchen':
      return t('apartment.kitchen', 'Fully Equipped Kitchen');
    case 'tv':
      return t('apartment.tv', 'Flat-screen TV');
    case 'parking':
      return t('apartment.parking', 'Free Parking');
    case 'shower':
      return t('apartment.shower', 'Modern Bathroom');
    default:
      return amenity;
  }
};

const ApartmentDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [apartment, setApartment] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  
  // Get apartment data
  useEffect(() => {
    if (id) {
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const foundApartment = mockApartments.find(a => a.id === parseInt(id));
        
        if (foundApartment) {
          setApartment(foundApartment);
        }
        
        setLoading(false);
      }, 500);
    }
  }, [id]);
  
  // Handle image navigation
  const nextImage = () => {
    if (apartment) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === apartment.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  
  const prevImage = () => {
    if (apartment) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? apartment.images.length - 1 : prevIndex - 1
      );
    }
  };
  
  // Handle reservation button click
  const handleReserve = () => {
    navigate(`/reservation?apartment=${apartment.id}`);
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }
  
  // Show not found message if apartment doesn't exist
  if (!apartment) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('apartment.notFound', 'Apartment Not Found')}</h1>
        <p className="text-gray-600 mb-8">{t('apartment.notFoundMessage', 'The apartment you are looking for does not exist.')}</p>
        <Link 
          to="/apartments" 
          className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded transition-colors"
        >
          {t('apartment.backToApartments', 'Back to All Apartments')}
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex mb-6 text-sm">
          <Link to="/" className="text-gray-500 hover:text-primary">{t('common.home', 'Home')}</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/apartments" className="text-gray-500 hover:text-primary">{t('common.apartments', 'Apartments')}</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800">{apartment.name}</span>
        </nav>
        
        {/* Apartment Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{apartment.name}</h1>
        <div className="flex items-center mb-8">
          <span className="bg-primary-light text-primary px-2 py-1 rounded text-sm font-medium mr-4">
            {apartment.type}
          </span>
          {apartment.rating && (
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="font-medium">{apartment.rating}</span>
              <span className="text-gray-500 ml-1">({apartment.reviewCount} {t('apartment.reviews', 'reviews')})</span>
            </div>
          )}
        </div>
        
        {/* Image Gallery */}
        <div className="mb-10 relative">
          <img 
            src={apartment.images[currentImageIndex]} 
            alt={`${apartment.name} - ${currentImageIndex + 1}`}
            className="w-full h-96 object-cover rounded-lg"
          />
          
          {apartment.images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <button 
                onClick={prevImage}
                className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              >
                &#10094;
              </button>
              <button 
                onClick={nextImage}
                className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              >
                &#10095;
              </button>
            </div>
          )}
          
          {apartment.images.length > 1 && (
            <div className="flex justify-center mt-4">
              {apartment.images.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 mx-1 rounded-full ${
                    index === currentImageIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Details */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('apartment.about', 'About This Apartment')}</h2>
              <p className="text-gray-700 mb-6">{apartment.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <FaUsers className="text-primary mr-2" />
                  <span>{t('apartment.maxGuests', 'Max Guests')}: {apartment.maxGuests}</span>
                </div>
                <div className="flex items-center">
                  <FaBed className="text-primary mr-2" />
                  <span>{t('apartment.bedrooms', 'Bedrooms')}: {apartment.bedrooms === 0 ? 'Studio' : apartment.bedrooms}</span>
                </div>
                <div className="flex items-center">
                  <FaBed className="text-primary mr-2" />
                  <span>{t('apartment.beds', 'Beds')}: {apartment.beds}</span>
                </div>
                <div className="flex items-center">
                  <FaShower className="text-primary mr-2" />
                  <span>{t('apartment.bathrooms', 'Bathrooms')}: {apartment.bathrooms}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-primary mr-2">⊡</span>
                  <span>{t('apartment.size', 'Size')}: {apartment.size} m²</span>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('apartment.amenities', 'Amenities')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apartment.amenities.map((amenity: string) => (
                  <div key={amenity} className="flex items-center">
                    <span className="text-primary mr-2">{getAmenityIcon(amenity)}</span>
                    <span>{getAmenityLabel(amenity, t)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Booking Widget */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="mb-4">
                <span className="text-2xl font-bold">€{apartment.price}</span>
                <span className="text-gray-600">/{t('apartment.night', 'night')}</span>
              </div>
              
              <div className="mb-4">
                <p className="text-green-600 flex items-center mb-2">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  {apartment.available 
                    ? t('apartment.available', 'Available for booking') 
                    : t('apartment.unavailable', 'Currently unavailable')}
                </p>
              </div>
              
              <button
                onClick={handleReserve}
                disabled={!apartment.available}
                className={`w-full py-3 px-4 rounded font-medium mb-4 ${
                  apartment.available 
                    ? 'bg-primary hover:bg-primary-dark text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {t('apartment.reserve', 'Reserve Now')}
              </button>
              
              <div className="text-center text-gray-500 text-sm">
                {t('apartment.noCharge', 'No charges will be made at this point')}
              </div>
              
              <hr className="my-6" />
              
              <div>
                <h3 className="font-semibold mb-2">{t('apartment.contactInfo', 'Contact Information')}</h3>
                <p className="text-gray-700 mb-4">
                  Phone: +43 1 234 5678<br />
                  Email: info@laaerberghotel.com
                </p>
                <Link 
                  to="/contact" 
                  className="text-primary hover:underline flex items-center"
                >
                  <FaCalendarAlt className="mr-2" />
                  {t('apartment.requestInfo', 'Request More Information')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetail;