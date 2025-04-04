import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCalendarAlt, FaUsers, FaBuilding, FaCreditCard, FaMoneyBill } from 'react-icons/fa';

// Mock apartments data
const mockApartments = [
  {
    id: 1,
    name: 'Studio Apartment 1',
    price: 75
  },
  {
    id: 2,
    name: 'Studio Apartment 2',
    price: 85
  },
  {
    id: 3,
    name: 'Studio Apartment 3',
    price: 95
  }
];

const Reservation: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const apartmentIdParam = searchParams.get('apartment');

  const [step, setStep] = useState(1);
  const [reservation, setReservation] = useState({
    apartmentId: apartmentIdParam ? parseInt(apartmentIdParam) : 0,
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    guests: 1,
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'paypal'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReservation(prev => ({
      ...prev,
      [name]: name === 'apartmentId' || name === 'guests' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const selectedApartment = mockApartments.find(apt => apt.id === reservation.apartmentId);
  
  const checkIn = new Date(reservation.checkIn);
  const checkOut = new Date(reservation.checkOut);
  const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)));
  const totalPrice = selectedApartment ? selectedApartment.price * nights : 0;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2 text-center">{t('reservation.title')}</h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
        {t('reservation.subtitle', 'Book your stay at Laaerberg Apart Hotel')}
      </p>

      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="flex justify-between mb-10">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`h-10 w-10 flex items-center justify-center rounded-full ${
              step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>1</div>
            <span className="mt-2">{t('reservation.checkAvailability')}</span>
          </div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`h-10 w-10 flex items-center justify-center rounded-full ${
              step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>2</div>
            <span className="mt-2">{t('reservation.guestDetails', 'Guest Details')}</span>
          </div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`h-10 w-10 flex items-center justify-center rounded-full ${
              step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>3</div>
            <span className="mt-2">{t('reservation.confirmation', 'Confirmation')}</span>
          </div>
        </div>

        {/* Step 1: Check Availability */}
        {step === 1 && (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6">{t('reservation.checkAvailability')}</h2>
            
            <div className="space-y-6 mb-8">
              <div>
                <label htmlFor="apartmentId" className="flex items-center text-gray-700 mb-2">
                  <FaBuilding className="mr-2 text-primary" />
                  {t('reservation.apartment')}
                </label>
                <select
                  id="apartmentId"
                  name="apartmentId"
                  value={reservation.apartmentId}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">{t('reservation.selectApartment', 'Select an apartment')}</option>
                  {mockApartments.map(apt => (
                    <option key={apt.id} value={apt.id}>{apt.name} - €{apt.price}/night</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="checkIn" className="flex items-center text-gray-700 mb-2">
                    <FaCalendarAlt className="mr-2 text-primary" />
                    {t('reservation.checkIn')}
                  </label>
                  <input
                    id="checkIn"
                    name="checkIn"
                    type="date"
                    value={reservation.checkIn}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="checkOut" className="flex items-center text-gray-700 mb-2">
                    <FaCalendarAlt className="mr-2 text-primary" />
                    {t('reservation.checkOut')}
                  </label>
                  <input
                    id="checkOut"
                    name="checkOut"
                    type="date"
                    value={reservation.checkOut}
                    onChange={handleChange}
                    min={reservation.checkIn}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="guests" className="flex items-center text-gray-700 mb-2">
                  <FaUsers className="mr-2 text-primary" />
                  {t('reservation.guests')}
                </label>
                <select
                  id="guests"
                  name="guests"
                  value={reservation.guests}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  {[1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {selectedApartment && (
              <div className="bg-gray-50 p-4 rounded mb-6">
                <h3 className="font-semibold mb-2">{t('reservation.stayDetails', 'Your stay:')}</h3>
                <p>{nights} {nights === 1 ? t('reservation.night', 'night') : t('reservation.nights', 'nights')}</p>
                <p className="font-bold mt-1">
                  {t('reservation.totalPrice', 'Total price:')} €{totalPrice}
                </p>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded transition-colors"
              disabled={!selectedApartment}
            >
              {t('reservation.continue', 'Continue')}
            </button>
          </form>
        )}

        {/* Step 2: Guest Details & Payment Method */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6">{t('reservation.guestDetails', 'Guest Details')}</h2>
            
            <div className="space-y-6 mb-8">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  {t('reservation.fullName', 'Full Name')}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={reservation.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  {t('reservation.email', 'Email')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={reservation.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-2">
                  {t('reservation.phone', 'Phone')}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={reservation.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-4">
              {t('reservation.paymentMethod', 'Payment Method')}
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <input
                  id="paypal"
                  name="paymentMethod"
                  type="radio"
                  value="paypal"
                  checked={reservation.paymentMethod === 'paypal'}
                  onChange={handleChange}
                  className="h-5 w-5 text-primary"
                />
                <label htmlFor="paypal" className="ml-3 flex items-center text-gray-700">
                  <FaCreditCard className="mr-2 text-primary" />
                  PayPal
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="creditCard"
                  name="paymentMethod"
                  type="radio"
                  value="creditCard"
                  checked={reservation.paymentMethod === 'creditCard'}
                  onChange={handleChange}
                  className="h-5 w-5 text-primary"
                />
                <label htmlFor="creditCard" className="ml-3 flex items-center text-gray-700">
                  <FaCreditCard className="mr-2 text-primary" />
                  {t('reservation.creditCard', 'Credit Card')}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="cash"
                  name="paymentMethod"
                  type="radio"
                  value="cash"
                  checked={reservation.paymentMethod === 'cash'}
                  onChange={handleChange}
                  className="h-5 w-5 text-primary"
                />
                <label htmlFor="cash" className="ml-3 flex items-center text-gray-700">
                  <FaMoneyBill className="mr-2 text-primary" />
                  {t('reservation.cash', 'Cash on Arrival')}
                </label>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded mb-6">
              <h3 className="font-semibold mb-2">{t('reservation.reservationDetails', 'Reservation Summary:')}</h3>
              <p>
                {selectedApartment?.name}, {nights} {nights === 1 ? t('reservation.night', 'night') : t('reservation.nights', 'nights')}
                <br />
                {t('reservation.checkIn')}: {reservation.checkIn}
                <br />
                {t('reservation.checkOut')}: {reservation.checkOut}
                <br />
                {t('reservation.guests')}: {reservation.guests}
              </p>
              <p className="font-bold mt-2">
                {t('reservation.totalPrice', 'Total price:')} €{totalPrice}
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-primary text-primary hover:bg-primary-light font-bold py-3 px-6 rounded transition-colors"
              >
                {t('common.back', 'Back')}
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded transition-colors"
              >
                {t('reservation.placeOrder', 'Place Order')}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="bg-green-50 rounded-full h-20 w-20 flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">
              {t('reservation.confirmed', 'Reservation Confirmed!')}
            </h2>
            
            <p className="text-gray-600 mb-8">
              {t('reservation.confirmationMessage', 'Thank you for your reservation. We have sent a confirmation to your email.')}
            </p>
            
            <div className="bg-gray-50 p-4 rounded mb-6 text-left">
              <h3 className="font-semibold mb-2">{t('reservation.reservationDetails', 'Reservation Summary:')}</h3>
              <p>
                <strong>{t('reservation.confirmationNumber', 'Confirmation Number')}:</strong> #REF{Math.floor(100000 + Math.random() * 900000)}
                <br />
                <strong>{t('reservation.guest', 'Guest')}:</strong> {reservation.name}
                <br />
                <strong>{t('reservation.apartment')}:</strong> {selectedApartment?.name}
                <br />
                <strong>{t('reservation.dates', 'Dates')}:</strong> {reservation.checkIn} to {reservation.checkOut} ({nights} {nights === 1 ? t('reservation.night', 'night') : t('reservation.nights', 'nights')})
                <br />
                <strong>{t('reservation.guests')}:</strong> {reservation.guests}
                <br />
                <strong>{t('reservation.paymentMethod', 'Payment Method')}:</strong> {reservation.paymentMethod === 'paypal' ? 'PayPal' : 
                  reservation.paymentMethod === 'creditCard' ? t('reservation.creditCard', 'Credit Card') : 
                  t('reservation.cash', 'Cash on Arrival')}
              </p>
              <p className="font-bold mt-2">
                {t('reservation.totalPrice', 'Total price:')} €{totalPrice}
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded transition-colors"
              >
                {t('common.home', 'Return to Home')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservation;