import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
  showIcon?: boolean;
  dismissible?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
  showIcon = true,
  dismissible = false,
}) => {
  // Alert type configurations
  const alertConfig = {
    success: {
      icon: <FaCheckCircle className="h-5 w-5" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
      iconColor: 'text-green-400',
    },
    error: {
      icon: <FaExclamationCircle className="h-5 w-5" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      iconColor: 'text-red-400',
    },
    warning: {
      icon: <FaExclamationTriangle className="h-5 w-5" />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-400',
    },
    info: {
      icon: <FaInfoCircle className="h-5 w-5" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-400',
    },
  };

  const config = alertConfig[type];

  return (
    <div
      className={`rounded-md p-4 border ${config.bgColor} ${config.borderColor} ${className}`}
      role="alert"
    >
      <div className="flex">
        {showIcon && (
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            {config.icon}
          </div>
        )}
        <div className={`${showIcon ? 'ml-3' : ''} flex-1`}>
          {title && (
            <h3 className={`text-sm font-medium ${config.textColor}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${config.textColor} ${title ? 'mt-2' : ''}`}>
            {message}
          </div>
        </div>
        {dismissible && onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 ${config.bgColor} ${config.textColor} hover:${config.bgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type}-50 focus:ring-${type}-500`}
                onClick={onClose}
              >
                <span className="sr-only">Dismiss</span>
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;