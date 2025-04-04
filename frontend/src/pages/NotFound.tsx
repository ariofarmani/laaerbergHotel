import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-6">{t('notFound.title', 'Page Not Found')}</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          {t('notFound.message', "We're sorry, the page you requested could not be found. Please check the URL or go back to the homepage.")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded transition-colors"
          >
            {t('notFound.backHome', 'Back to Home')}
          </Link>
          <Link 
            to="/contact" 
            className="border border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-3 px-8 rounded transition-colors"
          >
            {t('notFound.contactUs', 'Contact Us')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;