import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaCheck } from 'react-icons/fa';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    error: null as string | null
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: true,
        success: false,
        error: t('contact.requiredFields', 'Please fill in all required fields.')
      });
      setLoading(false);
      return;
    }
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful form submission
      setFormStatus({
        submitted: true,
        success: true,
        error: null
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        error: t('contact.submitError', 'There was an error sending your message. Please try again.')
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12 mt-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">{t('contact.title', 'Contact Us')}</h1>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          {t('contact.subtitle', 'Have questions or need assistance? Get in touch with our team.')}
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">{t('contact.getInTouch', 'Get in Touch')}</h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="text-primary mt-1 mr-4">
                  <FaMapMarkerAlt size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">{t('contact.address', 'Address')}</h3>
                  <p className="text-gray-600">
                    Laaerberg Straße 22<br />
                    1100 Vienna, Austria
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-primary mt-1 mr-4">
                  <FaPhone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">{t('contact.phone', 'Phone')}</h3>
                  <p className="text-gray-600">
                    <a href="tel:+43123456789" className="hover:text-primary">+43 1 234 5678</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-primary mt-1 mr-4">
                  <FaEnvelope size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">{t('contact.email', 'Email')}</h3>
                  <p className="text-gray-600">
                    <a href="mailto:info@laaerberghotel.com" className="hover:text-primary">
                      info@laaerberghotel.com
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-primary mt-1 mr-4">
                  <FaClock size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">{t('contact.openingHours', 'Opening Hours')}</h3>
                  <p className="text-gray-600">
                    {t('contact.weekdays', 'Monday - Friday')}: 8:00 AM - 10:00 PM<br />
                    {t('contact.weekends', 'Saturday - Sunday')}: 9:00 AM - 9:00 PM
                  </p>
                </div>
              </div>
            </div>
            
            {/* Map */}
            <div className="bg-gray-200 h-64 rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2660.1927841405594!2d16.3795929!3d48.1728682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476da962fc6dc975%3A0xbb1e0e74df45fbe1!2sLaaer-Berg-Str%2C%201100%20Wien%2C%20Austria!5e0!3m2!1sen!2sus!4v1617444473036!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy"
                title="Laaerberg Apart Hotel Location"
              ></iframe>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">{t('contact.sendMessage', 'Send Us a Message')}</h2>
            
            {formStatus.submitted && formStatus.success ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('contact.messageSent', 'Message Sent!')}</h3>
                <p className="text-gray-700 mb-4">
                  {t('contact.thankYou', 'Thank you for reaching out. We will get back to you as soon as possible.')}
                </p>
                <button
                  onClick={() => setFormStatus({ submitted: false, success: false, error: null })}
                  className="text-primary font-medium"
                >
                  {t('contact.sendAnother', 'Send another message')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {formStatus.submitted && formStatus.error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
                    {formStatus.error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    {t('contact.name', 'Your Name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    {t('contact.emailAddress', 'Your Email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-gray-700 mb-2">
                    {t('contact.subject', 'Subject')}
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">{t('contact.selectSubject', 'Select a subject')}</option>
                    <option value="reservation">{t('contact.subjectReservation', 'Reservation Inquiry')}</option>
                    <option value="availability">{t('contact.subjectAvailability', 'Availability')}</option>
                    <option value="pricing">{t('contact.subjectPricing', 'Pricing & Offers')}</option>
                    <option value="feedback">{t('contact.subjectFeedback', 'Feedback')}</option>
                    <option value="other">{t('contact.subjectOther', 'Other')}</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-2">
                    {t('contact.message', 'Your Message')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded transition-colors ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? t('contact.sending', 'Sending...') : t('contact.send', 'Send Message')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;