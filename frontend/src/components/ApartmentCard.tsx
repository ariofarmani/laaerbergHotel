import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaBed, FaBath, FaRuler, FaUsers, FaStar } from 'react-icons/fa';
import Card from './Card';
import { Apartment } from '../utils/types';

interface ApartmentCardProps {
  apartment: Apartment;
  className?: string;
  showFullDetails?: boolean;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({
  apartment,
  className = '',
  showFullDetails = false,
}) => {
  const { t } = useTranslation();
  
  const {
    id,
    name,
    description,
    price,
    size,
    maxGuests,
    bedrooms,
    bathrooms,
    images,
    available,
    rating,
    reviewCount,
  } = apartment;
  
  // Format price with currency
  const formattedPrice = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
  
  return (
    <Card 
      className={`overflow-hidden transition-transform duration-300 hover:transform hover:-translate-y-1 ${className}`}
      padding="none"
      shadow="sm"
    >
      {/* Image */}
      <Link to={`/apartments/${id}`} className="block relative">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={images[0]} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {!available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="px-2 py-1 bg-red-500 text-white font-semibold rounded">
                {t('apartments.unavailable', 'Unavailable')}
              </span>
            </div>
          )}
          
          {rating && (
            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center shadow-md">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="font-medium">{rating.toFixed(1)}</span>
              {reviewCount && showFullDetails && (
                <span className="text-gray-500 text-sm ml-1">({reviewCount})</span>
              )}
            </div>
          )}
        </div>
      </Link>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/apartments/${id}`} className="inline-block">
            <h3 className="text-lg font-bold text-gray-900 hover:text-primary">{name}</h3>
          </Link>
          <div className="text-primary font-bold">{formattedPrice}<span className="text-gray-500 text-sm font-normal">/{t('common.night', 'night')}</span></div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        {/* Features */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <FaUsers className="mr-1" /> 
            <span>{maxGuests} {t('common.guests', 'guests')}</span>
          </div>
          
          <div className="flex items-center">
            <FaBed className="mr-1" /> 
            <span>{bedrooms} {bedrooms === 1 ? t('common.bedroom', 'bedroom') : t('common.bedrooms', 'bedrooms')}</span>
          </div>
          
          <div className="flex items-center">
            <FaBath className="mr-1" /> 
            <span>{bathrooms} {bathrooms === 1 ? t('common.bathroom', 'bathroom') : t('common.bathrooms', 'bathrooms')}</span>
          </div>
          
          <div className="flex items-center">
            <FaRuler className="mr-1" /> 
            <span>{size} m²</span>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex gap-2">
          <Link 
            to={`/apartments/${id}`}
            className="flex-1 py-2 px-4 text-center bg-white border border-primary text-primary rounded hover:bg-primary-light transition-colors"
          >
            {t('apartments.viewDetails', 'View Details')}
          </Link>
          
          {available && (
            <Link 
              to={`/reservation/${id}`}
              className="flex-1 py-2 px-4 text-center bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              {t('apartments.bookNow', 'Book Now')}
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ApartmentCard;