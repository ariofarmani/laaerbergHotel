import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaCheck, FaEnvelope, FaPrint, FaDownload, FaCalendarAlt, FaUsers, FaBed } from 'react-icons/fa';

import Card from '../../components/Card';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import Alert from '../../components/Alert';
import { formatCurrency, formatDate, calculateNights } from '../../utils/helpers';
import { api } from '../../utils/api';
import { mockGetApartmentById, mockGetReservationById } from '../../utils/mockApi';
import { shouldUseMockData } from '../../utils/mockData';

interface BookingConfirmationProps {}

const BookingConfirmation: React.FC<BookingConfirmationProps> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { reservationId } = useParams<{ reservationId: string }>();
  const location = useLocation();
  
  // Get reservation data either from location state or fetch it
  const reservationFromState = location.state?.reservation;
  
  // State
  const [loading, setLoading] = useState(!reservationFromState);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<any>(reservationFromState || null);
  const [apartment, setApartment] = useState<any>(null);
  
  // Fetch reservation and apartment details
  useEffect(() => {
    if (reservationFromState) {
      // If reservation is passed via location state, fetch apartment details
      fetchApartmentDetails(reservationFromState.apartmentId);
      return;
    }
    
    if (!reservationId) {
      setError(t('booking.confirmation.errors.missingId'));
      setLoading(false);
      return;
    }
    
    const fetchReservationDetails = async () => {
      try {
        let reservationData;
        
        if (shouldUseMockData()) {
          // Mock API call
          const mockResponse = await mockGetReservationById(parseInt(reservationId, 10));
          if (!mockResponse.success) {
            throw new Error(mockResponse.message);
          }
          reservationData = mockResponse.reservation;
        } else {
          // Real API call
          const response = await api.get(`/reservations/${reservationId}`);
          reservationData = response.data;
        }
        
        setReservation(reservationData);
        
        // Fetch apartment details
        fetchApartmentDetails(reservationData.apartmentId);
      } catch (err: any) {
        console.error('Error fetching reservation:', err);
        setError(t('booking.confirmation.errors.fetchFailed'));
        setLoading(false);
      }
    };
    
    fetchReservationDetails();
  }, [reservationId, reservationFromState, t]);
  
  // Fetch apartment details
  const fetchApartmentDetails = async (apartmentId: number) => {
    try {
      let apartmentData;
      
      if (shouldUseMockData()) {
        // Mock API call
        const mockResponse = await mockGetApartmentById(apartmentId);
        if (!mockResponse.success) {
          throw new Error(mockResponse.message);
        }
        apartmentData = mockResponse.apartment;
      } else {
        // Real API call
        const response = await api.get(`/apartments/${apartmentId}`);
        apartmentData = response.data;
      }
      
      setApartment(apartmentData);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching apartment:', err);
      setError(t('booking.confirmation.errors.apartmentFetchFailed'));
      setLoading(false);
    }
  };
  
  // Handle print
  const handlePrint = () => {
    window.print();
  };
  
  // Handle download PDF
  const handleDownloadPDF = () => {
    // In a real application, this would generate and download a PDF
    alert(t('booking.confirmation.pdfNotImplemented'));
  };
  
  // Handle send email
  const handleSendEmail = () => {
    // In a real application, this would send an email with the confirmation
    alert(t('booking.confirmation.emailNotImplemented'));
  };
  
  if (loading) {
    return <Loading />;
  }
  
  if (error || !reservation || !apartment) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert 
          type="error"
          title={t('booking.confirmation.errors.title')}
          message={error || t('booking.confirmation.errors.generic')}
        />
        <div className="mt-6 text-center">
          <Button
            variant="primary"
            onClick={() => navigate('/')}
          >
            {t('common.returnToHome')}
          </Button>
        </div>
      </div>
    );
  }
  
  // Calculate number of nights
  const checkIn = new Date(reservation.checkIn);
  const checkOut = new Date(reservation.checkOut);
  const nights = calculateNights(checkIn, checkOut);
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Success message */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <FaCheck className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t('booking.confirmation.title')}
        </h1>
        <p className="text-gray-600">
          {t('booking.confirmation.subtitle')}
        </p>
      </div>
      
      {/* Booking details card */}
      <Card className="mb-8 overflow-hidden" shadow="lg">
        <div className="bg-primary text-white p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h2 className="text-xl font-bold">{t('booking.confirmation.bookingDetails')}</h2>
              <p className="text-white text-opacity-90">
                {t('booking.confirmation.bookingNumber')}: <span className="font-semibold">#{reservation.id}</span>
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <p className="text-white text-opacity-90">{t('booking.confirmation.bookingDate')}:</p>
              <p className="font-semibold">{formatDate(reservation.createdAt)}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          {/* Apartment details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {apartment.name}
            </h3>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-gray-400" />
                <span>
                  {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
                </span>
              </div>
              <div className="flex items-center">
                <FaUsers className="mr-2 text-gray-400" />
                <span>
                  {reservation.guests} {reservation.guests === 1 ? t('common.guest') : t('common.guests')}
                </span>
              </div>
              <div className="flex items-center">
                <FaBed className="mr-2 text-gray-400" />
                <span>
                  {apartment.bedrooms === 0 ? 
                    t('common.studio') : 
                    `${apartment.bedrooms} ${apartment.bedrooms === 1 ? t('common.bedroom') : t('common.bedrooms')}`
                  }
                </span>
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <hr className="my-6 border-gray-200" />
          
          {/* Guest details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t('booking.confirmation.guestDetails')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">{t('common.name')}:</p>
                <p className="font-medium">{reservation.customer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('common.email')}:</p>
                <p className="font-medium">{reservation.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('common.phone')}:</p>
                <p className="font-medium">{reservation.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('common.address')}:</p>
                <p className="font-medium">{reservation.address || '-'}</p>
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <hr className="my-6 border-gray-200" />
          
          {/* Payment details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t('booking.confirmation.paymentDetails')}
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {apartment.price} × {nights} {nights === 1 ? t('common.night') : t('common.nights')}
                </span>
                <span className="font-medium">{formatCurrency(apartment.price * nights)}</span>
              </div>
              
              {reservation.extras && reservation.extras.length > 0 && (
                <>
                  {reservation.extras.map((extra: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">{extra.name}</span>
                      <span className="font-medium">{formatCurrency(extra.price)}</span>
                    </div>
                  ))}
                </>
              )}
              
              {reservation.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('booking.confirmation.discount')}</span>
                  <span className="font-medium text-green-600">-{formatCurrency(reservation.discount)}</span>
                </div>
              )}
              
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <span className="font-semibold">{t('booking.confirmation.total')}</span>
                <span className="font-bold text-lg">{formatCurrency(reservation.total)}</span>
              </div>
              
              <div className="flex justify-between mt-1">
                <span className="text-sm text-gray-500">{t('booking.confirmation.paymentStatus')}:</span>
                <span className={`text-sm font-medium ${
                  reservation.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {reservation.paymentStatus === 'paid' 
                    ? t('booking.confirmation.paid') 
                    : t('booking.confirmation.pending')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
        <Button 
          variant="outline" 
          className="flex items-center justify-center"
          onClick={handlePrint}
        >
          <FaPrint className="mr-2" />
          {t('booking.confirmation.actions.print')}
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center justify-center"
          onClick={handleDownloadPDF}
        >
          <FaDownload className="mr-2" />
          {t('booking.confirmation.actions.download')}
        </Button>
        <Button 
          variant="outline"
          className="flex items-center justify-center"
          onClick={handleSendEmail}
        >
          <FaEnvelope className="mr-2" />
          {t('booking.confirmation.actions.email')}
        </Button>
      </div>
      
      {/* Back button */}
      <div className="mt-8 text-center print:hidden">
        <Button
          variant="primary"
          onClick={() => navigate('/')}
        >
          {t('common.returnToHome')}
        </Button>
      </div>
      
      {/* Additional info */}
      <div className="mt-8 text-sm text-gray-500">
        <p className="mb-2">
          {t('booking.confirmation.info.questions')} <a href="/contact" className="text-primary hover:underline">{t('booking.confirmation.info.contactUs')}</a>.
        </p>
        <p className="mb-2">
          {t('booking.confirmation.info.checkInTime')}: <span className="font-medium">14:00</span>
        </p>
        <p>
          {t('booking.confirmation.info.checkOutTime')}: <span className="font-medium">11:00</span>
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmation;