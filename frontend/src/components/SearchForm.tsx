import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaCalendarAlt, FaUsers } from 'react-icons/fa';

import Button from './Button';
import DateRangePicker from './DateRangePicker';
import Card from './Card';
import Input from './Input';
import { buildQueryString } from '../utils/helpers';

interface SearchFormProps {
  embedded?: boolean;
  className?: string;
  defaultValues?: {
    location?: string;
    checkIn?: Date | null;
    checkOut?: Date | null;
    guests?: number;
  };
  vertical?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  embedded = false,
  className = '',
  defaultValues = {},
  vertical = false,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // State for form fields
  const [location, setLocation] = useState(defaultValues.location || '');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    defaultValues.checkIn || null,
    defaultValues.checkOut || null,
  ]);
  const [guests, setGuests] = useState(defaultValues.guests || 1);
  
  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare query parameters
    const queryParams: Record<string, any> = {};
    
    if (location) {
      queryParams.location = location;
    }
    
    if (dateRange[0]) {
      queryParams.checkIn = dateRange[0].toISOString().split('T')[0];
    }
    
    if (dateRange[1]) {
      queryParams.checkOut = dateRange[1].toISOString().split('T')[0];
    }
    
    if (guests > 1) {
      queryParams.guests = guests;
    }
    
    // Navigate to search results with query parameters
    navigate(`/apartments${buildQueryString(queryParams)}`);
  };
  
  // Render the form
  const renderFormContent = () => (
    <>
      <div className={vertical ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-4 gap-4'}>
        {/* Location */}
        <div className={vertical ? '' : 'md:col-span-2'}>
          <Input
            label={t('searchForm.location')}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t('searchForm.locationPlaceholder')}
            leftIcon={<FaSearch />}
          />
        </div>
        
        {/* Date range */}
        <div className={vertical ? '' : 'md:col-span-1'}>
          <DateRangePicker
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={setDateRange}
            startLabel={t('searchForm.checkIn')}
            endLabel={t('searchForm.checkOut')}
            showIcon
          />
        </div>
        
        {/* Guests */}
        <div className={vertical ? '' : 'md:col-span-1'}>
          <Input
            label={t('searchForm.guests')}
            type="number"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
            min={1}
            max={10}
            leftIcon={<FaUsers />}
          />
        </div>
      </div>
      
      {/* Submit Button */}
      <div className={`${vertical ? 'mt-6' : 'mt-6 md:mt-8'} flex justify-center`}>
        <Button
          type="submit"
          size={vertical ? 'md' : 'lg'}
          className={`${vertical ? '' : 'px-8'}`}
          fullWidth={vertical}
        >
          <FaSearch className="mr-2" />
          {t('searchForm.search')}
        </Button>
      </div>
    </>
  );
  
  // If embedded, render inside a card
  if (embedded) {
    return (
      <Card className={`p-4 ${className}`}>
        <h2 className="text-xl font-bold mb-4">{t('searchForm.title')}</h2>
        <form onSubmit={handleSubmit}>
          {renderFormContent()}
        </form>
      </Card>
    );
  }
  
  // Otherwise, render with a background for the homepage
  return (
    <div className={`bg-gray-100 py-6 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t('searchForm.heroTitle')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('searchForm.heroSubtitle')}
          </p>
        </div>
        
        <Card shadow="lg" className="p-6">
          <form onSubmit={handleSubmit}>
            {renderFormContent()}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SearchForm;