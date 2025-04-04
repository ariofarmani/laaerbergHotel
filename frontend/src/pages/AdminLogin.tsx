import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaLock, FaExclamationTriangle } from 'react-icons/fa';

// In a real app, this would be integrated with the authentication API
const mockLogin = (email: string, password: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock credentials for testing - in production, this would be handled by a backend API
      if (email === 'admin@laaerberghotel.com' && password === 'admin123') {
        localStorage.setItem('authToken', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify({ role: 'admin', email }));
        resolve(true);
      } else {
        resolve(false);
      }
    }, 800);
  });
};

const AdminLogin: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Login form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('admin.invalidEmail', 'Invalid email address'))
      .required(t('admin.emailRequired', 'Email is required')),
    password: Yup.string()
      .required(t('admin.passwordRequired', 'Password is required')),
  });
  
  // Login form initialization
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoginError(null);
      
      try {
        const success = await mockLogin(values.email, values.password);
        
        if (success) {
          navigate('/admin/dashboard');
        } else {
          setLoginError(t('admin.invalidCredentials', 'Invalid email or password'));
        }
      } catch (error) {
        setLoginError(t('admin.loginError', 'An error occurred during login. Please try again.'));
        console.error('Login error:', error);
      }
    },
  });
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary bg-opacity-10 mb-6">
            <FaLock className="text-4xl text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t('admin.loginTitle', 'Admin Login')}</h1>
          <p className="text-gray-600">
            {t('admin.loginSubtitle', 'Sign in to access the admin dashboard')}
          </p>
        </div>
        
        {loginError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            {loginError}
          </div>
        )}
        
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                {t('admin.email', 'Email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                  formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                {t('admin.password', 'Password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                  formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded transition-colors"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting 
                ? t('admin.loggingIn', 'Logging in...') 
                : t('admin.login', 'Login')}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              {t('admin.forgotPassword', 'Forgot your password?')} 
              <button className="ml-1 text-primary hover:text-primary-dark">
                {t('admin.resetPassword', 'Reset it here')}
              </button>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            {t('admin.loginHint', 'For demonstration purposes, use:')}
            <br />
            Email: admin@laaerberghotel.com
            <br />
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;