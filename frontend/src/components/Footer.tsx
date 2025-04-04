import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-2">
                <span className="font-bold text-lg">L</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Laaerberg</h3>
                <p className="text-xs text-gray-400">Apart Hotel</p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-4">
              {t('footer.aboutText', 'Modern and comfortable apart hotel in Vienna offering fully equipped apartments for your perfect stay.')}
            </p>
            
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-primary transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-primary transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-primary transition-colors">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.quickLinks', 'Quick Links')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  {t('nav.home', 'Home')}
                </Link>
              </li>
              <li>
                <Link to="/apartments" className="text-gray-400 hover:text-white transition-colors">
                  {t('nav.apartments', 'Apartments')}
                </Link>
              </li>
              <li>
                <Link to="/reservation" className="text-gray-400 hover:text-white transition-colors">
                  {t('nav.reservation', 'Reservation')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  {t('nav.contact', 'Contact')}
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-gray-400 hover:text-white transition-colors">
                  {t('nav.adminLogin', 'Admin Login')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.contactInfo', 'Contact Info')}</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-primary mt-1 mr-2" />
                <span className="text-gray-400">
                  Laaerberg Straße 22<br />
                  1100 Vienna, Austria
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-primary mr-2" />
                <a href="tel:+43123456789" className="text-gray-400 hover:text-white transition-colors">
                  +43 1 234 5678
                </a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-primary mr-2" />
                <a href="mailto:info@laaerberghotel.com" className="text-gray-400 hover:text-white transition-colors">
                  info@laaerberghotel.com
                </a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.newsletter', 'Newsletter')}</h3>
            <p className="text-gray-400 mb-4">
              {t('footer.newsletterText', 'Subscribe to our newsletter for special offers and updates.')}
            </p>
            
            <form className="flex">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder', 'Your email')}
                className="px-4 py-2 flex-1 bg-gray-800 text-white border border-gray-700 rounded-l focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark transition-colors text-white px-4 py-2 rounded-r"
              >
                {t('footer.subscribe', 'Subscribe')}
              </button>
            </form>
          </div>
        </div>
        
        <hr className="border-gray-800 my-6" />
        
        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Laaerberg Apart Hotel. {t('footer.rightsReserved', 'All rights reserved.')}
          </p>
          
          <div className="flex space-x-4 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-white transition-colors">
              {t('footer.privacy', 'Privacy Policy')}
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              {t('footer.terms', 'Terms of Service')}
            </Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">
              {t('footer.sitemap', 'Sitemap')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;