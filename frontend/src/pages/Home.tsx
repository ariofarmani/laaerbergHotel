import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCalendarAlt, FaUsers, FaSearch, FaStar, FaMapMarkerAlt, FaWifi, FaSnowflake, FaCoffee } from 'react-icons/fa';

// Import mock apartments for featured section
import { mockApartments } from './ApartmentDetail';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useState({
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    guests: 1
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/apartments');
  };
  
  // Select just a few apartments for the featured section
  const featuredApartments = mockApartments.slice(0, 3);
  
  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      text: 'Our stay at Laaerberg Apart Hotel was exceptional. The apartment was clean, modern, and had all the amenities we needed. The staff was friendly and responsive. Highly recommended!',
      rating: 5
    },
    {
      id: 2,
      name: 'Michael Thompson',
      avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
      text: 'Perfect location for exploring Vienna. The apartment was comfortable and well-equipped. We especially appreciated the kitchen facilities which made our extended stay much more convenient.',
      rating: 4
    },
    {
      id: 3,
      name: 'Emma Fischer',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      text: 'Fantastic service and great value for money. The apartment was spacious and perfectly located. Will definitely stay here again on my next visit to Vienna!',
      rating: 5
    }
  ];
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1576485375217-d6a95e34d043?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Vienna cityscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('home.heroTitle', 'Your Modern Home in Vienna')}</h1>
            <p className="text-xl md:text-2xl mb-8">
              {t('home.heroSubtitle', 'Experience comfortable, fully-equipped apartments for your perfect stay in Vienna.')}
            </p>
            <Link 
              to="/apartments" 
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block"
            >
              {t('home.exploreApartments', 'Explore Our Apartments')}
            </Link>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="bg-white py-8 -mt-20 relative z-20 shadow-lg rounded-lg max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('home.searchTitle', 'Find Your Perfect Apartment')}</h2>
        
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="checkIn" className="block text-gray-700 mb-2 flex items-center">
                <FaCalendarAlt className="mr-2 text-primary" />
                {t('home.checkIn', 'Check-in')}
              </label>
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                value={searchParams.checkIn}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="checkOut" className="block text-gray-700 mb-2 flex items-center">
                <FaCalendarAlt className="mr-2 text-primary" />
                {t('home.checkOut', 'Check-out')}
              </label>
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                value={searchParams.checkOut}
                onChange={handleChange}
                min={searchParams.checkIn}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="guests" className="block text-gray-700 mb-2 flex items-center">
              <FaUsers className="mr-2 text-primary" />
              {t('home.guests', 'Guests')}
            </label>
            <select
              id="guests"
              name="guests"
              value={searchParams.guests}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <FaSearch className="mr-2" />
              {t('home.search', 'Search')}
            </button>
          </div>
        </form>
      </section>
      
      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.aboutTitle', 'About Laaerberg Apart Hotel')}</h2>
            <p className="text-gray-600">
              {t('home.aboutText', 'Located in the vibrant 10th district of Vienna, Laaerberg Apart Hotel offers modern and comfortable accommodations for travelers seeking a home away from home. Our fully-equipped apartments provide the perfect base for exploring Vienna\'s rich culture and attractions.')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary-light rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.location', 'Prime Location')}</h3>
              <p className="text-gray-600">
                {t('home.locationText', 'Located in the 10th district with excellent public transport connections to the city center and major attractions.')}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary-light rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <FaWifi className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.amenities', 'Modern Amenities')}</h3>
              <p className="text-gray-600">
                {t('home.amenitiesText', 'All apartments feature free WiFi, fully-equipped kitchens, air conditioning, and flat-screen TVs for your comfort.')}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary-light rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <FaCoffee className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.service', 'Exceptional Service')}</h3>
              <p className="text-gray-600">
                {t('home.serviceText', 'Our dedicated team is available to assist you with any needs during your stay to ensure your experience is exceptional.')}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Apartments */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">{t('home.featuredTitle', 'Featured Apartments')}</h2>
            <Link 
              to="/apartments" 
              className="text-primary hover:text-primary-dark font-medium"
            >
              {t('home.viewAll', 'View All')} →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredApartments.map(apartment => (
              <div key={apartment.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Link to={`/apartments/${apartment.id}`}>
                  <img 
                    src={apartment.images[0]} 
                    alt={apartment.name}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">
                      <Link to={`/apartments/${apartment.id}`} className="hover:text-primary transition-colors">
                        {apartment.name}
                      </Link>
                    </h3>
                    <span className="font-bold">€{apartment.price}/night</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{apartment.description}</p>
                  
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <div>
                      <FaUsers className="inline mr-1" /> {apartment.maxGuests} guests
                    </div>
                    <div>
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      {apartment.available ? t('home.available', 'Available') : t('home.unavailable', 'Unavailable')}
                    </div>
                  </div>
                  
                  <Link 
                    to={`/apartments/${apartment.id}`}
                    className="block w-full py-2 text-center bg-primary-light text-primary rounded hover:bg-primary hover:text-white transition-colors"
                  >
                    {t('home.viewDetails', 'View Details')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('home.testimonials', 'What Our Guests Say')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < testimonial.rating ? "text-yellow-500" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">{t('home.ctaTitle', 'Ready to Book Your Stay?')}</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            {t('home.ctaText', 'Experience the comfort of Laaerberg Apart Hotel. Book now for the best rates and availability.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/apartments" 
              className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              {t('home.browseApartments', 'Browse Apartments')}
            </Link>
            <Link 
              to="/contact" 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              {t('home.contactUs', 'Contact Us')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;