import React from 'react';
import Card from './Card';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  color?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  className?: string;
  subtitle?: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  color = 'primary',
  className = '',
  subtitle,
  onClick,
}) => {
  // Color classes
  const colorClasses = {
    primary: {
      icon: 'bg-primary-light text-primary',
      change: {
        increase: 'text-green-600',
        decrease: 'text-red-600',
      },
    },
    success: {
      icon: 'bg-green-100 text-green-600',
      change: {
        increase: 'text-green-600',
        decrease: 'text-red-600',
      },
    },
    danger: {
      icon: 'bg-red-100 text-red-600',
      change: {
        increase: 'text-green-600',
        decrease: 'text-red-600',
      },
    },
    warning: {
      icon: 'bg-yellow-100 text-yellow-600',
      change: {
        increase: 'text-green-600',
        decrease: 'text-red-600',
      },
    },
    info: {
      icon: 'bg-blue-100 text-blue-600',
      change: {
        increase: 'text-green-600',
        decrease: 'text-red-600',
      },
    },
  };

  return (
    <Card 
      className={`${className} ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        {/* Icon */}
        <div className={`p-3 rounded-full ${colorClasses[color].icon}`}>
          {icon}
        </div>
        
        {/* Content */}
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            
            {/* Change indicator */}
            {change && (
              <p 
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  change.type === 'increase'
                    ? colorClasses[color].change.increase
                    : colorClasses[color].change.decrease
                }`}
              >
                {change.type === 'increase' ? (
                  <svg 
                    className="self-center flex-shrink-0 h-4 w-4 text-green-500"
                    fill="currentColor" 
                    viewBox="0 0 20 20" 
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                ) : (
                  <svg 
                    className="self-center flex-shrink-0 h-4 w-4 text-red-500"
                    fill="currentColor" 
                    viewBox="0 0 20 20" 
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                )}
                <span className="sr-only">
                  {change.type === 'increase' ? 'Increased by' : 'Decreased by'}
                </span>
                {Math.abs(change.value)}%
              </p>
            )}
          </div>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;